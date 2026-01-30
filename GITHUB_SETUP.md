# 📦 GitHub Setup Guide

## Step 1: Test Your Website Locally

Your website is now running locally with MongoDB Atlas:
- **Frontend**: http://localhost:5174
- **Backend**: http://localhost:5000
- **Database**: MongoDB Atlas (cloud)

### Quick Test Checklist:
1. Open http://localhost:5174 in your browser
2. Check homepage loads with featured packages
3. Click "View All Packages" - should show Bali, Jaisalmer, Vietnam
4. Click on a destination to see packages
5. Click on a package to see full details
6. Try the contact form
7. Test admin login at http://localhost:5174/admin/login
   - Username: `admin`
   - Password: `admin123`

---

## Step 2: Prepare for GitHub

### Create .gitignore (if not exists)

Make sure you have a `.gitignore` file in the root directory with:

```
# Dependencies
node_modules/
*/node_modules/

# Environment variables
.env
.env.local
.env.production
backend/.env
frontend/.env

# Build outputs
dist/
build/
*/dist/
*/build/

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Local database files
*.localstorage
*.localstorage-shm
*.localstorage-wal

# Uploads (optional - keep if you want to deploy with existing images)
# backend/uploads/
```

---

## Step 3: Initialize Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Check what will be committed
git status

# Commit
git commit -m "Initial commit - Vibe Holidays website with MongoDB Atlas"
```

---

## Step 4: Create GitHub Repository

### Option A: Using GitHub Website

1. Go to https://github.com
2. Click the "+" icon in top right
3. Click "New repository"
4. Fill in:
   - **Repository name**: `vibe-holidays` (or your preferred name)
   - **Description**: "Travel package booking website with admin panel"
   - **Visibility**: Private or Public (your choice)
   - **DO NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

### Option B: Using GitHub CLI (if installed)

```bash
gh repo create vibe-holidays --private --source=. --remote=origin
```

---

## Step 5: Push to GitHub

After creating the repository on GitHub, you'll see commands like:

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/vibe-holidays.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

---

## Step 6: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files uploaded
3. Check that `.env` files are NOT uploaded (they should be in .gitignore)

---

## 🔒 Security Check

Before pushing, make sure these files are in `.gitignore`:
- [ ] `backend/.env`
- [ ] `frontend/.env`
- [ ] `.env.production` files
- [ ] `node_modules/` folders

**Never commit environment files with passwords/secrets to GitHub!**

---

## 📝 What to Commit

**DO commit:**
- ✅ All source code (`src/` folders)
- ✅ Package files (`package.json`, `package-lock.json`)
- ✅ Configuration files (`tsconfig.json`, `vite.config.ts`, etc.)
- ✅ Example env files (`.env.example`)
- ✅ Documentation files (`.md` files)
- ✅ Public assets

**DON'T commit:**
- ❌ `.env` files with real credentials
- ❌ `node_modules/` folders
- ❌ `dist/` or `build/` folders
- ❌ Local database files
- ❌ Log files

---

## 🚀 After Pushing to GitHub

Once your code is on GitHub, you're ready to deploy!

### Next Steps:
1. **Deploy Backend to Render**
   - Go to https://render.com
   - Sign up with GitHub
   - Create new Web Service
   - Connect your repository
   - Follow instructions in `DEPLOYMENT_READY.md`

2. **Deploy Frontend to Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub
   - Import your repository
   - Follow instructions in `DEPLOYMENT_READY.md`

---

## 🆘 Troubleshooting

### "fatal: not a git repository"
```bash
git init
```

### "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/vibe-holidays.git
```

### "failed to push some refs"
```bash
git pull origin main --rebase
git push -u origin main
```

### Large files error
If you get errors about large files:
```bash
# Remove large files from git
git rm --cached path/to/large/file

# Add to .gitignore
echo "path/to/large/file" >> .gitignore

# Commit and push
git add .
git commit -m "Remove large files"
git push
```

---

## 📞 Need Help?

Common issues:
1. **Git not installed**: Download from https://git-scm.com
2. **GitHub authentication**: Use personal access token instead of password
3. **Large repository**: Consider using Git LFS for large files

---

**Ready to push to GitHub? Follow the steps above!** 🚀

After pushing, open `DEPLOYMENT_READY.md` for deployment instructions.
