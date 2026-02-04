# 🔧 Deployment Error Fix Guide

## Problem
You're getting a **Server Error (500)** when adding employees because the Render backend doesn't have the correct environment variables configured.

## ✅ Solution: Update Render Environment Variables

### Step 1: Go to Render Dashboard
1. Open https://dashboard.render.com
2. Click on your **hrms-lite-zhj6** service

### Step 2: Add/Update Environment Variables
Click on **"Environment"** tab and add these variables:

```bash
MONGO_URI=mongodb+srv://sy083609_db_user:9aYCfZmM2U8ylQEZ@cluster0.xwpo7nm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

MONGO_DB_NAME=hrms

SECRET_KEY=django-insecure-prod-key-change-this-to-random-string

DEBUG=False

ALLOWED_HOSTS=localhost,127.0.0.1,hrms-lite-zhj6.onrender.com,.onrender.com

CORS_ALLOWED_ORIGINS=https://hrms-lite-nine-gamma.vercel.app,http://localhost:5173

CSRF_TRUSTED_ORIGINS=https://hrms-lite-nine-gamma.vercel.app,https://hrms-lite-zhj6.onrender.com
```

### Step 3: Save and Redeploy
1. Click **"Save Changes"**
2. Render will automatically redeploy your backend
3. Wait for deployment to complete (2-3 minutes)

### Step 4: Test
1. Go to your frontend: https://hrms-lite-nine-gamma.vercel.app/employees
2. Try adding an employee again
3. It should work now! ✅

## 🔍 Why This Error Happened

The 500 error occurs because:
1. **Missing MONGO_URI**: Backend can't connect to MongoDB
2. **Missing CORS settings**: Frontend requests are blocked
3. **Missing CSRF settings**: Security middleware rejects requests

## 📝 Notes

- **MONGO_URI**: Your MongoDB Atlas connection string (already in your local .env)
- **CORS_ALLOWED_ORIGINS**: Must include your Vercel frontend URL
- **ALLOWED_HOSTS**: Must include your Render backend URL
- **DEBUG=False**: Keep this False in production for security

## 🚀 Quick Checklist

- [ ] Added MONGO_URI to Render environment variables
- [ ] Added MONGO_DB_NAME to Render environment variables
- [ ] Added CORS_ALLOWED_ORIGINS with Vercel URL
- [ ] Added CSRF_TRUSTED_ORIGINS
- [ ] Saved changes and redeployed
- [ ] Tested adding employee on deployed site

## 🆘 Still Having Issues?

Check Render logs:
1. Go to Render Dashboard → Your Service
2. Click **"Logs"** tab
3. Look for errors like:
   - `MONGO_URI not set`
   - `Failed to connect to MongoDB`
   - `CORS error`

## 💡 Pro Tip

After adding environment variables, you can verify they're loaded by checking the logs for:
```
Connecting to MongoDB: hrms
MongoDB connection successful
```

If you see connection errors, check:
1. MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
2. Your MongoDB credentials are correct
3. The connection string is complete (no line breaks)
