import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

interface AuthLayoutProps {
  heading: string;
  subheading?: string;
  features: string[];
  children: ReactNode;
}

export default function AuthLayout({ heading, subheading, features, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left brand panel — 52% */}
      <div
        className="hidden flex-col justify-between p-12 lg:flex"
        style={{ width: '52%', backgroundColor: '#F8FAFC' }}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F9F72] text-white">
            <span className="text-sm font-bold">F</span>
          </div>
          <span className="text-base font-semibold text-[#111827]">
            Freelance<span className="text-[#0F9F72]">Flow</span>
          </span>
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[#111827]">
            {heading}
          </h1>
          {subheading && (
            <p className="mt-3 text-base text-[#667085]">{subheading}</p>
          )}

          <ul className="mt-8 space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-[#111827]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EAF8F2]">
                  <Check className="h-3 w-3 text-[#0F9F72]" strokeWidth={2.5} />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-xs text-[#98A2B3]">
          © {new Date().getFullYear()} FreelanceFlow
        </div>
      </div>

      {/* Right form panel — 48% */}
      <div className="flex w-full items-center justify-center bg-white p-8 lg:w-[48%]">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
