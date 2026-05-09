import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-[var(--green)] text-white border border-[var(--green)] hover:bg-[var(--green-dark)] hover:border-[var(--green-dark)] disabled:opacity-60',
  secondary:
    'bg-[var(--panel)] text-[var(--text)] border border-[var(--line-strong)] hover:bg-[var(--panel-soft)] hover:border-[var(--muted)] disabled:opacity-60',
  danger:
    'bg-[var(--red)] text-white border border-[var(--red)] hover:bg-[#b91c1c] hover:border-[#b91c1c] disabled:opacity-60',
  ghost:
    'bg-transparent text-[var(--muted)] border border-transparent hover:bg-[#f1f3f6] hover:text-[var(--text)]',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'h-[30px] px-2.5 text-xs',
  md: 'h-9 px-3.5 text-[13px]',
  lg: 'h-11 px-5 text-sm',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-[7px] font-semibold transition-colors whitespace-nowrap font-[Inter]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]/30',
        'disabled:cursor-not-allowed',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...rest}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />}
      {children}
    </button>
  );
}
