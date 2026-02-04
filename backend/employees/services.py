"""
Employee service using MongoDB directly via pymongo.
Replaces Django ORM for MongoDB operations.
"""
from datetime import datetime
from bson import ObjectId
from hrms.mongodb import mongodb


class EmployeeService:
    """Service class for Employee operations using MongoDB."""
    
    COLLECTION_NAME = 'employees'

    @staticmethod
    def create(employee_data):
        """Create a new employee."""
        collection = mongodb.get_collection(EmployeeService.COLLECTION_NAME)
        
        # Check for duplicates
        if collection.find_one({'employee_id': employee_data['employee_id']}):
            raise ValueError('Employee with this employee_id already exists')
        
        if collection.find_one({'email': employee_data['email']}):
            raise ValueError('Employee with this email already exists')
        
        # Add timestamp
        employee_data['created_at'] = datetime.utcnow()
        
        # Insert and return
        result = collection.insert_one(employee_data)
        employee_data['id'] = str(result.inserted_id)
        employee_data['_id'] = str(result.inserted_id)
        
        return employee_data

    @staticmethod
    def get_all():
        """Get all employees."""
        collection = mongodb.get_collection(EmployeeService.COLLECTION_NAME)
        employees = list(collection.find().sort('created_at', -1))
        
        # Convert ObjectId to string and rename _id to id
        for emp in employees:
            emp['id'] = str(emp['_id'])
            emp.pop('_id', None)
            # Convert datetime to ISO string
            if 'created_at' in emp:
                emp['created_at'] = emp['created_at'].isoformat() + 'Z'
        
        return employees

    @staticmethod
    def get_by_id(employee_id):
        """Get employee by MongoDB _id."""
        collection = mongodb.get_collection(EmployeeService.COLLECTION_NAME)
        
        try:
            employee = collection.find_one({'_id': ObjectId(employee_id)})
        except:
            return None
        
        if employee:
            employee['id'] = str(employee['_id'])
            employee.pop('_id', None)
            if 'created_at' in employee:
                emp['created_at'] = employee['created_at'].isoformat() + 'Z'
        
        return employee

    @staticmethod
    def get_by_employee_id(employee_id):
        """Get employee by employee_id field."""
        collection = mongodb.get_collection(EmployeeService.COLLECTION_NAME)
        employee = collection.find_one({'employee_id': employee_id})
        
        if employee:
            employee['id'] = str(employee['_id'])
            employee.pop('_id', None)
            if 'created_at' in employee:
                employee['created_at'] = employee['created_at'].isoformat() + 'Z'
        
        return employee

    @staticmethod
    def delete(employee_id):
        """Delete employee by MongoDB _id."""
        collection = mongodb.get_collection(EmployeeService.COLLECTION_NAME)
        
        try:
            employee = EmployeeService.get_by_id(employee_id)
            if not employee:
                return None
            
            collection.delete_one({'_id': ObjectId(employee_id)})
            return employee
        except:
            return None

    @staticmethod
    def count():
        """Get total count of employees."""
        collection = mongodb.get_collection(EmployeeService.COLLECTION_NAME)
        return collection.count_documents({})
