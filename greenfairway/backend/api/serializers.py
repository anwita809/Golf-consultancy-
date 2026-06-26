from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Course, Assessment, CoursePhoto, Recommendation


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class CoursePhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoursePhoto
        fields = ['id', 'zone', 'image', 'uploaded_at']
        read_only_fields = ['uploaded_at']


class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = ['id', 'title', 'impact', 'estimated_cost', 'benefit', 'difficulty', 'order']


class AssessmentSerializer(serializers.ModelSerializer):
    photos = CoursePhotoSerializer(many=True, read_only=True)
    recommendations = RecommendationSerializer(many=True, read_only=True)

    class Meta:
        model = Assessment
        fields = [
            'id', 'course', 'created_at',
            'sprinkler_duration', 'water_source', 'irrigation_schedule', 'moisture_sensors',
            'chemical_frequency', 'pest_control_method', 'weed_severity', 'pest_severity',
            'species_observed',
            'mowing_frequency', 'team_size', 'energy_source', 'labour_availability',
            'sustainability_score', 'water_savings_pct', 'estimated_cost_saving_monthly',
            'biodiversity_risk', 'chemical_dependency', 'priority_recommendation',
            'photos', 'recommendations',
        ]
        read_only_fields = [
            'created_at', 'sustainability_score', 'water_savings_pct',
            'estimated_cost_saving_monthly', 'biodiversity_risk',
            'chemical_dependency', 'priority_recommendation',
        ]


class CourseSerializer(serializers.ModelSerializer):
    assessments = AssessmentSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'name', 'location', 'holes', 'created_at', 'updated_at', 'assessments']
        read_only_fields = ['created_at', 'updated_at']
