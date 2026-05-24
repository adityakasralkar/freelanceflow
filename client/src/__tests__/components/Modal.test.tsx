import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../../components/ui/Modal';

const noop = () => {};

describe('Modal component', () => {
  it('renders nothing when isOpen=false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={noop}>Content</Modal>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders children when isOpen=true', () => {
    render(<Modal isOpen onClose={noop}>Modal body</Modal>);
    expect(screen.getByText('Modal body')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Modal isOpen onClose={noop} title="My Title">Body</Modal>);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<Modal isOpen onClose={noop} title="T" subtitle="Sub text">Body</Modal>);
    expect(screen.getByText('Sub text')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <Modal isOpen onClose={noop} footer={<button>Save</button>}>Body</Modal>
    );
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Modal isOpen onClose={onClose} title="T">Body</Modal>);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = jest.fn();
    const { container } = render(<Modal isOpen onClose={onClose}>Body</Modal>);
    fireEvent.click(container.firstChild as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClose when inner content is clicked', () => {
    const onClose = jest.fn();
    render(<Modal isOpen onClose={onClose}>Body text</Modal>);
    fireEvent.click(screen.getByText('Body text'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = jest.fn();
    render(<Modal isOpen onClose={onClose}>Body</Modal>);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose for non-Escape keys', () => {
    const onClose = jest.fn();
    render(<Modal isOpen onClose={onClose}>Body</Modal>);
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });
});
