import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { orderApi } from '../lib/api';

const statusColors = {
  placed: 'bg-blue-100 text-blue-700',
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const paymentStatusColors = {
  pending: 'bg-orange-100 text-orange-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

const paymentMethodLabels = {
  cod: 'Cash on Delivery',
  upi: 'UPI',
  paytm: 'Paytm',
};

const OrderHistory = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderApi.getAll(token);
        setOrders(data);
      } catch (err) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="page-shell px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[var(--accent-coral)] border-t-transparent"></div>
          <p className="mt-4 text-slate-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell px-6 py-16">
        <div className="section-frame mx-auto max-w-2xl px-8 py-16 text-center">
          <p className="mb-4 text-6xl">⚠️</p>
          <h2 className="display-title mb-4 text-3xl font-black text-slate-900">Something went wrong</h2>
          <p className="text-slate-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-[var(--accent-coral)] px-8 py-3 font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="page-shell px-6 py-16">
        <div className="section-frame mx-auto max-w-2xl px-8 py-16 text-center">
          <p className="mb-6 text-8xl">📦</p>
          <h2 className="display-title mb-4 text-4xl font-black">No Orders Yet</h2>
          <p className="mx-auto max-w-lg text-slate-500">
            You haven't placed any orders yet. Start shopping and your order history will appear here.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-block rounded-full bg-[linear-gradient(135deg,var(--accent-coral),#f08d6b)] px-10 py-4 text-lg font-medium text-white"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <p className="eyebrow text-xs font-bold text-[var(--accent-terracotta)]">Purchase History</p>
          <h1 className="display-title mt-3 text-5xl font-black text-slate-900">My Orders</h1>
          <p className="mt-2 text-slate-500">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>

        {/* Orders List */}
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="section-frame overflow-hidden p-0">
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line-soft)] bg-white/50 px-6 py-4">
                <div className="flex flex-wrap gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Order ID</p>
                    <p className="mt-1 font-mono text-sm font-semibold text-slate-700">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Date</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Payment</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Total</p>
                    <p className="display-title mt-1 text-xl font-black text-[var(--accent-coral)]">₹{order.totalAmount}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-700'}`}>
                    {order.orderStatus}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${paymentStatusColors[order.paymentStatus] || 'bg-gray-100 text-gray-700'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="divide-y divide-[var(--line-soft)] px-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 py-4">
                    {/* Product image if available */}
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                        👕
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{item.name}</h3>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {item.selectedSize && `Size: ${item.selectedSize}`}
                        {item.selectedSize && item.selectedColor && ' • '}
                        {item.selectedColor && `Color: ${item.selectedColor}`}
                        {' • '}Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">₹{item.price * item.quantity}</p>
                      <p className="text-sm text-slate-400">₹{item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="border-t border-[var(--line-soft)] bg-white/30 px-6 py-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Shipping To</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {order.shippingAddress.name} • {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    {order.shippingAddress.phone && ` • 📞 ${order.shippingAddress.phone}`}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Back to Shop */}
        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-block rounded-full border border-[var(--line-soft)] bg-white px-8 py-3 font-semibold text-slate-700 transition hover:border-[var(--accent-coral)] hover:text-[var(--accent-coral)]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
