# GitHub Pages Deployment Guide

This portfolio is configured to automatically deploy to GitHub Pages whenever you push to the main branch.

## Setup Instructions

### 1. Update Astro Configuration

Edit `astro.config.mjs` and replace the placeholders:

```javascript
export default defineConfig({
  integrations: [vue()],
  site: "https://YOUR_USERNAME.github.io",
  base: "/YOUR_REPO_NAME",
});
```

**Example:**

- If your GitHub username is `johndoe`
- And your repo is named `portfolio`
- Then use:
  ```javascript
  site: 'https://johndoe.github.io',
  base: '/portfolio',
  ```

**Note:** If you're using a custom domain or deploying to `username.github.io` (without a repo name), you can omit the `base` option.

### 2. Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**

### 3. Push Your Code

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

### 4. Monitor Deployment

1. Go to the **Actions** tab in your GitHub repository
2. You should see the "Deploy to GitHub Pages" workflow running
3. Once complete (usually 1-2 minutes), your site will be live!

## Workflow Details

The deployment workflow (`.github/workflows/deploy.yml`) does the following:

1. **Triggers** on every push to the `main` branch
2. **Checks out** your code
3. **Installs** Node.js and dependencies
4. **Builds** your Astro site (`npm run build`)
5. **Deploys** the `dist` folder to GitHub Pages

## Manual Deployment

You can also trigger deployment manually:

1. Go to **Actions** tab
2. Select "Deploy to GitHub Pages"
3. Click **Run workflow**
4. Select the branch and click **Run workflow**

## Troubleshooting

### Build Fails

Check the Actions logs for errors. Common issues:

- Missing dependencies in `package.json`
- Build errors in your code
- Incorrect Node.js version

### Site Not Loading

1. Verify GitHub Pages is enabled in Settings
2. Check that `site` and `base` in `astro.config.mjs` match your repository
3. Wait a few minutes - deployment can take time to propagate

### 404 Errors on Navigation

Make sure your `base` path in `astro.config.mjs` matches your repository name.

## Your Site URL

After deployment, your site will be available at:

```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME
```

## Updating Your Site

Simply push changes to the main branch:

```bash
git add .
git commit -m "Update content"
git push origin main
```

The site will automatically rebuild and redeploy!

## Local Development

For local development, the site runs at `http://localhost:4321`:

```bash
npm run dev
```

The `base` path is only used in production builds.
