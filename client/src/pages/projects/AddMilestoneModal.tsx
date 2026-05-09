import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useCreateMilestone } from '../../hooks/useMilestones';
import { ApiError } from '../../lib/api';

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  due_date: z.string().min(1, 'Due date is required'),
  amount: z.coerce.number().positive('Amount must be greater than zero'),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export default function AddMilestoneModal({ isOpen, onClose, projectId }: Props) {
  const create = useCreateMilestone(projectId);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({ resolver: zodResolver(schema) });

  function handleClose() {
    reset();
    setSubmitError(null);
    onClose();
  }

  async function onSubmit(values: FormOutput) {
    setSubmitError(null);
    try {
      await create.mutateAsync(values);
      handleClose();
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : 'Could not add milestone'
      );
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add milestone"
      subtitle="Define a deliverable, due date, and amount."
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            Add milestone
          </Button>
        </>
      }
    >
      <Field label="Title">
        <Input
          placeholder="Wireframes & Mockups"
          error={errors.title?.message}
          {...register('title')}
        />
      </Field>

      <Field label="Description">
        <textarea
          rows={2}
          placeholder="What's included in this milestone?"
          className="min-h-[64px] w-full rounded-[7px] border border-[var(--line-strong)] bg-white px-3 py-2.5 text-[13px] outline-none focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/15"
          {...register('description')}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Due date">
          <Input
            type="date"
            error={errors.due_date?.message}
            {...register('due_date')}
          />
        </Field>
        <Field label="Amount">
          <Input
            type="number"
            inputMode="decimal"
            placeholder="12000"
            error={errors.amount?.message}
            {...register('amount')}
          />
        </Field>
      </div>

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
