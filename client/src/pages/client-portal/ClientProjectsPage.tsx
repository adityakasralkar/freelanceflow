import { Link } from '@tanstack/react-router';
import { ArrowRight, FolderKanban } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/shared/EmptyState';
import { useClientProjects } from '../../hooks/useClientPortal';
import { formatCurrency, formatDate } from '../../utils';

export default function ClientProjectsPage() {
  const { data: projects = [], isLoading } = useClientProjects();

  return (
    <PageLayout
      title="My Projects"
      subtitle={
        projects.length === 0
          ? 'No projects yet'
          : `${projects.filter((project) => project.status !== 'completed').length} active · ${projects.filter((project) => project.status === 'completed').length} completed`
      }
    >
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <Card key={item} className="h-[180px] animate-pulse bg-[#f3f6fa]" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card className="p-0">
          <EmptyState
            icon={FolderKanban}
            heading="No projects yet"
            subtext="Your project work will appear here once your freelancer kicks things off."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.id}
              to="/client/projects/$projectId"
              params={{ projectId: project.id }}
              className="group block"
            >
              <Card className="p-[18px] transition-shadow hover:shadow-[var(--shadow)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-bold text-[var(--text)]">
                      {project.title}
                    </div>
                    <div className="mt-1 text-[12px] text-[var(--muted)]">
                      With {project.freelancer_name || 'your freelancer'}
                    </div>
                  </div>
                  <Badge status={project.status} />
                </div>

                <p className="mt-3 line-clamp-2 min-h-[42px] text-[13px] leading-6 text-[var(--muted)]">
                  {project.description || 'No project description has been shared yet.'}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[var(--line)] pt-4">
                  <Metric label="Started" value={formatDate(project.start_date)} />
                  <Metric label="Due" value={formatDate(project.end_date)} />
                  <Metric
                    label="Value"
                    value={formatCurrency(project.total_amount || 0, project.currency)}
                    mono
                  />
                </div>

                <div className="mt-4 flex justify-end text-[12px] font-semibold text-[var(--green-dark)] opacity-0 transition-opacity group-hover:opacity-100">
                  View details <ArrowRight className="ml-1 h-3.5 w-3.5" strokeWidth={2} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageLayout>
  );
}

function Metric({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="text-[11px] text-[var(--muted)]">{label}</div>
      <div className={mono ? 'mono mt-1 text-[13px] font-semibold text-[var(--text)]' : 'mt-1 text-[13px] font-semibold text-[var(--text)]'}>
        {value}
      </div>
    </div>
  );
}
