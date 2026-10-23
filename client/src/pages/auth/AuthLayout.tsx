import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

interface AuthLayoutProps {
  heading: string;
  /** Optional word rendered in the cursive accent style after the heading. */
  headingCursive?: string;
  subheading?: string;
  features: string[];
  children: ReactNode;
  /** When true, swaps to the blue/client gradient and reverses sides (form left, brand right). */
  clientVariant?: boolean;
}

export default function AuthLayout({
  heading,
  headingCursive,
  subheading,
  features,
  children,
  clientVariant = false,
}: AuthLayoutProps) {
  // Brand panel — deep gradient aside per polished design.
  const brandPanel = (
    <div
      className={`pl-auth-aside ${clientVariant ? 'client' : ''} hidden flex-1 lg:flex`}
    >
      <div
        className="pl-blob"
        style={{
          width: 320,
          height: 320,
          bottom: -100,
          left: -60,
          background: clientVariant ? 'rgba(79,140,255,0.5)' : 'rgba(21,184,134,0.5)',
        }}
      />
      <div className="relative z-[1] flex items-center gap-[11px]">
        <div
          className="pl-brand-mark"
          style={{ width: 34, height: 34, fontSize: 17, boxShadow: 'none' }}
        >
          F
        </div>
        <span className="text-[18px] font-extrabold tracking-[-0.02em] text-white">
          FreelanceFlow
        </span>
      </div>

      <div className="relative z-[1] max-w-[400px]">
        <h1 className="text-[34px] font-extrabold leading-[1.12] tracking-[-0.03em] text-white">
          {heading}
          {headingCursive && (
            <>
              {' '}
              <span
                className="pl-cursive"
                style={{ fontSize: 42, color: clientVariant ? '#c7dcff' : '#b9f5dc' }}
              >
                {headingCursive}
              </span>
              .
            </>
          )}
        </h1>
        {subheading && (
          <p className="mt-4 text-[15px] leading-[1.65] text-white/80">{subheading}</p>
        )}

        <ul className="mt-[30px] grid gap-[13px]">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-[14px] font-medium text-white">
              <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[9px] bg-white/15">
                <Check className="h-[15px] w-[15px]" strokeWidth={2.25} />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-[1] text-[12.5px] text-white/70">
        © {new Date().getFullYear()} FreelanceFlow
      </div>
    </div>
  );

  // Form panel — fixed 520px on desktop.
  const formPanel = (
    <div className="flex w-full items-center justify-center bg-white p-8 lg:w-[520px] lg:shrink-0">
      <div className="w-full max-w-[380px]">{children}</div>
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
