import { Link } from '@tanstack/react-router';
import { CheckCircle2 } from 'lucide-react';
import { PageHero, SiteFooter, SiteNav } from './SiteChrome';

const TIERS = [
  {
    name: 'Starter',
    price: '₹0',
    per: 'forever',
    hot: false,
    desc: 'For your first clients.',
    feats: [
      '3 active clients',
      'Unlimited proposals',
      'Milestone tracking',
      '5 invoices / month',
      'Client portal access',
    ],
    cta: 'Start free',
  },
  {
    name: 'Pro',
    price: '₹499',
    per: 'per month',
    hot: true,
    desc: 'For a growing practice.',
    feats: [
      'Unlimited clients',
      'Unlimited invoices',
      'Cash-flow dashboard',
      'Payment reminders',
      'GST-compliant invoices',
      'Custom invoice branding',
    ],
    cta: 'Start 14-day trial',
  },
  {
    name: 'Studio',
    price: '₹1,299',
    per: 'per month',
    hot: false,
    desc: 'For small teams.',
    feats: [
      'Everything in Pro',
      '3 team seats',
      'Roles & permissions',
      'Priority support',
      'CSV / API export',
    ],
    cta: 'Contact us',
  },
];

const FAQS = [
  [
    'Can clients use it for free?',
    'Yes — clients never pay. They get portal access through your plan, on any tier.',
  ],
  [
    'What happens after the trial?',
    'You drop to Starter automatically. Nothing is deleted; limits just apply again.',
  ],
  [
    'Do you support GST invoices?',
    'Pro and Studio generate GST-compliant invoices with your GSTIN, HSN/SAC and tax breakup.',
  ],
  [
    'Can I cancel anytime?',
    'Yes. Cancel in one click from Settings — you keep Pro until the end of the billing period.',
  ],
];

export default function PricingPage() {
  return (
    <div className="pl-landing">
      <div
        className="pl-blob"
        style={{ width: 400, height: 400, top: -60, left: 120, background: 'rgba(37,99,235,0.25)' }}
      />
      <div
        className="pl-blob"
        style={{ width: 380, height: 380, top: 300, right: -60, background: 'rgba(21,184,134,0.4)' }}
      />
      <div className="pl-grid-overlay" />
      <SiteNav active="Pricing" />
      <PageHero
        eyebrow="Simple, honest pricing"
        titleStart="Pay when it"
        cursive="pays off"
        sub="Free until FreelanceFlow is clearly earning its keep. No credit card to start, no surprises later."
      />
      <section className="pl-band" style={{ marginTop: 24 }}>
        <div className="pl-g3 max-md:!grid-cols-1" style={{ alignItems: 'stretch' }}>
          {TIERS.map((t) => (
            <div
              key={t.name}
              className="pl-feat"
              style={
                t.hot
                  ? {
                      border: '2px solid var(--pl-emerald)',
                      boxShadow: 'var(--pl-sh-emerald)',
                      position: 'relative',
                      background: 'rgba(255,255,255,0.9)',
                    }
                  : { position: 'relative' }
              }
            >
              {t.hot && (
                <span
                  className="pl-badge green"
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--pl-emerald)',
                    color: '#fff',
                  }}
                >
                  Most popular
                </span>
              )}
              <div style={{ fontSize: 14, fontWeight: 750 }}>{t.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--pl-muted)', marginTop: 2 }}>{t.desc}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, margin: '16px 0 4px' }}>
                <span className="pl-num" style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em' }}>
                  {t.price}
                </span>
                <span style={{ fontSize: 12.5, color: 'var(--pl-faint)' }}>{t.per}</span>
              </div>
              <Link
                to="/register"
                className={`pl-btn ${t.hot ? 'primary' : ''}`}
                style={{ width: '100%', justifyContent: 'center', margin: '14px 0 18px' }}
              >
                {t.cta}
              </Link>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {t.feats.map((f) => (
                  <div key={f} style={{ display: 'flex', gap: 9, alignItems: 'center', fontSize: 13 }}>
                    <CheckCircle2 size={15} style={{ color: 'var(--pl-emerald)', flexShrink: 0 }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="pl-band" style={{ marginTop: 72 }}>
        <div className="pl-band-h" style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 30 }}>
            Questions, <span className="cur">answered</span>
          </h2>
        </div>
        <div className="pl-g2 max-md:!grid-cols-1">
          {FAQS.map(([q, a]) => (
            <div key={q} className="pl-feat" style={{ padding: 22 }}>
              <h4 style={{ fontSize: 14.5, margin: '0 0 6px' }}>{q}</h4>
              <p style={{ margin: 0, fontSize: 13.5 }}>{a}</p>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
