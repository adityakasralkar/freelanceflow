/* global React, Icon, Sidebar, Topbar, Stat, Badge */

const DesignSystem = () => (
  <div style={{ width: 1280, padding: 48, background: "var(--panel)", borderRadius: 12, border: "1px solid var(--line)", fontFamily: "Inter, sans-serif" }}>
    <div style={{ marginBottom: 40 }}>
      <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>02 — Foundations</div>
      <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em", margin: "8px 0 4px" }}>Design System</h1>
      <p style={{ color: "var(--muted)", margin: 0, fontSize: 14 }}>The visual vocabulary that ties the freelancer and client portals together.</p>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, marginBottom: 48, paddingBottom: 40, borderBottom: "1px solid var(--line)" }}>
      <div><div style={{ fontSize: 13, fontWeight: 700 }}>Color tokens</div><div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Light SaaS palette with restrained green accent.</div></div>
      <div>
        <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 12 }}>Surfaces</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
          {[["#F6F7F9", "App bg"], ["#FFFFFF", "Surface"], ["#F8FAFC", "Soft"], ["#e5ebe8", "Border"], ["#d2dbd6", "Strong"]].map(([h, n]) => (
            <div key={n}><div style={{ height: 72, background: h, borderRadius: 8, border: "1px solid var(--line)" }} /><div style={{ fontSize: 12, fontWeight: 600, marginTop: 8 }}>{n}</div><div style={{ fontSize: 11, color: "var(--muted)" }} className="mono">{h}</div></div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 12 }}>Brand & status</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {[["#0a8f63", "Primary"], ["#2563EB", "Info"], ["#D97706", "Warning"], ["#DC2626", "Danger"], ["#7C3AED", "Invoiced"]].map(([h, n]) => (
            <div key={n}><div style={{ height: 72, background: h, borderRadius: 8 }} /><div style={{ fontSize: 12, fontWeight: 600, marginTop: 8 }}>{n}</div><div style={{ fontSize: 11, color: "var(--muted)" }} className="mono">{h}</div></div>
          ))}
        </div>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, marginBottom: 48, paddingBottom: 40, borderBottom: "1px solid var(--line)" }}>
      <div><div style={{ fontSize: 13, fontWeight: 700 }}>Typography</div><div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Inter for UI, JetBrains Mono for IDs and amounts.</div></div>
      <div className="ff-stack">
        {[
          { s: 30, w: 700, l: "Display", ex: "FreelanceFlow" },
          { s: 22, w: 700, l: "Page title", ex: "Cash Flow Dashboard" },
          { s: 16, w: 700, l: "Section / card title", ex: "Monthly revenue" },
          { s: 14, w: 500, l: "Body", ex: "Track milestones and generate invoices automatically." },
          { s: 12, w: 500, l: "Caption", ex: "3 of 5 milestones complete" },
          { s: 13, w: 600, l: "Mono — IDs and amounts", ex: "INV-008  ·  ₹29,500", mono: true },
        ].map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "180px 1fr 100px", gap: 20, alignItems: "center", padding: "12px 0", borderTop: i ? "1px solid var(--line)" : "none" }}>
            <div><div style={{ fontSize: 12, fontWeight: 600 }}>{r.l}</div><div style={{ fontSize: 11, color: "var(--muted)" }}>{r.s}px / {r.w}</div></div>
            <div style={{ fontSize: r.s, fontWeight: r.w, fontFamily: r.mono ? "JetBrains Mono, monospace" : "Inter" }}>{r.ex}</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }} className="mono">{r.mono ? "JB Mono" : "Inter"}</div>
          </div>
        ))}
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, marginBottom: 48, paddingBottom: 40, borderBottom: "1px solid var(--line)" }}>
      <div><div style={{ fontSize: 13, fontWeight: 700 }}>Status badges</div><div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>The state machine, made visible.</div></div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {["Draft", "Sent", "Accepted", "In Progress", "Completed", "Invoiced", "Paid", "Overdue", "Declined"].map((s) => <Badge key={s} status={s} />)}
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, marginBottom: 48, paddingBottom: 40, borderBottom: "1px solid var(--line)" }}>
      <div><div style={{ fontSize: 13, fontWeight: 700 }}>Controls</div><div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Buttons, inputs, tabs.</div></div>
      <div className="ff-stack">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="ff-btn primary"><Icon name="plus" size={14} />Primary</button>
          <button className="ff-btn">Secondary</button>
          <button className="ff-btn ghost">Ghost</button>
          <button className="ff-btn danger">Destructive</button>
          <button className="ff-btn icon"><Icon name="more" size={14} /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <input className="ff-input" placeholder="Default input" />
          <input className="ff-input search" placeholder="Search..." />
          <select className="ff-select"><option>Select option</option></select>
        </div>
        <div className="ff-pill-tabs" style={{ alignSelf: "flex-start" }}>
          <span className="ff-pill-tab active">Active</span>
          <span className="ff-pill-tab">Pending</span>
          <span className="ff-pill-tab">Completed</span>
        </div>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32 }}>
      <div><div style={{ fontSize: 13, fontWeight: 700 }}>Spacing & radius</div><div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>8px rhythm. Soft 8px corners.</div></div>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
        {[4, 8, 12, 16, 20, 24, 32].map((n) => (
          <div key={n} style={{ textAlign: "center" }}>
            <div style={{ width: n * 2, height: n * 2, background: "var(--green-soft)", borderRadius: 4, marginBottom: 6 }} />
            <div style={{ fontSize: 11, fontWeight: 600 }}>{n}</div>
          </div>
        ))}
        <div style={{ marginLeft: 32, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 56, height: 56, background: "var(--green-soft)", borderRadius: 8 }} />
          <div style={{ width: 56, height: 56, background: "var(--green-soft)", borderRadius: 12 }} />
          <div style={{ width: 56, height: 56, background: "var(--green-soft)", borderRadius: 999 }} />
        </div>
      </div>
    </div>
  </div>
);

const Cover = () => (
  <div style={{ width: 1280, height: 720, background: "linear-gradient(160deg, #f7faf8 0%, #e8f6f0 100%)", borderRadius: 12, border: "1px solid var(--line)", padding: 64, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden", fontFamily: "Inter, sans-serif" }}>
    <div style={{ position: "absolute", top: -120, right: -120, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(15,159,114,0.18), transparent 70%)" }} />
    <div style={{ position: "absolute", bottom: -160, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.10), transparent 70%)" }} />
    <div style={{ position: "relative", zIndex: 2 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 14px", background: "rgba(255,255,255,0.6)", border: "1px solid var(--line)", borderRadius: 999, fontSize: 12, fontWeight: 600, color: "var(--muted)", backdropFilter: "blur(10px)" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }} />
        FSAD Assignment 2026 · Full Product Design
      </div>
    </div>
    <div style={{ position: "relative", zIndex: 2 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
        <div style={{ width: 56, height: 56, background: "var(--green)", borderRadius: 14, display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, fontSize: 26 }}>F</div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>FreelanceFlow<span style={{ color: "var(--green)" }}>.</span></div>
      </div>
      <h1 style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, margin: "0 0 20px", maxWidth: 900 }}>From proposal<br />to payment, in one workspace.</h1>
      <p style={{ fontSize: 17, color: "var(--muted)", maxWidth: 640, lineHeight: 1.55, margin: 0 }}>A complete UI design for a freelance business management SaaS — covering 20 screens across freelancer and client portals, plus a unified design system.</p>
    </div>
    <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
      <div style={{ display: "flex", gap: 32 }}>
        {[["20", "Screens"], ["3", "Core flows"], ["2", "User roles"], ["1", "Design system"]].map(([n, l]) => (
          <div key={l}><div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em" }}>{n}</div><div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{l}</div></div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "right" }}><div style={{ fontWeight: 600, color: "var(--text)" }}>v1.0 · May 2026</div><div>Light theme · Inter · 8px grid</div></div>
    </div>
  </div>
);

const FlowMap = () => {
  const Step = ({ icon, t, s, c }) => (
    <div style={{ flex: 1, padding: 16, background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 8, minWidth: 0 }}>
      <div className={`ff-stat-icon ${c}`} style={{ marginBottom: 10 }}><Icon name={icon} size={14} /></div>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{t}</div>
      <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>{s}</div>
    </div>
  );
  const Arrow = () => <Icon name="arrow_right" size={16} style={{ color: "var(--faint)", flexShrink: 0 }} />;

  return (
    <div style={{ width: 1280, padding: 48, background: "var(--panel)", borderRadius: 12, border: "1px solid var(--line)", fontFamily: "Inter, sans-serif" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>06 — Prototype Map</div>
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em", margin: "8px 0 4px" }}>End-to-end flow</h1>
        <p style={{ color: "var(--muted)", margin: 0, fontSize: 14 }}>The proposal-to-payment lifecycle, with handoffs between freelancer and client portals.</p>
      </div>

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 12 }}>Freelancer flow</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Step icon="lock" t="Sign in" s="Freelancer login" c="" />
          <Arrow />
          <Step icon="file" t="Create proposal" s="Scope, deliverables, terms" c="blue" />
          <Arrow />
          <Step icon="send" t="Send to client" s="Status → Sent" c="blue" />
          <Arrow />
          <Step icon="folder" t="Convert to project" s="Auto-creates milestones" c="green" />
          <Arrow />
          <Step icon="check_circle" t="Complete milestone" s="Triggers invoice" c="green" />
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 12 }}>Client flow</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Step icon="lock" t="Client login" s="Separate portal" c="" />
          <Arrow />
          <Step icon="eye" t="Review proposal" s="Read-only summary" c="blue" />
          <Arrow />
          <Step icon="check" t="Accept" s="Status → Accepted" c="green" />
          <Arrow />
          <Step icon="activity" t="Track project" s="Milestones, progress" c="amber" />
          <Arrow />
          <Step icon="receipt" t="Pay invoice" s="Mark as paid" c="purple" />
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 12 }}>System updates</div>
        <div style={{ padding: 20, background: "var(--green-soft)", border: "1px solid #bfe8d6", borderRadius: 8, display: "flex", alignItems: "center", gap: 16 }}>
          <Icon name="trending_up" size={20} style={{ color: "var(--green-dark)" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--green-dark)" }}>Cash flow dashboard updates in real time</div>
            <div style={{ fontSize: 12, color: "var(--green-dark)", opacity: 0.8, marginTop: 2 }}>Paid invoices roll into monthly revenue, aging buckets, and income-by-client charts.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileFreelancer = () => (
  <div className="ff-phone">
    <div className="ff-phone-screen">
      <div className="ff-phone-statusbar"><span>9:41</span><div style={{ display: "flex", gap: 4, alignItems: "center" }}><div style={{ width: 16, height: 8, border: "1px solid #000", borderRadius: 2 }}><div style={{ width: "70%", height: "100%", background: "#000" }} /></div></div></div>
      <div style={{ padding: "8px 18px 12px", borderBottom: "1px solid var(--line)" }}>
        <div className="ff-spread">
          <div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>Tuesday, May 12</div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>Hi, Rahul</div>
          </div>
          <div className="ff-avatar" style={{ width: 32, height: 32, fontSize: 11 }}>RM</div>
        </div>
      </div>
      <div className="ff-phone-content">
        <div style={{ background: "var(--green)", color: "#fff", padding: 16, borderRadius: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 4 }}>Earned this month</div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.01em" }}>₹1,24,500</div>
          <div style={{ fontSize: 11, opacity: 0.85, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}><Icon name="trending_up" size={11} />+18% vs April</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          <div style={{ padding: 12, background: "var(--panel-soft)", borderRadius: 10 }}><div style={{ fontSize: 10, color: "var(--muted)" }}>Pending</div><div style={{ fontSize: 16, fontWeight: 700 }}>₹38k</div></div>
          <div style={{ padding: 12, background: "var(--panel-soft)", borderRadius: 10 }}><div style={{ fontSize: 10, color: "var(--muted)" }}>Overdue</div><div style={{ fontSize: 16, fontWeight: 700, color: "var(--red)" }}>₹22k</div></div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Recent</div>
        <div className="ff-stack sm">
          {[
            { i: "check_circle", t: "INV-007 paid", s: "Acme Corp · ₹18k", c: "green" },
            { i: "flag", t: "Milestone done", s: "TechNova · 5h ago", c: "blue" },
            { i: "send", t: "INV-008 sent", s: "TechNova · ₹29.5k", c: "purple" },
          ].map((a, i) => (
            <div key={i} style={{ padding: 10, border: "1px solid var(--line)", borderRadius: 10, display: "flex", gap: 10, alignItems: "center" }}>
              <div className={`ff-stat-icon ${a.c}`} style={{ width: 26, height: 26 }}><Icon name={a.i} size={12} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{a.t}</div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>{a.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 60, borderTop: "1px solid var(--line)", display: "flex", padding: "8px 0", background: "var(--panel)" }}>
        {[["home", "Home", true], ["file", "Proposals"], ["receipt", "Invoices"], ["user", "More"]].map(([i, l, a], k) => (
          <div key={k} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: a ? "var(--green-dark)" : "var(--muted)" }}>
            <Icon name={i} size={18} />
            <span style={{ fontSize: 10, fontWeight: a ? 700 : 500 }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MobileClient = () => (
  <div className="ff-phone">
    <div className="ff-phone-screen">
      <div className="ff-phone-statusbar"><span>9:41</span><div style={{ width: 16, height: 8, border: "1px solid #000", borderRadius: 2 }}><div style={{ width: "70%", height: "100%", background: "#000" }} /></div></div>
      <div style={{ padding: "8px 18px 12px", borderBottom: "1px solid var(--line)" }}>
        <div className="ff-spread">
          <div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>Client Portal</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>My Projects</div>
          </div>
          <div className="ff-avatar alt" style={{ width: 32, height: 32, fontSize: 11 }}>PS</div>
        </div>
      </div>
      <div className="ff-phone-content">
        <div className="ff-stack sm">
          {[
            { t: "Website Redesign", s: "In Progress", p: 60, m: "3 of 5 · Due Jun 02" },
            { t: "Brand Refresh", s: "In Progress", p: 35, m: "1 of 3 · Due Jun 14" },
            { t: "Dashboard Analytics", s: "Completed", p: 100, m: "Delivered Apr 12" },
          ].map((p, i) => (
            <div key={i} style={{ padding: 14, border: "1px solid var(--line)", borderRadius: 12 }}>
              <div className="ff-spread" style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{p.t}</div>
                <Badge status={p.s} />
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>{p.m}</div>
              <div className={`ff-bar ${p.s === "Completed" ? "" : "amber"}`}><span style={{ width: `${p.p}%` }} /></div>
            </div>
          ))}
          <div style={{ padding: 14, background: "var(--blue-soft)", borderRadius: 12, marginTop: 8 }}>
            <div style={{ fontSize: 11, color: "var(--blue)", fontWeight: 700, marginBottom: 4 }}>INVOICE DUE</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>INV-008 · ₹29,500</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Due May 23 · 11 days</div>
            <button className="ff-btn primary sm" style={{ marginTop: 10, width: "100%", justifyContent: "center", background: "var(--blue)", borderColor: "var(--blue)" }}>Pay now</button>
          </div>
        </div>
      </div>
      <div style={{ height: 60, borderTop: "1px solid var(--line)", display: "flex", padding: "8px 0", background: "var(--panel)" }}>
        {[["folder", "Projects", true], ["receipt", "Invoices"], ["user", "Profile"]].map(([i, l, a], k) => (
          <div key={k} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: a ? "var(--blue)" : "var(--muted)" }}>
            <Icon name={i} size={18} />
            <span style={{ fontSize: 10, fontWeight: a ? 700 : 500 }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

window.DesignSystem = DesignSystem;
window.Cover = Cover;
window.FlowMap = FlowMap;
window.MobileFreelancer = MobileFreelancer;
window.MobileClient = MobileClient;
