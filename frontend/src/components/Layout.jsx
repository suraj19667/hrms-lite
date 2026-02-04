import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const navLinkClass = (path) => {
        const baseClass = "px-4 py-2 rounded-lg transition-colors duration-200";
        return isActive(path)
            ? `${baseClass} bg-blue-600 text-white`
            : `${baseClass} text-gray-700 hover:bg-blue-50`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">HRMS Lite</h1>
                            <span className="ml-3 text-sm text-gray-500">HR Management System</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-4 py-3">
                        <Link to="/" className={navLinkClass('/')}>
                            Dashboard
                        </Link>
                        <Link to="/employees" className={navLinkClass('/employees')}>
                            Employees
                        </Link>
                        <Link to="/attendance" className={navLinkClass('/attendance')}>
                            Attendance
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <p className="text-center text-sm text-gray-500">
                        © 2026 HRMS Lite. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
