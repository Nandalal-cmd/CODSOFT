import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { orderApi } from '../lib/api';

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    if (!shippingAddress.name || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode || !shippingAddress.phone) {
      alert('Please fill in all shipping address fields');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          product: item.id,
          name: item.name,
          price: item.price,
          quantity: item.qty,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        })),
        totalAmount: getTotalPrice(),
        paymentMethod,
        shippingAddress,
      };

      if (paymentMethod === 'upi' || paymentMethod === 'paytm') {
        // Simulate online payment
        alert(`Redirecting to ${paymentMethod.toUpperCase()} payment gateway...`);
        
        // Wait for simulation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        await orderApi.create(token, orderData);
        alert('Payment successful! Order placed.');
        clearCart();
        navigate('/orders');
      } else {
        // COD
        await orderApi.create(token, orderData);
        alert('Order placed successfully with Cash on Delivery!');
        clearCart();
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="page-shell px-6 py-16">
        <div className="section-frame mx-auto max-w-2xl px-8 py-16 text-center">
          <p className="mb-6 text-8xl">🛒</p>
          <h2 className="display-title mb-4 text-4xl font-black">Your Cart is Empty</h2>
          <p className="mx-auto max-w-lg text-slate-500">
            Add some items to your cart before checking out.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <h1 className="display-title text-5xl font-black text-slate-900">Checkout</h1>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Order Summary */}
          <div className="space-y-8">
            <div className="section-frame p-6">
              <h2 className="display-title mb-6 text-2xl font-black">Order Summary</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.cartKey} className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-slate-500">
                        Size: {item.selectedSize} • Color: {item.selectedColor} • Qty: {item.qty}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{item.price * item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-[var(--accent-coral)]">₹{getTotalPrice()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="space-y-8">
            {/* Shipping Address */}
            <div className="section-frame p-6">
              <h2 className="display-title mb-6 text-2xl font-black">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={shippingAddress.name}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--accent-coral)] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Address</label>
                  <textarea
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleAddressChange}
                    rows={3}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--accent-coral)] focus:outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--accent-coral)] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">State</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--accent-coral)] focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={shippingAddress.pincode}
                      onChange={handleAddressChange}
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--accent-coral)] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleAddressChange}
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--accent-coral)] focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="section-frame p-6">
              <h2 className="display-title mb-6 text-2xl font-black">Payment Method</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-[var(--accent-coral)] focus:ring-[var(--accent-coral)]"
                  />
                  <label htmlFor="cod" className="ml-3 text-lg font-medium">
                    Cash on Delivery
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="upi"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-[var(--accent-coral)] focus:ring-[var(--accent-coral)]"
                  />
                  <label htmlFor="upi" className="ml-3 text-lg font-medium">
                    UPI Payment
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="paytm"
                    name="paymentMethod"
                    value="paytm"
                    checked={paymentMethod === 'paytm'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-[var(--accent-coral)] focus:ring-[var(--accent-coral)]"
                  />
                  <label htmlFor="paytm" className="ml-3 text-lg font-medium">
                    Paytm Payment
                  </label>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full rounded-[1.5rem] bg-[linear-gradient(135deg,var(--accent-coral),#f08d6b)] py-5 text-xl font-bold text-white disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : `Place Order - ₹${getTotalPrice()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;