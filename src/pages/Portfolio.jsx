// pages/Portfolio.jsx
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BalanceCard from "../components/user/BalanceCard";
import TransactionHistory from "../components/transactions/TransactionHistory";
import AssetAllocation from "../components/portfolio/AssetAllocation";
import PerformanceAnalytics from "../components/portfolio/PerformanceAnalytics";
import PortfolioEditor from "../components/portfolio/PortfolioEditor";
import { useTransactions } from "../contexts/TransactionContext";
import { useStockData } from "../hooks/useStockData";

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [greeting, setGreeting] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    stocks: [],
    totalValue: 0,
    dailyChange: 0,
    dailyChangePercent: 0,
  });

  const {
    transactions,
    isLoading: transactionsLoading,
    getCashBalance,
    getTotalInvested,
    getRecentTransactions,
    addTransaction,
  } = useTransactions();
  const { stocks, isLoading: stocksLoading } = useStockData();

  // Calculate portfolio values based on transactions
  const cashBalance = getCashBalance() || 0;
  const totalInvested = getTotalInvested() || 0;
  const totalValue = cashBalance + totalInvested;
  const recentTransactions = getRecentTransactions(3) || [];

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Simulate daily market changes
  useEffect(() => {
    const dailyChange = totalInvested * (0.005 + Math.random() * 0.015);
    const dailyChangePercent = (dailyChange / totalInvested) * 100;

    setPortfolioData((prev) => ({
      ...prev,
      totalValue,
      dailyChange,
      dailyChangePercent: isNaN(dailyChangePercent) ? 0 : dailyChangePercent,
    }));
  }, [totalInvested, totalValue]);

  const handleDeposit = (amount) => {
    // Add deposit transaction
    addTransaction({
      type: "deposit",
      amount,
      date: new Date().toISOString(),
      status: "completed",
    });

    // Show success message
    toast.success(`Successfully deposited $${amount.toFixed(2)}`);
  };

  const handleTransactionUpdate = (transaction) => {
    // This will trigger a re-render and update all values
    console.log("Transaction completed:", transaction);
  };

  const handleEditPortfolio = () => {
    setIsEditing(true);
  };

  const handleUpdatePortfolio = (updatedPortfolio) => {
    setPortfolioData(updatedPortfolio);
    setIsEditing(false);
    toast.success("Portfolio updated successfully!");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    toast.info("Edit cancelled");
  };

  // Tab navigation items
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: "📊",
    },
    {
      id: "performance",
      label: "Performance",
      icon: "📈",
    },
    {
      id: "holdings",
      label: "Holdings",
      icon: "💼",
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: "💰",
    },
  ];

  if (transactionsLoading || stocksLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PortfolioEditor
          portfolio={portfolioData}
          onUpdate={handleUpdatePortfolio}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in p-4 md:p-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            My Portfolio
          </h1>
          <p className="text-gray-600 mt-1">
            {greeting}! Manage your investments and track performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <button
            onClick={handleEditPortfolio}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Portfolio
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Balance Card - Always visible in portfolio */}
          <BalanceCard
            cashBalance={cashBalance}
            investedValue={totalInvested}
            totalValue={totalValue}
            dailyChange={portfolioData.dailyChange}
            onDeposit={handleDeposit}
            onTransactionUpdate={handleTransactionUpdate}
          />

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <AssetAllocation
                    portfolioData={portfolioData}
                    transactions={transactions}
                  />
                  <PerformanceAnalytics
                    portfolioData={portfolioData}
                    transactions={transactions}
                  />
                </div>
              )}

              {activeTab === "performance" && (
                <PerformanceAnalytics
                  portfolioData={portfolioData}
                  transactions={transactions}
                  detailed={true}
                />
              )}

              {activeTab === "holdings" && (
                <AssetAllocation
                  portfolioData={portfolioData}
                  transactions={transactions}
                  detailed={true}
                />
              )}

              {activeTab === "transactions" && (
                <TransactionHistory
                  transactions={transactions}
                  showAll={true}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Portfolio Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Portfolio Stats
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Value</span>
                <span className="font-semibold text-gray-800">
                  $
                  {(totalValue || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cash Balance</span>
                <span className="font-semibold text-gray-800">
                  $
                  {(cashBalance || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Invested</span>
                <span className="font-semibold text-gray-800">
                  $
                  {(totalInvested || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Today's Change</span>
                <span
                  className={`font-semibold ${
                    (portfolioData.dailyChange || 0) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {(portfolioData.dailyChange || 0) >= 0 ? "+" : ""}$
                  {Math.abs(portfolioData.dailyChange || 0).toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentTransactions.length > 0 ? (
                recentTransactions.map(
                  (transaction) =>
                    transaction && (
                      <div
                        key={transaction.id || Math.random()}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs ${
                              transaction.type === "deposit"
                                ? "bg-green-100 text-green-600"
                                : transaction.type === "buy"
                                ? "bg-blue-100 text-blue-600"
                                : transaction.type === "sell"
                                ? "bg-red-100 text-red-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {transaction.type === "deposit"
                              ? "D"
                              : transaction.type === "buy"
                              ? "B"
                              : transaction.type === "sell"
                              ? "S"
                              : "W"}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">
                              {transaction.type === "deposit"
                                ? "Deposit"
                                : transaction.type === "buy"
                                ? `Bought ${transaction.symbol || "stock"}`
                                : transaction.type === "sell"
                                ? `Sold ${transaction.symbol || "stock"}`
                                : "Withdrawal"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {transaction.date
                                ? new Date(
                                    transaction.date
                                  ).toLocaleDateString()
                                : "N/A"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            transaction.type === "deposit" ||
                            transaction.type === "sell"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "deposit" ||
                          transaction.type === "sell"
                            ? "+"
                            : "-"}
                          $
                          {(transaction.amount || 0).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                    )
                )
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
