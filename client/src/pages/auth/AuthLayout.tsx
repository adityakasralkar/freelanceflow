import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

interface AuthLayoutProps {
  heading: string;
  subheading?: string;
  features: string[];
  children: ReactNode;
  /** When true, swaps to the blue/client gradient and reverses sides (form left, brand right). */
  clientVariant?: boolean;
}

export default function AuthLayout({
  heading,
  subheading,
  features,
  children,
  clientVariant = false,
}: AuthLayoutProps) {
  // Brand panel — left for freelancer, right for client.
  const brandPanel = (
    <div
      className={`ff-auth-side ${clientVariant ? 'client' : ''} hidden flex-1 flex-col justify-between p-14 lg:flex`}
    >
      <div className="relative z-[1] flex items-center gap-2">
        <div className="grid h-[26px] w-[26px] place-items-center rounded-[7px] bg-[var(--green)] text-[13px] font-extrabold text-white">
          F
        </div>
        <span className="text-[16px] font-extrabold tracking-[-0.01em] text-[var(--text)]">
          Freelance<span className="text-[var(--green)]">Flow</span>
        </span>
      </div>

      <div className="relative z-[1] max-w-md">
        <h1 className="text-[32px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[var(--text)]">
          {heading}
        </h1>
        {subheading && (
          <p className="mt-3 text-[14px] text-[var(--muted)]">{subheading}</p>
        )}

        <ul className="mt-8 space-y-2.5">
          {features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2.5 text-[13px] text-[var(--text)]"
            >
              <span
                className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${
                  clientVariant
                    ? 'bg-[var(--blue-soft)] text-[var(--blue)]'
                    : 'bg-[var(--green-soft)] text-[var(--green-dark)]'
                }`}
              >
                <Check className="h-3 w-3" strokeWidth={2.5} />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-[1] text-[11px] text-[var(--faint)]">
        © {new Date().getFullYear()} FreelanceFlow
      </div>
    </div>
  );

  // Form panel — fixed 480px on desktop.
  const formPanel = (
    <div className="flex w-full items-center justify-center bg-white p-8 lg:w-[480px] lg:shrink-0">
      <div className="w-full max-w-[360px]">{children}</div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {clientVariant ? (
        <>
          {formPanel}
          {brandPanel}
        </>
      ) : (
        <>
          {brandPanel}
          {formPanel}
        </>
      )}
    </div>
  );
}
