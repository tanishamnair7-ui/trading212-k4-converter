# Deploying Hormona Operations Center to Vercel

This guide covers deploying the Hormona Operations Center to Vercel.

## Prerequisites

- GitHub account with the repository pushed
- Vercel account (free tier works perfectly)

## Deployment Options

### Option 1: Deploy via Vercel Dashboard (Recommended)

This is the easiest method for first-time deployment.

#### Steps:

1. **Go to Vercel**
   - Visit [https://vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Find and select your `trading212-k4-converter` repository

3. **Configure Project**
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** `hormona-ops-center` ⚠️ IMPORTANT
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app will be live at `https://your-project-name.vercel.app`

#### Configuration Screenshot Guide:

```
Project Name: hormona-ops-center (or your preference)

Build & Development Settings:
┌─────────────────────────────────────────┐
│ Framework Preset: Next.js               │
│ Root Directory: hormona-ops-center ← CHANGE THIS │
│ Build Command: npm run build           │
│ Output Directory: .next                 │
│ Install Command: npm install            │
└─────────────────────────────────────────┘
```

### Option 2: Deploy via Vercel CLI

This method is faster for repeat deployments.

#### Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to Project Directory**
   ```bash
   cd hormona-ops-center
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

4. **Deploy**
   ```bash
   vercel
   ```

   Follow the prompts:
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N` (first time) or `Y` (subsequent deploys)
   - What's your project's name? `hormona-ops-center`
   - In which directory is your code located? `./` (you're already in hormona-ops-center)

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Option 3: Automatic Deployments (CI/CD)

Once set up via Option 1 or 2, Vercel will automatically deploy:
- **Production:** When you push to `main` branch
- **Preview:** When you push to any other branch (like your current feature branch)

## Environment Variables

This MVP uses mock data, so **no environment variables are needed**.

For future production use with a real backend, you would add:

```bash
# On Vercel Dashboard → Project → Settings → Environment Variables
NEXT_PUBLIC_API_URL=https://your-api.com
DATABASE_URL=postgresql://...
# etc.
```

## Custom Domain (Optional)

After deployment, you can add a custom domain:

1. Go to Project Settings → Domains
2. Add your domain (e.g., `ops.hormona.com`)
3. Follow DNS configuration instructions
4. SSL certificate is automatic

## Build Verification

Your build should complete successfully with output like:

```
✓ Compiled successfully
Route (app)                              Size     First Load JS
┌ ○ /                                    139 B          87.7 kB
├ ○ /board-pack                          4.87 kB         104 kB
├ ○ /finance                             9.05 kB         215 kB
├ ○ /operations                          2.54 kB         102 kB
├ ○ /overview                            7.46 kB         221 kB
├ ○ /partnerships                        4.39 kB         104 kB
├ ○ /revenue                             3.37 kB         208 kB
├ ○ /risk                                3.64 kB         103 kB
└ ○ /vendors                             9.89 kB         203 kB
```

## Troubleshooting

### Build Fails

**Issue:** "Cannot find module '@/components/...'"
- **Fix:** Ensure Root Directory is set to `hormona-ops-center`

**Issue:** "Module not found: Can't resolve 'next/font/google'"
- **Fix:** This has been fixed in the code (we removed Google Fonts dependency)

**Issue:** Build timeout
- **Fix:** Vercel free tier has 10-minute build limit. This project builds in ~30 seconds, so no issue.

### App Not Loading

**Issue:** Blank page or 404 errors
- **Fix:** Make sure Root Directory is `hormona-ops-center` in Vercel settings
- **Fix:** Check that the build completed successfully

**Issue:** Charts not rendering
- **Fix:** This is a client-side issue. Check browser console for errors.

### Performance

**Issue:** Slow initial load
- **Fix:** Already optimized with static generation. Should load in < 2 seconds.
- **Tip:** Use Vercel Analytics (free) to monitor performance

## Post-Deployment Checklist

- [ ] App loads at Vercel URL
- [ ] All 8 routes accessible (/overview, /finance, /revenue, etc.)
- [ ] Charts render correctly
- [ ] KPI cards clickable (definitions modal opens)
- [ ] Alerts dismissible
- [ ] Scenario planner tabs work
- [ ] Board Pack export button triggers print dialog
- [ ] Mobile responsive (test on phone)

## Monitoring & Analytics

Enable Vercel Analytics (free):
1. Go to Project → Analytics tab
2. Enable "Vercel Analytics"
3. Track page views, performance, and Web Vitals

## Updating After Deployment

### Method 1: Push to GitHub
```bash
git add .
git commit -m "Update feature X"
git push
```
Vercel auto-deploys on push.

### Method 2: Redeploy via Dashboard
- Go to Deployments tab
- Click "Redeploy" on any deployment

### Method 3: Vercel CLI
```bash
cd hormona-ops-center
vercel --prod
```

## Costs

**Free Tier Includes:**
- Unlimited deployments
- Automatic HTTPS
- 100 GB bandwidth/month
- Serverless functions
- Preview deployments
- Built-in CDN

This project fits comfortably in the free tier.

## Next Steps

1. **Share the URL** with stakeholders
2. **Add to README** (optional)
3. **Set up custom domain** (optional)
4. **Enable Analytics** for usage insights
5. **Integrate real data** when backend is ready

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Community:** https://github.com/vercel/next.js/discussions

---

**Deployment prepared for:** Hormona Operations Center
**Framework:** Next.js 14.2
**Build Status:** ✅ Verified
**Estimated Build Time:** 30-45 seconds
**Estimated Deploy Time:** 2-3 minutes total

Good luck with your deployment! 🚀
