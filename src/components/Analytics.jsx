import { TrendingUp, Calendar, BarChart3, Target } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts'
import { detectSeasonality, findBestPerformingTime } from '../utils/dataProcessor'
import { analyzeContentPatterns, detectTrends } from '../utils/analytics'
import { useSortableTable } from '../hooks/useSortableTable'
import SortableTableHeader from './SortableTableHeader'

export default function Analytics({ data }) {
  const seasonalData = detectSeasonality(data)
  const dayPerformance = findBestPerformingTime(data)
  const contentPatterns = analyzeContentPatterns(data)
  const trends = detectTrends(data, 10)

  const patternsData = Object.entries(contentPatterns).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    episodes: value.count,
    avgPerformance: value.avgPerformance,
  }))

  const scatterData = data.map(ep => ({
    day7: ep.day7,
    day30: ep.day30,
    allTime: ep.allTime,
    title: ep.title.substring(0, 40) + '...',
  }))

  // Add sortable table functionality
  const trendsWithEpisode = trends.slice(0, 10).map(trend => ({
    ...trend,
    title: trend.episode.title,
    published: trend.episode.published,
  }))
  const { sortedData: sortedTrends, sortKey, sortOrder, handleSort } = useSortableTable(trendsWithEpisode, 'change', 'desc')

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Performance Trends</div>
          <div className="stat-value">{trends.filter(t => t.type === 'spike').length}</div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            Spike episodes detected
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Best Publishing Day</div>
          <div className="stat-value">{dayPerformance[0]?.day || 'N/A'}</div>
          <div className="stat-change">
            <Calendar size={16} />
            Avg {dayPerformance[0]?.avgDownloads.toLocaleString() || 0} downloads
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Content Patterns</div>
          <div className="stat-value">{Object.keys(contentPatterns).length}</div>
          <div className="stat-change">
            <Target size={16} />
            Pattern types analyzed
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Monthly Avg</div>
          <div className="stat-value">
            {seasonalData.length > 0 
              ? Math.round(seasonalData.reduce((sum, m) => sum + m.avgDownloads, 0) / seasonalData.length).toLocaleString()
              : '0'}
          </div>
          <div className="stat-change">
            <BarChart3 size={16} />
            Across all months
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h2 className="card-title">Monthly Performance Trends</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={seasonalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94a3b8" />
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
            <Line type="monotone" dataKey="avgDownloads" stroke="#6366f1" strokeWidth={2} name="Avg Downloads" />
            <Line type="monotone" dataKey="episodes" stroke="#8b5cf6" strokeWidth={2} name="Episodes Published" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <div className="chart-container">
          <h2 className="card-title">Best Days to Publish</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dayPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  background: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }} 
              />
              <Bar dataKey="avgDownloads" fill="#10b981" name="Avg Downloads" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2 className="card-title">Content Pattern Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={patternsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  background: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }} 
              />
              <Bar dataKey="avgPerformance" fill="#8b5cf6" name="Avg Performance" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-container">
        <h2 className="card-title">Episode Performance Correlation (7-Day vs All-Time)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day7" name="7-Day Downloads" stroke="#94a3b8" />
            <YAxis dataKey="allTime" name="All-Time Downloads" stroke="#94a3b8" />
            <ZAxis range={[50, 400]} />
            <Tooltip 
              contentStyle={{ 
                background: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9'
              }}
              cursor={{ strokeDasharray: '3 3' }}
            />
            <Scatter name="Episodes" data={scatterData} fill="#6366f1" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {trends.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2 className="card-title">Notable Performance Trends</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <SortableTableHeader sortKey="title" currentSortKey={sortKey} currentSortOrder={sortOrder} onSort={handleSort}>
                    Episode
                  </SortableTableHeader>
                  <SortableTableHeader sortKey="published" currentSortKey={sortKey} currentSortOrder={sortOrder} onSort={handleSort}>
                    Published
                  </SortableTableHeader>
                  <SortableTableHeader sortKey="type" currentSortKey={sortKey} currentSortOrder={sortOrder} onSort={handleSort}>
                    Type
                  </SortableTableHeader>
                  <SortableTableHeader sortKey="change" currentSortKey={sortKey} currentSortOrder={sortOrder} onSort={handleSort}>
                    Change
                  </SortableTableHeader>
                </tr>
              </thead>
              <tbody>
                {sortedTrends.map(trend => (
                  <tr key={trend.episode.slug}>
                    <td style={{ fontWeight: 500 }}>{trend.episode.title}</td>
                    <td>{trend.episode.published.toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${trend.type === 'spike' ? 'success' : 'warning'}`}>
                        {trend.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: trend.type === 'spike' ? 'var(--success)' : 'var(--warning)' }}>
                      {trend.change > 0 ? '+' : ''}{trend.change}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
