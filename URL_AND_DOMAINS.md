# Website URLs and Domains Guide

## 🔗 Short Answer: Your URL Stays the Same!

**Your main website URL does NOT change** when you redeploy. It stays the same forever (unless you change it manually).

---

## 📍 How URLs Work

### Production URL (Permanent)

When you first deploy, you get a **permanent production URL** that never changes:

**Vercel:**
- Format: `your-project-name.vercel.app`
- Example: `saba-takes-flight.vercel.app`
- ✅ **Stays the same forever**

**Netlify:**
- Format: `your-project-name.netlify.app`
- Example: `saba-takes-flight.netlify.app`
- ✅ **Stays the same forever**

**GitHub Pages:**
- Format: `username.github.io/repo-name`
- Example: `yourusername.github.io/saba-takes-flight`
- ✅ **Stays the same forever**

### What Happens When You Redeploy?

1. You push new code
2. Platform builds your site
3. Platform deploys to the **same URL**
4. Your website updates with new content
5. **URL stays exactly the same!** ✅

---

## 🔄 Preview URLs (Temporary - Optional)

Some platforms also create **preview URLs** for testing before going live:

**Vercel:**
- Creates preview URLs like: `your-project-git-branch-username.vercel.app`
- These are for testing changes
- Production URL stays the same

**Netlify:**
- Creates deploy preview URLs
- Production URL stays the same

**You can ignore preview URLs** - they're just for testing. Your main URL never changes.

---

## 🌐 Custom Domain (Optional)

You can also add a **custom domain** (like `sabatakesflight.com`):

### How It Works:
1. Buy a domain (e.g., from Namecheap, Google Domains)
2. Connect it to your hosting platform
3. Configure DNS settings
4. Your site is accessible at your custom domain
5. **This URL also stays the same forever**

### Benefits:
- Professional URL (e.g., `sabatakesflight.com` instead of `saba-takes-flight.vercel.app`)
- Easier to remember
- More professional
- Still stays the same across all deployments

---

## 📊 URL Comparison

| Scenario | URL Changes? | Example |
|----------|-------------|---------|
| **Redeploy after code changes** | ❌ **NO** | `saba-takes-flight.vercel.app` → Same URL |
| **Add new features** | ❌ **NO** | `saba-takes-flight.vercel.app` → Same URL |
| **Update content** | ❌ **NO** | `saba-takes-flight.vercel.app` → Same URL |
| **Change project name** | ✅ **YES** | Old: `old-name.vercel.app` → New: `new-name.vercel.app` |
| **Delete and recreate project** | ✅ **YES** | You'd get a new URL |
| **Add custom domain** | ❌ **NO** (adds new URL, old one still works) | Both work: `yourdomain.com` AND `project.vercel.app` |

---

## ✅ What This Means for You

### Good News:
- ✅ **Share your URL once** - it works forever
- ✅ **Bookmark it** - it never changes
- ✅ **Put it on business cards** - it's permanent
- ✅ **Link to it from social media** - safe to share

### When You Redeploy:
```
Before: https://saba-takes-flight.vercel.app
After:  https://saba-takes-flight.vercel.app
       ↑
       Same URL! ✅
```

---

## 🎯 Real-World Example

**Day 1:** You deploy your site
- URL: `saba-takes-flight.vercel.app`
- You share it with friends

**Day 7:** You add new videos and redeploy
- URL: `saba-takes-flight.vercel.app` (same!)
- Friends can still use the same link

**Day 30:** You add a new location and redeploy
- URL: `saba-takes-flight.vercel.app` (same!)
- Same link still works

**Day 60:** You add custom domain `sabatakesflight.com`
- Now you have TWO URLs that both work:
  - `sabatakesflight.com` (custom)
  - `saba-takes-flight.vercel.app` (original, still works)
- Both stay the same forever

---

## 🔒 URL Stability Guarantee

**Your production URL is permanent** unless you:
1. Manually change the project/site name
2. Delete the project and create a new one
3. Switch hosting platforms (then you'd get a new URL)

**Normal redeployments:** URL never changes ✅

---

## 💡 Pro Tips

1. **Bookmark your URL** - It's permanent!
2. **Share it freely** - It won't break
3. **Add to social media bios** - Safe to use long-term
4. **Consider a custom domain** - More professional, also permanent

---

## ❓ FAQ

**Q: If I redeploy 100 times, will I get 100 different URLs?**
A: No! You'll always have the same production URL.

**Q: Can I change my URL if I want to?**
A: Yes, you can rename your project, but the old URL will stop working. Better to keep the same one.

**Q: What if I want a shorter/custom URL?**
A: Add a custom domain! Your original URL will still work, and you'll have a new custom one too.

**Q: Do preview URLs change?**
A: Yes, preview URLs are temporary and change, but you can ignore them. Your production URL stays the same.

**Q: What happens if I switch from Vercel to Netlify?**
A: You'd get a new URL (Netlify's format), but you can add the same custom domain to both.

---

## 🎉 Bottom Line

**Your website URL is permanent!** 

- Deploy once → Get a URL
- Redeploy 100 times → Same URL
- Share it with confidence → It won't change
- Bookmark it → It's yours forever

The only thing that changes when you redeploy is **the content on your site**, not the URL! 🚀

