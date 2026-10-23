/* global React, Icon, Sidebar, Topbar, Badge */

const SettingsNav = ({ active }) => {
  const items = [
    ["profile", "Profile", "user"],
    ["business", "Business", "building"],
    ["payment", "Payment Details", "rupee"],
    ["notifications", "Notifications", "bell"],
    ["team", "Team", "users"],
    ["security", "Security", "shield"],
  ];
  return (
    <div className="ff-stack" style={{ gap: 2 }}>
      {items.map(([key, n, ic]) => (
        <div key={key} className={`ff-nav-item ${active === key ? "active" : ""}`}>
          <span className="ff-nav-icon"><Icon name={ic} size={14} /></span>
          <span>{n}</span>
        </div>
      ))}
    </div>
  );
};

const SettingsShell = ({ tab, children }) => (
  <div className="ff-app">
    <Sidebar role="freelancer" active="settings" />
    <div className="ff-main">
      <Topbar title="Settings" subtitle="Manage your business profile and preferences" />
      <div className="ff-content">
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24 }}>
          <SettingsNav active={tab} />
          <div className="ff-stack" style={{ gap: 16 }}>
            {children}
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

const SettingsProfile = () => (
  <SettingsShell tab="profile">
    <div className="ff-card">
      <h3 className="ff-section-title">Profile</h3>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--line)" }}>
        <div className="ff-avatar" style={{ width: 56, height: 56, fontSize: 18 }}>RM</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Rahul Mehta</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>JPG or PNG · max 2MB</div>
        </div>
        <button className="ff-btn sm"><Icon name="upload" size={12} />Upload</button>
        <button className="ff-btn sm" style={{ color: "var(--red)" }}>Remove</button>
      </div>
      <div className="ff-grid-2" style={{ marginBottom: 14 }}>
        <div className="ff-field"><label>Full name</label><input className="ff-input" defaultValue="Rahul Mehta" /></div>
        <div className="ff-field"><label>Display name</label><input className="ff-input" defaultValue="Rahul M." /></div>
      </div>
      <div className="ff-grid-2" style={{ marginBottom: 14 }}>
        <div className="ff-field"><label>Email</label><input className="ff-input" defaultValue="rahul@freelanceflow.app" /></div>
        <div className="ff-field"><label>Phone</label><input className="ff-input" defaultValue="+91 98765 12345" /></div>
      </div>
      <div className="ff-field"><label>Bio (shown to clients)</label><textarea className="ff-textarea" rows="3" defaultValue="Independent product designer with 8 years of experience designing for fintech and SaaS. Based in Pune, India."></textarea></div>
    </div>
    <div className="ff-card">
      <h3 className="ff-section-title">Localization</h3>
      <div className="ff-grid-2">
        <div className="ff-field"><label>Time zone</label><select className="ff-select"><option>(GMT+05:30) India Standard Time</option></select></div>
        <div className="ff-field"><label>Currency</label><select className="ff-select"><option>INR (₹)</option><option>USD ($)</option></select></div>
      </div>
    </div>
  </SettingsShell>
);

const SettingsBusiness = () => (
  <SettingsShell tab="business">
    <div className="ff-card">
      <h3 className="ff-section-title">Business details</h3>
      <div className="ff-grid-2" style={{ marginBottom: 14 }}>
        <div className="ff-field"><label>Business name</label><input className="ff-input" defaultValue="Rahul Mehta Studio" /></div>
        <div className="ff-field"><label>Business type</label><select className="ff-select"><option>Sole Proprietor</option><option>Private Limited</option><option>LLP</option></select></div>
      </div>
      <div className="ff-grid-2" style={{ marginBottom: 14 }}>
        <div className="ff-field"><label>GSTIN</label><input className="ff-input mono" defaultValue="27ABCDE1234F1Z5" /></div>
        <div className="ff-field"><label>PAN</label><input className="ff-input mono" defaultValue="ABCDE1234F" /></div>
      </div>
      <div className="ff-field"><label>Registered address</label><textarea className="ff-textarea" rows="2" defaultValue="2nd floor, Flat 4B, Magnolia Heights, Kalyani Nagar, Pune, Maharashtra 411014"></textarea></div>
    </div>
    <div className="ff-card">
      <h3 className="ff-section-title">Invoice defaults</h3>
      <div className="ff-grid-2" style={{ marginBottom: 14 }}>
        <div className="ff-field"><label>Invoice prefix</label><input className="ff-input mono" defaultValue="INV-" /></div>
        <div className="ff-field"><label>Next invoice number</label><input className="ff-input mono" defaultValue="009" /></div>
      </div>
      <div className="ff-grid-2" style={{ marginBottom: 14 }}>
        <div className="ff-field"><label>Default net terms</label><select className="ff-select"><option>Net 14</option><option>Net 7</option><option>Net 30</option></select></div>
        <div className="ff-field"><label>Default GST</label><select className="ff-select"><option>18% (services)</option><option>0% (export)</option></select></div>
      </div>
      <div className="ff-field"><label>Default invoice notes</label><textarea className="ff-textarea" rows="2" defaultValue="Payment due within 14 days. Bank transfer or UPI accepted. Thank you for your business."></textarea></div>
    </div>
  </SettingsShell>
);

const SettingsPayment = () => (
  <SettingsShell tab="payment">
    <div className="ff-card">
      <h3 className="ff-section-title">Bank account</h3>
      <div className="ff-grid-2" style={{ marginBottom: 14 }}>
        <div className="ff-field"><label>Account holder name</label><input className="ff-input" defaultValue="Rahul Mehta" /></div>
        <div className="ff-field"><label>Bank name</label><input className="ff-input" defaultValue="HDFC Bank" /></div>
      </div>
      <div className="ff-grid-2" style={{ marginBottom: 14 }}>
        <div className="ff-field"><label>Account number</label><input className="ff-input mono" defaultValue="••••••••3421" /></div>
        <div className="ff-field"><label>IFSC code</label><input className="ff-input mono" defaultValue="HDFC0001234" /></div>
      </div>
      <div className="ff-field"><label>Account type</label><select className="ff-select"><option>Savings</option><option>Current</option></select></div>
    </div>
    <div className="ff-card">
      <h3 className="ff-section-title">UPI</h3>
      <div className="ff-field" style={{ marginBottom: 14 }}>
        <label>UPI ID</label>
        <input className="ff-input mono" defaultValue="rahulmehta@hdfcbank" />
        <div className="helper">Shown on invoices for instant payment.</div>
      </div>
      <div style={{ display: "flex", gap: 14, alignItems: "center", padding: 14, background: "var(--panel-soft)", border: "1px solid var(--line)", borderRadius: 8 }}>
        <div style={{ width: 72, height: 72, background: "#fff", border: "1px solid var(--line)", borderRadius: 8, display: "grid", placeItems: "center", fontSize: 9, color: "var(--faint)", textAlign: "center" }}>
          <div>QR<br />code</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>QR code on invoices</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Auto-generated from your UPI ID. Embedded in PDF invoices.</div>
        </div>
        <span className="ff-toggle on" />
      </div>
    </div>
    <div className="ff-card">
      <h3 className="ff-section-title">Other payment methods</h3>
      <div className="ff-stack" style={{ gap: 10 }}>
        {[
          { name: "Stripe", desc: "Accept card payments globally", on: true },
          { name: "PayPal", desc: "For international clients", on: false },
          { name: "Razorpay", desc: "India payment gateway", on: false },
        ].map(m => (
          <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", border: "1px solid var(--line)", borderRadius: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--panel-soft)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>{m.name[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{m.desc}</div>
            </div>
            {m.on ? <Badge status="Connected" /> : <button className="ff-btn sm">Connect</button>}
          </div>
        ))}
      </div>
    </div>
  </SettingsShell>
);

const NotifRow = ({ label, desc, email = false, push = false, sms = false }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px", gap: 12, alignItems: "center", padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
    <div>
      <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{desc}</div>
    </div>
    <div style={{ textAlign: "center" }}><span className={`ff-toggle ${email ? "on" : ""}`} /></div>
    <div style={{ textAlign: "center" }}><span className={`ff-toggle ${push ? "on" : ""}`} /></div>
    <div style={{ textAlign: "center" }}><span className={`ff-toggle ${sms ? "on" : ""}`} /></div>
  </div>
);

const SettingsNotifications = () => (
  <SettingsShell tab="notifications">
    <div className="ff-card">
      <h3 className="ff-section-title">Notification preferences</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px", gap: 12, padding: "0 0 8px", fontSize: 11, fontWeight: 700, color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid var(--line)" }}>
        <div>Event</div>
        <div style={{ textAlign: "center" }}>Email</div>
        <div style={{ textAlign: "center" }}>Push</div>
        <div style={{ textAlign: "center" }}>SMS</div>
      </div>
      <NotifRow label="Proposal accepted" desc="When a client accepts a proposal you sent" email push sms />
      <NotifRow label="Proposal declined" desc="When a client declines a proposal" email push />
      <NotifRow label="Invoice paid" desc="Payment received against an invoice" email push sms />
      <NotifRow label="Invoice overdue" desc="When an invoice crosses its due date" email push />
      <NotifRow label="Milestone marked complete" desc="On milestone completion" email />
      <NotifRow label="New message from client" desc="In-app comments and messages" email push />
      <NotifRow label="Weekly summary" desc="Summary of activity every Monday" email />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px", gap: 12, alignItems: "center", padding: "14px 0 0" }}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Tip: SMS notifications use credits from your plan.</div>
      </div>
    </div>
    <div className="ff-card">
      <h3 className="ff-section-title">Quiet hours</h3>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
        <span className="ff-toggle on" />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Mute non-urgent notifications</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Email digests and weekly summaries are paused during quiet hours.</div>
        </div>
      </div>
      <div className="ff-grid-2">
        <div className="ff-field"><label>From</label><input className="ff-input" defaultValue="22:00" /></div>
        <div className="ff-field"><label>To</label><input className="ff-input" defaultValue="08:00" /></div>
      </div>
    </div>
  </SettingsShell>
);

window.SettingsProfile = SettingsProfile;
window.SettingsBusiness = SettingsBusiness;
window.SettingsPayment = SettingsPayment;
window.SettingsNotifications = SettingsNotifications;
