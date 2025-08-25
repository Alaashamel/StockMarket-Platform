export const calculateProfitLoss = (currentPrice, purchasePrice, quantity) => {
  const profitLoss = (currentPrice - purchasePrice) * quantity
  const profitLossPercent = ((currentPrice - purchasePrice) / purchasePrice) * 100
  return { profitLoss, profitLossPercent }
}

export const calculatePortfolioValue = (holdings) => {
  return holdings.reduce((total, holding) => {
    return total + (holding.currentPrice * holding.quantity)
  }, 0)
}

export const calculateDailyChange = (holdings, previousClosePrices) => {
  let totalChange = 0
  holdings.forEach(holding => {
    const previousClose = previousClosePrices[holding.symbol] || holding.currentPrice
    totalChange += (holding.currentPrice - previousClose) * holding.quantity
  })
  return totalChange
}

export const calculatePortfolioAllocation = (holdings) => {
  const totalValue = calculatePortfolioValue(holdings)
  const allocation = {}
  
  holdings.forEach(holding => {
    if (!allocation[holding.sector]) {
      allocation[holding.sector] = 0
    }
    allocation[holding.sector] += (holding.currentPrice * holding.quantity) / totalValue * 100
  })
  
  return allocation
}