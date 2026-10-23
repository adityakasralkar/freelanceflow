import { SiteFooter, SiteNav } from './SiteChrome';

const NAV_GROUPS: { g: string; items: [string, boolean][] }[] = [
  {
    g: 'Getting started',
    items: [
      ['Introduction', true],
      ['Quick start', false],
      ['Adding clients', false],
    ],
  },
  {
    g: 'Core concepts',
    items: [
      ['Proposals', false],
      ['Projects & milestones', false],
      ['Invoices & GST', false],
      ['Cash flow', false],
    ],
  },
  {
    g: 'Client portal',
    items: [
      ['Inviting clients', false],
      ['Permissions', false],
    ],
  },
  {
    g: 'API',
    items: [
      ['Authentication', false],
      ['Endpoints', false],
      ['Webhooks', false],
    ],
  },
];

const QUICK_START: [string, string][] = [
  ['Add a client', 'Clients → Add client. Name and email are enough.'],
  ['Create a proposal', 'Proposals → New. Scope, deliverables, amount, terms.'],
  ['Send it', 'The client gets a magic-link email — no signup needed.'],
  ['Convert on accept', 'An accepted proposal becomes a project in one click.'],
];

export default function DocsPage() {
  return (
    <div className="pl-landing">
      <div
        className="pl-blob"
        style={{ width: 360, height: 360, top: -80, right: 200, background: 'rgba(21,184,134,0.35)' }}
      />
      <div className="pl-grid-overlay" />
      <SiteNav active="Docs" />
      <div
        className="grid gap-7 max-lg:!grid-cols-1"
        style={{
          position: 'relative',
          zIndex: 4,
          maxWidth: 1180,
          margin: '40px auto 0',
          padding: '0 28px',
          gridTemplateColumns: '230px 1fr 180px',
        }}
      >
        {/* left nav */}
        <div className="flex flex-col gap-5 max-lg:hidden">
          <input className="pl-search" placeholder="Search docs…" style={{ width: '100%' }} readOnly />
          {NAV_GROUPS.map((g) => (
            <div key={g.g}>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 750,
                  color: 'var(--pl-faint)',
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                  marginBottom: 7,
                }}
              >
                {g.g}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {g.items.map(([l, on]) => (
                  <div
                    key={l}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 8,
                      fontSize: 13,
                      cursor: 'pointer',
                      background: on ? 'var(--pl-emerald-soft)' : 'transparent',
                      color: on ? 'var(--pl-emerald-deep)' : 'var(--pl-muted)',
                      fontWeight: on ? 650 : 500,
                    }}
                  >
                    {l}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* article */}
        <article className="pl-card" style={{ padding: 40 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 750,
              color: 'var(--pl-emerald)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Getting started
          </div>
          <h1 style={{ margin: '0 0 12px', fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em' }}>
            Introduction
          </h1>
          <p style={{ margin: '0 0 20px', fontSize: 15, color: 'var(--pl-muted)', lineHeight: 1.7 }}>
            FreelanceFlow is a freelance business workspace built around one pipeline:{' '}
            <b style={{ color: 'var(--pl-text)' }}>
              proposal → project → milestone → invoice → payment
            </b>
            . This guide takes you from an empty account to your first paid invoice in about ten
            minutes.
          </p>
          <div className="pl-divider" style={{ margin: '22px 0' }} />
          <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 750, letterSpacing: '-0.01em' }}>
            The pipeline
          </h3>
          <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--pl-muted)', lineHeight: 1.7 }}>
            Every object in FreelanceFlow belongs to one of five states. Understanding them explains
            almost everything else in the product:
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
            {(
              [
                ['Draft', 'gray'],
                ['Sent', 'blue'],
                ['Accepted', 'green'],
                ['Invoiced', 'purple'],
                ['Paid', 'green'],
              ] as const
            ).map(([s, c]) => (
              <span key={s} className={`pl-badge ${c}`}>
                {s}
              </span>
            ))}
          </div>
          <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 750, letterSpacing: '-0.01em' }}>
            Quick start
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 22 }}>
            {QUICK_START.map(([t, d], i) => (
              <div key={t} style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 8,
                    background: 'var(--pl-emerald-soft)',
                    color: 'var(--pl-emerald-deep)',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 12,
                    fontWeight: 750,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 650 }}>{t}</div>
                  <div style={{ fontSize: 13, color: 'var(--pl-muted)', marginTop: 2 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              background: '#101c17',
              borderRadius: 12,
              padding: '16px 18px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 12.5,
              color: '#b9f5dc',
              lineHeight: 1.8,
            }}
          >
            <span style={{ color: '#6ea08c' }}># Create a proposal via the API</span>
            <br />
            POST /api/proposals
            <br />
            {'{'} "client_id": 12, "title": "Website Redesign", "amount": 45000 {'}'}
          </div>
        </article>

        {/* on this page */}
        <div className="max-lg:hidden">
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 750,
              color: 'var(--pl-faint)',
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            On this page
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 7,
              fontSize: 12.5,
              borderLeft: '2px solid var(--pl-line)',
              paddingLeft: 12,
            }}
          >
            <span style={{ color: 'var(--pl-emerald-deep)', fontWeight: 650 }}>Introduction</span>
            <span style={{ color: 'var(--pl-muted)' }}>The pipeline</span>
            <span style={{ color: 'var(--pl-muted)' }}>Quick start</span>
            <span style={{ color: 'var(--pl-muted)' }}>API example</span>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
