import { render, screen } from '@testing-library/react';
import Badge from '../../components/ui/Badge';
import type { BadgeStatus } from '../../components/ui/Badge';

describe('Badge component', () => {
  const cases: Array<[BadgeStatus, string, string]> = [
    ['draft',       'Draft',       '#475467'],
    ['sent',        'Sent',        'var(--blue)'],
    ['accepted',    'Accepted',    'var(--green-dark)'],
    ['declined',    'Declined',    'var(--red)'],
    ['active',      'Active',      'var(--blue)'],
    ['on_hold',     'On hold',     'var(--amber)'],
    ['completed',   'Completed',   'var(--green-dark)'],
    ['archived',    'Archived',    '#475467'],
    ['upcoming',    'Upcoming',    '#475467'],
    ['in_progress', 'In progress', 'var(--amber)'],
    ['invoiced',    'Invoiced',    'var(--purple)'],
    ['paid',        'Paid',        'var(--green-dark)'],
    ['overdue',     'Overdue',     'var(--red)'],
  ];

  test.each(cases)('renders "%s" status correctly', (status, expectedLabel) => {
    render(<Badge status={status} />);
    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
  });

  it('renders a dot indicator', () => {
    const { container } = render(<Badge status="paid" />);
    // The dot is a span with rounded-full class
    const dot = container.querySelector('.rounded-full');
    expect(dot).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Badge status="paid" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
