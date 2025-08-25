import { useState, useEffect } from "react";
import { formatCurrency } from "../../utils/formatters";

const PortfolioEditor = ({ portfolio, onUpdate, onCancel }) => {
  // Initialize with default structure if portfolio is undefined
  const [editablePortfolio, setEditablePortfolio] = useState({
    stocks: [],
    totalValue: 0,
    dailyChange: 0,
    dailyChangePercent: 0,
    ...portfolio,
  });

  const [newStock, setNewStock] = useState({
    symbol: "",
    shares: "",
    avgPrice: "",
  });

  // Update state if portfolio prop changes
  useEffect(() => {
    if (portfolio) {
      setEditablePortfolio({
        stocks: [],
        totalValue: 0,
        dailyChange: 0,
        dailyChangePercent: 0,
        ...portfolio,
      });
    }
  }, [portfolio]);

  const handleStockChange = (index, field, value) => {
    const updatedStocks = [...editablePortfolio.stocks];
    updatedStocks[index][field] =
      field === "symbol" ? value : parseFloat(value) || 0;

    // Update current price if average price changes (simulate market movement)
    if (field === "avgPrice") {
      const priceChange = (Math.random() - 0.5) * 0.2; // ±10% change
      updatedStocks[index].currentPrice = parseFloat(value) * (1 + priceChange);
    }

    setEditablePortfolio({ ...editablePortfolio, stocks: updatedStocks });
  };

  const addNewStock = () => {
    if (newStock.symbol && newStock.shares && newStock.avgPrice) {
      const priceChange = (Math.random() - 0.5) * 0.2; // ±10% change
      const currentPrice = parseFloat(newStock.avgPrice) * (1 + priceChange);

      const newStockItem = {
        symbol: newStock.symbol.toUpperCase(),
        name: `${newStock.symbol.toUpperCase()} Inc.`,
        shares: parseFloat(newStock.shares),
        avgPrice: parseFloat(newStock.avgPrice),
        currentPrice: currentPrice,
        sector: "Technology",
        value: currentPrice * parseFloat(newStock.shares),
      };

      setEditablePortfolio({
        ...editablePortfolio,
        stocks: [...editablePortfolio.stocks, newStockItem],
      });

      setNewStock({ symbol: "", shares: "", avgPrice: "" });
    }
  };

  const removeStock = (index) => {
    const updatedStocks = editablePortfolio.stocks.filter(
      (_, i) => i !== index
    );
    setEditablePortfolio({ ...editablePortfolio, stocks: updatedStocks });
  };

  const calculateTotalValue = () => {
    return editablePortfolio.stocks.reduce((total, stock) => {
      return total + stock.currentPrice * stock.shares;
    }, 0);
  };

  const calculateDailyChange = () => {
    // Simple simulation - 0.5% to 3% daily change
    return calculateTotalValue() * (0.005 + Math.random() * 0.025);
  };

  const handleSave = () => {
    const totalValue = calculateTotalValue();
    const dailyChange = calculateDailyChange();
    const dailyChangePercent =
      totalValue > 0 ? (dailyChange / totalValue) * 100 : 0;

    onUpdate({
      ...editablePortfolio,
      totalValue,
      dailyChange,
      dailyChangePercent,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Edit Portfolio</h2>
        <div className="flex space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Add New Stock */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Add New Stock</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Symbol
            </label>
            <input
              type="text"
              value={newStock.symbol}
              onChange={(e) =>
                setNewStock({ ...newStock, symbol: e.target.value })
              }
              placeholder="e.g., AAPL"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shares
            </label>
            <input
              type="number"
              value={newStock.shares}
              onChange={(e) =>
                setNewStock({ ...newStock, shares: e.target.value })
              }
              placeholder="Quantity"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avg Price
            </label>
            <input
              type="number"
              step="0.01"
              value={newStock.avgPrice}
              onChange={(e) =>
                setNewStock({ ...newStock, avgPrice: e.target.value })
              }
              placeholder="Price per share"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={addNewStock}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Stock
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Stocks */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-900">Your Stocks</h3>
          <span className="text-sm text-gray-500">
            {editablePortfolio.stocks.length} stocks
          </span>
        </div>

        {editablePortfolio.stocks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shares
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {editablePortfolio.stocks.map((stock, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={stock.symbol || ""}
                        onChange={(e) =>
                          handleStockChange(index, "symbol", e.target.value)
                        }
                        className="w-20 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={stock.shares || 0}
                        onChange={(e) =>
                          handleStockChange(index, "shares", e.target.value)
                        }
                        className="w-20 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="0.01"
                        value={stock.avgPrice || 0}
                        onChange={(e) =>
                          handleStockChange(index, "avgPrice", e.target.value)
                        }
                        className="w-24 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      {formatCurrency(stock.currentPrice || 0)}
                    </td>
                    <td className="px-4 py-3">
                      {formatCurrency(
                        (stock.currentPrice || 0) * (stock.shares || 0)
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => removeStock(index)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="mt-2">No stocks in your portfolio</p>
            <p className="text-sm">Add stocks using the form above</p>
          </div>
        )}
      </div>

      {/* Portfolio Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-3">Portfolio Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-md shadow-sm">
            <div className="text-gray-600 text-sm">Total Value</div>
            <div className="text-xl font-bold text-gray-900">
              {formatCurrency(calculateTotalValue())}
            </div>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <div className="text-gray-600 text-sm">Estimated Daily Change</div>
            <div
              className={`text-xl font-bold ${
                calculateDailyChange() >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {calculateDailyChange() >= 0 ? "+" : ""}
              {formatCurrency(calculateDailyChange())}
            </div>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <div className="text-gray-600 text-sm">Number of Holdings</div>
            <div className="text-xl font-bold text-gray-900">
              {editablePortfolio.stocks.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioEditor;
