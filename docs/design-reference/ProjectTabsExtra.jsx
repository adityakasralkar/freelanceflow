/* global React, Icon, Sidebar, Topbar, Stat, Badge */

// ============================================================================
// Project · Milestones empty (a fresh project, no milestones yet)
// ============================================================================
const ProjectMilestonesEmpty = () => (
  <div className="ff-app">
    <Sidebar role="freelancer" active="projects" />
    <div className="ff-main">
      <Topbar
        breadcrumb={["Projects", "Brand Guidelines v2"]}
        title="Brand Guidelines v2"
        subtitle="Acme Corp · Just created · ₹42,000"
        actions={<>
          <button className="ff-btn sm"><Icon name="edit" size={12} />Edit project</button>
          <button className="ff-btn primary sm"><Icon name="plus" size={12} />Add milestone</button>
        </>}
      />
      <div className="ff-content">
        <div className="ff-grid-3" style={{ marginBottom: 20 }}>
          <Stat label="Project value" value="₹42,000" icon="rupee" iconTone="green" />
          <Stat label="Milestones" value="0" icon="check_circle" iconTone="blue" sub="Add your first" />
          <Stat label="Invoiced" value="₹0" icon="invoice" iconTone="amber" sub="0% billed" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
          <div className="ff-card">
            <div className="ff-spread" style={{ marginBottom: 14 }}>
              <h3 className="ff-section-title" style={{ margin: 0 }}>Milestones</h3>
              <button className="ff-btn sm"><Icon name="plus" size={12} />Add</button>
            </div>

            {/* Empty state */}
            <div style={{ padding: "60px 24px", textAlign: "center", border: "1.5px dashed var(--line-strong)", borderRadius: 12, background: "var(--panel-soft)" }}>
              <div className="ff-empty-icon" style={{ margin: "0 auto 14px" }}>
                <Icon name="check_circle" size={20} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Break this project into milestones</div>
              <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55, maxWidth: 380, margin: "0 auto 18px" }}>
                Milestones split a project into trackable chunks. Each one can trigger an invoice when marked complete.
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <button className="ff-btn primary"><Icon name="plus" size={14} />Add milestone</button>
                <button className="ff-btn"><Icon name="copy" size={14} />Use a template</button>
              </div>
              <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--line)", display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginRight: 4, alignSelf: "center" }}>Suggestions</span>
                {["Discovery", "Design", "Development", "QA", "Handoff"].map(t => (
                  <span key={t} className="ff-tag" style={{ cursor: "pointer" }}>+ {t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="ff-card">
            <h3 className="ff-section-title">Project details</h3>
            <div className="ff-stack" style={{ gap: 12, fontSize: 13 }}>
              <div><div style={{ fontSize: 11, color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 4 }}>Client</div>Acme Corp</div>
              <div><div style={{ fontSize: 11, color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 4 }}>Status</div><Badge status="In Progress" /></div>
              <div><div style={{ fontSize: 11, color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 4 }}>Started</div>May 14, 2026</div>
              <div><div style={{ fontSize: 11, color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 4 }}>Expected end</div>Jul 02, 2026</div>
              <div><div style={{ fontSize: 11, color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 4 }}>Linked proposal</div><span style={{ color: "var(--green-dark)", fontWeight: 600 }}>PR-011 →</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// Project · Invoices tab — shows generated invoices for one project
// ============================================================================
const ProjectInvoicesTab = () => {
  const invoices = [
    { id: "INV-007", desc: "Development Phase 2", date: "May 28, 2026", due: "Jun 11, 2026", amt: "₹20,000", s: "Sent" },
    { id: "INV-005", desc: "Design Mockups", date: "May 14, 2026", due: "May 28, 2026", amt: "₹15,000", s: "Paid" },
    { id: "INV-003", desc: "Discovery & Wireframes", date: "Apr 28, 2026", due: "May 12, 2026", amt: "₹10,000", s: "Paid" },
  ];
  return (
    <div className="ff-app">
      <Sidebar role="freelancer" active="projects" />
      <div className="ff-main">
        <Topbar
          breadcrumb={["Projects", "Website Redesign"]}
          title="Website Redesign"
          subtitle="TechNova Inc · In Progress · ₹45,000"
          actions={<>
            <button className="ff-btn sm"><Icon name="edit" size={12} />Edit project</button>
            <button className="ff-btn primary sm"><Icon name="plus" size={12} />Add milestone</button>
          </>}
        />
        <div className="ff-content">
          {/* Tabs */}
          <div className="ff-tabs" style={{ marginBottom: 18, borderBottom: "1px solid var(--line)" }}>
            {["Overview", "Milestones", "Invoices", "Files", "Activity"].map((t, i) => (
              <div key={t} className={`ff-tab ${i === 2 ? "active" : ""}`}>
                {t}{i === 2 && <span className="count">3</span>}
              </div>
            ))}
          </div>

          <div className="ff-grid-3" style={{ marginBottom: 20 }}>
            <Stat label="Total invoiced" value="₹45,000" icon="invoice" iconTone="green" sub="3 of 3 milestones" />
            <Stat label="Paid" value="₹25,000" icon="check_circle" iconTone="blue" sub="56% collected" />
            <Stat label="Outstanding" value="₹20,000" icon="clock" iconTone="amber" sub="Due Jun 11" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
            <div className="ff-card flush">
              <div className="ff-spread" style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
                <h3 className="ff-section-title" style={{ margin: 0 }}>Invoices for this project</h3>
                <button className="ff-btn sm"><Icon name="plus" size={12} />New invoice</button>
              </div>
              <table className="ff-table">
                <thead>
                  <tr>
                    <th>Invoice</th><th>Description</th><th>Issued</th><th>Due</th><th>Amount</th><th>Status</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(r => (
                    <tr key={r.id}>
                      <td className="mono ff-cell-primary">{r.id}</td>
                      <td>{r.desc}</td>
                      <td style={{ color: "var(--muted)" }}>{r.date}</td>
                      <td style={{ color: "var(--muted)" }}>{r.due}</td>
                      <td className="mono ff-cell-primary">{r.amt}</td>
                      <td><Badge status={r.s} /></td>
                      <td style={{ textAlign: "right" }}>
                        <button className="ff-btn ghost icon sm"><Icon name="more" size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: "14px 20px", borderTop: "1px solid var(--line)", background: "var(--panel-soft)", display: "flex", justifyContent: "flex-end", gap: 24, fontSize: 13 }}>
                <span style={{ color: "var(--muted)" }}>Total invoiced: <b className="mono" style={{ color: "var(--text)" }}>₹45,000</b></span>
                <span style={{ color: "var(--muted)" }}>Paid: <b className="mono" style={{ color: "var(--green-dark)" }}>₹25,000</b></span>
                <span style={{ color: "var(--muted)" }}>Outstanding: <b className="mono" style={{ color: "var(--amber)" }}>₹20,000</b></span>
              </div>
            </div>

            <div className="ff-stack" style={{ gap: 16 }}>
              <div className="ff-card">
                <h3 className="ff-section-title">Quick actions</h3>
                <div className="ff-stack" style={{ gap: 8 }}>
                  <button className="ff-btn primary" style={{ justifyContent: "center" }}><Icon name="plus" size={14} />Generate from milestone</button>
                  <button className="ff-btn" style={{ justifyContent: "center" }}><Icon name="invoice" size={14} />Manual invoice</button>
                  <button className="ff-btn" style={{ justifyContent: "center" }}><Icon name="send" size={14} />Send reminder</button>
                </div>
              </div>
              <div className="ff-card">
                <h3 className="ff-section-title">Pending milestone</h3>
                <div style={{ padding: 12, background: "var(--amber-soft)", border: "1px solid #fde68a", borderRadius: 8, fontSize: 13 }}>
                  <div style={{ fontWeight: 700, marginBottom: 2 }}>Final delivery</div>
                  <div style={{ color: "var(--muted)", fontSize: 12, marginBottom: 8 }}>Due Jul 15 · ₹0 invoiced</div>
                  <div style={{ fontSize: 12, color: "#7c2d12" }}>Mark this milestone complete to generate the final invoice.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

window.ProjectMilestonesEmpty = ProjectMilestonesEmpty;
window.ProjectInvoicesTab = ProjectInvoicesTab;
