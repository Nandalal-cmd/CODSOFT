// src/pages/Shop.jsx
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const Shop = () => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState(3500);

  useEffect(() => {
    let result = products;

    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category) {
      result = result.filter(p => p.category === category);
    }

    result = result.filter(p => p.price <= maxPrice);

    setFilteredProducts(result);
  }, [searchTerm, category, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold text-center mb-10">Our Collection</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-3xl shadow mb-10">
        <div className="flex flex-col md:flex-row gap-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-pink-500"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-pink-500"
          >
            <option value="">All Categories</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
            <option value="unisex">Unisex</option>
          </select>

          <div className="flex items-center gap-3">
            <span className="font-medium">₹{maxPrice}</span>
            <input
              type="range"
              min="300"
              max="3500"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-48 accent-pink-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center text-2xl text-gray-500 mt-20">No products found</p>
      )}
    </div>
  );
};

export default Shop;