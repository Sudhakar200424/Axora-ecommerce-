import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { getSellerOrders } from '../services/firestore';
import { Link } from 'react-router-dom';

type Message = {
  role: 'ai' | 'user';
  text: string;
  type?: 'text' | 'options' | 'order-list' | 'product-list' | 'info';
  options?: string[];
  data?: any;
};

const AIConcierge: React.FC = () => {
  const { user, cart, favourites, products } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [trackingOrderStep, setTrackingOrderStep] = useState(false);

  // Check for admin session
  const isAdmin = sessionStorage.getItem('axo_admin_auth') === 'true';

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const initializeChat = () => {
    if (isAdmin) return;

    let initialOptions: string[] = [];
    let greeting = "";

    if (user?.role === 'seller') {
      greeting = `Welcome back, ${user.name || 'Seller'}. How is your boutique doing today?`;
      initialOptions = ['My Products', 'Client Orders', 'Total Revenue', 'My Listings'];
    } else {
      greeting = `Welcome to AXORA. How can I assist you today?`;
      initialOptions = ['My Orders', 'My Fav', 'My Cart', 'Track My Order'];
    }

    setMessages([
      { role: 'ai', text: greeting, type: 'options', options: initialOptions }
    ]);
  };

  const handleOptionClick = async (option: string) => {
    // Add user selection message
    setMessages(prev => [...prev, { role: 'user', text: option }]);
    setLoading(true);

    try {
      if (user?.role === 'seller') {
        await handleSellerOption(option);
      } else {
        await handleBuyerOption(option);
      }
    } catch (error) {
      console.error("Error processing option:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "I apologize, but I encountered an issue retrieving that information." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSellerOption = async (option: string) => {
    let responseMessage: Message = { role: 'ai', text: '', type: 'text' };
    const nextOptions = ['My Products', 'Client Orders', 'Total Revenue', 'My Listings'];

    switch (option) {
      case 'My Products':
      case 'My Listings':
        const myProducts = products.filter(p => p.sellerId === user?.uid);
        responseMessage = {
          role: 'ai',
          text: `You have ${myProducts.length} active listings in your boutique.`,
          type: 'product-list',
          data: myProducts.slice(0, 5)
        };
        break;
      case 'Client Orders':
        if (user?.uid) {
          const orders = await getSellerOrders(user.uid);
          responseMessage = {
            role: 'ai',
            text: `You have received ${orders.length} orders from clients.`,
            type: 'order-list',
            data: orders.slice(0, 5)
          };
        }
        break;
      case 'Total Revenue':
        if (user?.uid) {
          const orders = await getSellerOrders(user.uid);
          const revenue = orders.reduce((acc: number, order: any) => acc + (order.totalAmount || 0), 0);
          responseMessage = {
            role: 'ai',
            text: `Your total revenue calculated from client orders is ₹ ${revenue.toLocaleString()}.`,
            type: 'info'
          };
        }
        break;
      default:
        responseMessage = { role: 'ai', text: "I can help you with your boutique options." };
    }
    setMessages(prev => [...prev, responseMessage, { role: 'ai', text: "Is there anything else?", type: 'options', options: nextOptions }]);
  };

  const handleBuyerOption = async (option: string) => {
    let responseMessage: Message = { role: 'ai', text: '', type: 'text' };
    const nextOptions = ['My Orders', 'My Fav', 'My Cart', 'Track My Order'];

    if (trackingOrderStep) {
      setTrackingOrderStep(false);
    }

    switch (option) {
      case 'My Orders':
        if (!user) {
          responseMessage = { role: 'ai', text: "Please sign in to view your orders." };
        } else if (user.orderHistory.length === 0) {
          responseMessage = { role: 'ai', text: "You haven't placed any orders yet." };
        } else {
          responseMessage = {
            role: 'ai',
            text: "Here are your most recent orders:",
            type: 'order-list',
            data: user.orderHistory.slice(0, 5)
          };
        }
        break;
      case 'My Fav':
        if (favourites.length === 0) {
          responseMessage = { role: 'ai', text: "Your wishlist is currently empty." };
        } else {
          responseMessage = {
            role: 'ai',
            text: `You have ${favourites.length} items in your wishlist.`,
            type: 'product-list',
            data: favourites.slice(0, 5)
          };
        }
        break;
      case 'My Cart':
        if (cart.length === 0) {
          responseMessage = { role: 'ai', text: "Your shopping bag is empty." };
        } else {
          responseMessage = {
            role: 'ai',
            text: `You have ${cart.length} items in your cart.`,
            type: 'product-list',
            data: cart
          };
        }
        break;
      case 'Track My Order':
        if (!user || user.orderHistory.length === 0) {
          responseMessage = { role: 'ai', text: "You don't have any orders to track." };
        } else {
          setTrackingOrderStep(true);
          responseMessage = {
            role: 'ai',
            text: "Which order would you like to track? Please select one:",
            type: 'order-list',
            data: user.orderHistory.slice(0, 5)
          };
        }
        break;
      default:
        responseMessage = { role: 'ai', text: "I can assist with Orders, Favorites, Cart, or Tracking." };
    }

    setMessages(prev => [...prev, responseMessage]);

    if (option !== 'Track My Order') {
      setMessages(prev => [...prev, { role: 'ai', text: "What else can I do for you?", type: 'options', options: nextOptions, id: `ai-next-buyer-${Date.now()}` }]);
    }
  };

  const handleTrackOrder = (orderId: string, status: string) => {
    setMessages(prev => [
      ...prev,
      { role: 'user', text: `Track Order #${orderId}`, id: `user-track-${Date.now()}`, sender: 'user' },
      { role: 'ai', text: `Order #${orderId} is currently '${status}'.`, id: `ai-track-status-${Date.now()}` },
      { role: 'ai', text: "Anything else?", type: 'options', options: ['My Orders', 'My Fav', 'My Cart', 'Track My Order'], id: `ai-track-next-${Date.now()}` }
    ]);
    setTrackingOrderStep(false);
  };

  // Helper to get current options for the new options area
  const getOptions = () => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.type === 'options' && lastMessage.options) {
      return lastMessage.options;
    }
    // Default options if no specific options are available
    if (user?.role === 'seller') {
      return ['My Products', 'Client Orders', 'Total Revenue', 'My Listings'];
    }
    return ['My Orders', 'My Fav', 'My Cart', 'Track My Order'];
  };

  if (isAdmin) return null;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[90] font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-charcoal text-gold p-3 md:p-4 rounded-full shadow-2xl hover:scale-110 transition-transform border border-gold/30"
          aria-label="Open Concierge"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <>
          {/* Mobile Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
            onClick={() => setIsOpen(false)}
          />

          <div className={`
            bg-charcoal border border-gold/20 shadow-2xl flex flex-col overflow-hidden
            z-50
            fixed inset-y-0 right-0 w-[85%] max-w-sm rounded-l-2xl animate-slide-in-right md:w-[400px]
            lg:absolute lg:inset-auto lg:bottom-20 lg:right-0 lg:w-[400px] lg:h-[600px] lg:rounded-2xl lg:animate-fade-in-up
          `}>
            {/* Header */}
            <div className="bg-gradient-to-r from-charcoal to-black p-4 border-b border-gold/20 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-gold font-bold tracking-widest text-sm">Concierge</h3>
                  <p className="text-[9px] text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-neutral-500 hover:text-gold transition-colors p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-charcoal/50 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Text Bubble */}
                  <div className={`max-w-[85%] p-3 rounded-lg text-xs leading-relaxed mb-1 ${m.role === 'user'
                    ? 'bg-gold text-charcoal rounded-br-none'
                    : 'bg-white dark:bg-clay text-charcoal dark:text-offwhite border border-neutral-200 dark:border-neutral-700 rounded-bl-none shadow-sm'
                    }`}>
                    {m.text}
                  </div>

                  {/* Options Buttons */}
                  {m.type === 'options' && m.options && (
                    <div className="flex flex-wrap gap-2 mt-2 w-full">
                      {m.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleOptionClick(opt)}
                          className="text-[10px] font-bold uppercase tracking-widest px-3 py-2 bg-white dark:bg-clay border border-gold/30 hover:bg-gold hover:text-charcoal transition-all rounded-full flex-grow text-center shadow-sm"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Info Display */}
                  {m.type === 'info' && (
                    <div className="w-full mt-2 p-3 bg-gold/10 border border-gold/20 rounded text-center">
                      <p className="text-gold text-xs italic">End of report.</p>
                    </div>
                  )}

                  {/* Order / Product List */}
                  {(m.type === 'order-list' || m.type === 'product-list') && m.data && (
                    <div className="w-full mt-2 space-y-2">
                      {m.data.map((item: any, idx: number) => {
                        const firstItem = item.items?.[0] || item;
                        const imageSrc = item.images?.[0] || firstItem.images?.[0];
                        const name = firstItem.name || item.name;
                        const price = item.total || item.totalAmount || item.price || firstItem.price;
                        const orderId = item.id || item.orderId;
                        const status = item.status;
                        const isSeller = user?.role === 'seller';

                        return (
                          <div key={idx} className="bg-white dark:bg-clay p-2 rounded border border-neutral-100 dark:border-neutral-700 flex gap-2 items-center text-xs">
                            {imageSrc && (
                              <img src={imageSrc} alt="thumb" className="w-8 h-8 object-cover rounded shrink-0" />
                            )}
                            <div className="flex-grow min-w-0">
                              <p className="font-bold truncate dark:text-offwhite">{name || (orderId ? `Order #${orderId}` : 'Unknown Item')}</p>
                              <p className="text-[10px] text-neutral-500 truncate flex items-center gap-1">
                                {isSeller && orderId && <span className="font-mono bg-neutral-100 dark:bg-neutral-800 px-1 rounded">#{orderId}</span>}
                                {isSeller && orderId && <span>•</span>}
                                <span>₹ {price?.toLocaleString()}</span>
                                {status === 'Cancelled' && <span className="text-red-500 font-bold ml-1">(Cancelled)</span>}
                              </p>
                            </div>
                            {m.type === 'order-list' && trackingOrderStep && (
                              <button
                                onClick={() => handleTrackOrder(orderId, status)}
                                className="bg-gold text-charcoal text-[8px] font-bold px-2 py-1 rounded uppercase tracking-widest hover:bg-white transition-colors"
                              >
                                Track
                              </button>
                            )}
                          </div>
                        );
                      })}
                      {m.data.length === 0 && <p className="text-[10px] italic text-neutral-400">No items found.</p>}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-clay px-4 py-2 rounded-full rounded-bl-none shadow-sm flex space-x-1 items-center">
                    <div className="w-1 h-1 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="w-1 h-1 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1 h-1 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Options Area (Bottom Fixed inside Drawer) */}
            <div className="p-4 border-t border-gold/10 bg-black/20 shrink-0">
              <div className="grid grid-cols-2 gap-2">
                {getOptions().map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(option)}
                    className="bg-charcoal border border-gold/20 text-gold text-[10px] uppercase tracking-widest py-3 px-2 rounded hover:bg-gold hover:text-charcoal transition-all text-center"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIConcierge;
