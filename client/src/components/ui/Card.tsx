import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card({ children, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[#E5E9F0] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
