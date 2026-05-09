import { useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { BellRing, CheckCircle2, Eye, Receipt } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/shared/StatCard';
import EmptyState from '../../components/shared/EmptyState';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import Modal from '../../components/ui/Modal';
import { useInvoices, useUpdateInvoiceStatus } from '../../hooks/useInvoices';
import { formatCurrency, formatDate, cn } from '../../utils';
import type { Invoice, InvoiceStatus } from '../../types';

type TabKey = 'all' | InvoiceStatus;

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'sent', label: 'Sent' },
  { key: 'paid', label: 'Paid' },
  { key: 'overdue', label: 'Overdue' },
];

export default function InvoicesPage() {
  const [tab, setTab] = useState<TabKey>('all');
  const [invoiceToMarkPaid, setInvoiceToMarkPaid] = useState<Invoice | null>(null);
  const [reminderInvoice, setReminderInvoice] = useState<Invoice | null>(null);

  const { data: invoices = [], isLoading } = useInvoices(tab);
  const { data: allInvoices = [] } = useInvoices('all');
  const updateStatus = useUpdateInvoiceStatus();

  const counts = useMemo(() => {
    const nextCounts: Record<TabKey, number> = {
      all: allInvoices.length,
      draft: 0,
      sent: 0,
      paid: 0,
      overdue: 0,
    };
    for (const invoice of allInvoices) nextCounts[invoice.status]++;
    return nextCounts;
  }, [allInvoices]);

  const summary = useMemo(() => {
    const total = allInvoices.reduce((sum, invoice) => sum + Number(invoice.total_amount), 0);
    const paid = allInvoices
      .filter((invoice) => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + Number(invoice.total_amount), 0);
    const pending = allInvoices
      .filter((invoice) => invoice.status === 'draft' || invoice.status === 'sent')
      .reduce((sum, invoice) => sum + Number(invoice.total_amount), 0);
    const overdue = allInvoices
      .filter((invoice) => invoice.status === 'overdue')
      .reduce((sum, invoice) => sum + Number(invoice.total_amount), 0);
    return {
      currency: allInvoices[0]?.currency || 'INR',
      total,
      paid,
      pending,
      overdue,
    };
  }, [allInvoices]);

  async function handleMarkPaid() {
    if (!invoiceToMarkPaid) return;
    await updateStatus.mutateAsync({ id: invoiceToMarkPaid.id, status: 'paid' });
    setInvoiceToMarkPaid(null);
  }

  return (
    <>
      <PageLayout title="Invoices" subtitle="Track issued invoices and payment status.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Receipt}
            label="Total invoiced"
            value={formatCurrency(summary.total, summary.currency)}
            tone="purple"
          />
          <StatCard
            icon={CheckCircle2}
            label="Paid"
            value={formatCurrency(summary.paid, summary.currency)}
            tone="green"
          />
          <StatCard
            icon={BellRing}
            label="Pending"
            value={formatCurrency(summary.pending, summary.currency)}
            tone="amber"
          />
          <StatCard
            icon={Receipt}
            label="Overdue"
            value={formatCurrency(summary.overdue, summary.currency)}
            tone="red"
          />
        </div>

        <Card className="mt-6 overflow-hidden p-0">
          <div className="px-5">
            <div className="-mb-px flex gap-0.5 border-b border-[var(--line)]">
              {TABS.map((item) => {
                const active = tab === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTab(item.key)}
                    className={cn(
                      'flex items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-[13px] transition-colors',
                      active
                        ? 'border-[var(--green)] font-semibold text-[var(--green-dark)]'
                        : 'border-transparent font-medium text-[var(--muted)] hover:text-[var(--text)]'
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        'rounded-full px-1.5 text-[11px] font-semibold',
                        active
                          ? 'bg-[var(--green-soft)] text-[var(--green-dark)]'
                          : 'bg-[#eef0f3] text-[var(--muted)]'
                      )}
                    >
                      {counts[item.key]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {isLoading ? (
            <div className="px-5 py-6 text-sm text-[var(--muted)]">Loading invoices…</div>
          ) : invoices.length === 0 ? (
            <EmptyState
              icon={Receipt}
              heading="No invoices yet"
              subtext="Complete milestones and generate invoices to start tracking payments."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[var(--panel-soft)] text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--muted)]">
                  <tr>
                    <th className="px-4 py-2.5">Invoice</th>
                    <th className="px-4 py-2.5">Client</th>
                    <th className="px-4 py-2.5">Project</th>
                    <th className="px-4 py-2.5">Issue date</th>
                    <th className="px-4 py-2.5">Due date</th>
                    <th className="px-4 py-2.5 text-right">Amount</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <InvoiceRow
                      key={invoice.id}
                      invoice={invoice}
                      onMarkPaid={() => setInvoiceToMarkPaid(invoice)}
                      onSendReminder={() => setReminderInvoice(invoice)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </PageLayout>

      <ConfirmDialog
        isOpen={!!invoiceToMarkPaid}
        onClose={() => setInvoiceToMarkPaid(null)}
        onConfirm={handleMarkPaid}
        title="Mark invoice as paid?"
        message="This will update the invoice status to paid and refresh your cash flow totals."
        confirmLabel="Mark paid"
        isLoading={updateStatus.isPending}
      />

      <ReminderPreviewModal
        invoice={reminderInvoice}
        onClose={() => setReminderInvoice(null)}
      />
    </>
  );
}

function InvoiceRow({
  invoice,
  onMarkPaid,
  onSendReminder,
}: {
  invoice: Invoice;
  onMarkPaid: () => void;
  onSendReminder: () => void;
}) {
  const isOverdue = invoice.status === 'overdue';

  return (
    <tr className="group border-b border-[var(--line)] transition-colors hover:bg-[#fafbfc] last:border-b-0">
      <td className="px-4 py-3.5">
        <Link
          to="/invoices/$invoiceId"
          params={{ invoiceId: invoice.id }}
          className="mono font-semibold text-[var(--green-dark)] hover:underline"
        >
          {invoice.invoice_number}
        </Link>
      </td>
      <td className="px-4 py-3.5">
        <div className="font-medium text-[var(--text)]">{invoice.client_name || '—'}</div>
        {invoice.client_company && (
          <div className="text-[12px] text-[var(--muted)]">{invoice.client_company}</div>
        )}
      </td>
      <td className="px-4 py-3.5 text-[var(--muted)]">
        {invoice.project_title || invoice.milestone_title || '—'}
      </td>
      <td className="px-4 py-3.5 text-[var(--muted)]">{formatDate(invoice.issue_date)}</td>
      <td
        className={cn(
          'px-4 py-3.5',
          isOverdue ? 'font-semibold text-[var(--red)]' : 'text-[var(--muted)]'
        )}
      >
        {formatDate(invoice.due_date)}
      </td>
      <td className="mono px-4 py-3.5 text-right font-semibold text-[var(--text)]">
        {formatCurrency(invoice.total_amount, invoice.currency)}
      </td>
      <td className="px-4 py-3.5">
        <Badge status={invoice.status} />
      </td>
      <td className="px-4 py-3.5 text-right">
        <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Link to="/invoices/$invoiceId" params={{ invoiceId: invoice.id }}>
            <Button size="sm" variant="secondary">
              <Eye className="h-3 w-3" strokeWidth={1.8} />
              View
            </Button>
          </Link>
          {invoice.status === 'sent' && (
            <Button size="sm" onClick={onMarkPaid}>
              <CheckCircle2 className="h-3 w-3" strokeWidth={1.8} />
              Mark paid
            </Button>
          )}
          {invoice.status === 'overdue' && (
            <Button size="sm" variant="secondary" onClick={onSendReminder}>
              <BellRing className="h-3 w-3" strokeWidth={1.8} />
              Reminder
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

function ReminderPreviewModal({
  invoice,
  onClose,
}: {
  invoice: Invoice | null;
  onClose: () => void;
}) {
  if (!invoice) return null;

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Reminder preview"
      subtitle="Preview the reminder copy before sending it from your normal email client."
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={async () => {
              const subject = `Payment reminder for ${invoice.invoice_number}`;
              const body = `Hi ${invoice.client_name || 'there'},%0D%0A%0D%0AThis is a quick reminder that invoice ${invoice.invoice_number} for ${formatCurrency(invoice.total_amount, invoice.currency)} was due on ${formatDate(invoice.due_date)}.%0D%0A%0D%0AProject: ${invoice.project_title || 'FreelanceFlow work'}%0D%0A%0D%0APlease let me know if you need the invoice resent or have any payment updates.%0D%0A%0D%0AThanks.`;
              window.location.href = `mailto:${invoice.client_email || ''}?subject=${encodeURIComponent(subject)}&body=${body}`;
              onClose();
            }}
          >
            Open email draft
          </Button>
        </>
      }
    >
      <div className="rounded-[8px] border border-[var(--line)] bg-[var(--panel-soft)] p-4">
        <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--faint)]">
          To
        </div>
        <div className="mt-1 text-[13px] text-[var(--text)]">
          {invoice.client_name || 'Client'} {invoice.client_email ? `<${invoice.client_email}>` : ''}
        </div>

        <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--faint)]">
          Subject
        </div>
        <div className="mt-1 text-[13px] font-semibold text-[var(--text)]">
          Payment reminder for {invoice.invoice_number}
        </div>

        <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--faint)]">
          Body
        </div>
        <div className="mt-2 whitespace-pre-line text-[13px] leading-6 text-[var(--muted)]">
          {`Hi ${invoice.client_name || 'there'},\n\nThis is a quick reminder that invoice ${invoice.invoice_number} for ${formatCurrency(invoice.total_amount, invoice.currency)} was due on ${formatDate(invoice.due_date)}.\n\nProject: ${invoice.project_title || 'FreelanceFlow work'}\n\nPlease let me know if you need the invoice resent or have any payment updates.\n\nThanks.`}
        </div>
      </div>
    </Modal>
  );
}
