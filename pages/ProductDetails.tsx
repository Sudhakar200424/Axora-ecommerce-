
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, user } = useShop();
  const product = products.find(p => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');

  if (!product) return <div className="p-32 text-center dark:text-offwhite font-serif">Desire not found.</div>;

  const handleAddToCart = () => {
    if (user?.role === 'seller') {
      alert("Sellers cannot purchase products. Please log in as a Buyer to shop.");
      return;
    }
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size to proceed.");
      return;
    }
    addToCart(product, selectedSize);
  };

  const handleBuyNow = () => {
    if (user?.role === 'seller') {
      alert("Sellers cannot purchase products. Please log in as a Buyer to shop.");
      return;
    }
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size to proceed.");
      return;
    }
    addToCart(product, selectedSize);
    navigate('/checkout');
  };

  const originalPrice = Math.round(product.price * 1.35);
  const recommendations = products.filter(p => p.id !== product.id).slice(0, 4);

  // Delivery State
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [pincode, setPincode] = useState<string>('');

  useEffect(() => {
    if (user) {
      if (user.savedAddress?.zipCode) {
        setPincode(user.savedAddress.zipCode);
      } else {
        setShowAddressModal(true);
      }
    }
  }, [user]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = () => {
    if (!address.street || !address.city || !address.zipCode || !address.phone) {
      alert("Please fill in all required details.");
      return;
    }
    // Save to profile via Context if needed, or just use locally for this session
    // For now, we just use it to show delivery estimate
    setPincode(address.zipCode);
    setShowAddressModal(false);
  };

  return (
    <div className="bg-offwhite dark:bg-charcoal min-h-screen transition-colors pb-20 relative">
      {/* Address Entry Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 p-8 shadow-2xl max-w-lg w-full border-t-4 border-gold h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-serif dark:text-offwhite mb-2">Check Delivery Availability</h3>
            <p className="text-xs text-neutral-500 mb-6">Please provide your delivery details to check availability and estimated dates.</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="col-span-1 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                <input name="firstName" placeholder="First Name" value={address.firstName} onChange={handleAddressChange} type="text" className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite placeholder:text-neutral-400" />
              </div>
              <div className="col-span-1 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                <input name="lastName" placeholder="Last Name" value={address.lastName} onChange={handleAddressChange} type="text" className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite placeholder:text-neutral-400" />
              </div>
              <div className="col-span-2 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                <input name="street" placeholder="Street Address" value={address.street} onChange={handleAddressChange} type="text" className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite placeholder:text-neutral-400" />
              </div>
              <div className="col-span-1 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                <input name="city" placeholder="City" value={address.city} onChange={handleAddressChange} type="text" className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite placeholder:text-neutral-400" />
              </div>
              <div className="col-span-1 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                <input name="state" placeholder="State" value={address.state} onChange={handleAddressChange} type="text" className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite placeholder:text-neutral-400" />
              </div>
              <div className="col-span-1 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                <input name="zipCode" placeholder="ZIP Code" value={address.zipCode} onChange={handleAddressChange} type="text" maxLength={6} className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite placeholder:text-neutral-400" />
              </div>
              <div className="col-span-1 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                <input name="phone" placeholder="Phone" value={address.phone} onChange={handleAddressChange} type="text" className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite placeholder:text-neutral-400" />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowAddressModal(false)}
                className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-charcoal dark:hover:text-white"
              >
                Later
              </button>
              <button
                onClick={handleAddressSubmit}
                className="flex-1 py-3 bg-charcoal dark:bg-gold text-white dark:text-charcoal text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Check
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto px-0 md:px-6 py-0 md:py-12">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-16 bg-white dark:bg-clay md:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle background brand text - Adjust for mobile */}
          <div className="absolute top-0 right-0 text-[80px] md:text-[180px] font-bold text-neutral-50 dark:text-neutral-900 pointer-events-none select-none -translate-y-1/2 translate-x-1/4 uppercase tracking-tighter opacity-10">AXORA</div>

          {/* Left: Premium Gallery & Actions */}
          <div className="lg:w-1/2 space-y-6 md:space-y-8 relative z-10 px-6 pt-8 md:p-0">
            <div className="md:sticky md:top-28">
              <div className="border border-neutral-100 dark:border-neutral-800 p-6 md:p-12 aspect-[4/5] flex items-center justify-center bg-pearl">
                <img src={product.images[selectedImage]} alt={product.name} className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-700" />
              </div>

              {user?.role === 'seller' ? (
                <div className="mt-8 p-6 bg-gold/5 border border-gold/20 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gold mb-2">Seller Mode Enabled</p>
                  <p className="text-[9px] text-neutral-500 uppercase tracking-widest leading-relaxed">Purchasing and adding to cart is disabled for Seller accounts. Sign in as a Buyer to build your collection.</p>
                </div>
              ) : (
                <div className="flex gap-3 md:gap-4 mt-6 md:mt-8">
                  <button
                    onClick={handleAddToCart}
                    className="flex-grow bg-charcoal dark:bg-offwhite text-offwhite dark:text-charcoal font-bold py-3 md:py-5 text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-gold dark:hover:bg-gold transition-all shadow-xl"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-grow border-2 border-gold text-gold font-bold py-3 md:py-5 text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-gold hover:text-charcoal transition-all"
                  >
                    Buy Now
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Sophisticated Information */}
          <div className="lg:w-1/2 relative z-10 px-6 pb-8 md:p-0">
            <nav className="text-[9px] md:text-[10px] text-neutral-400 uppercase tracking-widest mb-6 md:mb-10 flex gap-3 items-center pt-8 md:pt-0">
              <Link to="/" className="hover:text-gold transition-colors">Home</Link>
              <span className="w-1 h-1 bg-gold rounded-full"></span>
              <span className="text-charcoal dark:text-offwhite">{product.category}</span>
            </nav>

            <h1 className="text-3xl md:text-5xl font-serif mb-4 md:mb-6 dark:text-offwhite leading-tight">{product.name}</h1>

            <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-10">
              <div className="flex items-center gap-1 bg-gold/10 px-2 py-1 md:px-3 border border-gold/20">
                <span className="text-[10px] md:text-[11px] font-bold text-gold">4.9 / 5</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-gold" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" /></svg>
              </div>
              <span className="text-[9px] md:text-[10px] text-neutral-400 font-bold uppercase tracking-widest">1,240 Collectors' Reviews</span>
            </div>

            <div className="flex items-baseline gap-4 md:gap-6 mb-6">
              <span className="text-2xl md:text-4xl font-bold dark:text-offwhite tracking-tight">₹ {product.price.toLocaleString()}</span>
              <span className="text-xs md:text-sm text-neutral-400 line-through">₹ {originalPrice.toLocaleString()}</span>
              <span className="text-base md:text-xl text-gold font-serif italic">35% Privilege</span>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-10 animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Select Silhouette</h3>
                  <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Standard sizing</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[50px] py-3 px-4 text-[10px] font-bold transition-all border ${selectedSize === s ? 'bg-gold border-gold text-charcoal' : 'border-neutral-200 dark:border-neutral-700 dark:text-offwhite hover:border-gold'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6 mb-16 border-t border-neutral-100 dark:border-neutral-800 pt-10">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Elite Benefits</h3>
              <div className="flex items-start gap-4 text-xs dark:text-neutral-300">
                <div className="w-5 h-5 bg-gold/10 rounded-full flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <p><span className="font-bold text-charcoal dark:text-offwhite">Bespoke Bank Offer:</span> Instant 10% refinement for AXORA Gold Members.</p>
              </div>
              <div className="flex items-start gap-4 text-xs dark:text-neutral-300">
                <div className="w-5 h-5 bg-gold/10 rounded-full flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <p><span className="font-bold text-charcoal dark:text-offwhite">Maison Assurance:</span> Lifetime guarantee of authenticity and complimentary cleaning.</p>
              </div>

              {/* Delivery Estimation Section */}
              {pincode && (
                <div className="flex items-start gap-4 text-xs dark:text-neutral-300 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="w-5 h-5 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-purple-600 dark:text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0014 7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-charcoal dark:text-offwhite">
                      Estimated Delivery by {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-[10px] text-neutral-400">Delivering to {pincode}</p>
                  </div>
                </div>
              )}

              {/* COD and Return Policy Display */}
              <div className="pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-700 mt-4 space-y-4">
                {product.codAvailable !== false ? (
                  <div className="flex items-center gap-3 text-xs dark:text-neutral-300">
                    <div className="w-5 h-5 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="font-bold text-charcoal dark:text-offwhite">Cash on Delivery Available</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-xs dark:text-neutral-300 opacity-60">
                    <div className="w-5 h-5 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-neutral-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="font-bold text-charcoal dark:text-offwhite">Online Payment Only</p>
                  </div>
                )}

                {product.returnPolicy === 'Returns Available' ? (
                  <div className="flex items-start gap-3 text-xs dark:text-neutral-300">
                    <div className="w-5 h-5 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.699-3.181a1 1 0 011.827 1.035l-1.74 3.258a1 1 0 01-1.766.451L11 6.138V12a1 1 0 01-2 0V6.138l-3.974 1.59a1 1 0 01-1.766-.451l-1.74-3.258a1 1 0 011.827-1.035l1.699 3.181L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552a1 1 0 00.95 1.305h1.666a1 1 0 00.865-.494l.873-1.223a1 1 0 00.197-.584v-.966l-3.733-1.59zM15 10.274l3.733 1.59v.966a1 1 0 01-.197.584l-.873 1.223a1 1 0 01-.865.494h-1.666a1 1 0 01-.95-1.305l.818-2.552z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-charcoal dark:text-offwhite">{product.returnPeriod} Days Return Policy</p>
                      <p className="text-[10px] text-neutral-400">Easy returns if the item is damaged or different from description.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-xs dark:text-neutral-300 opacity-60">
                    <div className="w-5 h-5 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="font-bold text-charcoal dark:text-offwhite">No Returns Available</p>
                  </div>
                )}
              </div>

            </div>

            <div className="bg-neutral-50 dark:bg-charcoal p-8">
              <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6 border-b border-gold/20 pb-2 inline-block">Maison Notes</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-loose italic font-serif">
                {product.description} A testament to the fine craftsmanship that defines Axora. Every detail is meticulously refined to ensure it becomes a legacy piece in your collection.
              </p>
            </div>
          </div>
        </div>

        {/* Similar Desires Section */}
        <section className="mt-12 md:mt-20 px-6 md:px-0">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 border-b border-gold/20 pb-4 md:pb-6 gap-4 md:gap-0">
            <h2 className="text-xl md:text-2xl font-serif dark:text-offwhite italic">Complementary Desires</h2>
            <Link to="/catalog" className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gold text-center">Explore Collection</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetails;
