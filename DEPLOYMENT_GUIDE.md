# Deployment Guide: Making Saba Takes Flight Publicly Accessible

This guide will walk you through the steps to deploy your Expo web app as a publicly accessible website.

## 📋 Prerequisites

- Node.js and npm/yarn installed
- Git repository set up (recommended)
- Supabase credentials (if using Supabase)
- OpenAI API key (if using the chatbot)

## 🚀 Step 1: Prepare Your Project

### 1.1 Install Dependencies

Make sure all dependencies are installed:

```bash
cd saba-takes-flight
npm install
```

### 1.2 Set Up Environment Variables

Create a `.env` file in the `saba-takes-flight` directory (if you haven't already):

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url-here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

**Important:** 
- Never commit your `.env` file to Git
- Make sure `.env` is in your `.gitignore` file
- You'll need to add these environment variables to your hosting platform

### 1.3 Test Locally

Test your web build locally first:

```bash
npm run web
```

Make sure everything works correctly before deploying.

## 🏗️ Step 2: Build the Web Version

### 2.1 Install Expo CLI (if not already installed)

```bash
npm install -g expo-cli
```

Or use npx:

```bash
npx expo export:web
```

### 2.2 Export Web Build

Run the export command to create a static web build:

```bash
npx expo export:web
```

This will create a `web-build` directory with all the static files needed for deployment.

**Alternative:** If you're using Expo SDK 50+, you can also use:

```bash
npx expo export -p web
```

## 🌐 Step 3: Choose a Hosting Platform

You have several options for hosting. Here are the most popular:

### Option A: Vercel (Recommended - Easiest)

Vercel is excellent for React/Next.js apps and works great with Expo web builds.

#### Steps:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd web-build
   vercel
   ```
   
   Or deploy from the project root:
   ```bash
   vercel --cwd web-build
   ```

4. **Set Environment Variables:**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add:
     - `EXPO_PUBLIC_SUPABASE_URL`
     - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - Redeploy after adding variables

5. **Automatic Deployments:**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically deploy on every push to main/master

#### Vercel Configuration (Optional)

Create a `vercel.json` in your project root:

```json
{
  "buildCommand": "npx expo export:web",
  "outputDirectory": "web-build",
  "devCommand": "npx expo start --web",
  "installCommand": "npm install",
  "framework": null
}
```

### Option B: Netlify

Netlify is another great option with a free tier.

#### Steps:

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   cd web-build
   netlify deploy --prod
   ```

4. **Set Environment Variables:**
   - Go to Netlify dashboard
   - Site settings → Environment variables
   - Add your environment variables

5. **Continuous Deployment:**
   - Connect your Git repository
   - Build command: `npx expo export:web`
   - Publish directory: `web-build`

#### Netlify Configuration

Create a `netlify.toml` in your project root:

```toml
[build]
  command = "npx expo export:web"
  publish = "web-build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option C: GitHub Pages

Free hosting through GitHub, but requires a bit more setup.

#### Steps:

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json:**
   ```json
   "scripts": {
     "deploy": "npx expo export:web && gh-pages -d web-build"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages:**
   - Go to your GitHub repository
   - Settings → Pages
   - Source: `gh-pages` branch
   - Save

**Note:** GitHub Pages doesn't support environment variables directly. You'll need to use a different approach or use a different hosting service.

### Option D: Other Platforms

- **Firebase Hosting:** `firebase deploy`
- **AWS S3 + CloudFront:** Upload `web-build` to S3 bucket
- **Surge.sh:** `surge web-build`
- **Render:** Connect Git repo, set build command

## 🔐 Step 4: Configure Environment Variables

For all platforms, you need to set environment variables:

### Required Variables:
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

### How to Set:

**Vercel:**
- Dashboard → Project → Settings → Environment Variables

**Netlify:**
- Dashboard → Site settings → Environment variables

**Other platforms:**
- Check their documentation for environment variable configuration

**Important:** After adding environment variables, you'll need to rebuild/redeploy your site.

## 🌍 Step 5: Custom Domain (Optional)

### 5.1 Get a Domain

Purchase a domain from:
- Namecheap
- Google Domains
- GoDaddy
- Cloudflare

### 5.2 Configure DNS

**For Vercel:**
1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions
4. Update your domain's DNS records

**For Netlify:**
1. Go to Site settings → Domain management
2. Add custom domain
3. Follow DNS setup instructions

## ✅ Step 6: Verify Deployment

1. Visit your deployed URL
2. Test all features:
   - 3D globe loads correctly
   - Location markers work
   - Video playback works
   - Chatbot functions properly
   - Supabase connection works (if applicable)

## 🔄 Step 7: Continuous Deployment (Recommended)

Set up automatic deployments:

1. **Push your code to GitHub/GitLab/Bitbucket**
2. **Connect your repository to your hosting platform**
3. **Configure build settings:**
   - Build command: `npx expo export:web`
   - Output directory: `web-build`
   - Node version: 18 or higher
4. **Add environment variables in the platform dashboard**
5. **Every push to main/master will automatically deploy**

## 🐛 Troubleshooting

### Issue: Blank page after deployment

**Solution:**
- Check browser console for errors
- Verify environment variables are set correctly
- Ensure all assets are loading (check Network tab)
- Make sure routing is configured correctly (SPA redirects)

### Issue: Environment variables not working

**Solution:**
- Variables must start with `EXPO_PUBLIC_` to be accessible in the browser
- Rebuild and redeploy after adding variables
- Clear browser cache

### Issue: Assets not loading

**Solution:**
- Check that `web-build` directory includes all assets
- Verify asset paths are correct
- Check CORS settings if loading from external sources

### Issue: 3D Globe not rendering

**Solution:**
- Check browser console for WebGL errors
- Verify texture files are included in build
- Test in different browsers (Chrome, Firefox, Safari)

## 📝 Quick Reference Commands

```bash
# Build for web
npx expo export:web

# Test locally
npm run web

# Deploy to Vercel
cd web-build && vercel

# Deploy to Netlify
cd web-build && netlify deploy --prod

# Deploy to GitHub Pages
npm run deploy
```

## 🔒 Security Notes

1. **Never commit:**
   - `.env` files
   - API keys
   - Service role keys

2. **Use environment variables** for all sensitive data

3. **Only expose public keys** (like Supabase anon key) - never service role keys

4. **Enable CORS** properly in Supabase if needed

## 📚 Additional Resources

- [Expo Web Documentation](https://docs.expo.dev/workflow/web/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Expo Deployment Guide](https://docs.expo.dev/distribution/publishing-websites/)

## 🎉 You're Done!

Your website should now be publicly accessible! Share the URL with others and enjoy your deployed app.

---

**Need Help?** Check the troubleshooting section or refer to your hosting platform's documentation.

