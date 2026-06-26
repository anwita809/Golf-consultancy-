from django.db import models
from django.contrib.auth.models import User


class Course(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses')
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)
    holes = models.PositiveIntegerField(default=18)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Assessment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assessments')
    created_at = models.DateTimeField(auto_now_add=True)

    WATER_SOURCE_CHOICES = [
        ('municipal', 'Municipal supply'),
        ('borewell', 'Borewell / groundwater'),
        ('recycled', 'Recycled greywater'),
        ('rainwater', 'Rainwater harvesting'),
    ]
    IRRIGATION_SCHEDULE_CHOICES = [
        ('early_morning', 'Early morning only'),
        ('morning_evening', 'Morning & evening'),
        ('continuous', 'Continuous cycles'),
        ('on_demand', 'On-demand / manual'),
    ]
    SENSOR_CHOICES = [
        ('none', 'None'),
        ('partial', 'Partial coverage'),
        ('full', 'Full coverage'),
    ]
    FREQUENCY_CHOICES = [
        ('weekly', 'Weekly'),
        ('biweekly', 'Every two weeks'),
        ('monthly', 'Monthly'),
        ('seasonal', 'Seasonal / as needed'),
    ]
    CONTROL_METHOD_CHOICES = [
        ('broad_spectrum', 'Broad-spectrum pesticides'),
        ('targeted', 'Targeted treatments'),
        ('biological', 'Biological control'),
        ('mixed', 'Mixed approach'),
    ]
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('moderate', 'Moderate'),
        ('high', 'High'),
        ('severe', 'Severe'),
    ]
    TEAM_SIZE_CHOICES = [
        ('1-5', '1–5'),
        ('6-12', '6–12'),
        ('13-25', '13–25'),
        ('25+', '25+'),
    ]
    ENERGY_SOURCE_CHOICES = [
        ('petrol_diesel', 'Petrol / diesel'),
        ('mixed', 'Mixed fleet'),
        ('electric', 'Electric'),
        ('hybrid', 'Hybrid'),
    ]
    LABOUR_CHOICES = [
        ('limited', 'Limited'),
        ('adequate', 'Adequate'),
        ('seasonal', 'Seasonal shortage'),
    ]

    sprinkler_duration = models.PositiveIntegerField(default=45, help_text='Minutes per zone')
    water_source = models.CharField(max_length=50, choices=WATER_SOURCE_CHOICES, blank=True)
    irrigation_schedule = models.CharField(max_length=50, choices=IRRIGATION_SCHEDULE_CHOICES, blank=True)
    moisture_sensors = models.CharField(max_length=20, choices=SENSOR_CHOICES, blank=True)

    chemical_frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, blank=True)
    pest_control_method = models.CharField(max_length=30, choices=CONTROL_METHOD_CHOICES, blank=True)
    weed_severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, blank=True)
    pest_severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, blank=True)

    species_observed = models.JSONField(default=list, blank=True)

    mowing_frequency = models.PositiveIntegerField(default=4, help_text='Times per week')
    team_size = models.CharField(max_length=10, choices=TEAM_SIZE_CHOICES, blank=True)
    energy_source = models.CharField(max_length=20, choices=ENERGY_SOURCE_CHOICES, blank=True)
    labour_availability = models.CharField(max_length=20, choices=LABOUR_CHOICES, blank=True)

    sustainability_score = models.PositiveIntegerField(null=True, blank=True)
    water_savings_pct = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    estimated_cost_saving_monthly = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    biodiversity_risk = models.CharField(max_length=20, blank=True)
    chemical_dependency = models.CharField(max_length=20, blank=True)
    priority_recommendation = models.TextField(blank=True)

    def __str__(self):
        return f'Assessment for {self.course.name} on {self.created_at.date()}'


class CoursePhoto(models.Model):
    ZONE_CHOICES = [
        ('greens', 'Greens'),
        ('water_body', 'Water body'),
        ('rough_patch', 'Rough patch'),
        ('pest_zone', 'Pest zone'),
        ('other', 'Other'),
    ]
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='photos')
    zone = models.CharField(max_length=20, choices=ZONE_CHOICES, default='other')
    image = models.ImageField(upload_to='course_photos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.zone} photo for {self.assessment}'


class Recommendation(models.Model):
    IMPACT_CHOICES = [('high', 'High'), ('medium', 'Medium'), ('low', 'Low')]
    DIFFICULTY_CHOICES = [('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')]

    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='recommendations')
    title = models.TextField()
    impact = models.CharField(max_length=10, choices=IMPACT_CHOICES)
    estimated_cost = models.CharField(max_length=100)
    benefit = models.TextField()
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title[:60]
