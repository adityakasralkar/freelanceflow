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
      heading="Your freelance business, organized."
      subheading="Track proposals, manage projects, send invoices — all in one place."
      features={[
        'Send polished proposals in minutes',
        'Convert accepted proposals to projects',
        'Auto-generate invoices from completed milestones',
        'See cash flow at a glance',
      ]}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-[#111827]">Sign in</h2>
      <p className="mt-1 text-sm text-[#667085]">
        Welcome back — enter your details to continue.
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
            className="text-xs font-medium text-[#0F9F72] hover:text-[#087252]"
          >
            Forgot password?
          </Link>
        </div>

        {submitError && (
          <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#DC2626]">
            {submitError}
          </div>
        )}

        {unverifiedEmail && (
          <div className="rounded-lg border border-[#FDE68A] bg-[#FFF7ED] px-3 py-3 text-sm text-[#D97706]">
            <p className="font-medium">Please verify your email before logging in.</p>
            <p className="mt-1 text-xs text-[#92400E]">
              We sent a verification link to{' '}
              <span className="font-medium">{unverifiedEmail}</span>. Didn't get it?
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="mt-2 text-xs font-semibold text-[#D97706] underline-offset-2 hover:underline disabled:opacity-60"
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

      <div className="mt-6 text-center text-sm text-[#667085]">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-[#0F9F72] hover:text-[#087252]">
          Sign up →
        </Link>
      </div>

      <div className="mt-8 border-t border-[#E5E9F0] pt-4 text-center text-sm text-[#667085]">
        Are you a client?{' '}
        <Link
          to="/client/login"
          className="font-medium text-[#0F9F72] hover:text-[#087252]"
        >
          Client login →
        </Link>
      </div>
    </AuthLayout>
  );
}
