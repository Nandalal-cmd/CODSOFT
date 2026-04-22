import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi } from '../lib/api';
import { products as demoProducts } from '../data/products';

function normalizeDemoProduct(product) {
  return {
    ...product,
    id: String(product.id),
    description: product.description || `Premium quality ${product.name.toLowerCase()} for daily wear.`,
    stock: product.stock || 12,
    sizes: product.sizes || ['S', 'M', 'L', 'XL'],
    colors: product.colors || ['Black', 'White', 'Blue'],
    images: product.images || (product.image ? [product.image] : []),
  };
}

function buildProductDescription(product) {
  return {
    title: `${product.name} - Product Description`,
    overview: product.description || `${product.name} is designed for all-day comfort with a polished look that fits easily into your weekly wardrobe.`,
    details: [
      `Category: ${product.category || 'Fashion'}`,
      `Available in sizes: ${product.sizes?.join(', ') || 'S, M, L, XL'}`,
      `Color options: ${product.colors?.join(', ') || 'Black, White, Blue'}`,
      `${product.stock || 12} units currently in stock`,
    ],
    features: [
      'Premium quality materials for lasting comfort',
      'Versatile design suitable for various occasions',
      'Carefully crafted with attention to detail',
      'Sustainable and ethical manufacturing practices',
    ],
    care: [
      'Machine wash cold with similar colors',
      'Dry in shade to preserve color and fabric',
      'Store folded or hung in a cool, dry place',
      'Iron on low heat if needed',
    ],
    shipping: [
      'Free shipping on orders above ₹999',
      '30-day easy returns and exchanges',
      'Fast and secure delivery within 3-5 business days',
      'Customer support available for any queries',
    ],
  };
}

const ProductDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        setLoading(true);
        const data = await productApi.getById(id);

        if (isMounted) {
          setProduct(data.product);
          setError('');
        }
      } catch (loadError) {
        if (isMounted) {
          const fallbackProduct = demoProducts.find((item) => String(item.id) === String(id));

          if (fallbackProduct) {
            const normalizedProduct = normalizeDemoProduct(fallbackProduct);
            setProduct(normalizedProduct);
          } else {
            setError(loadError.message);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-coral)] mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading product description...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Product Not Found</h1>
          <p className="text-slate-600 mb-6">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-[var(--accent-coral)] text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const description = buildProductDescription(product);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-[var(--accent-coral)] hover:opacity-75 transition mb-6"
          >
            ← Back
          </button>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-4">{description.title}</h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-[var(--accent-coral)]">₹{product.price}</span>
                {product.discount && (
                  <span className="text-lg text-gray-400 line-through">₹{Math.round(product.price * 1.3)}</span>
                )}
                <span className="bg-[rgba(216,155,60,0.14)] px-3 py-1 text-sm font-bold uppercase tracking-wide text-[var(--accent-terracotta)] rounded-full">
                  {product.discount ? `${product.discount}% Off` : 'Best Seller'}
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square max-w-md mx-auto overflow-hidden rounded-3xl shadow-xl bg-white">
                <img
                  src={product.images?.[selectedImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {product.discount ? (
                  <div className="absolute top-4 left-4 rounded-full bg-[linear-gradient(135deg,var(--accent-coral),#f08d6b)] px-4 py-2 text-sm font-bold text-white shadow-lg">
                    Save {product.discount}%
                  </div>
                ) : null}
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="mt-4 flex gap-3 justify-center overflow-x-auto pb-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                        selectedImage === index
                          ? 'border-[var(--accent-coral)]'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`View ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Overview */}
        <section className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Product Overview</h2>
          <p className="text-lg leading-relaxed text-slate-600">{description.overview}</p>
        </section>

        {/* Product Details */}
        <section className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Product Details</h2>
          <div className="grid gap-4">
            {description.details.map((detail, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[var(--accent-coral)] rounded-full"></div>
                <span className="text-slate-700">{detail}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Key Features */}
        <section className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Features</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {description.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[var(--accent-coral)] rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-slate-700 leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Care Instructions & Shipping */}
        <div className="grid gap-8 md:grid-cols-2">
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Care Instructions</h2>
            <ul className="space-y-3">
              {description.care.map((instruction, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-[var(--accent-coral)] mt-1">•</span>
                  <span className="text-slate-600 leading-relaxed">{instruction}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Shipping & Returns</h2>
            <ul className="space-y-3">
              {description.shipping.map((info, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-[var(--accent-coral)] mt-1">•</span>
                  <span className="text-slate-600 leading-relaxed">{info}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate(`/product/${id}`)}
            className="bg-[linear-gradient(135deg,var(--accent-coral),#f08d6b)] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:opacity-95 transition shadow-lg"
          >
            View Full Product Details & Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;