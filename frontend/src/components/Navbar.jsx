// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="text-4xl font-extrabold text-pink-600">StyleCart</Link>

        <div className="flex gap-8 text-lg font-medium">
          <Link to="/" className="hover:text-pink-600 transition-colors">Home</Link>
          <Link to="/shop" className="hover:text-pink-600 transition-colors">Shop</Link>
          <Link to="/offers" className="hover:text-pink-600 transition-colors">Offers</Link>
        </div>

        <Link to="/cart" className="relative text-3xl hover:text-pink-600 transition-colors">
          🛒
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;