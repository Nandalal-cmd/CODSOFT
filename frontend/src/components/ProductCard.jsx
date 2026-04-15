// src/components/ProductCard.jsx  (Updated)
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-2xl transition-all duration-300 group">
      <Link to={`/product/${product.id}`}>
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          {product.discount && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-4 py-1 rounded-full">
              -{product.discount}%
            </div>
          )}
        </div>
      </Link>

      <div className="p-6">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-semibold text-lg line-clamp-2 min-h-[56px] hover:text-pink-600">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-2xl font-bold text-pink-600 mt-2">₹{product.price}</p>
        
        <button 
          onClick={(e) => {
            e.preventDefault();   // Prevent navigation
            addToCart(product);
          }}
          className="mt-6 w-full bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-2xl font-medium transition active:scale-95"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;