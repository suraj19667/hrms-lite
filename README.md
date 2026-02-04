# HRMS Lite - HR Management System

A modern, full-stack HRMS (Human Resource Management System) Lite application for managing employees and tracking attendance.

## 🚀 Tech Stack

### Backend
- **Django 4.2.9** - Python web framework
- **Django REST Framework 3.14.0** - RESTful API toolkit
- **Django CORS Headers** - Cross-Origin Resource Sharing support
- **SQLite** - Database (included with Python)
- **Gunicorn** - Production WSGI server

### Frontend
- **React 18** - UI library
- **Vite 5** - Build tool and dev server
- **React Router DOM 6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS 3** - Utility-first CSS framework

## 📋 Features

### Employee Management
- ✅ Add new employees with validation
- ✅ View all employees in a table
- ✅ Delete employees
- ✅ Unique employee ID and email validation
- ✅ Email format validation
- ✅ Real-time form validation

### Attendance Management
- ✅ Mark daily attendance (Present/Absent)
- ✅ View all attendance records
- ✅ Filter by employee
- ✅ Filter by date
- ✅ Prevent duplicate attendance entries
- ✅ Track attendance statistics

### Dashboard
- ✅ Total employees count
- ✅ Present today count
- ✅ Absent today count
- ✅ Attendance rate percentage

### UI/UX
- ✅ Professional, clean design
- ✅ Responsive layout (mobile-friendly)
- ✅ Loading states
- ✅ Error handling with user-friendly messages
- ✅ Empty states
- ✅ Form validation feedback

## 🏗️ Project Structure

```
Ethara/
│
├── backend/                  # Django Backend
│   ├── hrms/                # Main project settings
│   │   ├── __init__.py
│   │   ├── settings.py      # Django settings with CORS
│   │   ├── urls.py          # Main URL configuration
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   ├── employees/           # Employee app
│   │   ├── models.py        # Employee model
│   │   ├── serializers.py   # DRF serializers
│   │   ├── views.py         # API views
│   │   ├── urls.py          # App URLs
│   │   ├── admin.py         # Admin configuration
│   │   └── tests.py         # Unit tests
│   │
│   ├── attendance/          # Attendance app
│   │   ├── models.py        # Attendance model
│   │   ├── serializers.py   # DRF serializers
│   │   ├── views.py         # API views
│   │   ├── urls.py          # App URLs
│   │   ├── admin.py         # Admin configuration
│   │   └── tests.py         # Unit tests
│   │
│   ├── manage.py            # Django management script
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Environment variables
│   └── .env.example         # Example environment file
│
└── frontend/                # React Frontend
    ├── src/
    │   ├── api/             # API integration
    │   │   └── api.js       # Axios API calls
    │   ├── components/      # Reusable components
    │   │   ├── Layout.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   ├── ErrorMessage.jsx
    │   │   └── EmptyState.jsx
    │   ├── pages/           # Main pages
    │   │   ├── Dashboard.jsx
    │   │   ├── Employees.jsx
    │   │   └── Attendance.jsx
    │   ├── App.jsx          # Main app component
    │   ├── main.jsx         # Entry point
    │   └── index.css        # Global styles
    │
    ├── index.html           # HTML template
    ├── package.json         # Node dependencies
    ├── vite.config.js       # Vite configuration
    ├── tailwind.config.js   # Tailwind configuration
    ├── .env                 # Environment variables
    └── .env.example         # Example environment file
```

## 🔧 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   
   # Windows
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings if needed
   ```

5. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser (optional, for admin panel):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run development server:**
   ```bash
   python manage.py runserver
   ```
   Backend will be available at: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env to set VITE_API_BASE_URL if needed
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```
   Frontend will be available at: `http://localhost:5173`

## 📡 API Endpoints

### Employees
- `GET /api/employees/` - List all employees
- `POST /api/employees/` - Create new employee
- `DELETE /api/employees/{id}/` - Delete employee

### Attendance
- `POST /api/attendance/` - Mark attendance
- `GET /api/attendance/all/` - Get all attendance records (optional: ?date=YYYY-MM-DD)
- `GET /api/attendance/{employee_id}/` - Get attendance for specific employee (optional: ?date=YYYY-MM-DD)

### Request/Response Examples

**Create Employee:**
```json
POST /api/employees/
{
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john@example.com",
  "department": "Engineering"
}
```

**Mark Attendance:**
```json
POST /api/attendance/
{
  "employee_id": "EMP001",
  "date": "2026-02-04",
  "status": "Present"
}
```

## 🔒 HTTP Status Codes

- `200 OK` - Successful GET/DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation error
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate entry

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend (Manual Testing)
1. Start both backend and frontend servers
2. Test employee CRUD operations
3. Test attendance marking and filtering
4. Verify validation and error handling

## 📦 Production Deployment

### Backend
```bash
# Set environment variables
export DEBUG=False
export SECRET_KEY=your-secret-key
export ALLOWED_HOSTS=yourdomain.com

# Collect static files
python manage.py collectstatic

# Run with Gunicorn
gunicorn hrms.wsgi:application --bind 0.0.0.0:8000
```

### Frontend
```bash
# Build for production
npm run build

# The dist/ folder contains production-ready files
# Deploy to your hosting service (Vercel, Netlify, etc.)
```

## ⚙️ Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
```

## 🎯 Key Features & Validation

### Employee Validation
- Unique employee_id (database constraint)
- Unique email (database constraint)
- Email format validation
- Required fields: employee_id, full_name, email, department
- Trimming whitespace

### Attendance Validation
- Employee must exist
- One attendance record per employee per date (unique constraint)
- Valid status: Present or Absent
- Date validation

### Error Handling
- Meaningful error messages
- Proper HTTP status codes
- Form validation feedback
- Network error handling
- Empty state messages

## 🌟 Assumptions & Limitations

### Assumptions
1. Single-tenant application (one organization)
2. No authentication/authorization required
3. Simple Present/Absent status (no half-day, leave types, etc.)
4. SQLite database (suitable for small-scale use)
5. No employee update functionality (delete and recreate)
6. No attendance update/delete (immutable records)

### Limitations
1. No user authentication system
2. No role-based access control
3. No advanced reporting/analytics
4. No bulk operations
5. No export functionality (CSV, PDF)
6. No notifications/alerts
7. No employee photos/documents
8. No payroll integration
9. Limited to basic CRUD operations
10. SQLite not recommended for high-traffic production

## 🔮 Future Enhancements

- User authentication and authorization
- Employee profile updates
- Advanced attendance features (leave management, overtime)
- Reporting and analytics dashboard
- Export to CSV/PDF
- Email notifications
- Department management
- Role-based permissions
- Multi-tenant support
- PostgreSQL/MySQL support

## 🐛 Troubleshooting

### Backend Issues
- **Port already in use:** Change port in `python manage.py runserver 8001`
- **Database locked:** Close other connections to SQLite
- **CORS errors:** Verify CORS_ALLOWED_ORIGINS in settings.py

### Frontend Issues
- **API connection failed:** Check VITE_API_BASE_URL in .env
- **Build errors:** Delete node_modules and run `npm install` again
- **Styling issues:** Run `npm run build` to regenerate Tailwind styles

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Developer Notes

- Clean, commented, production-quality code
- RESTful API design principles
- Component-based React architecture
- Responsive design with Tailwind CSS
- Proper error handling at all levels
- Loading and empty states for better UX

---

**Built with ❤️ using Django & React**
