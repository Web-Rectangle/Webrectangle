'use client';

import { useEffect, useRef } from 'react';

/**
 * Anti-spam pair: a decoy field no human sees, plus the time the form became
 * interactive. Bots fill the decoy; scripted submissions trip the timer by
 * posting faster than a person could realistically type. Both are checked
 * server-side in lib/schemas/anti-spam.ts.
 *
 * WHY CLIENT-SIDE AND ON MOUNT: the timestamp has to be generated after
 * hydration. Computing it during render would differ between server and client
 * and break hydration, and computing it at build time on a static page would
 * make every submission look arbitrarily old. Mount time measures exactly what
 * we want - how long the form sat in front of a real user.
 *
 * `aria-hidden` plus `tabIndex={-1}` and off-screen positioning keeps the decoy
 * away from assistive tech and keyboard users. `display: none` is avoided
 * because some password managers skip hidden fields entirely, which would make
 * the decoy trivially detectable.
 */
export function SpamGuard() {
  const timestampRef = useRef<HTMLInputElement>(null);

  // Written straight to the DOM node rather than through state: this is a
  // one-way sync to an external system, so it needs no re-render.
  useEffect(() => {
    if (timestampRef.current) {
      timestampRef.current.value = String(Date.now());
    }
  }, []);

  return (
    <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="wr-company-website">Leave this field empty</label>
      <input
        id="wr-company-website"
        name="companyWebsite"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
      <input ref={timestampRef} name="renderedAt" type="hidden" defaultValue="" />
    </div>
  );
}
