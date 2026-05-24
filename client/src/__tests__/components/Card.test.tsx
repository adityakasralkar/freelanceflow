import { render, screen } from '@testing-library/react';
import Card from '../../components/ui/Card';

describe('Card component', () => {
  it('renders children', () => {
    render(<Card>Hello Card</Card>);
    expect(screen.getByText('Hello Card')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders as a div element', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('has base card styling classes', () => {
    const { container } = render(<Card>Content</Card>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('rounded-lg');
    expect(el.className).toContain('bg-white');
  });

  it('forwards additional HTML attributes', () => {
    render(<Card data-testid="my-card">Content</Card>);
    expect(screen.getByTestId('my-card')).toBeInTheDocument();
  });

  it('renders without children', () => {
    const { container } = render(<Card />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
