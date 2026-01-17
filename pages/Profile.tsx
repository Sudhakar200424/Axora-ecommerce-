import React from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

import { Address } from '../types';

const Profile: React.FC = () => {
  const { user, logout, cancelOrder, favourites, addToCart, saveAddress } = useShop();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('Profile Details');

  // Address Editing State
  const [isEditingAddress, setIsEditingAddress] = React.useState(false);
  const [addressForm, setAddressForm] = React.useState<Address>({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  // Sync form with user address on load or cancel
  React.useEffect(() => {
    if (user?.savedAddress) {
      setAddressForm(user.savedAddress);
    } else if (user?.name) {
      const names = user.name.split(' ');
      setAddressForm(prev => ({ ...prev, firstName: names[0], lastName: names.slice(1).join(' ') }));
    }
  }, [user, isEditingAddress]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = async () => {
    if (!addressForm.street || !addressForm.city || !addressForm.zipCode || !addressForm.phone) {
      alert("Please fill in all required address fields.");
      return;
    }
    await saveAddress(addressForm);
    setIsEditingAddress(false);
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="bg-offwhite dark:bg-charcoal min-h-screen py-20 px-6 transition-colors">
      <div className="container mx-auto max-w-5xl">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-gold mb-2 block">My Account</span>
            <h1 className="text-4xl font-serif text-charcoal dark:text-offwhite uppercase tracking-widest">Hello, {user.name ? user.name.split(' ')[0] : 'Member'}</h1>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="text-[10px] font-bold uppercase tracking-widest border border-neutral-300 dark:border-neutral-700 px-6 py-2 hover:bg-charcoal hover:text-offwhite dark:text-offwhite dark:hover:bg-offwhite dark:hover:text-charcoal transition-all"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Menu */}
          <div className="col-span-1 space-y-4">
            {(user.role === 'seller' ? ['Profile Details'] : ['Profile Details', 'Wishlist', 'Address Book']).map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`w-full text-left py-4 px-6 text-[10px] font-bold uppercase tracking-widest border-l-2 transition-all ${activeTab === item ? 'border-gold bg-white dark:bg-clay shadow-sm text-charcoal dark:text-offwhite' : 'border-transparent text-neutral-400 hover:border-neutral-200 hover:bg-neutral-50 dark:hover:bg-clay'} `}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="col-span-1 md:col-span-2 space-y-12">
            <section className="bg-white dark:bg-clay p-10 shadow-sm min-h-[400px]">

              {activeTab === 'Profile Details' && (
                <div className="animate-fadeIn">
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-10 border-b border-neutral-100 dark:border-neutral-700 pb-4 dark:text-offwhite">Profile Details</h2>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Full Name</p>
                      <p className="text-sm dark:text-offwhite">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Email Address</p>
                      <p className="text-sm dark:text-offwhite">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Member Status</p>
                      <p className="text-sm text-gold uppercase tracking-widest font-bold">{user.role}</p>
                    </div>
                  </div>
                </div>
              )}



              {activeTab === 'Wishlist' && (
                <div className="animate-fadeIn">
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-10 border-b border-neutral-100 dark:border-neutral-700 pb-4 dark:text-offwhite">My Wishlist</h2>
                  {(!favourites || favourites.length === 0) ? (
                    <div className="text-center py-10">
                      <p className="text-sm italic font-serif text-neutral-400 mb-4">Your wishlist is empty.</p>
                      <button onClick={() => navigate('/catalog')} className="text-xs font-bold text-gold uppercase tracking-widest border-b border-gold pb-1">Browse Collection</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {favourites.map(product => (
                        <div key={product.id} className="border border-neutral-100 dark:border-neutral-700 p-4 rounded flex items-center gap-4">
                          <img src={product.images?.[0]} className="w-16 h-20 object-cover" alt={product.name} />
                          <div className="flex-grow">
                            <h3 className="text-xs font-bold uppercase tracking-widest dark:text-offwhite line-clamp-1">{product.name}</h3>
                            <p className="text-xs text-neutral-500 mb-2">₹ {product.price?.toLocaleString()}</p>
                            {(!user || user.role === 'buyer') && (
                              <button onClick={() => addToCart(product)} className="text-[8px] font-bold uppercase tracking-widest bg-charcoal text-offwhite dark:bg-gold dark:text-charcoal px-3 py-1">Add to Bag</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Address Book' && (
                <div className="animate-fadeIn">
                  <div className="flex justify-between items-center mb-10 border-b border-neutral-100 dark:border-neutral-700 pb-4">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] dark:text-offwhite">Saved Addresses</h2>
                    {!isEditingAddress && user.savedAddress && user.role !== 'seller' && (
                      <button onClick={() => setIsEditingAddress(true)} className="text-[10px] font-bold text-gold uppercase tracking-widest hover:text-orange-500 transition-all">Edit Address</button>
                    )}
                  </div>

                  {isEditingAddress || !user.savedAddress ? (
                    <div className="animate-fadeIn">
                      <div className="grid grid-cols-2 gap-8 mb-8">
                        <div className="col-span-1 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">First Name</label>
                          <input name="firstName" value={addressForm.firstName} onChange={handleAddressChange} type="text" className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite" />
                        </div>
                        <div className="col-span-1 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Last Name</label>
                          <input name="lastName" value={addressForm.lastName} onChange={handleAddressChange} type="text" className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite" />
                        </div>
                        <div className="col-span-2 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Street Address</label>
                          <input name="street" value={addressForm.street} onChange={handleAddressChange} type="text" className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite" />
                        </div>
                        <div className="col-span-1 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">City</label>
                          <input name="city" value={addressForm.city} onChange={handleAddressChange} type="text" className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite" />
                        </div>
                        <div className="col-span-1 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">State</label>
                          <input name="state" value={addressForm.state} onChange={handleAddressChange} type="text" className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite" />
                        </div>
                        <div className="col-span-1 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">ZIP Code</label>
                          <input name="zipCode" value={addressForm.zipCode} onChange={handleAddressChange} type="text" className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite" />
                        </div>
                        <div className="col-span-1 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Phone</label>
                          <input name="phone" value={addressForm.phone} onChange={handleAddressChange} type="text" className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite" />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={handleSaveAddress} className="flex-1 bg-charcoal dark:bg-gold text-offwhite dark:text-charcoal py-3 text-xs font-bold uppercase tracking-widest hover:bg-clay transition-all">Save Changes</button>
                        {user.savedAddress && (
                          <button onClick={() => setIsEditingAddress(false)} className="flex-1 border border-neutral-300 dark:border-neutral-700 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 dark:hover:bg-charcoal dark:text-offwhite transition-all">Cancel</button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="border border-gold/30 bg-gold/5 p-8 relative">
                      <span className="absolute top-0 right-0 bg-gold text-charcoal text-[9px] font-bold uppercase tracking-widest px-3 py-1">Default</span>
                      <p className="font-serif text-lg mb-4 dark:text-offwhite">{user.savedAddress.firstName} {user.savedAddress.lastName}</p>
                      <div className="space-y-1 text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                        <p>{user.savedAddress.street}</p>
                        <p>{user.savedAddress.city}, {user.savedAddress.state} - {user.savedAddress.zipCode}</p>
                        <p className="mt-4 pt-4 border-t border-gold/10">Phone: {user.savedAddress.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
