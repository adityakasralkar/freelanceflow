import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useGenerateInvoice } from '../../hooks/useInvoices';
import { ApiError } from '../../lib/api';

interface Props {
  milestoneId: string | null;
  onClose: () => void;
}

const PRESETS = [
  { label: 'No tax', rate: 0, taxLabel: '' },
  { label: 'GST 18%', rate: 0.18, taxLabel: 'GST' },
  { label: 'GST 5%', rate: 0.05, taxLabel: 'GST' },
  { label: 'VAT 20%', rate: 0.2, taxLabel: 'VAT' },
];

export default function GenerateInvoiceModal({ milestoneId, onClose }: Props) {
  if (!milestoneId) return null;

  return (
    <GenerateInvoiceForm
      key={milestoneId}
      milestoneId={milestoneId}
      onClose={onClose}
    />
  );
}

function GenerateInvoiceForm({
  milestoneId,
  onClose,
}: {
  milestoneId: string;
  onClose: () => void;
}) {
  const generate = useGenerateInvoice();
  const navigate = useNavigate();
  const defaults = getDefaultDates();

  const [presetIdx, setPresetIdx] = useState(0);
  const [issueDate, setIssueDate] = useState(defaults.issueDate);
  const [dueDate, setDueDate] = useState(defaults.dueDate);
  const [notes, setNotes] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleGenerate() {
    const preset = PRESETS[presetIdx];
    setSubmitError(null);
    try {
      const invoice = await generate.mutateAsync({
        milestoneId,
        tax_rate: preset.rate,
        tax_label: preset.taxLabel || undefined,
        issue_date: issueDate || undefined,
        due_date: dueDate || undefined,
        notes: notes || undefined,
      });
      onClose();
      navigate({ to: '/invoices/$invoiceId', params: { invoiceId: invoice.id } });
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : 'Could not generate invoice'
      );
    }
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Generate invoice"
      subtitle="Auto-creates an invoice from this milestone with the selected tax."
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Skip for now
          </Button>
          <Button onClick={handleGenerate} isLoading={generate.isPending}>
            Generate invoice
          </Button>
        </>
      }
    >
      <Field label="Tax">
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p, i) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setPresetIdx(i)}
              className={
                'rounded-md border px-2.5 py-1.5 text-[12px] font-medium transition-colors ' +
                (presetIdx === i
                  ? 'border-[var(--green)] bg-[var(--green-soft)] text-[var(--green-dark)]'
                  : 'border-[var(--line-strong)] bg-white text-[var(--muted)] hover:border-[var(--muted)] hover:text-[var(--text)]')
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Issue date">
          <Input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />
        </Field>
        <Field label="Due date">
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </Field>
      </div>

      <Field label="Notes (optional)">
        <textarea
          rows={2}
          placeholder="Anything you want the client to see on the invoice…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[64px] w-full rounded-[7px] border border-[var(--line-strong)] bg-white px-3 py-2.5 text-[13px] outline-none focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/15"
        />
      </Field>

      {submitError && (
        <div className="rounded-md border border-[#FECACA] bg-[var(--red-soft)] px-3 py-2 text-[12.5px] text-[var(--red)]">
          {submitError}
        </div>
      )}

      <div className="rounded-md border border-[#BFDBFE] bg-[var(--blue-soft)] px-3 py-2 text-[12.5px] text-[#1E40AF]">
        The invoice number is generated automatically. You can review and edit
        the invoice afterwards before sending.
      </div>
    </Modal>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-[var(--text)]">{label}</label>
      {children}
    </div>
  );
}

function getDefaultDates() {
  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 15);
  return {
    issueDate: today.toISOString().split('T')[0],
    dueDate: due.toISOString().split('T')[0],
  };
}
