/* global React, Icon, Sidebar, Topbar, Stat, Badge */

const ClientsList = () => {
  const clients = [
    { n: "TechNova Inc", c: "Priya Sharma", e: "priya@technova.com", proj: 3, billed: "₹1,72,000", out: "₹29,500", a: "TN", color: "var(--green)" },
    { n: "Acme Corp", c: "Ananya Chen", e: "ananya@acme.com", proj: 2, billed: "₹1,34,000", out: "₹0", a: "AC", color: "var(--blue)" },
    { n: "StartupX", c: "Vikram Rao", e: "vik@startupx.io", proj: 1, billed: "₹1,01,000", out: "₹21,250", a: "SX", color: "var(--purple)" },
    { n: "Northstar Labs", c: "Maya Iyer", e: "maya@northstar.co", proj: 1, billed: "₹52,000", out: "₹0", a: "NL", color: "var(--amber)" },
    { n: "Lumina", c: "Arjun Das", e: "arjun@lumina.dev", proj: 1, billed: "₹23,000", out: "₹15,000", a: "LM", color: "var(--red)" },
    { n: "Orbit Co", c: "Neha Patel", e: "neha@orbit.co", proj: 0, billed: "₹0", out: "₹0", a: "OC", color: "#475467" },
  ];
  return (
    <div className="ff-app">
      <Sidebar role="freelancer" active="clients" />
      <div className="ff-main">
        <Topbar
          title="Clients"
          subtitle="6 clients · 8 active relationships"
          search="Search clients..."
          actions={<button className="ff-btn primary"><Icon name="plus" size={14} />Add Client</button>}
        />
        <div className="ff-content">
          <div className="ff-grid-3">
            {clients.map((cl, i) => (
              <div key={i} className="ff-card" style={{ padding: 18, cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div className="ff-avatar" style={{ background: cl.color, width: 40, height: 40, fontSize: 13 }}>{cl.a}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{cl.n}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{cl.c}</div>
                  </div>
                  <button className="ff-btn ghost icon sm"><Icon name="more" size={14} /></button>
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="mail" size={12} />{cl.e}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                  <div><div style={{ fontSize: 11, color: "var(--muted)" }}>Projects</div><div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{cl.proj}</div></div>
                  <div><div style={{ fontSize: 11, color: "var(--muted)" }}>Billed</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }} className="mono">{cl.billed}</div></div>
                  <div><div style={{ fontSize: 11, color: "var(--muted)" }}>Outstanding</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 2, color: cl.out === "₹0" ? "var(--muted)" : "var(--amber)" }} className="mono">{cl.out}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientProfile = () => (
  <div className="ff-app">
    <Sidebar role="freelancer" active="clients" />
    <div className="ff-main">
      <Topbar breadcrumb={["Clients", "TechNova Inc"]} title="TechNova Inc" subtitle="Client since March 2026" actions={<><button className="ff-btn"><Icon name="edit" size={14} />Edit</button><button className="ff-btn primary"><Icon name="plus" size={14} />New Proposal</button></>} />
      <div style={{ padding: "0 24px", borderBottom: "1px solid var(--line)", background: "var(--panel)" }}>
        <div className="ff-tabs"><div className="ff-tab active">Overview</div><div className="ff-tab">Projects<span className="count">3</span></div><div className="ff-tab">Invoices<span className="count">5</span></div><div className="ff-tab">Proposals<span className="count">3</span></div></div>
      </div>
      <div className="ff-content">
        <div className="ff-grid-1-2">
          <div className="ff-card">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingBottom: 16, borderBottom: "1px solid var(--line)" }}>
              <div className="ff-avatar" style={{ width: 64, height: 64, fontSize: 22 }}>TN</div>
              <h2 style={{ margin: "12px 0 4px", fontSize: 18 }}>TechNova Inc</h2>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Software · 50–200 employees</div>
            </div>
            <div className="ff-stack sm" style={{ marginTop: 16, fontSize: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon name="user" size={14} style={{ color: "var(--muted)" }} /><span>Priya Sharma · Product Lead</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon name="mail" size={14} style={{ color: "var(--muted)" }} /><span>priya@technova.com</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon name="phone" size={14} style={{ color: "var(--muted)" }} /><span>+91 98213 45678</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon name="map_pin" size={14} style={{ color: "var(--muted)" }} /><span>Bengaluru, India</span></div>
            </div>
          </div>
          <div className="ff-stack" style={{ gap: 16 }}>
            <div className="ff-grid-3">
              <Stat label="Total billed" value="₹1,72,000" icon="rupee" iconTone="green" />
              <Stat label="Outstanding" value="₹29,500" icon="clock" iconTone="amber" sub="1 invoice sent" />
              <Stat label="Lifetime projects" value="3" icon="briefcase" iconTone="blue" sub="2 active" />
            </div>
            <div className="ff-card flush">
              <div className="ff-card-head"><h3>Recent activity</h3></div>
              <div style={{ padding: "8px 0" }}>
                {[
                  { i: "send", c: "purple", t: "INV-008 sent · ₹29,500", s: "2 days ago" },
                  { i: "flag", c: "blue", t: "Milestone completed · Design System", s: "5 days ago" },
                  { i: "check_circle", c: "green", t: "INV-002 paid · ₹54,000", s: "Apr 16" },
                  { i: "file", c: "green", t: "Proposal accepted · Website Redesign", s: "Apr 11" },
                ].map((a, i) => (
                  <div key={i} style={{ padding: "10px 20px", display: "flex", gap: 12, alignItems: "center", borderTop: i ? "1px solid var(--line)" : "none" }}>
                    <div className={`ff-stat-icon ${a.c}`} style={{ flexShrink: 0 }}><Icon name={a.i} size={13} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{a.t}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{a.s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Settings = () => (
  <div className="ff-app">
    <Sidebar role="freelancer" active="settings" />
    <div className="ff-main">
      <Topbar title="Settings" subtitle="Manage your business profile and preferences" />
      <div className="ff-content">
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24 }}>
          <div className="ff-stack" style={{ gap: 2 }}>
            {[["Profile", "user", true], ["Business", "building"], ["Notifications", "bell"], ["Payment Details", "rupee"], ["Team", "users"], ["Security", "shield"]].map(([n, ic, a], i) => (
              <div key={i} className={`ff-nav-item ${a ? "active" : ""}`}>
                <span className="ff-nav-icon"><Icon name={ic} size={14} /></span>
                <span>{n}</span>
              </div>
            ))}
          </div>
          <div className="ff-stack" style={{ gap: 16 }}>
            <div className="ff-card">
              <h3 className="ff-section-title">Profile</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--line)" }}>
                <div className="ff-avatar" style={{ width: 56, height: 56, fontSize: 18 }}>RM</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Rahul Mehta</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>JPG or PNG · max 2MB</div>
                </div>
                <button className="ff-btn sm"><Icon name="upload" size={12} />Upload</button>
              </div>
              <div className="ff-grid-2" style={{ marginBottom: 14 }}>
                <div className="ff-field"><label>Full name</label><input className="ff-input" defaultValue="Rahul Mehta" /></div>
                <div className="ff-field"><label>Display name</label><input className="ff-input" defaultValue="Rahul M." /></div>
              </div>
              <div className="ff-grid-2">
                <div className="ff-field"><label>Email</label><input className="ff-input" defaultValue="rahul@freelanceflow.app" /></div>
                <div className="ff-field"><label>Phone</label><input className="ff-input" defaultValue="+91 98765 12345" /></div>
              </div>
            </div>

            <div className="ff-card">
              <h3 className="ff-section-title">Business details</h3>
              <div className="ff-grid-2" style={{ marginBottom: 14 }}>
                <div className="ff-field"><label>Business name</label><input className="ff-input" defaultValue="Rahul Mehta Studio" /></div>
                <div className="ff-field"><label>GSTIN</label><input className="ff-input mono" defaultValue="27ABCDE1234F1Z5" /></div>
              </div>
              <div className="ff-grid-2" style={{ marginBottom: 14 }}>
                <div className="ff-field"><label>Invoice prefix</label><input className="ff-input mono" defaultValue="INV-" /></div>
                <div className="ff-field"><label>Default net terms</label><select className="ff-select"><option>Net 14</option></select></div>
              </div>
              <div className="ff-field"><label>Address</label><textarea className="ff-textarea" rows="2" defaultValue="2nd floor, Flat 4B, Magnolia Heights, Kalyani Nagar, Pune, Maharashtra 411014"></textarea></div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="ff-btn">Cancel</button>
              <button className="ff-btn primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

window.ClientsList = ClientsList;
window.ClientProfile = ClientProfile;
window.Settings = Settings;
