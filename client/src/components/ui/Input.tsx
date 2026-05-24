import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightAddon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, leftIcon, rightAddon, className, id, ...rest },
  ref
) {
  const internalId = useId();
  const inputId = id ?? internalId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-xs font-semibold text-[var(--text)]"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--faint)]">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'h-[38px] w-full rounded-[7px] border bg-white px-3 text-[13px] text-[var(--text)] outline-none transition-colors font-[Inter]',
            'placeholder:text-[var(--faint)]',
            'focus:ring-2 focus:ring-[var(--green)]/15',
            error
              ? 'border-[var(--red)] focus:border-[var(--red)] focus:ring-[var(--red)]/20'
              : 'border-[var(--line-strong)] focus:border-[var(--green)]',
            leftIcon && 'pl-10',
            rightAddon && 'pr-12',
            className
          )}
          {...rest}
        />
        {rightAddon && (
          <div className="absolute inset-y-0 right-3 flex items-center text-[13px] text-[var(--muted)]">
            {rightAddon}
          </div>
        )}
      </div>
      {error ? (
        <p className="mt-1 text-xs text-[var(--red)]">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-[11px] text-[var(--muted)]">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
