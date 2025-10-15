import { useState } from 'react'
import { Hash, TrendingUp, Search } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { analyzeTopics, findRelatedEpisodes } from '../utils/analytics'
import { formatNumber } from '../utils/dataProcessor'

export default function TopicAnalysis({ data }) {
  const [searchTopic, setSearchTopic] = useState('')
  const [selectedEpisode, setSelectedEpisode] = useState(null)
  
  const topics = analyzeTopics(data)
  const filteredTopics = topics.filter(t => 
    searchTopic === '' || t.topic.toLowerCase().includes(searchTopic.toLowerCase())
  )

  const topTopics = filteredTopics.slice(0, 20)
  const chartData = topTopics.map(t => ({
    topic: t.topic,
    frequency: t.frequency,
    avgPerformance: t.avgPerformance,
  }))

  const relatedEpisodes = selectedEpisode ? findRelatedEpisodes(selectedEpisode, data, 5) : []

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Topics</div>
          <div className="stat-value">{topics.length}</div>
          <div className="stat-change">
            <Hash size={16} />
            Unique topics identified
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Most Frequent Topic</div>
          <div className="stat-value">{topics[0]?.topic || 'N/A'}</div>
          <div className="stat-change">
            {topics[0] && `${topics[0].frequency} episodes`}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Best Performing Topic</div>
          <div className="stat-value">
            {[...topics].sort((a, b) => b.avgPerformance - a.avgPerformance)[0]?.topic || 'N/A'}
          </div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            {[...topics].sort((a, b) => b.avgPerformance - a.avgPerformance)[0]?.avgPerformance.toLocaleString() || 0} avg
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Avg Topic Frequency</div>
          <div className="stat-value">
            {topics.length > 0 ? Math.round(topics.reduce((sum, t) => sum + t.frequency, 0) / topics.length) : 0}
          </div>
          <div className="stat-change">
            Episodes per topic
          </div>
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label className="filter-label">Search Topics</label>
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input"
              placeholder="Search topics..."
              value={searchTopic}
              onChange={(e) => setSearchTopic(e.target.value)}
              style={{ paddingLeft: '3rem' }}
            />
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h2 className="card-title">Top 20 Topics by Frequency</h2>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" stroke="#94a3b8" />
            <YAxis dataKey="topic" type="category" width={150} stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ 
                background: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9'
              }} 
            />
            <Bar dataKey="frequency" fill="#6366f1" name="Frequency" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2 className="card-title">Topic Performance Table</h2>
        <div className="table-container" style={{ maxHeight: '600px', overflow: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Topic</th>
                <th>Frequency</th>
                <th>Avg Performance</th>
                <th>Performance Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredTopics.map((topic, idx) => {
                const performance = topic.avgPerformance > 5000 ? 'high' : topic.avgPerformance > 2500 ? 'medium' : 'low'
                return (
                  <tr key={topic.topic}>
                    <td>
                      <span className={idx < 3 ? 'badge badge-warning' : 'badge'}>
                        #{idx + 1}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{topic.topic}</td>
                    <td>{topic.frequency}</td>
                    <td style={{ fontWeight: 600 }}>{formatNumber(topic.avgPerformance)}</td>
                    <td>
                      <span className={`badge badge-${performance === 'high' ? 'success' : performance === 'medium' ? 'warning' : 'danger'}`}>
                        {performance}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2 className="card-title">Find Related Episodes</h2>
        <div className="filters">
          <div className="filter-group">
            <label className="filter-label">Select Episode</label>
            <select
              className="input"
              value={selectedEpisode?.slug || ''}
              onChange={(e) => {
                const episode = data.find(ep => ep.slug === e.target.value)
                setSelectedEpisode(episode)
              }}
            >
              <option value="">Choose an episode...</option>
              {data.map(ep => (
                <option key={ep.slug} value={ep.slug}>
                  {ep.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {relatedEpisodes.length > 0 && (
          <div className="card" style={{ marginTop: '1rem' }}>
            <h3 className="card-title">Related Episodes</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Published</th>
                    <th>All Time Downloads</th>
                  </tr>
                </thead>
                <tbody>
                  {relatedEpisodes.map(ep => (
                    <tr key={ep.slug}>
                      <td style={{ fontWeight: 500 }}>{ep.title}</td>
                      <td>{ep.published.toLocaleDateString()}</td>
                      <td>{formatNumber(ep.allTime)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
