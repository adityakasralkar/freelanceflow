import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export default function Card({ children, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-[var(--line)] bg-white shadow-[var(--shadow-sm)]',
        className
      )}
      style={{ borderRadius: 'var(--radius)' }}
      {...rest}
    >
      {children}
    </div>
  );
}
