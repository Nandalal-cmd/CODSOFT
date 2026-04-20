import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();

  if (cart.length === 0) {
    return (
      <div className="page-shell px-6 py-16">
        <div className="section-frame mx-auto max-w-2xl px-8 py-16 text-center">
          <p className="mb-6 text-8xl">🛍️</p>
          <h2 className="display-title mb-4 text-4xl font-black">Your Cart is Empty</h2>
          <p className="mx-auto max-w-lg text-slate-500">
            Start with a few standout pieces and we’ll hold them here while you build the look.
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
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="eyebrow text-xs font-bold text-[var(--accent-terracotta)]">Bag Summary</p>
          <h1 className="display-title mt-3 text-5xl font-black text-slate-900">Your Shopping Cart</h1>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {cart.map((item) => (
              <div key={item.cartKey} className="section-frame flex gap-6 p-6">
                <img src={item.image} alt={item.name} className="h-32 w-32 rounded-2xl object-cover" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="display-title mt-1 text-3xl font-black text-[var(--accent-coral)]">₹{item.price}</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Size: {item.selectedSize} • Color: {item.selectedColor}
                  </p>

                  <div className="mt-6 flex items-center gap-6">
                    <button onClick={() => updateQuantity(item.cartKey, item.qty - 1)} className="h-10 w-10 rounded-xl border border-[rgba(120,96,74,0.18)] bg-white hover:bg-gray-100">-</button>
                    <span className="w-8 text-center text-lg font-semibold">{item.qty}</span>
                    <button onClick={() => updateQuantity(item.cartKey, item.qty + 1)} className="h-10 w-10 rounded-xl border border-[rgba(120,96,74,0.18)] bg-white hover:bg-gray-100">+</button>
                    <button onClick={() => removeFromCart(item.cartKey)} className="ml-auto text-sm font-semibold text-red-500">Remove</button>
                  </div>
                </div>
                <div className="display-title text-right text-3xl font-black text-slate-900">
                  ₹{item.price * item.qty}
                </div>
              </div>
            ))}
          </div>

          <div className="section-frame h-fit p-8">
            <h2 className="display-title mb-6 text-3xl font-black">Order Summary</h2>
            <div className="text-xl">
              <div className="mb-2 flex justify-between text-slate-600">
                <span>Items</span>
                <span>{cart.length}</span>
              </div>
              <div className="mb-4 flex justify-between">
                <span>Total</span>
                <span className="display-title text-3xl font-black text-[var(--accent-coral)]">₹{getTotalPrice()}</span>
              </div>
            </div>
            {isAuthenticated ? (
              <Link
                to="/checkout"
                className="mt-10 block w-full rounded-[1.5rem] bg-[linear-gradient(135deg,var(--accent-coral),#f08d6b)] py-5 text-center text-xl font-bold text-white"
              >
                Proceed to Checkout
              </Link>
            ) : (
              <Link
                className="mt-10 block w-full rounded-[1.5rem] bg-slate-900 py-5 text-center text-xl font-bold text-white transition hover:bg-slate-800"
                to="/login"
              >
                Sign In to Checkout
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
