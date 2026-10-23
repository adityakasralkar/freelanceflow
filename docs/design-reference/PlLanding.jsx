/* global React, Icon, PlSidebar, PlTop, PlStat, PlBadge */

// ============================================================================
// LANDING PAGE — glassmorphism, cursive accent word, login/signup CTAs
// ============================================================================
const Landing = () => (
  <div className="pl-root pl-landing">
    {/* ambient blobs */}
    <div className="pl-blob" style={{ width: 420, height: 420, top: -80, right: 120, background: "rgba(21,184,134,0.5)" }} />
    <div className="pl-blob" style={{ width: 340, height: 340, top: 260, left: -60, background: "rgba(37,99,235,0.28)" }} />
    <div className="pl-grid-overlay" />

    {/* glass nav */}
    <nav className="pl-nav-bar pl-glass">
      <div className="pl-row" style={{ gap: 11 }}>
        <div className="pl-brand-mark" style={{ width: 30, height: 30, fontSize: 15 }}>F</div>
        <div className="pl-brand-name" style={{ fontSize: 17 }}>Freelance<span>Flow</span></div>
      </div>
      <div className="pl-nav-links">
        <a>Features</a><a>Workflow</a><a>Pricing</a><a>Docs</a>
      </div>
      <div className="pl-row" style={{ gap: 8 }}>
        <button className="pl-btn ghost sm">Log in</button>
        <button className="pl-btn primary sm">Get started<Icon name="arrow_right" size={14} /></button>
      </div>
    </nav>

    {/* hero */}
    <section className="pl-hero">
      <div className="pl-eyebrow">
        <span className="pip"><Icon name="sparkles" size={11} /></span>
        From proposal to payment — one calm workspace
      </div>
      <h1 className="pl-h1">
        Run your freelance<br />business, <span className="cur" style={{ zIndex: 99 }}>effortlessly</span>
      </h1>
      <p className="pl-sub">
        FreelanceFlow turns scattered proposals, milestones, and invoices into one
        clean pipeline — so you always know what's owed, what's next, and what's paid.
      </p>
      <div className="pl-cta-row">
        <button className="pl-btn primary lg">Start free<Icon name="arrow_right" size={16} /></button>
        <button className="pl-btn lg">Sign in<Icon name="log_out" size={15} /></button>
      </div>
      <div className="pl-trustline">No credit card · Free for your first 3 clients · Cancel anytime</div>
    </section>

    {/* app preview framed in glass + floating glass cards */}
    <div className="pl-preview-wrap">
      <div className="pl-float pl-glass" style={{ top: -18, left: 70 }}>
        <div className="ic" style={{ background: "var(--pl-emerald-soft)", color: "var(--pl-emerald-deep)" }}><Icon name="check_circle" size={18} /></div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700 }}>Invoice paid</div>
          <div style={{ fontSize: 11, color: "var(--pl-muted)" }}>+₹29,500 · TechNova</div>
        </div>
      </div>
      <div className="pl-float pl-glass" style={{ top: 120, right: 56 }}>
        <div className="ic" style={{ background: "var(--pl-blue-soft)", color: "var(--pl-blue)" }}><Icon name="flag" size={18} /></div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700 }}>Milestone complete</div>
          <div style={{ fontSize: 11, color: "var(--pl-muted)" }}>Design system · 60%</div>
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
        <h2>Everything in <span className="cur">flow</span></h2>
        <p>Three connected surfaces replace the spreadsheet, the email thread, and the sticky note.</p>
      </div>
      <div className="pl-g3">
        {[
          { ic: "file", h: "Proposal pipeline", p: "Draft, send, and track proposals. Clients accept in one click and a project is created automatically." },
          { ic: "folder", h: "Milestone tracking", p: "Break work into milestones. Mark one complete and a pre-filled invoice is ready to send." },
          { ic: "trending_up", h: "Cash-flow clarity", p: "Earned, pending, and overdue at a glance — with revenue trends and invoice aging." },
        ].map((f) => (
          <div key={f.h} className="pl-feat">
            <div className="ic"><Icon name={f.ic} size={20} stroke={1.9} /></div>
            <h4>{f.h}</h4>
            <p>{f.p}</p>
          </div>
        ))}
      </div>
    </section>

    {/* workflow steps */}
    <section className="pl-steps">
      <div className="pl-band-h">
        <h2>From hello to <span className="cur">paid</span></h2>
        <p>The whole client lifecycle, without leaving the app.</p>
      </div>
      <div className="pl-g4">
        {[
          { n: "01", ic: "file", t: "Send proposal", d: "Scope, deliverables, terms." },
          { n: "02", ic: "check_circle", t: "Client accepts", d: "Auto-converts to a project." },
          { n: "03", ic: "flag", t: "Hit milestones", d: "Invoice generated on completion." },
          { n: "04", ic: "rupee", t: "Get paid", d: "Cash flow updates in real time." },
        ].map((s, i) => (
          <div key={s.n} className="pl-feat" style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: 18, right: 20, fontSize: 12, fontWeight: 800, color: "var(--pl-faint)", letterSpacing: "0.08em" }}>{s.n}</div>
            <div className="ic"><Icon name={s.ic} size={20} stroke={1.9} /></div>
            <h4>{s.t}</h4>
            <p>{s.d}</p>
            {i < 3 && <div style={{ position: "absolute", right: -13, top: "50%", color: "var(--pl-faint)", zIndex: 2 }}><Icon name="chevron_right" size={18} /></div>}
          </div>
        ))}
      </div>
    </section>

    {/* finale CTA */}
    <section className="pl-finale">
      <div className="pl-finale-card">
        <div className="pl-blob" style={{ width: 300, height: 300, bottom: -120, left: 80, background: "rgba(21,184,134,0.5)" }} />
        <h2>Get organized, <span className="cur">today</span></h2>
        <p>Join freelancers who stopped chasing payments and started seeing their whole business in one place.</p>
        <div className="pl-cta-row" style={{ marginTop: 28 }}>
          <button className="pl-btn lg" style={{ background: "#fff", color: "var(--pl-emerald-deep)", border: "none" }}>Create free account<Icon name="arrow_right" size={16} /></button>
          <button className="pl-btn lg" style={{ background: "rgba(255,255,255,0.16)", color: "#fff", border: "1px solid rgba(255,255,255,0.4)", boxShadow: "none" }}>Sign in</button>
        </div>
      </div>
    </section>

    {/* footer */}
    <footer className="pl-foot">
      <div className="pl-row" style={{ gap: 10 }}>
        <div className="pl-brand-mark" style={{ width: 26, height: 26, fontSize: 13 }}>F</div>
        <span style={{ fontSize: 13, color: "var(--pl-muted)" }}>© 2026 FreelanceFlow — From proposal to payment.</span>
      </div>
      <div className="pl-row" style={{ gap: 18, fontSize: 13, color: "var(--pl-muted)" }}>
        <span>Privacy</span><span>Terms</span><span>Support</span>
      </div>
    </footer>
  </div>
);

// Compact dashboard used inside the hero glass frame
const PreviewDashboard = () => (
  <div className="pl-app" style={{ width: "100%", height: 520, borderRadius: 0, border: "none" }}>
    <PlSidebar active="dashboard" />
    <div className="pl-main">
      <PlTop title="Dashboard" sub="Welcome back, Rahul" actions={<button className="pl-btn primary sm"><Icon name="plus" size={14} />New Proposal</button>} />
      <div className="pl-content" style={{ padding: 22 }}>
        <div className="pl-g4" style={{ marginBottom: 18 }}>
          <PlStat hero label="Earned this month" value="₹1,24,500" ic="rupee" trend="+18%" sub="vs April" />
          <PlStat label="Pending" value="₹38,000" ic="clock" tone="a" sub="3 invoices" />
          <PlStat label="Active" value="5" ic="briefcase" tone="b" sub="2 due soon" />
          <PlStat label="Overdue" value="₹22,000" ic="alert" tone="r" sub="2 invoices" />
        </div>
        <div className="pl-g21">
          <div className="pl-card" style={{ height: 210 }}>
            <div className="pl-card-h"><h3>Revenue</h3></div>
            <div style={{ padding: "16px 22px" }}>
              <MiniArea />
            </div>
          </div>
          <div className="pl-card pad">
            <div className="pl-sect-t">Pipeline</div>
            {[["Proposals", 80, ""], ["Active", 60, ""], ["Paid", 40, ""]].map(([l, w]) => (
              <div key={l} style={{ marginBottom: 12 }}>
                <div className="pl-spread" style={{ marginBottom: 5 }}><span style={{ fontSize: 12.5 }}>{l}</span></div>
                <div className="pl-bar"><span style={{ width: `${w}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MiniArea = () => (
  <svg viewBox="0 0 520 120" style={{ width: "100%", height: 120 }} preserveAspectRatio="none">
    <defs>
      <linearGradient id="plMiniFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#15b886" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#15b886" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M0,86 C60,80 90,46 150,52 C210,58 240,22 300,30 C360,38 400,60 460,40 L520,30 L520,120 L0,120 Z" fill="url(#plMiniFill)" />
    <path d="M0,86 C60,80 90,46 150,52 C210,58 240,22 300,30 C360,38 400,60 460,40 L520,30" fill="none" stroke="#0a8f63" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

window.Landing = Landing;
