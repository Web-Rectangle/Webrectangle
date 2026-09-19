'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarDays, Check, FileText, MessageSquare, Wallet, X } from 'lucide-react';
import { useState } from 'react';

import { Glass } from '@/components/ui/glass';
import { SampleDataNotice } from '@/components/ui/sample-data-notice';
import { SectionHeading } from '@/components/ui/section-heading';
import { invite } from '@/lib/content/home';
import type { InvitationStatus } from '@/lib/schemas/campaign';
import { cn } from '@/lib/utils/cn';

const RESPONSE_STYLES: Record<string, string> = {
  accepted: 'bg-positive-soft text-positive border-positive/25',
  'changes-requested': 'bg-warning-soft text-warning border-warning/25',
  rejected: 'bg-critical-soft text-critical border-critical/25',
};

/**
 * The "Invite to Collaborate" concept, demonstrated rather than described.
 *
 * This is WebRectangle's signature product idea, so it gets its own section
 * and a working interaction: pressing a response actually transitions the card
 * and shows what happens next. Reading three bullet points about acceptance
 * states would not land the same way.
 *
 * The invitation content is clearly labelled sample data - the brand and
 * campaign are invented.
 */
export function InviteToCollaborate() {
  const [status, setStatus] = useState<InvitationStatus>('sent');
  const reduced = useReducedMotion();

  const responded = status !== 'sent';
  const active = invite.responses.find((r) => r.key === status);

  return (
    <section className="section-y defer-paint bg-surface-alt">
      <div className="container-wr grid items-center gap-14 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow={invite.eyebrow}
            title={invite.title}
            description={invite.description}
            className="mb-8"
          />

          <ul className="grid gap-3">
            {invite.responses.map((response) => (
              <li
                key={response.key}
                className={cn(
                  'border-border rounded-[var(--r-card)] border px-4 py-3 transition-colors',
                  status === response.key && 'border-accent bg-accent-softer',
                )}
              >
                <p className="text-ink text-[15px] font-bold">{response.label}</p>
                <p className="text-[13.5px]">{response.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <Glass className="glass-readable p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <p className="text-muted text-[11px] font-bold tracking-[0.1em] uppercase">
                Collaboration invitation
              </p>
              <p className="text-ink mt-1 text-[17px] font-bold">{invite.sample.campaign}</p>
              <p className="text-[13.5px]">{invite.sample.brand}</p>
            </div>
            <SampleDataNotice
              label="Example"
              detail="An illustrative invitation. The brand and campaign are invented."
            />
          </div>

          <dl className="border-border grid gap-3 border-y py-4">
            <Row icon={<FileText />} label="Deliverables" value={invite.sample.deliverables} />
            <Row icon={<CalendarDays />} label="Timeline" value={invite.sample.timeline} />
            <Row icon={<Wallet />} label="Budget" value={invite.sample.budget} />
            <Row icon={<MessageSquare />} label="Usage rights" value={invite.sample.usageRights} />
          </dl>

          <div className="mt-5">
            <AnimatePresence mode="wait" initial={false}>
              {responded ? (
                <motion.div
                  key="responded"
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  <div
                    className={cn(
                      'rounded-[var(--r-card)] border px-4 py-3.5',
                      RESPONSE_STYLES[status],
                    )}
                  >
                    <p className="text-[14.5px] font-bold">{active?.label}</p>
                    <p className="mt-0.5 text-[13.5px] opacity-90">{active?.body}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStatus('sent')}
                    className="text-muted hover:text-accent mt-3 text-[13px] font-semibold underline underline-offset-4"
                  >
                    Reset the example
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="pending"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduced ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="grid gap-2 sm:grid-cols-3"
                >
                  <Action
                    onClick={() => setStatus('accepted')}
                    icon={<Check />}
                    label="Accept"
                    primary
                  />
                  <Action
                    onClick={() => setStatus('changes-requested')}
                    icon={<MessageSquare />}
                    label="Request changes"
                  />
                  <Action onClick={() => setStatus('rejected')} icon={<X />} label="Decline" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Glass>
      </div>
    </section>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="text-accent shrink-0 [&_svg]:size-4">
        {icon}
      </span>
      <dt className="text-muted w-28 shrink-0 text-[13px]">{label}</dt>
      <dd className="text-ink text-[14px] font-semibold">{value}</dd>
    </div>
  );
}

function Action({
  onClick,
  icon,
  label,
  primary = false,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-1.5 rounded-[var(--r-btn)] border px-3 py-2.5 text-[13px] font-semibold transition-colors',
        primary
          ? 'bg-accent border-accent text-accent-contrast hover:bg-accent-hover'
          : 'border-border text-body hover:border-accent hover:text-accent',
        '[&_svg]:size-3.5',
      )}
    >
      {icon}
      {label}
    </button>
  );
}
