/* global React, Icon, Sidebar, Topbar, Stat, Badge */

const FreelancerDashboard = () => (
  <div className="ff-app">
    <Sidebar role="freelancer" active="dashboard" />
    <div className="ff-main">
      <Topbar
        title="Dashboard"
        subtitle="Tuesday, May 12, 2026 · Welcome back, Rahul"
        search="Search projects, invoices, clients..."
        actions={<button className="ff-btn primary"><Icon name="plus" size={14} />New Proposal</button>}
      />
      <div className="ff-content">
        <div className="ff-stack" style={{ gap: 20 }}>
          <div className="ff-grid-4">
            <Stat label="Total earned (May)" value="₹1,24,500" icon="rupee" iconTone="green" trend="+18.4%" trendDir="up" sub="vs last month" />
            <Stat label="Pending payments" value="₹38,000" icon="clock" iconTone="amber" sub="3 invoices unpaid" />
            <Stat label="Active projects" value="5" icon="briefcase" iconTone="blue" sub="2 due this month" />
            <Stat label="Overdue" value="₹22,000" icon="alert" iconTone="red" trend="2 invoices" trendDir="down" />
          </div>

          <div className="ff-grid-2-1">
            <div className="ff-card flush">
              <div className="ff-card-head">
                <div>
                  <h3>Pipeline overview</h3>
                  <div className="sub">Proposals to payments — last 90 days</div>
                </div>
                <div className="ff-pill-tabs">
                  <span className="ff-pill-tab active">90d</span>
                  <span className="ff-pill-tab">30d</span>
                  <span className="ff-pill-tab">7d</span>
                </div>
              </div>
              <div style={{ padding: 20 }}>
                <div className="ff-stack">
                  {[
                    { label: "Proposals sent", value: "8", count: 8, max: 10, tone: "blue" },
                    { label: "Accepted", value: "6", count: 6, max: 10, tone: "green" },
                    { label: "In progress", value: "5", count: 5, max: 10, tone: "amber" },
                    { label: "Invoiced", value: "4", count: 4, max: 10, tone: "purple" },
                    { label: "Paid", value: "3", count: 3, max: 10, tone: "green" },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="ff-spread" style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{row.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{row.value}</span>
                      </div>
                      <div className={`ff-bar ${row.tone}`}>
                        <span style={{ width: `${(row.count / row.max) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="ff-card flush">
              <div className="ff-card-head">
                <h3>Recent activity</h3>
              </div>
              <div style={{ padding: "8px 0" }}>
                {[
                  { t: "Acme Corp paid INV-007", s: "₹18,000 · 2h ago", i: "check_circle", c: "green" },
                  { t: "Milestone completed", s: "TechNova · Dev Phase 1 · 5h ago", i: "flag", c: "blue" },
                  { t: "Proposal accepted", s: "Northstar Labs · 1d ago", i: "file", c: "green" },
                  { t: "Invoice sent", s: "INV-008 to TechNova · 1d ago", i: "send", c: "purple" },
                  { t: "New client added", s: "StartupX · 2d ago", i: "user", c: "blue" },
                ].map((a, i) => (
                  <div key={i} style={{ padding: "10px 20px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div className={`ff-stat-icon ${a.c}`} style={{ flexShrink: 0 }}><Icon name={a.i} size={13} /></div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3 }}>{a.t}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{a.s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="ff-grid-2">
            <div className="ff-card flush">
              <div className="ff-card-head">
                <h3>Upcoming milestones</h3>
                <span className="ff-link">View all</span>
              </div>
              <table className="ff-table">
                <thead><tr><th>Milestone</th><th>Due</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td><div className="ff-cell-primary">Dev Phase 1</div><div className="ff-cell-secondary">TechNova · Website Redesign</div></td><td>May 18</td><td>₹25,000</td><td><Badge status="In Progress" /></td></tr>
                  <tr><td><div className="ff-cell-primary">QA Pass</div><div className="ff-cell-secondary">Acme Corp · Brand Refresh</div></td><td>May 22</td><td>₹18,000</td><td><Badge status="In Progress" /></td></tr>
                  <tr><td><div className="ff-cell-primary">Final Delivery</div><div className="ff-cell-secondary">Northstar · Landing Pages</div></td><td>Jun 02</td><td>₹32,000</td><td><Badge status="Pending" /></td></tr>
                </tbody>
              </table>
            </div>

            <div className="ff-card flush">
              <div className="ff-card-head">
                <h3>Active proposals</h3>
                <span className="ff-link">View all</span>
              </div>
              <table className="ff-table">
                <thead><tr><th>Title</th><th>Client</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td className="ff-cell-primary">Mobile App Redesign</td><td>StartupX</td><td>₹85,000</td><td><Badge status="Sent" /></td></tr>
                  <tr><td className="ff-cell-primary">Brand Guidelines v2</td><td>Acme Corp</td><td>₹42,000</td><td><Badge status="Accepted" /></td></tr>
                  <tr><td className="ff-cell-primary">Marketing Site</td><td>Lumina</td><td>₹68,000</td><td><Badge status="Draft" /></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CashFlowDashboard = () => {
  const months = [
    { m: "Dec", earned: 62, pending: 12 },
    { m: "Jan", earned: 48, pending: 18 },
    { m: "Feb", earned: 72, pending: 14 },
    { m: "Mar", earned: 58, pending: 22 },
    { m: "Apr", earned: 92, pending: 16 },
    { m: "May", earned: 80, pending: 28 },
  ];
  const max = 130;

  return (
    <div className="ff-app">
      <Sidebar role="freelancer" active="cashflow" />
      <div className="ff-main">
        <Topbar
          title="Cash Flow"
          subtitle="Revenue health from invoices and milestones"
          actions={<>
            <select className="ff-select" style={{ width: 140 }} defaultValue="6m"><option value="6m">Last 6 months</option></select>
            <button className="ff-btn"><Icon name="download" size={14} />Export CSV</button>
          </>}
        />
        <div className="ff-content">
          <div className="ff-stack" style={{ gap: 20 }}>
            <div className="ff-grid-4">
              <Stat label="Total earned" value="₹4,82,000" icon="rupee" iconTone="green" trend="+22% YoY" trendDir="up" />
              <Stat label="Pending" value="₹72,000" icon="clock" iconTone="amber" sub="5 sent invoices" />
              <Stat label="Overdue" value="₹22,000" icon="alert" iconTone="red" sub="2 invoices" />
              <Stat label="Projected (30d)" value="₹1,10,000" icon="target" iconTone="blue" sub="From 4 milestones" />
            </div>

            <div className="ff-grid-2-1">
              <div className="ff-card flush">
                <div className="ff-card-head">
                  <div>
                    <h3>Monthly revenue</h3>
                    <div className="sub">Earned vs pending</div>
                  </div>
                  <div style={{ display: "flex", gap: 14, fontSize: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--green)" }} />Earned</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--amber)" }} />Pending</div>
                  </div>
                </div>
                <div style={{ padding: "20px 24px 16px" }}>
                  <div className="ff-chart">
                    {months.map((mo) => (
                      <div key={mo.m} className="ff-chart-bar">
                        <div className="ff-chart-stack">
                          <div className="ff-chart-seg pending" style={{ height: `${(mo.pending / max) * 200}px` }} />
                          <div className="ff-chart-seg" style={{ height: `${(mo.earned / max) * 200}px` }} />
                        </div>
                        <div className="ff-chart-label">{mo.m}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="ff-card flush">
                <div className="ff-card-head"><h3>Invoice aging</h3></div>
                <div style={{ padding: 20 }} className="ff-stack">
                  {[
                    { l: "0–15 days", v: "₹18,000", w: 70, c: "" },
                    { l: "16–30 days", v: "₹12,000", w: 48, c: "amber" },
                    { l: "31–60 days", v: "₹8,000", w: 32, c: "purple" },
                    { l: "60+ days", v: "₹14,000", w: 56, c: "blue" },
                  ].map((r) => (
                    <div key={r.l}>
                      <div className="ff-spread" style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 13 }}>{r.l}</span>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{r.v}</span>
                      </div>
                      <div className={`ff-bar ${r.c}`}><span style={{ width: `${r.w}%`, background: r.c === "" ? "var(--red)" : undefined }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="ff-grid-2">
              <div className="ff-card flush">
                <div className="ff-card-head"><h3>Upcoming milestone payouts</h3><span className="ff-link">View calendar</span></div>
                <div style={{ padding: "4px 0" }}>
                  {[
                    { p: "Dev Phase 1", c: "TechNova · Website", d: "May 18", a: "₹25,000" },
                    { p: "QA Pass", c: "Acme Corp · Brand Refresh", d: "May 22", a: "₹18,000" },
                    { p: "Content & Copy", c: "Lumina · Marketing", d: "May 28", a: "₹15,000" },
                    { p: "Final Delivery", c: "Northstar · Landing", d: "Jun 02", a: "₹32,000" },
                    { p: "Launch", c: "StartupX · Mobile App", d: "Jun 10", a: "₹20,000" },
                  ].map((m, i) => (
                    <div key={i} style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, borderTop: i ? "1px solid var(--line)" : "none" }}>
                      <div className="ff-stat-icon green" style={{ flexShrink: 0 }}><Icon name="flag" size={13} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{m.p}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>{m.c}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{m.a}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>{m.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ff-card flush">
                <div className="ff-card-head"><h3>Income by client</h3><span className="ff-link">All clients</span></div>
                <div style={{ padding: 20 }} className="ff-stack">
                  {[
                    { n: "TechNova Inc", v: "₹1,72,000", p: 36, c: "var(--green)", a: "TN" },
                    { n: "Acme Corp", v: "₹1,34,000", p: 28, c: "var(--blue)", a: "AC" },
                    { n: "StartupX", v: "₹1,01,000", p: 21, c: "var(--purple)", a: "SX" },
                    { n: "Northstar Labs", v: "₹52,000", p: 11, c: "var(--amber)", a: "NL" },
                    { n: "Lumina", v: "₹23,000", p: 4, c: "var(--red)", a: "LM" },
                  ].map((cli) => (
                    <div key={cli.n} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="ff-avatar" style={{ background: cli.c, width: 30, height: 30, fontSize: 11 }}>{cli.a}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="ff-spread" style={{ marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{cli.n}</span>
                          <span style={{ fontSize: 13, fontWeight: 700 }}>{cli.v}</span>
                        </div>
                        <div className="ff-bar"><span style={{ width: `${cli.p * 2.5}%`, background: cli.c }} /></div>
                      </div>
                      <div style={{ width: 40, textAlign: "right", fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>{cli.p}%</div>
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
};

window.FreelancerDashboard = FreelancerDashboard;
window.CashFlowDashboard = CashFlowDashboard;
