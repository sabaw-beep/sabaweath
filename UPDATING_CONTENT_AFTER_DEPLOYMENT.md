# Updating Content After Deployment

This guide explains what content updates automatically on your deployed website and what requires a redeploy.

## ✅ Updates Automatically (No Redeploy Needed)

### 1. **Supabase Database Content** ✨

**What this includes:**
- Video scripts and knowledge entries in your Supabase `knowledge_entries` table
- Any content you add, edit, or delete in Supabase

**How it works:**
- Your website fetches data from Supabase **at runtime** (when users visit)
- Changes in Supabase are immediately reflected on the live website
- No code changes or redeployment needed

**To update:**
1. Go to your Supabase dashboard
2. Navigate to Table Editor → `knowledge_entries`
3. Add, edit, or delete entries
4. Changes appear on your website immediately! 🎉

**Example:**
- Add a new video script for a location → Appears in chatbot responses immediately
- Update an existing script → Changes reflected on next page load
- Delete an entry → Removed from chatbot knowledge immediately

---

## ❌ Requires Redeploy (Code Changes)

### 1. **Video URLs in `data/locations.ts`**

**What this includes:**
- Video URLs and titles
- Location coordinates (latitude/longitude)
- Location names
- Adding new locations to the globe

**Why:**
- These are hardcoded in your source code
- The code needs to be rebuilt and redeployed for changes to appear

**To update:**
1. Edit `data/locations.ts`
2. Add/modify video URLs or locations
3. Commit and push to Git
4. Your hosting platform will automatically rebuild and redeploy
   - Or manually run: `npm run build:web` and redeploy

**Example:**
- Add a new video URL to Turkey → Requires redeploy
- Add a new location (e.g., Japan) → Requires redeploy
- Change a video title → Requires redeploy

### 2. **Code Changes**

**What this includes:**
- UI/UX changes
- New features
- Bug fixes
- Styling changes
- Component modifications

**To update:**
1. Make code changes
2. Commit and push to Git
3. Automatic deployment will rebuild and redeploy

---

## 📊 Summary Table

| Content Type | Location | Updates Automatically? | How to Update |
|-------------|----------|----------------------|---------------|
| Video Scripts | Supabase `knowledge_entries` | ✅ **YES** | Edit in Supabase dashboard |
| Knowledge Base Entries | Supabase `knowledge_entries` | ✅ **YES** | Edit in Supabase dashboard |
| Video URLs | `data/locations.ts` | ❌ **NO** | Edit code + redeploy |
| Location Coordinates | `data/locations.ts` | ❌ **NO** | Edit code + redeploy |
| New Locations | `data/locations.ts` | ❌ **NO** | Edit code + redeploy |
| UI/Features | Source code | ❌ **NO** | Edit code + redeploy |

---

## 💡 Best Practice: Move Video URLs to Supabase (Optional)

If you want **everything** to update automatically without redeploying, consider moving video URLs to Supabase as well.

### Current Setup:
- **Video URLs**: Hardcoded in `data/locations.ts` (requires redeploy)
- **Video Scripts**: In Supabase (updates automatically)

### Recommended Future Enhancement:
Create a `videos` table in Supabase with:
- `id`
- `location_id` (or `location` name)
- `title`
- `youtube_url`
- `thumbnail` (optional)
- `created_at`

Then modify your app to fetch videos from Supabase instead of the hardcoded array.

**Benefits:**
- Add new videos without redeploying
- Update video URLs instantly
- Manage all content from Supabase dashboard

**Trade-off:**
- Requires code changes to implement
- Slightly more complex initial setup

---

## 🔄 Quick Reference

### To Update Video Scripts (Automatic):
```
1. Open Supabase Dashboard
2. Go to Table Editor → knowledge_entries
3. Add/Edit/Delete entries
4. Done! ✅ (No redeploy needed)
```

### To Update Video URLs (Requires Redeploy):
```
1. Edit data/locations.ts
2. git add .
3. git commit -m "Update video URLs"
4. git push
5. Wait for automatic deployment ✅
```

---

## 🎯 Recommendation

For **frequent content updates** (like adding new video scripts):
- ✅ Use Supabase - updates instantly, no redeploy needed

For **occasional updates** (like adding new locations or videos):
- Current setup is fine - just redeploy when needed

For **maximum flexibility**:
- Consider moving video URLs to Supabase too (requires some development work)

---

## ❓ FAQ

**Q: If I add a new video script to Supabase, when will it appear?**
A: Immediately! The next time someone uses the chatbot, it will have access to the new script.

**Q: If I add a new video URL to locations.ts, when will it appear?**
A: After you push the code and the site redeploys (usually 1-5 minutes with automatic deployments).

**Q: Can I update both at the same time?**
A: Yes! Add the script to Supabase (instant), and add the video URL to locations.ts (requires redeploy). They don't have to be in sync.

**Q: What if I want to add a completely new location?**
A: You'll need to:
1. Add it to `data/locations.ts` (code change + redeploy)
2. Optionally add scripts to Supabase (instant, no redeploy)

---

**Need help?** Check the main DEPLOYMENT_GUIDE.md for redeployment instructions.

