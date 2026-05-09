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

type Tone = 'gray' | 'blue' | 'green' | 'amber' | 'red' | 'purple';

const STATUS_TO_TONE: Record<BadgeStatus, Tone> = {
  draft: 'gray',
  sent: 'blue',
  accepted: 'green',
  declined: 'red',
  active: 'blue',
  on_hold: 'amber',
  completed: 'green',
  archived: 'gray',
  upcoming: 'gray',
  in_progress: 'amber',
  invoiced: 'purple',
  paid: 'green',
  overdue: 'red',
};

const STATUS_LABEL: Record<BadgeStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  accepted: 'Accepted',
  declined: 'Declined',
  active: 'Active',
  on_hold: 'On hold',
  completed: 'Completed',
  archived: 'Archived',
  upcoming: 'Upcoming',
  in_progress: 'In progress',
  invoiced: 'Invoiced',
  paid: 'Paid',
  overdue: 'Overdue',
};

const TONE_STYLES: Record<Tone, { bg: string; color: string }> = {
  gray:   { bg: '#f1f3f6',          color: '#475467'           },
  blue:   { bg: 'var(--blue-soft)',  color: 'var(--blue)'       },
  green:  { bg: 'var(--green-soft)', color: 'var(--green-dark)' },
  amber:  { bg: 'var(--amber-soft)', color: 'var(--amber)'      },
  red:    { bg: 'var(--red-soft)',   color: 'var(--red)'        },
  purple: { bg: 'var(--purple-soft)',color: 'var(--purple)'     },
};

export default function Badge({ status, className }: BadgeProps) {
  const tone = STATUS_TO_TONE[status];
  const style = TONE_STYLES[tone];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 h-[22px] rounded-full px-2 text-[11px] font-semibold whitespace-nowrap',
        className
      )}
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      <span className="h-1 w-1 rounded-full" style={{ backgroundColor: 'currentColor' }} />
      {STATUS_LABEL[status]}
    </span>
  );
}
