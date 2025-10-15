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

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/podcast-metrics-dashboard/data/podcast-metrics.csv')
        const csvText = await response.text()
        
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            const processedData = results.data.map(row => ({
              ...row,
              slug: row.Slug || '',
              title: row.Title || '',
              published: new Date(row.Published || ''),
              day1: parseInt(row['1 Day']) || 0,
              day7: parseInt(row['7 Days']) || 0,
              day14: parseInt(row['14 Days']) || 0,
              day30: parseInt(row['30 Days']) || 0,
              day90: parseInt(row['90 Days']) || 0,
              spotify: parseInt(row['Spotify']) || 0,
              allTime: parseInt(row['All Time']) || 0,
            }))
            
            setData(processedData.filter(row => row.title))
            setLoading(false)
          },
          error: (error) => {
            setError('Failed to parse CSV data: ' + error.message)
            setLoading(false)
          }
        })
      } catch (err) {
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
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <BarChart3 size={32} />
            <h1>Podcast Metrics</h1>
          </div>
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
