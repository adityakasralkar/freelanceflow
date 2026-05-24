import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Inbox } from 'lucide-react';
import EmptyState from '../../components/shared/EmptyState';

describe('EmptyState component', () => {
  it('renders heading', () => {
    render(<EmptyState icon={Inbox} heading="No results found" />);
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('renders subtext when provided', () => {
    render(<EmptyState icon={Inbox} heading="Empty" subtext="Nothing here yet." />);
    expect(screen.getByText('Nothing here yet.')).toBeInTheDocument();
  });

  it('does not render subtext when not provided', () => {
    const { container } = render(<EmptyState icon={Inbox} heading="Empty" />);
    expect(container.querySelector('p')).toBeNull();
  });

  it('renders action button when actionLabel and onAction are provided', () => {
    render(
      <EmptyState icon={Inbox} heading="Empty" actionLabel="Add item" onAction={() => {}} />
    );
    expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument();
  });

  it('does not render action button when only actionLabel provided (no onAction)', () => {
    render(<EmptyState icon={Inbox} heading="Empty" actionLabel="Add item" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('calls onAction when action button is clicked', async () => {
    const onAction = jest.fn();
    render(<EmptyState icon={Inbox} heading="Empty" actionLabel="Go" onAction={onAction} />);
    await userEvent.click(screen.getByRole('button', { name: /go/i }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('renders the icon element', () => {
    const { container } = render(<EmptyState icon={Inbox} heading="Empty" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
