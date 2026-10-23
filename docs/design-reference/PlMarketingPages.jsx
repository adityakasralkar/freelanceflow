/* global React, Icon */

// ============================================================================
// MARKETING SUB-PAGES — Workflow, Pricing, Docs (share nav + footer w/ Landing)
// ============================================================================
const SiteNav = ({ active }) => (
  <nav className="pl-nav-bar pl-glass">
    <div className="pl-row" style={{ gap: 11 }}>
      <div className="pl-brand-mark" style={{ width: 30, height: 30, fontSize: 15 }}>F</div>
      <div className="pl-brand-name" style={{ fontSize: 17 }}>Freelance<span>Flow</span></div>
    </div>
    <div className="pl-nav-links">
      {["Features", "Workflow", "Pricing", "Docs"].map((l) => (
        <a key={l} style={active === l ? { background: "rgba(255,255,255,0.85)", color: "var(--pl-emerald-deep)", fontWeight: 650 } : {}}>{l}</a>
      ))}
    </div>
    <div className="pl-row" style={{ gap: 8 }}>
      <button className="pl-btn ghost sm">Log in</button>
      <button className="pl-btn primary sm">Get started<Icon name="arrow_right" size={14} /></button>
    </div>
  </nav>
);

const SiteFooter = () => (
  <footer className="pl-foot">
    <div className="pl-row" style={{ gap: 10 }}>
      <div className="pl-brand-mark" style={{ width: 26, height: 26, fontSize: 13 }}>F</div>
      <span style={{ fontSize: 13, color: "var(--pl-muted)" }}>© 2026 FreelanceFlow — From proposal to payment.</span>
    </div>
    <div className="pl-row" style={{ gap: 18, fontSize: 13, color: "var(--pl-muted)" }}>
      <span>Privacy</span><span>Terms</span><span>Support</span>
    </div>
  </footer>
);

const PageHero = ({ eyebrow, titleStart, cursive, titleEnd, sub }) => (
  <section className="pl-hero" style={{ padding: "72px 28px 24px" }}>
    <div className="pl-eyebrow">
      <span className="pip"><Icon name="sparkles" size={11} /></span>
      {eyebrow}
    </div>
    <h1 className="pl-h1" style={{ fontSize: 54 }}>
      {titleStart} <span className="cur" style={{ fontSize: 64 }}>{cursive}</span>{titleEnd}
    </h1>
    <p className="pl-sub" style={{ fontSize: 16.5, marginTop: 20 }}>{sub}</p>
  </section>
);

// ---------------------------------------------------------------- WORKFLOW
const WorkflowPage = () => {
  const steps = [
    {
      n: "01", ic: "file", t: "Draft the proposal", side: "Freelancer",
      d: "Pick a client, define scope, deliverables, amount, and payment terms. Save as a draft or send straight away — the client gets a magic link, no account needed.",
      vis: (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="pl-spread"><span style={{ fontSize: 13, fontWeight: 650 }}>Website Redesign</span><span className="pl-badge blue">Sent</span></div>
          <div className="pl-bar"><span style={{ width: "30%" }} /></div>
          <div style={{ fontSize: 12, color: "var(--pl-muted)" }}>₹45,000 · Valid until May 30 · 50/50 terms</div>
        </div>
      ),
    },
    {
      n: "02", ic: "check_circle", t: "Client accepts in one click", side: "Client",
      d: "The client reviews scope and terms in their portal and accepts, declines, or requests changes. On accept, FreelanceFlow converts the proposal into a project automatically.",
      vis: (
        <div style={{ display: "flex", gap: 8 }}>
          <button className="pl-btn primary sm" style={{ flex: 1, justifyContent: "center" }}><Icon name="check" size={13} />Accept</button>
          <button className="pl-btn sm" style={{ flex: 1, justifyContent: "center" }}>Request changes</button>
        </div>
      ),
    },
    {
      n: "03", ic: "flag", t: "Track milestones", side: "Freelancer",
      d: "Break the project into milestones with due dates and amounts. Completing a milestone pre-fills an invoice with the right line items, GST, and due date.",
      vis: (
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {[["Discovery", "Paid", "green"], ["Design system", "Paid", "green"], ["Dev Phase 1", "In Progress", "amber"]].map(([t, s, c]) => (
            <div key={t} className="pl-spread" style={{ fontSize: 12.5 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: c === "green" ? "var(--pl-emerald)" : "var(--pl-amber)" }} />{t}
              </span>
              <span className={`pl-badge ${c}`}>{s}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      n: "04", ic: "rupee", t: "Invoice & get paid", side: "Both",
      d: "Send the invoice from the app. The client pays or marks it paid in the portal; your cash-flow dashboard updates the moment money moves — earned, pending, overdue.",
      vis: (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="pl-spread"><span className="pl-mono" style={{ fontSize: 13, fontWeight: 650 }}>INV-008</span><span className="pl-badge green">Paid</span></div>
          <div style={{ fontSize: 22, fontWeight: 760, letterSpacing: "-0.02em" }} className="pl-num">+₹29,500</div>
          <div style={{ fontSize: 11.5, color: "var(--pl-muted)" }}>Cash flow updated · 2 min ago</div>
        </div>
      ),
    },
  ];
  return (
    <div className="pl-root pl-landing" style={{ minHeight: 1460 }}>
      <div className="pl-blob" style={{ width: 400, height: 400, top: -60, right: 100, background: "rgba(21,184,134,0.45)" }} />
      <div className="pl-grid-overlay" />
      <SiteNav active="Workflow" />
      <PageHero
        eyebrow="The pipeline, step by step"
        titleStart="How work" cursive="flows" titleEnd=""
        sub="One state machine from first hello to money in the bank. Each step hands off to the next — nothing falls through the cracks."
      />
      <section className="pl-band" style={{ marginTop: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 980, margin: "0 auto" }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ display: "grid", gridTemplateColumns: i % 2 ? "300px 1fr" : "1fr 300px", gap: 18, alignItems: "stretch" }}>
              <div className="pl-feat" style={{ order: i % 2 ? 2 : 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: 28 }}>
                <div className="pl-row" style={{ gap: 12, marginBottom: 12 }}>
                  <div className="ic" style={{ margin: 0 }}><Icon name={s.ic} size={20} stroke={1.9} /></div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "var(--pl-faint)", letterSpacing: "0.1em" }}>STEP {s.n}</span>
                  <span className="pl-badge gray" style={{ marginLeft: "auto" }}>{s.side}</span>
                </div>
                <h4 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 750, letterSpacing: "-0.02em" }}>{s.t}</h4>
                <p style={{ margin: 0, fontSize: 14, color: "var(--pl-muted)", lineHeight: 1.65 }}>{s.d}</p>
              </div>
              <div className="pl-card pad" style={{ order: i % 2 ? 1 : 2, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                {s.vis}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="pl-finale" style={{ marginTop: 64 }}>
        <div className="pl-finale-card" style={{ padding: "44px 48px" }}>
          <h2 style={{ fontSize: 32 }}>See it in <span className="cur">action</span></h2>
          <div className="pl-cta-row" style={{ marginTop: 22 }}>
            <button className="pl-btn lg" style={{ background: "#fff", color: "var(--pl-emerald-deep)", border: "none" }}>Start free<Icon name="arrow_right" size={16} /></button>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
};

// ---------------------------------------------------------------- PRICING
const PricingPage = () => {
  const tiers = [
    {
      name: "Starter", price: "₹0", per: "forever", hot: false,
      desc: "For your first clients.",
      feats: ["3 active clients", "Unlimited proposals", "Milestone tracking", "5 invoices / month", "Client portal access"],
      cta: "Start free",
    },
    {
      name: "Pro", price: "₹499", per: "per month", hot: true,
      desc: "For a growing practice.",
      feats: ["Unlimited clients", "Unlimited invoices", "Cash-flow dashboard", "Payment reminders", "GST-compliant invoices", "Custom invoice branding"],
      cta: "Start 14-day trial",
    },
    {
      name: "Studio", price: "₹1,299", per: "per month", hot: false,
      desc: "For small teams.",
      feats: ["Everything in Pro", "3 team seats", "Roles & permissions", "Priority support", "CSV / API export"],
      cta: "Contact us",
    },
  ];
  const faqs = [
    ["Can clients use it for free?", "Yes — clients never pay. They get portal access through your plan, on any tier."],
    ["What happens after the trial?", "You drop to Starter automatically. Nothing is deleted; limits just apply again."],
    ["Do you support GST invoices?", "Pro and Studio generate GST-compliant invoices with your GSTIN, HSN/SAC and tax breakup."],
    ["Can I cancel anytime?", "Yes. Cancel in one click from Settings — you keep Pro until the end of the billing period."],
  ];
  return (
    <div className="pl-root pl-landing" style={{ minHeight: 1400 }}>
      <div className="pl-blob" style={{ width: 400, height: 400, top: -60, left: 120, background: "rgba(37,99,235,0.25)" }} />
      <div className="pl-blob" style={{ width: 380, height: 380, top: 300, right: -60, background: "rgba(21,184,134,0.4)" }} />
      <div className="pl-grid-overlay" />
      <SiteNav active="Pricing" />
      <PageHero
        eyebrow="Simple, honest pricing"
        titleStart="Pay when it" cursive="pays off" titleEnd=""
        sub="Free until FreelanceFlow is clearly earning its keep. No credit card to start, no surprises later."
      />
      <section className="pl-band" style={{ marginTop: 24 }}>
        <div className="pl-g3" style={{ alignItems: "stretch" }}>
          {tiers.map((t) => (
            <div key={t.name} className="pl-feat" style={t.hot ? {
              border: "2px solid var(--pl-emerald)", boxShadow: "var(--pl-sh-emerald)", position: "relative", background: "rgba(255,255,255,0.9)",
            } : { position: "relative" }}>
              {t.hot && (
                <span className="pl-badge green" style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--pl-emerald)", color: "#fff" }}>Most popular</span>
              )}
              <div style={{ fontSize: 14, fontWeight: 750 }}>{t.name}</div>
              <div style={{ fontSize: 12.5, color: "var(--pl-muted)", marginTop: 2 }}>{t.desc}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 7, margin: "16px 0 4px" }}>
                <span className="pl-num" style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em" }}>{t.price}</span>
                <span style={{ fontSize: 12.5, color: "var(--pl-faint)" }}>{t.per}</span>
              </div>
              <button className={`pl-btn ${t.hot ? "primary" : ""}`} style={{ width: "100%", justifyContent: "center", margin: "14px 0 18px" }}>{t.cta}</button>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {t.feats.map((f) => (
                  <div key={f} style={{ display: "flex", gap: 9, alignItems: "center", fontSize: 13 }}>
                    <Icon name="check_circle" size={15} style={{ color: "var(--pl-emerald)", flexShrink: 0 }} />
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
          <h2 style={{ fontSize: 30 }}>Questions, <span className="cur">answered</span></h2>
        </div>
        <div className="pl-g2">
          {faqs.map(([q, a]) => (
            <div key={q} className="pl-feat" style={{ padding: 22 }}>
              <h4 style={{ fontSize: 14.5, margin: "0 0 6px" }}>{q}</h4>
              <p style={{ margin: 0, fontSize: 13.5 }}>{a}</p>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
};

// ---------------------------------------------------------------- DOCS
const DocsPage = () => {
  const nav = [
    { g: "Getting started", items: [["Introduction", true], ["Quick start", false], ["Adding clients", false]] },
    { g: "Core concepts", items: [["Proposals", false], ["Projects & milestones", false], ["Invoices & GST", false], ["Cash flow", false]] },
    { g: "Client portal", items: [["Inviting clients", false], ["Permissions", false]] },
    { g: "API", items: [["Authentication", false], ["Endpoints", false], ["Webhooks", false]] },
  ];
  return (
    <div className="pl-root pl-landing" style={{ minHeight: 1180 }}>
      <div className="pl-blob" style={{ width: 360, height: 360, top: -80, right: 200, background: "rgba(21,184,134,0.35)" }} />
      <div className="pl-grid-overlay" />
      <SiteNav active="Docs" />
      <div style={{ position: "relative", zIndex: 4, maxWidth: 1180, margin: "40px auto 0", padding: "0 28px", display: "grid", gridTemplateColumns: "230px 1fr 180px", gap: 28 }}>
        {/* left nav */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <input className="pl-search" placeholder="Search docs…" style={{ width: "100%" }} readOnly />
          {nav.map((g) => (
            <div key={g.g}>
              <div style={{ fontSize: 10.5, fontWeight: 750, color: "var(--pl-faint)", letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 7 }}>{g.g}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {g.items.map(([l, on]) => (
                  <div key={l} style={{
                    padding: "6px 10px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                    background: on ? "var(--pl-emerald-soft)" : "transparent",
                    color: on ? "var(--pl-emerald-deep)" : "var(--pl-muted)",
                    fontWeight: on ? 650 : 500,
                  }}>{l}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* article */}
        <article className="pl-card" style={{ padding: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 750, color: "var(--pl-emerald)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Getting started</div>
          <h1 style={{ margin: "0 0 12px", fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em" }}>Introduction</h1>
          <p style={{ margin: "0 0 20px", fontSize: 15, color: "var(--pl-muted)", lineHeight: 1.7 }}>
            FreelanceFlow is a freelance business workspace built around one pipeline: <b style={{ color: "var(--pl-text)" }}>proposal → project → milestone → invoice → payment</b>. This guide takes you from an empty account to your first paid invoice in about ten minutes.
          </p>
          <div className="pl-divider" style={{ margin: "22px 0" }} />
          <h3 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 750, letterSpacing: "-0.01em" }}>The pipeline</h3>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--pl-muted)", lineHeight: 1.7 }}>
            Every object in FreelanceFlow belongs to one of five states. Understanding them explains almost everything else in the product:
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
            {[["Draft", "gray"], ["Sent", "blue"], ["Accepted", "green"], ["Invoiced", "purple"], ["Paid", "green"]].map(([s, c]) => (
              <span key={s} className={`pl-badge ${c}`}>{s}</span>
            ))}
          </div>
          <h3 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 750, letterSpacing: "-0.01em" }}>Quick start</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 22 }}>
            {[
              ["Add a client", "Clients → Add client. Name and email are enough."],
              ["Create a proposal", "Proposals → New. Scope, deliverables, amount, terms."],
              ["Send it", "The client gets a magic-link email — no signup needed."],
              ["Convert on accept", "An accepted proposal becomes a project in one click."],
            ].map(([t, d], i) => (
              <div key={t} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
                <div style={{ width: 24, height: 24, borderRadius: 8, background: "var(--pl-emerald-soft)", color: "var(--pl-emerald-deep)", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 750, flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 650 }}>{t}</div>
                  <div style={{ fontSize: 13, color: "var(--pl-muted)", marginTop: 2 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "#101c17", borderRadius: 12, padding: "16px 18px", fontFamily: "JetBrains Mono, monospace", fontSize: 12.5, color: "#b9f5dc", lineHeight: 1.8 }}>
            <span style={{ color: "#6ea08c" }}># Create a proposal via the API</span><br />
            POST /api/proposals<br />
            {"{"} "client_id": 12, "title": "Website Redesign", "amount": 45000 {"}"}
          </div>
        </article>

        {/* on this page */}
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 750, color: "var(--pl-faint)", letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 8 }}>On this page</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 12.5, borderLeft: "2px solid var(--pl-line)", paddingLeft: 12 }}>
            <span style={{ color: "var(--pl-emerald-deep)", fontWeight: 650 }}>Introduction</span>
            <span style={{ color: "var(--pl-muted)" }}>The pipeline</span>
            <span style={{ color: "var(--pl-muted)" }}>Quick start</span>
            <span style={{ color: "var(--pl-muted)" }}>API example</span>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

window.WorkflowPage = WorkflowPage;
window.PricingPage = PricingPage;
window.DocsPage = DocsPage;
