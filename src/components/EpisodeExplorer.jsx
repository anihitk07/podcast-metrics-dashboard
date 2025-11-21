import { useState } from 'react'
import { Search, Download, Calendar } from 'lucide-react'
import { formatNumber, formatDate } from '../utils/dataProcessor'
import SortableTableHeader from './SortableTableHeader'

export default function EpisodeExplorer({ data }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('published')
  const [sortOrder, setSortOrder] = useState('desc')
  const [filterMetric, setFilterMetric] = useState('all')

  const handleSort = (key) => {
    if (sortBy === key) {
      // Toggle sort order if clicking the same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new sort key and default to descending
      setSortBy(key)
      setSortOrder('desc')
    }
  }

  const filteredData = data
    .filter(ep => {
      if (!searchTerm) return true
      return ep.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             ep.slug.toLowerCase().includes(searchTerm.toLowerCase())
    })
    .filter(ep => {
      if (filterMetric === 'all') return true
      if (filterMetric === 'high') return (ep.allTime || 0) > 5000
      if (filterMetric === 'medium') return (ep.allTime || 0) > 2000 && (ep.allTime || 0) <= 5000
      if (filterMetric === 'low') return (ep.allTime || 0) <= 2000
      return true
    })
    .sort((a, b) => {
      let aVal, bVal
      
      if (sortBy === 'published') {
        aVal = a.published
        bVal = b.published
      } else {
        aVal = a[sortBy] || 0
        bVal = b[sortBy] || 0
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

  const exportToCSV = () => {
    const headers = ['Title', 'Published', '1 Day', '7 Days', '30 Days', 'All Time']
    const rows = filteredData.map(ep => [
      ep.title,
      formatDate(ep.published),
      ep.day1,
      ep.day7,
      ep.day30,
      ep.allTime
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'podcast-episodes.csv'
    a.click()
  }

  return (
    <div>
      <div className="filters">
        <div className="filter-group">
          <label className="filter-label">Search Episodes</label>
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input"
              placeholder="Search by title or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '3rem' }}
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Sort By</label>
          <select
            className="input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="published">Published Date</option>
            <option value="day1">1 Day Downloads</option>
            <option value="day7">7 Day Downloads</option>
            <option value="day30">30 Day Downloads</option>
            <option value="allTime">All Time Downloads</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Order</label>
          <select
            className="input"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Performance</label>
          <select
            className="input"
            value={filterMetric}
            onChange={(e) => setFilterMetric(e.target.value)}
          >
            <option value="all">All Episodes</option>
            <option value="high">High (&gt;5K)</option>
            <option value="medium">Medium (2K-5K)</option>
            <option value="low">Low (&lt;2K)</option>
          </select>
        </div>

        <div className="filter-group" style={{ justifyContent: 'flex-end' }}>
          <label className="filter-label">&nbsp;</label>
          <button className="button" onClick={exportToCSV}>
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          Found {filteredData.length} episode{filteredData.length !== 1 ? 's' : ''}
        </div>

        <div className="table-container" style={{ maxHeight: '600px', overflow: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <SortableTableHeader sortKey="title" currentSortKey={sortBy} currentSortOrder={sortOrder} onSort={handleSort}>
                  Title
                </SortableTableHeader>
                <SortableTableHeader sortKey="published" currentSortKey={sortBy} currentSortOrder={sortOrder} onSort={handleSort}>
                  <Calendar size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />Published
                </SortableTableHeader>
                <SortableTableHeader sortKey="day1" currentSortKey={sortBy} currentSortOrder={sortOrder} onSort={handleSort}>
                  1 Day
                </SortableTableHeader>
                <SortableTableHeader sortKey="day7" currentSortKey={sortBy} currentSortOrder={sortOrder} onSort={handleSort}>
                  7 Days
                </SortableTableHeader>
                <SortableTableHeader sortKey="day14" currentSortKey={sortBy} currentSortOrder={sortOrder} onSort={handleSort}>
                  14 Days
                </SortableTableHeader>
                <SortableTableHeader sortKey="day30" currentSortKey={sortBy} currentSortOrder={sortOrder} onSort={handleSort}>
                  30 Days
                </SortableTableHeader>
                <SortableTableHeader sortKey="allTime" currentSortKey={sortBy} currentSortOrder={sortOrder} onSort={handleSort}>
                  All Time
                </SortableTableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(ep => {
                const performance = ep.allTime > 5000 ? 'high' : ep.allTime > 2000 ? 'medium' : 'low'
                return (
                  <tr key={ep.slug}>
                    <td>
                      <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{ep.title}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{ep.slug}</div>
                    </td>
                    <td>{formatDate(ep.published)}</td>
                    <td>{formatNumber(ep.day1)}</td>
                    <td>{formatNumber(ep.day7)}</td>
                    <td>{formatNumber(ep.day14)}</td>
                    <td>{formatNumber(ep.day30)}</td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{formatNumber(ep.allTime)}</span>
                      <span className={`badge badge-${performance === 'high' ? 'success' : performance === 'medium' ? 'warning' : 'danger'}`} style={{ marginLeft: '0.5rem' }}>
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
    </div>
  )
}
