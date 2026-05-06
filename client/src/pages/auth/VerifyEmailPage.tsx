import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { Loader2, CheckCircle2, XCircle, Mail } from 'lucide-react';
import AuthLayout from './AuthLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { api, ApiError } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import type { User } from '../../types';

type State =
  | { kind: 'verifying' }
  | { kind: 'success' }
  | { kind: 'expired' }
  | { kind: 'invalid'; message: string };

export default function VerifyEmailPage() {
  const { token } = useParams({ strict: false }) as { token: string };
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [state, setState] = useState<State>({ kind: 'verifying' });
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  // Use a ref to ensure we don't fire the verify call twice in React StrictMode dev.
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    (async () => {
      try {
        const data = await api.post<{ user: User; token: string }>('/auth/verify-email', { token });
        // Server auto-issues JWT on success — log them in immediately.
        login(data.user, data.token);
        setState({ kind: 'success' });
        setTimeout(() => {
          navigate({ to: data.user.role === 'client' ? '/client/dashboard' : '/dashboard' });
        }, 1200);
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 400 && /already verified/i.test(err.message)) {
            setState({ kind: 'success' });
            setTimeout(() => navigate({ to: '/login' }), 1200);
            return;
          }
          if (
            err.status === 400 &&
            (/expired/i.test(err.message) ||
              (err as { details?: unknown } as { details?: string }).details === 'TOKEN_EXPIRED')
          ) {
            setState({ kind: 'expired' });
            return;
          }
          setState({ kind: 'invalid', message: err.message });
          return;
        }
        setState({ kind: 'invalid', message: 'Something went wrong. Please try again.' });
      }
    })();
  }, [token, login, navigate]);

  async function handleResend() {
    if (!resendEmail) return;
    setIsResending(true);
    setResendNotice(null);
    try {
      await api.post('/auth/resend-verification', { email: resendEmail });
      setResendNotice('If that email exists, a new link has been sent.');
    } catch {
      setResendNotice('Could not resend right now. Please try again in a minute.');
    } finally {
      setIsResending(false);
    }
  }

  // ---------------------------------------------------------------------------
  // States
  // ---------------------------------------------------------------------------
  return (
    <AuthLayout
      heading="Verifying your email"
      subheading="One quick check, then you're in."
      features={[
        'Send polished proposals in minutes',
        'Convert accepted proposals to projects',
        'Auto-generate invoices from completed milestones',
        'See cash flow at a glance',
      ]}
    >
      {state.kind === 'verifying' && (
        <div className="flex flex-col items-center text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#0F9F72]" strokeWidth={1.5} />
          <h2 className="mt-4 text-xl font-semibold text-[#111827]">Verifying...</h2>
          <p className="mt-1 text-sm text-[#667085]">Hang tight, this only takes a moment.</p>
        </div>
      )}

      {state.kind === 'success' && (
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="h-10 w-10 text-[#0F9F72]" strokeWidth={1.5} />
          <h2 className="mt-4 text-xl font-semibold text-[#111827]">Email verified</h2>
          <p className="mt-1 text-sm text-[#667085]">Redirecting you to your dashboard…</p>
        </div>
      )}

      {state.kind === 'expired' && (
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF2F2]">
            <XCircle className="h-6 w-6 text-[#DC2626]" strokeWidth={1.5} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-[#111827]">Link expired</h2>
          <p className="mt-1 text-sm text-[#667085]">
            That verification link has expired. Enter your email and we'll send a fresh one.
          </p>

          <div className="mt-6 space-y-3">
            <Input
              label="Email"
              type="email"
              placeholder="you@studio.com"
              autoComplete="email"
              leftIcon={<Mail className="h-4 w-4" strokeWidth={1.5} />}
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
            />
            {resendNotice && (
              <div className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2 text-sm text-[#2563EB]">
                {resendNotice}
              </div>
            )}
            <Button onClick={handleResend} isLoading={isResending} className="w-full">
              Send a new link
            </Button>
            <Link
              to="/login"
              className="block text-center text-sm font-medium text-[#0F9F72] hover:text-[#087252]"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      )}

      {state.kind === 'invalid' && (
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF2F2]">
            <XCircle className="h-6 w-6 text-[#DC2626]" strokeWidth={1.5} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-[#111827]">Verification failed</h2>
          <p className="mt-1 text-sm text-[#667085]">{state.message}</p>
          <div className="mt-6 flex flex-col gap-2">
            <Link to="/login">
              <Button variant="secondary" className="w-full">
                Go to sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="ghost" className="w-full">
                Create a new account
              </Button>
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
