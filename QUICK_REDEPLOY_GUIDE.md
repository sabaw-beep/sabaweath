# Quick Redeploy Guide

## 🚀 With Continuous Deployment (Recommended - Super Easy!)

If you set up continuous deployment (connecting your Git repo to Vercel/Netlify), redeploying is **incredibly easy**:

### Steps (Takes ~30 seconds):

```bash
# 1. Make your code changes
# (Edit files like data/locations.ts)

# 2. Commit and push
git add .
git commit -m "Add new video URLs"
git push

# 3. That's it! 🎉
# Your hosting platform automatically:
# - Detects the push
# - Builds your site
# - Deploys it
# (Usually takes 1-3 minutes)
```

**Total time:** ~30 seconds of your time + 1-3 minutes waiting for automatic deployment

**Effort level:** ⭐ Very Easy (just 3 commands)

---

## 📋 Without Continuous Deployment (Manual)

If you haven't set up automatic deployments, you'll need to manually deploy:

### Steps (Takes ~2-3 minutes):

```bash
# 1. Make your code changes

# 2. Build for web
npm run build:web

# 3. Deploy (depends on platform)
# For Vercel:
cd web-build && vercel --prod

# For Netlify:
cd web-build && netlify deploy --prod
```

**Total time:** ~2-3 minutes

**Effort level:** ⭐⭐ Easy (a few commands)

---

## 💡 Recommendation: Set Up Continuous Deployment

**Why it's worth it:**
- ✅ Redeploying becomes automatic
- ✅ No manual build/deploy steps
- ✅ Takes 30 seconds instead of 3 minutes
- ✅ Less chance of errors
- ✅ One-time setup (5 minutes)

**How to set it up:**

### Vercel:
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npx expo export:web`
   - Output Directory: `web-build`
5. Add environment variables
6. Deploy!

### Netlify:
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure:
   - Build command: `npx expo export:web`
   - Publish directory: `web-build`
5. Add environment variables
6. Deploy!

**After setup:** Every `git push` automatically deploys! 🎉

---

## 📊 Comparison

| Method | Your Time | Waiting Time | Effort |
|--------|-----------|--------------|--------|
| **Continuous Deployment** | 30 seconds | 1-3 minutes | ⭐ Very Easy |
| **Manual Deploy** | 2-3 minutes | 1-3 minutes | ⭐⭐ Easy |

---

## 🎯 Real-World Example

**Scenario:** You want to add 3 new video URLs to your Turkey location.

### With Continuous Deployment:
```bash
# Edit data/locations.ts (add videos)
# Then:
git add .
git commit -m "Add new Turkey videos"
git push
# ☕ Grab coffee, come back in 2 minutes - it's live!
```

### Without Continuous Deployment:
```bash
# Edit data/locations.ts (add videos)
# Then:
npm run build:web
cd web-build
vercel --prod
# Wait for deployment...
```

---

## ✅ Bottom Line

**With continuous deployment:** Redeploying is **almost zero work** - just push to Git!

**Without continuous deployment:** Still easy, just a few extra commands.

**Recommendation:** Spend 5 minutes setting up continuous deployment once, and save time on every future update!

---

## 🔄 Quick Checklist for Redeploy

- [ ] Make code changes
- [ ] Test locally (optional but recommended): `npm run web`
- [ ] Commit: `git add . && git commit -m "Your message"`
- [ ] Push: `git push`
- [ ] Wait 1-3 minutes
- [ ] Check your live site - it's updated! ✅

---

**Need help setting up continuous deployment?** Check `DEPLOYMENT_GUIDE.md` Step 7!

