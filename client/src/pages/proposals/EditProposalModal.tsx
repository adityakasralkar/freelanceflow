import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useUpdateProposal } from '../../hooks/useProposals';
import { ApiError } from '../../lib/api';
import type { Proposal } from '../../types';

const PAYMENT_TERMS = [
  '100% upfront',
  '50% upfront · 50% on delivery',
  'Milestone-based',
  'On delivery',
  'Net 14',
  'Net 30',
];

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  valid_until: z.string().optional(),
  payment_terms: z.string().optional(),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  proposal: Proposal;
}

export default function EditProposalModal({ isOpen, onClose, proposal }: Props) {
  const updateProposal = useUpdateProposal();

  const [deliverables, setDeliverables] = useState<string[]>(proposal.deliverables ?? []);
  const [deliverableInput, setDeliverableInput] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: proposal.title,
      description: proposal.description ?? '',
      amount: String(proposal.amount),
      valid_until: proposal.valid_until ?? '',
      payment_terms: proposal.payment_terms ?? '',
    },
  });

  function addDeliverable() {
    const v = deliverableInput.trim();
    if (!v || deliverables.includes(v)) return;
    setDeliverables([...deliverables, v]);
    setDeliverableInput('');
  }

  async function onSave(values: FormOutput) {
    setSubmitError(null);
    try {
      await updateProposal.mutateAsync({ id: proposal.id, ...values, deliverables });
      onClose();
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Could not save changes');
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit proposal"
      subtitle="Update the proposal details. Client won't be re-notified automatically."
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSave)} isLoading={isSubmitting}>
            Save changes
          </Button>
        </>
      }
    >
      <Field label="Project title">
        <Input
          placeholder="Website Redesign"
          error={errors.title?.message}
          {...register('title')}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Total amount">
          <Input
            type="number"
            inputMode="decimal"
            placeholder="45000"
            error={errors.amount?.message}
            {...register('amount')}
          />
        </Field>
        <Field label="Valid until">
          <Input type="date" {...register('valid_until')} />
        </Field>
      </div>

      <Field label="Payment terms">
        <select
          className="h-[38px] w-full rounded-[7px] border border-[var(--line-strong)] bg-white px-3 text-[13px] text-[var(--text)] outline-none focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/15"
          {...register('payment_terms')}
        >
          <option value="">No specific terms</option>
          {PAYMENT_TERMS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Description">
        <textarea
          rows={3}
          placeholder="Brief overview of what's included…"
          className="min-h-[80px] w-full rounded-[7px] border border-[var(--line-strong)] bg-white px-3 py-2.5 text-[13px] text-[var(--text)] outline-none focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/15"
          {...register('description')}
        />
      </Field>

      <Field
        label="Deliverables"
        helper="Press Enter to add or remove existing ones."
      >
        <div className="flex gap-2">
          <input
            value={deliverableInput}
            onChange={(e) => setDeliverableInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addDeliverable();
              }
            }}
            placeholder="Homepage redesign"
            className="h-[38px] flex-1 rounded-[7px] border border-[var(--line-strong)] bg-white px-3 text-[13px] outline-none focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/15"
          />
          <Button variant="secondary" onClick={addDeliverable}>
            Add
          </Button>
        </div>
        {deliverables.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {deliverables.map((d, i) => (
              <li
                key={i}
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--line)] bg-[var(--panel-soft)] px-2 py-1 text-[12px] text-[var(--text)]"
              >
                {d}
                <button
                  type="button"
                  onClick={() => setDeliverables(deliverables.filter((_, idx) => idx !== i))}
                  className="text-[var(--faint)] hover:text-[var(--red)]"
                  aria-label={`Remove ${d}`}
                >
                  <X className="h-3 w-3" strokeWidth={1.75} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Field>

      {submitError && (
        <div className="rounded-md border border-[#FECACA] bg-[var(--red-soft)] px-3 py-2 text-[12.5px] text-[var(--red)]">
          {submitError}
        </div>
      )}
    </Modal>
  );
}

function Field({
  label,
  children,
  helper,
}: {
  label: string;
  children: React.ReactNode;
  helper?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-[var(--text)]">{label}</label>
      {children}
      {helper && <div className="text-[11px] text-[var(--muted)]">{helper}</div>}
    </div>
  );
}
