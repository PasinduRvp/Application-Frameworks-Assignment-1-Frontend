# Vercel Deployment Guide for EcoNav Frontend

## ✅ Pre-Deployment Checklist

### 1. **Backend Must Be Deployed First**
- [ ] Backend deployed to Render at: `https://your-backend-app.onrender.com`
- [ ] Backend health check works: `https://your-backend-app.onrender.com/health`
- [ ] API is accessible and working

### 2. **Verify Files**
- [ ] `vercel.json` exists in frontend root
- [ ] `.env.example` contains only placeholders (NO real credentials)
- [ ] `.env` is in `.gitignore`
- [ ] `package.json` has all dependencies listed

### 3. **Update Environment Variables**
Before deployment, set these in Vercel:
```
REACT_APP_API_URL=https://your-backend-app.onrender.com/api
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_or_leave_empty
```

---

## 📝 Step-by-Step Deployment

### Step 1: Prepare Repository
```bash
# Make sure .env is NOT tracked
git rm --cached .env (if it was committed)
git add .gitignore
git commit -m "Update gitignore - exclude .env files"
git push
```

### Step 2: Deploy to Vercel
**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI (if not already)
npm install -g vercel

# Deploy
vercel --prod
```

**Option B: Connect via Vercel Dashboard**
1. Go to [dashboard.vercel.com](https://dashboard.vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select project root (Application-Frameworks-Assignment-1-Frontend)
5. Click "Deploy"

### Step 3: Configure Environment Variables in Vercel
1. After initial deployment, go to Project Settings → Environment Variables
2. Add these variables:
   ```
   REACT_APP_API_URL=https://your-backend-app.onrender.com/api
   REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here (optional)
   ```
3. Redeploy to apply changes:
   ```bash
   vercel --prod
   ```

### Step 4: Verify Deployment
1. Visit your Vercel deployment URL
2. Check browser console (F12 > Console) for any errors
3. Test login functionality
4. Verify API calls are going to Render backend
5. Check for CORS errors

---

## 🔗 CORS Configuration

### Frontend on Vercel
Your frontend will be at: `https://your-project.vercel.app`

### Update Backend CORS
In Render environment variables, set:
```
CORS_ORIGIN=https://your-project.vercel.app
```

This allows your Vercel frontend to communicate with Render backend.

---

## 📋 Troubleshooting

### "Cannot POST /api/auth/login" Errors
- **Problem**: Frontend can't reach backend API
- **Solution**: 
  1. Check `REACT_APP_API_URL` is set correctly in Vercel
  2. Verify backend is accessible: `curl https://your-backend-app.onrender.com/api/auth`
  3. Check backend CORS_ORIGIN includes your Vercel URL

### CORS Errors in Browser Console
- **Problem**: Blocked by CORS policy
- **Solution**:
  1. Ensure backend has `CORS_ORIGIN=https://your-vercel-url` set
  2. Backend must be running and accessible
  3. Check browser console for actual error message

### Build Fails on Vercel
- **Problem**: Build command times out or fails
- **Solution**:
  1. Check build logs in Vercel dashboard
  2. Ensure all dependencies are in `package.json`
  3. Verify no hardcoded localhost URLs remain

### Blank Page on Vercel
- **Problem**: Page loads but shows nothing
- **Solution**:
  1. Check browser console (F12) for errors
  2. Verify `REACT_APP_API_URL` is set
  3. Check Network tab to see if API calls are failing

### Socket.io Connection Issues
- **Problem**: Real-time notifications don't work
- **Solution**:
  1. Verify backend Socket.io is running
  2. Check CORS_ORIGIN includes Vercel URL
  3. Backend Socket.io settings must allow Vercel origin

---

## 🔐 Security Checklist

- [ ] `.env` file is NOT committed to git
- [ ] `.env.example` has ONLY placeholders
- [ ] No API keys hardcoded in JavaScript
- [ ] Environment variables are set in Vercel dashboard (not in .env files)
- [ ] Backend CORS_ORIGIN is set to Vercel URL

---

## 📚 Useful Resources

- [Vercel React Deployment Docs](https://vercel.com/docs/frameworks/react)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [CORS Troubleshooting](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Render Web Service Docs](https://render.com/docs/deploy-node-express-app)

---

## 🚀 Deployment URLs

After deployment, you'll have:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend-app.onrender.com`
- **API**: `https://your-backend-app.onrender.com/api`
- **API Docs**: `https://your-backend-app.onrender.com/api-docs`

Update your team/documentation with these URLs.
