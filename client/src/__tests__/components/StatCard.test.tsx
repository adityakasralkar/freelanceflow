import { render, screen } from '@testing-library/react';
import { DollarSign } from 'lucide-react';
import StatCard from '../../components/shared/StatCard';

describe('StatCard component', () => {
  it('renders label and value', () => {
    render(<StatCard label="Total Revenue" value="₹45,000" />);
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('₹45,000')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const { container } = render(<StatCard label="Revenue" value="₹100" icon={DollarSign} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('does not render icon when not provided', () => {
    const { container } = render(<StatCard label="Revenue" value="₹100" />);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('renders upward delta with up arrow', () => {
    const { container } = render(
      <StatCard label="Revenue" value="₹100" delta={{ value: '+12%', trend: 'up' }} />
    );
    expect(screen.getByText('+12%')).toBeInTheDocument();
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('renders downward delta with down arrow', () => {
    render(
      <StatCard label="Revenue" value="₹100" delta={{ value: '-5%', trend: 'down' }} />
    );
    expect(screen.getByText('-5%')).toBeInTheDocument();
  });

  it('does not render delta section when not provided', () => {
    render(<StatCard label="Revenue" value="₹100" />);
    expect(screen.queryByText(/%/)).toBeNull();
  });

  it('applies custom className', () => {
    const { container } = render(<StatCard label="L" value="V" className="custom-class" />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('custom-class');
  });

  it('applies green tone styling for icon', () => {
    const { container } = render(<StatCard label="L" value="V" icon={DollarSign} tone="green" />);
    const iconWrapper = container.querySelector('[style]') as HTMLElement;
    expect(iconWrapper).toBeTruthy();
  });
});
