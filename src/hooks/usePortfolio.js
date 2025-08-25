// src/hooks/usePortfolio.js
import { useState, useEffect } from 'react'
import { fetchPortfolioData } from '../utils/api'

const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPortfolioData()
  }, [])

  const getPortfolioData = async () => {
    try {
      setLoading(true)
      const data = await fetchPortfolioData()
      setPortfolio(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch portfolio data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updatePortfolio = (updatedPortfolio) => {
    setPortfolio(updatedPortfolio)
    // In a real app, you would save to the backend here
    localStorage.setItem('userPortfolio', JSON.stringify(updatedPortfolio))
  }

  return { portfolio, loading, error, updatePortfolio, refreshPortfolio: getPortfolioData }
}

// Make sure to export as default
export default usePortfolio