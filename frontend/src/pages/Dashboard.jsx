import { useState, useEffect } from 'react';
import { employeeAPI, attendanceAPI } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalEmployees: 0,
        presentToday: 0,
        absentToday: 0,
        attendanceRate: 0,
    });

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Get today's date in YYYY-MM-DD format
            const today = new Date().toISOString().split('T')[0];

            // Fetch employees and today's attendance
            const [employeesRes, attendanceRes] = await Promise.all([
                employeeAPI.getAll(),
                attendanceAPI.getAll(today),
            ]);

            const totalEmployees = employeesRes.data.length;
            const presentToday = attendanceRes.data.filter(
                (record) => record.status === 'Present'
            ).length;
            const absentToday = attendanceRes.data.filter(
                (record) => record.status === 'Absent'
            ).length;

            const attendanceRate = totalEmployees > 0
                ? ((presentToday / totalEmployees) * 100).toFixed(1)
                : 0;

            setStats({
                totalEmployees,
                presentToday,
                absentToday,
                attendanceRate,
            });
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return <LoadingSpinner message="Loading dashboard..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={fetchDashboardData} />;
    }

    const StatCard = ({ title, value, icon, color }) => (
        <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                </div>
                <div className="text-4xl">{icon}</div>
            </div>
        </div>
    );

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-gray-600 mt-2">Overview of your HR management system</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Employees"
                    value={stats.totalEmployees}
                    icon="👥"
                    color="border-blue-500"
                />
                <StatCard
                    title="Present Today"
                    value={stats.presentToday}
                    icon="✅"
                    color="border-green-500"
                />
                <StatCard
                    title="Absent Today"
                    value={stats.absentToday}
                    icon="❌"
                    color="border-red-500"
                />
                <StatCard
                    title="Attendance Rate"
                    value={`${stats.attendanceRate}%`}
                    icon="📊"
                    color="border-purple-500"
                />
            </div>

            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Welcome to HRMS Lite
                </h3>
                <p className="text-gray-600 mb-4">
                    Manage your employees and track attendance with ease. Use the navigation menu to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>View and manage employee records</li>
                    <li>Mark daily attendance</li>
                    <li>Track attendance history</li>
                    <li>Generate reports and statistics</li>
                </ul>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Last updated: {new Date().toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
