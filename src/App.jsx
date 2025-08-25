
import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { TransactionProvider } from "./contexts/TransactionContext";
import { BalanceProvider } from "./contexts/BalanceContext";
import { useStockData, StockDataProvider } from "./hooks/useStockData"; // Fixed import
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import TickerTape from "./components/market/TickerTape";
import Dashboard from "./pages/Dashboard";
import Market from "./pages/Market";
import Portfolio from "./pages/Portfolio";
import Analysis from "./pages/Analysis";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
function AppContent() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const { user, loading } = useAuth();
  const { isLoading: stocksLoading } = useStockData();

  const renderPage = () => {
    if (!user) {
      return <Auth />;
    }

    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "market":
        return <Market />;
      case "portfolio":
        return <Portfolio />;
      case "analysis":
        return <Analysis />;
      case "settings":
        return <Settings />;
      case "auth":
        return <Auth />;
      default:
        return <Dashboard />;
    }
  };

  if (loading || stocksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {user && (
        <>
          <TickerTape />
          <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </>
      )}
      <main className="flex-grow container mx-auto px-4 py-6">
        {renderPage()}
      </main>
      {user && <Footer />}
    </div>
  );
}


function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <BalanceProvider>
          <StockDataProvider> {/* Make sure this wraps AppContent */}
            <AppContent />
          </StockDataProvider>
        </BalanceProvider>
      </TransactionProvider>
    </AuthProvider>
  );
}

export default App;