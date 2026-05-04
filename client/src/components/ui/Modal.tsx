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

const SIZE_CLASSES = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'flex w-full max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_22px_rgba(15,23,42,0.09)]',
          SIZE_CLASSES[size]
        )}
      >
        {(title || subtitle) && (
          <div className="flex items-start justify-between border-b border-[#E5E9F0] px-6 py-4">
            <div>
              {title && <h3 className="text-lg font-semibold text-[#111827]">{title}</h3>}
              {subtitle && <p className="mt-0.5 text-sm text-[#667085]">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#667085] transition-colors hover:bg-[#F3F6FA] hover:text-[#111827]"
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-[#E5E9F0] bg-[#F8FAFC] px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
