import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { db, isFirebaseConfigured } from '../firebase';
import { doc, deleteDoc } from "firebase/firestore";
import { Product, User, Order } from '../types';
import { getAllUsers, deleteUser, getAllOrders } from '../services/firestore';

import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';

const AdminDashboard: React.FC = () => {
    const { products, refreshProducts, logout, theme, toggleTheme } = useShop();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'products' | 'users' | 'requests'>('products');
    const [users, setUsers] = useState<User[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [sellerRequests, setSellerRequests] = useState<any[]>([]); // TODO: Define proper type
    const [loading, setLoading] = useState(false);
    const [authChecking, setAuthChecking] = useState(true);

    useEffect(() => {
        // Determine initial UI state from session
        const adminAuthSession = sessionStorage.getItem('axo_admin_auth');

        // Wait for Firebase Auth to confirm actual user
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setAuthChecking(false);

            if (currentUser && currentUser.email === 'admin@gmail.com') {
                setIsAuthenticated(true);
                // Ensure session matches
                sessionStorage.setItem('axo_admin_auth', 'true');
                fetchUsers();
                fetchSellerRequests();
                fetchOrders();
            } else if (adminAuthSession === 'true') {
                setIsAuthenticated(true);
                fetchUsers();
                fetchSellerRequests();
                fetchOrders();
            } else {
                setIsAuthenticated(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'admin@gmail.com' && password === 'Axo1515') {
            try {
                await signInWithEmailAndPassword(auth, username, password);
                setIsAuthenticated(true);
                sessionStorage.setItem('axo_admin_auth', 'true');
                fetchUsers();
                fetchSellerRequests();
                fetchOrders();
            } catch (err) {
                console.error("Admin Login Error:", err);
                alert("Login failed. Ensure Admin account exists in Firebase.");
            }
        } else {
            alert("Invalid credentials");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('axo_admin_auth');
        logout();
    };

    const fetchUsers = async () => {
        if (isFirebaseConfigured) {
            setLoading(true);
            const allUsers = await getAllUsers();
            // Filter out the main admin account from the UI list
            const customerUsers = (allUsers as User[]).filter(u => u.email !== 'admin@gmail.com');
            setUsers(customerUsers);
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        const allOrders = await getAllOrders();
        setOrders(allOrders);
    };

    // Dummy fetch for requests until implemented
    const fetchSellerRequests = async () => {
        // In a real app, fetch from 'seller_requests' collection
        setSellerRequests([
            { id: 'req_1', name: 'Potential Seller', email: 'applicant@example.com', brandName: 'LuxBrand', description: 'High end fashion items.' }
        ]);
    };

    const formatCurrency = (val: number) => {
        if (val >= 1000000) return `₹ ${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `₹ ${(val / 1000).toFixed(1)}K`;
        return `₹ ${val.toLocaleString()}`;
    };

    const totalRevenue = orders
        .filter(o => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + (o.total || 0), 0);

    const handleDeleteProduct = async (productId: string) => {
        if (confirm("Are you sure you want to permanently delete this product?")) {
            try {
                if (isFirebaseConfigured) {
                    const user = auth.currentUser;
                    if (!user) {
                        alert("Error: No authenticated user found in Firebase.");
                        return;
                    }
                    await deleteDoc(doc(db, "products", productId));
                }
                refreshProducts();
                alert("Product deleted.");
            } catch (error: any) {
                console.error("Error deleting product:", error);
                alert(`Failed to delete product. Error: ${error.message}`);
            }
        }
    };

    const handleDeleteUser = async (uid: string) => {
        if (confirm("Are you sure you want to permanently ban/delete this user?")) {
            try {
                if (isFirebaseConfigured) {
                    await deleteUser(uid);
                    fetchUsers();
                }
                alert("User deleted.");
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user.");
            }
        }
    };

    // Placeholder functions for new UI actions
    const handlePromoteToSeller = async (uid: string) => {
        if (confirm("Promote this user to Seller?")) {
            alert(`User ${uid} promoted to Seller (Simulation)`);
            // Implementation: Update user role in Firestore 'users' collection
            fetchUsers();
        }
    };

    const handleRequestAction = async (reqId: string, action: 'approve' | 'reject') => {
        alert(`Request ${reqId} ${action}ed (Simulation)`);
        // Implementation: If approved, create seller profile and update user role. If reject, delete request.
        setSellerRequests(prev => prev.filter(r => r.id !== reqId));
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-charcoal">
                <div className="bg-white p-10 rounded shadow-2xl w-full max-w-md">
                    <h1 className="text-2xl font-serif text-center mb-8 uppercase tracking-widest text-charcoal">Admin Portal</h1>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">Username</label>
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full border-b border-neutral-300 focus:border-gold outline-none py-2 text-xs uppercase tracking-widest" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border-b border-neutral-300 focus:border-gold outline-none py-2 text-xs uppercase tracking-widest" />
                        </div>
                        <button type="submit" className="w-full bg-charcoal text-white py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-charcoal transition-colors">Access Dashboard</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] bg-offwhite dark:bg-charcoal font-sans transition-colors duration-300">

            {/* SIDEBAR (Desktop Only) */}
            <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-neutral-900 border-r border-gold/20 p-6 fixed md:relative h-full z-10 shrink-0">
                <div className="mb-10">
                    <span className="text-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-1 block">Admin Portal</span>
                    <h1 className="text-2xl font-serif text-charcoal dark:text-offwhite uppercase tracking-widest leading-none">Dashboard</h1>
                </div>

                <nav className="flex-1 space-y-2">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${activeTab === 'users' ? 'bg-gold text-charcoal' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-neutral-400'}`}
                    >
                        User Management
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${activeTab === 'products' ? 'bg-gold text-charcoal' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-neutral-400'}`}
                    >
                        Global Inventory
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest rounded transition-all flex justify-between items-center ${activeTab === 'requests' ? 'bg-gold text-charcoal' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-neutral-400'}`}
                    >
                        <span>Seller Applications</span>
                        {sellerRequests.length > 0 && <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[8px]">{sellerRequests.length}</span>}
                    </button>
                </nav>

                <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-3">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-charcoal dark:bg-gold text-white dark:text-charcoal px-5 py-3 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-clay transition-all shadow-lg text-center"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">

                {/* Mobile Header (Visible only on Mobile) */}
                <div className="md:hidden flex flex-col gap-4 mb-6 pb-6 border-b border-gold/20">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-gold text-[10px] font-bold uppercase tracking-[0.3em] block">Admin</span>
                            <h1 className="text-xl font-serif text-charcoal dark:text-offwhite uppercase">Dashboard</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={toggleTheme} className="p-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-clay text-charcoal dark:text-gold shadow-sm">
                                {theme === 'light' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                )}
                            </button>
                            <button onClick={handleLogout} className="bg-charcoal text-white px-3 py-1.5 rounded text-[9px] uppercase font-bold tracking-widest">Logout</button>
                        </div>
                    </div>
                    {/* Mobile Tab Nav */}
                    <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
                        <button onClick={() => setActiveTab('users')} className={`whitespace-nowrap px-3 py-1.5 rounded text-[10px] uppercase font-bold tracking-widest border transition-colors ${activeTab === 'users' ? 'bg-gold text-charcoal border-gold' : 'border-neutral-200 text-neutral-500'}`}>Users</button>
                        <button onClick={() => setActiveTab('products')} className={`whitespace-nowrap px-3 py-1.5 rounded text-[10px] uppercase font-bold tracking-widest border transition-colors ${activeTab === 'products' ? 'bg-gold text-charcoal border-gold' : 'border-neutral-200 text-neutral-500'}`}>Products</button>
                        <button onClick={() => setActiveTab('requests')} className={`whitespace-nowrap px-3 py-1.5 rounded text-[10px] uppercase font-bold tracking-widest border transition-colors ${activeTab === 'requests' ? 'bg-gold text-charcoal border-gold' : 'border-neutral-200 text-neutral-500'}`}>Requests</button>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Users', value: users.length, icon: 'Users' },
                        { label: 'Total Products', value: products.length, icon: 'Box' },
                        { label: 'Pending Requests', value: sellerRequests.length, icon: 'Clock' },
                        { label: 'Platform Revenue', value: formatCurrency(totalRevenue), icon: 'TrendingUp' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-clay p-4 md:p-5 rounded shadow-sm border border-neutral-100 dark:border-neutral-800">
                            <p className="text-neutral-500 text-[8px] md:text-[9px] uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-xl md:text-2xl font-sans font-bold text-charcoal dark:text-offwhite">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Content Area */}
                <div className="bg-white dark:bg-clay rounded-lg overflow-hidden shadow-sm border border-neutral-100 dark:border-neutral-800 min-h-[400px]">

                    {/* USERS TAB */}
                    {activeTab === 'users' && (
                        <div className="p-5">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-serif text-charcoal dark:text-offwhite uppercase tracking-widest">All Users</h2>
                                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Total: {users.length}</span>
                            </div>

                            {/* Mobile Cards for Users */}
                            <div className="md:hidden space-y-3">
                                {users.map((user) => (
                                    <div key={user.uid} className="border border-neutral-100 dark:border-neutral-700 p-4 rounded bg-neutral-50 dark:bg-neutral-800">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-bold text-charcoal dark:text-offwhite text-xs">{user.name || 'No Name'}</p>
                                                <p className="text-[10px] text-neutral-500 break-all">{user.email}</p>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold ${user.role === 'seller' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                    'bg-blue-50 text-blue-600'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </div>
                                        <p className="text-[9px] text-neutral-400 mb-3 font-mono">UID: {user.uid.slice(0, 8)}...</p>

                                        <div className="flex gap-2">
                                            {/* Only show delete if NOT current admin */}
                                            {user.uid !== auth.currentUser?.uid && (
                                                <button
                                                    onClick={() => handleDeleteUser(user.uid)}
                                                    className="bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-red-500 px-3 py-1.5 rounded text-[9px] uppercase tracking-widest w-full hover:bg-red-50"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                            {user.role === 'buyer' && (
                                                <button
                                                    onClick={() => handlePromoteToSeller(user.uid)}
                                                    className="bg-charcoal dark:bg-gold text-white dark:text-charcoal px-3 py-1.5 rounded text-[9px] uppercase tracking-widest w-full hover:bg-black"
                                                >
                                                    Make Seller
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table for Users */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="border-b border-neutral-100 dark:border-neutral-800">
                                        <tr>
                                            <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Name</th>
                                            <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Email</th>
                                            <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Role</th>
                                            <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">UID</th>
                                            <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                                        {users.map((user) => (
                                            <tr key={user.uid} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                                <td className="py-3 font-medium text-xs text-charcoal dark:text-offwhite">{user.name || 'No Name'}</td>
                                                <td className="py-3 text-xs text-neutral-500">{user.email}</td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold ${user.role === 'seller' ? 'bg-purple-100 text-purple-800' :
                                                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                            'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-neutral-400 text-[9px] font-mono">{user.uid.slice(0, 8)}...</td>
                                                <td className="py-3">
                                                    {user.uid !== auth.currentUser?.uid && (
                                                        <button onClick={() => handleDeleteUser(user.uid)} className="text-red-400 hover:text-red-600 text-[10px] uppercase tracking-widest font-bold mr-3">
                                                            Remove
                                                        </button>
                                                    )}
                                                    {user.role === 'buyer' && (
                                                        <button onClick={() => handlePromoteToSeller(user.uid)} className="text-gold hover:text-charcoal dark:hover:text-white transition-colors text-[10px] uppercase tracking-widest font-bold">
                                                            Promote
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* PRODUCTS TAB */}
                    {activeTab === 'products' && (
                        <div className="p-5">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-serif text-charcoal dark:text-offwhite uppercase tracking-widest">Global Inventory</h2>
                                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Total: {products.length}</span>
                            </div>

                            {/* Mobile Cards for Products */}
                            <div className="md:hidden space-y-3">
                                {products.map((product) => (
                                    <div key={product.id} className="border border-neutral-100 dark:border-neutral-700 p-3 rounded bg-neutral-50 dark:bg-neutral-800 flex gap-3">
                                        <img src={product.images[0]} alt={product.name} className="w-14 h-14 object-cover rounded bg-white" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-charcoal dark:text-offwhite text-xs truncate pr-2">{product.name}</h4>
                                                <p className="text-gold font-sans font-bold text-xs">₹{product.price.toLocaleString()}</p>
                                            </div>
                                            <p className="text-[10px] text-neutral-500 mb-1">{product.category}</p>
                                            <p className="text-[9px] text-neutral-400 mb-2 font-mono">Seller # {product.sellerId?.slice(0, 4)}...</p>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="text-red-500 text-[9px] uppercase tracking-widest font-bold border border-red-200 px-2 py-1 rounded hover:bg-red-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table for Products */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="border-b border-neutral-100 dark:border-neutral-800">
                                        <tr>
                                            <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Product</th>
                                            <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Category</th>
                                            <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Price</th>
                                            <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Seller ID</th>
                                            <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                                        {products.map((product) => (
                                            <tr key={product.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                                <td className="py-3">
                                                    <div className="flex items-center gap-3">
                                                        <img src={product.images[0]} alt="" className="w-8 h-8 rounded object-cover" />
                                                        <span className="font-medium text-xs text-charcoal dark:text-offwhite">{product.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-xs text-neutral-500">{product.category}</td>
                                                <td className="py-3 font-sans font-bold text-xs text-charcoal dark:text-offwhite">₹{product.price.toLocaleString()}</td>
                                                <td className="py-3 text-[10px] text-neutral-400 font-mono">{product.sellerId?.slice(0, 8)}...</td>
                                                <td className="py-3">
                                                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-400 hover:text-red-600 text-[9px] uppercase tracking-widest font-bold">
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* REQUESTS TAB */}
                    {activeTab === 'requests' && (
                        <div className="p-5">
                            <h2 className="text-lg font-serif text-charcoal dark:text-offwhite mb-6 uppercase tracking-widest">Seller Applications</h2>

                            {sellerRequests.length === 0 ? (
                                <div className="text-center py-12 text-neutral-400 italic text-xs">No new applications at this time.</div>
                            ) : (
                                <>
                                    {/* Mobile Cards for Requests */}
                                    <div className="md:hidden space-y-4">
                                        {sellerRequests.map((req) => (
                                            <div key={req.id} className="border border-neutral-100 dark:border-neutral-700 p-4 rounded bg-neutral-50 dark:bg-neutral-800">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-bold text-charcoal dark:text-offwhite text-xs">{req.name}</p>
                                                        <p className="text-[10px] text-neutral-500">{req.email}</p>
                                                    </div>
                                                    <span className="bg-gold/10 text-gold text-[9px] px-2 py-0.5 rounded uppercase tracking-widest font-bold">Pending</span>
                                                </div>
                                                <p className="text-[10px] text-neutral-600 dark:text-neutral-400 mb-2"><strong>Brand:</strong> {req.brandName}</p>
                                                <p className="text-[10px] text-neutral-500 italic mb-4">"{req.description}"</p>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <button
                                                        onClick={() => handleRequestAction(req.id, 'approve')}
                                                        className="bg-charcoal dark:bg-gold text-white dark:text-charcoal px-3 py-2 rounded text-[9px] uppercase tracking-widest hover:bg-black text-center font-bold"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleRequestAction(req.id, 'reject')}
                                                        className="bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-500 px-3 py-2 rounded text-[9px] uppercase tracking-widest hover:bg-neutral-100 text-center font-bold"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop Table for Requests */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="border-b border-neutral-100 dark:border-neutral-800">
                                                <tr>
                                                    <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Applicant</th>
                                                    <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Brand Name</th>
                                                    <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Description</th>
                                                    <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                                                {sellerRequests.map((req) => (
                                                    <tr key={req.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                                        <td className="py-4 align-top">
                                                            <div>
                                                                <p className="font-bold text-xs text-charcoal dark:text-offwhite">{req.name}</p>
                                                                <p className="text-[10px] text-neutral-500">{req.email}</p>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 align-top font-medium text-xs text-charcoal dark:text-offwhite">{req.brandName}</td>
                                                        <td className="py-4 align-top text-neutral-600 dark:text-neutral-400 text-[10px] max-w-xs truncate">{req.description}</td>
                                                        <td className="py-4 align-top">
                                                            <div className="flex gap-3">
                                                                <button
                                                                    onClick={() => handleRequestAction(req.id, 'approve')}
                                                                    className="text-green-600 hover:text-green-800 text-[9px] uppercase tracking-widest font-bold border border-green-200 px-2 py-1 rounded"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRequestAction(req.id, 'reject')}
                                                                    className="text-red-400 hover:text-red-600 text-[9px] uppercase tracking-widest font-bold px-2 py-1"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
