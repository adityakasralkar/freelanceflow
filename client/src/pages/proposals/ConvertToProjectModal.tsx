import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useConvertProposalToProject } from '../../hooks/useProposals';
import { ApiError } from '../../lib/api';
import type { Proposal, Project } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  proposal: Proposal | null;
  onConverted: (project: Project) => void;
}

export default function ConvertToProjectModal({
  isOpen,
  onClose,
  proposal,
  onConverted,
}: Props) {
  if (!isOpen || !proposal) return null;

  return (
    <ConvertToProjectForm
      key={proposal.id}
      isOpen={isOpen}
      onClose={onClose}
      proposal={proposal}
      onConverted={onConverted}
    />
  );
}

function ConvertToProjectForm({
  isOpen,
  onClose,
  proposal,
  onConverted,
}: Props & { proposal: Proposal }) {
  const convert = useConvertProposalToProject();

  const [title, setTitle] = useState(proposal.title);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleConvert() {
    setSubmitError(null);

    if (startDate && endDate && endDate < startDate) {
      setSubmitError('End date cannot be before the start date');
      return;
    }

    try {
      const project = await convert.mutateAsync({
        id: proposal.id,
        title,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });
      onConverted(project);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : 'Could not convert proposal'
      );
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Convert to project"
      subtitle="Spin up a project from this proposal. You can refine milestones afterwards."
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConvert} isLoading={convert.isPending}>
            Create project
          </Button>
        </>
      }
    >
      <Field label="Project title">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Start date">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Field>
        <Field label="End date">
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Field>
      </div>

      {submitError && (
        <div className="rounded-md border border-[#FECACA] bg-[var(--red-soft)] px-3 py-2 text-[12.5px] text-[var(--red)]">
          {submitError}
        </div>
      )}

      <div className="rounded-md border border-[#BFDBFE] bg-[var(--blue-soft)] px-3 py-2 text-[12.5px] text-[#1E40AF]">
        Once created, you can add milestones, mark them complete, and generate
        invoices straight from the milestone view.
      </div>
    </Modal>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-[var(--text)]">{label}</label>
      {children}
    </div>
  );
}
