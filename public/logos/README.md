# Partner logos

These are the logos of organisations WebRectangle has genuinely worked with. They are the only
client logos permitted on the site — see section 2 of `WEBRECTANGLE_BUILD_PROMPT.md`. Do not add a
logo here for a company we have not actually worked with.

## Missing files

The legacy site (`legacy/indexV2.html`) referenced four logo files that were never committed to
this repository. Until they are added, `PartnerLogo` renders a neutral dashed wordmark in their
place, which is intentional — an absent asset must never be replaced with an invented brand.

Drop the four files here with these exact names:

| File                | Organisation                                                     |
| ------------------- | ---------------------------------------------------------------- |
| `meity.webp`        | Ministry of Electronics & Information Technology (MEITY)          |
| `up-government.webp`| Government of Uttar Pradesh                                       |
| `mybigguide.png`    | MyBigGuide                                                        |
| `pc-school.jpeg`    | PC School                                                         |

Then set the `src` values in [`lib/content/proof.ts`](../../lib/content/proof.ts) from `null` to
`/logos/<filename>`. No other change is needed.

## Guidance

- Prefer transparent-background PNG or WebP.
- Around 240px wide at 2x is plenty; they render at a 40px cap height.
- The strip renders greyscale at rest and full colour on hover, so logos should stay legible
  without their brand colour.
