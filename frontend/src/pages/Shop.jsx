import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

const Shop = () => {
  const { products, loading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const querySearch = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(querySearch);
  const [category, setCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState(3500);

  useEffect(() => {
    setSearchTerm(querySearch);
  }, [querySearch]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category ? product.category === category : true;
    const matchesPrice = product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="page-shell px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <section className="section-frame mb-8 overflow-hidden px-8 py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow text-xs font-bold text-[var(--accent-terracotta)]">Storefront Collection</p>
              <h1 className="display-title mt-4 text-5xl font-black text-slate-900 md:text-6xl">Find the pieces that set the tone.</h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-600">
                Search the catalog, narrow by category, and shape the collection around the budget you want.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-[rgba(120,96,74,0.14)] bg-white/70 px-5 py-4 text-sm font-semibold text-slate-600">
              {filteredProducts.length} styles available
            </div>
          </div>
        </section>

        <div className="section-frame mb-10 p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 rounded-[1.75rem] border border-[rgba(120,96,74,0.18)] bg-[rgba(255,255,255,0.8)] px-6 py-4 focus:outline-none focus:border-[var(--accent-coral)]"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-[1.75rem] border border-[rgba(120,96,74,0.18)] bg-[rgba(255,255,255,0.8)] px-6 py-4 focus:outline-none focus:border-[var(--accent-coral)]"
            >
              <option value="">All Categories</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
              <option value="unisex">Unisex</option>
            </select>

            <div className="flex items-center gap-4 rounded-[1.75rem] border border-[rgba(120,96,74,0.16)] bg-white/70 px-5 py-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Budget</div>
                <div className="mt-1 font-semibold text-slate-700">₹{maxPrice}</div>
              </div>
              <input
                type="range"
                min="300"
                max="3500"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-40 accent-[var(--accent-coral)] md:w-48"
              />
            </div>
          </div>
        </div>

        {loading ? <p className="py-10 text-center text-xl text-slate-500">Loading products...</p> : null}
        {error ? (
          <div className="mb-8 rounded-[1.75rem] border border-amber-200 bg-amber-50 px-5 py-4 text-center text-sm font-semibold text-amber-700">
            {error}
          </div>
        ) : null}

        {!loading && products.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}

        {!loading && filteredProducts.length === 0 ? (
          <div className="section-frame mt-12 px-6 py-14 text-center">
            <p className="display-title text-3xl font-black text-slate-900">No products found</p>
            <p className="mt-3 text-slate-500">Try another category or widen your search budget.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Shop;
