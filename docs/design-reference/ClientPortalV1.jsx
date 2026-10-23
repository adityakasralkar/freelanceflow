/* global React, Icon, Sidebar, Topbar, Stat, Badge */

const ClientDashboard = () => (
  <div className="ff-app">
    <Sidebar role="client" active="dashboard" />
    <div className="ff-main">
      <Topbar title="Welcome, Priya" subtitle="Your projects with Rahul Mehta Studio" actions={<button className="ff-btn"><Icon name="download" size={14} />Latest invoice</button>} />
      <div className="ff-content">
        <div className="ff-stack" style={{ gap: 20 }}>
          <div className="ff-grid-3">
            <Stat label="Active projects" value="2" icon="briefcase" iconTone="blue" sub="60% avg progress" />
            <Stat label="Pending invoices" value="₹29,500" icon="clock" iconTone="amber" sub="1 awaiting payment" />
            <Stat label="Completed projects" value="3" icon="check_circle" iconTone="green" sub="₹1,42,500 lifetime" />
          </div>

          <div className="ff-grid-2-1">
            <div className="ff-card flush">
              <div className="ff-card-head"><h3>My projects</h3><span className="ff-link">View all</span></div>
              <div style={{ padding: "8px 0" }}>
                {[
                  { t: "Website Redesign", s: "In Progress", p: 60, m: "3 of 5 milestones · Due Jun 02" },
                  { t: "Brand Refresh", s: "In Progress", p: 35, m: "1 of 3 milestones · Due Jun 14" },
                  { t: "Dashboard Analytics", s: "Completed", p: 100, m: "Delivered Apr 12" },
                ].map((p, i) => (
                  <div key={i} style={{ padding: "16px 20px", borderTop: i ? "1px solid var(--line)" : "none" }}>
                    <div className="ff-spread" style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{p.t}</div>
                      <Badge status={p.s} />
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>{p.m}</div>
                    <div className={`ff-bar ${p.s === "Completed" ? "" : "amber"}`}><span style={{ width: `${p.p}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ff-card flush">
              <div className="ff-card-head"><h3>Next milestone</h3></div>
              <div style={{ padding: 20 }}>
                <div className="ff-stat-icon blue" style={{ width: 36, height: 36, marginBottom: 12 }}><Icon name="flag" size={16} /></div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Development Phase 1</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>Website Redesign</div>
                <div className="ff-stack sm" style={{ fontSize: 12 }}>
                  <div className="ff-spread"><span style={{ color: "var(--muted)" }}>Due</span><span style={{ fontWeight: 600 }}>May 18, 2026</span></div>
                  <div className="ff-spread"><span style={{ color: "var(--muted)" }}>Amount</span><span style={{ fontWeight: 700 }} className="mono">₹25,000</span></div>
                  <div className="ff-spread"><span style={{ color: "var(--muted)" }}>Status</span><Badge status="In Progress" /></div>
                </div>
                <div className="ff-divider" />
                <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
                  Homepage build, navigation, footer, and responsive layouts. Invoice will be generated automatically on completion.
                </div>
              </div>
            </div>
          </div>

          <div className="ff-card flush">
            <div className="ff-card-head"><h3>Recent invoices</h3></div>
            <table className="ff-table">
              <thead><tr><th>Invoice</th><th>Project</th><th>Issued</th><th>Amount</th><th>Status</th><th></th></tr></thead>
              <tbody>
                <tr><td className="mono ff-cell-primary">INV-008</td><td>Website Redesign</td><td>May 09</td><td className="mono ff-cell-primary">₹29,500</td><td><Badge status="Sent" /></td><td style={{ textAlign: "right" }}><button className="ff-btn sm primary">Pay now</button></td></tr>
                <tr><td className="mono ff-cell-primary">INV-002</td><td>Dashboard Analytics</td><td>Apr 02</td><td className="mono ff-cell-primary">₹54,000</td><td><Badge status="Paid" /></td><td style={{ textAlign: "right" }}><button className="ff-btn sm">Download</button></td></tr>
                <tr><td className="mono ff-cell-primary">INV-001</td><td>Discovery Phase</td><td>Mar 24</td><td className="mono ff-cell-primary">₹10,000</td><td><Badge status="Paid" /></td><td style={{ textAlign: "right" }}><button className="ff-btn sm">Download</button></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ClientProjectDetail = () => (
  <div className="ff-app">
    <Sidebar role="client" active="projects" />
    <div className="ff-main">
      <Topbar breadcrumb={["My Projects", "Website Redesign"]} title="Website Redesign" subtitle="With Rahul Mehta · Started Apr 12" actions={<button className="ff-btn"><Icon name="mail" size={14} />Message</button>} />
      <div className="ff-content">
        <div className="ff-grid-2-1">
          <div className="ff-card flush">
            <div className="ff-card-head"><h3>Project timeline</h3><span style={{ fontSize: 12, color: "var(--muted)" }}>3 of 5 complete</span></div>
            <div style={{ padding: "20px 24px" }}>
              <div className="ff-timeline">
                {[
                  { s: "done", t: "Discovery & Planning", d: "Apr 12 — Apr 18", b: "Completed" },
                  { s: "done", t: "Wireframes & Mockups", d: "Apr 19 — Apr 28", b: "Completed" },
                  { s: "done", t: "Design System", d: "Apr 29 — May 06", b: "Completed" },
                  { s: "active", t: "Development Phase 1", d: "May 07 — May 18", b: "In Progress" },
                  { s: "", t: "Testing & QA", d: "May 19 — Jun 02", b: "Pending" },
                ].map((m, i) => (
                  <div key={i} className={`ff-tl-item ${m.s}`}>
                    <div className="ff-tl-dot" />
                    <div className="ff-spread">
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{m.t}</div>
                        <div style={{ fontSize: 12, color: "var(--muted)" }}>{m.d}</div>
                      </div>
                      <Badge status={m.b} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="ff-stack" style={{ gap: 16 }}>
            <div className="ff-card">
              <h3 className="ff-section-title">Progress</h3>
              <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>60%</div>
              <div className="ff-bar"><span style={{ width: "60%" }} /></div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 12 }}>On track to deliver by Jun 02, 2026</div>
            </div>
            <div className="ff-card">
              <h3 className="ff-section-title">Freelancer</h3>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div className="ff-avatar">RM</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Rahul Mehta</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>Independent designer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ClientInvoicesList = () => (
  <div className="ff-app">
    <Sidebar role="client" active="invoices" />
    <div className="ff-main">
      <Topbar title="Invoices" subtitle="Download or pay your invoices" search="Search invoices..." />
      <div className="ff-content">
        <div className="ff-stack" style={{ gap: 16 }}>
          <div className="ff-grid-3">
            <Stat label="Total billed" value="₹1,72,000" icon="receipt" iconTone="purple" />
            <Stat label="Outstanding" value="₹29,500" icon="clock" iconTone="amber" sub="1 invoice" />
            <Stat label="Paid YTD" value="₹1,42,500" icon="check_circle" iconTone="green" />
          </div>
          <div className="ff-card flush">
            <table className="ff-table">
              <thead><tr><th>Invoice</th><th>Project</th><th>Issued</th><th>Due</th><th>Amount</th><th>Status</th><th></th></tr></thead>
              <tbody>
                <tr><td className="mono ff-cell-primary">INV-008</td><td>Website Redesign</td><td>May 09</td><td>May 23</td><td className="mono ff-cell-primary">₹29,500</td><td><Badge status="Sent" /></td><td style={{ textAlign: "right" }}><div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}><button className="ff-btn sm">PDF</button><button className="ff-btn sm primary">Mark Paid</button></div></td></tr>
                <tr><td className="mono ff-cell-primary">INV-002</td><td>Dashboard Analytics</td><td>Apr 02</td><td>Apr 16</td><td className="mono ff-cell-primary">₹54,000</td><td><Badge status="Paid" /></td><td style={{ textAlign: "right" }}><button className="ff-btn sm"><Icon name="download" size={12} />PDF</button></td></tr>
                <tr><td className="mono ff-cell-primary">INV-001</td><td>Discovery Phase</td><td>Mar 24</td><td>Apr 07</td><td className="mono ff-cell-primary">₹10,000</td><td><Badge status="Paid" /></td><td style={{ textAlign: "right" }}><button className="ff-btn sm"><Icon name="download" size={12} />PDF</button></td></tr>
                <tr><td className="mono ff-cell-primary">INV-000</td><td>Initial Consultation</td><td>Mar 12</td><td>Mar 26</td><td className="mono ff-cell-primary">₹5,000</td><td><Badge status="Paid" /></td><td style={{ textAlign: "right" }}><button className="ff-btn sm"><Icon name="download" size={12} />PDF</button></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
);

window.ClientDashboard = ClientDashboard;
window.ClientProjectDetail = ClientProjectDetail;
window.ClientInvoicesList = ClientInvoicesList;
