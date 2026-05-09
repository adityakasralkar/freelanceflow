import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useCreateClient, useUpdateClient } from '../../hooks/useClients';
import { ApiError } from '../../lib/api';
import type { Client } from '../../types';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  company: z.string().optional(),
  email: z.union([z.string().email('Enter a valid email'), z.literal('')]).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  currency: z.string().min(3).max(3).default('INR'),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
}

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'AED'];

export default function ClientFormModal({
  isOpen,
  onClose,
  client,
}: ClientFormModalProps) {
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      location: '',
      currency: 'INR',
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    reset({
      name: client?.name || '',
      company: client?.company || '',
      email: client?.email || '',
      phone: client?.phone || '',
      location: client?.location || '',
      currency: client?.currency || 'INR',
    });
  }, [client, isOpen, reset]);

  function handleClose() {
    reset();
    setSubmitError(null);
    onClose();
  }

  async function onSubmit(values: FormOutput) {
    setSubmitError(null);
    const payload = {
      ...values,
      company: values.company || undefined,
      email: values.email || undefined,
      phone: values.phone || undefined,
      location: values.location || undefined,
    };

    try {
      if (client) {
        await updateClient.mutateAsync({ id: client.id, ...payload });
      } else {
        await createClient.mutateAsync(payload);
      }
      handleClose();
    } catch (error) {
      setSubmitError(
        error instanceof ApiError ? error.message : 'Could not save client'
      );
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={client ? 'Edit client' : 'Add client'}
      subtitle="Capture the essentials so proposals, projects, and invoices stay connected."
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            {client ? 'Save changes' : 'Add client'}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          label="Client name"
          placeholder="Priya Sharma"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Company"
          placeholder="TechNova Inc"
          {...register('company')}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          label="Email"
          type="email"
          placeholder="priya@technova.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Phone"
          placeholder="+91 98765 12345"
          {...register('phone')}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_120px]">
        <Input
          label="Location"
          placeholder="Bengaluru, India"
          {...register('location')}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[var(--text)]">
            Currency
          </label>
          <select
            className="h-[38px] w-full rounded-[7px] border border-[var(--line-strong)] bg-white px-3 text-[13px] text-[var(--text)] outline-none focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/15"
            {...register('currency')}
          >
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
      </div>

      {submitError && (
        <div className="rounded-md border border-[#FECACA] bg-[var(--red-soft)] px-3 py-2 text-[12.5px] text-[var(--red)]">
          {submitError}
        </div>
      )}
    </Modal>
  );
}
