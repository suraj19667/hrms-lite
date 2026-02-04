import { useState, useEffect } from 'react';
import { employeeAPI, attendanceAPI } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const Attendance = () => {
    const [employees, setEmployees] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [filterDate, setFilterDate] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');

    const [formData, setFormData] = useState({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [employeesRes, attendanceRes] = await Promise.all([
                employeeAPI.getAll(),
                attendanceAPI.getAll(filterDate || null),
            ]);

            setEmployees(employeesRes.data);
            setAttendanceRecords(attendanceRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filterDate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: null });
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.employee_id) {
            errors.employee_id = 'Please select an employee';
        }

        if (!formData.date) {
            errors.date = 'Date is required';
        }

        if (!formData.status) {
            errors.status = 'Status is required';
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
            await attendanceAPI.mark(formData);
            setFormData({
                employee_id: '',
                date: new Date().toISOString().split('T')[0],
                status: 'Present',
            });
            setShowForm(false);
            fetchData();
        } catch (err) {
            console.error('Error marking attendance:', err);
            if (err.response?.data) {
                const errorData = err.response.data;
                if (errorData.error) {
                    setFormErrors({ general: errorData.error });
                } else {
                    setFormErrors(errorData);
                }
            } else {
                setFormErrors({ general: 'Failed to mark attendance. Please try again.' });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleEmployeeFilter = async (employeeId) => {
        setSelectedEmployee(employeeId);

        if (!employeeId) {
            fetchData();
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await attendanceAPI.getByEmployee(employeeId, filterDate || null);
            // Backend returns { employee: {...}, attendance_records: [...] }
            const records = response.data.attendance_records || [];
            setAttendanceRecords(records);
        } catch (err) {
            console.error('Error fetching attendance:', err);
            setError('Failed to load attendance records. Please try again.');
            setAttendanceRecords([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'Present') {
            return (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Present
                </span>
            );
        }
        return (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                Absent
            </span>
        );
    };

    if (loading && !employees.length) {
        return <LoadingSpinner message="Loading attendance..." />;
    }

    return (
        <div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Attendance</h2>
                    <p className="text-gray-600 mt-2">Track and manage attendance records</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    {showForm ? 'Cancel' : '+ Mark Attendance'}
                </button>
            </div>

            {error && (
                <div className="mb-6">
                    <ErrorMessage message={error} onRetry={fetchData} />
                </div>
            )}

            {/* Mark Attendance Form */}
            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Mark Attendance</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Employee *
                                </label>
                                <select
                                    name="employee_id"
                                    value={formData.employee_id}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.employee_id ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.employee_id}>
                                            {emp.employee_id} - {emp.full_name}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.employee_id && (
                                    <p className="text-red-600 text-sm mt-1">{formErrors.employee_id}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.date ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {formErrors.date && (
                                    <p className="text-red-600 text-sm mt-1">{formErrors.date}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status *
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.status ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                </select>
                                {formErrors.status && (
                                    <p className="text-red-600 text-sm mt-1">{formErrors.status}</p>
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
                                {submitting ? 'Submitting...' : 'Mark Attendance'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filter by Employee
                        </label>
                        <select
                            value={selectedEmployee}
                            onChange={(e) => handleEmployeeFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Employees</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.employee_id}>
                                    {emp.employee_id} - {emp.full_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filter by Date
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {filterDate && (
                                <button
                                    onClick={() => setFilterDate('')}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance Records */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="p-8">
                        <LoadingSpinner message="Loading records..." />
                    </div>
                ) : attendanceRecords.length === 0 ? (
                    <EmptyState message="No attendance records found. Mark attendance to get started!" icon="📅" />
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
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {attendanceRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {record.employee?.employee_id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {record.employee?.full_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(record.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {getStatusBadge(record.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {attendanceRecords.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                    Total Records: {attendanceRecords.length}
                </div>
            )}
        </div>
    );
};

export default Attendance;
