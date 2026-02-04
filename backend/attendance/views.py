from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import AttendanceCreateSerializer
from .services import AttendanceService


@api_view(['POST'])
def create_attendance(request):
    """
    Create a new attendance record.
    
    POST /api/attendance/
    Body: {
        "employee_id": "EMP001",
        "date": "2026-02-04",
        "status": "Present"
    }
    """
    serializer = AttendanceCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            attendance = AttendanceService.create(serializer.validated_data)
            return Response(
                {
                    "message": "Attendance recorded successfully",
                    "attendance": attendance
                },
                status=status.HTTP_201_CREATED
            )
        except ValueError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST if 'already exists' in str(e) else status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to create attendance record: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return Response(
        {"error": "Validation failed", "details": serializer.errors},
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['GET'])
def get_employee_attendance(request, employee_id):
    """
    Get all attendance records for a specific employee.
    
    GET /api/attendance/{employee_id}/
    """
    try:
        result = AttendanceService.get_by_employee(employee_id)
        return Response(result, status=status.HTTP_200_OK)
    except ValueError as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": f"Failed to retrieve attendance: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def list_all_attendance(request):
    """
    Get all attendance records.
    
    GET /api/attendance/all/
    Returns array of attendance records directly (not nested in object)
    Supports optional date filter via query parameter
    """
    try:
        # Get optional date filter from query params
        date_filter = request.query_params.get('date', None)
        
        attendance_records = AttendanceService.get_all(date_filter)
        
        # Return array directly for frontend compatibility
        return Response(attendance_records, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": f"Failed to retrieve attendance: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
