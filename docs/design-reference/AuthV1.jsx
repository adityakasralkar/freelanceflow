/* global React, Icon, Sidebar, Topbar, Stat, Badge */

// ============ AUTH SCREENS ============
const FreelancerLogin = () => (
  <div className="ff-auth">
    <div className="ff-auth-side">
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 18, fontWeight: 800 }}>
        <div className="ff-brand-mark" style={{ width: 32, height: 32, fontSize: 15 }}>F</div>
        FreelanceFlow
      </div>
      <div style={{ position: "relative", zIndex: 2 }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 14px", lineHeight: 1.2 }}>
          From proposal to payment, in one workspace.
        </h2>
        <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, margin: 0, maxWidth: 380 }}>
          Manage proposals, track milestones, send invoices, and watch your cash flow — all without juggling spreadsheets and email threads.
        </p>
        <div style={{ display: "grid", gap: 12, marginTop: 28 }}>
          {[
            { i: "file", t: "Proposal pipeline" },
            { i: "folder", t: "Milestone tracking" },
            { i: "trending_up", t: "Cash-flow dashboard" },
          ].map((f) => (
            <div key={f.t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 500 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(15,159,114,0.12)", display: "grid", placeItems: "center", color: "var(--green-dark)" }}>
                <Icon name={f.i} size={14} />
              </div>
              {f.t}
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 12, color: "var(--muted)", position: "relative", zIndex: 2 }}>
        © 2026 FreelanceFlow · Built for FSAD
      </div>
    </div>
    <div className="ff-auth-form-wrap">
      <div style={{ maxWidth: 360, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.01em" }}>Welcome back</h2>
        <p style={{ color: "var(--muted)", margin: "0 0 28px", fontSize: 13 }}>Sign in to your freelancer workspace</p>
        <div className="ff-stack" style={{ gap: 16 }}>
          <div className="ff-field">
            <label>Email</label>
            <input className="ff-input" defaultValue="rahul@freelanceflow.app" />
          </div>
          <div className="ff-field">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label>Password</label>
              <span className="ff-link" style={{ fontSize: 12 }}>Forgot?</span>
            </div>
            <input className="ff-input" type="password" defaultValue="••••••••••" />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--muted)" }}>
            <input type="checkbox" defaultChecked /> Keep me signed in
          </label>
          <button className="ff-btn primary" style={{ height: 42, justifyContent: "center", fontSize: 14 }}>
            Sign in <Icon name="arrow_right" size={14} />
          </button>
          <div style={{ position: "relative", textAlign: "center", margin: "4px 0" }}>
            <div style={{ height: 1, background: "var(--line)" }} />
            <span style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", background: "var(--panel)", padding: "0 12px", fontSize: 11, color: "var(--muted)" }}>OR</span>
          </div>
          <button className="ff-btn" style={{ height: 42, justifyContent: "center" }}>
            <Icon name="user" size={14} /> Continue as Client
          </button>
          <p style={{ textAlign: "center", color: "var(--muted)", margin: "12px 0 0", fontSize: 13 }}>
            New to FreelanceFlow? <span className="ff-link">Create an account</span>
          </p>
        </div>
      </div>
    </div>
  </div>
);

const ClientLogin = () => (
  <div className="ff-auth client-variant">
    <div className="ff-auth-form-wrap">
      <div style={{ maxWidth: 360, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <div className="ff-brand-mark" style={{ background: "var(--blue)" }}>F</div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>FreelanceFlow <span style={{ color: "var(--muted)", fontWeight: 500, fontSize: 13 }}>· Client</span></div>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.01em" }}>Client Portal</h2>
        <p style={{ color: "var(--muted)", margin: "0 0 28px", fontSize: 13 }}>Review proposals, track projects, and manage invoices.</p>
        <div className="ff-stack" style={{ gap: 16 }}>
          <div className="ff-field">
            <label>Email</label>
            <input className="ff-input" defaultValue="priya@technova.com" />
          </div>
          <div className="ff-field">
            <label>Password</label>
            <input className="ff-input" type="password" defaultValue="••••••••" />
          </div>
          <button className="ff-btn primary" style={{ height: 42, justifyContent: "center", fontSize: 14, background: "var(--blue)", borderColor: "var(--blue)" }}>
            Enter Portal <Icon name="arrow_right" size={14} />
          </button>
          <p style={{ textAlign: "center", color: "var(--muted)", margin: "8px 0 0", fontSize: 13 }}>
            Are you a freelancer? <span className="ff-link">Sign in here</span>
          </p>
        </div>
      </div>
    </div>
    <div className="ff-auth-side client">
      <div style={{ position: "relative", zIndex: 2, margin: "auto 0" }}>
        <span className="ff-badge blue" style={{ marginBottom: 14 }}>Client Access</span>
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 14px", lineHeight: 1.2 }}>
          Stay on top of every project and invoice.
        </h2>
        <div style={{ display: "grid", gap: 16, marginTop: 28 }}>
          {[
            { t: "Review proposals", d: "Accept, decline, or request changes." },
            { t: "Track milestones", d: "See progress in real time." },
            { t: "Pay invoices", d: "Download PDFs, mark as paid." },
          ].map((f) => (
            <div key={f.t} style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{f.t}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{f.d}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 12, color: "var(--muted)", position: "relative", zIndex: 2 }}>
        Secure portal · TLS encrypted
      </div>
    </div>
  </div>
);

window.FreelancerLogin = FreelancerLogin;
window.ClientLogin = ClientLogin;
