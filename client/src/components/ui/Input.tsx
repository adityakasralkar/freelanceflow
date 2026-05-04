import { forwardRef } from 'react';
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
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-[#111827]"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#98A2B3]">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'h-10 w-full rounded-lg border bg-white px-3 text-sm text-[#111827] outline-none transition-colors',
            'placeholder:text-[#98A2B3]',
            'focus:ring-2 focus:ring-[#0F9F72]/40',
            error
              ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/30'
              : 'border-[#E5E9F0] focus:border-[#0F9F72]',
            leftIcon && 'pl-10',
            rightAddon && 'pr-12',
            className
          )}
          {...rest}
        />
        {rightAddon && (
          <div className="absolute inset-y-0 right-3 flex items-center text-sm text-[#667085]">
            {rightAddon}
          </div>
        )}
      </div>
      {error ? (
        <p className="mt-1 text-xs text-[#DC2626]">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-[#98A2B3]">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
