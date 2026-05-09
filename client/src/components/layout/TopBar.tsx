import { Bell, ChevronRight, Search } from 'lucide-react';
import type { ReactNode } from 'react';

interface BreadcrumbItem {
  label: string;
}

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumb?: BreadcrumbItem[];
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export default function TopBar({
  title,
  subtitle,
  actions,
  breadcrumb,
  searchPlaceholder,
  searchValue,
  onSearchChange,
}: TopBarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[var(--line)] bg-white px-6">
      <div className="min-w-0 flex-1">
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="mb-1 flex items-center gap-1.5 text-[12px] text-[var(--muted)]">
            {breadcrumb.map((b, i) => (
              <span key={i} className="inline-flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3" strokeWidth={1.5} />}
                <span
                  className={
                    i === breadcrumb.length - 1
                      ? 'font-semibold text-[var(--text)]'
                      : ''
                  }
                >
                  {b.label}
                </span>
              </span>
            ))}
          </div>
        )}
        <h1 className="truncate text-[18px] font-bold tracking-[-0.01em] text-[var(--text)]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-[12px] text-[var(--muted)]">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {searchPlaceholder && (
          <div className="relative w-[280px]">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--faint)]"
              strokeWidth={1.75}
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="h-[38px] w-full rounded-[7px] border border-[var(--line-strong)] bg-white pl-9 pr-3 text-[13px] text-[var(--text)] placeholder:text-[var(--faint)] outline-none transition-colors focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/15"
            />
          </div>
        )}
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-[7px] border border-[var(--line-strong)] bg-white text-[var(--muted)] transition-colors hover:bg-[var(--panel-soft)] hover:text-[var(--text)]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" strokeWidth={1.75} />
        </button>
        {actions}
      </div>
    </header>
  );
}
