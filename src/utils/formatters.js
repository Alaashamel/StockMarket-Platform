export const formatCurrency = (value, decimals = 2) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export const formatPercentage = (value, decimals = 2) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100)
}

export const formatNumber = (value, decimals = 0) => {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(decimals) + 'B'
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(decimals) + 'M'
  } else if (value >= 1000) {
    return (value / 1000).toFixed(decimals) + 'K'
  } else {
    return value.toFixed(decimals)
  }
}

export const formatDate = (dateString, options = {}) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(date)
}