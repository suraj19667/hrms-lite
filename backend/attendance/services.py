"""
Attendance service using MongoDB directly via pymongo.
Replaces Django ORM for MongoDB operations.
"""
from datetime import datetime
from bson import ObjectId
from hrms.mongodb import mongodb
from employees.services import EmployeeService


class AttendanceService:
    """Service class for Attendance operations using MongoDB."""
    
    COLLECTION_NAME = 'attendance'

    @staticmethod
    def create(attendance_data):
        """Create a new attendance record."""
        collection = mongodb.get_collection(AttendanceService.COLLECTION_NAME)
        
        # Get employee by employee_id
        employee = EmployeeService.get_by_employee_id(attendance_data['employee_id'])
        if not employee:
            raise ValueError(f"Employee with ID '{attendance_data['employee_id']}' not found")
        
        # Convert date to string for MongoDB storage
        date_str = attendance_data['date'].isoformat() if hasattr(attendance_data['date'], 'isoformat') else str(attendance_data['date'])
        
        # Check for duplicate (same employee, same date)
        existing = collection.find_one({
            'employee_id': attendance_data['employee_id'],
            'date': date_str
        })
        
        if existing:
            raise ValueError('Attendance record already exists for this employee on this date')
        
        # Prepare document
        doc = {
            'employee_id': attendance_data['employee_id'],
            'employee_name': employee['full_name'],
            'employee_email': employee['email'],
            'employee_department': employee['department'],
            'date': date_str,
            'status': attendance_data['status'],
            'created_at': datetime.utcnow()
        }
        
        # Insert and return
        result = collection.insert_one(doc)
        doc['id'] = str(result.inserted_id)
        doc.pop('_id', None)
        doc['created_at'] = doc['created_at'].isoformat() + 'Z'
        
        # Format response with employee object
        response = {
            'id': doc['id'],
            'employee': {
                'id': employee['id'],
                'employee_id': employee['employee_id'],
                'full_name': employee['full_name'],
                'email': employee['email'],
                'department': employee['department']
            },
            'date': doc['date'],
            'status': doc['status'],
            'created_at': doc['created_at']
        }
        
        return response

    @staticmethod
    def get_all(date_filter=None):
        """Get all attendance records, optionally filtered by date."""
        collection = mongodb.get_collection(AttendanceService.COLLECTION_NAME)
        
        query = {}
        if date_filter:
            query['date'] = date_filter
        
        records = list(collection.find(query).sort('date', -1))
        
        # Format records
        formatted_records = []
        for record in records:
            formatted = {
                'id': str(record['_id']),
                'employee': {
                    'id': record.get('employee_id'),
                    'employee_id': record.get('employee_id'),
                    'full_name': record.get('employee_name'),
                    'email': record.get('employee_email'),
                    'department': record.get('employee_department')
                },
                'date': record.get('date'),
                'status': record.get('status'),
                'created_at': record['created_at'].isoformat() + 'Z' if isinstance(record.get('created_at'), datetime) else record.get('created_at')
            }
            formatted_records.append(formatted)
        
        return formatted_records

    @staticmethod
    def get_by_employee(employee_id):
        """Get all attendance records for a specific employee."""
        collection = mongodb.get_collection(AttendanceService.COLLECTION_NAME)
        
        # Verify employee exists
        employee = EmployeeService.get_by_employee_id(employee_id)
        if not employee:
            raise ValueError(f"Employee with ID '{employee_id}' not found")
        
        records = list(collection.find({'employee_id': employee_id}).sort('date', -1))
        
        # Format records
        formatted_records = []
        for record in records:
            formatted = {
                'id': str(record['_id']),
                'employee': {
                    'id': employee['id'],
                    'employee_id': employee['employee_id'],
                    'full_name': employee['full_name'],
                    'email': employee['email'],
                    'department': employee['department']
                },
                'date': record.get('date'),
                'status': record.get('status'),
                'created_at': record['created_at'].isoformat() + 'Z' if isinstance(record.get('created_at'), datetime) else record.get('created_at')
            }
            formatted_records.append(formatted)
        
        return {
            'employee_id': employee['employee_id'],
            'full_name': employee['full_name'],
            'count': len(formatted_records),
            'attendance': formatted_records
        }

    @staticmethod
    def count_by_status(date, status):
        """Count attendance records by date and status."""
        collection = mongodb.get_collection(AttendanceService.COLLECTION_NAME)
        return collection.count_documents({'date': date, 'status': status})
