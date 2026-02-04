from django.contrib import admin
from .models import Attendance


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    """
    Admin interface for Attendance model.
    """
    list_display = ['employee', 'date', 'status', 'created_at']
    list_filter = ['status', 'date', 'created_at']
    search_fields = ['employee__employee_id', 'employee__full_name', 'date']
    readonly_fields = ['created_at']
    ordering = ['-date', 'employee']
    date_hierarchy = 'date'
