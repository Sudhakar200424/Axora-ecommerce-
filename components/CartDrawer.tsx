
import React from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal, user } = useShop();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-charcoal bg-opacity-50 backdrop-blur-sm" onClick={toggleCart} />

      <div className="relative w-full max-w-md bg-offwhite dark:bg-charcoal h-full shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center bg-charcoal text-offwhite">
          <h2 className="text-xl font-serif tracking-widest uppercase">Shopping Bag</h2>
          <button onClick={toggleCart} className="hover:text-gold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400">
              <p className="text-lg italic font-serif mb-4">Your bag is empty</p>
              <button onClick={toggleCart} className="text-xs uppercase tracking-widest text-charcoal dark:text-offwhite border-b border-charcoal dark:border-offwhite pb-1">Continue Shopping</button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex space-x-4 border-b border-neutral-100 dark:border-neutral-800 pb-6">
                <img src={item.images[0]} alt={item.name} className="w-20 h-28 object-cover" />
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider dark:text-offwhite">{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-neutral-400 hover:text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 mb-2">{item.selectedSize ? `Size: ${item.selectedSize}` : ''}</p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center space-x-3 border border-neutral-200 dark:border-neutral-700 px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="text-lg dark:text-offwhite">-</button>
                      <span className="text-xs font-medium dark:text-offwhite">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="text-lg dark:text-offwhite">+</button>
                    </div>
                    <p className="text-sm font-bold dark:text-gold">₹ {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-neutral-50 dark:bg-clay border-t border-neutral-200 dark:border-neutral-700 space-y-4">
          <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest dark:text-offwhite">
            <span>Subtotal</span>
            <span>₹ {cartTotal.toLocaleString()}</span>
          </div>
          <p className="text-[10px] text-neutral-400 text-center uppercase tracking-widest mb-4">Shipping & taxes calculated at checkout</p>
          <button
            disabled={cart.length === 0}
            onClick={() => {
              toggleCart();
              if (!user) {
                navigate('/auth');
              } else {
                navigate('/checkout');
              }
            }}
            className="w-full bg-charcoal text-offwhite dark:bg-gold dark:text-charcoal py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-clay dark:hover:bg-offwhite transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Secure Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
