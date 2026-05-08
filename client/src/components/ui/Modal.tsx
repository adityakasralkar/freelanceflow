import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_WIDTH: Record<NonNullable<ModalProps['size']>, number> = {
  sm: 420,
  md: 520,
  lg: 640,
};

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center p-4 backdrop-blur-[3px]"
      style={{ background: 'rgba(16, 24, 40, 0.55)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'flex w-full max-h-[90vh] flex-col overflow-hidden bg-white shadow-[0_24px_60px_rgba(16,24,40,0.25)]'
        )}
        style={{ borderRadius: '14px', maxWidth: SIZE_WIDTH[size] }}
      >
        {(title || subtitle) && (
          <div className="flex items-start justify-between gap-4 px-6 pb-3 pt-5">
            <div>
              {title && (
                <h3 className="text-[17px] font-bold tracking-[-0.01em] text-[var(--text)]">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-[12px] text-[var(--muted)]">{subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-md text-[var(--muted)] transition-colors hover:bg-[#f1f3f6] hover:text-[var(--text)]"
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        )}
        <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-6 pb-5 pt-2">
          {children}
        </div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-[var(--line)] px-6 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
