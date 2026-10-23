/* global React, Icon, PlBadge */

// ============================================================================
// POLISHED LOGIN
// ============================================================================
const PlLogin = () => (
  <div className="pl-root">
    <div className="pl-auth">
      <div className="pl-auth-aside">
        <div className="pl-blob" style={{ width: 320, height: 320, bottom: -100, left: -60, background: "rgba(21,184,134,0.5)", filter: "blur(60px)", position: "absolute", borderRadius: "50%" }} />
        <div className="pl-row" style={{ gap: 11, position: "relative" }}>
          <div className="pl-brand-mark" style={{ width: 34, height: 34, fontSize: 17, boxShadow: "none" }}>F</div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" }}>FreelanceFlow</div>
        </div>
        <div style={{ position: "relative" }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1.12 }}>
            From proposal to payment, <span className="pl-cursive" style={{ fontSize: 42, color: "#b9f5dc" }}>effortlessly</span>.
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.82)", lineHeight: 1.65, margin: 0, maxWidth: 400 }}>
            One calm workspace for proposals, milestones, invoices, and cash flow.
          </p>
          <div style={{ display: "grid", gap: 13, marginTop: 30 }}>
            {[["file", "Proposal pipeline"], ["flag", "Milestone tracking"], ["trending_up", "Real-time cash flow"]].map(([ic, t]) => (
              <div key={t} className="pl-row" style={{ gap: 12, fontSize: 14, fontWeight: 500 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(255,255,255,0.16)", display: "grid", placeItems: "center" }}>
                  <Icon name={ic} size={15} />
                </div>{t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", position: "relative" }}>© 2026 FreelanceFlow</div>
      </div>

      <div className="pl-auth-form">
        <div style={{ maxWidth: 380, width: "100%", margin: "0 auto" }}>
          <h2 style={{ fontSize: 26, fontWeight: 780, letterSpacing: "-0.02em", margin: "0 0 6px" }}>Welcome back</h2>
          <p style={{ fontSize: 14, color: "var(--pl-muted)", margin: "0 0 30px" }}>Sign in to your freelancer workspace</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="pl-field"><label>Email</label><input className="pl-input" defaultValue="rahul@freelanceflow.app" /></div>
            <div className="pl-field">
              <div className="pl-spread"><label>Password</label><span className="pl-link" style={{ fontSize: 12.5 }}>Forgot?</span></div>
              <input className="pl-input" type="password" defaultValue="••••••••••" />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: "var(--pl-muted)" }}>
              <input type="checkbox" defaultChecked /> Keep me signed in
            </label>
            <button className="pl-btn primary lg" style={{ justifyContent: "center" }}>Sign in<Icon name="arrow_right" size={16} /></button>
            <div style={{ position: "relative", textAlign: "center", margin: "10px 0" }}>
              <div className="pl-divider" />
              <span style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", background: "#fff", padding: "0 12px", fontSize: 11.5, color: "var(--pl-faint)" }}>OR</span>
            </div>
            <button className="pl-btn lg" style={{ justifyContent: "center" }}><Icon name="user" size={15} />Continue as Client</button>
            <p style={{ textAlign: "center", fontSize: 13.5, color: "var(--pl-muted)", margin: "8px 0 0" }}>
              New here? <span className="pl-link">Create an account</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// IDENTITY / TOKENS PANEL — documents the evolved system
// ============================================================================
const PlTokens = () => (
  <div className="pl-root" style={{ width: 1440, padding: 56, background: "var(--pl-bg)" }}>
    <div style={{ marginBottom: 36 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--pl-faint)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Polished direction · Foundations</div>
      <h1 style={{ margin: "8px 0 6px", fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em" }}>
        Evolved identity — <span className="pl-cursive" style={{ fontSize: 40, color: "var(--pl-emerald)" }}>premium</span> emerald
      </h1>
      <p style={{ margin: 0, color: "var(--pl-muted)", fontSize: 14, maxWidth: 640, lineHeight: 1.6 }}>
        Same clean-SaaS bones, evolved. A deeper emerald with a faint teal lean, green-tinted neutrals,
        softer depth, and confident gradients on hero surfaces. Light only. Inter throughout.
      </p>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {/* palette */}
      <div className="pl-card pad">
        <div className="pl-sect-t">Emerald scale & neutrals</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 16 }}>
          {[["#15b886", "Bright"], ["#0a8f63", "Emerald"], ["#066848", "Deep"], ["#e8f6f0", "Soft"], ["#f2faf6", "Tint"]].map(([h, n]) => (
            <div key={n}>
              <div style={{ height: 60, borderRadius: 10, background: h, border: "1px solid var(--pl-line)" }} />
              <div style={{ fontSize: 11.5, fontWeight: 600, marginTop: 7 }}>{n}</div>
              <div className="pl-mono" style={{ fontSize: 10.5, color: "var(--pl-muted)" }}>{h}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
          {[["#0c1814", "Ink"], ["#15211c", "Text"], ["#5b6b64", "Muted"], ["#e5ebe8", "Line"], ["#f3f6f4", "BG"]].map(([h, n]) => (
            <div key={n}>
              <div style={{ height: 44, borderRadius: 10, background: h, border: "1px solid var(--pl-line)" }} />
              <div style={{ fontSize: 11.5, fontWeight: 600, marginTop: 7 }}>{n}</div>
              <div className="pl-mono" style={{ fontSize: 10.5, color: "var(--pl-muted)" }}>{h}</div>
            </div>
          ))}
        </div>
      </div>

      {/* components */}
      <div className="pl-card pad">
        <div className="pl-sect-t">Components</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
          <button className="pl-btn primary">Primary</button>
          <button className="pl-btn">Secondary</button>
          <button className="pl-btn ghost">Ghost</button>
          <button className="pl-btn icon"><Icon name="plus" size={15} /></button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
          {["Draft", "Sent", "Accepted", "In Progress", "Invoiced", "Paid", "Overdue"].map((s) => <PlBadge key={s} s={s} />)}
        </div>
        <input className="pl-input" placeholder="Input field" style={{ marginBottom: 14 }} />
        <div className="pl-bar" style={{ marginBottom: 10 }}><span style={{ width: "62%" }} /></div>
        <div className="pl-bar a"><span style={{ width: "40%" }} /></div>
      </div>

      {/* type */}
      <div className="pl-card pad">
        <div className="pl-sect-t">Type & numerals</div>
        <div style={{ fontSize: 30, fontWeight: 760, letterSpacing: "-0.03em" }} className="pl-num">₹1,24,500</div>
        <div style={{ fontSize: 20, fontWeight: 750, letterSpacing: "-0.02em", marginTop: 10 }}>Section heading</div>
        <div style={{ fontSize: 14, color: "var(--pl-muted)", marginTop: 8, lineHeight: 1.6 }}>Body copy in Inter — tabular numerals for figures, tight tracking on large display sizes.</div>
        <div className="pl-cursive" style={{ fontSize: 30, color: "var(--pl-emerald)", marginTop: 12 }}>effortlessly</div>
        <div style={{ fontSize: 11.5, color: "var(--pl-faint)", marginTop: 2 }}>Dancing Script — one stylish accent word only</div>
      </div>

      {/* depth & glass */}
      <div className="pl-card pad">
        <div className="pl-sect-t">Depth & glass</div>
        <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 70, borderRadius: 12, background: "#fff", boxShadow: "var(--pl-sh-sm)", display: "grid", placeItems: "center", fontSize: 11.5, color: "var(--pl-muted)" }}>sm</div>
          <div style={{ flex: 1, height: 70, borderRadius: 12, background: "#fff", boxShadow: "var(--pl-sh)", display: "grid", placeItems: "center", fontSize: 11.5, color: "var(--pl-muted)" }}>base</div>
          <div style={{ flex: 1, height: 70, borderRadius: 12, background: "#fff", boxShadow: "var(--pl-sh-emerald)", display: "grid", placeItems: "center", fontSize: 11.5, color: "var(--pl-emerald-deep)" }}>emerald</div>
        </div>
        <div style={{ height: 80, borderRadius: 14, position: "relative", overflow: "hidden", background: "linear-gradient(120deg, #15b886, #2563eb)" }}>
          <div className="pl-glass" style={{ position: "absolute", inset: 14, borderRadius: 11, display: "grid", placeItems: "center", fontSize: 12.5, fontWeight: 600, color: "var(--pl-text)" }}>
            Glassmorphism surface
          </div>
        </div>
      </div>
    </div>
  </div>
);

window.PlLogin = PlLogin;
window.PlTokens = PlTokens;
