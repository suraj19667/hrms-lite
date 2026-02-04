from django.db import models
from django.utils import timezone


class Employee(models.Model):
    """
    Employee model for HRMS system.
    Stores employee information in MongoDB via djongo.
    """
    employee_id = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        help_text="Unique employee identifier"
    )
    full_name = models.CharField(
        max_length=200,
        help_text="Employee's full name"
    )
    email = models.EmailField(
        unique=True,
        db_index=True,
        help_text="Employee's email address"
    )
    department = models.CharField(
        max_length=100,
        help_text="Department name"
    )
    created_at = models.DateTimeField(
        default=timezone.now,
        help_text="Record creation timestamp"
    )

    class Meta:
        managed = False  # Don't create table in SQLite - using MongoDB
        db_table = 'employees'
        ordering = ['-created_at']
        verbose_name = 'Employee'
        verbose_name_plural = 'Employees'

    def __str__(self):
        return f"{self.employee_id} - {self.full_name}"
