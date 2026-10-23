/* global React, Icon, Sidebar, Topbar, Stat, Badge */

// ============================================================================
// USER FLOW DIAGRAMS — three side-by-side flows on a single canvas
// ============================================================================
const FlowNode = ({ x, y, w = 140, h = 60, role = "f", label, sub, ic, dim = false }) => {
  const tone = role === "c" ? { bg: "#eff6ff", border: "#bfdbfe", text: "#1e3a8a" } :
               role === "sys" ? { bg: "#f5f3ff", border: "#ddd6fe", text: "#5b21b6" } :
               { bg: "#e8f6f0", border: "#bfe8d6", text: "#065f46" };
  return (
    <foreignObject x={x} y={y} width={w} height={h}>
      <div style={{
        width: "100%", height: "100%", boxSizing: "border-box",
        background: tone.bg, border: `1.5px solid ${tone.border}`, borderRadius: 10,
        padding: "8px 10px", display: "flex", alignItems: "center", gap: 8,
        opacity: dim ? 0.55 : 1
      }}>
        {ic && <div style={{ width: 24, height: 24, borderRadius: 6, background: "#fff", display: "grid", placeItems: "center", color: tone.text, flexShrink: 0 }}>
          <Icon name={ic} size={12} />
        </div>}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: tone.text, lineHeight: 1.15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
          {sub && <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 2, lineHeight: 1.2 }}>{sub}</div>}
        </div>
      </div>
    </foreignObject>
  );
};

const FlowArrow = ({ x1, y1, x2, y2, label, dashed = false }) => {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#9ca3af" strokeWidth="1.5"
        strokeDasharray={dashed ? "4,4" : ""}
        markerEnd="url(#arrow)" />
      {label && <text x={mx} y={my - 6} textAnchor="middle" fontSize="9" fill="#6b7280" fontWeight="600">{label}</text>}
    </g>
  );
};

const FlowLane = ({ x, y, w, h, title, subtitle, accent }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx="14" fill="#fff" stroke="#e5ebe8" strokeWidth="1" />
    <rect x={x} y={y} width={w} height="42" rx="14" fill="#f7faf8" />
    <rect x={x} y={y + 28} width={w} height="14" fill="#f7faf8" />
    <line x1={x} y1={y + 42} x2={x + w} y2={y + 42} stroke="#e5ebe8" />
    <circle cx={x + 18} cy={y + 21} r="4" fill={accent} />
    <text x={x + 30} y={y + 19} fontSize="12" fontWeight="700" fill="#15211c">{title}</text>
    <text x={x + 30} y={y + 33} fontSize="10" fill="#6b7280">{subtitle}</text>
  </g>
);

const UserFlows = () => (
  <div style={{ background: "var(--bg)", padding: 32, minHeight: "100%" }}>
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--faint)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Flows · Reference</div>
      <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>Three core user flows</h1>
      <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: 13 }}>Proposal → project · Project execution · Invoice → payment.</p>
    </div>

    {/* Legend */}
    <div style={{ display: "flex", gap: 18, marginBottom: 18, fontSize: 12, color: "var(--muted)" }}>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: "#e8f6f0", border: "1.5px solid #bfe8d6" }} />Freelancer action</span>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: "#eff6ff", border: "1.5px solid #bfdbfe" }} />Client action</span>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: "#f5f3ff", border: "1.5px solid #ddd6fe" }} />System / automation</span>
      <span style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 16 }}><svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="3,3" /></svg>Alternate path</span>
    </div>

    <svg viewBox="0 0 1360 1620" style={{ width: "100%", height: "auto", background: "#fff", borderRadius: 16, border: "1px solid var(--line)" }}>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#6b7280" />
        </marker>
      </defs>

      {/* ============ FLOW 1 — Proposal → Project ============ */}
      <FlowLane x="40" y="40" w="1280" h="420" title="Flow 1 — Proposal to Project" subtitle="From new lead to active project. Average completion: 4–6 days." accent="#0a8f63" />

      <FlowNode x="80" y="120" label="Add client" sub="Freelancer · Clients" ic="users" />
      <FlowNode x="260" y="120" label="Create proposal" sub="Title, amount, terms" ic="file-text" />
      <FlowNode x="440" y="120" label="Send to client" sub="Email + magic link" ic="send" />
      <FlowNode x="620" y="120" label="Client opens portal" sub="Auto-login link" ic="external" role="c" />
      <FlowNode x="800" y="120" label="Review proposal" sub="Read deliverables" ic="eye" role="c" />

      <FlowNode x="980" y="80" label="Accept" sub="One click + signature" ic="check_circle" role="c" />
      <FlowNode x="980" y="160" label="Decline" sub="With reason note" ic="x" role="c" dim />

      <FlowNode x="1160" y="80" label="Notification" sub="Email + push to freelancer" ic="bell" role="sys" />
      <FlowNode x="1160" y="160" label="Status: declined" sub="Pipeline updated" ic="info" role="sys" dim />

      <FlowNode x="980" y="280" label="Convert to project" sub="Inherits scope + price" ic="folder" />
      <FlowNode x="800" y="280" label="Set milestones" sub="Dates + amounts" ic="check_circle" />
      <FlowNode x="620" y="280" label="Project active" sub="Ready to track" ic="folder" />
      <FlowNode x="440" y="380" label="Duplicate proposal" sub="Revise & resend" ic="copy" dim />

      {/* arrows row 1 */}
      <FlowArrow x1="220" y1="150" x2="260" y2="150" />
      <FlowArrow x1="400" y1="150" x2="440" y2="150" />
      <FlowArrow x1="580" y1="150" x2="620" y2="150" />
      <FlowArrow x1="760" y1="150" x2="800" y2="150" />
      <FlowArrow x1="940" y1="150" x2="980" y2="150" />
      {/* split */}
      <FlowArrow x1="940" y1="150" x2="980" y2="110" label="accept" />
      <FlowArrow x1="940" y1="150" x2="980" y2="190" label="decline" dashed />
      {/* to system */}
      <FlowArrow x1="1120" y1="110" x2="1160" y2="110" />
      <FlowArrow x1="1120" y1="190" x2="1160" y2="190" dashed />
      {/* loop accepted down */}
      <FlowArrow x1="1230" y1="140" x2="1230" y2="270" />
      <FlowArrow x1="1160" y1="310" x2="1120" y2="310" />
      <FlowArrow x1="980" y1="310" x2="940" y2="310" />
      <FlowArrow x1="800" y1="310" x2="760" y2="310" />
      {/* declined → duplicate */}
      <FlowArrow x1="1160" y1="220" x2="540" y2="410" dashed />
      <FlowArrow x1="440" y1="410" x2="350" y2="180" dashed label="resend" />

      {/* ============ FLOW 2 — Project execution ============ */}
      <FlowLane x="40" y="500" w="1280" h="460" title="Flow 2 — Project Execution" subtitle="Milestone-driven work loop until project is complete." accent="#2563eb" />

      <FlowNode x="80" y="580" label="Project active" ic="folder" />
      <FlowNode x="260" y="580" label="Pick next milestone" sub="From timeline" ic="check_circle" />
      <FlowNode x="440" y="580" label="Work + log time" sub="Track via timer" ic="clock" />
      <FlowNode x="620" y="580" label="Share preview" sub="Asset upload + comment" ic="upload" />
      <FlowNode x="800" y="580" label="Client reviews" sub="In portal" ic="eye" role="c" />

      <FlowNode x="980" y="540" label="Approve" sub="Comment + ✓" ic="check" role="c" />
      <FlowNode x="980" y="620" label="Request changes" sub="Inline feedback" ic="edit" role="c" dim />

      <FlowNode x="1160" y="540" label="Mark complete" sub="Auto badge updates" ic="check_circle" />

      <FlowNode x="800" y="760" label="Iterate" sub="Same milestone" ic="refresh" dim />
      <FlowNode x="980" y="760" label="More milestones?" sub="If yes → loop" ic="info" role="sys" />
      <FlowNode x="1160" y="760" label="Project complete" sub="All paid → archive" ic="check_circle" />
      <FlowNode x="1160" y="840" label="Final invoice" sub="If any due" ic="invoice" dim />

      <FlowArrow x1="220" y1="610" x2="260" y2="610" />
      <FlowArrow x1="400" y1="610" x2="440" y2="610" />
      <FlowArrow x1="580" y1="610" x2="620" y2="610" />
      <FlowArrow x1="760" y1="610" x2="800" y2="610" />
      <FlowArrow x1="940" y1="610" x2="980" y2="570" label="approve" />
      <FlowArrow x1="940" y1="610" x2="980" y2="650" label="changes" dashed />
      <FlowArrow x1="1120" y1="570" x2="1160" y2="570" />
      {/* changes loop */}
      <FlowArrow x1="980" y1="660" x2="870" y2="760" dashed />
      <FlowArrow x1="800" y1="790" x2="510" y2="650" dashed label="rework" />
      {/* loop after complete */}
      <FlowArrow x1="1230" y1="600" x2="1230" y2="750" />
      <FlowArrow x1="1160" y1="790" x2="1120" y2="790" />
      <FlowArrow x1="980" y1="790" x2="350" y2="640" label="next milestone" />
      <FlowArrow x1="1230" y1="790" x2="1230" y2="830" label="all done" />
      <FlowArrow x1="1160" y1="870" x2="1120" y2="870" dashed />

      {/* ============ FLOW 3 — Invoice → Payment ============ */}
      <FlowLane x="40" y="1000" w="1280" h="580" title="Flow 3 — Invoice and Payment" subtitle="Generated from milestone, paid by client, reconciled by system." accent="#7c3aed" />

      <FlowNode x="80" y="1080" label="Milestone complete" ic="check_circle" />
      <FlowNode x="260" y="1080" label="Generate invoice" sub="Pre-filled" ic="invoice" />
      <FlowNode x="440" y="1080" label="Review & edit" sub="Lines, GST, notes" ic="edit" />
      <FlowNode x="620" y="1080" label="Send to client" sub="Email + portal" ic="send" />
      <FlowNode x="800" y="1080" label="Status: sent" sub="Awaiting payment" ic="info" role="sys" />

      <FlowNode x="980" y="1080" label="Client opens" sub="In portal" ic="eye" role="c" />
      <FlowNode x="1160" y="1040" label="Pay now" sub="Stripe / UPI / bank" ic="rupee" role="c" />
      <FlowNode x="1160" y="1120" label="Pay later" sub="Manual record" ic="clock" role="c" dim />

      {/* row 2 */}
      <FlowNode x="1160" y="1240" label="Payment success" sub="Webhook" ic="check_circle" role="sys" />
      <FlowNode x="980" y="1240" label="Status: paid" sub="Auto-reconciled" ic="check" role="sys" />
      <FlowNode x="800" y="1240" label="Notify freelancer" sub="Email + dashboard" ic="bell" role="sys" />
      <FlowNode x="620" y="1240" label="Cash flow updated" sub="Earnings refreshed" ic="trending" />
      <FlowNode x="440" y="1240" label="Receipt to client" sub="PDF + portal" ic="file-text" role="sys" />

      {/* overdue branch */}
      <FlowNode x="800" y="1380" label="Due date passes" sub="Status: overdue" ic="alert" role="sys" dim />
      <FlowNode x="620" y="1380" label="Send reminder" sub="Auto or manual" ic="send" dim />
      <FlowNode x="440" y="1380" label="Client retries" sub="Or contacts you" ic="refresh" role="c" dim />
      <FlowNode x="260" y="1380" label="Mark paid manually" sub="Bank ref" ic="check" dim />
      <FlowNode x="80" y="1380" label="Loop into reconciled" ic="check_circle" dim />

      {/* arrows */}
      <FlowArrow x1="220" y1="1110" x2="260" y2="1110" />
      <FlowArrow x1="400" y1="1110" x2="440" y2="1110" />
      <FlowArrow x1="580" y1="1110" x2="620" y2="1110" />
      <FlowArrow x1="760" y1="1110" x2="800" y2="1110" />
      <FlowArrow x1="940" y1="1110" x2="980" y2="1110" />
      <FlowArrow x1="1120" y1="1110" x2="1160" y2="1070" label="pay" />
      <FlowArrow x1="1120" y1="1110" x2="1160" y2="1150" label="later" dashed />

      <FlowArrow x1="1230" y1="1100" x2="1230" y2="1230" />
      <FlowArrow x1="1160" y1="1270" x2="1120" y2="1270" />
      <FlowArrow x1="980" y1="1270" x2="940" y2="1270" />
      <FlowArrow x1="800" y1="1270" x2="760" y2="1270" />
      <FlowArrow x1="620" y1="1270" x2="580" y2="1270" />

      {/* overdue */}
      <FlowArrow x1="1230" y1="1180" x2="870" y2="1380" dashed label="if not paid" />
      <FlowArrow x1="800" y1="1410" x2="760" y2="1410" dashed />
      <FlowArrow x1="620" y1="1410" x2="580" y2="1410" dashed />
      <FlowArrow x1="440" y1="1410" x2="400" y2="1410" dashed />
      <FlowArrow x1="260" y1="1410" x2="220" y2="1410" dashed />
      <FlowArrow x1="150" y1="1380" x2="500" y2="1280" dashed label="reconcile" />

    </svg>
  </div>
);

window.UserFlows = UserFlows;
