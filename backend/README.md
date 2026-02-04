# HRMS Backend - Django REST API with MongoDB Atlas

A production-ready Human Resource Management System backend built with Django, Django REST Framework, and MongoDB Atlas.

## 🚀 Tech Stack

- **Framework**: Django 4.2
- **API**: Django REST Framework
- **Database**: MongoDB Atlas (via djongo + pymongo)
- **Python**: 3.8+

## 📋 Prerequisites

- Python 3.8 or higher
- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
- pip (Python package manager)
- Virtual environment (recommended)

## 🔧 Local Development Setup

### 1. Create Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB Atlas credentials:

```env
MONGO_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGO_DB_NAME=hrms
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**To get your MongoDB Atlas URI:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster (if you haven't)
3. Click "Connect" → "Connect your application"
4. Copy the connection string and replace `<username>` and `<password>` with your credentials

### 4. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser (Optional)

To access Django admin panel:

```bash
python manage.py createsuperuser
```

### 6. Start Development Server

```bash
python manage.py runserver
```

The API will be available at: `http://localhost:8000`

## 📚 API Endpoints

### Employees

#### Create Employee
```http
POST /api/employees/create/
Content-Type: application/json

{
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john@example.com",
  "department": "Engineering"
}
```

#### Get All Employees
```http
GET /api/employees/
```

#### Delete Employee
```http
DELETE /api/employees/{id}/
```

### Attendance

#### Record Attendance
```http
POST /api/attendance/
Content-Type: application/json

{
  "employee_id": "EMP001",
  "date": "2026-02-04",
  "status": "Present"
}
```

#### Get Employee Attendance
```http
GET /api/attendance/{employee_id}/
```

#### Get All Attendance Records
```http
GET /api/attendance/all/
```

## 🗂️ Project Structure

```
backend/
│── manage.py                 # Django management script
│── requirements.txt          # Python dependencies
│── .env                      # Environment variables (not in git)
│── .env.example              # Template for environment variables
│
│── hrms/                     # Main project settings
│   ├── __init__.py
│   ├── settings.py           # Django settings with MongoDB config
│   ├── urls.py               # Root URL configuration
│   ├── wsgi.py               # WSGI application
│   └── asgi.py               # ASGI application
│
│── employees/                # Employees app
│   ├── models.py             # Employee model
│   ├── serializers.py        # DRF serializers with validation
│   ├── views.py              # API views
│   ├── urls.py               # App-specific URLs
│   └── admin.py              # Django admin configuration
│
└── attendance/               # Attendance app
    ├── models.py             # Attendance model
    ├── serializers.py        # DRF serializers with validation
    ├── views.py              # API views
    ├── urls.py               # App-specific URLs
    └── admin.py              # Django admin configuration
```

## 🔒 Data Validation

### Employee Model
- **employee_id**: Required, unique, max 50 chars
- **full_name**: Required, max 200 chars
- **email**: Required, unique, valid email format
- **department**: Required, max 100 chars

### Attendance Model
- **employee**: Required, must exist in database
- **date**: Required, valid date
- **status**: Required, must be "Present" or "Absent"
- **Constraint**: One attendance record per employee per date (prevents duplicates)

## ⚠️ Error Handling

The API returns proper HTTP status codes and JSON error messages:

- `200 OK` - Successful GET/DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation errors or duplicate entries
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server errors

## 🧪 Testing the API

### Using curl:

```bash
# Create an employee
curl -X POST http://localhost:8000/api/employees/create/ \
  -H "Content-Type: application/json" \
  -d '{"employee_id":"EMP001","full_name":"John Doe","email":"john@example.com","department":"Engineering"}'

# Get all employees
curl http://localhost:8000/api/employees/

# Record attendance
curl -X POST http://localhost:8000/api/attendance/ \
  -H "Content-Type: application/json" \
  -d '{"employee_id":"EMP001","date":"2026-02-04","status":"Present"}'

# Get employee attendance
curl http://localhost:8000/api/attendance/EMP001/
```

## 🔐 MongoDB Security

- Never commit `.env` file to version control
- Use strong passwords for MongoDB Atlas
- Whitelist your IP address in MongoDB Atlas Network Access
- Rotate credentials regularly
- Use environment-specific credentials for production

## 🚀 Production Deployment

### Deploy to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set the following:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn hrms.wsgi:application`
4. Add Environment Variables in Render dashboard:
   ```
   MONGO_URI=mongodb+srv://...
   MONGO_DB_NAME=hrms
   SECRET_KEY=your-strong-secret-key
   DEBUG=False
   ALLOWED_HOSTS=.render.com,your-domain.com
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```
5. Deploy!

### Deploy to Railway

1. Create new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Railway will auto-detect Django
4. Add Environment Variables in Railway dashboard:
   ```
   MONGO_URI=mongodb+srv://...
   MONGO_DB_NAME=hrms
   SECRET_KEY=your-strong-secret-key
   DEBUG=False
   ALLOWED_HOSTS=.railway.app,your-domain.com
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```
5. Deploy!

### General Production Checklist

- ✅ Set `DEBUG=False`
- ✅ Set strong `SECRET_KEY` (use `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)
- ✅ Configure `ALLOWED_HOSTS` with your domain
- ✅ Configure `CORS_ALLOWED_ORIGINS` with frontend domain
- ✅ Use HTTPS in production
- ✅ Whitelist deployment IP in MongoDB Atlas
- ✅ Set up monitoring and logging

## 📝 Notes

- This backend uses **djongo** to make Django work with MongoDB
- Data persists in MongoDB Atlas cloud
- Models use Django ORM but store data in MongoDB collections
- All validations are handled by Django REST Framework serializers
- Foreign keys and constraints are properly enforced

## 🐛 Troubleshooting

### Issue: "No module named 'djongo'"
```bash
pip install djongo==1.3.6 pymongo==3.12.3 sqlparse==0.2.4
```

### Issue: "Connection refused to MongoDB"
- Check your MongoDB Atlas connection string
- Verify your IP is whitelisted in MongoDB Atlas
- Ensure credentials are correct in `.env`

### Issue: "SECRET_KEY environment variable not set"
- Make sure `.env` file exists in backend directory
- Verify `python-dotenv` is installed
- Check that `.env` has `SECRET_KEY` set

## 📄 License

This project is built for educational/assessment purposes.

## 👥 Support

For issues or questions, please refer to the Django and MongoDB documentation:
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
