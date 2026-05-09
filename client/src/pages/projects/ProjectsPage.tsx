import { useMemo, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Folder } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/shared/Avatar';
import EmptyState from '../../components/shared/EmptyState';
import { useProjects } from '../../hooks/useProjects';
import { api } from '../../lib/api';
import { formatCurrency, formatDateShort, cn } from '../../utils';
import type { Project, ProjectStatus, Milestone } from '../../types';

type TabKey = 'all' | ProjectStatus;
const TABS: { key: TabKey; label: string }[] = [
  { key: 'all',       label: 'All' },
  { key: 'active',    label: 'In progress' },
  { key: 'on_hold',   label: 'On hold' },
  { key: 'completed', label: 'Completed' },
];

export default function ProjectsPage() {
  const [tab, setTab] = useState<TabKey>('all');
  const [search, setSearch] = useState('');

  const { data: all = [], isLoading } = useProjects();

  const counts = useMemo(() => {
    const c: Record<TabKey, number> = {
      all: all.length,
      active: 0,
      on_hold: 0,
      completed: 0,
      archived: 0,
    };
    for (const p of all) c[p.status]++;
    return c;
  }, [all]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return all
      .filter((p) => tab === 'all' || p.status === tab)
      .filter(
        (p) =>
          !q ||
          p.title.toLowerCase().includes(q) ||
          (p.client_name || '').toLowerCase().includes(q)
      );
  }, [all, tab, search]);

  return (
    <PageLayout
      title="Projects"
      subtitle={
        all.length === 0
          ? 'No projects yet'
          : `${counts.active} active · ${counts.completed} completed`
      }
      searchPlaceholder="Search projects…"
      searchValue={search}
      onSearchChange={setSearch}
    >
      {/* Tab pills */}
      <div className="mb-4 flex items-center gap-2">
        <div className="inline-flex gap-0.5 rounded-lg bg-[#f1f3f6] p-[3px]">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors',
                tab === t.key
                  ? 'bg-white font-semibold text-[var(--text)] shadow-[var(--shadow-sm)]'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              )}
            >
              {t.label}
              <span
                className={cn(
                  'ml-1.5 rounded-full px-1.5 text-[11px] font-semibold',
                  tab === t.key
                    ? 'bg-[var(--green-soft)] text-[var(--green-dark)]'
                    : 'bg-[#eef0f3] text-[var(--muted)]'
                )}
              >
                {counts[t.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="h-[180px] animate-pulse bg-[#f3f6fa]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-0">
          <EmptyState
            icon={Folder}
            heading={
              all.length === 0 ? 'No projects yet' : 'No projects match this view'
            }
            subtext={
              all.length === 0
                ? 'Convert an accepted proposal into a project from the Proposals page.'
                : 'Try a different filter or clear your search.'
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}

// ---------------------------------------------------------------------------
function ProjectCard({ project }: { project: Project }) {
  // Fetch milestones for this card to compute progress.
  const milestonesQ = useQueries({
    queries: [
      {
        queryKey: ['milestones', project.id],
        queryFn: () =>
          api.get<Milestone[]>(`/projects/${project.id}/milestones`),
        staleTime: 60_000,
      },
    ],
  })[0];

  const milestones = milestonesQ.data || [];
  const total = milestones.length;
  const done = milestones.filter((m) => m.status === 'completed').length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: project.id }}
      className="group block"
    >
      <Card className="p-[18px] transition-shadow hover:shadow-[var(--shadow)]">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar name={project.client_name || project.title} size="md" />
            <div className="min-w-0">
              <div className="truncate text-[12px] font-semibold text-[var(--text)]">
                {project.client_name || '—'}
              </div>
              <div className="truncate text-[11px] text-[var(--muted)]">
                {project.client_company || project.client_email || 'Client project'}
              </div>
            </div>
          </div>
          <Badge status={project.status} />
        </div>

        <h3 className="mt-3.5 line-clamp-2 min-h-[40px] text-[15px] font-bold leading-snug text-[var(--text)]">
          {project.title}
        </h3>

        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[var(--muted)]">
              {total === 0
                ? 'No milestones yet'
                : `${done} / ${total} milestones`}
            </span>
            <span className="font-bold text-[var(--text)]">{percent}%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#eef0f3]">
            <div
              className={cn(
                'h-full rounded-full transition-[width]',
                percent === 100 ? 'bg-[var(--green)]' : 'bg-[var(--amber)]'
              )}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between border-t border-[var(--line)] pt-3">
          <div>
            <div className="text-[11px] text-[var(--muted)]">Value</div>
            <div className="mono mt-0.5 text-[14px] font-bold text-[var(--text)]">
              {formatCurrency(project.total_amount || 0, project.currency)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-[var(--muted)]">Due</div>
            <div className="mt-0.5 text-[13px] font-semibold text-[var(--text)]">
              {project.end_date ? formatDateShort(project.end_date) : '—'}
            </div>
          </div>
        </div>

        <div className="mt-3 flex h-[30px] items-center justify-end">
          <span className="inline-flex translate-y-1 items-center gap-1 rounded-[7px] border border-[var(--line-strong)] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-[var(--green-dark)] opacity-0 shadow-[var(--shadow-sm)] transition-all group-hover:translate-y-0 group-hover:opacity-100">
            Open
            <ArrowRight className="h-3 w-3" strokeWidth={2} />
          </span>
        </div>
      </Card>
    </Link>
  );
}
