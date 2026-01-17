import React, { useState, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { db, storage, isFirebaseConfigured } from '../firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getSellerOrders, updateOrderStatus } from '../services/firestore';
import { Address, CartItem } from '../types';

const STANDARD_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'];
const ADULT_FOOTWEAR_SIZES = ['6', '7', '8', '9', '10', '11', '12'];
const BABY_KIDS_FOOTWEAR_SIZES = ['2', '3', '4', '5'];
const ALL_FOOTWEAR_SIZES = [...BABY_KIDS_FOOTWEAR_SIZES, ...ADULT_FOOTWEAR_SIZES];
const CATEGORIES = ['Apparel', 'Accessories', 'Timepieces', 'Fragrance', 'Bags', 'Electronics', 'Home', 'Furniture', 'Footwear'];

// Simulation Channel for multi-tab synchronization without a real DB
const maisonSyncChannel = new BroadcastChannel('axora_marketplace_sync');
const PLATFORM_TAX_RATE = 0.05; // 5% Platform Tax

const SellerDashboard: React.FC = () => {
  const { user, products, refreshProducts } = useShop();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Apparel');
  const [newCategory, setNewCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('url');
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [returnAvailable, setReturnAvailable] = useState(false);
  const [returnPeriod, setReturnPeriod] = useState('');
  const [codAvailable, setCodAvailable] = useState(true);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [sellerOrders, setSellerOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'add-product'>('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchOrders = async () => {
    if (user && (user.role === 'seller' || user.role === 'admin')) {
      console.log(`AXORA: Fetching orders for ${user.role} (UID: ${user.uid})...`);
      const orders = await getSellerOrders(user.uid);
      console.log(`AXORA: Received ${orders.length} orders.`);
      setSellerOrders(orders);
      setLastUpdated(new Date());
    } else {
      console.log("AXORA: User is not a seller, skipping order fetch.", user);
    }
  };

  React.useEffect(() => {
    fetchOrders();

    const handleSync = (event: MessageEvent) => {
      if (event.data === 'REFRESH_USER_DATA' || event.data === 'REFRESH_ORDERS') {
        fetchOrders();
      }
    };

    maisonSyncChannel.addEventListener('message', handleSync);
    return () => maisonSyncChannel.removeEventListener('message', handleSync);
  }, [user]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    refreshProducts();
    // Simulate a small delay for the spinner to be visible
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  if (!user || user.role !== 'seller') {
    return (
      <div className="p-20 text-center font-serif text-charcoal h-screen bg-offwhite">
        Access Denied. Only registered Sellers can view this atelier.
      </div>
    );
  }

  const myProducts = products.filter(p => p.sellerId === user.uid);

  const calculateGrossRevenue = () => {
    return sellerOrders.reduce((total, order) => total + (order.totalAmount || 0), 0);
  };

  const grossRevenue = calculateGrossRevenue();
  const estimatedTax = grossRevenue * PLATFORM_TAX_RATE;
  const netRevenue = grossRevenue - estimatedTax;

  const handleOrderStatusUpdate = async (orderId: string, customerId: string, status: string) => {
    if (isFirebaseConfigured && db) {
      try {
        await updateOrderStatus(customerId, orderId, status);
        const updated = await getSellerOrders(user.uid);
        setSellerOrders(updated);
        console.log("Order status updated successfully");
      } catch (e) {
        console.error("Order update failed", e);
        alert("Failed to update status");
      }
    } else {
      // Simulation Mode Persistence
      try {
        const storedDb = localStorage.getItem('axora_users_db');
        const mockDb = storedDb ? JSON.parse(storedDb) : {};

        if (mockDb[customerId]) {
          const customerData = mockDb[customerId];
          customerData.orderHistory = customerData.orderHistory.map((order: any) =>
            order.id === orderId ? { ...order, status } : order
          );

          mockDb[customerId] = customerData;
          localStorage.setItem('axora_users_db', JSON.stringify(mockDb));

          // If the customer is also the currently logged in simulated user, update their session too
          const savedUser = localStorage.getItem('axora_sim_user');
          if (savedUser) {
            const currentUser = JSON.parse(savedUser);
            if (currentUser.uid === customerId) {
              currentUser.orderHistory = customerData.orderHistory;
              localStorage.setItem('axora_sim_user', JSON.stringify(currentUser));
            }
          }

          // Update local state for seller dashboard
          setSellerOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status } : o));

          // Broadcast refresh to other tabs (like the Buyer's order page)
          maisonSyncChannel.postMessage('REFRESH_USER_DATA');
          console.log("Simulation: Order status updated and broadcast sent");
        }
      } catch (e) {
        console.error("Simulation update failed", e);
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to remove this listing? This action cannot be undone.")) return;

    setLoading(true);
    try {
      if (isFirebaseConfigured && db) {
        await deleteDoc(doc(db, "products", productId));
      } else {
        const stored = localStorage.getItem('axora_simulated_products');
        if (stored) {
          const simProducts = JSON.parse(stored);
          const updated = simProducts.filter((p: any) => p.id !== productId);
          localStorage.setItem('axora_simulated_products', JSON.stringify(updated));
          const maisonSyncChannel = new BroadcastChannel('axora_marketplace_sync');
          maisonSyncChannel.postMessage('REFRESH_PRODUCTS');
        }
      }
      refreshProducts();
      alert("Product removed successfully.");
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // Create local preview
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageMode === 'upload' && !imageFile) {
      alert("Please select an image file to upload");
      return;
    }
    if (imageMode === 'url' && !imageUrl) {
      alert("Please enter a valid image URL");
      return;
    }
    setLoading(true);

    try {
      console.log("Starting product listing process...");
      const finalCategory = category === 'new' ? newCategory : category;
      let finalImageUrl = '';

      if (imageMode === 'upload' && imageFile) {
        // Use Cloudinary for free file uploads
        const CLOUDINARY_CLOUD_NAME = 'djscbum3p';
        const CLOUDINARY_UPLOAD_PRESET = 'eoe1yyqm';

        console.log("Uploading image to Cloudinary...");
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData }
        );

        if (!response.ok) {
          throw new Error("Cloudinary upload failed. Check your preset and internet.");
        }

        const data = await response.json();
        finalImageUrl = data.secure_url;
        console.log("Cloudinary URL obtained:", finalImageUrl);
      } else if (imageMode === 'url' && imageUrl) {
        finalImageUrl = imageUrl;
      }

      if (!finalImageUrl) {
        throw new Error("Missing product image source");
      }

      // 2. Add to or Update Firestore
      if (isFirebaseConfigured && db) {
        console.log("Saving product to Firestore...");
        const productData = {
          name,
          category: finalCategory,
          price: parseFloat(price),
          description,
          images: [finalImageUrl],
          sizes: selectedSizes,
          availability: true,
          sellerId: user.uid,
          returnPolicy: returnAvailable ? 'Returns Available' : 'No Returns',
          returnPeriod: returnAvailable ? parseInt(returnPeriod) || 0 : 0,
          codAvailable: codAvailable,
          updatedAt: new Date().toISOString()
        };

        if (editingProductId) {
          // Update existing
          await updateDoc(doc(db, "products", editingProductId), productData);
          console.log("Product updated in Firestore:", editingProductId);
        } else {
          // Add new
          const docRef = await addDoc(collection(db, "products"), {
            ...productData,
            createdAt: new Date().toISOString()
          });
          console.log("Product added to Firestore with ID:", docRef.id);
        }
      } else {
        // Simulation mode
        const productData = {
          name,
          category: finalCategory,
          price: parseFloat(price),
          description,
          images: [finalImageUrl],
          sizes: selectedSizes,
          availability: true,
          sellerId: user.uid,
          returnPolicy: returnAvailable ? 'Returns Available' : 'No Returns',
          returnPeriod: returnAvailable ? parseInt(returnPeriod) || 0 : 0,
          codAvailable: codAvailable,
          updatedAt: new Date().toISOString()
        };

        const stored = localStorage.getItem('axora_simulated_products');
        const simProducts = stored ? JSON.parse(stored) : [];

        if (editingProductId) {
          const updated = simProducts.map((p: any) => p.id === editingProductId ? { ...p, ...productData } : p);
          localStorage.setItem('axora_simulated_products', JSON.stringify(updated));
        } else {
          const simProduct = { ...productData, id: 'sim_' + Date.now(), createdAt: new Date().toISOString() };
          localStorage.setItem('axora_simulated_products', JSON.stringify([...simProducts, simProduct]));
        }

        const maisonSyncChannel = new BroadcastChannel('axora_marketplace_sync');
        maisonSyncChannel.postMessage('REFRESH_PRODUCTS');
      }

      console.log("Resetting form and refreshing products...");
      // Reset
      setName('');
      setCategory('Apparel');
      setNewCategory('');
      setPrice('');
      setDescription('');
      setImageFile(null);
      setImageUrl('');
      setPreviewUrl('');
      setSelectedSizes([]);
      setReturnAvailable(false);
      setReturnPeriod('');
      setCodAvailable(true);
      setEditingProductId(null);
      setIsFormOpen(false);
      refreshProducts();
      console.log("Product save process complete.");
    } catch (err: any) {
      console.error("Error listing creation:", err);

      if (err.message?.includes('storage') || err.code?.includes('storage')) {
        alert("Firebase Storage is not enabled or requires a billing plan. Please use the 'Image Link' option above to list your product for free!");
        setImageMode('url');
      } else {
        alert("Failed to list creation. Please check your connection or Firestore rules.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: any) => {
    setName(product.name);
    setCategory(product.category);
    setPrice(product.price.toString());
    setDescription(product.description || '');
    setImageMode('url');
    setImageUrl(product.images[0]);
    setPreviewUrl(product.images[0]);
    setSelectedSizes(product.sizes || []);
    setReturnAvailable(product.returnPolicy === 'Returns Available');
    setReturnPeriod(product.returnPeriod ? product.returnPeriod.toString() : '');
    setCodAvailable(!!product.codAvailable);
    setEditingProductId(product.id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  return (
    <div className="min-h-screen bg-offwhite dark:bg-charcoal py-12 px-6 transition-colors">
      <div className="container mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-gold/20 pb-10 gap-6">
          <div>
            <span className="text-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block">Seller Portal</span>
            <h1 className="text-4xl font-serif text-charcoal dark:text-offwhite uppercase tracking-widest">Seller Dashboard</h1>
            <p className="text-[9px] text-neutral-400 uppercase tracking-widest mt-2">
              Last synced: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-2 bg-white dark:bg-charcoal border border-neutral-200 dark:border-neutral-700 text-charcoal dark:text-offwhite px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:border-gold transition-all shadow-sm group disabled:opacity-50"
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
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <button
              onClick={() => {
                if (isFormOpen) {
                  setEditingProductId(null);
                  setName('');
                  setCategory('Apparel');
                  setNewCategory('');
                  setPrice('');
                  setDescription('');
                  setImageFile(null);
                  setImageUrl('');
                  setPreviewUrl('');
                  setSelectedSizes([]);
                  setReturnAvailable(false);
                  setReturnPeriod('');
                  setCodAvailable(true);
                }
                setIsFormOpen(!isFormOpen);
              }}
              className="bg-charcoal dark:bg-gold text-white dark:text-charcoal w-full md:w-auto px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-clay transition-all shadow-xl rounded md:rounded-none mt-4 md:mt-0"
            >
              {isFormOpen ? 'Close Form' : '+ Add New Product'}
            </button>
          </div>
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

        {isFormOpen && (
          <div className="bg-white dark:bg-clay p-10 shadow-2xl mb-16 border-t-2 border-gold animate-fadeIn">
            <h2 className="text-xl font-serif dark:text-offwhite mb-6 md:mb-10 uppercase tracking-widest text-center md:text-left">
              {editingProductId ? 'Edit Product Details' : 'Add Product Details'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="border-b border-neutral-200 dark:border-neutral-700 pb-2">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Product Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} required className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite" placeholder="E.G. Blue Cotton Saree" />
                </div>

                <div className="border-b border-neutral-200 dark:border-neutral-700 pb-2">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-white dark:bg-clay focus:outline-none text-xs uppercase tracking-widest text-charcoal dark:text-offwhite cursor-pointer py-1"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-white dark:bg-clay text-charcoal dark:text-offwhite">
                        {cat}
                      </option>
                    ))}
                    <option value="new" className="bg-white dark:bg-clay text-gold font-bold">+ ADD NEW CATEGORY</option>
                  </select>
                </div>

                {category === 'new' && (
                  <div className="border-b border-neutral-200 dark:border-neutral-700 pb-2">
                    <label className="text-[9px] font-bold text-gold uppercase tracking-widest block mb-1">New Category Name</label>
                    <input value={newCategory} onChange={e => setNewCategory(e.target.value)} required className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite" placeholder="E.G. TOYS" />
                  </div>
                )}

                <div className="border-b border-neutral-200 dark:border-neutral-700 pb-2">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Price (₹)</label>
                  <input value={price} onChange={e => setPrice(e.target.value)} required type="number" className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite" placeholder="850" />
                </div>

                {(category === 'Apparel' || category === 'Footwear' || category === 'new') && (
                  <div className="pt-4">
                    <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-4">
                      Available Sizes {category === 'Footwear' ? '(Baby to Adult)' : ''}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(category === 'Footwear' ? ALL_FOOTWEAR_SIZES : STANDARD_SIZES).map(size => (
                        <label key={size} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedSizes.includes(size)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSizes([...selectedSizes, size]);
                              } else {
                                setSelectedSizes(selectedSizes.filter(s => s !== size));
                              }
                            }}
                            className="hidden"
                          />
                          <div className={`w-full py-2 text-center text-[10px] font-bold border transition-all ${selectedSizes.includes(size) ? 'bg-gold border-gold text-charcoal' : 'border-neutral-200 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500 hover:border-gold'}`}>
                            {size}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="border-b border-neutral-200 dark:border-neutral-700 pb-2">
                  <div className="flex justify-between">
                    <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Product Description</label>
                    <span className={`text-[8px] font-bold tracking-widest ${description.length >= 150 ? 'text-red-500' : 'text-neutral-400'}`}>
                      {description.length} / 150
                    </span>
                  </div>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    maxLength={150}
                    required
                    className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite h-24 resize-none"
                    placeholder="Short description... (Max 150 chars)"
                  />
                </div>

                <div className="border-b border-neutral-200 dark:border-neutral-700 pb-2">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Product Image</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setImageMode('url')}
                        className={`text-[8px] font-bold px-2 py-1 uppercase tracking-widest border transition-all ${imageMode === 'url' ? 'bg-gold text-charcoal border-gold' : 'text-neutral-400 border-neutral-200 dark:border-neutral-700'}`}
                      >
                        Image Link
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode('upload')}
                        className={`text-[8px] font-bold px-2 py-1 uppercase tracking-widest border transition-all ${imageMode === 'upload' ? 'bg-gold text-charcoal border-gold' : 'text-neutral-400 border-neutral-200 dark:border-neutral-700'}`}
                      >
                        Upload File
                      </button>
                    </div>
                  </div>

                  {imageMode === 'upload' ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-[10px] file:font-semibold file:bg-gold file:text-charcoal hover:file:bg-offwhite transition-all cursor-pointer"
                    />
                  ) : (
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={e => {
                        setImageUrl(e.target.value);
                        setPreviewUrl(e.target.value);
                      }}
                      className="w-full bg-transparent focus:outline-none text-[10px] uppercase tracking-widest dark:text-offwhite py-2"
                      placeholder="HTTPS://EXAMPLE.COM/IMAGE.JPG"
                    />
                  )}

                  {previewUrl && (
                    <div className="mt-4">
                      <img src={previewUrl} alt="Preview" className="h-32 w-full object-cover shadow-md border border-gold/20" />
                    </div>
                  )}
                </div>

                {/* Delivery & Returns Section */}
                <div className="border-b border-neutral-200 dark:border-neutral-700 pb-2">
                  <h4 className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Delivery & Returns</h4>

                  {/* COD Option */}
                  <label className="flex items-center gap-3 mb-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={codAvailable}
                      onChange={e => setCodAvailable(e.target.checked)}
                      className="w-4 h-4 accent-gold"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest dark:text-offwhite">Cash on Delivery Available</span>
                  </label>

                  {/* Return Policy */}
                  <label className="flex items-center gap-3 mb-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={returnAvailable}
                      onChange={e => setReturnAvailable(e.target.checked)}
                      className="w-4 h-4 accent-gold"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest dark:text-offwhite">Return Option Available</span>
                  </label>

                  {returnAvailable && (
                    <div className="ml-7 animate-fadeIn">
                      <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Return Period (Days)</label>
                      <input
                        type="number"
                        value={returnPeriod}
                        onChange={e => setReturnPeriod(e.target.value)}
                        className="w-20 bg-transparent border-b border-neutral-300 focus:border-gold outline-none text-xs uppercase tracking-widest dark:text-offwhite pl-2"
                        placeholder="7"
                        min="0"
                      />
                    </div>
                  )}
                </div>

                <button
                  disabled={loading || (imageMode === 'upload' ? !imageFile && !editingProductId : !imageUrl && !editingProductId)}
                  type="submit"
                  className="w-full bg-charcoal dark:bg-gold text-white dark:text-charcoal py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-gold dark:hover:bg-offwhite transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : (editingProductId ? 'Update Listing' : 'List Product')}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
          {[
            { label: 'Gross Revenue', value: `₹ ${grossRevenue.toLocaleString()}` },
            { label: 'Platform Tax (5%)', value: `₹ ${estimatedTax.toLocaleString()}`, color: 'text-red-500' },
            { label: 'Net Revenue', value: `₹ ${netRevenue.toLocaleString()}`, color: 'text-gold' },
            { label: 'Active Listings', value: myProducts.length },
            { label: 'Pending Orders', value: sellerOrders.filter(o => o.status === 'Processing').length }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 md:p-6 rounded shadow-sm border border-neutral-100 dark:bg-clay dark:border-neutral-800">
              <p className="text-neutral-500 text-[8px] md:text-[10px] uppercase tracking-widest mb-1 md:mb-2">{stat.label}</p>
              <p className={`text-lg md:text-2xl font-sans font-bold ${stat.color || 'text-charcoal dark:text-offwhite'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        {/* Tab Navigation - Scrollable on Mobile */}
        <div className="flex overflow-x-auto gap-4 mb-8 border-b border-neutral-200 pb-4 no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap text-xs md:text-sm uppercase tracking-widest pb-2 transition-colors ${activeTab === 'dashboard' ? 'text-gold border-b-2 border-gold' : 'text-neutral-400 hover:text-charcoal'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`whitespace-nowrap text-xs md:text-sm uppercase tracking-widest pb-2 transition-colors ${activeTab === 'orders' ? 'text-gold border-b-2 border-gold' : 'text-neutral-400 hover:text-charcoal'}`}
          >
            Client Orders
            {sellerOrders.some(o => o.status === 'Processing') && <span className="ml-2 w-2 h-2 bg-red-500 rounded-full inline-block"></span>}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`whitespace-nowrap text-xs md:text-sm uppercase tracking-widest pb-2 transition-colors ${activeTab === 'products' ? 'text-gold border-b-2 border-gold' : 'text-neutral-400 hover:text-charcoal'}`}
          >
            My Inventory
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded overflow-hidden shadow-sm border border-neutral-200 min-h-[400px]">

          {/* DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="p-8 flex flex-col items-center justify-center text-center h-full text-neutral-400">
              <p className="mb-4">Select a tab to manage your boutique.</p>
            </div>
          )}

          {/* ADD PRODUCT FORM (If accessed directly via tab, though button controls overlay usually) */}
          {activeTab === 'add-product' && (
            <div className="p-8 flex flex-col items-center justify-center text-center h-full text-neutral-400">
              <p>Please use the "+ New Collection" button above to open the listing form.</p>
            </div>
          )}

          {/* MY PRODUCTS LIST */}
          {activeTab === 'products' && (
            <div className="p-4 md:p-8">
              <h2 className="text-xl font-serif text-charcoal mb-6">Inventory Management</h2>

              {/* Mobile Cards for Products */}
              <div className="md:hidden space-y-4">
                {myProducts.map((p) => (
                  <div key={p.id} className="border border-neutral-100 p-4 rounded bg-neutral-50 shadow-sm flex gap-4 items-start">
                    <img src={p.images[0]} className="w-20 h-20 object-cover rounded bg-white shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-charcoal text-xs truncate pr-2">{p.name}</h3>
                        <span className="text-gold font-sans font-bold text-sm">₹{p.price.toLocaleString()}</span>
                      </div>
                      <p className="text-[10px] text-neutral-500 mb-2 uppercase tracking-wide">{p.category}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="bg-green-100 text-green-800 text-[9px] px-2 py-0.5 rounded uppercase tracking-widest font-bold">Active</span>
                        <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 text-[9px] uppercase tracking-widest font-bold border border-red-200 px-3 py-1.5 rounded hover:bg-red-50">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
                {myProducts.length === 0 && <p className="text-center text-neutral-400 text-xs italic py-8">No items listed yet.</p>}
              </div>

              {/* Desktop Table for Products */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-neutral-200">
                    <tr>
                      <th className="pb-4 text-xs font-bold uppercase tracking-widest text-neutral-400">Item</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-widest text-neutral-400">Category</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-widest text-neutral-400">Price</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-widest text-neutral-400">Status</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-widest text-neutral-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {myProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="py-4 flex items-center gap-3">
                          <img src={p.images[0]} className="w-10 h-10 object-cover rounded" />
                          <span className="font-medium">{p.name}</span>
                        </td>
                        <td className="py-4 text-sm text-neutral-600">{p.category}</td>
                        <td className="py-4 font-sans font-bold text-charcoal">₹{p.price.toLocaleString()}</td>
                        <td className="py-4"><span className="bg-green-100 text-green-800 text-[10px] px-2 py-1 rounded uppercase tracking-widest">Active</span></td>
                        <td className="py-4">
                          <button onClick={() => handleDeleteProduct(p.id)} className="text-red-400 hover:text-red-600 text-[10px] uppercase tracking-widest font-bold">Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ORDERS LIST */}
          {activeTab === 'orders' && (
            <div className="p-4 md:p-8">
              <h2 className="text-xl font-serif text-charcoal mb-6">Order Fulfillment</h2>

              {/* Mobile Cards for Orders */}
              <div className="md:hidden space-y-4">
                {sellerOrders.map((order) => (
                  <div key={order.orderId} className="border border-neutral-100 p-4 rounded bg-neutral-50 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-charcoal text-xs">Order #{order.orderId ? order.orderId.slice(0, 8) : 'N/A'}</p>
                        <p className="text-[10px] text-neutral-500">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold ${order.status === 'Processing' ? 'bg-green-100 text-green-800' :
                        order.status.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-neutral-100 text-neutral-600'
                        }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="bg-white rounded p-2 mb-3 border border-neutral-100">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-[10px] py-1 border-b border-neutral-50 last:border-0">
                          <span className="text-charcoal font-medium">{item.name} <span className="text-neutral-400">x{item.quantity}</span></span>
                          <span className="font-sans font-bold text-charcoal">₹{item.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mb-4 px-1">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total Amount</span>
                      <span className="text-sm font-sans font-bold text-gold font-bold">₹{(order.totalAmount || 0).toLocaleString()}</span>
                    </div>

                    {order.status === 'Processing' && (
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleOrderStatusUpdate(order.orderId, order.customerId, 'Shipped')} className="bg-charcoal text-white py-2 rounded text-[9px] uppercase tracking-widest hover:bg-black font-bold text-center">
                          Ship Order
                        </button>
                        <button onClick={() => handleOrderStatusUpdate(order.orderId, order.customerId, 'Cancelled')} className="bg-white border border-red-200 text-red-500 py-2 rounded text-[9px] uppercase tracking-widest hover:bg-red-50 font-bold text-center">
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {sellerOrders.length === 0 && <p className="text-center text-neutral-400 text-xs italic py-8">No active orders found.</p>}
              </div>

              {/* Desktop Table for Orders */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-neutral-200">
                    <tr>
                      <th className="pb-4 text-xs font-bold uppercase tracking-widest text-neutral-400">Order ID</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-widest text-neutral-400">Date</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-widest text-neutral-400">Items</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-widest text-neutral-400">Total</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-widest text-neutral-400">Status</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-widest text-neutral-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {sellerOrders.map((order) => (
                      <tr key={order.orderId} className="hover:bg-neutral-50 transition-colors">
                        <td className="py-4 font-mono text-xs text-neutral-400">{(order.orderId || '').slice(0, 8)}</td>
                        <td className="py-4 text-xs text-neutral-600 font-medium">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '-'}</td>
                        <td className="py-4">
                          <div className="space-y-1">
                            {order.items.map((item: any, i: number) => (
                              <div key={i} className="text-xs text-charcoal">
                                {item.name} <span className="text-neutral-400">x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 font-sans font-bold text-charcoal font-bold">₹{(order.totalAmount || 0).toLocaleString()}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold ${order.status.toLowerCase() === 'processing' ? 'bg-green-100 text-green-800' :
                            order.status.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-neutral-100 text-neutral-600'
                            }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4">
                          {order.status === 'Processing' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleOrderStatusUpdate(order.orderId, order.customerId, 'Shipped')} className="text-green-600 hover:text-green-800 text-[9px] uppercase tracking-widest font-bold border border-green-200 px-2 py-1 rounded transition-colors">Ship</button>
                              <button onClick={() => handleOrderStatusUpdate(order.orderId, order.customerId, 'Cancelled')} className="text-red-400 hover:text-red-600 text-[9px] uppercase tracking-widest font-bold px-2 py-1">Cancel</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;