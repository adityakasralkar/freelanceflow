import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Card from '../ui/Card';
import { cn } from '../../utils';

type Tone = 'green' | 'blue' | 'amber' | 'red' | 'purple' | 'neutral';

interface StatCardProps {
  icon?: LucideIcon;
  label: string;
  value: string;
  delta?: { value: string; trend: 'up' | 'down' };
  tone?: Tone;
  /** @deprecated use `tone`. Kept for backwards-compat with existing callers. */
  iconColor?: { bg: string; fg: string };
  className?: string;
}

const TONE_STYLES: Record<Tone, { bg: string; fg: string }> = {
  green:   { bg: 'var(--green-soft)',  fg: 'var(--green-dark)' },
  blue:    { bg: 'var(--blue-soft)',   fg: 'var(--blue)'       },
  amber:   { bg: 'var(--amber-soft)',  fg: 'var(--amber)'      },
  red:     { bg: 'var(--red-soft)',    fg: 'var(--red)'        },
  purple:  { bg: 'var(--purple-soft)', fg: 'var(--purple)'     },
  neutral: { bg: 'var(--panel-soft)',  fg: 'var(--muted)'      },
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  tone,
  iconColor,
  className,
}: StatCardProps) {
  // Map legacy iconColor.bg to nearest tone, otherwise default to neutral.
  const resolvedTone: Tone =
    tone ?? (iconColor ? legacyMapToTone(iconColor.bg) : 'neutral');
  const styles = TONE_STYLES[resolvedTone];

  return (
    <Card className={cn('p-[18px] flex flex-col gap-2.5', className)}>
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-[var(--muted)]">{label}</div>
        {Icon && (
          <div
            className="h-7 w-7 rounded-[7px] grid place-items-center"
            style={{ backgroundColor: styles.bg, color: styles.fg }}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
          </div>
        )}
      </div>
      <div className="text-[26px] font-bold tracking-[-0.02em] leading-[1.1] text-[var(--text)]">
        {value}
      </div>
      {delta && (
        <div
          className={cn(
            'inline-flex items-center gap-1 text-[11px] font-semibold',
            delta.trend === 'up' ? 'text-[var(--green-dark)]' : 'text-[var(--red)]'
          )}
        >
          {delta.trend === 'up' ? (
            <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
          ) : (
            <ArrowDownRight className="h-3 w-3" strokeWidth={2} />
          )}
          {delta.value}
        </div>
      )}
    </Card>
  );
}

function legacyMapToTone(bg: string): Tone {
  const b = bg.toLowerCase();
  if (b.includes('eaf8f2')) return 'green';
  if (b.includes('eff6ff')) return 'blue';
  if (b.includes('fff7ed')) return 'amber';
  if (b.includes('fef2f2')) return 'red';
  if (b.includes('f5f3ff')) return 'purple';
  return 'neutral';
}
