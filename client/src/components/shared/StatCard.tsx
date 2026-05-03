import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Card from '../ui/Card';
import { cn } from '../../utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: { value: string; trend: 'up' | 'down' };
  iconColor?: { bg: string; fg: string };
  className?: string;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  iconColor = { bg: '#EAF8F2', fg: '#0F9F72' },
  className,
}: StatCardProps) {
  return (
    <Card className={cn('p-5', className)}>
      <div className="flex items-start justify-between">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: iconColor.bg }}
        >
          <Icon className="h-4 w-4" strokeWidth={1.5} style={{ color: iconColor.fg }} />
        </div>
        {delta && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-medium',
              delta.trend === 'up' ? 'text-[#0F9F72]' : 'text-[#DC2626]'
            )}
          >
            {delta.trend === 'up' ? (
              <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
            ) : (
              <ArrowDownRight className="h-3 w-3" strokeWidth={2} />
            )}
            {delta.value}
          </span>
        )}
      </div>
      <div className="mt-3 text-xs font-medium text-[#667085]">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-[#111827]">
        {value}
      </div>
    </Card>
  );
}
