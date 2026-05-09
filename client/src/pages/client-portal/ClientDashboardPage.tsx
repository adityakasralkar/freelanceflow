import { Link } from '@tanstack/react-router';
import { Clock3, FolderKanban, Receipt, ArrowRight } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/shared/StatCard';
import EmptyState from '../../components/shared/EmptyState';
import { useClientInvoices, useClientProjects } from '../../hooks/useClientPortal';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency, formatDate } from '../../utils';

export default function ClientDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data: projects = [], isLoading: projectsLoading } = useClientProjects();
  const { data: invoices = [], isLoading: invoicesLoading } = useClientInvoices();

  const activeProjects = projects.filter((project) => project.status !== 'completed');
  const completedProjects = projects.filter((project) => project.status === 'completed');
  const pendingInvoices = invoices.filter((invoice) => invoice.status !== 'paid');
  const pendingAmount = pendingInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.total_amount),
    0
  );
  const paidAmount = invoices
    .filter((invoice) => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + Number(invoice.total_amount), 0);
  const currency = invoices[0]?.currency || projects[0]?.currency || 'INR';

  const latestInvoice = [...invoices].sort(
    (a, b) => +new Date(b.issue_date) - +new Date(a.issue_date)
  )[0];

  return (
    <PageLayout
      title={`Welcome, ${(user?.name || 'there').split(' ')[0]}`}
      subtitle="Your projects and invoices in one place."
      actions={
        latestInvoice ? (
          <Link to="/client/invoices/$invoiceId" params={{ invoiceId: latestInvoice.id }}>
            <Button variant="secondary">Latest invoice</Button>
          </Link>
        ) : undefined
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          icon={FolderKanban}
          label="Active projects"
          value={String(activeProjects.length)}
          tone="blue"
        />
        <StatCard
          icon={Clock3}
          label="Pending invoices"
          value={formatCurrency(pendingAmount, currency)}
          tone="amber"
        />
        <StatCard
          icon={Receipt}
          label="Paid to date"
          value={formatCurrency(paidAmount, currency)}
          tone="green"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3.5">
            <h3 className="text-[14px] font-bold text-[var(--text)]">My projects</h3>
            <Link
              to="/client/projects"
              className="text-[12px] font-semibold text-[var(--green-dark)] hover:underline"
            >
              View all
            </Link>
          </div>
          {projectsLoading ? (
            <div className="px-5 py-6 text-sm text-[var(--muted)]">Loading projects…</div>
          ) : projects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              heading="No projects yet"
              subtext="Projects will appear here once your freelancer starts work."
            />
          ) : (
            <div className="divide-y divide-[var(--line)]">
              {projects.slice(0, 4).map((project) => (
                <Link
                  key={project.id}
                  to="/client/projects/$projectId"
                  params={{ projectId: project.id }}
                  className="block px-5 py-4 transition-colors hover:bg-[#fafbfc]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-[14px] font-semibold text-[var(--text)]">
                        {project.title}
                      </div>
                      <div className="mt-1 text-[12px] text-[var(--muted)]">
                        With {project.freelancer_name || 'your freelancer'}
                        {project.end_date ? ` · Due ${formatDate(project.end_date)}` : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge status={project.status} />
                      <ArrowRight className="h-4 w-4 text-[var(--faint)]" strokeWidth={1.8} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-[14px] font-bold text-[var(--text)]">Invoice snapshot</h3>
            {invoicesLoading ? (
              <div className="mt-3 text-sm text-[var(--muted)]">Loading invoices…</div>
            ) : invoices.length === 0 ? (
              <p className="mt-3 text-[13px] leading-6 text-[var(--muted)]">
                No invoices have been issued to you yet.
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                <MetricRow label="Outstanding" value={formatCurrency(pendingAmount, currency)} />
                <MetricRow
                  label="Completed projects"
                  value={String(completedProjects.length)}
                />
                <MetricRow label="Invoices issued" value={String(invoices.length)} />
              </div>
            )}
          </Card>

          <Card className="overflow-hidden p-0">
            <div className="border-b border-[var(--line)] px-5 py-3.5">
              <h3 className="text-[14px] font-bold text-[var(--text)]">Recent invoices</h3>
            </div>
            {invoices.length === 0 ? (
              <div className="px-5 py-6 text-[13px] text-[var(--muted)]">
                No invoices yet.
              </div>
            ) : (
              <div className="divide-y divide-[var(--line)]">
                {invoices.slice(0, 3).map((invoice) => (
                  <Link
                    key={invoice.id}
                    to="/client/invoices/$invoiceId"
                    params={{ invoiceId: invoice.id }}
                    className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-[#fafbfc]"
                  >
                    <div className="min-w-0">
                      <div className="mono text-[13px] font-semibold text-[var(--green-dark)]">
                        {invoice.invoice_number}
                      </div>
                      <div className="truncate text-[12px] text-[var(--muted)]">
                        {invoice.project_title || 'Invoice'} · {formatDate(invoice.issue_date)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="mono text-[13px] font-semibold text-[var(--text)]">
                        {formatCurrency(invoice.total_amount, invoice.currency)}
                      </div>
                      <div className="mt-1 inline-flex">
                        <Badge status={invoice.status} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[12px] text-[var(--muted)]">{label}</span>
      <span className="mono text-[13px] font-semibold text-[var(--text)]">{value}</span>
    </div>
  );
}
