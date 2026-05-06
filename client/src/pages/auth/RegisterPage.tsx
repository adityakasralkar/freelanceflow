import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from '@tanstack/react-router';
import { Mail, Lock, User as UserIcon, MailCheck } from 'lucide-react';
import AuthLayout from './AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { api, ApiError } from '../../lib/api';
import { passwordSchema, passwordHelperText } from '../../utils/passwordRules';
import type { User } from '../../types';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  email: z.string().email('Enter a valid email').max(255),
  password: passwordSchema,
});

type RegisterForm = z.infer<typeof schema>;

export default function RegisterPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(schema) });

  async function onSubmit(values: RegisterForm) {
    setSubmitError(null);
    try {
      await api.post<{ user: User }>('/auth/register', values);
      setRegisteredEmail(values.email);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Registration failed';
      setSubmitError(msg);
    }
  }

  async function handleResend() {
    if (!registeredEmail) return;
    setIsResending(true);
    setResendNotice(null);
    try {
      await api.post('/auth/resend-verification', { email: registeredEmail });
      setResendNotice('Verification email sent again. Please check your inbox.');
    } catch {
      setResendNotice('Could not resend right now. Please try again in a minute.');
    } finally {
      setIsResending(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Post-signup state — "Check your inbox"
  // ---------------------------------------------------------------------------
  if (registeredEmail) {
    return (
      <AuthLayout
        heading="Your freelance business, organized."
        subheading="One more step — confirm your email and you're in."
        features={[
          'Send polished proposals in minutes',
          'Convert accepted proposals to projects',
          'Auto-generate invoices from completed milestones',
          'See cash flow at a glance',
        ]}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF8F2]">
          <MailCheck className="h-6 w-6 text-[#0F9F72]" strokeWidth={1.5} />
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#111827]">
          Check your inbox
        </h2>
        <p className="mt-1 text-sm text-[#667085]">
          We've sent a verification link to{' '}
          <span className="font-medium text-[#111827]">{registeredEmail}</span>.
          Click the link in that email to activate your account.
        </p>

        {resendNotice && (
          <div className="mt-4 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2 text-sm text-[#2563EB]">
            {resendNotice}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={handleResend} isLoading={isResending} variant="secondary">
            Resend verification email
          </Button>
          <Link
            to="/login"
            className="text-center text-sm font-medium text-[#0F9F72] hover:text-[#087252]"
          >
            Back to sign in
          </Link>
        </div>

        <p className="mt-8 border-t border-[#E5E9F0] pt-4 text-xs text-[#98A2B3]">
          Didn't get the email? Check your spam folder, or request a new link
          using the button above.
        </p>
      </AuthLayout>
    );
  }

  // ---------------------------------------------------------------------------
  // Default — registration form
  // ---------------------------------------------------------------------------
  return (
    <AuthLayout
      heading="Your freelance business, organized."
      subheading="Track proposals, manage projects, send invoices — all in one place."
      features={[
        'Send polished proposals in minutes',
        'Convert accepted proposals to projects',
        'Auto-generate invoices from completed milestones',
        'See cash flow at a glance',
      ]}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-[#111827]">
        Create your account
      </h2>
      <p className="mt-1 text-sm text-[#667085]">
        Start managing your freelance business in minutes.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input
          label="Full name"
          type="text"
          placeholder="Jane Designer"
          autoComplete="name"
          leftIcon={<UserIcon className="h-4 w-4" strokeWidth={1.5} />}
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@studio.com"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" strokeWidth={1.5} />}
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          leftIcon={<Lock className="h-4 w-4" strokeWidth={1.5} />}
          helperText={passwordHelperText}
          error={errors.password?.message}
          {...register('password')}
        />

        {submitError && (
          <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#DC2626]">
            {submitError}
          </div>
        )}

        <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">
          Create account
        </Button>
      </form>

      <div className="mt-8 border-t border-[#E5E9F0] pt-4 text-center text-sm text-[#667085]">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-[#0F9F72] hover:text-[#087252]">
          Sign in →
        </Link>
      </div>
    </AuthLayout>
  );
}
