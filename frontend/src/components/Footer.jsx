import { Link } from 'react-router-dom';

function Footer() {
  const socialLinks = [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
  ];

  const quickLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'Offers', href: '/offers' },
    { label: 'Customer Login', href: '/login' },
    { label: 'Admin Login', href: '/admin' },
  ];

  return (
    <footer className="border-t border-[rgba(120,96,74,0.14)] bg-[linear-gradient(180deg,rgba(255,248,243,0.9),rgba(250,241,233,0.96))] px-6 py-10">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
        <section className="section-frame p-7">
          <p className="eyebrow text-xs font-bold text-[var(--accent-terracotta)]">StyleCart</p>
          <h2 className="display-title mt-4 text-4xl font-black text-slate-900">Stay connected to the store.</h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            Reach out for collaborations, customer support, product updates, and the latest wardrobe drops across our social platforms.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                className="rounded-full border border-[rgba(120,96,74,0.16)] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[var(--accent-coral)] hover:text-[var(--accent-coral)]"
                href={link.href}
                rel="noreferrer"
                target="_blank"
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>

        <section className="section-frame p-7">
          <p className="eyebrow text-xs font-bold text-[var(--accent-terracotta)]">Quick Links</p>
          <div className="mt-5 space-y-3">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                className="block text-base font-semibold text-slate-700 transition hover:text-[var(--accent-coral)]"
                to={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="section-frame p-7">
          <p className="eyebrow text-xs font-bold text-[var(--accent-terracotta)]">Contact</p>
          <div className="mt-5 space-y-3 text-base text-slate-600">
            <p>Email: hello@stylecart.com</p>
            <p>Phone: +977 9800000000</p>
            <p>Address: Kathmandu, Nepal</p>
            <p>Support: Mon - Sat, 9 AM to 6 PM</p>
          </div>
        </section>
      </div>

      <div className="mx-auto mt-8 max-w-7xl text-center text-sm text-slate-500">
        © 2026 StyleCart. Built for a modern shopping experience.
      </div>
    </footer>
  );
}

export default Footer;
