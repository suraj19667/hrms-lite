# 🔧 Render Debugging Checklist

## Current Issue: Environment Variables Set but Still Getting 500 Error

### ✅ Step-by-Step Fix

#### 1. **VERIFY ENVIRONMENT VARIABLES FORMAT**

Check each variable carefully (NO SPACES in comma-separated values):

```bash
# ✅ CORRECT FORMAT
CSRF_TRUSTED_ORIGINS=https://hrms-lite-nine-gamma.vercel.app,https://hrms-lite-zhj6.onrender.com

# ❌ WRONG FORMAT (has spaces)
CSRF_TRUSTED_ORIGINS=https://hrms-lite-nine-gamma.vercel.app, https://hrms-lite-zhj6.onrender.com
```

#### 2. **VERIFY MONGO_URI IS COMPLETE**

The full MONGO_URI should end with `&appName=Cluster0`:

```
mongodb+srv://sy083609_db_user:9aYCfZmM2U8ylQEZ@cluster0.xwpo7nm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

**How to check:**
1. Click edit icon next to MONGO_URI
2. Scroll to the end of the value
3. Make sure it ends with `&appName=Cluster0`

#### 3. **ALL REQUIRED VARIABLES CHECKLIST**

- [ ] MONGO_URI (complete with &appName=Cluster0)
- [ ] MONGO_DB_NAME = hrms
- [ ] ALLOWED_HOSTS = hrms-lite-zhj6.onrender.com,.onrender.com
- [ ] CORS_ALLOWED_ORIGINS = https://hrms-lite-nine-gamma.vercel.app
- [ ] CSRF_TRUSTED_ORIGINS = https://hrms-lite-nine-gamma.vercel.app,https://hrms-lite-zhj6.onrender.com
- [ ] DEBUG = False
- [ ] SECRET_KEY = (any random string)

#### 4. **FORCE REDEPLOY**

After fixing environment variables:

1. Click **"Manual Deploy"** button (top right)
2. Select **"Deploy latest commit"**
3. Wait for deployment to complete (2-3 minutes)
4. Check logs for success messages

#### 5. **CHECK LOGS FOR ERRORS**

Go to **Logs** tab and look for:

**✅ Success Messages:**
```
Connecting to MongoDB: hrms
MongoDB connection successful
Starting server...
```

**❌ Error Messages to Look For:**
```
MONGO_URI not set
Failed to connect to MongoDB
CORS error
Connection refused
```

#### 6. **MONGODB ATLAS NETWORK ACCESS**

Make sure MongoDB Atlas allows connections:

1. Go to https://cloud.mongodb.com
2. Click your cluster
3. Go to **Network Access**
4. Make sure `0.0.0.0/0` is added (Allow access from anywhere)

#### 7. **TEST THE BACKEND DIRECTLY**

Open in browser:
```
https://hrms-lite-zhj6.onrender.com/api/employees/
```

**Expected Response:**
- ✅ JSON array of employees `[]` or `[{...}]`
- ❌ HTML error page or connection refused

---

## 🚨 Common Issues & Solutions

### Issue 1: "Still getting 500 error after adding variables"
**Solution:** Force redeploy using Manual Deploy button

### Issue 2: "Logs show: MONGO_URI not set"
**Solution:** 
- Delete and re-add MONGO_URI variable
- Make sure no extra spaces
- Force redeploy

### Issue 3: "Logs show: MongoServerError: Authentication failed"
**Solution:**
- Verify MongoDB username and password in MONGO_URI
- Check MongoDB Atlas user permissions

### Issue 4: "CORS error in browser console"
**Solution:**
- Verify CORS_ALLOWED_ORIGINS has EXACTLY: `https://hrms-lite-nine-gamma.vercel.app`
- No http://, only https://
- No trailing slash

### Issue 5: "Environment variables keep resetting"
**Solution:**
- Make sure you click "Save Changes" button
- Wait for green success message
- Then do manual deploy

---

## 🎯 Quick Test Commands

### Test 1: Check Backend is Live
```bash
curl https://hrms-lite-zhj6.onrender.com/api/employees/
```

### Test 2: Check CORS Headers
```bash
curl -I -X OPTIONS https://hrms-lite-zhj6.onrender.com/api/employees/ \
  -H "Origin: https://hrms-lite-nine-gamma.vercel.app" \
  -H "Access-Control-Request-Method: POST"
```

Expected to see: `Access-Control-Allow-Origin: https://hrms-lite-nine-gamma.vercel.app`

---

## 📝 Final Verification

After all fixes:

1. [ ] Backend URL returns JSON (not HTML error)
2. [ ] Frontend can fetch employees list
3. [ ] Can add new employee without error
4. [ ] No CORS errors in browser console
5. [ ] Logs show "MongoDB connection successful"

---

## 💡 Pro Tip

If nothing works, try this nuclear option:
1. Delete ALL environment variables
2. Click "Save Changes"
3. Manually redeploy
4. Add environment variables ONE BY ONE
5. Save after each addition
6. Final manual redeploy

This ensures no cached/corrupted values remain.
