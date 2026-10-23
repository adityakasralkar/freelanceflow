import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Flag,
  IndianRupee,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHero, SiteFooter, SiteNav } from './SiteChrome';

interface Step {
  n: string;
  icon: LucideIcon;
  t: string;
  side: string;
  d: string;
  vis: ReactNode;
}

const STEPS: Step[] = [
  {
    n: '01',
    icon: FileText,
    t: 'Draft the proposal',
    side: 'Freelancer',
    d: 'Pick a client, define scope, deliverables, amount, and payment terms. Save as a draft or send straight away — the client gets a magic link, no account needed.',
    vis: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="pl-spread">
          <span style={{ fontSize: 13, fontWeight: 650 }}>Website Redesign</span>
          <span className="pl-badge blue">Sent</span>
        </div>
        <div className="pl-bar">
          <span style={{ width: '30%' }} />
        </div>
        <div style={{ fontSize: 12, color: 'var(--pl-muted)' }}>
          ₹45,000 · Valid until May 30 · 50/50 terms
        </div>
      </div>
    ),
  },
  {
    n: '02',
    icon: CheckCircle2,
    t: 'Client accepts in one click',
    side: 'Client',
    d: 'The client reviews scope and terms in their portal and accepts, declines, or requests changes. On accept, FreelanceFlow converts the proposal into a project automatically.',
    vis: (
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="pl-btn primary sm" style={{ flex: 1, justifyContent: 'center' }} tabIndex={-1}>
          <Check size={13} />
          Accept
        </button>
        <button className="pl-btn sm" style={{ flex: 1, justifyContent: 'center' }} tabIndex={-1}>
          Request changes
        </button>
      </div>
    ),
  },
  {
    n: '03',
    icon: Flag,
    t: 'Track milestones',
    side: 'Freelancer',
    d: 'Break the project into milestones with due dates and amounts. Completing a milestone pre-fills an invoice with the right line items, GST, and due date.',
    vis: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {(
          [
            ['Discovery', 'Paid', 'green'],
            ['Design system', 'Paid', 'green'],
            ['Dev Phase 1', 'In Progress', 'amber'],
          ] as const
        ).map(([t, s, c]) => (
          <div key={t} className="pl-spread" style={{ fontSize: 12.5 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: c === 'green' ? 'var(--pl-emerald)' : 'var(--pl-amber)',
                }}
              />
              {t}
            </span>
            <span className={`pl-badge ${c}`}>{s}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: '04',
    icon: IndianRupee,
    t: 'Invoice & get paid',
    side: 'Both',
    d: 'Send the invoice from the app. The client pays or marks it paid in the portal; your cash-flow dashboard updates the moment money moves — earned, pending, overdue.',
    vis: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="pl-spread">
          <span className="pl-mono" style={{ fontSize: 13, fontWeight: 650 }}>
            INV-008
          </span>
          <span className="pl-badge green">Paid</span>
        </div>
        <div className="pl-num" style={{ fontSize: 22, fontWeight: 760, letterSpacing: '-0.02em' }}>
          +₹29,500
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--pl-muted)' }}>Cash flow updated · 2 min ago</div>
      </div>
    ),
  },
];

export default function WorkflowPage() {
  return (
    <div className="pl-landing">
      <div
        className="pl-blob"
        style={{ width: 400, height: 400, top: -60, right: 100, background: 'rgba(21,184,134,0.45)' }}
      />
      <div className="pl-grid-overlay" />
      <SiteNav active="Workflow" />
      <PageHero
        eyebrow="The pipeline, step by step"
        titleStart="How work"
        cursive="flows"
        sub="One state machine from first hello to money in the bank. Each step hands off to the next — nothing falls through the cracks."
      />
      <section className="pl-band" style={{ marginTop: 28 }}>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 980, margin: '0 auto' }}
        >
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="grid items-stretch gap-[18px] max-md:!grid-cols-1"
              style={{ gridTemplateColumns: i % 2 ? '300px 1fr' : '1fr 300px' }}
            >
              <div
                className="pl-feat"
                style={{
                  order: i % 2 ? 2 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: 28,
                }}
              >
                <div className="pl-row" style={{ gap: 12, marginBottom: 12 }}>
                  <div className="ic" style={{ margin: 0 }}>
                    <s.icon size={20} strokeWidth={1.9} />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: 'var(--pl-faint)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    STEP {s.n}
                  </span>
                  <span className="pl-badge gray" style={{ marginLeft: 'auto' }}>
                    {s.side}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 750, letterSpacing: '-0.02em' }}>
                  {s.t}
                </h4>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--pl-muted)', lineHeight: 1.65 }}>
                  {s.d}
                </p>
              </div>
              <div
                className="pl-card pad"
                style={{
                  order: i % 2 ? 1 : 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                {s.vis}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="pl-finale" style={{ marginTop: 64 }}>
        <div className="pl-finale-card" style={{ padding: '44px 48px' }}>
          <h2 style={{ fontSize: 32 }}>
            See it in <span className="cur">action</span>
          </h2>
          <div className="pl-cta-row" style={{ marginTop: 22 }}>
            <Link
              to="/register"
              className="pl-btn lg"
              style={{ background: '#fff', color: 'var(--pl-emerald-deep)', border: 'none' }}
            >
              Start free
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
