from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializers import EmployeeSerializer
from .services import EmployeeService


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])  # Disable authentication for this endpoint
def employee_list_create(request):
    """
    Handle both GET and POST requests for employees.
    
    GET /api/employees/ - Get all employees
    POST /api/employees/ - Create a new employee
    """
    if request.method == 'GET':
        try:
            employees = EmployeeService.get_all()
            return Response(employees, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": f"Failed to fetch employees: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    elif request.method == 'POST':
        serializer = EmployeeSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                employee = EmployeeService.create(serializer.validated_data)
                return Response(
                    {
                        "message": "Employee created successfully",
                        "employee": employee
                    },
                    status=status.HTTP_201_CREATED
                )
            except ValueError as e:
                error_message = str(e)
                if 'employee_id' in error_message.lower():
                    return Response(
                        {"error": "An employee with this employee ID already exists."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                elif 'email' in error_message.lower():
                    return Response(
                        {"error": "An employee with this email already exists."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                else:
                    return Response(
                        {"error": str(e)},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except Exception as e:
                return Response(
                    {"error": f"Failed to create employee: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(
            {"error": "Validation failed", "details": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['DELETE'])
@permission_classes([AllowAny])  # Disable authentication for this endpoint
def delete_employee(request, employee_id):
    """
    Delete an employee by ID.
    
    DELETE /api/employees/{id}/
    """
    try:
        employee = EmployeeService.delete(employee_id)
        
        if not employee:
            return Response(
                {"error": "Employee not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response(
            {
                "message": "Employee deleted successfully",
                "employee": employee
            },
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {"error": f"Failed to delete employee: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        return Response(
            {"error": f"Failed to delete employee: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
