/* global React, Icon */

// ============= SHARED LAYOUT =============
const Sidebar = ({ role = "freelancer", active }) => {
  const freelancerNav = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "cashflow", label: "Cash Flow", icon: "trending_up" },
  { id: "proposals", label: "Proposals", icon: "file", badge: "8" },
  { id: "projects", label: "Projects", icon: "folder", badge: "5" },
  { id: "invoices", label: "Invoices", icon: "receipt", badge: "3" },
  { id: "clients", label: "Clients", icon: "users" },
  { id: "settings", label: "Settings", icon: "settings" }];


  const clientNav = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "projects", label: "My Projects", icon: "folder", badge: "2" },
  { id: "invoices", label: "Invoices", icon: "receipt", badge: "1" },
  { id: "profile", label: "Profile", icon: "user" }];


  const items = role === "client" ? clientNav : freelancerNav;
  const isClient = role === "client";

  return (
    <aside className="ff-sidebar">
      <div className="ff-brand">
        <div className="ff-brand-mark">F</div>
        <div>
          FreelanceFlow
          {isClient && <span className="ff-brand-sub">Client Portal</span>}
        </div>
      </div>
      <div className="ff-nav-label">{isClient ? "Client" : "Workspace"}</div>
      <nav className="ff-nav">
        {items.map((it) =>
        <div key={it.id} className={`ff-nav-item ${active === it.id ? "active" : ""}`}>
            <span className="ff-nav-icon"><Icon name={it.icon} size={16} /></span>
            <span>{it.label}</span>
            {it.badge && <span className="ff-nav-badge">{it.badge}</span>}
          </div>
        )}
      </nav>
      <div className="ff-side-bottom">
        <div className="ff-user">
          <div className={`ff-avatar ${isClient ? "alt" : ""}`}>{isClient ? "PS" : "RM"}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="ff-user-name">{isClient ? "Priya Sharma" : "Rahul Mehta"}</div>
            <div className="ff-user-email">{isClient ? "TechNova Inc" : "rahul@flow.app"}</div>
          </div>
          <Icon name="chevron_up_down" size={14} style={{ color: "#93a39c" }} />
        </div>
      </div>
    </aside>);

};

const Topbar = ({ title, subtitle, actions, search, breadcrumb }) =>
<header className="ff-topbar" style={{ height: "64px" }}>
    <div className="ff-topbar-left">
      {breadcrumb &&
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>
          {breadcrumb.map((b, i) =>
      <React.Fragment key={i}>
              {i > 0 && <Icon name="chevron_right" size={12} />}
              <span style={i === breadcrumb.length - 1 ? { color: "var(--text)", fontWeight: 600 } : {}}>{b}</span>
            </React.Fragment>
      )}
        </div>
    }
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
    <div className="ff-topbar-right">
      {search &&
    <div style={{ position: "relative", width: 280 }}>
          <input className="ff-input search" placeholder={search} readOnly />
        </div>
    }
      <button className="ff-btn icon" title="Notifications"><Icon name="bell" size={16} /></button>
      {actions}
    </div>
  </header>;


const Stat = ({ label, value, icon, iconTone = "", trend, trendDir = "up", sub }) =>
<div className="ff-stat">
    <div className="ff-stat-head">
      <div className="ff-stat-label">{label}</div>
      {icon && <div className={`ff-stat-icon ${iconTone}`}><Icon name={icon} size={14} /></div>}
    </div>
    <div className="ff-stat-value">{value}</div>
    {(trend || sub) &&
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {trend &&
    <div className={`ff-stat-trend ${trendDir}`}>
            <Icon name={trendDir === "up" ? "trending_up" : trendDir === "down" ? "trending_down" : "activity"} size={12} />
            {trend}
          </div>
    }
        {sub && <div style={{ fontSize: 11, color: "var(--muted)" }}>{sub}</div>}
      </div>
  }
  </div>;


const Badge = ({ status }) => {
  const map = {
    Draft: "gray",
    Sent: "blue",
    Accepted: "green",
    "In Progress": "amber",
    Completed: "green",
    Invoiced: "purple",
    Paid: "green",
    Overdue: "red",
    Declined: "red",
    Pending: "amber"
  };
  return <span className={`ff-badge ${map[status] || "gray"}`}>{status}</span>;
};

window.Sidebar = Sidebar;
window.Topbar = Topbar;
window.Stat = Stat;
window.Badge = Badge;