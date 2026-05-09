import { useMemo, useState } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { CheckCircle2, Download, Mail, Send } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import InvoiceDocument from '../../components/shared/InvoiceDocument';
import { useInvoice, useUpdateInvoiceStatus } from '../../hooks/useInvoices';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency, formatDate } from '../../utils';
import type { InvoiceStatus } from '../../types';

export default function InvoiceDetailPage() {
  const { invoiceId } = useParams({ strict: false }) as { invoiceId: string };
  const user = useAuthStore((state) => state.user);
  const { data: invoice, isLoading } = useInvoice(invoiceId);
  const updateStatus = useUpdateInvoiceStatus();
  const [nextStatus, setNextStatus] = useState<InvoiceStatus | null>(null);

  const canSend = invoice?.status === 'draft';
  const canMarkPaid = invoice?.status === 'sent' || invoice?.status === 'overdue';

  const totals = useMemo(() => {
    if (!invoice) return null;
    return {
      subtotal: formatCurrency(invoice.subtotal, invoice.currency),
      tax: formatCurrency(invoice.tax_amount, invoice.currency),
      total: formatCurrency(invoice.total_amount, invoice.currency),
    };
  }, [invoice]);

  async function handleConfirmStatus() {
    if (!invoice || !nextStatus) return;
    const statusToApply = nextStatus;
    await updateStatus.mutateAsync({ id: invoice.id, status: statusToApply });
    setNextStatus(null);
    if (statusToApply === 'sent') {
      openMailDraft();
    }
  }

  function openMailDraft() {
    if (!invoice) return;
    const subject = `Invoice ${invoice.invoice_number} from ${user?.business_name || user?.name || 'FreelanceFlow'}`;
    const body = `Hi ${invoice.client_name || 'there'},%0D%0A%0D%0APlease find invoice ${invoice.invoice_number} for ${formatCurrency(invoice.total_amount, invoice.currency)}.%0D%0A%0D%0AProject: ${invoice.project_title || invoice.milestone_title || 'FreelanceFlow work'}%0D%0AIssue date: ${formatDate(invoice.issue_date)}%0D%0ADue date: ${formatDate(invoice.due_date)}%0D%0A%0D%0AThanks.`;
    window.location.href = `mailto:${invoice.client_email || ''}?subject=${encodeURIComponent(subject)}&body=${body}`;
  }

  if (isLoading) {
    return (
      <PageLayout title="Loading invoice…">
        <div className="text-sm text-[var(--muted)]">Loading invoice…</div>
      </PageLayout>
    );
  }

  if (!invoice) {
    return (
      <PageLayout
        title="Invoice not found"
        breadcrumb={[{ label: 'Invoices' }, { label: 'Not found' }]}
      >
        <Link
          to="/invoices"
          className="text-[13px] font-semibold text-[var(--green-dark)] hover:underline"
        >
          ← Back to Invoices
        </Link>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout
        title={invoice.invoice_number}
        subtitle={
          invoice.milestone_title
            ? `Auto-generated from ${invoice.milestone_title}`
            : `Issued ${formatDate(invoice.issue_date)}`
        }
        breadcrumb={[{ label: 'Invoices' }, { label: invoice.invoice_number }]}
        actions={
          <>
            <Badge status={invoice.status} />
            <Button variant="secondary" onClick={() => window.print()}>
              <Download className="h-3.5 w-3.5" strokeWidth={2} />
              Download PDF
            </Button>
            {canSend && (
              <Button
                onClick={() => setNextStatus('sent')}
                disabled={!invoice.client_email || updateStatus.isPending}
              >
                <Send className="h-3.5 w-3.5" strokeWidth={2} />
                Send to client
              </Button>
            )}
            {canMarkPaid && (
              <Button onClick={() => setNextStatus('paid')}>
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                Mark paid
              </Button>
            )}
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <InvoiceDocument invoice={invoice} currentUser={user} />

          <div className="space-y-4 print:hidden">
            <Card className="p-5">
              <h3 className="text-[14px] font-bold text-[var(--text)]">Invoice summary</h3>
              <div className="mt-4 space-y-3">
                <SummaryRow label="Client" value={invoice.client_name || '—'} />
                <SummaryRow
                  label="Project"
                  value={invoice.project_title || invoice.milestone_title || '—'}
                />
                <SummaryRow label="Issue date" value={formatDate(invoice.issue_date)} />
                <SummaryRow label="Due date" value={formatDate(invoice.due_date)} />
                <SummaryRow label="Subtotal" value={totals?.subtotal || '—'} mono />
                <SummaryRow
                  label={invoice.tax_label || 'Tax'}
                  value={totals?.tax || '—'}
                  mono
                />
                <div className="h-px bg-[var(--line)]" />
                <SummaryRow label="Total" value={totals?.total || '—'} mono emphasis />
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-[14px] font-bold text-[var(--text)]">Next step</h3>
              <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">
                {invoice.status === 'draft' &&
                  'Review the invoice details, then send it to the client when you are ready.'}
                {invoice.status === 'sent' &&
                  'The invoice is with the client. Mark it paid when the payment arrives.'}
                {invoice.status === 'overdue' &&
                  'This invoice is overdue. You can send a reminder from the invoices list or mark it paid after confirmation.'}
                {invoice.status === 'paid' &&
                  'Payment is complete. This invoice now contributes to your earned revenue totals.'}
              </p>

              <div className="mt-4 flex flex-col gap-2">
                {(invoice.status === 'draft' || invoice.status === 'sent') && (
                  <Button variant="secondary" onClick={openMailDraft}>
                    <Mail className="h-3.5 w-3.5" strokeWidth={2} />
                    Open email draft
                  </Button>
                )}
                <Link to="/projects/$projectId" params={{ projectId: invoice.project_id || '' }}>
                  <Button
                    variant="ghost"
                    className="w-full justify-center"
                    disabled={!invoice.project_id}
                  >
                    View project
                  </Button>
                </Link>
              </div>

              {canSend && !invoice.client_email && (
                <div className="mt-4 rounded-[8px] border border-[#FDE68A] bg-[var(--amber-soft)] px-3 py-2 text-[12px] text-[#92400e]">
                  Add a client email on the client profile before sending this invoice.
                </div>
              )}
            </Card>
          </div>
        </div>
      </PageLayout>

      <ConfirmDialog
        isOpen={!!nextStatus}
        onClose={() => setNextStatus(null)}
        onConfirm={handleConfirmStatus}
        title={nextStatus === 'sent' ? 'Send invoice?' : 'Mark invoice as paid?'}
        message={
          nextStatus === 'sent'
            ? 'This updates the invoice status to sent so it appears in pending collections.'
            : 'This updates the invoice status to paid and refreshes dashboard totals.'
        }
        confirmLabel={nextStatus === 'sent' ? 'Send invoice' : 'Mark paid'}
        isLoading={updateStatus.isPending}
      />
    </>
  );
}

function SummaryRow({
  label,
  value,
  mono = false,
  emphasis = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[12px] text-[var(--muted)]">{label}</span>
      <span
        className={[
          mono ? 'mono' : '',
          emphasis ? 'text-[15px] font-bold text-[var(--text)]' : 'text-[13px] font-semibold text-[var(--text)]',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {value}
      </span>
    </div>
  );
}
