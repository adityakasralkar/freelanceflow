import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Sparkles } from 'lucide-react';

const NAV_LINKS: { label: string; to: string }[] = [
  { label: 'Features', to: '/' },
  { label: 'Workflow', to: '/workflow' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Docs', to: '/docs' },
];

export function SiteNav({ active }: { active?: string }) {
  return (
    <nav className="pl-nav-bar pl-glass">
      <Link to="/" className="pl-row" style={{ gap: 11, textDecoration: 'none' }}>
        <div className="pl-brand-mark" style={{ width: 30, height: 30, fontSize: 15 }}>F</div>
        <div className="pl-brand-name" style={{ fontSize: 17 }}>
          Freelance<span>Flow</span>
        </div>
      </Link>
      <div className="pl-nav-links max-md:hidden">
        {NAV_LINKS.map((l) => (
          <Link key={l.label} to={l.to} className={active === l.label ? 'active' : ''}>
            {l.label}
          </Link>
        ))}
      </div>
      <div className="pl-row" style={{ gap: 8 }}>
        <Link to="/login" className="pl-btn ghost sm">
          Log in
        </Link>
        <Link to="/register" className="pl-btn primary sm">
          Get started
          <ArrowRight size={14} />
        </Link>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="pl-foot">
      <div className="pl-row" style={{ gap: 10 }}>
        <div className="pl-brand-mark" style={{ width: 26, height: 26, fontSize: 13 }}>F</div>
        <span style={{ fontSize: 13, color: 'var(--pl-muted)' }}>
          © 2026 FreelanceFlow — From proposal to payment.
        </span>
      </div>
      <div className="pl-row" style={{ gap: 18, fontSize: 13, color: 'var(--pl-muted)' }}>
        <span>Privacy</span>
        <span>Terms</span>
        <span>Support</span>
      </div>
    </footer>
  );
}

export function PageHero({
  eyebrow,
  titleStart,
  cursive,
  titleEnd,
  sub,
}: {
  eyebrow: string;
  titleStart: string;
  cursive: string;
  titleEnd?: string;
  sub: string;
}) {
  return (
    <section className="pl-hero" style={{ padding: '72px 28px 24px' }}>
      <div className="pl-eyebrow">
        <span className="pip">
          <Sparkles size={11} />
        </span>
        {eyebrow}
      </div>
      <h1 className="pl-h1" style={{ fontSize: 'clamp(36px, 4.2vw, 54px)' }}>
        {titleStart} <span className="cur">{cursive}</span>
        {titleEnd}
      </h1>
      <p className="pl-sub" style={{ fontSize: 16.5, marginTop: 20 }}>
        {sub}
      </p>
    </section>
  );
}

export function MarketingShell({ children }: { children: ReactNode }) {
  return <div className="pl-landing">{children}</div>;
}
