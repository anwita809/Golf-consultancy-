from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'courses', views.CourseViewSet, basename='course')
router.register(r'assessments', views.AssessmentViewSet, basename='assessment')

urlpatterns = [
    path('auth/register/', views.register),
    path('auth/login/', views.login),
    path('auth/logout/', views.logout),
    path('auth/me/', views.me),
    path('assessments/<int:assessment_id>/photos/', views.upload_photo),
    path('sample-report/', views.sample_report),
    path('', include(router.urls)),
]
