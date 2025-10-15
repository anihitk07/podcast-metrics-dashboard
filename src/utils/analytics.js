export const extractKeywords = (title) => {
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'is', 'are', 'was', 'were', 'been', 'be', 'have', 'has',
    'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may',
    'might', 'can', 'about', 'how', 'what', 'when', 'where', 'who', 'which',
    'this', 'that', 'these', 'those', 'we', 'i', 'you', 'he', 'she', 'it',
    'they', 'them', 'their', 'our', 'your', 'my', 'from', 'up', 'out', 'into',
    '&', '+', '-', '|', 'episode', 'merge', 'conflict'
  ])

  const words = title
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word) && !/^\d+$/.test(word))

  return words
}

export const analyzeTopics = (data) => {
  const topicFrequency = {}
  const topicPerformance = {}

  data.forEach(ep => {
    const keywords = extractKeywords(ep.title)
    keywords.forEach(keyword => {
      if (!topicFrequency[keyword]) {
        topicFrequency[keyword] = 0
        topicPerformance[keyword] = { total: 0, count: 0 }
      }
      topicFrequency[keyword]++
      topicPerformance[keyword].total += ep.allTime || 0
      topicPerformance[keyword].count++
    })
  })

  const topics = Object.entries(topicFrequency)
    .filter(([_, count]) => count >= 2)
    .map(([topic, frequency]) => ({
      topic,
      frequency,
      avgPerformance: Math.round(topicPerformance[topic].total / topicPerformance[topic].count),
    }))
    .sort((a, b) => b.frequency - a.frequency)

  return topics
}

export const findRelatedEpisodes = (episode, allEpisodes, limit = 5) => {
  const episodeKeywords = new Set(extractKeywords(episode.title))
  
  const scored = allEpisodes
    .filter(ep => ep.slug !== episode.slug)
    .map(ep => {
      const keywords = extractKeywords(ep.title)
      const matches = keywords.filter(k => episodeKeywords.has(k)).length
      return { episode: ep, score: matches }
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return scored.map(item => item.episode)
}

export const detectTrends = (data, windowSize = 10) => {
  const sorted = [...data].sort((a, b) => a.published - b.published)
  const trends = []

  for (let i = windowSize; i < sorted.length; i++) {
    const window = sorted.slice(i - windowSize, i)
    const avgBefore = window.reduce((sum, ep) => sum + (ep.day7 || 0), 0) / windowSize
    
    const current = sorted[i]
    const change = ((current.day7 || 0) - avgBefore) / avgBefore * 100

    if (Math.abs(change) > 20) {
      trends.push({
        episode: current,
        change: change.toFixed(1),
        type: change > 0 ? 'spike' : 'drop',
      })
    }
  }

  return trends
}

export const predictPerformance = (episode, historicalData) => {
  const keywords = extractKeywords(episode.title)
  const relatedEpisodes = historicalData.filter(ep => {
    const epKeywords = extractKeywords(ep.title)
    return keywords.some(k => epKeywords.includes(k))
  })

  if (relatedEpisodes.length === 0) {
    const avg = historicalData.reduce((sum, ep) => sum + (ep.allTime || 0), 0) / historicalData.length
    return Math.round(avg)
  }

  const avgPerformance = relatedEpisodes.reduce((sum, ep) => sum + (ep.allTime || 0), 0) / relatedEpisodes.length
  return Math.round(avgPerformance)
}

export const analyzeContentPatterns = (data) => {
  const patterns = {
    numbers: { count: 0, avgPerformance: 0 },
    questions: { count: 0, avgPerformance: 0 },
    special: { count: 0, avgPerformance: 0 },
    tech: { count: 0, avgPerformance: 0 },
  }

  const techKeywords = ['ai', 'ml', 'net', 'ios', 'android', 'api', 'code', 'app', 'dev', 'tech', 'data']

  data.forEach(ep => {
    const title = ep.title.toLowerCase()
    const performance = ep.allTime || 0

    if (/\d+/.test(title)) {
      patterns.numbers.count++
      patterns.numbers.avgPerformance += performance
    }

    if (title.includes('?') || title.startsWith('how') || title.startsWith('what') || title.startsWith('why')) {
      patterns.questions.count++
      patterns.questions.avgPerformance += performance
    }

    if (title.includes('special') || title.includes('recap') || title.includes('bonus')) {
      patterns.special.count++
      patterns.special.avgPerformance += performance
    }

    if (techKeywords.some(keyword => title.includes(keyword))) {
      patterns.tech.count++
      patterns.tech.avgPerformance += performance
    }
  })

  Object.keys(patterns).forEach(key => {
    if (patterns[key].count > 0) {
      patterns[key].avgPerformance = Math.round(patterns[key].avgPerformance / patterns[key].count)
    }
  })

  return patterns
}
