// src/components/ProductCard.jsx  (Updated)
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group overflow-hidden rounded-[2rem] border border-[rgba(120,96,74,0.12)] bg-[rgba(255,255,255,0.84)] shadow-[0_18px_50px_rgba(79,48,30,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(79,48,30,0.16)]">
      <Link to={`/product/${product.id}`}>
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,18,18,0.02),rgba(20,18,18,0.22))]" />
          {product.discount && (
            <div className="absolute left-4 top-4 rounded-full bg-[linear-gradient(135deg,var(--accent-coral),#f08d6b)] px-4 py-1 text-sm font-bold text-white shadow-lg">
              -{product.discount}%
            </div>
          )}
          {product.featured && (
            <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-[rgba(20,18,18,0.45)] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white backdrop-blur-md">
              Featured
            </div>
          )}
        </div>
      </Link>

      <div className="p-6">
        <div className="eyebrow text-[11px] font-bold text-[var(--accent-terracotta)]">{product.category}</div>
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="mt-3 min-h-[56px] text-xl font-semibold leading-7 text-slate-900 transition-colors hover:text-[var(--accent-coral)]">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-4 flex items-center justify-between">
          <p className="display-title text-3xl font-black text-[var(--accent-coral)]">₹{product.price}</p>
          <span className="rounded-full bg-[rgba(216,155,60,0.14)] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)]">
            In Stock
          </span>
        </div>
        
        <button 
          onClick={() => {
            addToCart(product, { quantity: 1 });
          }}
          className="mt-6 w-full rounded-[1.5rem] bg-[linear-gradient(135deg,#1f2937,#3f3029)] py-4 font-semibold text-white transition hover:opacity-95 active:scale-95"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
