/**
 * The WebRectangle CTA arrow - a north-east pointing corner arrow.
 *
 * The exact path (`M7 17 17 7M8 7h9v9`) is lifted from the legacy site, where
 * it appeared on every call to action and nudged 2px up-and-right on hover.
 * That micro-interaction is a brand signature, so the translate lives here
 * rather than being re-implemented per button. Parents opt in with
 * `className="group"`.
 */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
      className={[
        'size-4 shrink-0 transition-transform duration-250',
        'group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
        'motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
