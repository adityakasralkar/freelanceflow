import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useClients } from '../../hooks/useClients';
import {
  useCreateProposal,
  useUpdateProposalStatus,
} from '../../hooks/useProposals';
import { ApiError } from '../../lib/api';

const PAYMENT_TERMS = [
  '100% upfront',
  '50% upfront · 50% on delivery',
  'Milestone-based',
  'On delivery',
  'Net 14',
  'Net 30',
];

const schema = z.object({
  client_id: z.string().uuid('Pick a client'),
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
}

export default function CreateProposalModal({ isOpen, onClose }: Props) {
  const { data: clients = [] } = useClients();
  const createProposal = useCreateProposal();
  const updateStatus = useUpdateProposalStatus();

  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [deliverableInput, setDeliverableInput] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({ resolver: zodResolver(schema) });

  function reset_state() {
    reset();
    setDeliverables([]);
    setDeliverableInput('');
    setSubmitError(null);
  }

  function handleClose() {
    reset_state();
    onClose();
  }

  function addDeliverable() {
    const v = deliverableInput.trim();
    if (!v) return;
    if (deliverables.includes(v)) return;
    setDeliverables([...deliverables, v]);
    setDeliverableInput('');
  }

  async function submit(values: FormOutput, sendImmediately: boolean) {
    setSubmitError(null);
    try {
      const created = await createProposal.mutateAsync({
        ...values,
        deliverables,
      });
      if (sendImmediately) {
        await updateStatus.mutateAsync({ id: created.id, status: 'sent' });
      }
      reset_state();
      onClose();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not create proposal';
      setSubmitError(msg);
    }
  }

  const onSaveDraft = handleSubmit((v) => submit(v, false));
  const onSend = handleSubmit((v) => submit(v, true));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="New proposal"
      subtitle="Fill in the details and send it to your client."
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={onSaveDraft} isLoading={isSubmitting}>
            Save draft
          </Button>
          <Button onClick={onSend} isLoading={isSubmitting}>
            Send to client
          </Button>
        </>
      }
    >
      <Field label="Client">
        <select
          className="h-[38px] w-full rounded-[7px] border border-[var(--line-strong)] bg-white px-3 text-[13px] text-[var(--text)] outline-none focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/15"
          {...register('client_id')}
          defaultValue=""
        >
          <option value="" disabled>
            {clients.length === 0
              ? 'No clients yet — add one first'
              : 'Select a client…'}
          </option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {c.company ? ` · ${c.company}` : ''}
            </option>
          ))}
        </select>
        {errors.client_id && (
          <ErrText>{errors.client_id.message}</ErrText>
        )}
      </Field>

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
          defaultValue=""
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
        helper="Press Enter to add. These appear on the proposal and seed milestones once accepted."
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
                  onClick={() =>
                    setDeliverables(deliverables.filter((_, idx) => idx !== i))
                  }
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

      {clients.length === 0 && (
        <div className="rounded-md border border-[#FDE68A] bg-[var(--amber-soft)] px-3 py-2 text-[12.5px] text-[#7C2D12]">
          You don't have any clients yet. Add a client first from the Clients page.
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
      {helper && (
        <div className="text-[11px] text-[var(--muted)]">{helper}</div>
      )}
    </div>
  );
}

function ErrText({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] text-[var(--red)]">{children}</p>;
}
