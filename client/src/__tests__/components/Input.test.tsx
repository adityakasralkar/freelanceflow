import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../../components/ui/Input';

describe('Input component', () => {
  it('renders an input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders a label when label prop is provided', () => {
    render(<Input label="Email address" />);
    expect(screen.getByText('Email address')).toBeInTheDocument();
  });

  it('associates label with input via stable id (not random)', () => {
    const { container } = render(<Input label="Username" />);
    const label = container.querySelector('label');
    const input = container.querySelector('input');
    expect(label).toHaveAttribute('for', input?.id);
  });

  it('uses stable id between re-renders (not Math.random)', () => {
    const { container, rerender } = render(<Input label="Test" />);
    const idBefore = container.querySelector('input')?.id;
    rerender(<Input label="Test" />);
    const idAfter = container.querySelector('input')?.id;
    expect(idBefore).toBe(idAfter);
    expect(idBefore).toBeTruthy();
  });

  it('uses provided id prop instead of generated one', () => {
    render(<Input id="custom-id" label="Custom" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'custom-id');
  });

  it('shows error message when error prop is provided', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error border styles when error prop is provided', () => {
    const { container } = render(<Input error="Required" />);
    const input = container.querySelector('input');
    expect(input?.className).toContain('border-[var(--red)]');
  });

  it('shows helper text when helperText prop is provided (no error)', () => {
    render(<Input helperText="Enter your email address" />);
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
  });

  it('shows error instead of helperText when both are provided', () => {
    render(<Input error="Required" helperText="Enter your email" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.queryByText('Enter your email')).not.toBeInTheDocument();
  });

  it('renders left icon when leftIcon prop is provided', () => {
    render(<Input leftIcon={<span data-testid="icon" />} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders right addon when rightAddon prop is provided', () => {
    render(<Input rightAddon={<span>USD</span>} />);
    expect(screen.getByText('USD')).toBeInTheDocument();
  });

  it('accepts and displays placeholder text', () => {
    render(<Input placeholder="you@example.com" />);
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
  });

  it('forwards ref to the input element', () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement>;
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes through HTML input attributes', async () => {
    const { container } = render(<Input type="password" name="password" />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAttribute('name', 'password');
  });
});
