// src/pages/ProductDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = products.find(p => p.id === parseInt(id));

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div className="text-center py-20 text-2xl">Product not found 😔</div>;
  }

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      qty: quantity
    });
    alert(`✅ ${product.name} (${selectedSize}, ${selectedColor}) added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 text-pink-600 hover:underline flex items-center gap-2"
      >
        ← Back to Shop
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left - Image */}
        <div>
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full rounded-3xl shadow-xl"
          />
        </div>

        {/* Right - Details */}
        <div>
          <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold text-pink-600">₹{product.price}</span>
            {product.discount && (
              <span className="text-xl text-gray-400 line-through">₹{Math.round(product.price * 1.3)}</span>
            )}
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Premium quality {product.name.toLowerCase()}. Made with soft, breathable fabric. 
            Perfect for casual wear and daily use. High durability and stylish look.
          </p>

          {/* Size Selector */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3">Size</h3>
            <div className="flex gap-3">
              {['S', 'M', 'L', 'XL'].map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 border-2 rounded-2xl font-medium transition
                    ${selectedSize === size 
                      ? 'border-pink-600 bg-pink-50 text-pink-600' 
                      : 'border-gray-300 hover:border-gray-400'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3">Color</h3>
            <div className="flex gap-4">
              {['Black', 'White', 'Blue', 'Red', 'Pink'].map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-4 transition
                    ${selectedColor === color ? 'border-pink-600 scale-110' : 'border-gray-200'}`}
                  style={{ backgroundColor: color.toLowerCase() }}
                />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-12 h-12 border rounded-2xl text-2xl hover:bg-gray-100"
              >
                −
              </button>
              <span className="text-3xl font-semibold w-12 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="w-12 h-12 border rounded-2xl text-2xl hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-5 rounded-2xl text-xl font-bold transition"
            >
              Add to Cart
            </button>
            <button 
              onClick={() => alert("Added to Wishlist ❤️")}
              className="px-8 border-2 border-gray-300 hover:border-pink-600 rounded-2xl text-2xl"
            >
              ❤️
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            Free shipping on orders above ₹999 • 30 days easy return
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;