// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { getTotalItems } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const totalItems = getTotalItems();
  const navigate = useNavigate();
  const [navSearch, setNavSearch] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/shop?q=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[rgba(120,96,74,0.14)] bg-[rgba(255,250,244,0.84)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1f2937,#5b3b2f)] text-lg font-black text-white shadow-lg">
            SC
          </div>
          <div>
            <div className="display-title text-4xl font-black leading-none text-[var(--accent-coral)]">
              StyleCart
            </div>
            <div className="eyebrow mt-1 text-[10px] font-semibold text-slate-500">
              Modern Wardrobe
            </div>
          </div>
        </Link>

        <div className="section-frame flex flex-wrap items-center gap-2 px-3 py-2 text-[15px] font-semibold text-slate-700 shadow-none">
          <Link to="/" className="rounded-full px-4 py-2 transition-colors hover:bg-white hover:text-[var(--accent-coral)]">Home</Link>
          <Link to="/shop" className="rounded-full px-4 py-2 transition-colors hover:bg-white hover:text-[var(--accent-coral)]">Shop</Link>
          <Link to="/offers" className="rounded-full px-4 py-2 transition-colors hover:bg-white hover:text-[var(--accent-coral)]">Offers</Link>
          {!isAdmin && !isAuthenticated && (
            <>
              <Link to="/login" className="rounded-full px-4 py-2 transition-colors hover:bg-white hover:text-[var(--accent-coral)]">Sign In</Link>
              <Link to="/signup" className="rounded-full px-4 py-2 transition-colors hover:bg-white hover:text-[var(--accent-coral)]">Sign Up</Link>
            </>
          )}
          {isAuthenticated && !isAdmin && (
            <Link to="/orders" className="rounded-full px-4 py-2 transition-colors hover:bg-white hover:text-[var(--accent-coral)]">My Orders</Link>
          )}
          {isAuthenticated && isAdmin && (
            <Link to="/admin/dashboard" className="rounded-full px-4 py-2 transition-colors hover:bg-white hover:text-[var(--accent-gold)]">Dashboard</Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!isAdmin && (
            <form className="relative hidden md:block" onSubmit={handleSearchSubmit}>
              <input
                className="w-48 rounded-full border border-[rgba(120,96,74,0.18)] bg-white/70 px-4 py-2 text-sm outline-none transition focus:w-64 focus:border-[var(--accent-coral)]"
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Search pieces..."
                type="text"
                value={navSearch}
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" type="submit">
                🔍
              </button>
            </form>
          )}

          {isAuthenticated ? (
            <>
              <span className="hidden rounded-full border border-[rgba(120,96,74,0.14)] bg-white/70 px-4 py-2 text-sm font-semibold text-slate-600 md:inline">
                {user?.name} • {user?.role}
              </span>
              <button
                className="rounded-full border border-[rgba(120,96,74,0.18)] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[var(--accent-coral)] hover:text-[var(--accent-coral)]"
                onClick={logout}
                type="button"
              >
                Logout
              </button>
            </>
          ) : null}

          {!isAdmin && (
            <Link to="/cart" className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(120,96,74,0.16)] bg-white text-2xl shadow-sm transition-colors hover:text-[var(--accent-coral)]">
              🛒
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-coral)] text-xs font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
