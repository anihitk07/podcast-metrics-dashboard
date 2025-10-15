# 🚀 Setup Instructions

## Step-by-Step Guide to Deploy Your Podcast Metrics Dashboard

### Prerequisites
✅ Node.js 18 or higher  
✅ npm or yarn  
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
   - Navigate to `public/data/podcast-metrics.csv`
   - Replace it with your CSV file from the attachment you provided
   
2. **Ensure your CSV has these columns**:
   ```
   Slug, Title, Published, 1 Day, 7 Days, 14 Days, 30 Days, 90 Days, Spotify, All Time
   ```

---

## 📦 Step 3: Install Dependencies

```bash
npm install
```

This will install:
- React 18.3.1
- Vite 5.4.2
- Recharts 2.12.0
- PapaP arse 5.4.1
- date-fns 3.3.1
- Lucide React 0.344.0

---

## 🎨 Step 4: Test Locally

```bash
npm run dev
```

Visit `http://localhost:5173` to see your dashboard in action!

---

## 🌐 Step 5: Deploy to GitHub Pages

### Option A: Automatic Deployment (Recommended)

1. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Build and deployment":
     - Source: **GitHub Actions**

2. **Create the workflow file**:
   Create `.github/workflows/deploy.yml` with this content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

3. **Commit and push**:
```bash
git add .
git commit -m "Add workflow and data"
git push origin main
```

4. **Wait for deployment**:
   - Go to **Actions** tab in your repository
   - Watch the deployment progress
   - Once complete, your site will be live at:
     `https://anihitk07.github.io/podcast-metrics-dashboard/`

### Option B: Manual Deployment

```bash
# Build the project
npm run build

# The dist folder contains your production files
# You can deploy the dist folder to any static hosting service
```

---

## 🎯 Features You'll Get

### 📊 Dashboard
- Total episodes and downloads statistics
- Growth rate calculations
- Recent performance trends with line charts
- Top 5 performing episodes bar chart
- Detailed performance table

### 🔍 Episode Explorer
- Search episodes by title or slug
- Sort by any metric (date, downloads, etc.)
- Filter by performance level (high/medium/low)
- Export filtered results to CSV

### 📈 Analytics
- Monthly performance trends
- Best days to publish analysis
- Content pattern detection (numbers, questions, tech topics)
- Performance spike/drop identification
- Scatter plot correlation analysis

### 🧠 Topic Analysis
- Automatic topic extraction from episode titles
- Top 20 topics by frequency visualization
- Performance by topic analysis
- Related episode discovery

### ⚖️ Episode Comparison
- Compare up to 5 episodes side-by-side
- Bar chart comparison across all metrics
- Normalized radar chart visualization
- Detailed comparison table

---

## 🛠️ Customization

### Change Colors
Edit `src/index.css` to modify the color scheme:
```css
:root {
  --primary: #6366f1;  /* Main brand color */
  --secondary: #8b5cf6; /* Secondary color */
  --success: #10b981;   /* Success/positive color */
  --warning: #f59e0b;   /* Warning color */
  --danger: #ef4444;    /* Danger/negative color */
}
```

### Adjust Chart Heights
Modify `ResponsiveContainer` height values in component files:
```jsx
<ResponsiveContainer width="100%" height={400}>
```

### Change CSV Path
If your CSV is in a different location, update `src/App.jsx`:
```jsx
const response = await fetch('/your-path/podcast-metrics.csv')
```

---

## 🐛 Troubleshooting

### Issue: "Failed to load data"
**Solution**: Make sure your CSV file is in `public/data/podcast-metrics.csv`

### Issue: Charts not displaying
**Solution**: Ensure your CSV has proper date format (YYYY-MM-DD)

### Issue: 404 on GitHub Pages
**Solution**: Check that `base` in `vite.config.js` matches your repository name:
```js
base: '/podcast-metrics-dashboard/'
```

### Issue: Blank page after deployment
**Solution**: 
1. Check browser console for errors
2. Verify GitHub Pages is enabled in repository settings
3. Make sure workflow ran successfully in Actions tab

---

## 📱 Mobile Responsiveness

The dashboard is fully responsive and works on:
- 📱 Mobile phones
- 📱 Tablets  
- 💻 Laptops
- 🖥️ Desktops

---

## 🔒 Privacy & Security

- All data processing happens client-side
- No data is sent to external servers
- CSV file is loaded from your own hosting
- Perfect for private podcast analytics

---

## 🤝 Need Help?

- 📝 Open an issue on GitHub
- 💬 Check existing issues for solutions
- 📧 Contact the repository owner

---

## 🎉 You're All Set!

Your beautiful podcast metrics dashboard is ready to use!

**Next Steps:**
1. ✅ Test all features locally
2. ✅ Add your real CSV data
3. ✅ Push to GitHub
4. ✅ Watch it deploy automatically
5. ✅ Share your dashboard URL with your team!

---

**Happy Analyzing! 📊🎙️**
