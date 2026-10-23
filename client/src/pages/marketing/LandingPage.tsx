import { Link } from '@tanstack/react-router';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Flag,
  Folder,
  Home,
  IndianRupee,
  LogIn,
  Plus,
  Receipt,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { SiteFooter, SiteNav } from './SiteChrome';

const FEATURES = [
  {
    icon: FileText,
    h: 'Proposal pipeline',
    p: 'Draft, send, and track proposals. Clients accept in one click and a project is created automatically.',
  },
  {
    icon: Folder,
    h: 'Milestone tracking',
    p: 'Break work into milestones. Mark one complete and a pre-filled invoice is ready to send.',
  },
  {
    icon: TrendingUp,
    h: 'Cash-flow clarity',
    p: 'Earned, pending, and overdue at a glance — with revenue trends and invoice aging.',
  },
];

const STEPS = [
  { n: '01', icon: FileText, t: 'Send proposal', d: 'Scope, deliverables, terms.' },
  { n: '02', icon: CheckCircle2, t: 'Client accepts', d: 'Auto-converts to a project.' },
  { n: '03', icon: Flag, t: 'Hit milestones', d: 'Invoice generated on completion.' },
  { n: '04', icon: IndianRupee, t: 'Get paid', d: 'Cash flow updates in real time.' },
];

export default function LandingPage() {
  return (
    <div className="pl-landing">
      {/* ambient blobs */}
      <div
        className="pl-blob"
        style={{ width: 420, height: 420, top: -80, right: 120, background: 'rgba(21,184,134,0.5)' }}
      />
      <div
        className="pl-blob"
        style={{ width: 340, height: 340, top: 260, left: -60, background: 'rgba(37,99,235,0.28)' }}
      />
      <div className="pl-grid-overlay" />

      <SiteNav active="Features" />

      {/* hero */}
      <section className="pl-hero">
        <div className="pl-eyebrow">
          <span className="pip">
            <Sparkles size={11} />
          </span>
          From proposal to payment — one calm workspace
        </div>
        <h1 className="pl-h1">
          Run your freelance
          <br />
          business, <span className="cur">effortlessly</span>
        </h1>
        <p className="pl-sub">
          FreelanceFlow turns scattered proposals, milestones, and invoices into one clean pipeline
          — so you always know what's owed, what's next, and what's paid.
        </p>
        <div className="pl-cta-row">
          <Link to="/register" className="pl-btn primary lg">
            Start free
            <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="pl-btn lg">
            Sign in
            <LogIn size={15} />
          </Link>
        </div>
        <div className="pl-trustline">
          No credit card · Free for your first 3 clients · Cancel anytime
        </div>
      </section>

      {/* app preview framed in glass + floating glass cards */}
      <div className="pl-preview-wrap max-md:hidden">
        <div className="pl-float pl-glass" style={{ top: -18, left: 70 }}>
          <div
            className="ic"
            style={{ background: 'var(--pl-emerald-soft)', color: 'var(--pl-emerald-deep)' }}
          >
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700 }}>Invoice paid</div>
            <div style={{ fontSize: 11, color: 'var(--pl-muted)' }}>+₹29,500 · TechNova</div>
          </div>
        </div>
        <div className="pl-float pl-glass" style={{ top: 120, right: 56 }}>
          <div className="ic" style={{ background: 'var(--pl-blue-soft)', color: 'var(--pl-blue)' }}>
            <Flag size={18} />
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700 }}>Milestone complete</div>
            <div style={{ fontSize: 11, color: 'var(--pl-muted)' }}>Design system · 60%</div>
          </div>
        </div>

        <div className="pl-preview">
          <div className="pl-preview-inner">
            <PreviewDashboard />
          </div>
        </div>
      </div>

      {/* features */}
      <section className="pl-band">
        <div className="pl-band-h">
          <h2>
            Everything in <span className="cur">flow</span>
          </h2>
          <p>
            Three connected surfaces replace the spreadsheet, the email thread, and the sticky
            note.
          </p>
        </div>
        <div className="pl-g3 max-md:!grid-cols-1">
          {FEATURES.map((f) => (
            <div key={f.h} className="pl-feat">
              <div className="ic">
                <f.icon size={20} strokeWidth={1.9} />
              </div>
              <h4>{f.h}</h4>
              <p>{f.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* workflow steps */}
      <section className="pl-steps">
        <div className="pl-band-h">
          <h2>
            From hello to <span className="cur">paid</span>
          </h2>
          <p>The whole client lifecycle, without leaving the app.</p>
        </div>
        <div className="pl-g4 max-md:!grid-cols-1">
          {STEPS.map((s, i) => (
            <div key={s.n} className="pl-feat" style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 18,
                  right: 20,
                  fontSize: 12,
                  fontWeight: 800,
                  color: 'var(--pl-faint)',
                  letterSpacing: '0.08em',
                }}
              >
                {s.n}
              </div>
              <div className="ic">
                <s.icon size={20} strokeWidth={1.9} />
              </div>
              <h4>{s.t}</h4>
              <p>{s.d}</p>
              {i < 3 && (
                <div
                  className="max-md:hidden"
                  style={{
                    position: 'absolute',
                    right: -13,
                    top: '50%',
                    color: 'var(--pl-faint)',
                    zIndex: 2,
                  }}
                >
                  <ChevronRight size={18} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* finale CTA */}
      <section className="pl-finale">
        <div className="pl-finale-card">
          <div
            className="pl-blob"
            style={{ width: 300, height: 300, bottom: -120, left: 80, background: 'rgba(21,184,134,0.5)' }}
          />
          <h2>
            Get organized, <span className="cur">today</span>
          </h2>
          <p>
            Join freelancers who stopped chasing payments and started seeing their whole business
            in one place.
          </p>
          <div className="pl-cta-row" style={{ marginTop: 28 }}>
            <Link
              to="/register"
              className="pl-btn lg"
              style={{ background: '#fff', color: 'var(--pl-emerald-deep)', border: 'none' }}
            >
              Create free account
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="pl-btn lg"
              style={{
                background: 'rgba(255,255,255,0.16)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.4)',
                boxShadow: 'none',
              }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

/* ----------------------------------------------------------------------------
   Compact, static dashboard mock shown inside the hero glass frame
---------------------------------------------------------------------------- */

const PREVIEW_NAV = [
  { label: 'Dashboard', icon: Home, active: true },
  { label: 'Cash Flow', icon: TrendingUp },
  { label: 'Proposals', icon: FileText, badge: '8' },
  { label: 'Projects', icon: Folder, badge: '5' },
  { label: 'Invoices', icon: Receipt, badge: '3' },
  { label: 'Clients', icon: Users },
  { label: 'Settings', icon: Settings },
];

function PreviewDashboard() {
  return (
    <div
      className="pl-app"
      style={{ width: '100%', height: 520, minHeight: 0, borderRadius: 0, border: 'none' }}
    >
      <aside className="pl-side" style={{ height: 'auto', position: 'static' }}>
        <div className="pl-brand">
          <div className="pl-brand-mark">F</div>
          <div className="pl-brand-name">
            Freelance<span>Flow</span>
          </div>
        </div>
        <div className="pl-side-label">Workspace</div>
        <nav className="pl-nav">
          {PREVIEW_NAV.map((item) => (
            <div key={item.label} className={`pl-nav-item ${item.active ? 'active' : ''}`}>
              <span className="ic">
                <item.icon size={17} strokeWidth={1.75} />
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && <span className="pl-nav-badge">{item.badge}</span>}
            </div>
          ))}
        </nav>
        <div className="pl-side-foot">
          <div className="pl-user">
            <div className="pl-ava">RM</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Rahul Mehta</div>
              <div style={{ fontSize: 11, color: 'var(--pl-muted)' }}>Pro plan</div>
            </div>
          </div>
        </div>
      </aside>
      <div className="pl-main" style={{ overflow: 'hidden' }}>
        <header className="pl-top" style={{ position: 'static' }}>
          <div>
            <h1>Dashboard</h1>
            <div className="sub">Welcome back, Rahul</div>
          </div>
          <div className="pl-top-r">
            <button className="pl-btn icon" type="button" tabIndex={-1}>
              <Bell size={17} strokeWidth={1.75} />
            </button>
            <button className="pl-btn primary sm" type="button" tabIndex={-1}>
              <Plus size={14} />
              New Proposal
            </button>
          </div>
        </header>
        <div className="pl-content" style={{ padding: 22 }}>
          <div className="pl-g4" style={{ marginBottom: 18 }}>
            <PreviewStat hero label="Earned this month" value="₹1,24,500" icon={IndianRupee} trend="+18%" sub="vs April" />
            <PreviewStat label="Pending" value="₹38,000" icon={Clock} tone="a" sub="3 invoices" />
            <PreviewStat label="Active" value="5" icon={Briefcase} tone="b" sub="2 due soon" />
            <PreviewStat label="Overdue" value="₹22,000" icon={AlertTriangle} tone="r" sub="2 invoices" />
          </div>
          <div className="pl-g21">
            <div className="pl-card" style={{ height: 210 }}>
              <div className="pl-card-h">
                <h3>Revenue</h3>
              </div>
              <div style={{ padding: '16px 22px' }}>
                <MiniArea />
              </div>
            </div>
            <div className="pl-card pad">
              <div className="pl-sect-t">Pipeline</div>
              {(
                [
                  ['Proposals', 80],
                  ['Active', 60],
                  ['Paid', 40],
                ] as const
              ).map(([l, w]) => (
                <div key={l} style={{ marginBottom: 12 }}>
                  <div className="pl-spread" style={{ marginBottom: 5 }}>
                    <span style={{ fontSize: 12.5 }}>{l}</span>
                  </div>
                  <div className="pl-bar">
                    <span style={{ width: `${w}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewStat({
  label,
  value,
  icon: Icon,
  tone = '',
  trend,
  sub,
  hero = false,
}: {
  label: string;
  value: string;
  icon: typeof Home;
  tone?: string;
  trend?: string;
  sub?: string;
  hero?: boolean;
}) {
  return (
    <div className={`pl-stat ${hero ? 'hero' : ''}`}>
      <div className="pl-stat-top">
        <div className="pl-stat-label">{label}</div>
        <div className={`pl-stat-ic ${tone}`}>
          <Icon size={16} strokeWidth={1.9} />
        </div>
      </div>
      <div className="pl-stat-val pl-num" style={{ fontSize: 24 }}>
        {value}
      </div>
      <div className="pl-stat-foot">
        {trend && (
          <span className="pl-trend up">
            <TrendingUp size={13} />
            {trend}
          </span>
        )}
        {sub && <span className="pl-stat-sub">{sub}</span>}
      </div>
    </div>
  );
}

function MiniArea() {
  return (
    <svg viewBox="0 0 520 120" style={{ width: '100%', height: 120 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="plMiniFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#15b886" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#15b886" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,86 C60,80 90,46 150,52 C210,58 240,22 300,30 C360,38 400,60 460,40 L520,30 L520,120 L0,120 Z"
        fill="url(#plMiniFill)"
      />
      <path
        d="M0,86 C60,80 90,46 150,52 C210,58 240,22 300,30 C360,38 400,60 460,40 L520,30"
        fill="none"
        stroke="#0a8f63"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
