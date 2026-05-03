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
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF8F2]">
        <Icon className="h-6 w-6 text-[#0F9F72]" strokeWidth={1.5} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-[#111827]">{heading}</h3>
      {subtext && (
        <p className="mt-1 max-w-sm text-sm text-[#667085]">{subtext}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
