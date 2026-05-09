import { useState, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { Check, Minus, Plus, Receipt, X } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/shared/EmptyState';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import {
  useMilestones,
  useCompleteMilestone,
} from '../../hooks/useMilestones';
import { useInvoices } from '../../hooks/useInvoices';
import { formatCurrency, formatDateShort, cn } from '../../utils';
import type { Milestone } from '../../types';
import GenerateInvoiceModal from './GenerateInvoiceModal';

interface Props {
  projectId: string;
  currency: string;
  onAddClick: () => void;
}

export default function MilestonesTab({ projectId, currency, onAddClick }: Props) {
  const { data: milestones = [], isLoading } = useMilestones(projectId);
  const { data: invoices = [] } = useInvoices();

  const milestoneInvoiceMap = useMemo(() => {
    const map = new Map<string, { id: string; number: string }>();
    for (const inv of invoices) {
      if (inv.milestone_id) {
        map.set(inv.milestone_id, { id: inv.id, number: inv.invoice_number });
      }
    }
    return map;
  }, [invoices]);

  const completeMilestone = useCompleteMilestone();
  const [confirmCompleteId, setConfirmCompleteId] = useState<string | null>(null);
  const [generateForId, setGenerateForId] = useState<string | null>(null);
  const [completionPromptId, setCompletionPromptId] = useState<string | null>(null);

  const total = milestones.length;
  const done = milestones.filter((m) => m.status === 'completed').length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  if (isLoading) {
    return (
      <Card className="p-5">
        <div className="text-sm text-[var(--muted)]">Loading milestones…</div>
      </Card>
    );
  }

  if (milestones.length === 0) {
    return (
      <Card className="p-0">
        <EmptyState
          icon={Plus}
          heading="No milestones yet"
          subtext="Break the project into milestones so you can track progress and bill as you go."
          actionLabel="Add first milestone"
          onAction={onAddClick}
        />
      </Card>
    );
  }

  async function handleComplete(id: string) {
    const result = await completeMilestone.mutateAsync(id);
    setConfirmCompleteId(null);
    if (result.canGenerateInvoice) {
      setCompletionPromptId(id);
    }
  }

  function openGenerateInvoice(milestoneId: string) {
    setCompletionPromptId(null);
    setGenerateForId(milestoneId);
  }

  return (
    <>
      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3.5">
          <div>
            <h3 className="text-[14px] font-bold text-[var(--text)]">
              Milestone timeline
            </h3>
            <span className="text-[12px] text-[var(--muted)]">
              {done} of {total} complete · {percent}%
            </span>
          </div>
          <Button size="sm" variant="secondary" onClick={onAddClick}>
            <Plus className="h-3 w-3" strokeWidth={2.25} />
            Add milestone
          </Button>
        </div>

        <div className="p-6">
          <div className="relative pl-6">
            <div className="absolute bottom-1.5 left-2 top-1.5 w-0.5 bg-[var(--line)]" />
            <ol className="space-y-[18px]">
              {milestones.map((m) => (
                <MilestoneItem
                  key={m.id}
                  milestone={m}
                  currency={currency}
                  invoice={milestoneInvoiceMap.get(m.id)}
                  onComplete={() => setConfirmCompleteId(m.id)}
                  onGenerate={() => openGenerateInvoice(m.id)}
                />
              ))}
            </ol>
          </div>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={!!confirmCompleteId}
        onClose={() => setConfirmCompleteId(null)}
        onConfirm={() => confirmCompleteId && handleComplete(confirmCompleteId)}
        title="Mark milestone complete?"
        message="Once marked complete, you'll be able to generate an invoice for this milestone right away."
        confirmLabel="Mark complete"
        isLoading={completeMilestone.isPending}
      />

      <GenerateInvoiceModal
        milestoneId={generateForId}
        onClose={() => setGenerateForId(null)}
      />

      {completionPromptId && (
        <div className="fixed bottom-6 right-6 z-40 w-[min(360px,calc(100vw-32px))] rounded-lg border border-[#6EE7B7] bg-white p-4 shadow-[var(--shadow)]">
          <div className="flex items-start gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--green-soft)] text-[var(--green-dark)]">
              <Check className="h-4 w-4" strokeWidth={2.25} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-bold text-[var(--text)]">
                Milestone complete!
              </div>
              <div className="mt-0.5 text-[12px] text-[var(--muted)]">
                Generate an invoice for this completed milestone?
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => openGenerateInvoice(completionPromptId)}
                >
                  <Receipt className="h-3 w-3" strokeWidth={1.8} />
                  Generate invoice
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCompletionPromptId(null)}
                >
                  Later
                </Button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCompletionPromptId(null)}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-[7px] text-[var(--muted)] transition-colors hover:bg-[var(--panel-soft)] hover:text-[var(--text)]"
              aria-label="Dismiss invoice prompt"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
function MilestoneItem({
  milestone,
  currency,
  invoice,
  onComplete,
  onGenerate,
}: {
  milestone: Milestone;
  currency: string;
  invoice?: { id: string; number: string };
  onComplete: () => void;
  onGenerate: () => void;
}) {
  const isDone = milestone.status === 'completed';
  const isInProgress = milestone.status === 'in_progress';

  return (
    <li className="relative">
      {/* Dot */}
      <span
        className={cn(
          'absolute -left-[22px] top-1 grid h-3.5 w-3.5 place-items-center rounded-full border-2',
          isDone
            ? 'border-[var(--green)] bg-[var(--green)] text-white'
            : isInProgress
              ? 'border-[var(--blue)] bg-white'
              : 'border-[var(--line)] bg-white'
        )}
        style={
          isDone
            ? { boxShadow: '0 0 0 3px var(--green-soft)' }
            : isInProgress
              ? { boxShadow: '0 0 0 3px var(--blue-soft)' }
              : undefined
        }
      >
        {isDone && <Check className="h-2 w-2" strokeWidth={3} />}
        {isInProgress && (
          <Minus className="h-2.5 w-2.5 text-[var(--blue)]" strokeWidth={3} />
        )}
      </span>

      {/* Card */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-[var(--text)]">
              {milestone.title}
            </span>
            <Badge status={milestone.status} />
          </div>
          {milestone.due_date && (
            <div className="mt-1 text-[12px] text-[var(--muted)]">
              Due {formatDateShort(milestone.due_date)}
              {milestone.completed_at &&
                ` · Completed ${formatDateShort(milestone.completed_at)}`}
            </div>
          )}
          {milestone.description && (
            <div className="mt-1 text-[12px] text-[var(--muted)]">
              {milestone.description}
            </div>
          )}
        </div>

        <div className="text-right">
          <div className="mono text-[14px] font-bold text-[var(--text)]">
            {formatCurrency(milestone.amount, currency)}
          </div>

          {/* Per-status action */}
          {isInProgress && (
            <Button size="sm" onClick={onComplete} className="mt-2">
              <Check className="h-3 w-3" strokeWidth={2.25} />
              Mark complete
            </Button>
          )}

          {isDone && invoice && (
            <Link
              to="/invoices/$invoiceId"
              params={{ invoiceId: invoice.id }}
              className="mono mt-2 inline-block text-[12px] font-bold text-[var(--green-dark)] hover:underline"
            >
              {invoice.number}
            </Link>
          )}

          {isDone && !invoice && (
            <Button
              size="sm"
              variant="secondary"
              onClick={onGenerate}
              className="mt-2"
            >
              <Receipt className="h-3 w-3" strokeWidth={1.75} />
              Generate invoice
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}
