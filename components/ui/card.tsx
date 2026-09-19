import { cn } from '@/lib/utils/cn';

type CardProps = {
  children: React.ReactNode;
  /** Adds the legacy 4px lift and deeper shadow on hover. Only for interactive cards. */
  interactive?: boolean;
  as?: 'div' | 'article' | 'li' | 'section';
  className?: string;
};

/**
 * The standard surface container: white fill, hairline border, 16px radius.
 * Geometry and shadow values are inherited from the legacy stylesheet.
 *
 * Use `interactive` only when the whole card is clickable - a hover lift on a
 * static card reads as a broken affordance.
 */
export function Card({ children, interactive = false, as: Tag = 'div', className }: CardProps) {
  return (
    <Tag
      className={cn(
        'bg-surface-raised border-border rounded-[var(--r-card)] border shadow-[var(--shadow)]',
        interactive &&
          'cursor-pointer transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
