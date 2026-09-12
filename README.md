# Interior Aura

A refined, professional editorial studio portfolio for an interior design practice based in Muradnagar, Ghaziabad. Built on Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui + Framer Motion.

## What's inside

- **Prominent brand lockup** (top-left): a 56–64px circular brand-logo badge with a 2px saffron ring, soft saffron halo behind it, and a pulsing live-indicator dot. Paired with the "Interior Aura" wordmark and "Ghaziabad · Est. 2026" caption (with a saffron bullet separator).
- **Cursor effect** — a three-layer cursor follower (dot / ring / glow) wired across the whole site. The dot pins to the pointer, the ring trails with eased lag, the glow lags further still. Hover over interactive elements widens the ring; press tightens it. Touch devices and reduced-motion users get nothing.
- **Form button** (replaces the old Sign-in button) — opens a dialog with name, email, project type, budget band, and message. Submissions are sent to **soumaysinghal11@gmail.com** via a Next.js API route (`src/app/api/contact/route.ts`) using Nodemailer. Without SMTP credentials, submissions are saved to `.contact-submissions/` so nothing is lost.
- **Contact button** — a `tel:1234123456` link in the header and footer that dials the studio on any device with a phone dialer.
- **Instagram link** (renamed from "Get a quote") — points to https://www.instagram.com/interior_aura/.
- **"Our designs" section** (renamed from "Members") — 4 premium mood tiles + a curated material library + save summary. Saves persist to `localStorage` (no account needed). The orange "Now creating" card in the hero is positioned fully inside the hero section with proper clearance — no more clipping by the next section.
- **Refined professional palette** — warm off-white background, deep espresso foreground, refined saffron/clay primary, soft warm gray muted. No neon, no rainbow gradients.
- **Typography** — Anton (display), Inter (body), JetBrains Mono (eyebrows + metadata).
- **Motion** — subtle 0.9s expo reveals on scroll, gentle 1.04–1.06 image scale on hover, slow 6–7s ambient float on the hero side card, 38s marquee. No bouncy springs.

## Tech stack

- **Framework**: Next.js 16 (App Router) + TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York style)
- **Database**: Prisma ORM with SQLite (for any future server-side features)
- **Email**: Nodemailer (Gmail SMTP compatible)
- **Motion**: Framer Motion
- **Icons**: lucide-react
- **Notifications**: sonner

## Project structure

```
interior-aura/
├── .env                          # database URL + (commented) SMTP env vars
├── next.config.ts
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── tailwind.config.ts
├── components.json
├── eslint.config.mjs
├── prisma/                       # Prisma schema
├── db/                           # SQLite database
├── public/
│   └── aura/                     # Brand logo, interior photos, mood tiles
└── src/
    ├── app/
    │   ├── layout.tsx            # Root layout with Anton + Inter + JetBrains Mono
    │   ├── page.tsx              # Main page (hero / services / work / mood board / studio / contact)
    │   ├── globals.css           # Editorial palette + cursor CSS + reveal utilities
    │   └── api/
    │       └── contact/
    │           └── route.ts      # POST endpoint → sends email via Nodemailer
    ├── components/
    │   ├── ui/                   # shadcn/ui components (60+ primitives)
    │   └── aura/
    │       ├── cursor-effect.tsx # 3-layer cursor follower
    │       ├── form-dialog.tsx   # Contact form dialog
    │       ├── mood-board.tsx    # "Our designs" section (always unlocked)
    │       ├── reveal.tsx        # Scroll-triggered reveal wrapper
    │       └── site-header.tsx   # Sticky nav with Instagram + Form + Contact
    ├── hooks/                    # use-mobile, use-toast
    └── lib/                      # utils, db
```

## Getting started

### 1. Install dependencies

```bash
bun install
# or: npm install / pnpm install
```

### 2. Set up the database (optional, only if you use Prisma features)

```bash
bun run db:push
```

### 3. Configure email delivery (optional)

The contact form works out of the box — without SMTP credentials, submissions are saved to `.contact-submissions/`. To deliver real emails to `soumaysinghal11@gmail.com`, edit `.env` and uncomment the SMTP block:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=soumaysinghal11@gmail.com
SMTP_PASS=your-gmail-app-password    # get one at myaccount.google.com/apppasswords
SMTP_FROM=soumaysinghal11@gmail.com
```

### 4. Run the dev server

```bash
bun run dev
```

Open http://localhost:3000 in your browser.

### 5. Lint

```bash
bun run lint
```

## How the cursor effect works

The cursor effect is mounted once at the top of `page.tsx` via `<CursorEffect />`. On mount, it:

1. Checks `prefers-reduced-motion` and `(hover: hover) and (pointer: fine)` — bails on touch devices and reduced-motion users.
2. Renders three fixed layers:
   - `.cursor-dot` (7px solid saffron) — pins to the pointer.
   - `.cursor-ring` (34px hairline border) — trails with eased lag (0.16 catch-up per frame).
   - `.cursor-glow` (380px radial saffron, mix-blend multiply) — trails with double the lag (0.08 catch-up per frame).
3. Listens for `pointermove` (moves all three targets), `pointerover`/`pointerout` (delegated hover detection on `a, button, [role="button"], input, textarea, select, [data-cursor="hover"]`), and `pointerdown`/`pointerup` (press state).
4. Runs one `requestAnimationFrame` loop that only touches `transform` on the three layers — no layout recalculation.

Hover state widens the ring to 66px and shrinks the dot to 0px. Press state tightens the ring to 26px and grows the dot to 11px. The `cursor-visible` / `cursor-hover` / `cursor-down` classes are added to the `<html>` element, so the CSS in `globals.css` controls the visual changes.

## How the contact form works

1. User clicks the **Form** button in the header (or "Send an enquiry" in the contact section, or "Start a brief" in the Our designs section).
2. `FormDialog` opens with five fields: name, email, project type (select), budget band (select), message (textarea).
3. On submit, the dialog posts JSON to `/api/contact`:
   ```json
   { "name": "...", "email": "...", "projectType": "...", "budget": "...", "message": "..." }
   ```
4. The API route (`src/app/api/contact/route.ts`) validates the fields, builds a styled HTML email + plain-text version, and:
   - **If SMTP env vars are set** → sends the email via Nodemailer to `soumaysinghal11@gmail.com` with the submitter's email set as `replyTo`.
   - **If SMTP env vars are NOT set** → saves the submission to `.contact-submissions/<timestamp>-<slug>.json` and logs the email body to the server console.
5. The dialog shows a success state ("Thank you, {firstName}.") with a `CheckCircle2` badge and a toast notification fires ("Enquiry sent").

## Customising

- **Brand palette**: edit the CSS variables in `src/app/globals.css` under `:root`.
- **Brand logo size / ring**: edit the `h-14 w-14 md:h-16 md:w-16` and `ring-2 ring-primary/40` on the logo container in `src/components/aura/site-header.tsx`.
- **Phone number**: change `CONTACT_PHONE` in `src/components/aura/site-header.tsx` and the `tel:` link in `src/app/page.tsx`.
- **Email target**: change `TO_EMAIL` in `src/app/api/contact/route.ts`.
- **Instagram URL**: change the `href` on the Instagram link in `src/components/aura/site-header.tsx` and `src/app/page.tsx`.
- **Cursor size / colour**: edit `.cursor-dot / .cursor-ring / .cursor-glow` in `src/app/globals.css`.
- **Mood board items**: edit the `MOOD_ITEMS` array in `src/components/aura/mood-board.tsx`.
- **Material library**: edit the `MATERIAL_LIBRARY` array in `src/components/aura/mood-board.tsx`.

## Build for production

```bash
bun run build
bun run start
```

## License

© 2026 Interior Aura. All rights reserved.
