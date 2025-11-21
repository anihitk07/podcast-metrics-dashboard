import { TrendingUp, TrendingDown, Users, Calendar, Award, Clock } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatNumber, calculateAverageMetrics, getTopPerformers, getGrowthTrend } from '../utils/dataProcessor'
import { useSortableTable } from '../hooks/useSortableTable'
import SortableTableHeader from './SortableTableHeader'

export default function Dashboard({ data }) {
  const totalEpisodes = data.length
  const totalDownloads = data.reduce((sum, ep) => sum + (ep.allTime || 0), 0)
  const averages = calculateAverageMetrics(data)
  const topEpisodes = getTopPerformers(data, 'allTime', 5)
  const growthData = getGrowthTrend(data, 'day7').slice(-30)

  const recent = data.slice(-10)
  const older = data.slice(-20, -10)
  const recentAvg = recent.reduce((sum, ep) => sum + (ep.day7 || 0), 0) / recent.length
  const olderAvg = older.reduce((sum, ep) => sum + (ep.day7 || 0), 0) / older.length
  const growthRate = ((recentAvg - olderAvg) / olderAvg * 100).toFixed(1)

  const chartData = topEpisodes.map(ep => ({
    name: ep.title.substring(0, 30) + '...',
    'All Time': ep.allTime,
    '30 Days': ep.day30,
    '7 Days': ep.day7,
  }))

  // Add sortable table functionality
  const { sortedData, sortKey, sortOrder, handleSort } = useSortableTable(topEpisodes, 'allTime', 'desc')

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Episodes</div>
          <div className="stat-value">{formatNumber(totalEpisodes)}</div>
          <div className="stat-change">
            <Calendar size={16} />
            {data[0] ? `Latest: ${data[0].published.toLocaleDateString()}` : ''}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Downloads</div>
          <div className="stat-value">{formatNumber(totalDownloads)}</div>
          <div className="stat-change">
            <Users size={16} />
            Across all episodes
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Avg 7-Day Downloads</div>
          <div className="stat-value">{formatNumber(averages.avgDay7)}</div>
          <div className={`stat-change ${growthRate >= 0 ? 'positive' : 'negative'}`}>
            {growthRate >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(growthRate)}% vs previous 10
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Avg All-Time Downloads</div>
          <div className="stat-value">{formatNumber(averages.avgAllTime)}</div>
          <div className="stat-change">
            <Clock size={16} />
            Per episode average
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h2 className="card-title">Recent Episode Performance (7-Day Downloads)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ 
                background: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9'
              }} 
            />
            <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2 className="card-title">
          <Award size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
          Top 5 Performing Episodes
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" stroke="#94a3b8" />
            <YAxis dataKey="name" type="category" width={200} stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ 
                background: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9'
              }} 
            />
            <Legend />
            <Bar dataKey="7 Days" fill="#8b5cf6" />
            <Bar dataKey="30 Days" fill="#6366f1" />
            <Bar dataKey="All Time" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2 className="card-title">Top Performing Episodes</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <SortableTableHeader sortKey={null} currentSortKey={sortKey} currentSortOrder={sortOrder} onSort={handleSort}>
                  Rank
                </SortableTableHeader>
                <SortableTableHeader sortKey="title" currentSortKey={sortKey} currentSortOrder={sortOrder} onSort={handleSort}>
                  Title
                </SortableTableHeader>
                <SortableTableHeader sortKey="published" currentSortKey={sortKey} currentSortOrder={sortOrder} onSort={handleSort}>
                  Published
                </SortableTableHeader>
                <SortableTableHeader sortKey="day7" currentSortKey={sortKey} currentSortOrder={sortOrder} onSort={handleSort}>
                  7 Days
                </SortableTableHeader>
                <SortableTableHeader sortKey="day30" currentSortKey={sortKey} currentSortOrder={sortOrder} onSort={handleSort}>
                  30 Days
                </SortableTableHeader>
                <SortableTableHeader sortKey="allTime" currentSortKey={sortKey} currentSortOrder={sortOrder} onSort={handleSort}>
                  All Time
                </SortableTableHeader>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((ep) => {
                const rank = topEpisodes.findIndex(e => e.slug === ep.slug) + 1
                return (
                <tr key={ep.slug}>
                  <td>
                    <span className={rank === 1 ? 'badge badge-warning' : 'badge'}>
                      #{rank}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{ep.title}</td>
                  <td>{ep.published.toLocaleDateString()}</td>
                  <td>{formatNumber(ep.day7)}</td>
                  <td>{formatNumber(ep.day30)}</td>
                  <td style={{ fontWeight: 600, color: 'var(--success)' }}>
                    {formatNumber(ep.allTime)}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
