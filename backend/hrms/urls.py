"""
URL configuration for HRMS project.
"""
from django.contrib import admin
from django.urls import path, include
from attendance.views import dashboard_stats

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/employees/', include('employees.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/dashboard/', dashboard_stats, name='dashboard_stats'),
]
