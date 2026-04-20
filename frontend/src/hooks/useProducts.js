import { useEffect, useState } from 'react';
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
    featured: Boolean(product.featured),
  };
}

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        const data = await productApi.getAll();

        if (isMounted) {
          setProducts(data.products || []);
          setError('');
        }
      } catch {
        if (isMounted) {
          setProducts(demoProducts.map(normalizeDemoProduct));
          setError('Backend products are unavailable right now, so demo products are being shown.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, setProducts, loading, error };
}
