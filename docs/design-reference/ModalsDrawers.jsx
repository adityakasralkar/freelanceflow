/* global React, Icon, Sidebar, Topbar, Stat, Badge, ProposalsList, ProjectDetail, InvoicesList, ClientsList, CashFlowDashboard, FreelancerDashboard, ClientDashboard */

// ============================================================================
// Reusable mini-shell that renders a dimmed parent + a modal/drawer overlay.
// ============================================================================
const ShellWithModal = ({ parent, modal, modalSize = "" }) => (
  <div className="ff-modal-bg">
    <div style={{ filter: "blur(0.5px)", opacity: 0.85, pointerEvents: "none" }}>{parent}</div>
    <div className="ff-modal-scrim">
      <div className={`ff-modal ${modalSize}`}>{modal}</div>
    </div>
  </div>
);

// Minimal background "shell" for modals when we don't want to mount a full screen
const SimpleShell = ({ active = "proposals", title = "Proposals", subtitle = "" }) => (
  <div className="ff-app">
    <Sidebar role="freelancer" active={active} />
    <div className="ff-main">
      <Topbar title={title} subtitle={subtitle} />
      <div className="ff-content">
        <div style={{ height: 600, background: "var(--panel-soft)", border: "1px dashed var(--line)", borderRadius: 12, opacity: 0.6 }} />
      </div>
    </div>
  </div>
);

// ============================================================================
// PROPOSAL DRAWER — 4 STATES (P3 P4 P5 P6)
// ============================================================================
const drawerCommonBody = () => (
  <>
    <div className="ff-spread">
      <div className="ff-row">
        <div className="ff-avatar alt" style={{ width: 40, height: 40 }}>TN</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>TechNova Inc</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>tech@technova.com</div>
        </div>
      </div>
    </div>
    <div className="ff-divider" style={{ margin: 0 }} />
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--faint)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Project</div>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Website Redesign</div>
      <div style={{ fontSize: 12, color: "var(--muted)" }}>Proposal · PR-009</div>
    </div>
    <div className="ff-grid-2">
      <div>
        <div style={{ fontSize: 11, color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 4 }}>Amount</div>
        <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: "var(--green-dark)" }}>₹45,000</div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 4 }}>Valid until</div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>30 May 2026</div>
      </div>
    </div>
    <div>
      <div style={{ fontSize: 11, color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 4 }}>Payment terms</div>
      <div style={{ fontSize: 13 }}>50% upfront · 50% on delivery</div>
    </div>
    <div>
      <div style={{ fontSize: 11, color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 6 }}>Description</div>
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>Complete website redesign with modern layout, mobile responsiveness, and improved performance. Includes 3 revision rounds and final asset handoff.</div>
    </div>
    <div>
      <div style={{ fontSize: 11, color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 8 }}>Deliverables</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {["Homepage redesign", "Mobile responsive layouts", "3 revision rounds", "Final handoff assets"].map((d) => (
          <div key={d} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }} />
            {d}
          </div>
        ))}
      </div>
    </div>
  </>
);

const ProposalDrawer = ({ state }) => {
  const stateLabel = state;
  const dateMap = { Draft: "—", Sent: "Sent on May 14, 2026", Accepted: "Accepted on May 18, 2026", Declined: "Declined on May 19, 2026" };
  return (
    <div className="ff-drawer-bg">
      <Sidebar role="freelancer" active="proposals" />
      <div className="ff-main" style={{ filter: "blur(0.4px)", opacity: 0.7 }}>
        <Topbar title="Proposals" subtitle="Manage your proposal pipeline" />
        <div className="ff-content">
          <div className="ff-card flush">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 22px", borderBottom: i < 5 ? "1px solid var(--line)" : "none" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--panel-soft)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ width: 180 - (i % 3) * 30, height: 10, borderRadius: 5, background: "#edf1ee" }} />
                  <div style={{ width: 110, height: 8, borderRadius: 4, background: "var(--panel-soft)", marginTop: 7 }} />
                </div>
                <div style={{ width: 70, height: 10, borderRadius: 5, background: "#edf1ee" }} />
                <div style={{ width: 64, height: 20, borderRadius: 999, background: "var(--panel-soft)" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="ff-drawer-scrim" />
      <div className="ff-drawer">
        <div className="ff-drawer-head">
          <div>
            <h3>Proposal · Website Redesign</h3>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{dateMap[state]}</div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <button className="ff-btn icon sm"><Icon name="edit" size={14} /></button>
            <button className="ff-btn icon sm"><Icon name="trash" size={14} /></button>
            <button className="ff-btn icon sm"><Icon name="x" size={14} /></button>
          </div>
        </div>
        <div className="ff-drawer-body">
          <div className="ff-spread">
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Status</div>
            <Badge status={stateLabel} />
          </div>
          {drawerCommonBody()}
        </div>
        <div className="ff-drawer-foot">
          {state === "Draft" && (
            <>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="ff-btn ghost" style={{ flex: 1 }}>Cancel</button>
                <button className="ff-btn primary" style={{ flex: 1, justifyContent: "center" }}><Icon name="send" size={14} />Send to client</button>
              </div>
              <div style={{ fontSize: 11, color: "var(--faint)", textAlign: "center" }}>Client will receive an email with this proposal.</div>
            </>
          )}
          {state === "Sent" && (
            <div style={{ display: "flex", gap: 8 }}>
              <button className="ff-btn" style={{ flex: 1, justifyContent: "center", color: "var(--red)", borderColor: "var(--red-soft)" }}>Mark declined</button>
              <button className="ff-btn primary" style={{ flex: 1, justifyContent: "center" }}><Icon name="check" size={14} />Mark accepted</button>
            </div>
          )}
          {state === "Accepted" && (
            <>
              <div className="ff-info-box green">
                <div style={{ fontWeight: 700, marginBottom: 2 }}>Proposal accepted</div>
                Convert this into a project to start tracking milestones and generate invoices.
              </div>
              <button className="ff-btn primary" style={{ justifyContent: "center" }}><Icon name="folder" size={14} />Convert to project</button>
            </>
          )}
          {state === "Declined" && (
            <>
              <div className="ff-info-box red">
                <div style={{ fontWeight: 700, marginBottom: 2 }}>Proposal declined</div>
                You can duplicate this proposal to send a revised version.
              </div>
              <button className="ff-btn" style={{ justifyContent: "center" }}><Icon name="copy" size={14} />Duplicate proposal</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ProposalDrawerDraft = () => <ProposalDrawer state="Draft" />;
const ProposalDrawerSent = () => <ProposalDrawer state="Sent" />;
const ProposalDrawerAccepted = () => <ProposalDrawer state="Accepted" />;
const ProposalDrawerDeclined = () => <ProposalDrawer state="Declined" />;

// ============================================================================
// MODALS
// ============================================================================
const Field = ({ label, children, helper }) => (
  <div className="ff-field">
    <label>{label}</label>
    {children}
    {helper && <div className="helper">{helper}</div>}
  </div>
);

const ModalCreateProposal = () => (
  <ShellWithModal
    parent={<SimpleShell active="proposals" title="Proposals" />}
    modal={
      <>
        <div className="ff-modal-head">
          <div>
            <h3>New proposal</h3>
            <p>Fill in the details and send it to your client.</p>
          </div>
          <button className="ff-btn icon sm"><Icon name="x" size={14} /></button>
        </div>
        <div className="ff-modal-body">
          <Field label="Client">
            <select className="ff-select" defaultValue="TechNova Inc">
              <option>TechNova Inc</option><option>Acme Corp</option><option>＋ Add new client</option>
            </select>
          </Field>
          <Field label="Project title">
            <input className="ff-input" defaultValue="Website Redesign" />
          </Field>
          <div className="ff-grid-2">
            <Field label="Total amount (₹)"><input className="ff-input" defaultValue="45,000" /></Field>
            <Field label="Valid until"><input className="ff-input" defaultValue="30 May 2026" /></Field>
          </div>
          <Field label="Payment terms">
            <select className="ff-select" defaultValue="50/50">
              <option value="100">100% upfront</option>
              <option value="50/50">50% upfront · 50% on delivery</option>
              <option value="ms">Milestone-based</option>
              <option value="del">On delivery</option>
            </select>
          </Field>
          <Field label="Description">
            <textarea className="ff-textarea" defaultValue="Complete website redesign with modern layout, mobile responsiveness, and improved performance." />
          </Field>
          <Field label="Deliverables">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: 8, border: "1px solid var(--line-strong)", borderRadius: 7, minHeight: 38 }}>
              {["Homepage redesign", "Mobile responsive", "3 revision rounds"].map(t => (
                <span key={t} className="ff-tag">{t}<span className="x">×</span></span>
              ))}
              <input style={{ border: 0, outline: 0, flex: 1, minWidth: 100, fontSize: 13 }} placeholder="Type and press Enter..." />
            </div>
          </Field>
        </div>
        <div className="ff-modal-foot">
          <button className="ff-btn ghost">Cancel</button>
          <button className="ff-btn">Save as draft</button>
          <button className="ff-btn primary"><Icon name="send" size={14} />Send to client</button>
        </div>
      </>
    }
  />
);

const ModalConvertToProject = () => (
  <ShellWithModal
    parent={<SimpleShell active="proposals" title="Proposals" />}
    modal={
      <>
        <div className="ff-modal-head">
          <div>
            <h3>Convert to project</h3>
            <p>Turning this accepted proposal into a trackable project.</p>
          </div>
          <button className="ff-btn icon sm"><Icon name="x" size={14} /></button>
        </div>
        <div className="ff-modal-body">
          <div className="ff-info-box gray">
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--faint)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>From proposal</div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 16px", fontSize: 13 }}>
              <span style={{ color: "var(--muted)" }}>Client</span><span style={{ fontWeight: 600 }}>TechNova Inc</span>
              <span style={{ color: "var(--muted)" }}>Project</span><span style={{ fontWeight: 600 }}>Website Redesign</span>
              <span style={{ color: "var(--muted)" }}>Amount</span><span className="mono" style={{ fontWeight: 700 }}>₹45,000</span>
            </div>
          </div>
          <div className="ff-grid-2">
            <Field label="Start date"><input className="ff-input" defaultValue="May 20, 2026" /></Field>
            <Field label="Expected end"><input className="ff-input" defaultValue="Jul 15, 2026" /></Field>
          </div>
          <Field label="Project description">
            <textarea className="ff-textarea" defaultValue="Complete website redesign with modern layout, mobile responsiveness, and improved performance. Includes 3 revision rounds." />
          </Field>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>You can add milestones and payment breakdowns inside the project after creation.</div>
        </div>
        <div className="ff-modal-foot">
          <button className="ff-btn ghost">Cancel</button>
          <button className="ff-btn primary"><Icon name="folder" size={14} />Create project</button>
        </div>
      </>
    }
  />
);

const ModalAddMilestone = () => (
  <ShellWithModal
    parent={<SimpleShell active="projects" title="Website Redesign" subtitle="TechNova Inc · In Progress" />}
    modal={
      <>
        <div className="ff-modal-head">
          <div><h3>Add milestone</h3><p>Track progress and trigger invoices.</p></div>
          <button className="ff-btn icon sm"><Icon name="x" size={14} /></button>
        </div>
        <div className="ff-modal-body">
          <Field label="Milestone title"><input className="ff-input" placeholder="e.g. Design Mockups" defaultValue="Development Phase 2" /></Field>
          <div className="ff-grid-2">
            <Field label="Due date"><input className="ff-input" defaultValue="Jun 12, 2026" /></Field>
            <Field label="Amount (₹)"><input className="ff-input" defaultValue="20,000" /></Field>
          </div>
          <Field label="Notes (optional)">
            <textarea className="ff-textarea" placeholder="Any notes about this milestone..." />
          </Field>
          <div style={{ fontSize: 12, color: "var(--faint)" }}>An invoice can be generated once this milestone is marked complete.</div>
        </div>
        <div className="ff-modal-foot">
          <button className="ff-btn ghost">Cancel</button>
          <button className="ff-btn primary"><Icon name="plus" size={14} />Add milestone</button>
        </div>
      </>
    }
  />
);

const ModalMarkComplete = () => (
  <ShellWithModal
    modalSize="sm"
    parent={<SimpleShell active="projects" title="Website Redesign" subtitle="TechNova Inc · In Progress" />}
    modal={
      <>
        <div className="ff-modal-head">
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--green-soft)", color: "var(--green-dark)", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon name="check_circle" size={18} />
            </div>
            <div>
              <h3>Mark milestone as complete?</h3>
              <p style={{ marginTop: 6 }}>Development Phase 1 — ₹25,000.<br />Once marked complete, you can generate an invoice for this milestone.</p>
            </div>
          </div>
          <button className="ff-btn icon sm"><Icon name="x" size={14} /></button>
        </div>
        <div className="ff-modal-foot">
          <button className="ff-btn ghost">Cancel</button>
          <button className="ff-btn primary"><Icon name="check" size={14} />Mark complete</button>
        </div>
      </>
    }
  />
);

const ModalGenerateInvoice = () => (
  <ShellWithModal
    modalSize="lg"
    parent={<SimpleShell active="projects" title="Website Redesign" subtitle="TechNova Inc · In Progress" />}
    modal={
      <>
        <div className="ff-modal-head">
          <div><h3>Generate invoice</h3><p>Pre-filled from milestone — review and send.</p></div>
          <button className="ff-btn icon sm"><Icon name="x" size={14} /></button>
        </div>
        <div className="ff-modal-body">
          <div className="ff-info-box green">
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Icon name="check" size={14} />
              <div>Auto-filled from <b>Development Phase 1</b> · <b>Website Redesign</b> · <span className="mono">₹25,000</span></div>
            </div>
          </div>
          <div className="ff-grid-3">
            <Field label="Invoice number" helper="Auto-incremented"><input className="ff-input mono" defaultValue="INV-008" /></Field>
            <Field label="Issue date"><input className="ff-input" defaultValue="May 14, 2026" /></Field>
            <Field label="Due date"><input className="ff-input" defaultValue="May 28, 2026" /></Field>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Line items</div>
            <table className="ff-table" style={{ border: "1px solid var(--line)", borderRadius: 8, overflow: "hidden" }}>
              <thead>
                <tr><th>Description</th><th style={{ width: 60 }}>Qty</th><th style={{ width: 110 }}>Rate</th><th style={{ width: 110, textAlign: "right" }}>Amount</th></tr>
              </thead>
              <tbody>
                <tr><td>Development Phase 1</td><td>1</td><td className="mono">₹25,000</td><td className="mono" style={{ textAlign: "right", fontWeight: 600 }}>₹25,000</td></tr>
              </tbody>
            </table>
            <button className="ff-btn ghost sm" style={{ marginTop: 6 }}><Icon name="plus" size={12} />Add line item</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "flex-start" }}>
            <Field label="Notes">
              <textarea className="ff-textarea" placeholder="Payment terms, bank details..." style={{ minHeight: 70 }} defaultValue="Payment due within 14 days. Bank transfer or UPI accepted." />
            </Field>
            <div style={{ width: 220, fontSize: 13 }}>
              <div className="ff-spread" style={{ padding: "4px 0" }}><span style={{ color: "var(--muted)" }}>Subtotal</span><span className="mono">₹25,000</span></div>
              <div className="ff-spread" style={{ padding: "4px 0" }}>
                <span style={{ color: "var(--muted)", display: "flex", alignItems: "center", gap: 6 }}>GST (18%)<span className="ff-toggle on" style={{ width: 28, height: 16 }} /></span>
                <span className="mono">₹4,500</span>
              </div>
              <div className="ff-spread" style={{ padding: "8px 0", borderTop: "2px solid var(--text)", marginTop: 4, fontWeight: 700, fontSize: 15 }}>
                <span>Total</span><span className="mono">₹29,500</span>
              </div>
            </div>
          </div>
        </div>
        <div className="ff-modal-foot">
          <button className="ff-btn ghost">Cancel</button>
          <button className="ff-btn">Save as draft</button>
          <button className="ff-btn primary"><Icon name="send" size={14} />Send to client</button>
        </div>
      </>
    }
  />
);

const ModalAddClient = () => (
  <ShellWithModal
    parent={<SimpleShell active="clients" title="Clients" subtitle="12 clients · 5 active" />}
    modal={
      <>
        <div className="ff-modal-head">
          <div><h3>Add client</h3><p>Add a new client to your workspace.</p></div>
          <button className="ff-btn icon sm"><Icon name="x" size={14} /></button>
        </div>
        <div className="ff-modal-body">
          <div className="ff-grid-2">
            <Field label="First name"><input className="ff-input" defaultValue="Priya" /></Field>
            <Field label="Last name"><input className="ff-input" defaultValue="Sharma" /></Field>
          </div>
          <Field label="Company name"><input className="ff-input" defaultValue="Lumina Studio" /></Field>
          <Field label="Email"><input className="ff-input" type="email" defaultValue="priya@lumina.co" /></Field>
          <div className="ff-grid-2">
            <Field label="Phone"><input className="ff-input" defaultValue="+91 98765 43210" /></Field>
            <Field label="Location / city"><input className="ff-input" defaultValue="Bengaluru" /></Field>
          </div>
        </div>
        <div className="ff-modal-foot">
          <button className="ff-btn ghost">Cancel</button>
          <button className="ff-btn primary"><Icon name="plus" size={14} />Add client</button>
        </div>
      </>
    }
  />
);

const ModalSendReminder = () => (
  <ShellWithModal
    parent={<SimpleShell active="invoices" title="Invoices" />}
    modal={
      <>
        <div className="ff-modal-head">
          <div><h3>Send payment reminder</h3><p>The reminder will be emailed from your registered email.</p></div>
          <button className="ff-btn icon sm"><Icon name="x" size={14} /></button>
        </div>
        <div className="ff-modal-body">
          <Field label="To"><input className="ff-input" disabled defaultValue="tech@technova.com" /></Field>
          <Field label="Subject"><input className="ff-input" defaultValue="Payment reminder: Invoice #INV-002 — ₹29,500 overdue" /></Field>
          <Field label="Message">
            <div style={{ background: "var(--panel-soft)", border: "1px solid var(--line)", borderRadius: 8, padding: 14, fontSize: 13, lineHeight: 1.55, color: "#374151" }}>
              <p style={{ margin: 0 }}>Hi TechNova team,</p>
              <p style={{ margin: "10px 0 0" }}>This is a friendly reminder that <b>Invoice #INV-002</b> for <span className="mono">₹29,500</span> was due on <b>Jan 22, 2026</b> and is now overdue by 3 days.</p>
              <p style={{ margin: "10px 0 0" }}>Please process the payment at your earliest convenience. If you've already paid, you can disregard this email.</p>
              <p style={{ margin: "10px 0 0" }}>Best,<br />Rahul</p>
            </div>
          </Field>
        </div>
        <div className="ff-modal-foot">
          <button className="ff-btn ghost">Cancel</button>
          <button className="ff-btn primary"><Icon name="send" size={14} />Send reminder</button>
        </div>
      </>
    }
  />
);

window.ProposalDrawerDraft = ProposalDrawerDraft;
window.ProposalDrawerSent = ProposalDrawerSent;
window.ProposalDrawerAccepted = ProposalDrawerAccepted;
window.ProposalDrawerDeclined = ProposalDrawerDeclined;
window.ModalCreateProposal = ModalCreateProposal;
window.ModalConvertToProject = ModalConvertToProject;
window.ModalAddMilestone = ModalAddMilestone;
window.ModalMarkComplete = ModalMarkComplete;
window.ModalGenerateInvoice = ModalGenerateInvoice;
window.ModalAddClient = ModalAddClient;
window.ModalSendReminder = ModalSendReminder;
