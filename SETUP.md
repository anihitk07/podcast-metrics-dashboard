# 🚀 Setup & Deployment Instructions

## Quick Deploy to GitHub Pages

### Prerequisites
✅ Node.js 18 or higher  
✅ npm installed  
✅ Git installed  
✅ GitHub account

---

## 📥 Step 1: Clone the Repository

```bash
git clone https://github.com/anihitk07/podcast-metrics-dashboard.git
cd podcast-metrics-dashboard
```

---

## 📊 Step 2: Add Your Podcast Data

1. **Replace the sample CSV file** with your actual podcast metrics:
   ```bash
   # Copy your CSV file to the public/data directory
   cp /path/to/your/podcast-metrics.csv public/data/podcast-metrics.csv
   ```

2. **Ensure your CSV has these exact columns**:
   ```
   Slug, Title, Published, 1 Day, 7 Days, 14 Days, 30 Days, 90 Days, Spotify, All Time
   ```

3. **CSV Format Notes**:
   - Dates should be in `YYYY-MM-DD` format
   - Use dashes (`–`) for missing values (they'll be parsed as 0)
   - Numbers can include commas (e.g., `1,234`)

---

## 📦 Step 3: Install Dependencies

```bash
npm install
```

---

## 🎨 Step 4: Test Locally

```bash
npm run dev
```

Visit `http://localhost:5173` to see your dashboard!

**Open browser console (F12)** to see debug logs:
- Raw CSV data sample
- Parsed values for verification
- Total episodes loaded

---

## 🌐 Step 5: Create GitHub Actions Workflow

Since GitHub API doesn't allow creating nested directories remotely, you need to create the workflow file locally:

### Create the file:

```bash
# Create the directories
mkdir -p .github/workflows

# Create the workflow file
# Copy the content below into .github/workflows/deploy.yml
```

### Workflow File Content (`.github/workflows/deploy.yml`):

```yaml
name: Deploy Podcast Dashboard to Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v5
        
      - name: Set up Node
        uses: actions/setup-node@v5
        with:
          node-version: lts/*
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Setup Pages
        uses: actions/configure-pages@v5
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: './dist'
          
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 🚀 Step 6: Enable GitHub Pages

1. Go to your repository: https://github.com/anihitk07/podcast-metrics-dashboard
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under "Build and deployment":
   - **Source**: Select **"GitHub Actions"**
4. Save (if prompted)

---

## 📤 Step 7: Commit and Deploy

```bash
# Add all files
git add .

# Commit your changes
git commit -m "Add workflow and full CSV data"

# Push to GitHub
git push origin main
```

---

## ✅ Step 8: Monitor Deployment

1. Go to the **Actions** tab in your repository:
   https://github.com/anihitk07/podcast-metrics-dashboard/actions

2. You'll see "Deploy Podcast Dashboard to Pages" workflow running

3. Wait for it to complete (usually 1-2 minutes)

4. Once the green checkmark appears, your site is live at:
   **https://anihitk07.github.io/podcast-metrics-dashboard/**

---

## 🎯 What You'll Get

### 📊 Dashboard Tab
- Total episodes & downloads stats
- Growth rate calculations
- Performance trends (line chart)
- Top 5 episodes (bar chart)
- Detailed performance table

### 🔍 Episodes Tab
- Search by title/slug
- Sort by any metric
- Filter by performance level
- Export to CSV

### 📈 Analytics Tab
- Monthly trends
- Best publishing days
- Content patterns
- Performance spikes/drops
- Correlation scatter plots

### 🧠 Topics Tab
- AI-powered keyword extraction
- Topic frequency charts
- Performance by topic
- Related episode finder

### ⚖️ Compare Tab
- Multi-episode comparison (up to 5)
- Side-by-side bar charts
- Radar chart visualization
- Detailed metrics table

---

## 🎨 Customization Guide

### Change Theme Colors

Edit `src/index.css`:

```css
:root {
  --primary: #6366f1;    /* Change main color */
  --secondary: #8b5cf6;  /* Change secondary color */
  --success: #10b981;    /* Change success color */
  --warning: #f59e0b;    /* Change warning color */
  --danger: #ef4444;     /* Change danger color */
}
```

### Modify Chart Heights

In any component file (e.g., `src/components/Dashboard.jsx`):

```jsx
<ResponsiveContainer width="100%" height={400}>
  {/* Change 400 to your preferred height */}
</ResponsiveContainer>
```

### Change CSV Path

If you need a different CSV location, edit `src/App.jsx`:

```jsx
const response = await fetch('/your-custom-path/data.csv')
```

---

## 🐛 Troubleshooting

### Problem: "Failed to load data"
**Solution**: 
- Check that CSV is at `public/data/podcast-metrics.csv`
- Verify CSV format matches expected columns
- Check browser console for specific errors

### Problem: Numbers look wrong
**Solution**: 
- The app now handles dashes (`–`) correctly
- Check console logs to see raw vs parsed values
- Ensure no extra spaces in CSV values

### Problem: Charts not showing
**Solution**: 
- Verify dates are in `YYYY-MM-DD` format
- Check that numeric columns contain valid numbers or dashes
- Look for JavaScript errors in console

### Problem: 404 on GitHub Pages
**Solution**: 
- Verify `vite.config.js` has correct base path:
  ```js
  base: '/podcast-metrics-dashboard/'
  ```
- Check that GitHub Pages is enabled in Settings
- Ensure workflow ran successfully

### Problem: Blank page after deployment
**Solution**: 
1. Check browser console (F12) for errors
2. Verify Actions workflow completed successfully
3. Wait a few minutes for DNS propagation
4. Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Problem: Old data showing after update
**Solution**:
- Clear browser cache
- Hard refresh (Ctrl+F5)
- Check that new CSV is committed to repo

---

## 🔧 Advanced Configuration

### Add More Metrics

1. Update CSV with new columns
2. Modify `src/App.jsx` parseNumber logic
3. Add new fields to components as needed

### Change Episode Count Limits

In components like `Dashboard.jsx`:

```jsx
const topEpisodes = getTopPerformers(data, 'allTime', 10) // Change 10 to show more
```

### Modify Topic Extraction

Edit `src/utils/analytics.js`:

```javascript
export const extractKeywords = (title, minLength = 3) => {
  // Adjust minLength to change keyword detection
}
```

---

## 📱 Mobile Support

The dashboard is fully responsive:
- ✅ Phones (320px+)
- ✅ Tablets (768px+)
- ✅ Laptops (1024px+)
- ✅ Desktops (1440px+)

Test responsiveness:
1. Open dev tools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different screen sizes

---

## 🔒 Privacy & Security

- ✅ **Client-side only**: All processing happens in your browser
- ✅ **No external APIs**: No data sent to third parties
- ✅ **Your hosting**: CSV is served from your GitHub repo
- ✅ **Open source**: Fully auditable code

---

## 📊 Performance Tips

1. **Large CSV files**: The app handles 400+ episodes smoothly
2. **Browser caching**: CSV is cached after first load
3. **Build optimization**: Vite creates optimized production builds
4. **Lazy loading**: Components load only when needed

---

## 🆘 Getting Help

1. **Check console logs**: Press F12 and look for errors
2. **Review this guide**: Most issues are covered above
3. **Check GitHub Actions**: Verify workflow succeeded
4. **Open an issue**: https://github.com/anihitk07/podcast-metrics-dashboard/issues

---

## ✅ Deployment Checklist

- [ ] Cloned repository
- [ ] Installed dependencies (`npm install`)
- [ ] Added full CSV data to `public/data/podcast-metrics.csv`
- [ ] Tested locally (`npm run dev`)
- [ ] Created `.github/workflows/deploy.yml`
- [ ] Enabled GitHub Pages (Settings → Pages → Source: GitHub Actions)
- [ ] Committed and pushed all changes
- [ ] Verified Actions workflow succeeded
- [ ] Visited live site: https://anihitk07.github.io/podcast-metrics-dashboard/

---

## 🎉 You're Ready!

Your podcast metrics dashboard is now deployed and ready to use!

**Live URL**: https://anihitk07.github.io/podcast-metrics-dashboard/

**Key Features**:
- 📊 Beautiful visualizations
- 🔍 Powerful search & filtering
- 📈 Advanced analytics
- 🧠 AI topic extraction
- ⚖️ Episode comparisons
- 📱 Mobile responsive
- 🚀 Auto-deploys on push

**Happy Analyzing! 📊🎙️✨**
