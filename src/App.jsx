import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import { BarChart3, TrendingUp, Search, Brain, GitCompare } from 'lucide-react'
import Dashboard from './components/Dashboard'
import EpisodeExplorer from './components/EpisodeExplorer'
import Analytics from './components/Analytics'
import TopicAnalysis from './components/TopicAnalysis'
import Comparisons from './components/Comparisons'
import './App.css'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  // Helper function to parse numeric values from CSV
  const parseNumber = (value) => {
    // Handle null, undefined, or empty string
    if (value === null || value === undefined || value === '') return 0
    
    // Handle strings (including dashes and special characters)
    if (typeof value === 'string') {
      // Replace en-dash, em-dash, or hyphen with empty string
      const cleaned = value.trim().replace(/[–—-]/g, '')
      
      // If nothing left after removing dashes, return 0
      if (cleaned === '' || cleaned === '–' || cleaned === '—') return 0
      
      // Remove commas and parse
      const parsed = parseInt(cleaned.replace(/,/g, ''), 10)
      return isNaN(parsed) ? 0 : parsed
    }
    
    // Handle numbers
    if (typeof value === 'number') {
      return isNaN(value) ? 0 : Math.round(value)
    }
    
    return 0
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/podcast-metrics-dashboard/data/podcast-metrics.csv')
        const csvText = await response.text()
        
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: false, // Keep as strings to handle dashes properly
          skipEmptyLines: true,
          transformHeader: (header) => {
            // Normalize header names
            return header.trim()
          },
          complete: (results) => {
            console.log('Raw CSV data sample:', results.data[0]) // Debug log
            
            const processedData = results.data.map(row => {
              const processed = {
                slug: row.Slug || row.slug || '',
                title: row.Title || row.title || '',
                published: row.Published || row.published ? new Date(row.Published || row.published) : new Date(),
                day1: parseNumber(row['1 Day']),
                day7: parseNumber(row['7 Days']),
                day14: parseNumber(row['14 Days']),
                day30: parseNumber(row['30 Days']),
                day90: parseNumber(row['90 Days']),
                spotify: parseNumber(row['Spotify'] || row.spotify),
                allTime: parseNumber(row['All Time'] || row.allTime),
              }
              
              // Debug log for first few rows
              if (parseInt(row.Slug) <= 482 && parseInt(row.Slug) >= 480) {
                console.log(`Episode ${row.Slug}:`, {
                  title: processed.title,
                  day1Raw: row['1 Day'],
                  day1Parsed: processed.day1,
                  allTimeRaw: row['All Time'],
                  allTimeParsed: processed.allTime
                })
              }
              
              return processed
            })
            
            const validData = processedData.filter(row => row.title && row.title.length > 0)
            console.log(`Loaded ${validData.length} episodes`) // Debug log
            
            setData(validData)
            setLoading(false)
          },
          error: (error) => {
            console.error('CSV Parse Error:', error)
            setError('Failed to parse CSV data: ' + error.message)
            setLoading(false)
          }
        })
      } catch (err) {
        console.error('Load Error:', err)
        setError('Failed to load data: ' + err.message)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'explorer', label: 'Episodes', icon: Search },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'topics', label: 'Topics', icon: Brain },
    { id: 'compare', label: 'Compare', icon: GitCompare },
  ]

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading podcast metrics...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <div className="container">
          <div className="error">
            <h2>Error Loading Data</h2>
            <p>{error}</p>
            <p style={{ fontSize: '0.9em', marginTop: '1em' }}>
              Check the browser console for more details.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="app">
        <div className="container">
          <div className="error">
            <h2>No Data Found</h2>
            <p>Please make sure your CSV file is uploaded to <code>public/data/podcast-metrics.csv</code></p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <button 
            className="logo"
            onClick={() => setActiveTab('dashboard')}
            aria-label="Go to home page"
          >
            <BarChart3 size={32} />
            <h1>Podcast Metrics</h1>
          </button>
          <nav className="nav">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      <main className="container">
        {activeTab === 'dashboard' && <Dashboard data={data} />}
        {activeTab === 'explorer' && <EpisodeExplorer data={data} />}
        {activeTab === 'analytics' && <Analytics data={data} />}
        {activeTab === 'topics' && <TopicAnalysis data={data} />}
        {activeTab === 'compare' && <Comparisons data={data} />}
      </main>
    </div>
  )
}

export default App
