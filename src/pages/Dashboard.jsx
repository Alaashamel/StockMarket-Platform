// pages/Dashboard.jsx
import { useState, useEffect } from "react";
import MarketOverview from "../components/market/MarketOverview";
import TransactionHistory from "../components/transactions/TransactionHistory";
import Portfolio from "./Portfolio.jsx";
import AssetAllocation from "../components/portfolio/AssetAllocation";
import StockListingForm from "../components/company/StockListingForm";
import BuySellStocks from "../components/transactions/BuySellForm";
import { useTransactions } from "../contexts/TransactionContext";
import { useStockData } from "../hooks/useStockData.jsx";
import { useBalance } from "../contexts/BalanceContext";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("transactions");
  const [greeting, setGreeting] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingStock, setIsAddingStock] = useState(false);

  const { transactions, isLoading: transactionsLoading } = useTransactions();
  const {
    stocks,
    customStocks,
    isLoading: stocksLoading,
    addStock,
    removeCustomStock,
  } = useStockData();
  const { balance, isLoading: balanceLoading } = useBalance();

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAddStock = async (stockData) => {
    setIsAddingStock(true);

    try {
      await addStock(stockData);
      toast.success(`${stockData.symbol} listed successfully!`);
    } catch (error) {
      toast.error("Failed to list stock. Please try again.");
      console.error("Stock listing error:", error);
    } finally {
      setIsAddingStock(false);
    }
  };

  const handleDeleteStock = async (stockId) => {
    await removeCustomStock(stockId);
    toast.success("Stock removed successfully!");
  };

  // Combine all stocks for display
  const allStocks = [...stocks, ...customStocks];

  // Calculate dynamic metrics for display
  const getStockMetrics = (stock) => {
    const basePrice = stock.initialPrice || stock.price || 0;
    const volatility = stock.volatility || 0.02;

    // Generate random price change based on volatility
    const randomChange = (Math.random() - 0.5) * 2 * volatility * basePrice;
    const currentPrice = basePrice + randomChange;
    const changePercent = (randomChange / basePrice) * 100;

    return {
      currentPrice: parseFloat(currentPrice.toFixed(2)),
      change: parseFloat(changePercent.toFixed(2)),
      marketCap: currentPrice * (stock.totalShares || 1000000),
    };
  };

  // Tab navigation items
  const tabs = [
    {
      id: "transactions",
      label: "Transaction History",
      icon: "📋",
    },
    {
      id: "companies",
      label: "Company List",
      icon: "🏢",
    },
    {
      id: "market",
      label: "Market Overview",
      icon: "📊",
    },
  ];

  if (isLoading || balanceLoading || transactionsLoading || stocksLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            {greeting}! Here's your financial overview.
          </p>
        </div>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Main Content Area - Full width */}
        <div className="space-y-6">
          {/* Buy/Sell Stocks Component */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Buy & Sell Stocks
            </h2>
            <BuySellStocks stocks={allStocks} />
          </div>

          {/* Tabbed Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`py-4 px-6 text-center font-medium text-sm border-b-2 flex items-center transition-colors duration-200 whitespace-nowrap ${
                      activeSection === tab.id
                        ? "border-blue-500 text-blue-600 bg-blue-50"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeSection === "transactions" && <TransactionHistory />}
              {activeSection === "companies" && (
                <div className="space-y-6">
                  {/* Stock Listing Form */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      List New Company
                    </h3>
                    <StockListingForm
                      onAddStock={handleAddStock}
                      isLoading={isAddingStock}
                    />
                  </div>

                  {/* Company List */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Listed Companies ({allStocks.length})
                    </h3>
                    {allStocks.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">
                          No companies listed yet. Add your first company above.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {allStocks.map((stock) => {
                          const metrics = getStockMetrics(stock);

                          return (
                            <div
                              key={stock.id}
                              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-semibold text-gray-800">
                                    {stock.symbol}
                                  </h4>
                                  <p className="text-sm text-gray-600 truncate">
                                    {stock.name}
                                  </p>
                                </div>
                                {stock.isCustom && (
                                  <button
                                    onClick={() => handleDeleteStock(stock.id)}
                                    className="text-red-500 hover:text-red-700 text-sm font-bold text-lg"
                                    title="Remove company"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>

                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Current Price:
                                  </span>
                                  <span className="font-medium">
                                    ${metrics.currentPrice.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Market Cap:
                                  </span>
                                  <span className="font-medium">
                                    $
                                    {metrics.marketCap.toLocaleString(
                                      undefined,
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Volatility:
                                  </span>
                                  <span className="font-medium">
                                    {((stock.volatility || 0.02) * 100).toFixed(
                                      1
                                    )}
                                    %
                                  </span>
                                </div>
                                {stock.listedDate && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Listed:
                                    </span>
                                    <span className="font-medium text-xs">
                                      {new Date(
                                        stock.listedDate
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="mt-4 pt-3 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                  <span
                                    className={`text-sm font-medium ${
                                      metrics.change >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {metrics.change >= 0 ? "+" : ""}
                                    {metrics.change.toFixed(2)}%
                                  </span>
                                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    Trade
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeSection === "market" && <MarketOverview />}
            </div>
          </div>

          {/* Asset Allocation - Now Dynamic */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Asset Allocation
            </h2>
            <AssetAllocation stocks={allStocks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
