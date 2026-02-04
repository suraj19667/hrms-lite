from django.db import models
from django.utils import timezone
from employees.models import Employee


class Attendance(models.Model):
    """
    Attendance model for tracking employee attendance.
    Stores attendance records in MongoDB via djongo.
    Prevents duplicate entries for same employee on same date.
    """
    
    STATUS_CHOICES = [
        ('Present', 'Present'),
        ('Absent', 'Absent'),
    ]
    
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name='attendances',
        help_text="Reference to the employee"
    )
    date = models.DateField(
        help_text="Attendance date"
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        help_text="Attendance status (Present/Absent)"
    )
    created_at = models.DateTimeField(
        default=timezone.now,
        help_text="Record creation timestamp"
    )

    class Meta:
        managed = False  # Don't create table in SQLite - using MongoDB
        db_table = 'attendance'
        ordering = ['-date', 'employee']
        verbose_name = 'Attendance'
        verbose_name_plural = 'Attendance Records'
        # Ensure one attendance record per employee per date
        unique_together = [['employee', 'date']]

    def __str__(self):
        return f"{self.employee.employee_id} - {self.date} - {self.status}"
