# Google Analytics

Configured on October 5, 2026 using `zeroonelatte@gmail.com`.

| Setting | Value |
| --- | --- |
| Analytics account | Orchia Studio (`410788105`) |
| GA4 property | Orchia Studio — Website (`557494194`) |
| Web stream | Orchia Studio Website (`16048990016`) |
| Stream URL | `https://orchia.studio` |
| Measurement ID | `G-51XMBQ2Q9N` |
| Reporting time zone | America/Los_Angeles |
| Currency | USD |

[Open Realtime](https://analytics.google.com/analytics/web/#/a410788105p557494194/realtime/overview).

The production-only Google tag is installed in `index.html`. It replaces
`G-BDVRJB0DYV`. Both the tag loader and custom event helpers allow only
`orchia.studio` and `www.orchia.studio`, excluding localhost and Vercel previews.
Google signals and advertising personalization are disabled. Account data sharing
is limited to technical support.

Enhanced measurement is enabled, including page loads and browser history
changes. React Router navigation is measured automatically; do not add manual
page-view events without disabling the corresponding automatic measurement.

## Business events

| Event | Trigger | Parameters | Key event |
| --- | --- | --- | --- |
| `generate_lead` | Contact API returns HTTP success and JSON `{ success: true }` | `form_name`: `promotion_video`, `workspace_request`, or `studio_contact` | Yes; once per event, no default monetary value |
| `booking_click` | Visitor clicks the external booking-page link | `booking_page`: `promotion_video` or `house_tour` | No |

Event-scoped custom dimensions expose these parameters in reports:
`Lead form` (`form_name`) and `Booking page` (`booking_page`).

Custom events never include visitor names, email addresses, messages, or submitted
company websites. `form_submit` is an attempt; only `generate_lead` counts a
successful submission. `booking_click` is a click, not a confirmed appointment.
Appointments completed inside the external Google Calendar iframe are not
measured by this tag.

The enhanced video events apply to supported YouTube embeds. The site's native
MP4 previews and players do not currently emit custom video-engagement events.

## Verification

- Production build, lint on changed TypeScript files, and `git diff --check` passed.
- Code review found no issues; behavioral checks covered production hostnames,
  local/preview exclusion, fixed event fields, and blocked Analytics scripts.
- Local browser checks used stubbed contact responses: failures show the error
  state, successes open the promotion-video options, and no real email was sent.
- Production deployment `dpl_GRu8R4KZZmz73TP6QJ74ocMvCTq2` reached Ready and was
  aliased to `orchia.studio`.
- Live browser requests used the new ID, with one page-view event per tested
  route: homepage and House Tour. Booking clicks emitted `booking_click`.
- Google Analytics Realtime showed two active users, three page views, and one
  booking click during verification. These are verification-time counts and
  include test traffic, not an estimate of organic visitors.
- The `generate_lead` key event was registered in Analytics. Success behavior was
  checked locally; no production lead was submitted solely to test Analytics.

Standard reports can take 24–48 hours to populate. Use Realtime to check collection
while they process: [Google's collection verification guide](https://support.google.com/analytics/answer/9333790?hl=en).
