import { cn, getInitials } from '../../utils';

type Size = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  name: string | null | undefined;
  size?: Size;
  className?: string;
}

const SIZE_PX: Record<Size, string> = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
  xl: 'h-12 w-12 text-base',
};

const PALETTE = [
  { bg: 'var(--green-soft)', text: 'var(--green)' },
  { bg: 'var(--blue-soft)', text: 'var(--blue)' },
  { bg: '#F5F3FF', text: 'var(--purple)' },
  { bg: 'var(--amber-soft)', text: 'var(--amber)' },
  { bg: 'var(--red-soft)', text: 'var(--red)' },
];

export default function Avatar({ name, size = 'md', className }: AvatarProps) {
  const initials = getInitials(name) || '·';
  const firstChar = (name || '·').charAt(0).toUpperCase();
  const color = PALETTE[firstChar.charCodeAt(0) % PALETTE.length];

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold',
        SIZE_PX[size],
        className
      )}
      style={{ backgroundColor: color.bg, color: color.text }}
    >
      {initials}
    </span>
  );
}
