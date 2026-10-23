import type { LucideIcon } from 'lucide-react';
import Button from '../ui/Button';

interface EmptyStateProps {
  icon: LucideIcon;
  heading: string;
  subtext?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon,
  heading,
  subtext,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--green-soft)]">
        <Icon className="h-6 w-6 text-[var(--green)]" strokeWidth={1.5} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-[var(--text)]">{heading}</h3>
      {subtext && (
        <p className="mt-1 max-w-sm text-sm text-[var(--muted)]">{subtext}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
