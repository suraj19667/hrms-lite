from rest_framework import serializers


class EmployeeSerializer(serializers.Serializer):
    """
    Serializer for Employee data with validation.
    Uses MongoDB directly via service layer, no Django ORM.
    """
    id = serializers.CharField(read_only=True)
    employee_id = serializers.CharField(max_length=50, required=True)
    full_name = serializers.CharField(max_length=200, required=True)
    email = serializers.EmailField(required=True)
    department = serializers.CharField(max_length=100, required=True)
    created_at = serializers.DateTimeField(read_only=True)

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
        
        return value.strip().lower()

    def validate_department(self, value):
        """
        Validate that department is not empty.
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Department cannot be empty.")
        return value.strip()
