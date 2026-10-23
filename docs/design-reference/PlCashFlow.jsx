/* global React, Icon, PlSidebar, PlTop, PlStat, PlBadge, PlArea */

// ============================================================================
// POLISHED CASH FLOW — premium charts (area, donut, aging, payouts)
// ============================================================================
const PlCashFlow = () => (
  <div className="pl-root">
    <div className="pl-app">
      <PlSidebar active="cashflow" />
      <div className="pl-main">
        <PlTop title="Cash Flow" sub="Revenue health from invoices and milestones"
          actions={<><button className="pl-btn sm"><Icon name="calendar" size={14} />Last 6 months</button><button className="pl-btn"><Icon name="download" size={14} />Export</button></>} />
        <div className="pl-content">
          <div className="pl-g4" style={{ marginBottom: 20 }}>
            <PlStat hero label="Total earned" value="₹4,82,000" ic="rupee" trend="+22% YoY" sub="6 months" />
            <PlStat label="Pending" value="₹72,000" ic="clock" tone="a" sub="5 sent" />
            <PlStat label="Overdue" value="₹22,000" ic="alert" tone="r" sub="2 invoices" />
            <PlStat label="Projected 30d" value="₹1,10,000" ic="target" tone="b" sub="4 milestones" />
          </div>

          <div className="pl-g21" style={{ marginBottom: 20 }}>
            <div className="pl-card">
              <div className="pl-card-h">
                <div><h3>Monthly revenue</h3><div className="sub">Earned vs pending</div></div>
                <div className="pl-legend">
                  <span><span className="d" style={{ background: "var(--pl-emerald)" }} />Earned</span>
                  <span><span className="d" style={{ background: "var(--pl-amber)" }} />Pending</span>
                </div>
              </div>
              <div style={{ padding: "20px 22px 12px" }}>
                <div className="pl-bars">
                  {[
                    { m: "Dec", e: 62, p: 12 }, { m: "Jan", e: 48, p: 18 }, { m: "Feb", e: 72, p: 14 },
                    { m: "Mar", e: 58, p: 22 }, { m: "Apr", e: 92, p: 16 }, { m: "May", e: 80, p: 28 },
                  ].map((d) => (
                    <div key={d.m} className="pl-bcol">
                      <div className="pl-bstack">
                        <div className="pl-bseg pend" style={{ height: d.p * 1.4 }} />
                        <div className="pl-bseg" style={{ height: d.e * 1.4 }} />
                      </div>
                      <div className="pl-blabel">{d.m}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pl-card">
              <div className="pl-card-h"><h3>Income by client</h3></div>
              <div style={{ padding: 22 }}>
                <div className="pl-donut-wrap">
                  <PlDonut />
                  <div className="pl-donut-center">
                    <div style={{ fontSize: 11, color: "var(--pl-muted)" }}>Total</div>
                    <div style={{ fontSize: 22, fontWeight: 760 }} className="pl-num">₹4.82L</div>
                  </div>
                </div>
                <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 9 }}>
                  {[["TechNova", "36%", "var(--pl-emerald)"], ["Acme Corp", "28%", "var(--pl-blue)"], ["StartupX", "21%", "var(--pl-purple)"], ["Others", "15%", "var(--pl-amber)"]].map(([n, p, c]) => (
                    <div key={n} className="pl-spread" style={{ fontSize: 12.5 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: c }} />{n}</span>
                      <span style={{ fontWeight: 700 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pl-g2">
            <div className="pl-card">
              <div className="pl-card-h"><h3>Invoice aging</h3></div>
              <div style={{ padding: 22 }}>
                {[
                  { l: "0–15 days", v: "₹18,000", w: 70, c: "var(--pl-emerald)" },
                  { l: "16–30 days", v: "₹12,000", w: 48, c: "var(--pl-amber)" },
                  { l: "31–60 days", v: "₹8,000", w: 32, c: "var(--pl-purple)" },
                  { l: "60+ days", v: "₹14,000", w: 56, c: "var(--pl-red)" },
                ].map((r) => (
                  <div key={r.l} style={{ marginBottom: 16 }}>
                    <div className="pl-spread" style={{ marginBottom: 6 }}>
                      <span style={{ fontSize: 13 }}>{r.l}</span><span style={{ fontSize: 13, fontWeight: 700 }} className="pl-num">{r.v}</span>
                    </div>
                    <div className="pl-bar"><span style={{ width: `${r.w}%`, background: r.c }} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pl-card">
              <div className="pl-card-h"><h3>Upcoming payouts</h3><span className="pl-link">Calendar<Icon name="arrow_right" size={13} /></span></div>
              <div style={{ padding: "6px 0" }}>
                {[
                  { p: "Dev Phase 1", c: "TechNova", d: "May 18", a: "₹25,000" },
                  { p: "QA Pass", c: "Acme Corp", d: "May 22", a: "₹18,000" },
                  { p: "Content & Copy", c: "Lumina", d: "May 28", a: "₹15,000" },
                  { p: "Final Delivery", c: "Northstar", d: "Jun 02", a: "₹32,000" },
                ].map((m, i) => (
                  <div key={i} style={{ padding: "13px 22px", display: "flex", alignItems: "center", gap: 13, borderTop: i ? "1px solid var(--pl-line)" : "none" }}>
                    <div className="pl-stat-ic" style={{ width: 34, height: 34 }}><Icon name="flag" size={15} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 650 }}>{m.p}</div>
                      <div style={{ fontSize: 11.5, color: "var(--pl-muted)" }}>{m.c}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }} className="pl-num">{m.a}</div>
                      <div style={{ fontSize: 11, color: "var(--pl-faint)" }}>{m.d}</div>
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

const PlDonut = () => {
  const segs = [
    { p: 36, c: "#0a8f63" }, { p: 28, c: "#2563eb" }, { p: 21, c: "#7c5cf0" }, { p: 15, c: "#b9770a" },
  ];
  const R = 52, C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={R} fill="none" stroke="#eef1ef" strokeWidth="18" />
      {segs.map((s, i) => {
        const len = (s.p / 100) * C;
        const el = (
          <circle key={i} cx="70" cy="70" r={R} fill="none" stroke={s.c} strokeWidth="18"
            strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset}
            strokeLinecap="butt" transform="rotate(-90 70 70)" />
        );
        offset += len;
        return el;
      })}
    </svg>
  );
};

// ============================================================================
// POLISHED INVOICE
// ============================================================================
const PlInvoice = () => (
  <div className="pl-root">
    <div className="pl-app">
      <PlSidebar active="invoices" />
      <div className="pl-main">
        <PlTop breadcrumb={["Invoices", "INV-008"]} title="INV-008" sub="Auto-generated from Development Phase 1"
          actions={<><button className="pl-btn"><Icon name="download" size={14} />PDF</button><button className="pl-btn primary"><Icon name="send" size={14} />Send to client</button></>} />
        <div className="pl-content">
          <div className="pl-g21">
            <div className="pl-invoice">
              <div className="pl-inv-head">
                <div>
                  <div className="pl-row" style={{ gap: 11, marginBottom: 10 }}>
                    <div className="pl-brand-mark" style={{ width: 30, height: 30, fontSize: 15 }}>F</div>
                    <span style={{ fontWeight: 800, fontSize: 16 }}>FreelanceFlow</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--pl-muted)", lineHeight: 1.6 }}>Rahul Mehta Studio<br />Pune, MH 411001<br />GSTIN: 27ABCDE1234F1Z5</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "var(--pl-faint)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Invoice</div>
                  <div style={{ fontSize: 24, fontWeight: 780 }} className="pl-mono">INV-008</div>
                  <div style={{ marginTop: 8 }}><PlBadge s="Sent" /></div>
                </div>
              </div>
              <div className="pl-inv-grid">
                <div><h5>Bill from</h5><p><b>Rahul Mehta</b><br />rahul@flow.app<br />+91 98765 12345</p></div>
                <div><h5>Bill to</h5><p><b>TechNova Inc</b><br />Priya Sharma<br />priya@technova.com</p></div>
                <div><h5>Issued</h5><p>May 09, 2026</p></div>
                <div><h5>Due</h5><p>May 23, 2026<br /><span style={{ color: "var(--pl-muted)" }}>Net 14</span></p></div>
              </div>
              <table className="pl-table" style={{ marginTop: 4 }}>
                <thead><tr>
                  <th style={{ background: "transparent", padding: "10px 0" }}>Description</th>
                  <th style={{ background: "transparent", padding: "10px 0", width: 50 }}>Qty</th>
                  <th style={{ background: "transparent", padding: "10px 0", textAlign: "right" }}>Rate</th>
                  <th style={{ background: "transparent", padding: "10px 0", textAlign: "right" }}>Amount</th>
                </tr></thead>
                <tbody>
                  <tr><td style={{ padding: "14px 0" }}><div className="pl-cell-1">Development Phase 1</div><div className="pl-cell-2">Homepage build, navigation, responsive layouts</div></td><td style={{ padding: "14px 0" }}>1</td><td className="pl-mono" style={{ padding: "14px 0", textAlign: "right" }}>₹25,000</td><td className="pl-mono pl-cell-1" style={{ padding: "14px 0", textAlign: "right" }}>₹25,000</td></tr>
                </tbody>
              </table>
              <div className="pl-inv-total">
                <div>
                  <div className="pl-inv-row"><span style={{ color: "var(--pl-muted)" }}>Subtotal</span><span className="pl-mono">₹25,000</span></div>
                  <div className="pl-inv-row"><span style={{ color: "var(--pl-muted)" }}>GST (18%)</span><span className="pl-mono">₹4,500</span></div>
                  <div className="pl-inv-row grand"><span>Total due</span><span className="pl-mono">₹29,500</span></div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div className="pl-card pad">
                <div className="pl-sect-t">Payment details</div>
                {[["Bank", "HDFC Bank"], ["Account", "XXXX 4521"], ["IFSC", "HDFC0001234"], ["UPI", "rahul@hdfcbank"]].map(([k, v]) => (
                  <div key={k} className="pl-spread" style={{ fontSize: 12.5, padding: "6px 0" }}>
                    <span style={{ color: "var(--pl-muted)" }}>{k}</span><span className="pl-mono" style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="pl-card pad">
                <div className="pl-sect-t">Timeline</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[["Sent to client", "May 09 · 10:24 AM", true], ["Generated from milestone", "May 09", true], ["Awaiting payment", "Due May 23", false]].map(([t, s, done], i) => (
                    <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, marginTop: 1, display: "grid", placeItems: "center",
                        background: done ? "var(--pl-emerald)" : "#fff", border: done ? "none" : "2px solid var(--pl-line-strong)", color: "#fff" }}>
                        {done && <Icon name="check" size={11} />}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{t}</div>
                        <div style={{ fontSize: 11.5, color: "var(--pl-muted)" }}>{s}</div>
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
  </div>
);

window.PlCashFlow = PlCashFlow;
window.PlInvoice = PlInvoice;
