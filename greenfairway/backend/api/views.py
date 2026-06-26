from django.contrib.auth import authenticate
from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .models import Course, Assessment, CoursePhoto, Recommendation
from .serializers import (
    RegisterSerializer, UserSerializer,
    CourseSerializer, AssessmentSerializer, CoursePhotoSerializer, RecommendationSerializer
)
from .scoring import compute_score, generate_recommendations


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user': UserSerializer(user).data})
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    return Response({'detail': 'Logged out'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user).data)


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Course.objects.filter(owner=self.request.user).prefetch_related('assessments')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class AssessmentViewSet(viewsets.ModelViewSet):
    serializer_class = AssessmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Assessment.objects.filter(
            course__owner=self.request.user
        ).prefetch_related('photos', 'recommendations')

    def perform_create(self, serializer):
        assessment = serializer.save()
        self._run_scoring(assessment)

    def perform_update(self, serializer):
        assessment = serializer.save()
        self._run_scoring(assessment)

    def _run_scoring(self, assessment):
        scores = compute_score(assessment)
        for field, value in scores.items():
            setattr(assessment, field, value)
        assessment.save(update_fields=list(scores.keys()))

        assessment.recommendations.all().delete()
        recs = generate_recommendations(assessment)
        for rec in recs:
            Recommendation.objects.create(assessment=assessment, **rec)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_photo(request, assessment_id):
    try:
        assessment = Assessment.objects.get(id=assessment_id, course__owner=request.user)
    except Assessment.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = CoursePhotoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(assessment=assessment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def sample_report(request):
    return Response({
        'before': {'score': 62, 'water_use': '100%', 'chemical_load': 'High', 'biodiversity_risk': 'Medium', 'monthly_cost': 'Baseline'},
        'after': {'score': 84, 'water_use': '-28%', 'chemical_load': 'Low', 'biodiversity_risk': 'Low', 'monthly_cost': '-₹1.8L'},
        'recommendations': [
            {'title': 'Reduce sprinkler runtime by 18% in shaded zones', 'impact': 'High', 'estimated_cost': '₹0 (config)', 'benefit': '~9% total water saved', 'difficulty': 'Easy'},
            {'title': 'Replace broad-spectrum pesticides with targeted biological control', 'impact': 'High', 'estimated_cost': '₹45,000', 'benefit': 'Healthier soil & pollinators', 'difficulty': 'Medium'},
            {'title': 'Add bee-safe flowering buffer zones away from play areas', 'impact': 'Medium', 'estimated_cost': '₹28,000', 'benefit': 'Restored pollinator habitat', 'difficulty': 'Easy'},
            {'title': 'Introduce moisture sensors for fairway irrigation', 'impact': 'High', 'estimated_cost': '₹1,20,000', 'benefit': '~19% irrigation efficiency', 'difficulty': 'Medium'},
            {'title': 'Shift mowing schedules to protect ground-nesting species', 'impact': 'Medium', 'estimated_cost': '₹0 (schedule)', 'benefit': 'Lower energy + nest safety', 'difficulty': 'Easy'},
        ],
    })
