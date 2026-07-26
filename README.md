# Ahmed Youssef — Portfolio

A premium bilingual (English / Arabic) personal marketing portfolio website built for a full-stack web developer. Features a Linear-inspired dark theme, smooth animations, and end-to-end RTL support.

## Tech Stack
live https://my-portfolio-opal-sigma-50.vercel.app/

| Layer | Technology |
|-------|-----------|
| Framework | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Bundler | [Vite 6](https://vite.dev) |
| Styling | [Tailwind CSS v3.4](https://tailwindcss.com) |
| Animation | [Framer Motion 12](https://motion.dev) |
| Icons | [Lucide React](https://lucide.dev) |

## Features

- **Bilingual EN/AR** — Full Arabic and English support with RTL/LTR direction
- **Smooth Animations** — Section reveal scroll animations, card hover effects, floating elements
- **Responsive Design** — Works on 320px mobile to large desktop
- **Services Section** — 6 service cards with tags
- **Featured Projects** — 5 project cards with coded mockup previews and detail modals
- **Process Timeline** — 5-step vertical timeline explaining the workflow
- **Why Work With Me** — 6 value proposition cards
- **Tech Stack Section** — Grouped technology badges
- **Pricing Cards** — 4 pricing tiers with feature checklists
- **CTA Banner** — Call-to-action with WhatsApp integration
- **FAQ Accordion** — 6 frequently asked questions with smooth open/close
- **Contact Form** — Inline validation, WhatsApp pre-filled message
- **Accessibility** — Focus rings, aria-expanded, keyboard navigation, Escape to close modals
- **SEO** — Open Graph tags, meta description, theme color

## Project Structure

```
src/
├── App.tsx                      # Root layout — composes all sections
├── main.tsx                     # Entry point
├── index.css                    # Tailwind directives + CSS custom properties
├── lib/
│   ├── utils.ts                 # t(), tArr(), cn() helpers
│   ├── projects.ts              # Project metadata (slug, label, gradient)
│   └── contact.ts               # Contact config (WhatsApp, email, social)
├── hooks/
│   └── useLanguage.ts           # Bilingual state, localStorage, dir/lang sync
├── i18n/
│   ├── en.json                  # English translations
│   └── ar.json                  # Arabic translations
├── components/
│   ├── ui/                      # Reusable primitives
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── text-input.tsx       # Input + Textarea
│   │   ├── modal.tsx
│   │   └── accordion.tsx
│   ├── layout/
│   │   ├── section.tsx          # Section wrapper
│   │   ├── top-nav.tsx          # Sticky nav + mobile hamburger
│   │   ├── footer.tsx           # 4-column footer
│   │   └── language-switcher.tsx
│   ├── cards/
│   │   ├── service-card.tsx
│   │   ├── project-card.tsx
│   │   ├── pricing-card.tsx
│   │   ├── process-step.tsx
│   │   ├── value-card.tsx
│   │   └── tech-badge.tsx
│   └── projects/
│       └── project-modal-content.tsx
└── sections/
    ├── hero.tsx
    ├── services.tsx
    ├── featured-projects.tsx
    ├── process.tsx
    ├── why-work-with-me.tsx
    ├── tech-stack.tsx
    ├── pricing.tsx
    ├── cta-banner.tsx
    ├── faq.tsx
    └── contact.tsx
```

## How to Install

```bash
npm install
```

## How to Run Locally

```bash
npm run dev
```

Opens at `http://localhost:5173`.

## How to Build for Production

```bash
npm run build
```

Output is written to `dist/`.

## How to Preview Production Build

```bash
npm run preview
```

## How to Check TypeScript

```bash
npx tsc --noEmit
```

## How to Edit Content

All visible text is stored in translation files:

- **English:** `src/i18n/en.json`
- **Arabic:** `src/i18n/ar.json`

Edit the JSON values directly. The site uses dot-path lookups (e.g. `hero.headline` maps to `en.json → hero → headline`). Arrays for feature lists and tags use `tArr()`.

## How to Change Contact Information

Open `src/lib/contact.ts` and replace the placeholder values:

```ts
WHATSAPP_NUMBER = '905XXXXXXXXX'   // Your WhatsApp number
EMAIL = 'your-email@example.com'   // Your email
INSTAGRAM_URL = '#'                // Your Instagram URL
GITHUB_URL = '#'                   // Your GitHub URL
LINKEDIN_URL = '#'                 // Your LinkedIn URL
```

These values are used across the entire app (footer, contact section, WhatsApp CTAs, project modal).

## How to Add a New Project

1. **Add translations** in `src/i18n/en.json` and `src/i18n/ar.json` under `projects.items.{slug}` with fields: `title`, `type`, `description`, `features` (array), `tech` (array), `problemSolved`, `audience`.

2. **Add metadata** in `src/lib/projects.ts`:
   ```ts
   {
     slug: 'your-slug',
     label: 'demo',       // 'real' | 'demo' | 'concept'
     gradient: 'from-xxx/15 to-yyy/10',
     icon: 'YourLucideIconName',
   }
   ```

3. Add the icon to the `iconMap` in `src/components/cards/project-card.tsx` and `src/components/projects/project-modal-content.tsx`.

## How to Add a New Service

1. Add translations under `services.cards.{key}` in both `en.json` and `ar.json` with: `title`, `desc`, `tags` (array).

2. Add the key to `serviceKeys` array in `src/sections/services.tsx`.

3. Add the icon to `serviceIcons` in the same file.

## How Bilingual Arabic/English Support Works

- Language state is managed by `useLanguage` hook (`src/hooks/useLanguage.ts`).
- Language preference is persisted in `localStorage`.
- On first visit, the language is detected from the browser's `navigator.language`.
- `<html>` element gets `lang` and `dir` attributes updated automatically.
- All text is resolved through `t(path)` and `tArr(path)` functions that traverse the JSON translation files.
- Default language is English.

## How RTL/LTR is Handled

- Direction is set via `document.documentElement.dir` — `'rtl'` for Arabic, `'ltr'` for English.
- Layout uses CSS **logical properties** (`ps-`, `pe-`, `ms-`, `me-`, `text-start`, `text-end`) instead of `rtl:` Tailwind modifiers.
- Animation directions are conditional on `lang` (e.g., process timeline slides from left for LTR, right for RTL).
- Arrow icons in buttons use `lang === 'ar' ? 'rotate-180' : ''` for direction-aware rotation.
- Form inputs and selects use `dir={lang === 'ar' ? 'rtl' : 'ltr'}` for correct text alignment.

## Deployment Notes

### Vercel

```bash
npm i -g vercel
vercel
```

No additional configuration needed. The `vite.config.ts` is already set up for SPA routing.

### Netlify

Create a `dist/_redirects` file:

```
/*    /index.html   200
```

Or use the Netlify CLI:

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

## Final Checklist Before Publishing

- [ ] Replace placeholder contact values in `src/lib/contact.ts`
- [ ] Replace social media placeholder links (`#`) with real URLs
- [ ] Replace the favicon at `public/vite.svg` with a real favicon
- [ ] Review all demo/concept labels — mark real projects as `'real'` if applicable
- [ ] Verify Arabic text renders correctly with proper fonts installed
- [ ] Test responsive behavior on mobile, tablet, and desktop
- [ ] Test language switching between Arabic and English
- [ ] Run `npm run build` and confirm zero errors
- [ ] Run `npx tsc --noEmit` and confirm zero errors

## License

MIT
