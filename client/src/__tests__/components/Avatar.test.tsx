import { render, screen } from '@testing-library/react';
import Avatar from '../../components/shared/Avatar';

describe('Avatar component', () => {
  it('renders initials for a single-word name', () => {
    render(<Avatar name="Rahul" />);
    expect(screen.getByText('RA')).toBeInTheDocument();
  });

  it('renders first and last initials for a two-word name', () => {
    render(<Avatar name="Rahul Mehta" />);
    expect(screen.getByText('RM')).toBeInTheDocument();
  });

  it('uses first and last word for multi-word names', () => {
    render(<Avatar name="John Paul Smith" />);
    expect(screen.getByText('JS')).toBeInTheDocument();
  });

  it('renders a dot placeholder for null name', () => {
    render(<Avatar name={null} />);
    expect(screen.getByText('·')).toBeInTheDocument();
  });

  it('renders a dot placeholder for undefined name', () => {
    render(<Avatar name={undefined} />);
    expect(screen.getByText('·')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Avatar name="Test" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies sm size class', () => {
    const { container } = render(<Avatar name="Test" size="sm" />);
    expect((container.firstChild as HTMLElement).className).toContain('h-6');
  });

  it('applies lg size class', () => {
    const { container } = render(<Avatar name="Test" size="lg" />);
    expect((container.firstChild as HTMLElement).className).toContain('h-10');
  });

  it('applies xl size class', () => {
    const { container } = render(<Avatar name="Test" size="xl" />);
    expect((container.firstChild as HTMLElement).className).toContain('h-12');
  });

  it('applies a background color from the palette', () => {
    const { container } = render(<Avatar name="Alice" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundColor).toBeTruthy();
  });
});
