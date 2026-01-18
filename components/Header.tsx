import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const Header: React.FC = () => {
  const { cart, user, toggleCart, theme, toggleTheme, logout, refreshProducts, refreshUser } = useShop();
  const [localSearch, setLocalSearch] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  // Check for admin session
  const isAdmin = sessionStorage.getItem('axo_admin_auth') === 'true';

  const handleLogout = () => {
    logout();
    sessionStorage.removeItem('axo_admin_auth'); // Admin logout
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshProducts();
    await refreshUser();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    navigate(`/catalog?q=${localSearch}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-charcoal text-offwhite h-20 flex items-center shadow-2xl transition-all border-b border-gold/20">
      <div className="container mx-auto px-6 flex items-center justify-between gap-4">

        {/* Mobile Menu Button - Left Aligned */}
        <button
          className="lg:hidden text-gold hover:text-offwhite transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        {/* Logo - Center on Mobile, Left on Desktop */}
        <Link
          to={isAdmin ? '/admin' : (user?.role === 'seller' ? '/seller/dashboard' : '/')}
          className="flex flex-col items-center"
        >
          <span className="text-xl md:text-2xl font-serif font-bold tracking-[0.3em]">AXORA</span>
          <span className="text-[6px] md:text-[8px] uppercase tracking-[0.5em] text-gold">Online Shopping</span>
        </Link>

        {/* Luxury Search Bar - Desktop Only */}
        <form onSubmit={handleSearchSubmit} className="flex-grow max-w-xl relative hidden lg:block">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full h-10 bg-clay border border-gold/30 rounded-none pl-5 pr-12 text-xs uppercase tracking-widest focus:outline-none focus:border-gold transition-all"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gold hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        {/* Navigation Utilities */}
        <nav className="flex items-center gap-4 md:gap-8">

          {/* Catalog/Refresh Icon */}
          {isAdmin ? (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-gold hover:text-offwhite transition-colors disabled:opacity-50"
              title="Refresh Data"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 md:h-6 md:w-6 ${isRefreshing ? 'animate-spin' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          ) : user?.role !== 'seller' && (
            <Link to="/catalog" className="text-gold hover:text-offwhite transition-colors" title="Collection">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </Link>
          )}

          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .animate-spin {
              animation: spin 1s linear infinite;
            }
          `}</style>

          {/* Desktop Theme Toggle */}
          <button onClick={toggleTheme} className="text-gold hover:text-offwhite transition-colors hidden lg:block" title="Toggle Ambience">
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hover:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>

          {/* Wishlist Link - Always Visible (New Request) */}
          {!isAdmin && (!user || user.role === 'buyer') && (
            <Link to="/favourites" className="text-gold hover:text-offwhite transition-colors relative group" title="Wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </Link>
          )}

          {/* Profile Dropdown - Desktop Only */}
          <div className="relative hidden lg:block">
            {user || isAdmin ? (
              <>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="text-xs font-bold uppercase tracking-widest hover:text-gold dark:hover:text-gold transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span className="hidden xl:block">{isAdmin ? 'Admin' : (user?.name || 'Member').split(' ')[0]}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-4 w-48 bg-charcoal border border-gold/20 shadow-2xl z-50 py-2 animate-fade-in-down">
                    <div className="px-4 py-3 border-b border-gold/10 mb-2">
                      <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Signed in as</p>
                      <p className="text-xs font-bold text-gold truncate">{isAdmin ? 'Administrator' : user?.email}</p>
                    </div>

                    {isAdmin ? (
                      <Link to="/admin" className="block px-4 py-2 text-xs uppercase tracking-widest bg-gold/5 text-gold hover:bg-gold/20" onClick={() => setIsProfileOpen(false)}>Admin Dashboard</Link>
                    ) : (
                      <>
                        <Link to="/profile" className="block px-4 py-2 text-xs uppercase tracking-widest hover:bg-gold/10 hover:text-gold" onClick={() => setIsProfileOpen(false)}>My Profile</Link>
                        {user?.role === 'seller' && (
                          <Link to="/seller/dashboard" className="block px-4 py-2 text-xs uppercase tracking-widest bg-gold/5 text-gold hover:bg-gold/20" onClick={() => setIsProfileOpen(false)}>Seller Dashboard</Link>
                        )}
                        {user?.role !== 'seller' && (
                          <Link to="/orders" className="block px-4 py-2 text-xs uppercase tracking-widest hover:bg-gold/10 hover:text-gold" onClick={() => setIsProfileOpen(false)}>My Orders</Link>
                        )}
                      </>
                    )}

                    <div className="border-t border-gold/10 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <button onClick={() => navigate('/auth')} className="text-xs font-bold uppercase tracking-widest hover:text-gold dark:hover:text-gold transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <span className="hidden xl:block">Sign In</span>
              </button>
            )}
          </div>

          {/* Cart Icon - Always Visible */}
          {!isAdmin && (!user || user.role === 'buyer') && (
            <button onClick={toggleCart} className="flex items-center gap-2 font-bold relative group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <span className="text-xs uppercase tracking-widest hidden lg:block group-hover:text-gold transition-colors">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -left-2 bg-gold text-charcoal text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>
          )}

          {/* Mobile Menu Drawer & Backdrop */}
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Side Drawer */}
          <div
            className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-white dark:bg-charcoal border-r border-gold/10 shadow-2xl z-50 transform transition-transform duration-500 ease-out lg:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <div className="p-6 flex flex-col h-full overflow-y-auto no-scrollbar">
              {/* Drawer Header */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-serif font-bold tracking-[0.2em] text-charcoal dark:text-offwhite">AXORA</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gold p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Search - Hidden for Sellers/Admins */}
              {!isAdmin && user?.role !== 'seller' && (
                <form onSubmit={handleSearchSubmit} className="relative mb-8 shrink-0">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full h-10 bg-neutral-50 dark:bg-clay/50 border border-gold/20 rounded-none pl-4 pr-10 text-[10px] uppercase tracking-widest focus:outline-none focus:border-gold transition-all text-charcoal dark:text-offwhite placeholder:text-neutral-500"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </form>
              )}

              {/* Mobile Navigation Links */}
              <div className="flex-grow flex flex-col gap-6">
                {user || isAdmin ? (
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 text-gold border-b border-gold/20 pb-6 mb-6 bg-charcoal -mx-6 px-6 pt-2">
                      <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0 border border-gold/30">
                        <span className="text-sm font-bold text-gold">{isAdmin ? 'A' : (user?.name || 'M').charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-bold uppercase tracking-widest truncate text-offwhite">{isAdmin ? 'Administrator' : user?.name}</p>
                        <p className="text-[9px] text-neutral-400 truncate">{isAdmin ? 'admin@gmail.com' : user?.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {isAdmin ? (
                        <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] uppercase tracking-[0.2em] text-charcoal dark:text-offwhite hover:text-gold transition-colors">Admin Dashboard</Link>
                      ) : (
                        <>
                          {user?.role !== 'seller' && (
                            <>
                              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] uppercase tracking-[0.2em] text-charcoal dark:text-offwhite hover:text-gold transition-colors">Home</Link>
                              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] uppercase tracking-[0.2em] text-charcoal dark:text-offwhite hover:text-gold transition-colors">My Profile</Link>
                            </>
                          )}
                          {user?.role === 'seller' ? (
                            <Link to="/seller/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] uppercase tracking-[0.2em] text-gold">Seller Dashboard</Link>
                          ) : (
                            <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] uppercase tracking-[0.2em] text-charcoal dark:text-offwhite hover:text-gold transition-colors">My Orders</Link>
                          )}
                        </>
                      )}
                      <button onClick={handleLogout} className="text-[11px] uppercase tracking-[0.2em] text-red-400 text-left mt-2 hover:text-red-300">Logout</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] uppercase tracking-[0.2em] text-charcoal dark:text-offwhite hover:text-gold transition-colors">Home</Link>
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] uppercase tracking-[0.2em] text-gold flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      Sign In / Register
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Utilities Footer */}
              <div className="pt-8 border-t border-gold/10 shrink-0">
                <button onClick={toggleTheme} className="flex items-center gap-3 text-charcoal dark:text-neutral-400 hover:text-gold transition-colors w-full">
                  {theme === 'light' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                  <span className="text-[10px] uppercase tracking-widest">{theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
