import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi } from '../lib/api';
import { useCart } from '../hooks/useCart';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { products as demoProducts } from '../data/products';

function normalizeDemoProduct(product) {
  return {
    ...product,
    id: String(product.id),
    description: product.description || `Premium quality ${product.name.toLowerCase()} for daily wear.`,
    stock: product.stock || 12,
    sizes: product.sizes || ['S', 'M', 'L', 'XL'],
    colors: product.colors || ['Black', 'White', 'Blue'],
  };
}

function buildProductStory(product) {
  const categoryLabel = product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'Style';

  return {
    intro:
      product.description ||
      `${product.name} is designed for all-day comfort with a polished look that fits easily into your weekly wardrobe.`,
    highlights: [
      `${categoryLabel} category piece built for everyday styling`,
      `${product.discount ? `${product.discount}% savings available right now` : 'Full-price staple with long-wear value'}`,
      `${product.stock} unit${product.stock === 1 ? '' : 's'} currently available`,
    ],
    fitNotes: [
      `Available in ${product.sizes.join(', ')} so you can choose the fit that feels best.`,
      `Color options include ${product.colors.join(', ')} for easy outfit pairing.`,
      'A versatile silhouette that works for casual wear, daily errands, and weekend plans.',
    ],
    care: [
      'Machine wash cold with similar colors.',
      'Dry in shade to help preserve color and fabric finish.',
      'Store folded or hung in a cool, dry place.',
    ],
    shipping: [
      'Free shipping on eligible orders above ₹999.',
      '30-day easy return window from delivery date.',
      'Support team available for sizing and order help.',
    ],
  };
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        setLoading(true);
        const data = await productApi.getById(id);

        if (isMounted) {
          setProduct(data.product);
          setSelectedSize(data.product.sizes?.[0] || 'M');
          setSelectedColor(data.product.colors?.[0] || 'Black');
          setError('');
          setNotice('');
        }
      } catch (loadError) {
        if (isMounted) {
          const fallbackProduct = demoProducts.find((item) => String(item.id) === String(id));

          if (fallbackProduct) {
            const normalizedProduct = normalizeDemoProduct(fallbackProduct);
            setProduct(normalizedProduct);
            setSelectedSize(normalizedProduct.sizes[0] || 'M');
            setSelectedColor(normalizedProduct.colors[0] || 'Black');
            setError('');
            setNotice('Backend product details are unavailable right now, so demo product data is being shown.');
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

    // Load reviews from localStorage
    const storedReviews = JSON.parse(localStorage.getItem(`reviews_${id}`)) || [];
    setReviews(storedReviews);

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-2xl text-slate-500">Loading product...</div>;
  }

  if (error || !product) {
    return <div className="text-center py-20 text-2xl">{error || 'Product not found.'}</div>;
  }

  const story = buildProductStory(product);
  const recommendedProducts = products
    .filter((item) => item.id !== product.id)
    .filter((item) => item.category === product.category || item.featured)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, {
      selectedSize,
      selectedColor,
      quantity,
    });
    alert(`✅ ${product.name} (${selectedSize}, ${selectedColor}) added to cart!`);
  };

  const handleAddReview = () => {
    const name = reviewerName.trim();
    const text = reviewText.trim();
    if (name && text) {
      const newReviews = [...reviews, { name, text, date: new Date().toLocaleDateString() }];
      setReviews(newReviews);
      localStorage.setItem(`reviews_${id}`, JSON.stringify(newReviews));
      setReviewerName('');
      setReviewText('');
    } else {
      alert('Please fill in both name and review.');
    }
  };

  return (
    <div className="page-shell px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-[var(--accent-coral)] transition hover:opacity-75"
        >
          ← Back to Shop
        </button>

        <div className="grid items-start gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="mx-auto w-full max-w-[560px] space-y-6">
            <div className="section-frame overflow-hidden p-4 md:p-5">
              <div className="relative mx-auto h-[400px] w-full max-w-[500px] overflow-hidden rounded-[2rem] md:h-[480px]">
                <img
                  src={product.images?.[selectedImage] || product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,24,27,0.02),rgba(24,24,27,0.22))]" />
                {product.discount ? (
                  <div className="absolute left-5 top-5 rounded-full bg-[linear-gradient(135deg,var(--accent-coral),#f08d6b)] px-4 py-2 text-sm font-bold text-white shadow-lg">
                    Save {product.discount}%
                  </div>
                ) : null}
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
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

            <section className="section-frame p-7">
              <h2 className="text-xl font-semibold text-slate-500">Choose Your Options</h2>

              <div className="mt-6">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 min-w-[52px] rounded-2xl border-2 px-4 font-medium transition ${
                        selectedSize === size
                          ? 'border-[var(--accent-coral)] bg-rose-50 text-[var(--accent-coral)]'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`min-w-[78px] rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        selectedColor === color
                          ? 'border-[var(--accent-coral)] bg-rose-50 text-[var(--accent-coral)]'
                          : 'border-gray-200 bg-white text-slate-600'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Quantity</h3>
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-12 w-12 rounded-2xl border border-[rgba(120,96,74,0.16)] bg-white text-2xl hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-2xl font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="h-12 w-12 rounded-2xl border border-[rgba(120,96,74,0.16)] bg-white text-2xl hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <p className="mt-3 text-sm text-slate-500">
                  Selected: {selectedSize} • {selectedColor}
                </p>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 rounded-[1.5rem] bg-[linear-gradient(135deg,var(--accent-coral),#f08d6b)] py-4 text-lg font-bold text-white transition hover:opacity-95"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => alert('Added to Wishlist ❤️')}
                  className="rounded-[1.5rem] border-2 border-gray-300 px-6 text-2xl transition hover:border-[var(--accent-coral)]"
                >
                  ❤️
                </button>
              </div>
            </section>
          </div>

          <div className="mx-auto w-full max-w-[760px] space-y-6">
            <div className="section-frame p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="eyebrow text-xs font-bold text-[var(--accent-terracotta)]">{product.category}</p>
                  <h1 className="display-title mt-3 text-5xl font-black text-slate-900">{product.name}</h1>
                </div>
                <div className="rounded-[1.5rem] border border-[rgba(120,96,74,0.14)] bg-white/80 px-4 py-3 text-right">
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Availability</div>
                  <div className="mt-1 text-sm font-semibold text-slate-700">{product.stock} in stock</div>
                </div>
              </div>

              {notice ? (
                <div className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  {notice}
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="display-title text-5xl font-black text-[var(--accent-coral)]">₹{product.price}</span>
                {product.discount ? (
                  <span className="text-xl text-gray-400 line-through">₹{Math.round(product.price * 1.3)}</span>
                ) : null}
                <span className="rounded-full bg-[rgba(216,155,60,0.14)] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)]">
                  {product.discount ? 'Offer live' : 'Best seller'}
                </span>
              </div>

              <p className="mt-6 text-lg leading-8 text-slate-600">{story.intro}</p>

              <div className="mt-4">
                <button
                  onClick={() => navigate(`/product/${id}/description`)}
                  className="text-[var(--accent-coral)] font-semibold hover:underline"
                >
                  Read full description →
                </button>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {story.highlights.map((item) => (
                  <div key={item} className="rounded-[1.5rem] border border-[rgba(120,96,74,0.12)] bg-white/75 p-4 text-sm font-semibold text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              <section className="section-frame p-7">
                <h2 className="text-xl font-semibold text-slate-900">Why This Product Works</h2>
                <div className="mt-5 space-y-4">
                  {story.fitNotes.map((item) => (
                    <div key={item} className="rounded-[1.25rem] border border-[rgba(120,96,74,0.12)] bg-white/70 px-4 py-4 text-sm leading-7 text-slate-600">
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <section className="section-frame p-7">
                <h2 className="text-xl font-semibold text-slate-900">Care Instructions</h2>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                  {story.care.map((item) => (
                    <li key={item} className="rounded-[1.25rem] border border-[rgba(120,96,74,0.12)] bg-white/70 px-4 py-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="section-frame p-7">
                <h2 className="text-xl font-semibold text-slate-900">Shipping & Support</h2>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                  {story.shipping.map((item) => (
                    <li key={item} className="rounded-[1.25rem] border border-[rgba(120,96,74,0.12)] bg-white/70 px-4 py-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Reviews Section */}
            <div className="mx-auto w-full max-w-[760px] mt-8">
              <section className="section-frame p-7">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Reviews</h2>
                
                {/* Add Review Form */}
                <div className="mb-8 p-6 bg-gray-50 rounded-2xl">
                  <h3 className="text-lg font-semibold text-slate-700 mb-4">Write a Review</h3>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[var(--accent-coral)]"
                  />
                  <textarea
                    placeholder="Write your review..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[var(--accent-coral)] resize-none"
                  />
                  <button
                    onClick={handleAddReview}
                    className="px-6 py-3 bg-[linear-gradient(135deg,var(--accent-coral),#f08d6b)] text-white font-semibold rounded-xl hover:opacity-95 transition"
                  >
                    Submit Review
                  </button>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-slate-500">No reviews yet. Be the first to review this product!</p>
                  ) : (
                    reviews.map((review, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-xl">
                        <p className="font-semibold text-slate-700">{review.name}</p>
                        <p className="text-sm text-slate-400 mb-2">{review.date}</p>
                        <p className="text-slate-600">{review.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>

        {recommendedProducts.length > 0 ? (
          <section className="mt-14">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow text-xs font-bold text-[var(--accent-terracotta)]">Recommended For You</p>
                <h2 className="display-title mt-3 text-4xl font-black text-slate-900">You might also like these 4 picks.</h2>
                <p className="mt-2 text-slate-600">Similar styles and standout pieces chosen to match this product.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
              {recommendedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default ProductDetail;
