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
