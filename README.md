# 🎙️ Podcast Metrics Dashboard

A beautiful, interactive dashboard for visualizing and analyzing podcast metrics. Built with React, Vite, and Recharts.

![Podcast Metrics Dashboard](https://img.shields.io/badge/Status-Live-success)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.2-purple)

## ✨ Features

### 📊 Dashboard Overview
- Real-time statistics and KPIs
- Episode growth trends visualization
- Top performing episodes leaderboard
- Interactive charts and graphs

### 🔍 Episode Explorer
- Advanced search and filtering
- Sort by multiple metrics
- Performance categorization
- CSV export functionality

### 📈 Analytics & Insights
- Monthly performance trends
- Best days to publish analysis
- Content pattern detection
- Performance spike identification
- Correlation analysis

### 🧠 Topic Analysis
- Automatic topic extraction from episode titles
- Topic frequency analysis
- Performance by topic
- Related episode discovery

### ⚖️ Episode Comparison
- Side-by-side episode comparison
- Visual performance comparison charts
- Radar chart visualization
- Compare up to 5 episodes simultaneously

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/anihitk07/podcast-metrics-dashboard.git

# Navigate to project directory
cd podcast-metrics-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## 📦 Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Recharts** - Data visualization
- **PapaP arse** - CSV parsing
- **date-fns** - Date manipulation
- **Lucide React** - Icon library

## 🎨 Features in Detail

### Dashboard
- Total episodes and downloads
- Average metrics across time periods
- Growth rate calculations
- Recent performance trends

### Analytics
- Seasonality detection
- Day-of-week performance
- Content pattern analysis (numbers, questions, special episodes, tech topics)
- Trend detection with spike/drop identification

### Topic Analysis
- Keyword extraction with stop-word filtering
- Topic frequency tracking
- Performance correlation by topic
- Related episode suggestions

### Comparisons
- Multi-episode selection
- Normalized radar charts
- Detailed metric breakdown
- Visual color coding

## 📁 Project Structure

```
podcast-metrics-dashboard/
├── public/
│   └── data/
│       └── podcast-metrics.csv
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── EpisodeExplorer.jsx
│   │   ├── Analytics.jsx
│   │   ├── TopicAnalysis.jsx
│   │   └── Comparisons.jsx
│   ├── utils/
│   │   ├── dataProcessor.js
│   │   └── analytics.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## 🔧 Configuration

The app is configured to work with GitHub Pages. Update the `base` in `vite.config.js` if deploying elsewhere:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/'
})
```

## 📊 Data Format

The CSV file should have the following columns:
- `Slug` - Episode identifier
- `Title` - Episode title
- `Published` - Publication date (YYYY-MM-DD)
- `1 Day` - Downloads after 1 day
- `7 Days` - Downloads after 7 days
- `14 Days` - Downloads after 14 days
- `30 Days` - Downloads after 30 days
- `90 Days` - Downloads after 90 days
- `Spotify` - Spotify-specific downloads
- `All Time` - Total all-time downloads

## 🎯 Use Cases

Perfect for:
- 📱 Podcast creators analyzing their show performance
- 📊 Content strategists planning episode topics
- 📈 Marketers tracking growth trends
- 🔍 Researchers studying podcast metrics
- 💼 Media companies managing multiple shows

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with ❤️ for podcast creators
- Designed for ease of use and beautiful visualizations
- Powered by modern web technologies

## 📧 Contact

Have questions or suggestions? Open an issue or reach out!

---

**⭐ Star this repo if you find it useful!**
