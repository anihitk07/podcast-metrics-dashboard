import { useState } from 'react'

export function useSortableTable(data, defaultSortKey = null, defaultSortOrder = 'desc') {
  const [sortKey, setSortKey] = useState(defaultSortKey)
  const [sortOrder, setSortOrder] = useState(defaultSortOrder)

  const handleSort = (key) => {
    if (sortKey === key) {
      // Toggle sort order if clicking the same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new sort key and default to descending
      setSortKey(key)
      setSortOrder('desc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0

    let aVal = a[sortKey]
    let bVal = b[sortKey]

    // Handle date objects
    if (aVal instanceof Date && bVal instanceof Date) {
      aVal = aVal.getTime()
      bVal = bVal.getTime()
    }

    // Handle null/undefined values
    if (aVal == null) aVal = 0
    if (bVal == null) bVal = 0

    // Handle string comparison
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return { sortedData, sortKey, sortOrder, handleSort }
}
