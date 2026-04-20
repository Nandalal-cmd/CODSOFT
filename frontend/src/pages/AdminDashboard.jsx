import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { productApi } from '../lib/api';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: 'men',
  image: '',
  discount: '',
  stock: '',
  sizes: 'S, M, L, XL',
  colors: 'Black, White, Blue',
  featured: false,
};

function AdminDashboard() {
  const { user, token, logout, refreshAdminOverview } = useAuth();
  const [overview, setOverview] = useState(null);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const [overviewData, productData] = await Promise.all([
          refreshAdminOverview(),
          productApi.getAll(),
        ]);

        if (isMounted) {
          setOverview(overviewData);
          setProducts(productData.products || []);
          setError('');
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [refreshAdminOverview]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId('');
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setStatusMessage('');
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      category: product.category,
      image: product.image,
      discount: String(product.discount || 0),
      stock: String(product.stock || 0),
      sizes: (product.sizes || []).join(', '),
      colors: (product.colors || []).join(', '),
      featured: Boolean(product.featured),
    });
  };

  const handleDelete = async (productId) => {
    try {
      setError('');
      setStatusMessage('');
      await productApi.remove(token, productId);
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      setOverview((prev) =>
        prev
          ? {
              ...prev,
              stats: {
                ...prev.stats,
                productCount: Math.max(0, (prev.stats?.productCount || 0) - 1),
              },
            }
          : prev,
      );
      if (editingId === productId) {
        resetForm();
      }
      setStatusMessage('Product deleted successfully.');
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    setStatusMessage('');

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discount: Number(form.discount || 0),
        stock: Number(form.stock || 0),
      };

      const response = editingId
        ? await productApi.update(token, editingId, payload)
        : await productApi.create(token, payload);

      const nextProduct = response.product;

      setProducts((prev) => {
        if (editingId) {
          return prev.map((product) => (product.id === editingId ? nextProduct : product));
        }

        return [nextProduct, ...prev];
      });

      setOverview((prev) =>
        prev && !editingId
          ? {
              ...prev,
              stats: {
                ...prev.stats,
                productCount: (prev.stats?.productCount || 0) + 1,
              },
            }
          : prev,
      );

      setStatusMessage(editingId ? 'Product updated successfully.' : 'Product created successfully.');
      resetForm();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOrderStatusUpdate = async (orderId, updates) => {
    try {
      setError('');
      const response = await orderApi.adminUpdateStatus(token, orderId, updates);
      
      setOverview((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          recentOrders: prev.recentOrders.map((order) =>
            order.id === orderId ? { ...order, ...updates } : order
          ),
        };
      });
      setStatusMessage('Order status updated successfully.');
    } catch (updateError) {
      setError(updateError.message);
    }
  };

  const handleRefresh = async () => {
    try {
      setError('');
      setStatusMessage('Refreshing dashboard data...');
      const [overviewData, productData] = await Promise.all([
        refreshAdminOverview(),
        productApi.getAll(),
      ]);
      setOverview(overviewData);
      setProducts(productData.products || []);
      setStatusMessage('Dashboard updated.');
    } catch (err) {
      setError('Failed to refresh: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0d10] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-slate-200">
              SC
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">StyleCart Admin</p>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Minimal Workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:text-white"
              onClick={handleRefresh}
              type="button"
            >
              ↻ Refresh
            </button>
            <button
              className="rounded-xl border border-red-500/20 px-4 py-2 text-sm font-semibold text-red-300 transition hover:border-red-500/40"
              onClick={logout}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 rounded-[1.5rem] border border-white/10 bg-[#11151b] p-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Dashboard</p>
            <h1 className="mt-3 text-3xl font-bold">Welcome back, {user?.name}.</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              Manage products and review account activity from a focused admin-only workspace.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
            Signed in as {user?.email}
          </div>
        </div>

        {error ? <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-200">{error}</div> : null}
        {statusMessage ? (
          <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-emerald-200">{statusMessage}</div>
        ) : null}

        <div className="mt-8 grid gap-6 md:grid-cols-5">
          <div className="rounded-[1.5rem] border border-white/10 bg-[#11151b] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Customers</p>
            <p className="mt-4 text-4xl font-bold">{overview?.stats?.customerCount ?? '--'}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-[#11151b] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Admins</p>
            <p className="mt-4 text-4xl font-bold">{overview?.stats?.adminCount ?? '--'}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-[#11151b] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Products</p>
            <p className="mt-4 text-4xl font-bold">{overview?.stats?.productCount ?? products.length}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-[#11151b] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Total Orders</p>
            <p className="mt-4 text-4xl font-bold">{overview?.stats?.orderCount ?? '--'}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-[#11151b] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Revenue (Paid)</p>
            <p className="mt-4 text-4xl font-bold">
              {overview?.stats?.totalRevenue != null ? `₹${overview.stats.totalRevenue}` : '--'}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[1.5rem] border border-white/10 bg-[#11151b] p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">{editingId ? 'Edit Product' : 'Add Product'}</h2>
              {editingId ? (
                <button
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200"
                  onClick={resetForm}
                  type="button"
                >
                  Cancel Edit
                </button>
              ) : null}
            </div>

            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <input
                className="rounded-xl border border-white/10 bg-[#0b0d10] px-4 py-3"
                name="name"
                onChange={handleChange}
                placeholder="Product name"
                required
                value={form.name}
              />
              <textarea
                className="min-h-[120px] rounded-xl border border-white/10 bg-[#0b0d10] px-4 py-3"
                name="description"
                onChange={handleChange}
                placeholder="Product description"
                value={form.description}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="rounded-xl border border-white/10 bg-[#0b0d10] px-4 py-3"
                  min="0"
                  name="price"
                  onChange={handleChange}
                  placeholder="Price"
                  required
                  type="number"
                  value={form.price}
                />
                <select
                  className="rounded-xl border border-white/10 bg-[#0b0d10] px-4 py-3 text-white"
                  name="category"
                  onChange={handleChange}
                  value={form.category}
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
              <input
                className="rounded-xl border border-white/10 bg-[#0b0d10] px-4 py-3"
                name="image"
                onChange={handleChange}
                placeholder="Image URL"
                required
                value={form.image}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="rounded-xl border border-white/10 bg-[#0b0d10] px-4 py-3"
                  min="0"
                  name="discount"
                  onChange={handleChange}
                  placeholder="Discount"
                  type="number"
                  value={form.discount}
                />
                <input
                  className="rounded-xl border border-white/10 bg-[#0b0d10] px-4 py-3"
                  min="0"
                  name="stock"
                  onChange={handleChange}
                  placeholder="Stock"
                  type="number"
                  value={form.stock}
                />
              </div>
              <input
                className="rounded-xl border border-white/10 bg-[#0b0d10] px-4 py-3"
                name="sizes"
                onChange={handleChange}
                placeholder="Sizes, comma separated"
                value={form.sizes}
              />
              <input
                className="rounded-xl border border-white/10 bg-[#0b0d10] px-4 py-3"
                name="colors"
                onChange={handleChange}
                placeholder="Colors, comma separated"
                value={form.colors}
              />
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b0d10] px-4 py-3">
                <input
                  checked={form.featured}
                  name="featured"
                  onChange={handleChange}
                  type="checkbox"
                />
                <span className="text-sm font-semibold text-slate-200">Feature this product on the storefront</span>
              </label>
              <button
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                disabled={isSaving}
                type="submit"
              >
                {isSaving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </section>

          <section className="rounded-[1.5rem] border border-white/10 bg-[#11151b] p-6">
            <h2 className="text-xl font-semibold">Product Catalog</h2>
            <div className="mt-6 space-y-4">
              {products.map((product) => (
                <div
                  className="grid gap-4 rounded-2xl border border-white/10 bg-[#0b0d10] p-5 lg:grid-cols-[96px_1fr_auto]"
                  key={product.id}
                >
                  <img
                    alt={product.name}
                    className="h-24 w-24 rounded-2xl object-cover"
                    src={product.image}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      {product.featured ? (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300">
                          Featured
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-slate-400">{product.category} • ₹{product.price} • Stock {product.stock}</p>
                    <p className="mt-3 text-sm text-slate-300">{product.description}</p>
                  </div>
                  <div className="flex gap-3 lg:flex-col">
                    <button
                      className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200"
                      onClick={() => handleEdit(product)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-xl border border-red-500/20 px-4 py-2 text-sm font-semibold text-red-300"
                      onClick={() => handleDelete(product.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-[1.5rem] border border-white/10 bg-[#11151b] p-6">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <div className="mt-6 space-y-4">
            {(overview?.recentOrders || []).length === 0 ? (
              <p className="text-slate-500">No orders yet.</p>
            ) : (
              (overview?.recentOrders || []).map((order) => (
                <div
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0b0d10] px-5 py-4 md:flex-row md:items-center md:justify-between"
                  key={order.id}
                >
                  <div className="flex-1">
                    <p className="font-mono text-sm font-semibold text-slate-300">#{String(order.id).slice(-8).toUpperCase()}</p>
                    <p className="text-slate-400">{order.user?.name} • {order.user?.email}</p>
                    <p className="mt-1 text-lg font-bold text-white">₹{order.totalAmount}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Order Status</label>
                      <select
                        className={`rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs font-bold transition focus:border-white/20 focus:outline-none ${
                          order.orderStatus === 'delivered' ? 'text-green-300' :
                          order.orderStatus === 'shipped' ? 'text-purple-300' :
                          order.orderStatus === 'processing' ? 'text-yellow-300' :
                          order.orderStatus === 'cancelled' ? 'text-red-300' :
                          'text-blue-300'
                        }`}
                        onChange={(e) => handleOrderStatusUpdate(order.id, { orderStatus: e.target.value })}
                        value={order.orderStatus}
                      >
                        <option value="placed">Placed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Payment</label>
                      <select
                        className={`rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs font-bold transition focus:border-white/20 focus:outline-none ${
                          order.paymentStatus === 'paid' ? 'text-green-300' :
                          order.paymentStatus === 'failed' ? 'text-red-300' :
                          'text-orange-300'
                        }`}
                        onChange={(e) => handleOrderStatusUpdate(order.id, { paymentStatus: e.target.value })}
                        value={order.paymentStatus}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>

                    <span className="text-sm text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-8 rounded-[1.5rem] border border-white/10 bg-[#11151b] p-6">
          <h2 className="text-xl font-semibold">Recent Accounts</h2>
          <div className="mt-6 space-y-4">
            {(overview?.recentUsers || []).map((account) => (
              <div
                className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-[#0b0d10] px-5 py-4 md:flex-row md:items-center md:justify-between"
                key={account.id}
              >
                <div>
                  <p className="text-lg font-semibold">{account.name}</p>
                  <p className="text-slate-400">{account.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300">
                    {account.role}
                  </span>
                  <span className="text-sm text-slate-400">
                    {new Date(account.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
