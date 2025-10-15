import { format, parseISO, differenceInDays } from 'date-fns'

export const formatNumber = (num) => {
  if (!num) return '0'
  return num.toLocaleString()
}

export const formatDate = (date) => {
  if (!date || !(date instanceof Date)) return 'N/A'
  return format(date, 'MMM dd, yyyy')
}

export const calculateGrowthRate = (current, previous) => {
  if (!previous || previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export const getTopPerformers = (data, metric = 'allTime', limit = 10) => {
  return [...data]
    .sort((a, b) => (b[metric] || 0) - (a[metric] || 0))
    .slice(0, limit)
}

export const getRecentEpisodes = (data, days = 30) => {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return data.filter(ep => ep.published >= cutoff)
}

export const calculateAverageMetrics = (data) => {
  if (!data.length) return {}
  
  const sum = data.reduce((acc, ep) => ({
    day1: acc.day1 + (ep.day1 || 0),
    day7: acc.day7 + (ep.day7 || 0),
    day30: acc.day30 + (ep.day30 || 0),
    allTime: acc.allTime + (ep.allTime || 0),
  }), { day1: 0, day7: 0, day30: 0, allTime: 0 })

  const count = data.length
  return {
    avgDay1: Math.round(sum.day1 / count),
    avgDay7: Math.round(sum.day7 / count),
    avgDay30: Math.round(sum.day30 / count),
    avgAllTime: Math.round(sum.allTime / count),
  }
}

export const getGrowthTrend = (data, metric = 'day1') => {
  const sortedData = [...data].sort((a, b) => a.published - b.published)
  return sortedData.map(ep => ({
    date: formatDate(ep.published),
    value: ep[metric] || 0,
    title: ep.title.substring(0, 50) + '...',
  }))
}

export const detectSeasonality = (data) => {
  const monthlyData = {}
  
  data.forEach(ep => {
    if (!ep.published || !(ep.published instanceof Date)) return
    const month = format(ep.published, 'MMM yyyy')
    if (!monthlyData[month]) {
      monthlyData[month] = { count: 0, totalDownloads: 0 }
    }
    monthlyData[month].count++
    monthlyData[month].totalDownloads += ep.allTime || 0
  })

  return Object.entries(monthlyData).map(([month, stats]) => ({
    month,
    episodes: stats.count,
    avgDownloads: Math.round(stats.totalDownloads / stats.count),
  }))
}

export const findBestPerformingTime = (data) => {
  const dayOfWeek = {}
  
  data.forEach(ep => {
    if (!ep.published || !(ep.published instanceof Date)) return
    const day = format(ep.published, 'EEEE')
    if (!dayOfWeek[day]) {
      dayOfWeek[day] = { count: 0, totalDownloads: 0 }
    }
    dayOfWeek[day].count++
    dayOfWeek[day].totalDownloads += ep.allTime || 0
  })

  return Object.entries(dayOfWeek)
    .map(([day, stats]) => ({
      day,
      episodes: stats.count,
      avgDownloads: Math.round(stats.totalDownloads / stats.count),
    }))
    .sort((a, b) => b.avgDownloads - a.avgDownloads)
}
