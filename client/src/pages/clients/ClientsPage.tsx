import { useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Mail, Plus, Users } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/shared/Avatar';
import EmptyState from '../../components/shared/EmptyState';
import { useClients } from '../../hooks/useClients';
import { useProjects } from '../../hooks/useProjects';
import { useInvoices } from '../../hooks/useInvoices';
import { formatCurrency } from '../../utils';
import type { Client } from '../../types';
import ClientFormModal from './ClientFormModal';

interface ClientMetrics {
  projects: number;
  billed: number;
  outstanding: number;
}

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [modalClient, setModalClient] = useState<Client | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: clients = [], isLoading } = useClients();
  const { data: projects = [] } = useProjects('all');
  const { data: invoices = [] } = useInvoices('all');

  const metrics = useMemo(() => {
    const next = new Map<string, ClientMetrics>();
    for (const client of clients) {
      next.set(client.id, { projects: 0, billed: 0, outstanding: 0 });
    }

    for (const project of projects) {
      const stat = next.get(project.client_id);
      if (stat) stat.projects += 1;
    }

    for (const invoice of invoices) {
      const stat = next.get(invoice.client_id);
      if (!stat) continue;
      const total = Number(invoice.total_amount);
      stat.billed += total;
      if (invoice.status !== 'paid') stat.outstanding += total;
    }

    return next;
  }, [clients, invoices, projects]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return clients.filter((client) => {
      if (!query) return true;
      return (
        client.name.toLowerCase().includes(query) ||
        (client.company || '').toLowerCase().includes(query) ||
        (client.email || '').toLowerCase().includes(query)
      );
    });
  }, [clients, search]);

  return (
    <>
      <PageLayout
        title="Clients"
        subtitle={
          clients.length === 0
            ? 'No clients yet'
            : `${clients.length} clients across your active pipeline`
        }
        searchPlaceholder="Search clients…"
        searchValue={search}
        onSearchChange={setSearch}
        actions={
          <Button
            onClick={() => {
              setModalClient(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.25} /> Add client
          </Button>
        }
      >
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <Card key={item} className="h-[186px] animate-pulse bg-[#f3f6fa]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="p-0">
            <EmptyState
              icon={Users}
              heading={clients.length === 0 ? 'No clients yet' : 'No clients match this search'}
              subtext={
                clients.length === 0
                  ? 'Add your first client so you can start sending proposals and generating invoices.'
                  : 'Try a different search term or clear the filter.'
              }
              actionLabel={clients.length === 0 ? 'Add client' : undefined}
              onAction={
                clients.length === 0
                  ? () => {
                      setModalClient(null);
                      setModalOpen(true);
                    }
                  : undefined
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                metrics={metrics.get(client.id)}
                onEdit={() => {
                  setModalClient(client);
                  setModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </PageLayout>

      <ClientFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        client={modalClient}
      />
    </>
  );
}

function ClientCard({
  client,
  metrics,
  onEdit,
}: {
  client: Client;
  metrics?: ClientMetrics;
  onEdit: () => void;
}) {
  return (
    <Link to="/clients/$clientId" params={{ clientId: client.id }} className="block">
      <Card className="p-[18px] transition-shadow hover:shadow-[var(--shadow)]">
        <div className="flex items-start gap-3">
          <Avatar name={client.company || client.name} size="xl" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[15px] font-bold text-[var(--text)]">
              {client.company || client.name}
            </div>
            <div className="truncate text-[12px] text-[var(--muted)]">
              {client.name}
            </div>
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onEdit();
            }}
            className="rounded-[7px] border border-[var(--line-strong)] px-2.5 py-1.5 text-[12px] font-semibold text-[var(--muted)] transition-colors hover:bg-[var(--panel-soft)] hover:text-[var(--text)]"
          >
            Edit
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[12px] text-[var(--muted)]">
          <Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
          <span className="truncate">{client.email || 'No email added yet'}</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[var(--line)] pt-4">
          <Metric label="Projects" value={String(metrics?.projects || 0)} />
          <Metric
            label="Billed"
            value={formatCurrency(metrics?.billed || 0, client.currency)}
            mono
          />
          <Metric
            label="Outstanding"
            value={formatCurrency(metrics?.outstanding || 0, client.currency)}
            mono
            accent={(metrics?.outstanding || 0) > 0 ? 'amber' : 'muted'}
          />
        </div>
      </Card>
    </Link>
  );
}

function Metric({
  label,
  value,
  mono = false,
  accent = 'default',
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: 'default' | 'muted' | 'amber';
}) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] text-[var(--muted)]">{label}</div>
      <div
        className={[
          'mt-1 truncate text-[13px] font-bold',
          mono ? 'mono' : '',
          accent === 'amber'
            ? 'text-[var(--amber)]'
            : accent === 'muted'
              ? 'text-[var(--muted)]'
              : 'text-[var(--text)]',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {value}
      </div>
    </div>
  );
}
