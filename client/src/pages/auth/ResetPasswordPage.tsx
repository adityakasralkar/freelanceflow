import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useParams, useNavigate } from '@tanstack/react-router';
import { Lock, CheckCircle2, XCircle } from 'lucide-react';
import AuthLayout from './AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { api, ApiError } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { passwordSchema, passwordHelperText } from '../../utils/passwordRules';
import type { User } from '../../types';

const schema = z
  .object({
    password: passwordSchema,
    confirm: z.string().min(1, 'Please confirm your password'),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  });

type ResetForm = z.infer<typeof schema>;

const FEATURES = [
  'Send polished proposals in minutes',
  'Convert accepted proposals to projects',
  'Auto-generate invoices from completed milestones',
  'See cash flow at a glance',
];

export default function ResetPasswordPage() {
  const { token } = useParams({ strict: false }) as { token: string };
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [tokenInvalid, setTokenInvalid] = useState<{ message: string } | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({ resolver: zodResolver(schema) });

  async function onSubmit(values: ResetForm) {
    setSubmitError(null);
    setTokenInvalid(null);
    try {
      const data = await api.post<{ user: User; token: string }>('/auth/reset-password', {
        token,
        password: values.password,
      });

      // Backend auto-issues JWT — log them in.
      login(data.user, data.token);
      setSuccess(true);
      setTimeout(() => {
        navigate({
          to: data.user.role === 'client' ? '/client/dashboard' : '/dashboard',
        });
      }, 1200);
    } catch (err) {
      if (err instanceof ApiError) {
        // 400 means invalid/expired token — show a dedicated state, not an inline error.
        if (
          err.status === 400 &&
          (/invalid/i.test(err.message) ||
            /expired/i.test(err.message) ||
            /already-used/i.test(err.message))
        ) {
          setTokenInvalid({ message: err.message });
          return;
        }
        setSubmitError(err.message);
        return;
      }
      setSubmitError('Something went wrong. Please try again.');
    }
  }

  // ---------------------------------------------------------------------------
  // Success
  // ---------------------------------------------------------------------------
  if (success) {
    return (
      <AuthLayout heading="Welcome back" features={FEATURES}>
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="h-10 w-10 text-[var(--green)]" strokeWidth={1.5} />
          <h2 className="mt-4 text-xl font-semibold text-[var(--text)]">Password updated</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Redirecting you to your dashboard…
          </p>
        </div>
      </AuthLayout>
    );
  }

  // ---------------------------------------------------------------------------
  // Token invalid / expired
  // ---------------------------------------------------------------------------
  if (tokenInvalid) {
    return (
      <AuthLayout heading="Reset your password" features={FEATURES}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--red-soft)]">
          <XCircle className="h-6 w-6 text-[var(--red)]" strokeWidth={1.5} />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-[var(--text)]">
          Reset link no longer valid
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">{tokenInvalid.message}</p>

        <div className="mt-6 flex flex-col gap-2">
          <Link to="/forgot-password">
            <Button className="w-full">Request a new link</Button>
          </Link>
          <Link
            to="/login"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--panel-soft)]"
          >
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // ---------------------------------------------------------------------------
  // Default — set new password form
  // ---------------------------------------------------------------------------
  return (
    <AuthLayout heading="Reset your password" features={FEATURES}>
      <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
        Set a new password
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Choose a strong password you don't use elsewhere.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input
          label="New password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          leftIcon={<Lock className="h-4 w-4" strokeWidth={1.5} />}
          helperText={passwordHelperText}
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          leftIcon={<Lock className="h-4 w-4" strokeWidth={1.5} />}
          error={errors.confirm?.message}
          {...register('confirm')}
        />

        {submitError && (
          <div className="rounded-lg border border-[#FECACA] bg-[var(--red-soft)] px-3 py-2 text-sm text-[var(--red)]">
            {submitError}
          </div>
        )}

        <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">
          Update password
        </Button>
      </form>

      <div className="mt-8 border-t border-[var(--line)] pt-4 text-center text-sm text-[var(--muted)]">
        <Link to="/login" className="font-medium text-[var(--green)] hover:text-[var(--green-dark)]">
          ← Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
