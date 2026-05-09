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
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF8F2]">
          <MailCheck className="h-6 w-6 text-[#0F9F72]" strokeWidth={1.5} />
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#111827]">
          Check your inbox
        </h2>
        <p className="mt-1 text-sm text-[#667085]">
          If an account with{' '}
          <span className="font-medium text-[#111827]">{submittedEmail}</span> exists,
          we've just sent a password reset link to it. The link expires in 1 hour.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            to="/login"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[#E5E9F0] bg-white px-4 text-sm font-medium text-[#111827] transition-colors hover:bg-[#F8FAFC]"
          >
            Back to sign in
          </Link>
          <button
            type="button"
            onClick={() => setSubmittedEmail(null)}
            className="text-sm font-medium text-[#0F9F72] hover:text-[#087252]"
          >
            Use a different email
          </button>
        </div>

        <p className="mt-8 border-t border-[#E5E9F0] pt-4 text-xs text-[#98A2B3]">
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
      <h2 className="text-2xl font-semibold tracking-tight text-[#111827]">
        Forgot password
      </h2>
      <p className="mt-1 text-sm text-[#667085]">
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
          <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#DC2626]">
            {submitError}
          </div>
        )}

        <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">
          Send reset link
        </Button>
      </form>

      <div className="mt-8 border-t border-[#E5E9F0] pt-4 text-center text-sm text-[#667085]">
        Remembered it?{' '}
        <Link to="/login" className="font-medium text-[#0F9F72] hover:text-[#087252]">
          Sign in →
        </Link>
      </div>
    </AuthLayout>
  );
}
