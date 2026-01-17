
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AIConcierge from './components/AIConcierge';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Favourites from './pages/Favourites';
import SellerDashboard from './pages/SellerDashboard';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import OurStory from './pages/OurStory';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Accessibility from './pages/Accessibility';
import BespokeServices from './pages/BespokeServices';

const AppContent: React.FC = () => {
  const { loading } = useShop();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-charcoal">
        <div className="flex flex-col items-center">
          <div className="text-3xl font-serif text-gold tracking-[0.5em] animate-pulse mb-4">AXORA</div>
          <div className="text-[8px] text-gold/50 uppercase tracking-[0.8em]">Initializing Maison...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-offwhite">
      <Header />
      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Static Pages */}
          <Route path="/story" element={<OurStory />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/services" element={<BespokeServices />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <AIConcierge />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ShopProvider>
      <HashRouter>
        <ScrollToTop />
        <AppContent />
      </HashRouter>
    </ShopProvider>
  );
};

export default App;
