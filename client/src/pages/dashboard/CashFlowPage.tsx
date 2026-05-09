import {
  TrendingUp,
  Clock,
  AlertTriangle,
  CalendarClock,
  Inbox,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import StatCard from '../../components/shared/StatCard';
import EmptyState from '../../components/shared/EmptyState';
import { useCashFlow } from '../../hooks/useCashFlow';
import { formatCurrency } from '../../utils';

const DONUT_COLORS = ['#0F9F72', '#2563EB', '#7C3AED', '#D97706', '#DC2626', '#0EA5E9'];

const SkeletonStat = () => (
  <Card className="p-5">
    <div className="h-9 w-9 animate-pulse rounded-lg bg-[#F3F6FA]" />
    <div className="mt-3 h-3 w-24 animate-pulse rounded bg-[#F3F6FA]" />
    <div className="mt-2 h-7 w-32 animate-pulse rounded bg-[#F3F6FA]" />
  </Card>
);

const SkeletonCard = ({ height }: { height: number }) => (
  <Card className="p-5">
    <div className="h-3 w-32 animate-pulse rounded bg-[#F3F6FA]" />
    <div
      className="mt-4 animate-pulse rounded bg-[#F3F6FA]"
      style={{ height: `${height}px` }}
    />
  </Card>
);

export default function CashFlowPage() {
  const cf = useCashFlow();

  return (
    <PageLayout
      title="Cash Flow"
      subtitle="Earnings, pending payments, and aging across your invoices."
    >
      {/* Row 1: stat cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cf.isLoading ? (
          <>
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
          </>
        ) : (
          <>
            <StatCard
              icon={TrendingUp}
              label="Total earned"
              value={formatCurrency(cf.totalEarned, cf.currency)}
              iconColor={{ bg: '#EAF8F2', fg: '#0F9F72' }}
            />
            <StatCard
              icon={Clock}
              label="Pending"
              value={formatCurrency(cf.pending, cf.currency)}
              iconColor={{ bg: '#FFF7ED', fg: '#D97706' }}
            />
            <StatCard
              icon={AlertTriangle}
              label="Overdue"
              value={formatCurrency(cf.overdue, cf.currency)}
              iconColor={{ bg: '#FEF2F2', fg: '#DC2626' }}
            />
            <StatCard
              icon={CalendarClock}
              label="Projected (next 30 days)"
              value={formatCurrency(cf.projected, cf.currency)}
              iconColor={{ bg: '#EFF6FF', fg: '#2563EB' }}
            />
          </>
        )}
      </div>

      {cf.hasMixedCurrencies && (
        <p className="mt-2 text-xs text-[#98A2B3]">
          Multiple currencies detected — totals shown in{' '}
          <span className="font-medium text-[#667085]">{cf.currency}</span> are not
          converted across currencies.
        </p>
      )}

      {/* Row 2: monthly revenue */}
      <div className="mt-6">
        {cf.isLoading ? (
          <SkeletonCard height={260} />
        ) : (
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#111827]">
                Monthly revenue · last 6 months
              </h3>
            </div>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cf.monthly} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                  <CartesianGrid stroke="#E5E9F0" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: '#667085' }}
                    axisLine={{ stroke: '#E5E9F0' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#667085' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =>
                      formatCurrency(Number(v), cf.currency).replace(/\.00$/, '')
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #E5E9F0',
                      fontSize: '12px',
                    }}
                    formatter={(v) => formatCurrency(Number(v), cf.currency)}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} iconType="circle" />
                  <Bar dataKey="earned" name="Earned" fill="#0F9F72" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" name="Pending" fill="#D97706" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="overdue" name="Overdue" fill="#DC2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>

      {/* Row 3: income by client + aging */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {cf.isLoading ? (
          <>
            <SkeletonCard height={260} />
            <SkeletonCard height={260} />
          </>
        ) : (
          <>
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-[#111827]">Income by client</h3>

              {cf.byClient.length === 0 ? (
                <div className="py-6">
                  <EmptyState
                    icon={Inbox}
                    heading="No paid invoices yet"
                    subtext="Once invoices get paid, you'll see how revenue breaks down here."
                  />
                </div>
              ) : (
                <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={cf.byClient}
                          dataKey="total"
                          nameKey="client_name"
                          innerRadius={48}
                          outerRadius={80}
                          paddingAngle={2}
                          stroke="#fff"
                          strokeWidth={2}
                        >
                          {cf.byClient.map((_, idx) => (
                            <Cell
                              key={idx}
                              fill={DONUT_COLORS[idx % DONUT_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: '8px',
                            border: '1px solid #E5E9F0',
                            fontSize: '12px',
                          }}
                          formatter={(v) => formatCurrency(Number(v), cf.currency)}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <ul className="flex flex-col justify-center gap-2 text-sm">
                    {cf.byClient.slice(0, 6).map((c, idx) => (
                      <li key={c.client_id} className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }}
                        />
                        <span className="min-w-0 flex-1 truncate text-[#111827]">
                          {c.client_name}
                        </span>
                        <span className="shrink-0 text-xs font-medium text-[#667085]">
                          {c.percent.toFixed(0)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-semibold text-[#111827]">Invoice aging</h3>
              {cf.aging.every((b) => b.amount === 0) ? (
                <div className="py-6">
                  <EmptyState
                    icon={Clock}
                    heading="Nothing outstanding"
                    subtext="No pending or overdue invoices to age."
                  />
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {cf.aging.map((bucket) => {
                    const max = Math.max(...cf.aging.map((b) => b.amount), 1);
                    const widthPct = (bucket.amount / max) * 100;
                    return (
                      <div key={bucket.label}>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[#667085]">
                            {bucket.label}
                          </span>
                          <span className="font-mono text-[#111827]">
                            {formatCurrency(bucket.amount, cf.currency)}
                            {bucket.count > 0 && (
                              <span className="ml-1 text-[#98A2B3]">
                                · {bucket.count} inv
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#F3F6FA]">
                          <div
                            className="h-full rounded-full bg-[#D97706] transition-[width]"
                            style={{ width: `${widthPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </PageLayout>
  );
}
