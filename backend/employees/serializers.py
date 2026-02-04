from rest_framework import serializers
from .models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
    """
    Serializer for Employee model with validation.
    """
    
    class Meta:
        model = Employee
        fields = ['id', 'employee_id', 'full_name', 'email', 'department', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_employee_id(self, value):
        """
        Validate that employee_id is not empty and follows a pattern.
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Employee ID cannot be empty.")
        return value.strip()

    def validate_full_name(self, value):
        """
        Validate that full_name is not empty.
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Full name cannot be empty.")
        return value.strip()

    def validate_email(self, value):
        """
        Validate email format and uniqueness.
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Email cannot be empty.")
        
        # Check uniqueness for updates
        if self.instance:
            if Employee.objects.exclude(pk=self.instance.pk).filter(email=value).exists():
                raise serializers.ValidationError("An employee with this email already exists.")
        
        return value.strip().lower()

    def validate_department(self, value):
        """
        Validate that department is not empty.
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Department cannot be empty.")
        return value.strip()
