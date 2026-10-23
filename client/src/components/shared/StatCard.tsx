import type { LucideIcon } from 'lucide-react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '../../utils';

type Tone = 'green' | 'blue' | 'amber' | 'red' | 'purple' | 'neutral';

interface StatCardProps {
  icon?: LucideIcon;
  label: string;
  value: string;
  delta?: { value: string; trend: 'up' | 'down' };
  /** Small caption shown in the footer, right-aligned (e.g. "12 invoices"). */
  sub?: string;
  tone?: Tone;
  /** Emerald gradient "hero" stat — the headline number of the page. */
  hero?: boolean;
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
  sub,
  tone,
  hero = false,
  iconColor,
  className,
}: StatCardProps) {
  // Map legacy iconColor.bg to nearest tone, otherwise default to green.
  const resolvedTone: Tone =
    tone ?? (iconColor ? legacyMapToTone(iconColor.bg) : 'green');
  const styles = TONE_STYLES[resolvedTone];

  return (
    <div className={cn('pl-stat', hero && 'hero', className)}>
      <div className="pl-stat-top">
        <div className="pl-stat-label">{label}</div>
        {Icon && (
          <div
            className="pl-stat-ic"
            style={hero ? undefined : { background: styles.bg, color: styles.fg }}
          >
            <Icon className="h-4 w-4" strokeWidth={1.9} />
          </div>
        )}
      </div>
      <div className="pl-stat-val pl-num">{value}</div>
      {(delta || sub) && (
        <div className="pl-stat-foot">
          {delta ? (
            <span className={cn('pl-trend', delta.trend)}>
              {delta.trend === 'up' ? (
                <TrendingUp className="h-[13px] w-[13px]" strokeWidth={2} />
              ) : (
                <TrendingDown className="h-[13px] w-[13px]" strokeWidth={2} />
              )}
              {delta.value}
            </span>
          ) : (
            <span />
          )}
          {sub && <span className="pl-stat-sub">{sub}</span>}
        </div>
      )}
    </div>
  );
}

function legacyMapToTone(bg: string): Tone {
  const b = bg.toLowerCase();
  if (b.includes('eaf8f2') || b.includes('e8f6f0') || b.includes('--green')) return 'green';
  if (b.includes('eff6ff') || b.includes('eef4ff') || b.includes('--blue')) return 'blue';
  if (b.includes('fff7ed') || b.includes('fdf5e8') || b.includes('--amber')) return 'amber';
  if (b.includes('fef2f2') || b.includes('fdf0ed') || b.includes('--red')) return 'red';
  if (b.includes('f5f3ff') || b.includes('f3f0fe') || b.includes('--purple')) return 'purple';
  return 'neutral';
}
