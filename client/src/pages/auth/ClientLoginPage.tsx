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

export default function ClientLoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(schema) });

  async function onSubmit(values: LoginForm) {
    setSubmitError(null);
    try {
      const data = await api.post<{ user: User; token: string }>('/auth/login', values);
      if (data.user.role !== 'client') {
        setSubmitError('This is the client portal. Use the freelancer login.');
        return;
      }
      login(data.user, data.token);
      navigate({ to: '/client/dashboard' });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Login failed';
      setSubmitError(msg);
    }
  }

  return (
    <AuthLayout
      heading="View your projects and invoices."
      subheading="A clean, read-only view of everything your freelancer is working on."
      features={[
        'Track project progress in real time',
        'See completed milestones and timelines',
        'Review and acknowledge invoices',
        'Download invoice copies any time',
      ]}
      clientVariant
    >
      <h2 className="text-2xl font-semibold tracking-tight text-[#111827]">
        Client access
      </h2>
      <p className="mt-1 text-sm text-[#667085]">
        Sign in to view your projects and invoices.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@company.com"
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

        {submitError && (
          <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#DC2626]">
            {submitError}
          </div>
        )}

        <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">
          Sign in
        </Button>
      </form>

      <div className="mt-8 border-t border-[#E5E9F0] pt-4 text-center text-sm text-[#667085]">
        Are you a freelancer?{' '}
        <Link to="/login" className="font-medium text-[#0F9F72] hover:text-[#087252]">
          Freelancer login →
        </Link>
      </div>
    </AuthLayout>
  );
}
