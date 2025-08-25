import { useState, useEffect } from "react";
import StockCard from "./StockCard";

const MarketOverview = () => {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStock, setNewStock] = useState({
    symbol: "",
    name: "",
    price: "",
    change: "",
    volume: "",
  });

  useEffect(() => {
    // Simulate fetching stock data
    const mockStocks = [
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        price: 176.08,
        change: 1.24,
        volume: "45.2M",
      },
      {
        symbol: "MSFT",
        name: "Microsoft Corporation",
        price: 337.69,
        change: -0.56,
        volume: "32.1M",
      },
      {
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        price: 138.21,
        change: 2.31,
        volume: "28.7M",
      },
      {
        symbol: "AMZN",
        name: "Amazon.com Inc.",
        price: 142.07,
        change: -1.15,
        volume: "38.4M",
      },
      {
        symbol: "TSLA",
        name: "Tesla, Inc.",
        price: 209.14,
        change: 3.42,
        volume: "62.3M",
      },
      {
        symbol: "NVDA",
        name: "NVIDIA Corporation",
        price: 431.04,
        change: 4.27,
        volume: "51.8M",
      },
    ];

    setStocks(mockStocks);
    setFilteredStocks(mockStocks);
    setLoading(false);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setStocks((prevStocks) =>
        prevStocks.map((stock) => ({
          ...stock,
          price: stock.price * (1 + (Math.random() - 0.5) / 100),
          change: stock.change + (Math.random() - 0.5) / 10,
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Apply filters whenever stocks or activeFilter changes
  useEffect(() => {
    let filtered = [...stocks];

    switch (activeFilter) {
      case "gainers":
        filtered = filtered
          .filter((stock) => stock.change > 0)
          .sort((a, b) => b.change - a.change);
        break;
      case "losers":
        filtered = filtered
          .filter((stock) => stock.change < 0)
          .sort((a, b) => a.change - b.change);
        break;
      case "active":
        filtered = filtered.sort((a, b) => {
          const volumeA = parseFloat(a.volume);
          const volumeB = parseFloat(b.volume);
          return volumeB - volumeA;
        });
        break;
      default:
        // 'all' - no filtering
        break;
    }

    setFilteredStocks(filtered);
  }, [stocks, activeFilter]);

  const handleAddStock = (e) => {
    e.preventDefault();
    const newStockData = {
      symbol: newStock.symbol.toUpperCase(),
      name: newStock.name,
      price: parseFloat(newStock.price),
      change: parseFloat(newStock.change),
      volume: newStock.volume,
    };

    setStocks((prev) => [...prev, newStockData]);
    setNewStock({ symbol: "", name: "", price: "", change: "", volume: "" });
    setShowAddForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStock((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          Market Overview
        </h2>

        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === "all"
                ? "bg-blue-100 text-blue-700 border border-blue-300"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveFilter("all")}
          >
            Top Stocks
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === "gainers"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveFilter("gainers")}
          >
            Biggest Gainers
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === "losers"
                ? "bg-red-100 text-red-700 border border-red-300"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveFilter("losers")}
          >
            Biggest Losers
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === "active"
                ? "bg-purple-100 text-purple-700 border border-purple-300"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveFilter("active")}
          >
            Most Active
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Company
          </button>
        </div>
      </div>

      {/* Add Company Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Add New Company</h3>
          <form
            onSubmit={handleAddStock}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Symbol
              </label>
              <input
                type="text"
                name="symbol"
                value={newStock.symbol}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., AAPL"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="name"
                value={newStock.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Apple Inc."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={newStock.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 176.08"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Change (%)
              </label>
              <input
                type="number"
                step="0.01"
                name="change"
                value={newStock.change}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1.24"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Volume
              </label>
              <input
                type="text"
                name="volume"
                value={newStock.volume}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 45.2M"
                required
              />
            </div>
            <div className="flex items-end space-x-2 md:col-span-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Stock
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStocks.map((stock, index) => (
          <StockCard key={`${stock.symbol}-${index}`} stock={stock} />
        ))}
      </div>

      {filteredStocks.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No stocks match the current filter.
        </div>
      )}
    </div>
  );
};

export default MarketOverview;
