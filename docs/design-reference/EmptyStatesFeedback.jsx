/* global React, Icon, Badge */

// ============================================================================
// EMPTY STATES REFERENCE
// ============================================================================
const EmptyCard = ({ ic, title, body, cta }) => (
  <div className="ff-card" style={{ textAlign: "center", padding: 28 }}>
    <div className="ff-empty-icon" style={{ margin: "0 auto 14px" }}>
      <Icon name={ic} size={20} />
    </div>
    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{title}</div>
    <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.55, maxWidth: 240, margin: "0 auto 14px" }}>{body}</div>
    {cta && <button className="ff-btn primary sm" style={{ margin: "0 auto" }}><Icon name="plus" size={12} />{cta}</button>}
  </div>
);

const EmptyStatesRef = () => (
  <div style={{ background: "var(--bg)", padding: 40, minHeight: "100%" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--faint)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>States · Reference</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>Empty states</h1>
        <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: 13 }}>One illustration, one sentence, one action — never a dead end.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        <EmptyCard ic="file-text" title="No proposals yet" body="Create your first proposal and send it to a client to start tracking the pipeline." cta="New proposal" />
        <EmptyCard ic="folder" title="No active projects" body="Once a proposal is accepted, convert it to a project to track milestones and time." cta="Browse proposals" />
        <EmptyCard ic="invoice" title="No invoices" body="Generate your first invoice from a project milestone or a manual line item." cta="Create invoice" />
        <EmptyCard ic="users" title="No clients yet" body="Add your first client to send proposals and create projects against their account." cta="Add client" />
        <EmptyCard ic="clock" title="No upcoming work" body="Your week looks clear. Pick up a draft proposal or check pending milestones." />
        <EmptyCard ic="search" title="No results" body="Try a different search term or clear the active filters to see everything." />
        <EmptyCard ic="bell" title="All caught up" body="You have no unread notifications. We'll let you know when something needs your attention." />
        <EmptyCard ic="check_circle" title="Nothing overdue" body="All your invoices are on track. We'll flag anything that crosses its due date." />
        <EmptyCard ic="message" title="No messages" body="Conversations with this client will appear here once they reply." />
      </div>
    </div>
  </div>
);

// ============================================================================
// FEEDBACK REFERENCE — toasts, dialogs, banners
// ============================================================================
const Toast = ({ tone, ic, title, body }) => (
  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", background: "#fff", border: "1px solid var(--line)", borderRadius: 10, boxShadow: "0 8px 24px rgba(15,17,21,0.08)", minWidth: 320 }}>
    <div style={{ width: 28, height: 28, borderRadius: 8, display: "grid", placeItems: "center", flexShrink: 0,
      background: tone === "green" ? "var(--green-soft)" : tone === "red" ? "var(--red-soft)" : tone === "blue" ? "var(--blue-soft)" : "var(--amber-soft)",
      color: tone === "green" ? "var(--green-dark)" : tone === "red" ? "var(--red)" : tone === "blue" ? "var(--blue)" : "var(--amber)" }}>
      <Icon name={ic} size={14} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 13, fontWeight: 600 }}>{title}</div>
      {body && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{body}</div>}
    </div>
    <button className="ff-btn icon sm"><Icon name="x" size={12} /></button>
  </div>
);

const FeedbackRef = () => (
  <div style={{ background: "var(--bg)", padding: 40, minHeight: "100%" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--faint)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Components · Reference</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>Feedback</h1>
        <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: 13 }}>Toasts, banners, and confirmation dialogs.</p>
      </div>

      {/* Toasts */}
      <div style={{ marginBottom: 32 }}>
        <h3 className="ff-section-title">Toasts</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          <Toast tone="green" ic="check_circle" title="Invoice sent" body="INV-008 was emailed to TechNova Inc." />
          <Toast tone="red" ic="alert" title="Couldn't send proposal" body="Network error — please try again." />
          <Toast tone="blue" ic="info" title="Auto-saved" body="Draft saved 12 seconds ago." />
          <Toast tone="amber" ic="alert" title="2 invoices overdue" body="Send a reminder to keep cash flowing." />
        </div>
      </div>

      {/* Banners */}
      <div style={{ marginBottom: 32 }}>
        <h3 className="ff-section-title">Inline banners</h3>
        <div className="ff-stack" style={{ gap: 12 }}>
          <div className="ff-info-box green">
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Icon name="check" size={14} />
              <div><b>Proposal accepted by TechNova Inc.</b> &nbsp; Convert to project to start tracking milestones. <span style={{ textDecoration: "underline", marginLeft: 6, cursor: "pointer", fontWeight: 600 }}>Convert now</span></div>
            </div>
          </div>
          <div className="ff-info-box amber">
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Icon name="alert" size={14} />
              <div><b>You have 2 overdue invoices.</b> &nbsp; ₹54,500 total · 3 and 7 days overdue. <span style={{ textDecoration: "underline", marginLeft: 6, cursor: "pointer", fontWeight: 600 }}>Review</span></div>
            </div>
          </div>
          <div className="ff-info-box blue">
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Icon name="info" size={14} />
              <div><b>Add your GSTIN</b> to send tax-compliant invoices. <span style={{ textDecoration: "underline", marginLeft: 6, cursor: "pointer", fontWeight: 600 }}>Update settings</span></div>
            </div>
          </div>
          <div className="ff-info-box red">
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Icon name="alert" size={14} />
              <div><b>Payment failed.</b> &nbsp; Razorpay returned an error for INV-006. The client has been notified. <span style={{ textDecoration: "underline", marginLeft: 6, cursor: "pointer", fontWeight: 600 }}>View details</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation dialog samples (small) */}
      <div>
        <h3 className="ff-section-title">Confirmation dialogs</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
          {/* Destructive */}
          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 14, padding: 22, boxShadow: "0 12px 32px rgba(15,17,21,0.10)" }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--red-soft)", color: "var(--red)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Icon name="trash" size={16} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Delete proposal?</div>
                <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>This will permanently delete <b>"Mobile App Redesign"</b> for StartupX. This action can't be undone.</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="ff-btn ghost">Cancel</button>
              <button className="ff-btn danger"><Icon name="trash" size={12} />Delete</button>
            </div>
          </div>
          {/* Confirm */}
          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 14, padding: 22, boxShadow: "0 12px 32px rgba(15,17,21,0.10)" }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--blue-soft)", color: "var(--blue)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Icon name="info" size={16} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Send proposal to TechNova Inc?</div>
                <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>An email will be sent to <b>tech@technova.com</b> with a link to review and accept.</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="ff-btn ghost">Cancel</button>
              <button className="ff-btn primary"><Icon name="send" size={12} />Send</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
);

window.EmptyStatesRef = EmptyStatesRef;
window.FeedbackRef = FeedbackRef;
