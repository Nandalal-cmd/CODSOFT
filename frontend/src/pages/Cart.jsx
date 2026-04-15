// src/pages/Cart.jsx
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <p className="text-8xl mb-6">🛍️</p>
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <Link 
          to="/shop"
          className="mt-8 inline-block bg-pink-600 text-white px-10 py-4 rounded-full text-lg font-medium"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-10">Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {cart.map(item => (
            <div key={item.id} className="flex gap-6 bg-white p-6 rounded-3xl">
              <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-2xl" />
              <div className="flex-1">
                <h3 className="font-semibold text-xl">{item.name}</h3>
                <p className="text-pink-600 font-bold text-2xl mt-1">₹{item.price}</p>
                
                <div className="flex items-center gap-6 mt-6">
                  <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="w-10 h-10 border rounded-xl hover:bg-gray-100">-</button>
                  <span className="font-semibold text-lg w-8 text-center">{item.qty}</span>
                  <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="w-10 h-10 border rounded-xl hover:bg-gray-100">+</button>
                  <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-500">Remove</button>
                </div>
              </div>
              <div className="text-right font-bold text-xl">
                ₹{item.price * item.qty}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-3xl h-fit">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          <div className="text-xl">
            <div className="flex justify-between mb-2">
              <span>Total</span>
              <span className="font-bold">₹{getTotalPrice()}</span>
            </div>
          </div>
          <button 
            onClick={() => alert("Checkout feature coming soon!")}
            className="w-full mt-10 bg-pink-600 text-white py-5 rounded-2xl text-xl font-bold hover:bg-pink-700"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;