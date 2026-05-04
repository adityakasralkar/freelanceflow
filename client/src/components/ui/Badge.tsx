import { cn } from '../../utils';

export type BadgeStatus =
  | 'draft'
  | 'sent'
  | 'accepted'
  | 'declined'
  | 'active'
  | 'on_hold'
  | 'completed'
  | 'archived'
  | 'upcoming'
  | 'in_progress'
  | 'invoiced'
  | 'paid'
  | 'overdue';

interface BadgeProps {
  status: BadgeStatus;
  className?: string;
}

const STYLES: Record<BadgeStatus, { text: string; bg: string; border: string; dot: string; label: string }> = {
  draft:       { text: '#667085', bg: '#F3F6FA', border: '#E5E9F0', dot: '#98A2B3', label: 'Draft' },
  sent:        { text: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', dot: '#2563EB', label: 'Sent' },
  accepted:    { text: '#0F9F72', bg: '#EAF8F2', border: '#6EE7B7', dot: '#0F9F72', label: 'Accepted' },
  declined:    { text: '#DC2626', bg: '#FEF2F2', border: '#FECACA', dot: '#DC2626', label: 'Declined' },
  active:      { text: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', dot: '#2563EB', label: 'Active' },
  on_hold:     { text: '#D97706', bg: '#FFF7ED', border: '#FDE68A', dot: '#D97706', label: 'On hold' },
  completed:   { text: '#065F46', bg: '#ECFDF5', border: '#A7F3D0', dot: '#0F9F72', label: 'Completed' },
  archived:    { text: '#667085', bg: '#F3F6FA', border: '#E5E9F0', dot: '#98A2B3', label: 'Archived' },
  upcoming:    { text: '#667085', bg: '#F3F6FA', border: '#E5E9F0', dot: '#98A2B3', label: 'Upcoming' },
  in_progress: { text: '#D97706', bg: '#FFF7ED', border: '#FDE68A', dot: '#D97706', label: 'In progress' },
  invoiced:    { text: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', dot: '#7C3AED', label: 'Invoiced' },
  paid:        { text: '#065F46', bg: '#ECFDF5', border: '#6EE7B7', dot: '#0F9F72', label: 'Paid' },
  overdue:     { text: '#DC2626', bg: '#FEF2F2', border: '#FECACA', dot: '#DC2626', label: 'Overdue' },
};

export default function Badge({ status, className }: BadgeProps) {
  const s = STYLES[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        className
      )}
      style={{ color: s.text, backgroundColor: s.bg, borderColor: s.border }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
      {s.label}
    </span>
  );
}
