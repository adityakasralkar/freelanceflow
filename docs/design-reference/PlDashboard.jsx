/* global React, Icon, PlSidebar, PlTop, PlStat, PlBadge */

// ============================================================================
// POLISHED DASHBOARD
// ============================================================================
const PlDashboard = () => (
  <div className="pl-root">
    <div className="pl-app">
      <PlSidebar active="dashboard" />
      <div className="pl-main">
        <PlTop title="Dashboard" sub="Tuesday, May 12 · Welcome back, Rahul" search="Search anything…"
          actions={<button className="pl-btn primary"><Icon name="plus" size={15} />New Proposal</button>} />
        <div className="pl-content">
          <div className="pl-g4" style={{ marginBottom: 20 }}>
            <PlStat hero label="Earned this month" value="₹1,24,500" ic="rupee" trend="+18.4%" sub="vs last month" />
            <PlStat label="Pending payments" value="₹38,000" ic="clock" tone="a" sub="3 invoices" />
            <PlStat label="Active projects" value="5" ic="briefcase" tone="b" sub="2 due this month" />
            <PlStat label="Overdue" value="₹22,000" ic="alert" tone="r" trend="2 invoices" trendDir="down" />
          </div>

          <div className="pl-g21" style={{ marginBottom: 20 }}>
            <div className="pl-card">
              <div className="pl-card-h">
                <div><h3>Revenue trend</h3><div className="sub">Earned vs pending · last 6 months</div></div>
                <div className="pl-legend">
                  <span><span className="d" style={{ background: "var(--pl-emerald)" }} />Earned</span>
                  <span><span className="d" style={{ background: "var(--pl-amber)" }} />Pending</span>
                </div>
              </div>
              <div style={{ padding: "20px 22px 14px" }}><PlArea /></div>
            </div>
            <div className="pl-card">
              <div className="pl-card-h"><h3>Pipeline</h3></div>
              <div style={{ padding: 22 }}>
                {[
                  ["Proposals sent", 8, 80, ""],
                  ["Accepted", 6, 60, ""],
                  ["In progress", 5, 50, "a"],
                  ["Invoiced", 4, 40, "b"],
                  ["Paid", 3, 30, ""],
                ].map(([l, v, w, t]) => (
                  <div key={l} style={{ marginBottom: 15 }}>
                    <div className="pl-spread" style={{ marginBottom: 6 }}>
                      <span style={{ fontSize: 13 }}>{l}</span><span style={{ fontSize: 13, fontWeight: 700 }} className="pl-num">{v}</span>
                    </div>
                    <div className={`pl-bar ${t}`}><span style={{ width: `${w}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pl-g2">
            <div className="pl-card">
              <div className="pl-card-h"><h3>Upcoming milestones</h3><span className="pl-link">View all<Icon name="arrow_right" size={13} /></span></div>
              <table className="pl-table">
                <thead><tr><th>Milestone</th><th>Due</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td><div className="pl-cell-1">Dev Phase 1</div><div className="pl-cell-2">TechNova · Website</div></td><td style={{ color: "var(--pl-muted)" }}>May 18</td><td className="pl-mono pl-cell-1">₹25,000</td><td><PlBadge s="In Progress" /></td></tr>
                  <tr><td><div className="pl-cell-1">QA Pass</div><div className="pl-cell-2">Acme · Brand Refresh</div></td><td style={{ color: "var(--pl-muted)" }}>May 22</td><td className="pl-mono pl-cell-1">₹18,000</td><td><PlBadge s="In Progress" /></td></tr>
                  <tr><td><div className="pl-cell-1">Final Delivery</div><div className="pl-cell-2">Northstar · Landing</div></td><td style={{ color: "var(--pl-muted)" }}>Jun 02</td><td className="pl-mono pl-cell-1">₹32,000</td><td><PlBadge s="Pending" /></td></tr>
                </tbody>
              </table>
            </div>
            <div className="pl-card">
              <div className="pl-card-h"><h3>Recent activity</h3></div>
              <div style={{ padding: "8px 0" }}>
                {[
                  { i: "check_circle", t: "Acme Corp paid INV-007", s: "₹18,000 · 2h ago", c: "" },
                  { i: "flag", t: "Milestone completed", s: "TechNova · Dev Phase 1 · 5h ago", c: "b" },
                  { i: "file", t: "Proposal accepted", s: "Northstar Labs · 1d ago", c: "" },
                  { i: "send", t: "Invoice sent — INV-008", s: "TechNova · 1d ago", c: "p" },
                ].map((a, i) => (
                  <div key={i} style={{ padding: "12px 22px", display: "flex", gap: 13, alignItems: "center" }}>
                    <div className={`pl-stat-ic ${a.c}`} style={{ width: 34, height: 34 }}><Icon name={a.i} size={15} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{a.t}</div>
                      <div style={{ fontSize: 11.5, color: "var(--pl-muted)" }}>{a.s}</div>
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

// premium area chart
const PlArea = () => (
  <svg viewBox="0 0 720 240" style={{ width: "100%", height: 240 }}>
    <defs>
      <linearGradient id="plAreaE" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#15b886" stopOpacity="0.30" />
        <stop offset="100%" stopColor="#15b886" stopOpacity="0" />
      </linearGradient>
    </defs>
    {[0, 1, 2, 3].map((i) => (
      <line key={i} x1="0" x2="720" y1={40 + i * 50} y2={40 + i * 50} stroke="#eef1ef" strokeWidth="1" />
    ))}
    {/* pending line */}
    <path d="M20,170 C120,160 180,176 240,166 C320,152 380,180 460,158 C540,138 600,168 700,150"
      fill="none" stroke="#d6a23a" strokeWidth="2" strokeDasharray="5,5" opacity="0.7" />
    {/* earned area */}
    <path d="M20,150 C120,140 180,96 240,104 C320,114 380,52 460,66 C540,78 600,40 700,34 L700,210 L20,210 Z" fill="url(#plAreaE)" />
    <path d="M20,150 C120,140 180,96 240,104 C320,114 380,52 460,66 C540,78 600,40 700,34"
      fill="none" stroke="#0a8f63" strokeWidth="3" strokeLinecap="round" />
    {[[20, 150], [240, 104], [460, 66], [700, 34]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="4.5" fill="#fff" stroke="#0a8f63" strokeWidth="2.5" />
    ))}
    {["Dec", "Jan", "Feb", "Mar", "Apr", "May"].map((m, i) => (
      <text key={m} x={20 + i * 136} y="232" fontSize="11" fill="#93a39c" fontWeight="500">{m}</text>
    ))}
  </svg>
);

window.PlDashboard = PlDashboard;
window.PlArea = PlArea;
