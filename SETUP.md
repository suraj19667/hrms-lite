# 🚀 HRMS Lite - Quick Setup Guide

## Overview
HRMS Lite is a Human Resources Management System with:
- **Frontend:** React + Vite (deployed on Vercel)
- **Backend:** Django + DRF (deployed on Render)
- **Database:** MongoDB Atlas

---

## 📦 Local Development Setup

### Prerequisites
- Python 3.9+
- Node.js 16+
- MongoDB Atlas account

### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB connection string
# MONGO_URI=your_mongodb_connection_string
# MONGO_DB_NAME=hrms

# Run migrations (for Django admin/auth)
python manage.py migrate

# Run development server
python manage.py runserver
```

Backend will run at: `http://localhost:8000`

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
# VITE_API_BASE_URL=http://localhost:8000

# Run development server
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## 🌐 Production Deployment

### Step 1: Deploy Backend to Render

1. **Create Web Service** on Render
2. **Connect GitHub repository**
3. **Configure:**
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && gunicorn hrms.wsgi:application`
   - Root Directory: Leave blank or set to `backend`

4. **Add Environment Variables:**
   ```
   SECRET_KEY=<generate-random-secret-key>
   DEBUG=False
   ALLOWED_HOSTS=hrms-lite-zhj6.onrender.com
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   MONGO_DB_NAME=hrms
   CORS_ALLOWED_ORIGINS=https://hrms-lite-nine-gamma.vercel.app
   ```

5. **Deploy**

### Step 2: Configure MongoDB Atlas

1. Go to **Network Access**
2. Add IP Address: `0.0.0.0/0` (allow all - required for Render)
3. Verify database user has read/write permissions

### Step 3: Deploy Frontend to Vercel

1. **Import Project** from GitHub
2. **Configure:**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variable:**
   ```
   VITE_API_BASE_URL=https://hrms-lite-zhj6.onrender.com
   ```

4. **Deploy**

---

## ✅ Verification

After deployment, test:

1. **Open Frontend URL**
   - Visit: `https://hrms-lite-nine-gamma.vercel.app`
   - Dashboard should load

2. **Test Employee Creation**
   - Click "Add Employee"
   - Fill form and submit
   - Employee should appear in list
   - Check browser console (F12) - no errors

3. **Verify in MongoDB Atlas**
   - Browse Collections
   - Check `employees` collection
   - New employee should be there

---

## 🐛 Common Issues

### CORS Error
**Solution:** Check `CORS_ALLOWED_ORIGINS` in Render matches your Vercel URL exactly

### 403 Forbidden
**Solution:** Verify all views have `@permission_classes([AllowAny])` decorator

### Can't Connect to MongoDB
**Solution:** Check MongoDB Atlas Network Access allows `0.0.0.0/0`

### Frontend Can't Reach Backend
**Solution:** Verify `VITE_API_BASE_URL` in Vercel environment variables

---

## 📁 Project Structure

```
Ethara/
├── backend/
│   ├── hrms/                 # Django project settings
│   │   ├── settings.py       # ⚙️ CORS, DB, REST config
│   │   ├── urls.py
│   │   └── mongodb.py        # MongoDB connection
│   ├── employees/            # Employee management
│   │   ├── views.py          # ✅ API endpoints
│   │   ├── services.py       # Business logic
│   │   └── serializers.py    # Data validation
│   ├── attendance/           # Attendance tracking
│   │   ├── views.py          # ✅ API endpoints
│   │   ├── services.py
│   │   └── serializers.py
│   ├── requirements.txt      # Python dependencies
│   └── manage.py
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js        # ✅ Uses VITE_API_BASE_URL
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   └── Attendance.jsx
│   │   └── components/
│   ├── package.json
│   └── vite.config.js
│
├── DEPLOYMENT.md             # 📖 Detailed deployment guide
├── CHANGES.md                # 📝 Changes summary
└── README.md

```

---

## 🎯 Features

✅ Employee Management (CRUD)
✅ Attendance Tracking
✅ Dashboard with Statistics
✅ MongoDB Integration
✅ Production-Ready CORS Setup
✅ No CSRF Issues on API Endpoints
✅ Environment-Based Configuration

---

## 📚 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide with troubleshooting
- **[CHANGES.md](CHANGES.md)** - Summary of all fixes applied
- **[.env.production](.env.production)** - Production environment variables reference

---

## 🔒 Security Notes

- Never commit `.env` files to Git
- Generate a strong `SECRET_KEY` for production
- Set `DEBUG=False` in production
- Use environment variables for sensitive data
- MongoDB connection uses SSL by default with `mongodb+srv://`

---

## 🎉 You're Ready!

Your HRMS Lite application is now configured for production deployment. Follow the steps above, and you'll have a fully functional HR management system running in the cloud.

**Production URLs:**
- Frontend: `https://hrms-lite-nine-gamma.vercel.app`
- Backend: `https://hrms-lite-zhj6.onrender.com`

Happy coding! 🚀
