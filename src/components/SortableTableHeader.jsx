import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

export default function SortableTableHeader({ children, sortKey, currentSortKey, currentSortOrder, onSort }) {
  const isActive = currentSortKey === sortKey
  
  return (
    <th
      onClick={() => sortKey && onSort(sortKey)}
      style={{
        cursor: sortKey ? 'pointer' : 'default',
        userSelect: 'none',
        transition: 'background 0.2s'
      }}
      onMouseEnter={(e) => {
        if (sortKey) e.currentTarget.style.background = 'var(--bg-hover)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--bg-tertiary)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
        <span>{children}</span>
        {sortKey && (
          <span style={{ opacity: isActive ? 1 : 0.3, transition: 'opacity 0.2s' }}>
            {!isActive && <ArrowUpDown size={14} />}
            {isActive && currentSortOrder === 'asc' && <ArrowUp size={14} />}
            {isActive && currentSortOrder === 'desc' && <ArrowDown size={14} />}
          </span>
        )}
      </div>
    </th>
  )
}
