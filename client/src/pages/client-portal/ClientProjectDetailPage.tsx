import { useMemo } from 'react';
import { useParams } from '@tanstack/react-router';
import { Flag, Mail } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useClientProject } from '../../hooks/useClientPortal';
import { formatCurrency, formatDate } from '../../utils';

export default function ClientProjectDetailPage() {
  const { projectId } = useParams({ strict: false }) as { projectId: string };
  const { data: project, isLoading } = useClientProject(projectId);

  const summary = useMemo(() => {
    if (!project?.milestones) return { total: 0, done: 0, percent: 0 };
    const total = project.milestones.length;
    const done = project.milestones.filter((milestone) => milestone.status === 'completed').length;
    return {
      total,
      done,
      percent: total === 0 ? 0 : Math.round((done / total) * 100),
    };
  }, [project]);

  if (isLoading) {
    return (
      <PageLayout title="Loading project…">
        <div className="text-sm text-[var(--muted)]">Loading project…</div>
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout
        title="Project not found"
        breadcrumb={[{ label: 'My Projects' }, { label: 'Not found' }]}
      >
        <div className="text-sm text-[var(--muted)]">
          We couldn't find this project in your portal.
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={project.title}
      subtitle={`With ${project.freelancer_name || 'your freelancer'}${project.start_date ? ` · Started ${formatDate(project.start_date)}` : ''}`}
      breadcrumb={[{ label: 'My Projects' }, { label: project.title }]}
      actions={
        project.freelancer_email ? (
          <Button
            variant="secondary"
            onClick={() => {
              window.location.href = `mailto:${project.freelancer_email}`;
            }}
          >
            <Mail className="h-3.5 w-3.5" strokeWidth={2} />
            Message
          </Button>
        ) : undefined
      }
    >
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3.5">
            <h3 className="text-[14px] font-bold text-[var(--text)]">Project timeline</h3>
            <span className="text-[12px] text-[var(--muted)]">
              {summary.done} of {summary.total} complete
            </span>
          </div>
          <div className="px-5 py-5">
            <div className="space-y-5">
              {(project.milestones || []).map((milestone, index) => (
                <div key={milestone.id} className="relative pl-7">
                  {index !== (project.milestones || []).length - 1 && (
                    <div className="absolute left-[9px] top-5 h-[calc(100%+12px)] w-px bg-[var(--line)]" />
                  )}
                  <div
                    className={[
                      'absolute left-0 top-1.5 h-[18px] w-[18px] rounded-full border-2 bg-white',
                      milestone.status === 'completed'
                        ? 'border-[var(--green)]'
                        : milestone.status === 'in_progress'
                          ? 'border-[var(--amber)]'
                          : 'border-[var(--line-strong)]',
                    ].join(' ')}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-[14px] font-semibold text-[var(--text)]">
                          {milestone.title}
                        </div>
                        <Badge status={milestone.status} />
                      </div>
                      <div className="mt-1 text-[12px] text-[var(--muted)]">
                        {milestone.due_date ? `Due ${formatDate(milestone.due_date)}` : 'No due date set'}
                      </div>
                      {milestone.description && (
                        <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">
                          {milestone.description}
                        </p>
                      )}
                    </div>
                    <div className="mono text-[13px] font-semibold text-[var(--text)]">
                      {formatCurrency(milestone.amount, project.currency)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-[14px] font-bold text-[var(--text)]">Progress</h3>
            <div className="mt-3 text-[34px] font-bold tracking-[-0.02em] text-[var(--text)]">
              {summary.percent}%
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eef0f3]">
              <div
                className="h-full rounded-full bg-[var(--green)]"
                style={{ width: `${summary.percent}%` }}
              />
            </div>
            <div className="mt-3 text-[12px] text-[var(--muted)]">
              {project.end_date
                ? `Target delivery by ${formatDate(project.end_date)}`
                : 'Delivery date to be confirmed'}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-[var(--blue)]" strokeWidth={1.8} />
              <h3 className="text-[14px] font-bold text-[var(--text)]">Project summary</h3>
            </div>
            <div className="mt-4 space-y-3">
              <Metric label="Status" value={<Badge status={project.status} />} />
              <Metric label="Value" value={formatCurrency(project.total_amount || 0, project.currency)} mono />
              <Metric label="Freelancer" value={project.freelancer_name || '—'} />
              <Metric label="Start date" value={formatDate(project.start_date)} />
              <Metric label="End date" value={formatDate(project.end_date)} />
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

function Metric({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[12px] text-[var(--muted)]">{label}</span>
      <span className={mono ? 'mono text-[13px] font-semibold text-[var(--text)]' : 'text-[13px] font-semibold text-[var(--text)]'}>
        {value}
      </span>
    </div>
  );
}
