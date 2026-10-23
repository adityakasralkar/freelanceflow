import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from '@tanstack/react-router';
import { Mail, MailCheck } from 'lucide-react';
import AuthLayout from './AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { api, ApiError } from '../../lib/api';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
});

type ForgotForm = z.infer<typeof schema>;

const FEATURES = [
  'Send polished proposals in minutes',
  'Convert accepted proposals to projects',
  'Auto-generate invoices from completed milestones',
  'See cash flow at a glance',
];

export default function ForgotPasswordPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({ resolver: zodResolver(schema) });

  async function onSubmit(values: ForgotForm) {
    setSubmitError(null);
    try {
      await api.post('/auth/forgot-password', values);
      // Backend always returns the same message regardless of whether the email
      // exists. Show the same confirmation either way.
      setSubmittedEmail(values.email);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.';
      setSubmitError(msg);
    }
  }

  // ---------------------------------------------------------------------------
  // Confirmation state
  // ---------------------------------------------------------------------------
  if (submittedEmail) {
    return (
      <AuthLayout heading="Reset your password" features={FEATURES}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--green-soft)]">
          <MailCheck className="h-6 w-6 text-[var(--green)]" strokeWidth={1.5} />
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)]">
          Check your inbox
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          If an account with{' '}
          <span className="font-medium text-[var(--text)]">{submittedEmail}</span> exists,
          we've just sent a password reset link to it. The link expires in 1 hour.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            to="/login"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--panel-soft)]"
          >
            Back to sign in
          </Link>
          <button
            type="button"
            onClick={() => setSubmittedEmail(null)}
            className="text-sm font-medium text-[var(--green)] hover:text-[var(--green-dark)]"
          >
            Use a different email
          </button>
        </div>

        <p className="mt-8 border-t border-[var(--line)] pt-4 text-xs text-[var(--faint)]">
          Didn't get the email? Check your spam folder, or try again above.
        </p>
      </AuthLayout>
    );
  }

  // ---------------------------------------------------------------------------
  // Default — request form
  // ---------------------------------------------------------------------------
  return (
    <AuthLayout heading="Reset your password" features={FEATURES}>
      <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
        Forgot password
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Enter your email and we'll send you a reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@studio.com"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" strokeWidth={1.5} />}
          error={errors.email?.message}
          {...register('email')}
        />

        {submitError && (
          <div className="rounded-lg border border-[#FECACA] bg-[var(--red-soft)] px-3 py-2 text-sm text-[var(--red)]">
            {submitError}
          </div>
        )}

        <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">
          Send reset link
        </Button>
      </form>

      <div className="mt-8 border-t border-[var(--line)] pt-4 text-center text-sm text-[var(--muted)]">
        Remembered it?{' '}
        <Link to="/login" className="font-medium text-[var(--green)] hover:text-[var(--green-dark)]">
          Sign in →
        </Link>
      </div>
    </AuthLayout>
  );
}
