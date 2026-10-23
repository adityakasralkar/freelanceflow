/* global React, Icon, Sidebar, Topbar, Stat, Badge */

const ProposalsList = () => {
  const rows = [
    { id: "PR-012", t: "Mobile App Redesign", c: "StartupX", a: "₹85,000", d: "May 28, 2026", s: "Sent" },
    { id: "PR-011", t: "Brand Guidelines v2", c: "Acme Corp", a: "₹42,000", d: "May 24, 2026", s: "Accepted" },
    { id: "PR-010", t: "Marketing Site Redesign", c: "Lumina", a: "₹68,000", d: "Jun 02, 2026", s: "Draft" },
    { id: "PR-009", t: "Dashboard Analytics", c: "TechNova Inc", a: "₹54,000", d: "May 14, 2026", s: "Sent" },
    { id: "PR-008", t: "E-commerce Revamp", c: "Northstar Labs", a: "₹1,20,000", d: "May 10, 2026", s: "Declined" },
    { id: "PR-007", t: "Website Redesign", c: "TechNova Inc", a: "₹45,000", d: "Apr 28, 2026", s: "Accepted" },
    { id: "PR-006", t: "Landing Pages (4x)", c: "Acme Corp", a: "₹28,000", d: "Apr 22, 2026", s: "Accepted" },
  ];
  const tabs = ["All", "Draft", "Sent", "Accepted", "Declined"];
  return (
    <div className="ff-app">
      <Sidebar role="freelancer" active="proposals" />
      <div className="ff-main">
        <Topbar
          title="Proposals"
          subtitle="Manage your proposal pipeline"
          search="Search proposals..."
          actions={<button className="ff-btn primary"><Icon name="plus" size={14} />New Proposal</button>}
        />
        <div className="ff-content">
          <div className="ff-card flush">
            <div style={{ padding: "0 20px" }}>
              <div className="ff-tabs">
                {tabs.map((t, i) => (
                  <div key={t} className={`ff-tab ${i === 0 ? "active" : ""}`}>
                    {t}<span className="count">{[7, 1, 2, 3, 1][i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: "12px 20px", display: "flex", gap: 8, alignItems: "center", borderBottom: "1px solid var(--line)" }}>
              <button className="ff-btn sm"><Icon name="filter" size={12} />Client</button>
              <button className="ff-btn sm"><Icon name="calendar" size={12} />Date range</button>
              <button className="ff-btn sm"><Icon name="sliders" size={12} />Amount</button>
              <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)" }}>Showing 7 of 7</div>
            </div>
            <table className="ff-table">
              <thead>
                <tr>
                  <th>Proposal</th><th>Client</th><th>Amount</th><th>Valid until</th><th>Status</th><th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="ff-cell-primary">{r.t}</div>
                      <div className="ff-cell-secondary mono">{r.id}</div>
                    </td>
                    <td>{r.c}</td>
                    <td className="ff-cell-primary">{r.a}</td>
                    <td style={{ color: "var(--muted)" }}>{r.d}</td>
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
  );
};

const CreateProposal = () => (
  <div className="ff-app">
    <Sidebar role="freelancer" active="proposals" />
    <div className="ff-main">
      <Topbar
        breadcrumb={["Proposals", "New proposal"]}
        title="New Proposal"
        subtitle="Define scope, deliverables, and payment terms"
        actions={<>
          <button className="ff-btn">Save Draft</button>
          <button className="ff-btn primary"><Icon name="send" size={14} />Send to Client</button>
        </>}
      />
      <div className="ff-content">
        <div className="ff-grid-2-1">
          <div className="ff-stack" style={{ gap: 16 }}>
            <div className="ff-card">
              <h3 className="ff-section-title">Basic details</h3>
              <div className="ff-stack" style={{ gap: 14 }}>
                <div className="ff-grid-2">
                  <div className="ff-field">
                    <label>Client</label>
                    <select className="ff-select"><option>TechNova Inc</option></select>
                  </div>
                  <div className="ff-field">
                    <label>Proposal number</label>
                    <input className="ff-input mono" defaultValue="PR-013" />
                  </div>
                </div>
                <div className="ff-field">
                  <label>Project title</label>
                  <input className="ff-input" defaultValue="Website Redesign Project" />
                </div>
                <div className="ff-field">
                  <label>Description</label>
                  <textarea className="ff-textarea" rows="3" defaultValue="Complete redesign of the homepage with responsive layout, modernized component library, and CMS-ready handoff for ongoing content updates."></textarea>
                </div>
              </div>
            </div>

            <div className="ff-card">
              <div className="ff-spread" style={{ marginBottom: 12 }}>
                <h3 className="ff-section-title" style={{ margin: 0 }}>Deliverables</h3>
                <button className="ff-btn sm"><Icon name="plus" size={12} />Add item</button>
              </div>
              <div className="ff-stack sm">
                {[
                  { t: "Homepage redesign", d: "New layout, hero, sections", a: "₹15,000" },
                  { t: "Mobile responsive layout", d: "All breakpoints", a: "₹12,000" },
                  { t: "Component library handoff", d: "Storybook + Figma", a: "₹10,000" },
                  { t: "3 revision rounds", d: "Per client feedback", a: "₹8,000" },
                ].map((it, i) => (
                  <div key={i} style={{ padding: 12, border: "1px solid var(--line)", borderRadius: 8, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: "var(--green-soft)", color: "var(--green-dark)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700 }}>{i+1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{it.t}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{it.d}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>{it.a}</div>
                    <button className="ff-btn ghost icon sm"><Icon name="x" size={12} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="ff-card">
              <h3 className="ff-section-title">Payment terms</h3>
              <div className="ff-grid-2">
                <div className="ff-field">
                  <label>Schedule</label>
                  <select className="ff-select"><option>50% upfront, 50% on delivery</option></select>
                </div>
                <div className="ff-field">
                  <label>Net days</label>
                  <select className="ff-select"><option>Net 14</option></select>
                </div>
              </div>
            </div>
          </div>

          <div className="ff-stack" style={{ gap: 16 }}>
            <div className="ff-card">
              <h3 className="ff-section-title">Summary</h3>
              <div className="ff-stack sm">
                <div className="ff-spread"><span style={{ color: "var(--muted)", fontSize: 13 }}>Subtotal</span><span style={{ fontSize: 13 }}>₹45,000</span></div>
                <div className="ff-spread"><span style={{ color: "var(--muted)", fontSize: 13 }}>GST (18%)</span><span style={{ fontSize: 13 }}>₹8,100</span></div>
                <div className="ff-divider" />
                <div className="ff-spread"><span style={{ fontWeight: 700 }}>Total</span><span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em" }}>₹53,100</span></div>
              </div>
            </div>

            <div className="ff-card">
              <h3 className="ff-section-title">Validity</h3>
              <div className="ff-field">
                <label>Valid until</label>
                <input className="ff-input" defaultValue="May 30, 2026" />
                <div className="helper" style={{ marginTop: 6 }}>Proposal expires after this date and cannot be accepted.</div>
              </div>
            </div>

            <div className="ff-card" style={{ background: "var(--blue-soft)", borderColor: "#dbeafe" }}>
              <div style={{ display: "flex", gap: 10 }}>
                <Icon name="info" size={16} style={{ color: "var(--blue)", marginTop: 1, flexShrink: 0 }} />
                <div style={{ fontSize: 12, color: "#1e40af", lineHeight: 1.5 }}>
                  Once accepted, the proposal automatically converts into a project with these deliverables as milestones.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProposalDetail = () => (
  <div className="ff-app">
    <Sidebar role="freelancer" active="proposals" />
    <div className="ff-main">
      <Topbar
        breadcrumb={["Proposals", "PR-011"]}
        title="Brand Guidelines v2"
        subtitle="Sent to Acme Corp · Apr 28, 2026"
        actions={<>
          <button className="ff-btn"><Icon name="download" size={14} />PDF</button>
          <button className="ff-btn primary"><Icon name="git_branch" size={14} />Convert to Project</button>
        </>}
      />
      <div className="ff-content">
        <div className="ff-grid-2-1">
          <div className="ff-stack" style={{ gap: 16 }}>
            <div className="ff-card">
              <div className="ff-spread" style={{ marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }} className="mono">PR-011</div>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>Brand Guidelines v2</h2>
                </div>
                <Badge status="Accepted" />
              </div>
              <p style={{ color: "var(--muted)", lineHeight: 1.6, margin: 0, fontSize: 13 }}>
                Refresh the visual identity system for Acme Corp's product suite, including logo refinements, expanded color tokens, type system, and a 60-page brand guidelines PDF for cross-team distribution.
              </p>
              <div className="ff-divider" />
              <div className="ff-grid-3">
                <div><div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Amount</div><div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>₹42,000</div></div>
                <div><div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Valid until</div><div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>May 24, 2026</div></div>
                <div><div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Terms</div><div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>50% / 50%</div></div>
              </div>
            </div>

            <div className="ff-card">
              <h3 className="ff-section-title">Deliverables</h3>
              <div className="ff-stack sm">
                {[
                  ["Logo refinement & lockups", "₹10,000"],
                  ["Color & typography tokens", "₹8,000"],
                  ["Component visual system", "₹14,000"],
                  ["60-page guidelines PDF", "₹10,000"],
                ].map(([t, a], i) => (
                  <div key={i} style={{ padding: "10px 12px", borderBottom: i < 3 ? "1px solid var(--line)" : "none", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13 }}>{t}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }} className="mono">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="ff-stack" style={{ gap: 16 }}>
            <div className="ff-card">
              <h3 className="ff-section-title">Client</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div className="ff-avatar alt" style={{ width: 40, height: 40 }}>AC</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Ananya Chen</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Acme Corp · Brand Manager</div>
                </div>
              </div>
              <div className="ff-stack sm">
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--muted)" }}><Icon name="mail" size={12} />ananya@acme.com</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--muted)" }}><Icon name="phone" size={12} />+91 98765 43210</div>
              </div>
            </div>

            <div className="ff-card">
              <h3 className="ff-section-title">Activity</h3>
              <div className="ff-timeline">
                <div className="ff-tl-item done"><div className="ff-tl-dot" /><div style={{ fontSize: 13, fontWeight: 600 }}>Accepted</div><div style={{ fontSize: 11, color: "var(--muted)" }}>2 days ago by Ananya</div></div>
                <div className="ff-tl-item done"><div className="ff-tl-dot" /><div style={{ fontSize: 13, fontWeight: 600 }}>Viewed</div><div style={{ fontSize: 11, color: "var(--muted)" }}>3 days ago</div></div>
                <div className="ff-tl-item done"><div className="ff-tl-dot" /><div style={{ fontSize: 13, fontWeight: 600 }}>Sent</div><div style={{ fontSize: 11, color: "var(--muted)" }}>4 days ago</div></div>
                <div className="ff-tl-item done"><div className="ff-tl-dot" /><div style={{ fontSize: 13, fontWeight: 600 }}>Created</div><div style={{ fontSize: 11, color: "var(--muted)" }}>5 days ago</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ClientProposalReview = () => (
  <div className="ff-app">
    <Sidebar role="client" active="dashboard" />
    <div className="ff-main">
      <Topbar
        breadcrumb={["Inbox", "Proposal review"]}
        title="Website Redesign Project"
        subtitle="From Rahul Mehta · TechNova Inc"
        actions={<>
          <button className="ff-btn"><Icon name="download" size={14} />Download PDF</button>
        </>}
      />
      <div className="ff-content">
        <div className="ff-grid-2-1">
          <div className="ff-card">
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 16, borderBottom: "1px solid var(--line)" }}>
              <div className="ff-avatar">RM</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Rahul Mehta</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Independent designer · Verified</div>
              </div>
              <Badge status="Sent" />
            </div>
            <div style={{ padding: "20px 0" }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>PR-007</div>
              <h2 style={{ margin: "6px 0 12px", fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>Website Redesign Project</h2>
              <p style={{ color: "var(--muted)", lineHeight: 1.65, margin: 0 }}>
                Complete redesign of the TechNova marketing site, including a refreshed homepage, responsive layouts across all device classes, and a modular component library to support ongoing content work.
              </p>
            </div>
            <div className="ff-grid-3" style={{ paddingBottom: 20 }}>
              <div style={{ padding: 14, background: "var(--panel-soft)", borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total</div>
                <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4, letterSpacing: "-0.01em" }}>₹45,000</div>
              </div>
              <div style={{ padding: 14, background: "var(--panel-soft)", borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Timeline</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>~6 weeks</div>
              </div>
              <div style={{ padding: 14, background: "var(--panel-soft)", borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Valid until</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>May 30</div>
              </div>
            </div>
            <h3 className="ff-section-title">Scope of work</h3>
            <div className="ff-stack sm">
              {["Homepage redesign — hero, value props, social proof", "Mobile responsive layouts across all breakpoints", "Component library handoff (Figma + Storybook)", "3 revision rounds based on client feedback"].map((d, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0" }}>
                  <Icon name="check_circle" size={16} style={{ color: "var(--green)", flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 13 }}>{d}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ff-stack" style={{ gap: 16 }}>
            <div className="ff-card" style={{ background: "linear-gradient(160deg, #fff, #e8f6f0)" }}>
              <h3 className="ff-section-title">Your decision</h3>
              <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, margin: "0 0 16px" }}>
                Accepting converts this proposal into an active project. You'll be able to track milestones and invoices from your dashboard.
              </p>
              <div className="ff-stack sm">
                <button className="ff-btn primary" style={{ height: 42, justifyContent: "center" }}><Icon name="check" size={14} />Accept Proposal</button>
                <button className="ff-btn" style={{ height: 38, justifyContent: "center" }}>Request Changes</button>
                <button className="ff-btn ghost" style={{ height: 38, justifyContent: "center", color: "var(--red)" }}>Decline</button>
              </div>
            </div>

            <div className="ff-card">
              <h3 className="ff-section-title">Payment terms</h3>
              <div className="ff-stack sm">
                <div className="ff-spread"><span style={{ fontSize: 13, color: "var(--muted)" }}>Schedule</span><span style={{ fontSize: 13, fontWeight: 600 }}>50% upfront / 50% on delivery</span></div>
                <div className="ff-spread"><span style={{ fontSize: 13, color: "var(--muted)" }}>Net</span><span style={{ fontSize: 13, fontWeight: 600 }}>14 days</span></div>
                <div className="ff-spread"><span style={{ fontSize: 13, color: "var(--muted)" }}>GST</span><span style={{ fontSize: 13, fontWeight: 600 }}>18% included</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

window.ProposalsList = ProposalsList;
window.CreateProposal = CreateProposal;
window.ProposalDetail = ProposalDetail;
window.ClientProposalReview = ClientProposalReview;
