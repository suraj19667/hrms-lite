# HRMS Lite - Production Deployment Guide

## ✅ Fixes Applied

### Backend (Django + DRF + MongoDB)
1. **CORS Configuration**
   - Moved `CorsMiddleware` to the top of middleware stack
   - Added `WhiteNoiseMiddleware` for static files
   - Set `CORS_ALLOW_ALL_ORIGINS = False` (secure)
   - Set `CORS_ALLOW_CREDENTIALS = True`
   - Added `CSRF_TRUSTED_ORIGINS` matching CORS origins

2. **CSRF Protection**
   - Disabled CSRF for API endpoints using `@permission_classes([AllowAny])`
   - Added `DEFAULT_AUTHENTICATION_CLASSES = []` in REST_FRAMEWORK settings
   - All API views now use `@permission_classes([AllowAny])` decorator

3. **MongoDB Connection**
   - Uses `settings.MONGO_URI` from environment variables
   - Uses `settings.MONGO_DB_NAME` from environment variables
   - Properly handles connection through singleton pattern

4. **API Views**
   - All views use `request.data` (not `request.POST`)
   - Proper JSON responses with status codes
   - Error handling for production scenarios

### Frontend (Vite + React)
1. **Environment Variables**
   - Already configured to use `VITE_API_BASE_URL`
   - No hardcoded localhost/127.0.0.1 URLs
   - API calls use: `${API_BASE_URL}/api/...`

---

## 🚀 Production Deployment

### Backend Deployment (Render)

**Environment Variables to Set in Render Dashboard:**

```bash
SECRET_KEY=<generate-new-secret-key>
DEBUG=False
ALLOWED_HOSTS=hrms-lite-zhj6.onrender.com
MONGO_URI=mongodb+srv://sy083609_db_user:9aYCfZmM2U8ylQEZ@cluster0.xwpo7nm.mongodb.net/ethara?retryWrites=true&w=majority
MONGO_DB_NAME=ethara
CORS_ALLOWED_ORIGINS=https://hrms-lite-nine-gamma.vercel.app
```

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
gunicorn hrms.wsgi:application
```

---

### Frontend Deployment (Vercel)

**Environment Variables to Set in Vercel Dashboard:**

```bash
VITE_API_BASE_URL=https://hrms-lite-zhj6.onrender.com
```

**Build Settings:**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

## 🔧 MongoDB Atlas Setup

1. **Network Access**
   - Go to MongoDB Atlas → Network Access
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
   - This allows Render to connect to your database

2. **Database User**
   - Ensure user `sy083609_db_user` has read/write permissions
   - Database: `ethara`

---

## ✅ Testing Checklist

### After Deployment, Test These Scenarios:

1. **Dashboard Loading**
   - [ ] Visit: `https://hrms-lite-nine-gamma.vercel.app`
   - [ ] Dashboard loads without errors
   - [ ] Stats display correctly (Total Employees, Present Today, etc.)

2. **Employee Creation**
   - [ ] Click "Add Employee" button
   - [ ] Fill in all fields (Employee ID, Name, Email, Department)
   - [ ] Submit form
   - [ ] Check: No CORS errors in browser console (F12)
   - [ ] Check: No CSRF errors in browser console
   - [ ] Check: Employee appears in the list immediately

3. **Data Persistence**
   - [ ] Verify employee is saved in MongoDB Atlas
   - [ ] Refresh the page - employee still appears
   - [ ] Check MongoDB Atlas → Browse Collections → employees

4. **Browser Console (F12)**
   - [ ] No CORS errors
   - [ ] No CSRF errors
   - [ ] No 403 Forbidden errors
   - [ ] No 500 Internal Server errors

---

## 🐛 Troubleshooting

### Issue: CORS Error "Access-Control-Allow-Origin"
**Solution:**
1. Check Render environment variable: `CORS_ALLOWED_ORIGINS=https://hrms-lite-nine-gamma.vercel.app`
2. Make sure there are no trailing slashes in the URL
3. Redeploy backend after changing environment variables

### Issue: 403 Forbidden or CSRF Error
**Solution:**
1. Verify all API views have `@permission_classes([AllowAny])` decorator
2. Check Django settings: `DEFAULT_AUTHENTICATION_CLASSES = []`
3. Redeploy backend

### Issue: Can't Connect to MongoDB
**Solution:**
1. Check MongoDB Atlas Network Access allows `0.0.0.0/0`
2. Verify `MONGO_URI` in Render environment variables is correct
3. Check Render logs for connection errors

### Issue: Frontend Can't Reach Backend
**Solution:**
1. Verify Vercel environment variable: `VITE_API_BASE_URL=https://hrms-lite-zhj6.onrender.com`
2. No trailing slash in the URL
3. Rebuild and redeploy frontend

---

## 📝 Key Files Modified

### Backend:
- [backend/hrms/settings.py](backend/hrms/settings.py) - CORS, middleware, REST_FRAMEWORK settings
- [backend/employees/views.py](backend/employees/views.py) - Added `@permission_classes([AllowAny])`
- [backend/attendance/views.py](backend/attendance/views.py) - Added `@permission_classes([AllowAny])`

### Frontend:
- [frontend/src/api/api.js](frontend/src/api/api.js) - Already uses `VITE_API_BASE_URL` ✅

---

## 🎉 Expected Result

After following this guide:
- ✅ Dashboard loads data correctly
- ✅ Employee creation works without errors
- ✅ Data is saved in MongoDB Atlas
- ✅ No CORS/CSRF errors in browser console
- ✅ Production-ready deployment on Vercel + Render

---

## 📞 Support

If you encounter issues:
1. Check Render logs: Render Dashboard → Logs
2. Check browser console: F12 → Console tab
3. Check Network tab: F12 → Network tab (inspect failed requests)
4. Verify all environment variables are set correctly
