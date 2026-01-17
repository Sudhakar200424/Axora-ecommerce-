
import React from 'react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const TrackingStepper: React.FC<{ status: string }> = ({ status }) => {
    const steps = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentStepIndex = steps.indexOf(status);
    const isCancelled = status === 'Cancelled';

    if (isCancelled) return null;

    return (
        <div className="mb-10 mt-4 px-2">
            <div className="relative flex justify-between items-center">
                {/* Progress Bar Background */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-100 dark:bg-neutral-800 -translate-y-1/2 z-0"></div>

                {/* Progress Bar Active */}
                <div
                    className="absolute top-1/2 left-0 h-0.5 bg-green-500 transition-all duration-1000 -translate-y-1/2 z-0"
                    style={{ width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%` }}
                ></div>

                {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={step} className="relative z-10 flex flex-col items-center">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-green-500 scale-110' : 'bg-neutral-200 dark:bg-neutral-700'
                                }`}>
                                {isCompleted && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <span className={`absolute top-6 whitespace-nowrap text-[8px] font-bold uppercase tracking-widest ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-neutral-400'
                                } ${isCurrent ? 'animate-pulse' : ''}`}>
                                {step === 'Processing' ? 'Ordered' : step}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Orders: React.FC = () => {
    const { user, cancelOrder, refreshUser } = useShop();
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refreshUser();
        // Artificial delay for visual feedback
        setTimeout(() => setIsRefreshing(false), 800);
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h2 className="text-2xl font-serif text-charcoal dark:text-offwhite mb-4">You are not logged in.</h2>
                <Link to="/auth" className="text-gold underline uppercase tracking-widest text-xs">Sign In</Link>
            </div>
        );
    }

    const sortedOrders = [...user.orderHistory].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className="min-h-screen bg-offwhite dark:bg-charcoal py-12 px-6 transition-colors">
            <div className="container mx-auto max-w-4xl">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gold/20 pb-4 gap-4">
                    <h1 className="text-3xl font-serif text-charcoal dark:text-offwhite">My Orders</h1>
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center justify-center gap-2 bg-white dark:bg-clay border border-neutral-200 dark:border-neutral-700 text-charcoal dark:text-offwhite px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:border-gold transition-all shadow-sm group disabled:opacity-50"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M23 4v6h-6"></path>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                        </svg>
                        {isRefreshing ? 'Refreshing...' : 'Refresh Orders'}
                    </button>
                </header>

                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .animate-spin {
                        animation: spin 1s linear infinite;
                    }
                `}</style>

                {sortedOrders.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-neutral-400 uppercase tracking-widest text-xs mb-4">You have no orders yet.</p>
                        <Link to="/catalog" className="text-gold font-bold uppercase tracking-widest text-xs border border-gold px-6 py-3 hover:bg-gold hover:text-charcoal transition-all">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sortedOrders.map(order => (
                            <div key={order.id} className="bg-white dark:bg-clay p-6 shadow-md border border-transparent hover:border-gold/30 transition-all">
                                <div className="flex flex-wrap justify-between items-start mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                                    <div>
                                        <span className="block text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Order ID</span>
                                        <span className="text-sm font-bold text-charcoal dark:text-offwhite font-mono">{order.id}</span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Date</span>
                                        <span className="text-sm text-charcoal dark:text-offwhite">{order.date}</span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Total</span>
                                        <span className="text-sm font-bold text-gold">₹ {order.total.toLocaleString()}</span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Status</span>
                                        <span className={`text-xs font-bold px-2 py-1 uppercase tracking-widest ${order.status === 'Cancelled' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                                            (order.status === 'Delivered' || order.status === 'Processing') ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                                                'bg-gold/10 text-gold'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <TrackingStepper status={order.status} />

                                <div className="space-y-4 mb-6">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-center">
                                            <div className="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 shrink-0 overflow-hidden">
                                                <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="flex-grow">
                                                <h4 className="text-xs font-bold text-charcoal dark:text-offwhite line-clamp-1">{item.name}</h4>
                                                <p className="text-[10px] text-neutral-400">Qty: {item.quantity} {item.selectedSize && `| Size: ${item.selectedSize}`}</p>
                                            </div>
                                            <div className="text-xs font-medium text-charcoal dark:text-offwhite">
                                                ₹ {(item.price * item.quantity).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                    {order.status !== 'Delivered' && order.status !== 'Out for Delivery' && order.status !== 'Cancelled' && (
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to cancel this order?')) {
                                                    cancelOrder(order.id);
                                                }
                                            }}
                                            className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-500 border border-red-200 dark:border-red-900/50 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                    {order.status === 'Cancelled' && (
                                        <span className="text-[10px] uppercase tracking-widest text-neutral-400 italic">Order Cancelled</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
