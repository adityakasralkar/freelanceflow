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
    'border border-transparent text-white bg-[linear-gradient(140deg,var(--green-bright),var(--green-dark))] shadow-[var(--shadow-emerald)] hover:brightness-[1.04] disabled:opacity-60',
  secondary:
    'bg-[var(--panel)] text-[var(--text)] border border-[var(--line-strong)] shadow-[var(--shadow-sm)] hover:bg-[var(--panel-soft)] hover:border-[var(--muted)] disabled:opacity-60',
  danger:
    'bg-[var(--red)] text-white border border-[var(--red)] hover:bg-[#b91c1c] hover:border-[#b91c1c] disabled:opacity-60',
  ghost:
    'bg-transparent text-[var(--muted)] border border-transparent hover:bg-[var(--panel-soft)] hover:text-[var(--text)]',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs rounded-[8px]',
  md: 'h-[38px] px-4 text-[13px] rounded-[10px]',
  lg: 'h-[46px] px-[22px] text-[14.5px] rounded-xl',
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
        'inline-flex items-center justify-center gap-2 font-semibold transition-all hover:enabled:-translate-y-px whitespace-nowrap font-[Inter]',
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
