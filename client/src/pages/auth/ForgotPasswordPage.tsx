// Stub — full implementation lands in feature/auth-password-reset-pages
import { Link } from '@tanstack/react-router';
import AuthLayout from './AuthLayout';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      heading="Reset your password"
      features={[
        'Send polished proposals in minutes',
        'Convert accepted proposals to projects',
        'Auto-generate invoices from completed milestones',
        'See cash flow at a glance',
      ]}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-[#111827]">
        Forgot password
      </h2>
      <p className="mt-1 text-sm text-[#667085]">
        This page is coming soon.
      </p>
      <Link
        to="/login"
        className="mt-6 inline-block text-sm font-medium text-[#0F9F72] hover:text-[#087252]"
      >
        ← Back to sign in
      </Link>
    </AuthLayout>
  );
}
