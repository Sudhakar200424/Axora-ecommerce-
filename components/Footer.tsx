
import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const Footer: React.FC = () => {
  const { user } = useShop();
  const isRestricted = user?.role === 'seller' || user?.email === 'admin@gmail.com';

  return (
    <footer className="bg-charcoal text-offwhite pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="col-span-1">
            <h2 className="text-2xl font-serif tracking-widest mb-6">AXORA</h2>
            <p className="text-xs text-neutral-400 leading-relaxed uppercase tracking-tighter">
              Crafting timeless luxury since 1924. Every piece in our collection is a testament to heritage, quality, and the art of minimalism.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-6">Concierge</h3>
            <ul className="text-xs space-y-4 text-neutral-400">
              <li><Link to="/services" className="hover:text-offwhite transition-colors">Bespoke Services</Link></li>
              {!isRestricted && (
                <li><Link to="/orders" className="hover:text-offwhite transition-colors">Track Order</Link></li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-6">Maison</h3>
            <ul className="text-xs space-y-4 text-neutral-400">
              <li><Link to="/story" className="hover:text-offwhite transition-colors">Our Story</Link></li>
              <li><Link to="/terms" className="hover:text-offwhite transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-offwhite transition-colors">Privacy & Policy</Link></li>
              <li><Link to="/accessibility" className="hover:text-offwhite transition-colors">Accessibility</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-10 text-[10px] text-neutral-500 uppercase tracking-widest text-center md:text-left">
          <p>© 2024 Axora Maison (Sudhakar). All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
