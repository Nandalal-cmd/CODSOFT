import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import heroImage from '../assets/hero.png';

const Home = () => {
  const { products, loading, error } = useProducts();

  const highlights = [
    { label: 'Curated edits', value: '120+' },
    { label: 'Fast dispatch', value: '24h' },
    { label: 'Easy returns', value: '30d' },
  ];

  return (
    <div className="page-shell relative overflow-hidden px-6 pb-20 pt-8">
      <div className="mx-auto max-w-7xl">
        <section className="section-frame relative overflow-hidden px-8 py-10 md:px-12 md:py-14">
          <div className="absolute -right-16 top-10 h-40 w-40 rounded-full bg-[rgba(232,93,117,0.18)] blur-3xl" />
          <div className="absolute bottom-8 left-10 h-32 w-32 rounded-full bg-[rgba(216,155,60,0.18)] blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="eyebrow text-xs font-bold text-[var(--accent-terracotta)]">Season Edit 2026</p>
              <h1 className="display-title mt-5 max-w-3xl text-5xl font-black leading-[0.95] text-slate-900 md:text-7xl">
                Dress your everyday life like it belongs in a magazine spread.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--ink-soft)] md:text-xl">
                StyleCart blends sharp tailoring, soft essentials, and standout offers into one warm, modern storefront.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/shop"
                  className="rounded-full bg-[linear-gradient(135deg,var(--accent-coral),#f08d6b)] px-8 py-4 text-lg font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  Shop The Edit
                </Link>
                <Link
                  to="/offers"
                  className="rounded-full border border-[rgba(120,96,74,0.18)] bg-white px-8 py-4 text-lg font-semibold text-slate-700 transition hover:border-[var(--accent-coral)] hover:text-[var(--accent-coral)]"
                >
                  View Offers
                </Link>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div key={item.label} className="rounded-[1.75rem] border border-[rgba(120,96,74,0.14)] bg-white/70 px-5 py-5">
                    <div className="display-title text-3xl font-black text-slate-900">{item.value}</div>
                    <div className="mt-1 text-sm font-semibold text-slate-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-12 h-28 w-28 rounded-[2rem] bg-[linear-gradient(135deg,#f6bd60,#f28482)] opacity-80 blur-sm" />
              <div className="absolute -right-2 bottom-10 h-20 w-20 rounded-full border border-white/60 bg-white/30 backdrop-blur-xl" />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 shadow-[0_30px_80px_rgba(74,39,20,0.22)]">
                <img
                  alt="StyleCart hero"
                  className="h-[560px] w-full object-cover"
                  src={heroImage}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,24,27,0.04),rgba(24,24,27,0.38))]" />
                <div className="absolute inset-x-6 bottom-6 rounded-[2rem] border border-white/20 bg-[rgba(20,16,16,0.48)] px-6 py-5 text-black backdrop-blur-md">
                  <p className="eyebrow text-[11px] font-semibold text-black">Featured Mood</p>
                  <p className="display-title mt-3 text-3xl font-black">Soft tailoring. Warm tones. Strong silhouettes.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="section-frame bg-[linear-gradient(135deg,#2b211d,#61453a)] p-8 text-black">
              <p className="eyebrow text-xs font-bold text-black">Editor's Pick</p>
              <h2 className="display-title mt-4 text-4xl font-black">Build a wardrobe around fewer, better pieces.</h2>
              <p className="mt-4 max-w-lg text-base leading-7 text-black">
                From relaxed denim to clean dresses, each category is styled to feel cohesive and easy to wear.
              </p>
            </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="section-frame bg-[linear-gradient(145deg,#e85d75,#f08d6b)] p-8 text-black">
              <p className="eyebrow text-xs font-bold text-black">Special Drop</p>
              <h3 className="display-title mt-4 text-4xl font-black">Buy 2 Get 1 Free</h3>
              <p className="mt-4 text-lg text-black">On tees, hoodies, and easy layering pieces.</p>
            </div>
            <div className="section-frame bg-[linear-gradient(145deg,#f8f4ec,#fffefd)] p-8">
              <p className="eyebrow text-xs font-bold text-black">Limited Offer</p>
              <h3 className="display-title mt-4 text-4xl font-black text-black">20% Off Dresses</h3>
              <p className="mt-4 text-lg text-black">A softer, brighter edit built for weekends and events.</p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow text-xs font-bold text-black">Home Catalog</p>
              <h2 className="display-title mt-3 text-4xl font-black text-black md:text-5xl">
                Browse every product right from the home page.
              </h2>
              <p className="mt-3 max-w-2xl text-lg text-black">
                Explore the full StyleCart lineup below without leaving the landing page.
              </p>
            </div>
            <Link
              to="/shop"
              className="rounded-full border border-[rgba(120,96,74,0.18)] bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-[var(--accent-coral)] hover:text-[var(--accent-coral)]"
            >
              Open Full Shop
            </Link>
          </div>

          {loading ? <p className="py-10 text-center text-xl text-slate-500">Loading products...</p> : null}
          {error ? (
            <div className="mb-8 rounded-[1.75rem] border border-amber-200 bg-amber-50 px-5 py-4 text-center text-sm font-semibold text-amber-700">
              {error}
            </div>
          ) : null}

          {!loading && products.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default Home;
