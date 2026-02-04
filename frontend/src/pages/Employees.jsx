import { useState, useEffect } from 'react';
import { employeeAPI } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const fetchEmployees = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await employeeAPI.getAll();
            setEmployees(response.data);
        } catch (err) {
            console.error('Error fetching employees:', err);
            setError('Failed to load employees. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: null });
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.employee_id.trim()) {
            errors.employee_id = 'Employee ID is required';
        }

        if (!formData.full_name.trim()) {
            errors.full_name = 'Full name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.department.trim()) {
            errors.department = 'Department is required';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setSubmitting(true);
        setFormErrors({});

        try {
            await employeeAPI.create(formData);
            // Reset form and refresh list
            setFormData({
                employee_id: '',
                full_name: '',
                email: '',
                department: '',
            });
            setShowForm(false);
            fetchEmployees();
        } catch (err) {
            console.error('Error creating employee:', err);
            if (err.response?.data) {
                setFormErrors(err.response.data);
            } else {
                setFormErrors({ general: 'Failed to create employee. Please try again.' });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, employeeId) => {
        if (!window.confirm(`Are you sure you want to delete employee ${employeeId}?`)) {
            return;
        }

        try {
            await employeeAPI.delete(id);
            fetchEmployees();
        } catch (err) {
            console.error('Error deleting employee:', err);
            alert('Failed to delete employee. Please try again.');
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading employees..." />;
    }

    return (
        <div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Employees</h2>
                    <p className="text-gray-600 mt-2">Manage employee records</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    {showForm ? 'Cancel' : '+ Add Employee'}
                </button>
            </div>

            {error && (
                <div className="mb-6">
                    <ErrorMessage message={error} onRetry={fetchEmployees} />
                </div>
            )}

            {/* Add Employee Form */}
            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Employee</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Employee ID *
                                </label>
                                <input
                                    type="text"
                                    name="employee_id"
                                    value={formData.employee_id}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.employee_id ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="EMP001"
                                />
                                {formErrors.employee_id && (
                                    <p className="text-red-600 text-sm mt-1">{formErrors.employee_id}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.full_name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="John Doe"
                                />
                                {formErrors.full_name && (
                                    <p className="text-red-600 text-sm mt-1">{formErrors.full_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="john@example.com"
                                />
                                {formErrors.email && (
                                    <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department *
                                </label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.department ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Engineering"
                                />
                                {formErrors.department && (
                                    <p className="text-red-600 text-sm mt-1">{formErrors.department}</p>
                                )}
                            </div>
                        </div>

                        {formErrors.general && (
                            <p className="text-red-600 text-sm">{formErrors.general}</p>
                        )}

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setFormErrors({});
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                            >
                                {submitting ? 'Adding...' : 'Add Employee'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Employee List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {employees.length === 0 ? (
                    <EmptyState message="No employees found. Add your first employee to get started!" icon="👤" />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Employee ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Department
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created At
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {employees.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {employee.employee_id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {employee.full_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {employee.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {employee.department}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(employee.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleDelete(employee.id, employee.employee_id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {employees.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                    Total Employees: {employees.length}
                </div>
            )}
        </div>
    );
};

export default Employees;
