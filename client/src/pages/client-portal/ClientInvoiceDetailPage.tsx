import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { CheckCircle2, Download } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import InvoiceDocument from '../../components/shared/InvoiceDocument';
import { useAcknowledgeClientInvoice, useClientInvoice } from '../../hooks/useClientPortal';
import { formatCurrency, formatDate } from '../../utils';

export default function ClientInvoiceDetailPage() {
  const { invoiceId } = useParams({ strict: false }) as { invoiceId: string };
  const { data: invoice, isLoading } = useClientInvoice(invoiceId);
  const acknowledge = useAcknowledgeClientInvoice();
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleAcknowledge() {
    if (!invoice) return;
    await acknowledge.mutateAsync(invoice.id);
    setConfirmOpen(false);
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
        <div className="text-sm text-[var(--muted)]">
          We couldn't find this invoice in your portal.
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout
        title={invoice.invoice_number}
        subtitle={`From ${invoice.freelancer_name || 'your freelancer'} · Issued ${formatDate(invoice.issue_date)}`}
        breadcrumb={[{ label: 'Invoices' }, { label: invoice.invoice_number }]}
        actions={
          <>
            <Badge status={invoice.status} />
            <Button variant="secondary" onClick={() => window.print()}>
              <Download className="h-3.5 w-3.5" strokeWidth={2} />
              Download PDF
            </Button>
            {invoice.status === 'sent' && (
              <Button onClick={() => setConfirmOpen(true)}>
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                Mark paid
              </Button>
            )}
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <InvoiceDocument invoice={invoice} />

          <div className="space-y-4 print:hidden">
            <Card className="p-5">
              <h3 className="text-[14px] font-bold text-[var(--text)]">Invoice summary</h3>
              <div className="mt-4 space-y-3">
                <Metric label="Project" value={invoice.project_title || '—'} />
                <Metric label="Issue date" value={formatDate(invoice.issue_date)} />
                <Metric label="Due date" value={formatDate(invoice.due_date)} />
                <Metric label="Subtotal" value={formatCurrency(invoice.subtotal, invoice.currency)} mono />
                <Metric label={invoice.tax_label || 'Tax'} value={formatCurrency(invoice.tax_amount, invoice.currency)} mono />
                <div className="h-px bg-[var(--line)]" />
                <Metric label="Total" value={formatCurrency(invoice.total_amount, invoice.currency)} mono emphasis />
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-[14px] font-bold text-[var(--text)]">Payment</h3>
              <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">
                {invoice.status === 'paid'
                  ? 'This invoice is already marked as paid.'
                  : 'Once you have completed payment, mark the invoice as paid so your freelancer sees it immediately.'}
              </p>
            </Card>
          </div>
        </div>
      </PageLayout>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleAcknowledge}
        title="Mark invoice as paid?"
        message="This tells your freelancer the payment is complete."
        confirmLabel="Mark paid"
        isLoading={acknowledge.isPending}
      />
    </>
  );
}

function Metric({
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
