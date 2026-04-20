import { Link } from 'react-router-dom';

function Offers() {
  const offers = [
    {
      title: 'Weekend Denim Drop',
      copy: 'Get 25% off every denim style this weekend.',
      accent: 'from-sky-500 to-cyan-400',
    },
    {
      title: 'Fresh Fits Bundle',
      copy: 'Buy any 2 tops and unlock a third one for free.',
      accent: 'from-pink-500 to-rose-500',
    },
    {
      title: 'Kids Comfort Edit',
      copy: 'Save 15% on selected kids essentials above Rs. 1,499.',
      accent: 'from-amber-400 to-orange-500',
    },
  ];

  return (
    <div className="page-shell min-h-[calc(100vh-88px)] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="section-frame p-10">
          <p className="eyebrow text-xs font-bold text-[var(--accent-terracotta)]">Live Offers</p>
          <h1 className="display-title mt-4 text-4xl font-black text-slate-900 md:text-6xl">
            Promotions that feel like a real storefront, not a placeholder.
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-slate-600">
            This page closes the broken route in the original project and gives the storefront a dedicated offers destination.
          </p>
          <Link
            className="mt-8 inline-flex rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
            to="/shop"
          >
            Explore the shop
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {offers.map((offer) => (
            <article
              className="section-frame p-6"
              key={offer.title}
            >
              <div className={`h-3 rounded-full bg-gradient-to-r ${offer.accent}`} />
              <h2 className="display-title mt-5 text-3xl font-black text-slate-900">{offer.title}</h2>
              <p className="mt-3 text-slate-600">{offer.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Offers;
