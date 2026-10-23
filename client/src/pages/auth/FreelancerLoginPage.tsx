import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { Mail, Lock } from 'lucide-react';
import AuthLayout from './AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { api, ApiError } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import type { User } from '../../types';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof schema>;

export default function FreelancerLoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(schema) });

  async function onSubmit(values: LoginForm) {
    setSubmitError(null);
    setUnverifiedEmail(null);
    setResendNotice(null);
    try {
      const data = await api.post<{ user: User; token: string }>('/auth/login', values);
      login(data.user, data.token);
      navigate({ to: data.user.role === 'client' ? '/client/dashboard' : '/dashboard' });
    } catch (err) {
      if (err instanceof ApiError) {
        // Backend signals unverified accounts with HTTP 403 + "verify your email" message.
        if (err.status === 403 || /verify your email/i.test(err.message)) {
          setUnverifiedEmail(values.email);
          return;
        }
        setSubmitError(err.message);
        return;
      }
      setSubmitError('Login failed. Please try again.');
    }
  }

  async function handleResend() {
    if (!unverifiedEmail) return;
    setIsResending(true);
    setResendNotice(null);
    try {
      await api.post('/auth/resend-verification', { email: unverifiedEmail });
      setResendNotice('Verification email sent. Please check your inbox.');
    } catch {
      setResendNotice('Could not resend right now. Please try again in a minute.');
    } finally {
      setIsResending(false);
    }
  }

  return (
    <AuthLayout
      heading="From proposal to payment,"
      headingCursive="effortlessly"
      subheading="One calm workspace for proposals, milestones, invoices, and cash flow."
      features={[
        'Proposal pipeline',
        'Milestone tracking',
        'Real-time cash flow',
      ]}
    >
      <h2 className="text-[26px] font-extrabold tracking-[-0.02em] text-[var(--text)]">
        Welcome back
      </h2>
      <p className="mt-1.5 text-sm text-[var(--muted)]">
        Sign in to your freelancer workspace
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
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
          autoComplete="current-password"
          leftIcon={<Lock className="h-4 w-4" strokeWidth={1.5} />}
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-xs font-medium text-[var(--green)] hover:text-[var(--green-dark)]"
          >
            Forgot password?
          </Link>
        </div>

        {submitError && (
          <div className="rounded-lg border border-[#FECACA] bg-[var(--red-soft)] px-3 py-2 text-sm text-[var(--red)]">
            {submitError}
          </div>
        )}

        {unverifiedEmail && (
          <div className="rounded-lg border border-[#FDE68A] bg-[var(--amber-soft)] px-3 py-3 text-sm text-[var(--amber)]">
            <p className="font-medium">Please verify your email before logging in.</p>
            <p className="mt-1 text-xs text-[#92400E]">
              We sent a verification link to{' '}
              <span className="font-medium">{unverifiedEmail}</span>. Didn't get it?
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="mt-2 text-xs font-semibold text-[var(--amber)] underline-offset-2 hover:underline disabled:opacity-60"
            >
              {isResending ? 'Sending…' : 'Resend verification email'}
            </button>
            {resendNotice && (
              <p className="mt-1 text-xs text-[#065F46]">{resendNotice}</p>
            )}
          </div>
        )}

        <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">
          Sign in
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-[var(--muted)]">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-[var(--green)] hover:text-[var(--green-dark)]">
          Sign up →
        </Link>
      </div>

      <div className="mt-8 border-t border-[var(--line)] pt-4 text-center text-sm text-[var(--muted)]">
        Are you a client?{' '}
        <Link
          to="/client/login"
          className="font-medium text-[var(--green)] hover:text-[var(--green-dark)]"
        >
          Client login →
        </Link>
      </div>
    </AuthLayout>
  );
}
