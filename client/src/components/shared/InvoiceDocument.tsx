import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatCurrency, formatDate } from '../../utils';
import type { Invoice, User } from '../../types';

interface InvoiceDocumentProps {
  invoice: Invoice;
  currentUser?: User | null;
}

export default function InvoiceDocument({
  invoice,
  currentUser,
}: InvoiceDocumentProps) {
  const taxLabel = invoice.tax_label || 'Tax';
  const businessName =
    currentUser?.business_name || currentUser?.name || invoice.freelancer_name || 'FreelanceFlow';
  const senderName = currentUser?.name || invoice.freelancer_name || 'Freelancer';
  const senderEmail = currentUser?.email || invoice.freelancer_email || '—';
  const senderPhone = currentUser?.phone || '—';
  const senderLocation = currentUser?.location || '—';
  const paymentDetails = [
    { label: 'UPI', value: currentUser?.upi_id || 'Add in Settings' },
    { label: 'Bank', value: currentUser?.bank_name || 'Add in Settings' },
    { label: 'A/C', value: currentUser?.account_number || 'Add in Settings' },
    { label: 'IFSC', value: currentUser?.ifsc_code || 'Add in Settings' },
    {
      label: 'Holder',
      value: currentUser?.account_holder_name || senderName,
    },
  ];

  return (
    <Card className="overflow-hidden bg-white p-0">
      <div className="border-b border-[var(--line)] px-7 py-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--green-soft)] text-lg font-bold text-[var(--green-dark)]">
              F
            </div>
            <div className="mt-3 text-[18px] font-bold text-[var(--text)]">
              {businessName}
            </div>
            <div className="mt-2 text-[12px] leading-6 text-[var(--muted)]">
              <div>{senderName}</div>
              <div>{senderEmail}</div>
              <div>{senderPhone}</div>
              <div>{senderLocation}</div>
            </div>
          </div>

          <div className="text-left lg:text-right">
            <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--faint)]">
              Invoice
            </div>
            <div className="mono mt-2 text-[28px] font-bold tracking-[-0.02em] text-[var(--green-dark)]">
              {invoice.invoice_number}
            </div>
            <div className="mt-3 inline-flex">
              <Badge status={invoice.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 text-[12px] lg:text-right">
              <Meta label="Issued" value={formatDate(invoice.issue_date)} />
              <Meta label="Due" value={formatDate(invoice.due_date)} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 border-b border-[var(--line)] px-7 py-6 lg:grid-cols-2">
        <PartyBlock
          title="From"
          lines={[
            businessName,
            senderName,
            senderEmail,
            senderPhone,
            senderLocation,
          ]}
        />
        <PartyBlock
          title="To"
          lines={[
            invoice.client_company || invoice.client_name || 'Client',
            invoice.client_name || invoice.client_company || '—',
            invoice.client_email || '—',
            invoice.client_phone || '—',
            invoice.client_location || '—',
          ]}
        />
      </div>

      <div className="px-7 py-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-[var(--line)] text-[11px] font-bold uppercase tracking-[0.05em] text-[var(--faint)]">
              <tr>
                <th className="pb-3">Description</th>
                <th className="pb-3 text-center">Qty</th>
                <th className="pb-3 text-right">Rate</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(invoice.items || []).map((item) => (
                <tr key={item.id} className="border-b border-[var(--line)] last:border-b-0">
                  <td className="py-4">
                    <div className="font-semibold text-[var(--text)]">
                      {item.description}
                    </div>
                    {invoice.project_title && (
                      <div className="mt-1 text-[12px] text-[var(--muted)]">
                        {invoice.project_title}
                        {invoice.milestone_title ? ` · ${invoice.milestone_title}` : ''}
                      </div>
                    )}
                  </td>
                  <td className="py-4 text-center text-[var(--muted)]">
                    {item.quantity}
                  </td>
                  <td className="mono py-4 text-right text-[var(--text)]">
                    {formatCurrency(item.rate, invoice.currency)}
                  </td>
                  <td className="mono py-4 text-right font-semibold text-[var(--text)]">
                    {formatCurrency(item.amount, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 border-t border-[var(--line)] px-7 py-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-5">
          <InfoBlock
            title="Notes"
            body={
              invoice.notes ||
              'No additional notes on this invoice. You can add invoice-specific notes before sending.'
            }
          />
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.07em] text-[var(--faint)]">
              Payment details
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {paymentDetails.map((detail) => (
                <div
                  key={detail.label}
                  className="rounded-[7px] border border-[var(--line)] bg-[var(--panel-soft)] px-3 py-2.5"
                >
                  <div className="text-[11px] font-semibold text-[var(--faint)]">
                    {detail.label}
                  </div>
                  <div className="mono mt-1 text-[12px] font-semibold text-[var(--text)]">
                    {detail.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[10px] border border-[var(--line)] bg-[var(--panel-soft)] p-4">
          <TotalRow
            label="Subtotal"
            value={formatCurrency(invoice.subtotal, invoice.currency)}
          />
          <TotalRow
            label={`${taxLabel}${invoice.tax_rate ? ` (${Math.round(Number(invoice.tax_rate) * 100)}%)` : ''}`}
            value={formatCurrency(invoice.tax_amount, invoice.currency)}
          />
          <div className="my-3 h-px bg-[var(--line)]" />
          <TotalRow
            label="Total due"
            value={formatCurrency(invoice.total_amount, invoice.currency)}
            emphasis
          />
        </div>
      </div>
    </Card>
  );
}

function PartyBlock({
  title,
  lines,
}: {
  title: string;
  lines: string[];
}) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-[0.07em] text-[var(--faint)]">
        {title}
      </div>
      <div className="mt-3 space-y-1 text-[13px] leading-6 text-[var(--muted)]">
        {lines.map((line, index) => (
          <div
            key={`${title}-${index}`}
            className={index === 0 ? 'font-semibold text-[var(--text)]' : undefined}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <>
      <div className="text-[var(--faint)]">{label}</div>
      <div className="font-semibold text-[var(--text)]">{value}</div>
    </>
  );
}

function InfoBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-[0.07em] text-[var(--faint)]">
        {title}
      </div>
      <p className="mt-3 text-[13px] leading-6 text-[var(--muted)]">{body}</p>
    </div>
  );
}

function TotalRow({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span
        className={
          emphasis
            ? 'text-[14px] font-bold text-[var(--text)]'
            : 'text-[12px] font-medium text-[var(--muted)]'
        }
      >
        {label}
      </span>
      <span
        className={`mono ${emphasis ? 'text-[18px] font-bold text-[var(--text)]' : 'text-[13px] font-semibold text-[var(--text)]'}`}
      >
        {value}
      </span>
    </div>
  );
}
