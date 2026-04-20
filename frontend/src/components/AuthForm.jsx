import { useState } from 'react';
import { Link } from 'react-router-dom';

function AuthForm({
  title,
  subtitle,
  submitLabel,
  onSubmit,
  switchLabel,
  switchTo,
  switchPath,
  isAdmin = false,
  showName = false,
  showInviteCode = false,
}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit(form);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-[calc(100vh-88px)] px-6 py-12 ${
        isAdmin ? 'bg-[#0b0d10] text-white' : 'page-shell bg-transparent'
      }`}
    >
      <div className={`mx-auto grid gap-10 ${isAdmin ? 'max-w-4xl lg:grid-cols-[0.9fr_1.1fr]' : 'max-w-6xl lg:grid-cols-[1.1fr_0.9fr]'}`}>
        <section
          className={`rounded-[2rem] p-10 ${
            isAdmin
              ? 'border border-white/10 bg-[#11151b]'
              : 'section-frame bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.14),_transparent_45%),linear-gradient(145deg,_#fff8f3,_#fff0e8_55%,_#ffffff)]'
          }`}
        >
          <p
            className={`eyebrow mb-4 text-sm font-bold ${
              isAdmin ? 'text-amber-300' : 'text-[var(--accent-terracotta)]'
            }`}
          >
            {isAdmin ? 'Admin Portal' : 'Customer Account'}
          </p>
          <h1 className="display-title max-w-xl text-4xl font-black leading-tight md:text-6xl">{title}</h1>
          <p className={`mt-5 max-w-xl text-lg ${isAdmin ? 'text-slate-300' : 'text-slate-600'}`}>
            {subtitle}
          </p>
          {isAdmin ? (
            <div className="mt-10 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Workspace</p>
                <p className="mt-2 text-lg font-semibold text-white">Catalog and account operations</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Access</p>
                <p className="mt-2 text-lg font-semibold text-white">Restricted to authorized admins only</p>
              </div>
            </div>
          ) : (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white bg-white/80 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Access</p>
                <p className="mt-3 text-xl font-semibold">Saved shopping flow</p>
              </div>
              <div className="rounded-3xl border border-white bg-white/80 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Security</p>
                <p className="mt-3 text-xl font-semibold">JWT-backed account login</p>
              </div>
            </div>
          )}
        </section>

        <section
          className={`rounded-[2rem] border p-8 shadow-xl ${
            isAdmin ? 'border-white/10 bg-[#11151b] shadow-none' : 'section-frame border-[rgba(120,96,74,0.12)] bg-white/90'
          }`}
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            {showName && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Full name</span>
                <input
                  className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${
                    isAdmin
                      ? 'border-white/10 bg-slate-950 focus:border-amber-400'
                      : 'border-slate-200 bg-white focus:border-pink-500'
                  }`}
                  name="name"
                  onChange={handleChange}
                  placeholder="Alex Carter"
                  required
                  value={form.name}
                />
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Email address</span>
              <input
                className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${
                  isAdmin
                    ? 'border-white/10 bg-slate-950 focus:border-amber-400'
                    : 'border-slate-200 bg-white focus:border-pink-500'
                }`}
                name="email"
                onChange={handleChange}
                placeholder={isAdmin ? 'admin@stylecart.com' : 'you@example.com'}
                required
                type="email"
                value={form.email}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Password</span>
              <input
                className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${
                  isAdmin
                    ? 'border-white/10 bg-slate-950 focus:border-amber-400'
                    : 'border-slate-200 bg-white focus:border-pink-500'
                }`}
                minLength="6"
                name="password"
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
                type="password"
                value={form.password}
              />
            </label>

            {showInviteCode && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Admin invite code</span>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none transition focus:border-amber-400"
                  name="inviteCode"
                  onChange={handleChange}
                  placeholder="Enter the invite code from backend/.env"
                  required
                  value={form.inviteCode}
                />
              </label>
            )}

            {error ? (
              <div
                className={`rounded-2xl px-4 py-3 text-sm ${
                  isAdmin ? 'bg-red-500/10 text-red-200' : 'bg-red-50 text-red-600'
                }`}
              >
                {error}
              </div>
            ) : null}

            <button
              className={`w-full rounded-2xl px-5 py-3 text-lg font-semibold transition ${
                isAdmin
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                  : 'bg-pink-600 text-white hover:bg-pink-700'
              }`}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Please wait...' : submitLabel}
            </button>
          </form>
          {switchLabel && switchPath && switchTo ? (
            <p className={`mt-5 text-sm ${isAdmin ? 'text-slate-400' : 'text-slate-500'}`}>
              {switchLabel}{' '}
              <Link
                className={`font-semibold ${isAdmin ? 'text-amber-300' : 'text-pink-600'}`}
                to={switchPath}
              >
                {switchTo}
              </Link>
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}

export default AuthForm;
