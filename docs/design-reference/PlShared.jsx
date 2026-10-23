/* global React, Icon */
// Polished shared primitives — namespaced, used by the north-star screens.

const PlSidebar = ({ active }) => {
  const items = [
    ["dashboard", "Dashboard", "home"],
    ["cashflow", "Cash Flow", "trending_up"],
    ["proposals", "Proposals", "file", "8"],
    ["projects", "Projects", "folder", "5"],
    ["invoices", "Invoices", "receipt", "3"],
    ["clients", "Clients", "users"],
    ["settings", "Settings", "settings"],
  ];
  return (
    <aside className="pl-side">
      <div className="pl-brand">
        <div className="pl-brand-mark">F</div>
        <div className="pl-brand-name">Freelance<span>Flow</span></div>
      </div>
      <div className="pl-side-label">Workspace</div>
      <nav className="pl-nav">
        {items.map(([id, label, ic, badge]) => (
          <div key={id} className={`pl-nav-item ${active === id ? "active" : ""}`}>
            <span className="ic"><Icon name={ic} size={17} stroke={1.75} /></span>
            <span style={{ flex: 1 }}>{label}</span>
            {badge && <span className="pl-nav-badge">{badge}</span>}
          </div>
        ))}
      </nav>
      <div className="pl-side-foot">
        <div className="pl-user">
          <div className="pl-ava">RM</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Rahul Mehta</div>
            <div style={{ fontSize: 11, color: "var(--pl-muted)" }}>Pro plan</div>
          </div>
          <Icon name="chevron_up_down" size={15} style={{ color: "var(--pl-faint)" }} />
        </div>
      </div>
    </aside>
  );
};

const PlTop = ({ title, sub, actions, search, breadcrumb }) => (
  <header className="pl-top">
    <div>
      {breadcrumb && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--pl-muted)", marginBottom: 3 }}>
          {breadcrumb.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Icon name="chevron_right" size={12} />}
              <span style={i === breadcrumb.length - 1 ? { color: "var(--pl-text)", fontWeight: 650 } : {}}>{b}</span>
            </React.Fragment>
          ))}
        </div>
      )}
      <h1>{title}</h1>
      {sub && <div className="sub">{sub}</div>}
    </div>
    <div className="pl-top-r">
      {search && <input className="pl-search" placeholder={search} readOnly />}
      <button className="pl-btn icon"><Icon name="bell" size={17} stroke={1.75} /></button>
      {actions}
    </div>
  </header>
);

const PlStat = ({ label, value, ic, tone = "", trend, trendDir = "up", sub, hero }) => (
  <div className={`pl-stat ${hero ? "hero" : ""}`}>
    <div className="pl-stat-top">
      <div className="pl-stat-label">{label}</div>
      <div className={`pl-stat-ic ${tone}`}><Icon name={ic} size={16} stroke={1.9} /></div>
    </div>
    <div className="pl-stat-val pl-num">{value}</div>
    <div className="pl-stat-foot">
      {trend && <span className={`pl-trend ${trendDir}`}><Icon name={trendDir === "up" ? "trending_up" : "trending_down"} size={13} />{trend}</span>}
      {sub && <span className="pl-stat-sub">{sub}</span>}
    </div>
  </div>
);

const PlBadge = ({ s }) => {
  const map = { Draft: "gray", Sent: "blue", Accepted: "green", "In Progress": "amber", Completed: "green", Invoiced: "purple", Paid: "green", Overdue: "red", Pending: "amber", Declined: "red" };
  return <span className={`pl-badge ${map[s] || "gray"}`}>{s}</span>;
};

window.PlSidebar = PlSidebar;
window.PlTop = PlTop;
window.PlStat = PlStat;
window.PlBadge = PlBadge;
