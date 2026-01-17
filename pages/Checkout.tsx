
import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { Address, PaymentMethod } from '../types';

const Checkout: React.FC = () => {
  const { cart, cartTotal, user, saveAddress, placeOrder } = useShop();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Address State
  const [address, setAddress] = useState<Address>({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [saveInfo, setSaveInfo] = useState(true);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Credit/Debit Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  // Auto-fill address if saved
  useEffect(() => {
    if (user?.savedAddress) {
      setAddress(user.savedAddress);
    } else if (user?.name) {
      const names = user.name.split(' ');
      setAddress(prev => ({ ...prev, firstName: names[0], lastName: names.slice(1).join(' ') }));
    }
  }, [user]);

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="p-20 text-center bg-offwhite dark:bg-charcoal min-h-[60vh]">
        <h1 className="text-2xl font-serif mb-6 dark:text-offwhite">Your bag is empty.</h1>
        <button onClick={() => navigate('/catalog')} className="text-xs uppercase tracking-widest border-b border-charcoal dark:border-gold pb-1 dark:text-offwhite">Return to Collection</button>
      </div>
    );
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = () => {
    if (!address.street || !address.city || !address.zipCode || !address.phone) {
      alert("Please fill in all required shipping details.");
      return;
    }
    if (saveInfo) {
      saveAddress(address);
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment processing for non-COD
      if (paymentMethod !== 'Cash on Delivery') {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const newOrderId = await placeOrder(address, paymentMethod);
      if (!newOrderId) throw new Error("Order creation failed");

      setOrderId(newOrderId);
      setStep(3);
    } catch (error) {
      console.error("Order processing error:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-offwhite dark:bg-charcoal min-h-screen py-20 px-6 transition-colors">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-center mb-16">
          <div className="flex items-center space-x-12">
            {['Shipping', 'Payment', 'Complete'].map((label, idx) => {
              const s = idx + 1;
              return (
                <div key={s} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold mb-2 transition-all ${step >= s ? 'bg-charcoal dark:bg-gold text-offwhite dark:text-charcoal' : 'border border-neutral-300 dark:border-neutral-700 text-neutral-400'}`}>
                    {s}
                  </div>
                  <span className={`text-[8px] uppercase tracking-[0.2em] ${step >= s ? 'text-charcoal dark:text-offwhite font-bold' : 'text-neutral-400'}`}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-7">
            {step === 1 && (
              <div className="bg-white dark:bg-clay p-6 md:p-12 shadow-sm animate-fadeIn">
                <h2 className="text-xl font-serif uppercase tracking-widest mb-10 dark:text-offwhite">Shipping Details</h2>
                <div className="grid grid-cols-2 gap-8">
                  <div className="col-span-1 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">First Name</label>
                    <input name="firstName" value={address.firstName} onChange={handleAddressChange} type="text" className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite" />
                  </div>
                  <div className="col-span-1 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Last Name</label>
                    <input name="lastName" value={address.lastName} onChange={handleAddressChange} type="text" className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite" />
                  </div>
                  <div className="col-span-2 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Street Address</label>
                    <input name="street" value={address.street} onChange={handleAddressChange} type="text" className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite" />
                  </div>
                  <div className="col-span-1 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">City</label>
                    <input name="city" value={address.city} onChange={handleAddressChange} type="text" className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite" />
                  </div>
                  <div className="col-span-1 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">State</label>
                    <input name="state" value={address.state} onChange={handleAddressChange} type="text" className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite" />
                  </div>
                  <div className="col-span-1 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">ZIP Code</label>
                    <input name="zipCode" value={address.zipCode} onChange={handleAddressChange} type="text" className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite" />
                  </div>
                  <div className="col-span-1 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Phone</label>
                    <input name="phone" value={address.phone} onChange={handleAddressChange} type="text" className="w-full bg-transparent focus:outline-none text-xs uppercase tracking-widest dark:text-offwhite" />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="saveAddress"
                    checked={saveInfo}
                    onChange={(e) => setSaveInfo(e.target.checked)}
                    className="accent-gold h-4 w-4"
                  />
                  <label htmlFor="saveAddress" className="text-xs text-neutral-500 uppercase tracking-widest cursor-pointer select-none">Save this address for future orders</label>
                </div>

                <button
                  onClick={handleAddressSubmit}
                  className="w-full bg-charcoal dark:bg-gold text-offwhite dark:text-charcoal py-4 mt-12 text-xs font-bold uppercase tracking-[0.2em] hover:bg-clay transition-all shadow-lg"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white dark:bg-clay p-6 md:p-12 shadow-sm animate-fadeIn">
                <h2 className="text-xl font-serif uppercase tracking-widest mb-10 dark:text-offwhite">Payment Method</h2>
                <div className="space-y-6">
                  {['Credit/Debit Card', 'Net Banking', 'UPI', 'Cash on Delivery'].map((method) => {
                    // Check if COD is disabled for this order
                    const isCodDisabled = method === 'Cash on Delivery' && cart.some(item => item.codAvailable === false);

                    return (
                      <div
                        key={method}
                        onClick={() => !isCodDisabled && setPaymentMethod(method as PaymentMethod)}
                        className={`border p-6 flex items-center transition-all ${isCodDisabled ? 'opacity-50 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800' : 'cursor-pointer'} ${paymentMethod === method ? 'border-gold bg-gold/5' : 'border-neutral-200 dark:border-neutral-700'}`}
                      >
                        <div className={`w-4 h-4 rounded-full border mr-4 flex items-center justify-center ${paymentMethod === method ? 'border-gold' : 'border-neutral-400'}`}>
                          {paymentMethod === method && <div className="w-2 h-2 rounded-full bg-gold"></div>}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold uppercase tracking-widest dark:text-offwhite">{method}</span>
                          {isCodDisabled && (
                            <div className="mt-1">
                              <span className="text-[8px] text-red-500 uppercase tracking-widest block font-bold mb-1">Unavailable due to:</span>
                              {cart.filter(item => item.codAvailable === false).map(item => (
                                <span key={item.id} className="text-[8px] text-neutral-400 block">• {item.name}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-8 p-6 bg-neutral-50 dark:bg-charcoal/50 border border-neutral-100 dark:border-none rounded-sm">
                  {paymentMethod === 'Cash on Delivery' && (
                    <div className="text-center py-4">
                      <p className="text-xs text-neutral-500 italic mb-2">Pay securely with Cash or UPI upon delivery.</p>
                      <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Additional ₹50 handling fee waived.</p>
                    </div>
                  )}

                  {paymentMethod === 'Credit/Debit Card' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div>
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Card Number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" maxLength={19} className="w-full bg-white dark:bg-charcoal border border-neutral-200 dark:border-neutral-700 p-3 text-xs uppercase tracking-widest focus:outline-none focus:border-gold dark:text-offwhite" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Valid Thru</label>
                          <input type="text" placeholder="MM / YY" maxLength={5} className="w-full bg-white dark:bg-charcoal border border-neutral-200 dark:border-neutral-700 p-3 text-xs uppercase tracking-widest focus:outline-none focus:border-gold dark:text-offwhite" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">CVV</label>
                          <input type="password" placeholder="123" maxLength={4} className="w-full bg-white dark:bg-charcoal border border-neutral-200 dark:border-neutral-700 p-3 text-xs uppercase tracking-widest focus:outline-none focus:border-gold dark:text-offwhite" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Name on Card</label>
                        <input type="text" placeholder="John Doe" className="w-full bg-white dark:bg-charcoal border border-neutral-200 dark:border-neutral-700 p-3 text-xs uppercase tracking-widest focus:outline-none focus:border-gold dark:text-offwhite" />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'UPI' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div>
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">UPI ID</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input type="text" placeholder="username@upi" className="flex-grow bg-white dark:bg-charcoal border border-neutral-200 dark:border-neutral-700 p-3 text-xs focus:outline-none focus:border-gold dark:text-offwhite w-full sm:w-auto" />
                          <button className="bg-neutral-200 dark:bg-neutral-700 text-charcoal dark:text-offwhite px-4 py-3 sm:py-0 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors whitespace-nowrap">Verify</button>
                        </div>
                        <p className="text-[9px] text-neutral-400 mt-2">Google Pay, PhonePe, Paytm, BHIM</p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Net Banking' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div>
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Select Bank</label>
                        <select className="w-full bg-white dark:bg-charcoal border border-neutral-200 dark:border-neutral-700 p-3 text-xs focus:outline-none focus:border-gold dark:text-offwhite uppercase tracking-widest">
                          <option value="" disabled selected>Select your bank</option>
                          <option value="HDFC">HDFC Bank</option>
                          <option value="SBI">State Bank of India</option>
                          <option value="ICICI">ICICI Bank</option>
                          <option value="AXIS">Axis Bank</option>
                          <option value="KOTAK">Kotak Mahindra Bank</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-charcoal dark:bg-gold text-offwhite dark:text-charcoal py-4 mt-12 text-xs font-bold uppercase tracking-[0.2em] hover:bg-clay transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                >
                  {isProcessing && <div className="w-4 h-4 border-2 border-t-transparent border-white dark:border-charcoal rounded-full animate-spin"></div>}
                  {paymentMethod === 'Cash on Delivery' ? 'Place Order' : 'Pay & Order'}
                </button>
                <button onClick={() => setStep(1)} className="w-full mt-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-gold">Back to Shipping</button>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white dark:bg-clay p-6 md:p-16 shadow-sm text-center animate-fadeIn">
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-serif uppercase tracking-widest mb-4 dark:text-offwhite">Order Confirmed</h2>
                <div className="bg-neutral-50 dark:bg-charcoal/30 p-4 mb-8 inline-block">
                  <p className="text-xs uppercase tracking-widest text-neutral-500">Order ID</p>
                  <p className="text-xl font-bold text-gold">{orderId}</p>
                </div>
                <p className="text-sm text-neutral-500 font-light max-w-md mx-auto leading-relaxed mb-10">
                  Thank you for shopping with AXORA. Your order has been received and is being prepared. You can track its status in your profile.
                </p>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => navigate('/profile')}
                    className="bg-charcoal dark:bg-gold text-offwhite dark:text-charcoal px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-clay transition-all"
                  >
                    Track Order
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-gold"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {step !== 3 && (
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-clay p-10 shadow-sm sticky top-24">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 border-b border-neutral-100 dark:border-neutral-700 pb-4 dark:text-offwhite">Order Summary</h3>
                <div className="space-y-6 max-h-[400px] overflow-y-auto mb-8 pr-4 no-scrollbar">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <img src={item.images[0]} alt={item.name} className="w-12 h-16 object-cover" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest dark:text-offwhite">{item.name}</p>
                          <p className="text-[8px] text-neutral-400 uppercase tracking-widest">
                            Qty: {item.quantity} {item.selectedSize && `| Size: ${item.selectedSize}`}
                          </p>
                        </div>
                      </div>
                      <p className="text-[10px] font-bold dark:text-offwhite">₹ {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-neutral-100 dark:border-neutral-700">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-neutral-500">
                    <span>Subtotal</span>
                    <span>₹ {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-neutral-500">
                    <span>Shipping</span>
                    <span className="text-gold font-bold">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold uppercase tracking-widest pt-4 border-t border-neutral-100 dark:border-neutral-700 dark:text-offwhite">
                    <span>Total</span>
                    <span>₹ {cartTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
