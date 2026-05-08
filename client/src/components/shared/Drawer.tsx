import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}

export default function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 460,
}: DrawerProps) {
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
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: 'rgba(16, 24, 40, 0.20)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width,
          boxShadow: '-16px 0 50px rgba(16,24,40,0.10)',
        }}
        className="flex h-full flex-col border-l border-[var(--line)] bg-white"
      >
        {(title || subtitle) && (
          <div className="flex items-center justify-between gap-2 border-b border-[var(--line)] px-5 py-4">
            <div className="min-w-0 flex-1">
              {title && (
                <h3 className="truncate text-[15px] font-bold text-[var(--text)]">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-0.5 truncate text-[12px] text-[var(--muted)]">
                  {subtitle}
                </p>
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
        <div className="flex flex-1 flex-col gap-[18px] overflow-y-auto p-5">
          {children}
        </div>
        {footer && (
          <div className="flex flex-col gap-2.5 border-t border-[var(--line)] px-5 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
