import { useState } from 'react'
import { Plus, X, BarChart3 } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { formatNumber, formatDate } from '../utils/dataProcessor'

export default function Comparisons({ data }) {
  const [selectedEpisodes, setSelectedEpisodes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const addEpisode = (episode) => {
    if (selectedEpisodes.length < 5 && !selectedEpisodes.find(ep => ep.slug === episode.slug)) {
      setSelectedEpisodes([...selectedEpisodes, episode])
      setSearchTerm('')
    }
  }

  const removeEpisode = (slug) => {
    setSelectedEpisodes(selectedEpisodes.filter(ep => ep.slug !== slug))
  }

  const filteredData = data.filter(ep =>
    searchTerm && ep.title.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10)

  const comparisonChartData = [
    {
      metric: '1 Day',
      ...selectedEpisodes.reduce((acc, ep, idx) => ({ ...acc, [`Episode ${idx + 1}`]: ep.day1 }), {})
    },
    {
      metric: '7 Days',
      ...selectedEpisodes.reduce((acc, ep, idx) => ({ ...acc, [`Episode ${idx + 1}`]: ep.day7 }), {})
    },
    {
      metric: '14 Days',
      ...selectedEpisodes.reduce((acc, ep, idx) => ({ ...acc, [`Episode ${idx + 1}`]: ep.day14 }), {})
    },
    {
      metric: '30 Days',
      ...selectedEpisodes.reduce((acc, ep, idx) => ({ ...acc, [`Episode ${idx + 1}`]: ep.day30 }), {})
    },
    {
      metric: 'All Time',
      ...selectedEpisodes.reduce((acc, ep, idx) => ({ ...acc, [`Episode ${idx + 1}`]: ep.allTime }), {})
    },
  ]

  const radarData = [
    {
      metric: '1 Day',
      ...selectedEpisodes.reduce((acc, ep, idx) => ({ 
        ...acc, 
        [`Episode ${idx + 1}`]: Math.min((ep.day1 / 3000) * 100, 100) 
      }), {})
    },
    {
      metric: '7 Days',
      ...selectedEpisodes.reduce((acc, ep, idx) => ({ 
        ...acc, 
        [`Episode ${idx + 1}`]: Math.min((ep.day7 / 5000) * 100, 100) 
      }), {})
    },
    {
      metric: '30 Days',
      ...selectedEpisodes.reduce((acc, ep, idx) => ({ 
        ...acc, 
        [`Episode ${idx + 1}`]: Math.min((ep.day30 / 6000) * 100, 100) 
      }), {})
    },
    {
      metric: 'All Time',
      ...selectedEpisodes.reduce((acc, ep, idx) => ({ 
        ...acc, 
        [`Episode ${idx + 1}`]: Math.min((ep.allTime / 10000) * 100, 100) 
      }), {})
    },
  ]

  const colors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 className="card-title">
          <BarChart3 size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
          Select Episodes to Compare (Max 5)
        </h2>
        
        <div className="filters">
          <div className="filter-group">
            <label className="filter-label">Search Episodes</label>
            <input
              type="text"
              className="input"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {searchTerm && filteredData.length > 0 && (
          <div style={{ 
            marginTop: '1rem', 
            background: 'var(--bg)', 
            border: '1px solid var(--border)', 
            borderRadius: '8px',
            maxHeight: '300px',
            overflow: 'auto'
          }}>
            {filteredData.map(ep => (
              <div
                key={ep.slug}
                onClick={() => addEpisode(ep)}
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ fontWeight: 500 }}>{ep.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {formatDate(ep.published)} • {formatNumber(ep.allTime)} downloads
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedEpisodes.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <div className="filter-label">Selected Episodes ({selectedEpisodes.length}/5)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {selectedEpisodes.map((ep, idx) => (
                <div
                  key={ep.slug}
                  style={{
                    padding: '0.5rem 1rem',
                    background: colors[idx],
                    color: 'white',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <span>{ep.title.substring(0, 40)}...</span>
                  <button
                    onClick={() => removeEpisode(ep.slug)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedEpisodes.length >= 2 && (
        <>
          <div className="chart-container">
            <h2 className="card-title">Downloads Comparison</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={comparisonChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="metric" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    background: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }} 
                />
                <Legend />
                {selectedEpisodes.map((_, idx) => (
                  <Bar key={idx} dataKey={`Episode ${idx + 1}`} fill={colors[idx]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h2 className="card-title">Performance Radar (Normalized)</h2>
            <ResponsiveContainer width="100%" height={500}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="metric" stroke="#94a3b8" />
                <PolarRadiusAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    background: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }} 
                />
                <Legend />
                {selectedEpisodes.map((_, idx) => (
                  <Radar 
                    key={idx} 
                    name={`Episode ${idx + 1}`} 
                    dataKey={`Episode ${idx + 1}`} 
                    stroke={colors[idx]} 
                    fill={colors[idx]} 
                    fillOpacity={0.3} 
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h2 className="card-title">Detailed Comparison</h2>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Episode</th>
                    <th>Published</th>
                    <th>1 Day</th>
                    <th>7 Days</th>
                    <th>30 Days</th>
                    <th>All Time</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEpisodes.map((ep, idx) => (
                    <tr key={ep.slug}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ 
                            width: '12px', 
                            height: '12px', 
                            background: colors[idx], 
                            borderRadius: '50%' 
                          }} />
                          <span style={{ fontWeight: 500 }}>{ep.title}</span>
                        </div>
                      </td>
                      <td>{formatDate(ep.published)}</td>
                      <td>{formatNumber(ep.day1)}</td>
                      <td>{formatNumber(ep.day7)}</td>
                      <td>{formatNumber(ep.day30)}</td>
                      <td style={{ fontWeight: 600, color: 'var(--success)' }}>
                        {formatNumber(ep.allTime)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {selectedEpisodes.length === 0 && (
        <div style={{ 
          padding: '4rem', 
          textAlign: 'center', 
          color: 'var(--text-muted)',
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          border: '1px solid var(--border)'
        }}>
          <Plus size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3>No episodes selected</h3>
          <p>Search and select episodes above to compare their performance</p>
        </div>
      )}

      {selectedEpisodes.length === 1 && (
        <div style={{ 
          padding: '4rem', 
          textAlign: 'center', 
          color: 'var(--text-muted)',
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          border: '1px solid var(--border)'
        }}>
          <Plus size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3>Select at least one more episode</h3>
          <p>Add another episode to start comparing</p>
        </div>
      )}
    </div>
  )
}
