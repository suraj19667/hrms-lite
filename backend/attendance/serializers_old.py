from rest_framework import serializers


class AttendanceCreateSerializer(serializers.Serializer):
    """
    Serializer for creating attendance records (no Django ORM).
    """
    employee_id = serializers.CharField(
        max_length=50,
        required=True,
        help_text="Employee ID (e.g., EMP001)"
    )
    date = serializers.DateField(
        required=True,
        help_text="Attendance date in YYYY-MM-DD format"
    )
    status = serializers.ChoiceField(
        choices=['Present', 'Absent'],
        required=True,
        help_text="Attendance status"
    )

    def validate_employee_id(self, value):
        """Validate employee_id is provided."""
        if not value or not value.strip():
            raise serializers.ValidationError("Employee ID is required.")
        return value.strip()

    def validate_status(self, value):
        """Validate status is Present or Absent."""
        if value not in ['Present', 'Absent']:
            raise serializers.ValidationError("Status must be either 'Present' or 'Absent'.")
        return value
        
        return data


class AttendanceCreateSerializer(serializers.Serializer):
    """
    Serializer for creating attendance records.
    Accepts employee_id instead of employee object.
    """
    employee_id = serializers.CharField(max_length=50)
    date = serializers.DateField()
    status = serializers.ChoiceField(choices=['Present', 'Absent'])

    def validate_employee_id(self, value):
        """
        Validate that employee exists with the given employee_id.
        """
        try:
            employee = Employee.objects.get(employee_id=value)
            return employee
        except Employee.DoesNotExist:
            raise serializers.ValidationError(f"Employee with ID '{value}' not found.")

    def validate_status(self, value):
        """
        Validate status value.
        """
        if value not in ['Present', 'Absent']:
            raise serializers.ValidationError("Status must be either 'Present' or 'Absent'.")
        return value

    def validate(self, data):
        """
        Check for duplicate attendance.
        """
        employee = data.get('employee_id')  # This is now an Employee object from validate_employee_id
        date = data.get('date')
        
        if Attendance.objects.filter(employee=employee, date=date).exists():
            raise serializers.ValidationError(
                "Attendance record already exists for this employee on this date."
            )
        
        return data

    def create(self, validated_data):
        """
        Create attendance record.
        """
        employee = validated_data.pop('employee_id')  # Employee object
        return Attendance.objects.create(employee=employee, **validated_data)
