export type UserRole = 'freelancer' | 'client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'declined';
export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'archived';
export type MilestoneStatus = 'upcoming' | 'in_progress' | 'completed';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface Client {
  id: string;
  freelancer_id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  currency: string;
  created_at: string;
}

export interface Proposal {
  id: string;
  freelancer_id: string;
  client_id: string;
  title: string;
  description: string | null;
  amount: string;
  status: ProposalStatus;
  valid_until: string | null;
  payment_terms: string | null;
  deliverables: string[];
  currency: string;
  created_at: string;
  client_name?: string;
  client_email?: string;
  client_company?: string;
}

export interface Project {
  id: string;
  proposal_id: string | null;
  freelancer_id: string;
  client_id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  total_amount: string | null;
  status: ProjectStatus;
  currency: string;
  created_at: string;
  client_name?: string;
  client_email?: string;
  client_company?: string;
  proposal_title?: string;
  proposal_amount?: string;
  payment_terms?: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  amount: string;
  status: MilestoneStatus;
  completed_at: string | null;
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: string;
  rate: string;
  amount: string;
}

export interface Invoice {
  id: string;
  project_id: string | null;
  milestone_id: string | null;
  freelancer_id: string;
  client_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  subtotal: string;
  tax_amount: string;
  tax_rate: string;
  tax_label: string | null;
  total_amount: string;
  status: InvoiceStatus;
  currency: string;
  notes: string | null;
  created_at: string;
  items?: InvoiceItem[];
  client_name?: string;
  client_company?: string;
  project_title?: string;
}
