import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useParams, useNavigate } from '@tanstack/react-router';
import {
  Lock,
  Loader2,
  XCircle,
  CheckCircle2,
} from 'lucide-react';
import AuthLayout from './AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Avatar from '../../components/shared/Avatar';
import { api, ApiError } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { passwordSchema, passwordHelperText } from '../../utils/passwordRules';
import type { User } from '../../types';

interface InvitationDetails {
  status: 'pending' | 'expired' | 'revoked' | 'accepted';
  email: string;
  client_name: string;
  client_company: string | null;
  freelancer_name: string;
  expires_at: string;
}

type LoadState =
  | { kind: 'loading' }
  | { kind: 'loaded'; invitation: InvitationDetails }
  | { kind: 'not-found' }
  | { kind: 'error'; message: string };

const schema = z
  .object({
    password: passwordSchema,
    confirm: z.string().min(1, 'Please confirm your password'),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  });

type AcceptForm = z.infer<typeof schema>;

const FEATURES = [
  'Track project progress in real time',
  'See completed milestones and timelines',
  'Review and acknowledge invoices',
  'Download invoice copies any time',
];

export default function AcceptInvitePage() {
  const { token } = useParams({ strict: false }) as { token: string };
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [load, setLoad] = useState<LoadState>({ kind: 'loading' });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const ranRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AcceptForm>({ resolver: zodResolver(schema) });

  // ---------------------------------------------------------------------------
  // Load invitation details on mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    (async () => {
      try {
        const data = await api.get<InvitationDetails>(`/invitations/${token}`);
        setLoad({ kind: 'loaded', invitation: data });
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 404) {
            setLoad({ kind: 'not-found' });
            return;
          }
          setLoad({ kind: 'error', message: err.message });
          return;
        }
        setLoad({ kind: 'error', message: 'Could not load this invitation.' });
      }
    })();
  }, [token]);

  // ---------------------------------------------------------------------------
  // Submit handler
  // ---------------------------------------------------------------------------
  async function onSubmit(values: AcceptForm) {
    setSubmitError(null);
    try {
      const data = await api.post<{ user: User; token: string }>(
        `/invitations/${token}/accept`,
        { password: values.password }
      );
      login(data.user, data.token);
      setSuccess(true);
      setTimeout(() => navigate({ to: '/client/dashboard' }), 1200);
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.message);
        // Refresh load state if it was a status-related error so we render the
        // appropriate non-form view.
        if (
          /already accepted/i.test(err.message) ||
          /revoked/i.test(err.message) ||
          /expired/i.test(err.message) ||
          /invalid invitation/i.test(err.message)
        ) {
          try {
            const refreshed = await api.get<InvitationDetails>(`/invitations/${token}`);
            setLoad({ kind: 'loaded', invitation: refreshed });
          } catch {
            // ignore
          }
        }
        return;
      }
      setSubmitError('Something went wrong. Please try again.');
    }
  }

  // ---------------------------------------------------------------------------
  // Render — success
  // ---------------------------------------------------------------------------
  if (success) {
    return (
      <AuthLayout heading="Welcome aboard" features={FEATURES}>
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="h-10 w-10 text-[#0F9F72]" strokeWidth={1.5} />
          <h2 className="mt-4 text-xl font-semibold text-[#111827]">
            Account created
          </h2>
          <p className="mt-1 text-sm text-[#667085]">
            Redirecting you to your client portal…
          </p>
        </div>
      </AuthLayout>
    );
  }

  // ---------------------------------------------------------------------------
  // Render — loading
  // ---------------------------------------------------------------------------
  if (load.kind === 'loading') {
    return (
      <AuthLayout heading="Loading invitation" features={FEATURES}>
        <div className="flex flex-col items-center text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#0F9F72]" strokeWidth={1.5} />
          <p className="mt-4 text-sm text-[#667085]">One moment…</p>
        </div>
      </AuthLayout>
    );
  }

  // ---------------------------------------------------------------------------
  // Render — invitation not found
  // ---------------------------------------------------------------------------
  if (load.kind === 'not-found') {
    return (
      <AuthLayout heading="Invitation not found" features={FEATURES}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF2F2]">
          <XCircle className="h-6 w-6 text-[#DC2626]" strokeWidth={1.5} />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-[#111827]">
          We couldn't find that invitation
        </h2>
        <p className="mt-1 text-sm text-[#667085]">
          The link may be broken or the invitation has been deleted. Please ask the
          freelancer who sent it to share a fresh link.
        </p>
        <div className="mt-6">
          <Link to="/client/login">
            <Button variant="secondary" className="w-full">
              Go to client login
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // ---------------------------------------------------------------------------
  // Render — generic load error
  // ---------------------------------------------------------------------------
  if (load.kind === 'error') {
    return (
      <AuthLayout heading="Couldn't load invitation" features={FEATURES}>
        <p className="text-sm text-[#667085]">{load.message}</p>
        <div className="mt-6">
          <Link to="/client/login">
            <Button variant="secondary" className="w-full">
              Go to client login
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // ---------------------------------------------------------------------------
  // Render — non-pending statuses
  // ---------------------------------------------------------------------------
  const inv = load.invitation;

  if (inv.status === 'accepted') {
    return (
      <AuthLayout heading="Already accepted" features={FEATURES}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF8F2]">
          <CheckCircle2 className="h-6 w-6 text-[#0F9F72]" strokeWidth={1.5} />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-[#111827]">
          This invitation has already been accepted
        </h2>
        <p className="mt-1 text-sm text-[#667085]">
          You can sign in to your client portal with{' '}
          <span className="font-medium text-[#111827]">{inv.email}</span>.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link to="/client/login">
            <Button className="w-full">Go to client login</Button>
          </Link>
          <Link
            to="/forgot-password"
            className="text-center text-sm font-medium text-[#0F9F72] hover:text-[#087252]"
          >
            Forgot your password?
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (inv.status === 'revoked') {
    return (
      <AuthLayout heading="Invitation revoked" features={FEATURES}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF2F2]">
          <XCircle className="h-6 w-6 text-[#DC2626]" strokeWidth={1.5} />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-[#111827]">
          This invitation was revoked
        </h2>
        <p className="mt-1 text-sm text-[#667085]">
          {inv.freelancer_name} has cancelled this invitation. Please reach out to
          them if you believe this is a mistake.
        </p>
      </AuthLayout>
    );
  }

  if (inv.status === 'expired') {
    return (
      <AuthLayout heading="Invitation expired" features={FEATURES}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF7ED]">
          <XCircle className="h-6 w-6 text-[#D97706]" strokeWidth={1.5} />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-[#111827]">
          This invitation has expired
        </h2>
        <p className="mt-1 text-sm text-[#667085]">
          Invitations are valid for 7 days. Please ask {inv.freelancer_name} to send
          a fresh link.
        </p>
      </AuthLayout>
    );
  }

  // ---------------------------------------------------------------------------
  // Render — pending (set password)
  // ---------------------------------------------------------------------------
  return (
    <AuthLayout
      heading={`Welcome, ${inv.client_name.split(' ')[0]}`}
      subheading={`${inv.freelancer_name} has invited you to view your projects and invoices.`}
      features={FEATURES}
    >
      <div className="flex items-center gap-3 rounded-xl border border-[#E5E9F0] bg-[#F8FAFC] p-3">
        <Avatar name={inv.freelancer_name} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-[#111827]">
            Invited by {inv.freelancer_name}
          </div>
          <div className="truncate text-xs text-[#667085]">
            for{' '}
            <span className="font-medium text-[#111827]">
              {inv.client_company || inv.client_name}
            </span>{' '}
            · {inv.email}
          </div>
        </div>
      </div>

      <h2 className="mt-6 text-xl font-semibold tracking-tight text-[#111827]">
        Set your password
      </h2>
      <p className="mt-1 text-sm text-[#667085]">
        Choose a password to access your client portal.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
          <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#DC2626]">
            {submitError}
          </div>
        )}

        <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">
          Create account & sign in
        </Button>
      </form>

      <p className="mt-8 border-t border-[#E5E9F0] pt-4 text-xs text-[#98A2B3]">
        By continuing you agree to use this account responsibly. The freelancer who
        invited you can see when you've signed in and acknowledged invoices.
      </p>
    </AuthLayout>
  );
}
