// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { TransactionProvider } from './contexts/TransactionContext'
import { BalanceProvider } from './contexts/BalanceContext'
import { StockDataProvider } from './hooks/useStockData.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <TransactionProvider>
        <BalanceProvider>
          <StockDataProvider>
            <App />
          </StockDataProvider>
        </BalanceProvider>
      </TransactionProvider>
    </AuthProvider>
  </React.StrictMode>,
)