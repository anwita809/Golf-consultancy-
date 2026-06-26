from django.contrib import admin
from .models import Course, Assessment, CoursePhoto, Recommendation

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'holes', 'location', 'created_at']
    list_filter = ['holes']
    search_fields = ['name', 'owner__username']

@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ['course', 'sustainability_score', 'biodiversity_risk', 'chemical_dependency', 'created_at']
    list_filter = ['biodiversity_risk', 'chemical_dependency']
    readonly_fields = ['sustainability_score', 'water_savings_pct', 'estimated_cost_saving_monthly',
                       'biodiversity_risk', 'chemical_dependency', 'priority_recommendation']

@admin.register(CoursePhoto)
class CoursePhotoAdmin(admin.ModelAdmin):
    list_display = ['assessment', 'zone', 'uploaded_at']

@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    list_display = ['title', 'impact', 'difficulty', 'assessment']
    list_filter = ['impact', 'difficulty']
