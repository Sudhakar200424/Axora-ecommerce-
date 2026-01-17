
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, User, Address, PaymentMethod, Order, OrderStatus } from '../types';
import { auth, db, isFirebaseConfigured } from '../firebase';
import { MOCK_PRODUCTS } from '../constants';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import * as FirestoreService from '../services/firestore';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  loading: boolean;
  isCartOpen: boolean;
  theme: 'light' | 'dark';
  addToCart: (product: Product, size?: string, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  toggleCart: () => void;
  toggleTheme: () => void;
  logout: () => void;
  refreshProducts: () => void;
  cartTotal: number;
  favourites: Product[];
  toggleFavourite: (product: Product) => void;
  saveAddress: (address: Address) => void;
  placeOrder: (address: Address, paymentMethod: PaymentMethod) => Promise<string>;
  cancelOrder: (orderId: string) => void;
  refreshUser: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Simulation Channel for multi-tab synchronization without a real DB
const maisonSyncChannel = new BroadcastChannel('axora_marketplace_sync');

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('axora_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const [favourites, setFavourites] = useState<Product[]>(() => {
    // Only load from local if valid JSON
    try {
      const saved = localStorage.getItem('axora_favourites');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Simulation Sync Helper
  const saveToPersistence = (userData: User) => {
    // 1. Save to current session
    localStorage.setItem('axora_sim_user', JSON.stringify(userData));

    // 2. Save to "Mock DB"
    try {
      const storedDb = localStorage.getItem('axora_users_db');
      const mockDb = storedDb ? JSON.parse(storedDb) : {};
      mockDb[userData.uid] = userData;
      localStorage.setItem('axora_users_db', JSON.stringify(mockDb));
    } catch (e) { console.error("Failed to persist simulation data", e); }
  };

  const fetchProducts = useCallback(async () => {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const fbProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts([...fbProducts, ...MOCK_PRODUCTS]);
      } catch (err) {
        console.error("Firestore unreachable, falling back to simulation:", err);
        loadSimulatedProducts();
      }
    } else {
      loadSimulatedProducts();
    }
  }, []);

  const loadSimulatedProducts = () => {
    const stored = localStorage.getItem('axora_simulated_products');
    if (stored) {
      const simProducts = JSON.parse(stored);
      setProducts([...simProducts, ...MOCK_PRODUCTS]);
    } else {
      setProducts(MOCK_PRODUCTS);
    }
  };

  // Auth & Initial Data Load
  useEffect(() => {
    fetchProducts();

    const handleSync = async (event: MessageEvent) => {
      if (event.data === 'REFRESH_PRODUCTS' || event.data === 'REFRESH_USER_DATA') {
        await fetchProducts();

        // If simulation mode, force reload user from localStorage
        if (!isFirebaseConfigured || !auth) {
          const savedUser = localStorage.getItem('axora_sim_user');
          if (savedUser) {
            try {
              const userData = JSON.parse(savedUser);
              setUser(userData);
            } catch { }
          }
        } else if (auth.currentUser) {
          // If Firebase mode, re-fetch user data from Firestore
          const firestoreData = await FirestoreService.getUserData(auth.currentUser.uid);
          const userOrders = await FirestoreService.getUserOrders(auth.currentUser.uid);
          if (firestoreData) {
            setUser(prev => prev ? {
              ...prev,
              ...firestoreData,
              orderHistory: userOrders.length > 0 ? userOrders : (firestoreData.orderHistory || [])
            } : null);
          }
        }
      }
    };
    maisonSyncChannel.onmessage = handleSync;

    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setLoading(true);
        try {
          if (firebaseUser) {
            // Logged In - Fetch all user details from Firestore
            const firestoreData = await FirestoreService.getUserData(firebaseUser.uid);

            const pendingRole = localStorage.getItem('axora_pending_role') as 'buyer' | 'seller' | null;
            let finalUser: User;

            if (firestoreData) {
              let finalRole = firestoreData.role || 'buyer';

              // Role Synchronization: If user explicitly chose a role on login that differs from DB
              if (pendingRole && pendingRole !== finalRole) {
                console.log(`AXORA: Synchronizing user role from ${finalRole} to ${pendingRole}`);
                finalRole = pendingRole;
                FirestoreService.updateUserProfile(firebaseUser.uid, { role: finalRole });
              }

              // Fetch orders from the dedicated orders collection
              const userOrders = await FirestoreService.getUserOrders(firebaseUser.uid);

              finalUser = {
                uid: firebaseUser.uid,
                name: firestoreData.name || firebaseUser.displayName || 'Member',
                email: firestoreData.email || firebaseUser.email || '',
                role: finalRole,
                orderHistory: userOrders.length > 0 ? userOrders : (firestoreData.orderHistory || []),
                savedAddress: firestoreData.savedAddress
              };

              // Restore cart and favorites from Firestore directly
              if (firestoreData.cart) setCart(firestoreData.cart);
              if (firestoreData.favourites) setFavourites(firestoreData.favourites);

              console.log("AXORA: User activities & orders synced from Cloud Firestore.");
            } else {
              // Create new profile if missing
              finalUser = {
                uid: firebaseUser.uid,
                name: firebaseUser.displayName || 'Maison Member',
                email: firebaseUser.email || '',
                role: pendingRole || 'buyer',
                orderHistory: []
              };
              await FirestoreService.createUserProfile(finalUser.uid, finalUser);
            }

            localStorage.removeItem('axora_pending_role'); // Consume the pending role
            setUser(finalUser);

          } else {
            // Logged Out
            setUser(null);
            setCart([]);
            setFavourites([]);

            // Fallback for simulation OTP sessions
            const otpUser = localStorage.getItem('axora_otp_user');
            if (otpUser) {
              try { setUser(JSON.parse(otpUser)); } catch { }
            }
          }
        } catch (error) {
          console.error("Firestore Sync Error:", error);
        } finally {
          setLoading(false);
        }
      });
      return () => {
        unsubscribe();
        maisonSyncChannel.onmessage = null;
      };
    } else {
      // Simulation Persistence for local testing without Firebase
      const savedUser = localStorage.getItem('axora_sim_user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          if (userData.cart) setCart(userData.cart);
          if (userData.favourites) setFavourites(userData.favourites);
        } catch { }
      }
      setLoading(false);
    }
  }, [fetchProducts]);

  const refreshUser = useCallback(async () => {
    if (!user) return;

    if (isFirebaseConfigured && auth && auth.currentUser) {
      const firestoreData = await FirestoreService.getUserData(auth.currentUser.uid);
      const userOrders = await FirestoreService.getUserOrders(auth.currentUser.uid);
      if (firestoreData) {
        setUser(prev => prev ? {
          ...prev,
          ...firestoreData,
          orderHistory: userOrders.length > 0 ? userOrders : (firestoreData.orderHistory || [])
        } : null);
      }
    } else {
      // Simulation mode
      const savedUser = localStorage.getItem('axora_sim_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch { }
      }
    }
  }, [user]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('axora_theme', theme);
  }, [theme]);

  // Sync Favourites to LocalStorage (always) and Firestore (explicitly called in toggle)
  useEffect(() => {
    localStorage.setItem('axora_favourites', JSON.stringify(favourites));
  }, [favourites]);

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const addToCart = async (product: Product, size?: string, color?: string) => {
    if (!user) {
      alert("Please login to add items to the cart.");
      window.location.hash = '/auth';
      return;
    }

    if (user.role === 'seller') {
      alert("Sellers cannot add items to the cart. Please use a Buyer account for shopping.");
      return;
    }

    let newCart = [...cart];
    const existingIndex = newCart.findIndex(item => item.id === product.id && item.selectedSize === size);

    if (existingIndex > -1) {
      newCart[existingIndex].quantity += 1;
    } else {
      newCart.push({ ...product, quantity: 1, selectedSize: size, selectedColor: color });
    }

    setCart(newCart);
    setIsCartOpen(true);

    if (isFirebaseConfigured) {
      await FirestoreService.updateLocalCart(user.uid, newCart);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);

    if (isFirebaseConfigured) {
      await FirestoreService.updateLocalCart(user.uid, newCart);
    }
  };

  const updateQuantity = async (productId: string, delta: number) => {
    if (!user) return;

    const newCart = cart.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });

    setCart(newCart);

    if (isFirebaseConfigured) {
      await FirestoreService.updateLocalCart(user.uid, newCart);
    }
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const logout = () => {
    // 1. Clear Local Simulation Storage
    localStorage.removeItem('axora_sim_user');
    localStorage.removeItem('axora_otp_user');
    localStorage.removeItem('axora_favourites');

    // 2. Clear State
    setCart([]);
    setFavourites([]);
    setUser(null);

    // 3. Sign Out from Firebase
    if (isFirebaseConfigured && auth) {
      signOut(auth).catch(console.error);
    }

    window.location.hash = '/';
  };

  const saveAddress = async (address: Address) => {
    if (!user) return;
    if (user.role === 'seller') return;
    const updatedUser = { ...user, savedAddress: address };
    setUser(updatedUser);

    if (isFirebaseConfigured) {
      await FirestoreService.saveUserAddress(user.uid, address);
    } else {
      saveToPersistence(updatedUser);
    }
  };

  const placeOrder = async (address: Address, paymentMethod: PaymentMethod): Promise<string> => {
    if (!user) {
      alert("Please login to place an order.");
      window.location.hash = '/auth';
      return '';
    }

    if (user.role === 'seller') {
      alert("Sellers cannot place orders. Access denied.");
      return '';
    }
    // Artificial delay for UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 1. Group items by Seller ID
    const itemsBySeller: Record<string, CartItem[]> = {};
    cart.forEach(item => {
      const sid = item.sellerId || 'system-seller';
      if (!itemsBySeller[sid]) itemsBySeller[sid] = [];
      itemsBySeller[sid].push(item);
    });

    const sellerIds = Object.keys(itemsBySeller);
    const splitOrders: Order[] = [];

    // 2. Create sub-orders for each seller
    sellerIds.forEach(sid => {
      const sellerItems = itemsBySeller[sid];
      const sellerTotal = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const subOrder: Order = {
        id: `AXO-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        total: sellerTotal,
        status: 'Processing',
        items: sellerItems,
        shippingAddress: address,
        paymentMethod: paymentMethod,
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        sellerId: sid // Add top-level sellerId for easier querying and security
      } as any; // Cast because types.ts might not have sellerId on Order yet

      splitOrders.push(subOrder);
    });

    if (user) {
      const updatedUser = {
        ...user,
        orderHistory: [...splitOrders, ...user.orderHistory],
        savedAddress: address
      };
      setUser(updatedUser);

      if (isFirebaseConfigured) {
        try {
          // Add each sub-order to top-level orders collection
          for (const order of splitOrders) {
            await FirestoreService.addOrder(user.uid, order);
          }

          // Redundant update to user profile (historical)
          await FirestoreService.updateUserOrders(user.uid, updatedUser.orderHistory);
          await FirestoreService.saveUserAddress(user.uid, address);
          await FirestoreService.updateLocalCart(user.uid, []);
        } catch (err) {
          console.error("Failed to add orders to Firestore", err);
        }
      } else {
        saveToPersistence(updatedUser);
      }

      // Notify other tabs (like the Seller Dashboard) to refresh
      maisonSyncChannel.postMessage('REFRESH_ORDERS');
    }
    setCart([]);
    return splitOrders[0]?.id || '';
  };

  const cancelOrder = async (orderId: string) => {
    if (!user) return;
    const updatedOrders = user.orderHistory.map(order =>
      order.id === orderId && order.status !== 'Delivered' && order.status !== 'Out for Delivery'
        ? { ...order, status: 'Cancelled' as OrderStatus }
        : order
    );
    const updatedUser = { ...user, orderHistory: updatedOrders };
    setUser(updatedUser);
    if (isFirebaseConfigured) {
      await FirestoreService.updateUserOrders(user.uid, updatedOrders);
    } else {
      saveToPersistence(updatedUser);
    }
    maisonSyncChannel.postMessage('REFRESH_USER_DATA');
  };

  const toggleFavourite = async (product: Product) => {
    if (!user) {
      alert("Please login to manage favorites.");
      window.location.hash = '/auth';
      return;
    }

    if (user.role === 'seller') {
      alert("Sellers cannot manage favorites. Please use a Buyer account.");
      return;
    }

    let newFavs: Product[] = [];
    const exists = favourites.find(p => p.id === product.id);

    if (exists) {
      newFavs = favourites.filter(p => p.id !== product.id);
    } else {
      newFavs = [...favourites, product];
    }

    setFavourites(newFavs);

    if (isFirebaseConfigured) {
      await FirestoreService.updateLocalFavorites(user.uid, newFavs);
    }
  };

  return (
    <ShopContext.Provider value={{
      products, cart, user, loading, isCartOpen, theme, addToCart, removeFromCart, updateQuantity, toggleCart, toggleTheme, logout, refreshProducts: fetchProducts, cartTotal, favourites, toggleFavourite, saveAddress, placeOrder, cancelOrder, refreshUser
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};
