import { useState, useEffect, useRef } from 'react'

const SearchBar = ({ onStockSelect }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef(null)
  const resultsRef = useRef(null)

  // Mock data for search - in a real app, this would come from an API
  const mockStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 176.08, change: 1.24, exchange: 'NASDAQ' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 337.69, change: -0.56, exchange: 'NASDAQ' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: 2.31, exchange: 'NASDAQ' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 142.07, change: -1.15, exchange: 'NASDAQ' },
    { symbol: 'TSLA', name: 'Tesla, Inc.', price: 209.14, change: 3.42, exchange: 'NASDAQ' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 431.10, change: 4.25, exchange: 'NASDAQ' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 155.21, change: -0.32, exchange: 'NYSE' },
    { symbol: 'V', name: 'Visa Inc.', price: 243.75, change: 0.87, exchange: 'NYSE' },
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return
      
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        )
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault()
        handleSelectStock(results[selectedIndex])
      } else if (e.key === 'Escape') {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, results, selectedIndex])

  // Scroll to selected item
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex]
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        })
      }
    }
  }, [selectedIndex])

  const handleSearch = async (value) => {
    setQuery(value)
    setSelectedIndex(-1)
    
    if (value.length > 1) {
      setIsLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const filtered = mockStocks.filter(
        stock =>
          stock.symbol.toLowerCase().includes(value.toLowerCase()) ||
          stock.name.toLowerCase().includes(value.toLowerCase())
      )
      setResults(filtered)
      setIsOpen(true)
      setIsLoading(false)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }

  const handleSelectStock = (stock) => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    setSelectedIndex(-1)
    
    if (onStockSelect) {
      onStockSelect(stock)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  return (
    <div className="relative w-full md:w-80" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search stocks (e.g., AAPL, Microsoft)..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length > 1 && setIsOpen(true)}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
          aria-label="Search stocks"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        )}
      </div>

      {isOpen && (
        <div 
          className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-72 overflow-auto"
          role="listbox"
          ref={resultsRef}
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-pulse">Searching...</div>
            </div>
          ) : results.length > 0 ? (
            results.map((stock, index) => (
              <div 
                key={stock.symbol} 
                className={`p-3 border-b border-gray-100 cursor-pointer transition-colors duration-150 ${
                  index === selectedIndex 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleSelectStock(stock)}
                onMouseEnter={() => setSelectedIndex(index)}
                role="option"
                aria-selected={index === selectedIndex}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <div className="font-semibold text-gray-900 truncate">{stock.symbol}</div>
                      <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {stock.exchange}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 truncate">{stock.name}</div>
                  </div>
                  <div className="text-right ml-2">
                    <div className="font-semibold text-gray-900">${stock.price.toFixed(2)}</div>
                    <div className={`text-xs font-medium ${
                      stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.change >= 0 ? '↗' : '↘'} {Math.abs(stock.change).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : query.length > 1 ? (
            <div className="p-4 text-center text-gray-500">
              No results found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default SearchBar