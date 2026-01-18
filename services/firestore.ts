
import { doc, getDoc, setDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove, collection, getDocs } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase";
import { User, CartItem, Product, Order, Address } from "../types";

// Helper to get user ref
const getUserRef = (uid: string) => doc(db, "users", uid);

/**
 * Creates a user profile if it doesn't exist.
 * Merges with existing data to avoid overwriting.
 */
export const createUserProfile = async (uid: string, userData: Partial<User>) => {
    if (!isFirebaseConfigured) return;
    try {
        const userRef = getUserRef(uid);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {
            await setDoc(userRef, {
                uid,
                name: userData.name || '',
                email: userData.email || '',
                role: userData.role || 'buyer',
                createdAt: new Date().toISOString(),
                cart: [],
                favourites: [],
                orderHistory: [],
                ...userData
            });
        }
    } catch (error) {
        console.error("Error creating user profile:", error);
    }
};

/**
 * Fetches the full user profile including cart, favorites, and orders.
 */
export const getUserData = async (uid: string) => {
    if (!isFirebaseConfigured) return null;
    try {
        const userRef = getUserRef(uid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
            return snapshot.data();
        }
        return null;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};

/**
 * Updates the user's cart in Firestore.
 * Replaces the entire cart array.
 */

/**
 * Updates the user's cart in Firestore.
 * Replaces the entire cart array.
 */

/**
 * Recursively sanitizes an object for Firestore by removing undefined values.
 * Firestore does not support 'undefined'.
 */
const sanitizeForFirestore = (obj: any): any => {
    if (obj === null || obj === undefined) return null;
    if (Array.isArray(obj)) return obj.map(sanitizeForFirestore);
    if (typeof obj === 'object' && !(obj instanceof Date)) {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = sanitizeForFirestore(value);
            }
            return acc;
        }, {} as any);
    }
    return obj;
};

/**
 * Updates the user's cart in Firestore.
 * Replaces the entire cart array.
 */
export const updateLocalCart = async (uid: string, cart: CartItem[]) => {
    if (!isFirebaseConfigured) return;
    try {
        const userRef = getUserRef(uid);
        // Use setDoc with merge to safely create if missing
        await setDoc(userRef, { cart: sanitizeForFirestore(cart) }, { merge: true });
    } catch (error) {
        console.error("Error updating cart:", error);
    }
};

/**
 * Updates the user's favorites in Firestore.
 * Replaces the entire favorites array.
 */
export const updateLocalFavorites = async (uid: string, favourites: Product[]) => {
    if (!isFirebaseConfigured) return;
    try {
        const userRef = getUserRef(uid);
        await setDoc(userRef, { favourites: sanitizeForFirestore(favourites) }, { merge: true });
    } catch (error) {
        console.error("Error updating favorites:", error);
    }
};

/**
 * Updates the user's order history.
 */
/**
 * Updates the user's order history.
 */
/**
 * Adds a new order to the top-level orders collection.
 */
export const addOrder = async (uid: string, order: Order) => {
    if (!isFirebaseConfigured) {
        try {
            // Simulation Mode: Save to localStorage
            const storedOrders = localStorage.getItem('axora_sim_orders');
            const orders = storedOrders ? JSON.parse(storedOrders) : [];
            const orderWithBuyer = { ...order, buyerId: uid };
            localStorage.setItem('axora_sim_orders', JSON.stringify([...orders, orderWithBuyer]));
            console.log("Order saved to localStorage (Simulation Mode)");
        } catch (e) {
            console.error("Simulation error saving order:", e);
        }
        return;
    }
    try {
        const orderRef = doc(db, "orders", order.id);
        await setDoc(orderRef, {
            ...sanitizeForFirestore(order),
            buyerId: uid,
            updatedAt: new Date().toISOString()
        });
        console.log("Order added to top-level collection successfully");
    } catch (error) {
        console.error("Error adding order:", error);
        throw error;
    }
};

/**
 * Updates the user's order history in their profile (legacy support/redundancy).
 */
export const updateUserOrders = async (uid: string, orderHistory: Order[]) => {
    if (!isFirebaseConfigured) return;
    try {
        const sanitizedOrders = sanitizeForFirestore(orderHistory);
        const userRef = getUserRef(uid);
        await setDoc(userRef, { orderHistory: sanitizedOrders }, { merge: true });
    } catch (error) {
        console.error("Error updating user profile orders:", error);
    }
};

/**
 * Updates the user's saved address.
 */
export const saveUserAddress = async (uid: string, savedAddress: Address) => {
    if (!isFirebaseConfigured) return;
    try {
        const userRef = getUserRef(uid);
        await setDoc(userRef, { savedAddress: sanitizeForFirestore(savedAddress) }, { merge: true });
    } catch (error) {
        console.error("Error saving address:", error);
    }
};

/**
 * Generic update for user profile.
 */
export const updateUserProfile = async (uid: string, data: Partial<User>) => {
    if (!isFirebaseConfigured) return;
    try {
        const userRef = getUserRef(uid);
        await setDoc(userRef, sanitizeForFirestore(data), { merge: true });
    } catch (error) {
        console.error("Error updating user profile:", error);
    }
};

/**
 * Fetches all orders for a specific user from the orders collection.
 */
export const getUserOrders = async (uid: string): Promise<Order[]> => {
    if (!isFirebaseConfigured) return [];
    try {
        const { query, where, collection, getDocs } = await import("firebase/firestore");
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("buyerId", "==", uid));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as Order);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return [];
    }
};

/**
 * Fetches all orders from the top-level collection that contain products sold by the given seller.
 */
export const getSellerOrders = async (sellerId: string) => {
    if (!isFirebaseConfigured) {
        // Simulation Mode: Read from localStorage
        try {
            const storedOrders = localStorage.getItem('axora_sim_orders');
            const allOrders = storedOrders ? JSON.parse(storedOrders) : [];
            const sellerOrders: any[] = [];

            allOrders.forEach((orderData: any) => {
                if (orderData.items && Array.isArray(orderData.items)) {
                    const myItems = orderData.items.filter((item: any) =>
                        item.sellerId === sellerId || (!item.sellerId && sellerId === 'system-seller')
                    );

                    if (myItems.length > 0) {
                        sellerOrders.push({
                            orderId: orderData.id,
                            customerId: orderData.buyerId,
                            shippingAddress: orderData.shippingAddress,
                            customerName: orderData.customerName,
                            customerEmail: orderData.customerEmail,
                            orderDate: orderData.date,
                            status: orderData.status,
                            items: myItems,
                            totalAmount: myItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
                        });
                    }
                }
            });
            return sellerOrders;
        } catch (e) {
            console.error("Simulation error fetching seller orders:", e);
            return [];
        }
    }
    try {
        const { query, where, collection, getDocs } = await import("firebase/firestore");
        const ordersRef = collection(db, "orders");

        // If the user is an admin, they might want to see EVERYTHING.
        // However, this function is usually called by the Seller Dashboard for a specific UID.
        // If we want to allow admins to see everything, we can check for a special flag or just trust the UID.

        let q;
        if (sellerId === 'admin-all') {
            q = query(ordersRef);
        } else {
            q = query(ordersRef, where("sellerId", "==", sellerId));
        }

        const snapshot = await getDocs(q);

        const sellerOrders: any[] = [];
        snapshot.forEach(doc => {
            const orderData = doc.data() as Order & { buyerId: string };
            // Since we query by top-level sellerId, all items in this order
            // belong to this seller (due to our order splitting logic)
            if (orderData.items && Array.isArray(orderData.items)) {
                sellerOrders.push({
                    orderId: orderData.id,
                    customerId: orderData.buyerId,
                    shippingAddress: orderData.shippingAddress,
                    customerName: orderData.customerName,
                    customerEmail: orderData.customerEmail,
                    orderDate: orderData.date,
                    status: orderData.status,
                    items: orderData.items,
                    totalAmount: orderData.total || 0
                });
            }
        });

        // Also fetch system-seller items if seller is an admin or testing
        if (sellerId === 'system-seller' || sellerId.includes('sim_')) {
            // For testing, we might want to see items with NO seller id
            // but usually sellerId is always set now.
        }

        return sellerOrders;
    } catch (error) {
        console.error("Error fetching seller orders:", error);
        return [];
    }
};

/**
 * Fetches all users from Firestore (Admin use).
 */
export const getAllUsers = async () => {
    if (!isFirebaseConfigured) {
        try {
            const storedDb = localStorage.getItem('axora_users_db');
            if (storedDb) {
                const mockDb = JSON.parse(storedDb);
                return Object.values(mockDb) as User[];
            }
            return [];
        } catch (e) {
            console.error("Simulation error fetching all users:", e);
            return [];
        }
    }
    try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);
        return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

/**
 * Deletes a user profile from Firestore (Admin use).
 */
export const deleteUser = async (uid: string) => {
    if (!isFirebaseConfigured) return;
    try {
        await deleteDoc(doc(db, "users", uid));
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

/**
 * Updates the status of a specific order in the top-level orders collection.
 */
export const updateOrderStatus = async (customerId: string, orderId: string, newStatus: string) => {
    if (!isFirebaseConfigured) {
        try {
            // Simulation Mode: Update in localStorage
            const storedOrders = localStorage.getItem('axora_sim_orders');
            if (storedOrders) {
                const orders = JSON.parse(storedOrders);
                const updatedOrders = orders.map((o: any) =>
                    o.id === orderId ? { ...o, status: newStatus } : o
                );
                localStorage.setItem('axora_sim_orders', JSON.stringify(updatedOrders));
                console.log("Order status updated in localStorage (Simulation Mode)");
            }
        } catch (e) {
            console.error("Simulation error updating order status:", e);
        }
        return;
    }
    try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, {
            status: newStatus,
            updatedAt: new Date().toISOString()
        });

        // Also update the redundant order history in the user profile if possible
        try {
            const userRef = getUserRef(customerId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const userData = userSnap.data() as User;
                const updatedHistory = userData.orderHistory.map(o =>
                    o.id === orderId ? { ...o, status: newStatus as any } : o
                );
                await updateDoc(userRef, { orderHistory: updatedHistory });
            }
        } catch (e: any) {
            console.warn("Could not update buyer profile order history (expected for sellers):", e.message);
        }
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
};

/**
 * Fetches all orders from the platform (Admin use).
 */
export const getAllOrders = async (): Promise<Order[]> => {
    let ordersList: any[] = [];
    const seenIds = new Set<string>();

    const safeAdd = (o: any) => {
        const oid = o.id || o.orderId;
        if (oid && !seenIds.has(oid)) {
            seenIds.add(oid);
            ordersList.push(o);
        }
    };

    // Source 1: Firestore Orders Collection
    if (isFirebaseConfigured) {
        try {
            const ordersRef = collection(db, "orders");
            const snapshot = await getDocs(ordersRef);
            snapshot.docs.forEach(doc => safeAdd({ ...doc.data(), id: doc.id }));
            console.log(`AXORA SYNC: Found ${ordersList.length} global Firestore orders.`);
        } catch (error) {
            console.warn("AXORA SYNC: Global orders collection unreachable:", error);
        }
    }

    // Source 2: Simulation Mode (axora_sim_orders)
    try {
        const storedOrders = localStorage.getItem('axora_sim_orders');
        if (storedOrders) {
            const simOrders = JSON.parse(storedOrders);
            simOrders.forEach(safeAdd);
            console.log(`AXORA SYNC: Total after crossing with simulation storage: ${ordersList.length}`);
        }
    } catch (e) { console.error("AXORA SYNC: Sim_orders parse error:", e); }

    // Source 3: Cross-User Profile Scan (The 'Deep Scan')
    // This handles orders stored ONLY in buyer profiles
    try {
        const allUsers = await getAllUsers();
        allUsers.forEach((u: any) => {
            if (u.orderHistory && Array.isArray(u.orderHistory)) {
                u.orderHistory.forEach(safeAdd);
            }
        });
        console.log(`AXORA SYNC: Final order count after deep scan of all user profiles: ${ordersList.length}`);
    } catch (err) {
        console.warn("AXORA SYNC: Cross-user scan failed:", err);
    }

    return ordersList as Order[];
};
