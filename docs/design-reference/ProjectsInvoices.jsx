/* global React, Icon, Sidebar, Topbar, Stat, Badge */

const ProjectsList = () => {
  const projects = [
    { t: "Website Redesign", c: "TechNova Inc", a: "AC", color: "var(--green)", p: 60, m: "3 / 5", v: "₹45,000", s: "In Progress", due: "Jun 02" },
    { t: "Brand Refresh", c: "Acme Corp", a: "AC", color: "var(--blue)", p: 80, m: "4 / 5", v: "₹62,000", s: "In Progress", due: "May 18" },
    { t: "Mobile App v2", c: "StartupX", a: "SX", color: "var(--purple)", p: 25, m: "1 / 4", v: "₹85,000", s: "In Progress", due: "Jul 10" },
    { t: "Landing Pages", c: "Northstar Labs", a: "NL", color: "var(--amber)", p: 100, m: "3 / 3", v: "₹32,000", s: "Completed", due: "Apr 28" },
    { t: "Marketing Site", c: "Lumina", a: "LM", color: "var(--red)", p: 40, m: "2 / 5", v: "₹68,000", s: "In Progress", due: "Jun 22" },
    { t: "Dashboard Analytics", c: "TechNova Inc", a: "TN", color: "var(--green)", p: 100, m: "4 / 4", v: "₹54,000", s: "Completed", due: "Apr 12" },
  ];
  return (
    <div className="ff-app">
      <Sidebar role="freelancer" active="projects" />
      <div className="ff-main">
        <Topbar
          title="Projects"
          subtitle="6 active · 2 completed this quarter"
          search="Search projects..."
          actions={<>
            <div className="ff-pill-tabs"><span className="ff-pill-tab active"><Icon name="grid" size={12} /></span><span className="ff-pill-tab"><Icon name="list" size={12} /></span></div>
            <button className="ff-btn primary"><Icon name="plus" size={14} />New Project</button>
          </>}
        />
        <div className="ff-content">
          <div className="ff-grid-3">
            {projects.map((p, i) => (
              <div key={i} className="ff-card" style={{ padding: 18, cursor: "pointer" }}>
                <div className="ff-spread" style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="ff-avatar" style={{ background: p.color, width: 32, height: 32, fontSize: 11 }}>{p.a}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{p.t}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{p.c}</div>
                    </div>
                  </div>
                  <Badge status={p.s} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div className="ff-spread" style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>{p.m} milestones</span>
                    <span style={{ fontSize: 11, fontWeight: 700 }}>{p.p}%</span>
                  </div>
                  <div className={`ff-bar ${p.s === "Completed" ? "" : "amber"}`}><span style={{ width: `${p.p}%` }} /></div>
                </div>
                <div className="ff-spread" style={{ paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>Value</div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }} className="mono">{p.v}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>Due</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{p.due}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectDetail = () => (
  <div className="ff-app">
    <Sidebar role="freelancer" active="projects" />
    <div className="ff-main">
      <Topbar
        breadcrumb={["Projects", "Website Redesign"]}
        title="Website Redesign"
        subtitle="TechNova Inc · Started Apr 12, 2026"
        actions={<>
          <button className="ff-btn"><Icon name="edit" size={14} />Edit</button>
          <button className="ff-btn primary"><Icon name="plus" size={14} />Add Milestone</button>
        </>}
      />
      <div style={{ padding: "0 24px", borderBottom: "1px solid var(--line)", background: "var(--panel)" }}>
        <div className="ff-tabs">
          <div className="ff-tab">Overview</div>
          <div className="ff-tab active">Milestones<span className="count">5</span></div>
          <div className="ff-tab">Invoices<span className="count">2</span></div>
          <div className="ff-tab">Files<span className="count">12</span></div>
          <div className="ff-tab">Notes</div>
        </div>
      </div>
      <div className="ff-content">
        <div className="ff-grid-2-1">
          <div className="ff-card flush">
            <div className="ff-card-head">
              <h3>Milestone timeline</h3>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>3 of 5 complete · 60%</span>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <div className="ff-timeline">
                {[
                  { s: "done", t: "Discovery & Planning", d: "Apr 12 — Apr 18", a: "₹10,000", n: "Stakeholder interviews, content audit, IA mapping.", b: "Paid" },
                  { s: "done", t: "Wireframes & Mockups", d: "Apr 19 — Apr 28", a: "₹12,000", n: "Low-fi wireframes, hi-fi mockups, design tokens.", b: "Paid" },
                  { s: "done", t: "Design System", d: "Apr 29 — May 06", a: "₹8,000", n: "Component library, type scale, color tokens.", b: "Paid" },
                  { s: "active", t: "Development Phase 1", d: "May 07 — May 18", a: "₹25,000", n: "Homepage build, navigation, footer, responsive.", b: "In Progress" },
                  { s: "", t: "Testing & QA", d: "May 19 — Jun 02", a: "₹20,000", n: "Cross-browser, accessibility audit, perf tuning.", b: "Pending" },
                ].map((m, i) => (
                  <div key={i} className={`ff-tl-item ${m.s}`}>
                    <div className="ff-tl-dot" />
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
                          <span style={{ fontSize: 14, fontWeight: 700 }}>{m.t}</span>
                          <Badge status={m.b} />
                        </div>
                        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{m.d}</div>
                        <div style={{ fontSize: 12, color: "var(--muted)" }}>{m.n}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="mono" style={{ fontSize: 14, fontWeight: 700 }}>{m.a}</div>
                        {m.s === "active" && <button className="ff-btn primary sm" style={{ marginTop: 8 }}><Icon name="check" size={12} />Complete</button>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="ff-stack" style={{ gap: 16 }}>
            <div className="ff-card">
              <h3 className="ff-section-title">Project summary</h3>
              <div className="ff-stack sm">
                <div className="ff-spread"><span style={{ fontSize: 12, color: "var(--muted)" }}>Total value</span><span style={{ fontSize: 14, fontWeight: 700 }} className="mono">₹75,000</span></div>
                <div className="ff-spread"><span style={{ fontSize: 12, color: "var(--muted)" }}>Earned</span><span style={{ fontSize: 14, fontWeight: 700, color: "var(--green-dark)" }} className="mono">₹30,000</span></div>
                <div className="ff-spread"><span style={{ fontSize: 12, color: "var(--muted)" }}>In progress</span><span style={{ fontSize: 14, fontWeight: 700, color: "var(--amber)" }} className="mono">₹25,000</span></div>
                <div className="ff-spread"><span style={{ fontSize: 12, color: "var(--muted)" }}>Remaining</span><span style={{ fontSize: 14, fontWeight: 700 }} className="mono">₹20,000</span></div>
                <div className="ff-divider" />
                <div className="ff-spread"><span style={{ fontSize: 12, color: "var(--muted)" }}>Progress</span><span style={{ fontSize: 13, fontWeight: 700 }}>60%</span></div>
                <div className="ff-bar"><span style={{ width: "60%" }} /></div>
              </div>
            </div>

            <div className="ff-card">
              <h3 className="ff-section-title">Client</h3>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                <div className="ff-avatar alt">PS</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Priya Sharma</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>TechNova Inc</div>
                </div>
              </div>
              <button className="ff-btn sm" style={{ width: "100%", justifyContent: "center" }}>View profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const InvoicesList = () => {
  const rows = [
    { id: "INV-008", p: "Website Redesign", c: "TechNova Inc", iss: "May 09", due: "May 23", a: "₹29,500", s: "Sent" },
    { id: "INV-007", p: "Brand Refresh", c: "Acme Corp", iss: "May 02", due: "May 16", a: "₹18,000", s: "Paid" },
    { id: "INV-006", p: "Mobile App v2", c: "StartupX", iss: "Apr 28", due: "May 12", a: "₹21,250", s: "Overdue" },
    { id: "INV-005", p: "Landing Pages", c: "Northstar Labs", iss: "Apr 22", due: "May 06", a: "₹32,000", s: "Paid" },
    { id: "INV-004", p: "Marketing Site", c: "Lumina", iss: "Apr 18", due: "May 02", a: "₹15,000", s: "Overdue" },
    { id: "INV-003", p: "Brand Refresh", c: "Acme Corp", iss: "Apr 12", due: "Apr 26", a: "₹24,000", s: "Paid" },
    { id: "INV-002", p: "Dashboard Analytics", c: "TechNova", iss: "Apr 02", due: "Apr 16", a: "₹54,000", s: "Paid" },
    { id: "INV-001", p: "Discovery Phase", c: "TechNova", iss: "Mar 24", due: "Apr 07", a: "₹10,000", s: "Paid" },
  ];
  return (
    <div className="ff-app">
      <Sidebar role="freelancer" active="invoices" />
      <div className="ff-main">
        <Topbar
          title="Invoices"
          subtitle="Manage and track invoice status"
          search="Search invoices..."
          actions={<button className="ff-btn primary"><Icon name="plus" size={14} />New Invoice</button>}
        />
        <div className="ff-content">
          <div className="ff-stack" style={{ gap: 16 }}>
            <div className="ff-grid-4">
              <Stat label="Total invoiced" value="₹2,03,750" icon="receipt" iconTone="purple" sub="8 invoices YTD" />
              <Stat label="Paid" value="₹1,38,000" icon="check_circle" iconTone="green" sub="5 invoices" />
              <Stat label="Sent" value="₹29,500" icon="send" iconTone="blue" sub="1 awaiting" />
              <Stat label="Overdue" value="₹36,250" icon="alert" iconTone="red" sub="2 invoices · avg 8d" />
            </div>

            <div className="ff-card flush">
              <div style={{ padding: "0 20px" }}>
                <div className="ff-tabs">
                  {["All", "Draft", "Sent", "Paid", "Overdue"].map((t, i) => (
                    <div key={t} className={`ff-tab ${i === 0 ? "active" : ""}`}>{t}<span className="count">{[8, 0, 1, 5, 2][i]}</span></div>
                  ))}
                </div>
              </div>
              <table className="ff-table">
                <thead><tr><th>Invoice</th><th>Project</th><th>Client</th><th>Issued</th><th>Due</th><th>Amount</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td className="mono ff-cell-primary">{r.id}</td>
                      <td>{r.p}</td>
                      <td>{r.c}</td>
                      <td style={{ color: "var(--muted)" }}>{r.iss}</td>
                      <td style={{ color: r.s === "Overdue" ? "var(--red)" : "var(--muted)" }}>{r.due}</td>
                      <td className="ff-cell-primary mono">{r.a}</td>
                      <td><Badge status={r.s} /></td>
                      <td style={{ textAlign: "right" }}>
                        <button className="ff-btn ghost icon sm"><Icon name="more" size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InvoiceDetail = ({ clientView = false }) => (
  <div className="ff-app">
    <Sidebar role={clientView ? "client" : "freelancer"} active="invoices" />
    <div className="ff-main">
      <Topbar
        breadcrumb={["Invoices", "INV-008"]}
        title="INV-008"
        subtitle={clientView ? "From Rahul Mehta · Issued May 09, 2026" : "Auto-generated from Development Phase 1"}
        actions={<>
          <button className="ff-btn"><Icon name="download" size={14} />Download PDF</button>
          {clientView ? (
            <button className="ff-btn primary"><Icon name="check" size={14} />Mark as Paid</button>
          ) : (
            <button className="ff-btn primary"><Icon name="send" size={14} />Send to Client</button>
          )}
        </>}
      />
      <div className="ff-content">
        <div className="ff-grid-2-1">
          <div className="ff-invoice">
            <div className="ff-invoice-head">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div className="ff-brand-mark" style={{ width: 28, height: 28 }}>F</div>
                  <span style={{ fontWeight: 800, fontSize: 15 }}>FreelanceFlow</span>
                </div>
                <p style={{ margin: 0, fontSize: 11, color: "var(--muted)", lineHeight: 1.5 }}>Rahul Mehta Studio<br />Pune, MH 411001<br />GSTIN: 27ABCDE1234F1Z5</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Invoice</div>
                <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }} className="mono">INV-008</div>
                <Badge status="Sent" />
              </div>
            </div>
            <div className="ff-invoice-meta">
              <div className="ff-invoice-block">
                <h5>Bill from</h5>
                <p><strong>Rahul Mehta</strong><br />rahul@freelanceflow.app<br />+91 98765 12345</p>
              </div>
              <div className="ff-invoice-block">
                <h5>Bill to</h5>
                <p><strong>TechNova Inc</strong><br />Priya Sharma<br />priya@technova.com</p>
              </div>
              <div className="ff-invoice-block">
                <h5>Issue date</h5>
                <p>May 09, 2026</p>
              </div>
              <div className="ff-invoice-block">
                <h5>Due date</h5>
                <p>May 23, 2026 · Net 14</p>
              </div>
            </div>
            <table className="ff-table" style={{ marginTop: 8 }}>
              <thead><tr><th style={{ background: "transparent", padding: "8px 0" }}>Description</th><th style={{ background: "transparent", padding: "8px 0", width: 60 }}>Qty</th><th style={{ background: "transparent", padding: "8px 0", textAlign: "right" }}>Rate</th><th style={{ background: "transparent", padding: "8px 0", textAlign: "right" }}>Amount</th></tr></thead>
              <tbody>
                <tr><td style={{ padding: "12px 0" }}><div className="ff-cell-primary">Development Phase 1</div><div className="ff-cell-secondary">Homepage build, navigation, responsive layouts</div></td><td style={{ padding: "12px 0" }}>1</td><td className="mono" style={{ padding: "12px 0", textAlign: "right" }}>₹25,000</td><td className="mono ff-cell-primary" style={{ padding: "12px 0", textAlign: "right" }}>₹25,000</td></tr>
              </tbody>
            </table>
            <div className="ff-invoice-total">
              <div className="ff-invoice-total-box">
                <div className="ff-invoice-total-row"><span>Subtotal</span><span className="mono">₹25,000</span></div>
                <div className="ff-invoice-total-row"><span>GST (18%)</span><span className="mono">₹4,500</span></div>
                <div className="ff-invoice-total-row grand"><span>Total due</span><span className="mono">₹29,500</span></div>
              </div>
            </div>
          </div>

          <div className="ff-stack" style={{ gap: 16 }}>
            <div className="ff-card">
              <h3 className="ff-section-title">Payment details</h3>
              <div className="ff-stack sm" style={{ fontSize: 12 }}>
                <div className="ff-spread"><span style={{ color: "var(--muted)" }}>Bank</span><span style={{ fontWeight: 600 }}>HDFC Bank</span></div>
                <div className="ff-spread"><span style={{ color: "var(--muted)" }}>Account</span><span className="mono">XXXX 4521</span></div>
                <div className="ff-spread"><span style={{ color: "var(--muted)" }}>IFSC</span><span className="mono">HDFC0001234</span></div>
                <div className="ff-spread"><span style={{ color: "var(--muted)" }}>UPI</span><span className="mono">rahul@hdfcbank</span></div>
              </div>
            </div>
            <div className="ff-card">
              <h3 className="ff-section-title">Activity</h3>
              <div className="ff-timeline">
                <div className="ff-tl-item active"><div className="ff-tl-dot" /><div style={{ fontSize: 13, fontWeight: 600 }}>Sent to client</div><div style={{ fontSize: 11, color: "var(--muted)" }}>May 09 · 10:24 AM</div></div>
                <div className="ff-tl-item done"><div className="ff-tl-dot" /><div style={{ fontSize: 13, fontWeight: 600 }}>Generated</div><div style={{ fontSize: 11, color: "var(--muted)" }}>From Dev Phase 1</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

window.ProjectsList = ProjectsList;
window.ProjectDetail = ProjectDetail;
window.InvoicesList = InvoicesList;
window.InvoiceDetail = InvoiceDetail;
