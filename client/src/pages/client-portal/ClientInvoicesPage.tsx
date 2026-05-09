import { Link } from '@tanstack/react-router';
import { CheckCircle2, Download, Receipt } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/shared/EmptyState';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import StatCard from '../../components/shared/StatCard';
import { useAcknowledgeClientInvoice, useClientInvoices } from '../../hooks/useClientPortal';
import { formatCurrency, formatDate } from '../../utils';
import type { Invoice } from '../../types';
import { useState } from 'react';

export default function ClientInvoicesPage() {
  const [invoiceToAcknowledge, setInvoiceToAcknowledge] = useState<Invoice | null>(null);
  const { data: invoices = [], isLoading } = useClientInvoices();
  const acknowledge = useAcknowledgeClientInvoice();

  const currency = invoices[0]?.currency || 'INR';
  const totalBilled = invoices.reduce((sum, invoice) => sum + Number(invoice.total_amount), 0);
  const outstanding = invoices
    .filter((invoice) => invoice.status !== 'paid')
    .reduce((sum, invoice) => sum + Number(invoice.total_amount), 0);
  const paidYtd = invoices
    .filter((invoice) => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + Number(invoice.total_amount), 0);

  async function handleAcknowledge() {
    if (!invoiceToAcknowledge) return;
    await acknowledge.mutateAsync(invoiceToAcknowledge.id);
    setInvoiceToAcknowledge(null);
  }

  return (
    <>
      <PageLayout title="Invoices" subtitle="Download or acknowledge your invoices.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard label="Total billed" value={formatCurrency(totalBilled, currency)} tone="purple" />
          <StatCard label="Outstanding" value={formatCurrency(outstanding, currency)} tone="amber" />
          <StatCard label="Paid YTD" value={formatCurrency(paidYtd, currency)} tone="green" />
        </div>

        <Card className="mt-6 overflow-hidden p-0">
          {isLoading ? (
            <div className="px-5 py-6 text-sm text-[var(--muted)]">Loading invoices…</div>
          ) : invoices.length === 0 ? (
            <EmptyState
              icon={Receipt}
              heading="No invoices yet"
              subtext="Your freelancer hasn't issued any invoices to you yet."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[var(--panel-soft)] text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--muted)]">
                  <tr>
                    <th className="px-4 py-2.5">Invoice</th>
                    <th className="px-4 py-2.5">Project</th>
                    <th className="px-4 py-2.5">Issued</th>
                    <th className="px-4 py-2.5">Due</th>
                    <th className="px-4 py-2.5 text-right">Amount</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-[var(--line)] last:border-b-0">
                      <td className="mono px-4 py-3.5 font-semibold text-[var(--green-dark)]">
                        <Link
                          to="/client/invoices/$invoiceId"
                          params={{ invoiceId: invoice.id }}
                          className="hover:underline"
                        >
                          {invoice.invoice_number}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 text-[var(--text)]">
                        {invoice.project_title || 'Invoice'}
                      </td>
                      <td className="px-4 py-3.5 text-[var(--muted)]">
                        {formatDate(invoice.issue_date)}
                      </td>
                      <td className="px-4 py-3.5 text-[var(--muted)]">
                        {formatDate(invoice.due_date)}
                      </td>
                      <td className="mono px-4 py-3.5 text-right font-semibold text-[var(--text)]">
                        {formatCurrency(invoice.total_amount, invoice.currency)}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge status={invoice.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex justify-end gap-2">
                          <Link to="/client/invoices/$invoiceId" params={{ invoiceId: invoice.id }}>
                            <Button size="sm" variant="secondary">
                              <Download className="h-3 w-3" strokeWidth={1.8} />
                              View
                            </Button>
                          </Link>
                          {invoice.status === 'sent' && (
                            <Button size="sm" onClick={() => setInvoiceToAcknowledge(invoice)}>
                              <CheckCircle2 className="h-3 w-3" strokeWidth={1.8} />
                              Mark paid
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </PageLayout>

      <ConfirmDialog
        isOpen={!!invoiceToAcknowledge}
        onClose={() => setInvoiceToAcknowledge(null)}
        onConfirm={handleAcknowledge}
        title="Mark invoice as paid?"
        message="Use this after you've completed payment so your freelancer sees the invoice as settled."
        confirmLabel="Mark paid"
        isLoading={acknowledge.isPending}
      />
    </>
  );
}
