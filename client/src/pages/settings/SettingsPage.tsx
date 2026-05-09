import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  User,
  Building2,
  Receipt,
  CreditCard,
  Save,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { useMyProfile, useUpdateMyProfile } from '../../hooks/useProfile';
import type { User as UserType } from '../../types';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
interface ProfileForm {
  name: string;
  phone: string;
  location: string;
  business_name: string;
  business_address: string;
  gst_enabled: boolean;
  gst_number: string;
  invoice_prefix: string;
  default_payment_terms: string;
  default_due_days: number;
  upi_id: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  account_holder_name: string;
}

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */
const TABS = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'business', label: 'Business', icon: Building2 },
  { key: 'invoicing', label: 'Invoicing', icon: Receipt },
  { key: 'payment', label: 'Payment', icon: CreditCard },
] as const;

type TabKey = (typeof TABS)[number]['key'];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const [saved, setSaved] = useState(false);

  const { data: user, isLoading } = useMyProfile();
  const updateProfile = useUpdateMyProfile();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = useForm<ProfileForm>();

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        business_name: user.business_name || '',
        business_address: user.business_address || '',
        gst_enabled: user.gst_enabled || false,
        gst_number: user.gst_number || '',
        invoice_prefix: user.invoice_prefix || 'INV-',
        default_payment_terms: user.default_payment_terms || '',
        default_due_days: user.default_due_days || 14,
        upi_id: user.upi_id || '',
        bank_name: user.bank_name || '',
        account_number: user.account_number || '',
        ifsc_code: user.ifsc_code || '',
        account_holder_name: user.account_holder_name || '',
      });
    }
  }, [user, reset]);

  const gstEnabled = watch('gst_enabled');

  const onSubmit = (data: ProfileForm) => {
    updateProfile.mutate(data as unknown as Partial<UserType>, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      },
    });
  };

  if (isLoading) {
    return (
      <PageLayout title="Settings">
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--faint)]" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Settings">
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-[860px] pb-12">
        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg border border-[var(--line)] bg-[var(--surface2)] p-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-white text-[var(--text)] shadow-sm'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-5">
            <SectionCard title="Personal Information" description="Your name and contact details">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full Name" required>
                  <input
                    {...register('name')}
                    className="settings-input"
                    placeholder="John Doe"
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="settings-input opacity-60"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    {...register('phone')}
                    className="settings-input"
                    placeholder="+91 98765 43210"
                  />
                </Field>
                <Field label="Location">
                  <input
                    {...register('location')}
                    className="settings-input"
                    placeholder="Mumbai, India"
                  />
                </Field>
              </div>
            </SectionCard>
          </div>
        )}

        {/* Business Tab */}
        {activeTab === 'business' && (
          <div className="space-y-5">
            <SectionCard title="Business Details" description="Your company or freelance business info">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Business Name">
                  <input
                    {...register('business_name')}
                    className="settings-input"
                    placeholder="Acme Design Studio"
                  />
                </Field>
                <Field label="GST Registered">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('gst_enabled')}
                      className="h-4 w-4 rounded border-[var(--line)] text-[var(--green)] accent-[var(--green)]"
                    />
                    <span className="text-[13px] text-[var(--muted)]">
                      I have a GST number
                    </span>
                  </label>
                </Field>
              </div>
              {gstEnabled && (
                <div className="mt-5">
                  <Field label="GST Number">
                    <input
                      {...register('gst_number')}
                      className="settings-input"
                      placeholder="22AAAAA0000A1Z5"
                    />
                  </Field>
                </div>
              )}
              <div className="mt-5">
                <Field label="Business Address">
                  <textarea
                    {...register('business_address')}
                    rows={3}
                    className="settings-input resize-none"
                    placeholder="123 Business Street, City, State, PIN"
                  />
                </Field>
              </div>
            </SectionCard>
          </div>
        )}

        {/* Invoicing Tab */}
        {activeTab === 'invoicing' && (
          <div className="space-y-5">
            <SectionCard title="Invoice Defaults" description="Default values used when generating invoices">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Invoice Prefix">
                  <input
                    {...register('invoice_prefix')}
                    className="settings-input font-mono"
                    placeholder="INV-"
                  />
                </Field>
                <Field label="Default Due Days">
                  <input
                    type="number"
                    {...register('default_due_days', { valueAsNumber: true })}
                    className="settings-input"
                    min={1}
                    max={365}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Default Payment Terms">
                    <textarea
                      {...register('default_payment_terms')}
                      rows={3}
                      className="settings-input resize-none"
                      placeholder="Payment due within 14 days of invoice date. Late payments subject to 1.5% monthly interest."
                    />
                  </Field>
                </div>
              </div>
            </SectionCard>
          </div>
        )}

        {/* Payment Tab */}
        {activeTab === 'payment' && (
          <div className="space-y-5">
            <SectionCard title="UPI" description="Receive payments via UPI">
              <Field label="UPI ID">
                <input
                  {...register('upi_id')}
                  className="settings-input"
                  placeholder="yourname@upi"
                />
              </Field>
            </SectionCard>
            <SectionCard title="Bank Account" description="Bank details shown on invoices">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Account Holder Name">
                  <input
                    {...register('account_holder_name')}
                    className="settings-input"
                    placeholder="John Doe"
                  />
                </Field>
                <Field label="Bank Name">
                  <input
                    {...register('bank_name')}
                    className="settings-input"
                    placeholder="HDFC Bank"
                  />
                </Field>
                <Field label="Account Number">
                  <input
                    {...register('account_number')}
                    className="settings-input font-mono"
                    placeholder="1234567890123"
                  />
                </Field>
                <Field label="IFSC Code">
                  <input
                    {...register('ifsc_code')}
                    className="settings-input font-mono"
                    placeholder="HDFC0001234"
                  />
                </Field>
              </div>
            </SectionCard>
          </div>
        )}

        {/* Save button bar */}
        <div className="mt-6 flex items-center justify-end gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--green)]">
              <CheckCircle2 className="h-4 w-4" /> Saved
            </span>
          )}
          <button
            type="submit"
            disabled={updateProfile.isPending || !isDirty}
            className="flex items-center gap-2 rounded-lg bg-[var(--green)] px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[var(--green-dark)] disabled:opacity-50"
          >
            {updateProfile.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" strokeWidth={1.5} />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </PageLayout>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */
function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm">
      <h3 className="text-[15px] font-semibold text-[var(--text)]">{title}</h3>
      <p className="mb-5 mt-1 text-[13px] text-[var(--muted)]">{description}</p>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-[var(--muted)]">
        {label}
        {required && <span className="text-[var(--red)]"> *</span>}
      </label>
      {children}
    </div>
  );
}
