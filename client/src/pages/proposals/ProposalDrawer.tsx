import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Send, Check, Folder, Copy, X, Trash2, Edit3 } from 'lucide-react';
import Drawer from '../../components/shared/Drawer';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/shared/Avatar';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import {
  useProposal,
  useUpdateProposalStatus,
  useDeleteProposal,
} from '../../hooks/useProposals';
import { formatCurrency, formatDate } from '../../utils';
import ConvertToProjectModal from './ConvertToProjectModal';

interface ProposalDrawerProps {
  proposalId: string | null;
  onClose: () => void;
}

const STATUS_LINE: Record<string, string> = {
  draft: 'Draft',
  sent: 'Sent to client',
  accepted: 'Accepted',
  declined: 'Declined',
};

export default function ProposalDrawer({ proposalId, onClose }: ProposalDrawerProps) {
  const navigate = useNavigate();
  const isOpen = !!proposalId;
  const { data: proposal, isLoading } = useProposal(proposalId || undefined);

  const updateStatus = useUpdateProposalStatus();
  const deleteProposal = useDeleteProposal();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDecline, setConfirmDecline] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);

  async function changeStatus(status: 'sent' | 'accepted' | 'declined') {
    if (!proposalId) return;
    await updateStatus.mutateAsync({ id: proposalId, status });
  }

  async function handleDelete() {
    if (!proposalId) return;
    await deleteProposal.mutateAsync(proposalId);
    setConfirmDelete(false);
    onClose();
  }

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        // No built-in title; we render our own header inside body for the design's exact look.
      >
        {!proposal || isLoading ? (
          <div className="text-sm text-[var(--muted)]">Loading…</div>
        ) : (
          <>
            {/* Custom header */}
            <div className="-mx-5 -mt-5 mb-4 flex items-start justify-between gap-2 border-b border-[var(--line)] px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--faint)]">
                  Proposal
                </div>
                <h3 className="mt-0.5 truncate text-[15px] font-bold text-[var(--text)]">
                  {proposal.title}
                </h3>
                <div className="mt-0.5 text-[11px] text-[var(--muted)]">
                  {STATUS_LINE[proposal.status]}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                {proposal.status === 'draft' && (
                  <button
                    type="button"
                    className="grid h-8 w-8 place-items-center rounded-md text-[var(--muted)] transition-colors hover:bg-[#f1f3f6] hover:text-[var(--text)]"
                    title="Edit"
                  >
                    <Edit3 className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                )}
                {proposal.status === 'draft' && (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="grid h-8 w-8 place-items-center rounded-md text-[var(--muted)] transition-colors hover:bg-[var(--red-soft)] hover:text-[var(--red)]"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-8 w-8 place-items-center rounded-md text-[var(--muted)] transition-colors hover:bg-[#f1f3f6] hover:text-[var(--text)]"
                  title="Close"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Status row */}
            <div className="flex items-center justify-between">
              <div className="text-[12px] text-[var(--muted)]">Status</div>
              <Badge status={proposal.status} />
            </div>

            {/* Client */}
            <div className="flex items-center gap-3">
              <Avatar name={proposal.client_name} size="lg" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-bold text-[var(--text)]">
                  {proposal.client_name || '—'}
                </div>
                <div className="truncate text-[12px] text-[var(--muted)]">
                  {proposal.client_email || proposal.client_company || ''}
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-[var(--line)]" />

            {/* Amount + valid until */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Amount</Label>
                <div
                  className="mono mt-1 text-[22px] font-bold leading-tight text-[var(--green-dark)]"
                >
                  {formatCurrency(proposal.amount, proposal.currency)}
                </div>
              </div>
              <div>
                <Label>Valid until</Label>
                <div className="mt-1 text-[13px] font-semibold text-[var(--text)]">
                  {proposal.valid_until ? formatDate(proposal.valid_until) : '—'}
                </div>
              </div>
            </div>

            {/* Payment terms */}
            {proposal.payment_terms && (
              <div>
                <Label>Payment terms</Label>
                <div className="mt-1 text-[13px] text-[var(--text)]">
                  {proposal.payment_terms}
                </div>
              </div>
            )}

            {/* Description */}
            {proposal.description && (
              <div>
                <Label>Description</Label>
                <p className="mt-1 text-[13px] leading-[1.6] text-[#374151]">
                  {proposal.description}
                </p>
              </div>
            )}

            {/* Deliverables */}
            {proposal.deliverables && proposal.deliverables.length > 0 && (
              <div>
                <Label>Deliverables</Label>
                <ul className="mt-2 flex flex-col gap-2">
                  {proposal.deliverables.map((d, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2.5 text-[13px] text-[var(--text)]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--green)]" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer actions — render as the last child of drawer body */}
            <div className="-mx-5 -mb-5 mt-auto flex flex-col gap-2.5 border-t border-[var(--line)] px-5 py-4">
              {proposal.status === 'draft' && (
                <>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={onClose}
                      className="flex-1 justify-center"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => changeStatus('sent')}
                      isLoading={updateStatus.isPending}
                      className="flex-1 justify-center"
                    >
                      <Send className="h-3.5 w-3.5" strokeWidth={2} />
                      Send to client
                    </Button>
                  </div>
                  <div className="text-center text-[11px] text-[var(--faint)]">
                    Client will receive an email with this proposal.
                  </div>
                </>
              )}

              {proposal.status === 'sent' && (
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setConfirmDecline(true)}
                    className="flex-1 justify-center border-[var(--red-soft)] text-[var(--red)] hover:border-[var(--red)] hover:bg-[var(--red-soft)]"
                  >
                    Mark declined
                  </Button>
                  <Button
                    onClick={() => changeStatus('accepted')}
                    isLoading={updateStatus.isPending}
                    className="flex-1 justify-center"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={2.25} />
                    Mark accepted
                  </Button>
                </div>
              )}

              {proposal.status === 'accepted' && (
                <>
                  <div className="rounded-lg border border-[#b6ead7] bg-[var(--green-soft)] p-3 text-[12.5px] leading-[1.55] text-[#065F46]">
                    <div className="font-bold">Proposal accepted</div>
                    Convert this into a project to start tracking milestones and
                    generate invoices.
                  </div>
                  <Button
                    onClick={() => setConvertOpen(true)}
                    className="justify-center"
                  >
                    <Folder className="h-3.5 w-3.5" strokeWidth={2} />
                    Convert to project
                  </Button>
                </>
              )}

              {proposal.status === 'declined' && (
                <>
                  <div className="rounded-lg border border-[#FECACA] bg-[var(--red-soft)] p-3 text-[12.5px] leading-[1.55] text-[#7F1D1D]">
                    <div className="font-bold">Proposal declined</div>
                    You can duplicate this proposal to send a revised version.
                  </div>
                  <Button variant="secondary" className="justify-center">
                    <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Duplicate proposal
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </Drawer>

      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete this draft?"
        message="Drafts can be safely deleted. This can't be undone."
        confirmLabel="Delete proposal"
        isDanger
        isLoading={deleteProposal.isPending}
      />

      <ConfirmDialog
        isOpen={confirmDecline}
        onClose={() => setConfirmDecline(false)}
        onConfirm={async () => {
          await changeStatus('declined');
          setConfirmDecline(false);
        }}
        title="Mark as declined?"
        message="Marking this proposal as declined records the client's response. You can duplicate it later if you want to revise and resend."
        confirmLabel="Mark declined"
        isDanger
        isLoading={updateStatus.isPending}
      />

      <ConvertToProjectModal
        isOpen={convertOpen}
        onClose={() => setConvertOpen(false)}
        proposal={proposal || null}
        onConverted={(project) => {
          setConvertOpen(false);
          onClose();
          navigate({ to: '/projects/$projectId', params: { projectId: project.id } });
        }}
      />
    </>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--faint)]">
      {children}
    </div>
  );
}
