import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import SearchBar from './SearchBar'
import Notification from './Notification'
import Logo from './Logo'

const Header = ({ currentPage, setCurrentPage }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { user, logout } = useAuth()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'market', label: 'Market', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'portfolio', label: 'Portfolio', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'analysis', label: 'Analysis', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ]

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        {/* Mobile Header */}
        <div className="flex items-center justify-between md:hidden">
          <div className="flex items-center space-x-3">
            <Logo size="sm" />
            <h1 className="text-lg font-bold text-gray-800">Stock Platform</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Notification />
            
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Logo size="md" />
            <h1 className="text-xl font-bold text-gray-800">Stock Platform</h1>
          </div>

          <SearchBar />

          <div className="flex items-center space-x-4">
            <nav>
              <ul className="flex space-x-4">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setCurrentPage(item.id)}
                      className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center ${
                        currentPage === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            
            <Notification />
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.avatar}
                    alt={user.firstName}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {user.firstName}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentPage('portfolio')
                        setShowUserMenu(false)
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      My Portfolio
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPage('settings')
                        setShowUserMenu(false)
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Settings
                    </button>
                    <button
                      onClick={logout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage('auth')}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setCurrentPage('auth')}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 border-t border-gray-200 pt-4">
            <nav className="mb-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setCurrentPage(item.id)
                        setShowMobileMenu(false)
                      }}
                      className={`w-full px-4 py-3 rounded-lg font-medium transition-colors flex items-center ${
                        currentPage === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            
            {user ? (
              <div className="border-t border-gray-200 pt-4">
                <div className="px-4 py-2 mb-2">
                  <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setCurrentPage('portfolio')
                    setShowMobileMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  My Portfolio
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('settings')
                    setShowMobileMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    logout()
                    setShowMobileMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-4 flex flex-col space-y-2">
                <button
                  onClick={() => {
                    setCurrentPage('auth')
                    setShowMobileMenu(false)
                  }}
                  className="w-full px-4 py-2 text-center text-blue-600 hover:text-blue-800 font-medium border border-blue-600 rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('auth')
                    setShowMobileMenu(false)
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header