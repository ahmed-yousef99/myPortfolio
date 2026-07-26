---
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-primary-pressed:
    backgroundColor: "{colors.primary-focus}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-tertiary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-inverse:
    backgroundColor: "{colors.inverse-canvas}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  pricing-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  pricing-card-featured:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  feature-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  product-screenshot-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: 24px
  testimonial-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.lg}"
    padding: 32px
  customer-logo-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 16px
  text-input:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  text-input-focused:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  pricing-tab-default:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 6px 14px
  pricing-tab-selected:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 6px 14px
  cta-banner:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.lg}"
    padding: 48px
  changelog-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: 24px 0
  status-badge:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 8px
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    height: 56px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 64px 32px
---

# UI Components Specification

This document provides detailed visual parameters, states, interaction mechanisms, and responsive rules for each component in the design system. For visual foundational variables and motion details, refer to:
- [DESIGN.md](file:///c:/dev/Portfolio/docs/DESIGN.md) — Visual styling foundations, colors, typography, layout, and grid.
- [MOTION.md](file:///c:/dev/Portfolio/docs/MOTION.md) — 3D space, animations, timing, lighting, and physics.
- [INTERACTIONS.md](file:///c:/dev/Portfolio/docs/INTERACTIONS.md) — User inputs, gestures, focus states, and transitions.

---

## 1. Buttons

### Primary Button (`button-primary`)
- **Purpose:** Primary call-to-action (CTA) to guide users toward high-priority conversions (e.g., "Get started").
- **Visual Behaviour:** Lavender-blue fill, centered text set in button typography. Structured with `{rounded.md}` corners and `8px` vertical, `14px` horizontal padding.
- **Interaction Behaviour:** Responds to pointer hovers by shifting hues and to mouse presses by darkening. 
- **Motion Behaviour:** Instant scale transition on hover and active click states (approx. `120ms` duration).
- **States:**
  - *Default:* Background `{colors.primary}` (#5e6ad2), text `{colors.on-primary}` (#ffffff).
  - *Hover:* Background `{colors.primary-hover}` (#828fff), text `{colors.on-primary}`.
  - *Pressed:* Background `{colors.primary-focus}` (#5e69d1), text `{colors.on-primary}`.
  - *Focus:* 2px `{colors.primary-focus}` outline at 50% opacity.
- **Responsive Behaviour:** Maintains layout padding across viewports. Full-width stretch on small mobile columns.
- **Accessibility Notes:** Contrast ratio ≥ 4.5:1 against canvas. Keyboard trigger support via `Space` and `Enter`. Focus ring must be visible.

### Secondary Button (`button-secondary`)
- **Purpose:** Secondary CTAs that sit alongside primary CTAs (e.g., "Sign in", "Read changelog").
- **Visual Behaviour:** Charcoal background with a thin border. Textured with `{rounded.md}` corners and `8px` vertical, `14px` horizontal padding.
- **Interaction Behaviour:** Highlights border on hover.
- **Motion Behaviour:** Calibrated border-color shift over `120ms`.
- **States:**
  - *Default:* Background `{colors.surface-1}` (#0f1011), border 1px `{colors.hairline}` (#23252a), text `{colors.ink}` (#f7f8f8).
  - *Hover:* Background `{colors.surface-2}` (#141516), border 1px `{colors.hairline-strong}` (#34343a), text `{colors.ink}`.
  - *Pressed:* Background `{colors.surface-3}` (#18191a), text `{colors.ink}`.
  - *Focus:* 2px `{colors.primary-focus}` outline at 50% opacity.
- **Responsive Behaviour:** Retains identical dimensions on mobile.
- **Accessibility Notes:** Visible focus indicators. Clean tab index ordering.

### Tertiary Button (`button-tertiary`)
- **Purpose:** Low-emphasis secondary actions, navigation items, or utility options.
- **Visual Behaviour:** Flat background blending with the canvas. Clean, borderless.
- **Interaction Behaviour:** Underlying surface lift highlight on pointer-enter.
- **Motion Behaviour:** 150ms opacity transition on hover states.
- **States:**
  - *Default:* Background `{colors.canvas}` (#010102), text `{colors.ink}` (#f7f8f8).
  - *Hover:* Background `{colors.surface-1}` (#0f1011), text `{colors.ink}`.
  - *Pressed:* Background `{colors.surface-2}` (#141516), text `{colors.ink}`.
  - *Focus:* 2px `{colors.primary-focus}` outline at 50% opacity.
- **Responsive Behaviour:** Inline collapses or wraps.
- **Accessibility Notes:** Accessible tap targets of ≥40px height.

### Inverse Button (`button-inverse`)
- **Purpose:** High-visibility contrast button used as a primary CTA in specific dark section openers.
- **Visual Behaviour:** Pure white block fill, black text. Structured with `{rounded.md}` corners and `8px` vertical, `14px` horizontal padding.
- **Interaction Behaviour:** Dulls white opacity on hover.
- **Motion Behaviour:** 120ms transition on hover/active.
- **States:**
  - *Default:* Background `{colors.inverse-canvas}` (#ffffff), text `{colors.inverse-ink}` (#000000).
  - *Hover:* Background `{colors.inverse-surface-1}` (#f5f6f6), text `{colors.inverse-ink}`.
  - *Pressed:* Background `{colors.inverse-surface-2}` (#f6f7f7), text `{colors.inverse-ink}`.
  - *Focus:* 2px `{colors.primary-focus}` outline at 50% opacity.
- **Responsive Behaviour:** Adapts container column size.
- **Accessibility Notes:** Perfect readability contrast.

---

## 2. Cards & Containers

### Pricing Card (`pricing-card`)
- **Purpose:** Presents subscription tiers on the `/pricing` canvas.
- **Visual Behaviour:** Charcoal panel background, `{rounded.lg}` 12px corners, 1px `{colors.hairline}` borders, and `24px` padding.
- **Interaction Behaviour:** Highlights border on hover.
- **Motion Behaviour:** 200ms ease transition for hover state border color.
- **States:**
  - *Default:* Background `{colors.surface-1}` (#0f1011), border 1px `{colors.hairline}` (#23252a).
  - *Hover:* Background `{colors.surface-1}`, border 1px `{colors.hairline-strong}` (#34343a).
- **Responsive Behaviour:** Arranged in a 3-up desktop layout, collapsing to a single-column layout on mobile (<768px).
- **Accessibility Notes:** Semantic header tag nesting inside the card structure.

### Featured Pricing Card (`pricing-card-featured`)
- **Purpose:** Highlights the recommended subscription tier.
- **Visual Behaviour:** Lifted surface background (`{colors.surface-2}` #141516), 1px `{colors.hairline-strong}` (#34343a) border, `{rounded.lg}` 12px corners, and `24px` padding.
- **Interaction Behaviour:** Slight border glow shift on hover.
- **Motion Behaviour:** Refer to [MOTION.md](file:///c:/dev/Portfolio/docs/MOTION.md) for 3D tilt interaction guidelines.
- **States:**
  - *Default:* Background `{colors.surface-2}` (#141516), border 1px `{colors.hairline-strong}` (#34343a).
  - *Hover:* Background `{colors.surface-2}`, border 1px `{colors.hairline-tertiary}` (#3e3e44).
- **Responsive Behaviour:** Desktop layout is visually centered. Collapses to standard layout stack on mobile.
- **Accessibility Notes:** Screen-reader announcements identifying this card as "Featured" or "Recommended".

### Feature Card (`feature-card`)
- **Purpose:** Highlights specific portfolio features, tech stacks, or accomplishments.
- **Visual Behaviour:** Background `{colors.surface-1}` (#0f1011), `{rounded.lg}` 12px corners, and `24px` padding.
- **Interaction Behaviour:** Pointer hover triggers a subtle Z-axis depth shift.
- **Motion Behaviour:** Subtly shifts perspective and moves edge reflections (duration `180ms` spring).
- **States:**
  - *Default:* Flat charcoal surface.
  - *Hover:* Lifted surface with border highlight.
- **Responsive Behaviour:** Adapts from a 3-up grid on desktop to 2-up on tablet and 1-up on mobile devices.
- **Accessibility Notes:** Content matches standard contrast ratios.

### Product Screenshot Card (`product-screenshot-card`)
- **Purpose:** Prominently displays high-fidelity UI screenshots and captures.
- **Visual Behaviour:** Background `{colors.surface-1}` (#0f1011), `{rounded.xl}` 16px corners, 1px `{colors.hairline}` borders, and `24px` padding.
- **Interaction Behaviour:** Mouse position triggers a 3D parallax tilt effect.
- **Motion Behaviour:** Responsive spring-based 3D rotation and reflection shifts based on the mouse coordinate map.
- **States:**
  - *Default:* Balanced 3D state, top-left illumination.
  - *Active Tilt:* Calibrated 3D transform tracking the mouse pointer.
- **Responsive Behaviour:** Spans the full width of the desktop grid container. Scales proportionally without cropping image content on smaller mobile viewports.
- **Accessibility Notes:** Requires descriptive `alt` tags and structural container labels.

### Testimonial Card (`testimonial-card`)
- **Purpose:** Showcases client feedback, recommendations, or quotes.
- **Visual Behaviour:** Background `{colors.surface-1}` (#0f1011), `{rounded.lg}` 12px corners, and `32px` padding. Includes client details alongside a circular avatar block.
- **Interaction Behaviour:** Passive hover state shifts border highlight.
- **Motion Behaviour:** Static container layout with smooth text adjustments.
- **States:**
  - *Default:* Standard surface layout.
  - *Hover:* Highlighted borders.
- **Responsive Behaviour:** Columns stack vertically on screens smaller than 768px.
- **Accessibility Notes:** Visual avatar fallback matches user initials. Alt text provided on images.

### Customer Logo Tile (`customer-logo-tile`)
- **Purpose:** Grid tiles presenting client, employer, or project brand marks.
- **Visual Behaviour:** Blend-in canvas background (`{colors.canvas}` #010102), `{rounded.xs}` 4px corners, and `16px` padding. Contains logos scaled to a uniform 24px height.
- **Interaction Behaviour:** Passive hover shifts color opacity.
- **Motion Behaviour:** Fade transition on hover state over `180ms`.
- **States:**
  - *Default:* Semi-transparent gray logo elements.
  - *Hover:* High-contrast white logo visual.
- **Responsive Behaviour:** 6-up grid on desktop collapsing to 3-up on mobile viewports.
- **Accessibility Notes:** Descriptive ARIA titles for each customer brand.

---

## 3. Interactive Forms & Inputs

### Text Input (`text-input`)
- **Purpose:** Text input fields for search queries, sales contact forms, or email submissions.
- **Visual Behaviour:** Background `{colors.surface-1}` (#0f1011), `{rounded.md}` 8px corners, text `{colors.ink}` (#f7f8f8), and `8px` vertical, `12px` horizontal padding.
- **Interaction Behaviour:** Expands focus outlines on focus triggers.
- **Motion Behaviour:** Quick 120ms border highlight and ring glow expansion.
- **States:**
  - *Default:* Gray border.
  - *Focus (`text-input-focused`):* 2px `{colors.primary-focus}` outline at 50% opacity.
  - *Disabled:* Muted, non-interactive overlay.
- **Responsive Behaviour:** Spans full column width on touch viewports. Tap targets scale to ≥44px height.
- **Accessibility Notes:** Requires explicit associated html `<label>` tags. Focus indicator must be highly visible.

### Pricing Tabs Toggle (`pricing-tab-default` / `pricing-tab-selected`)
- **Purpose:** Segmented control for toggling pricing views (e.g., Monthly/Annually).
- **Visual Behaviour:** Pill container. Default tabs use canvas backgrounds, while selected tabs sit on a surface lift.
- **Interaction Behaviour:** Clicking a tab shifts selection state.
- **Motion Behaviour:** Slide animation of the selection indicator over `220ms` using spring physics.
- **States:**
  - *Default:* Background `{colors.canvas}` (#010102), text `{colors.ink-subtle}` (#8a8f98), rounded `{rounded.pill}`.
  - *Selected:* Background `{colors.surface-2}` (#141516), text `{colors.ink}` (#f7f8f8), rounded `{rounded.pill}`.
- **Responsive Behaviour:** Full pill element aligns centrally on mobile layouts. Tap target expanded to ≥44px.
- **Accessibility Notes:** Implemented using standard `role="tablist"`, `role="tab"`, and `aria-selected` attributes. Accessible via keyboard arrow keys.

---

## 4. Navigation & Structure

### Top Navigation (`top-nav`)
- **Purpose:** Sticky header navigation anchoring core site pages and branding.
- **Visual Behaviour:** Canvas color background (`{colors.canvas}` #010102), `{rounded.xs}` 4px corners, height `56px`. Contains brand logo (left), navigation links (center), and CTA buttons (right).
- **Interaction Behaviour:** Links highlight on hover.
- **Motion Behaviour:** CSS scroll-driven threshold highlights backdrop blurs and opacity.
- **States:**
  - *Default:* Clean black container.
  - *Scroll Lift:* Adds background backdrop filter blurring underlying content.
- **Responsive Behaviour:** Menu links collapse into a hamburger navigation system on viewports <768px wide.
- **Accessibility Notes:** Implemented using `<nav>` wrappers and `aria-label` attributes. Hamburger menu must support keyboard focus.

### Footer (`footer`)
- **Purpose:** Site maps, directory resources, copyright parameters, and legal declarations.
- **Visual Behaviour:** Background `{colors.canvas}` (#010102), text color `{colors.ink-subtle}` (#8a8f98), padding `64px` vertical, `32px` horizontal.
- **Interaction Behaviour:** Individual footer links highlight on pointer hover.
- **Motion Behaviour:** 150ms hover state transitions on link components.
- **States:**
  - *Default:* Clean grid layout.
- **Responsive Behaviour:** Dense multi-column layouts stack into single-column layout streams on screens smaller than 768px.
- **Accessibility Notes:** Organized lists and search index structures are navigable via keyboard inputs.

---

## 5. Banners & Feedback

### CTA Banner (`cta-banner`)
- **Purpose:** Prominent closing section CTA to encourage sign-ups or project starts.
- **Visual Behaviour:** Background `{colors.surface-1}` (#0f1011), headline typography `{typography.headline}` (28px weight 600), `{rounded.lg}` 12px corners, and `48px` padding.
- **Interaction Behaviour:** Links inside are active targets.
- **Motion Behaviour:** Ambient lighting effects shift slightly across the card background.
- **States:**
  - *Default:* Surface lift with top highlight border.
- **Responsive Behaviour:** Visual padding scales down to 24px on mobile screens. Layout transitions to a centered stack format.
- **Accessibility Notes:** Direct focus flow targets inner elements.

### Changelog Row (`changelog-row`)
- **Purpose:** Lists project changes, commits, releases, or timeline logs.
- **Visual Behaviour:** Background `{colors.canvas}` (#010102), borderless sides, bottom divider 1px `{colors.hairline}`, padding `24px` vertical.
- **Interaction Behaviour:** Row hover highlights visual typography colors.
- **Motion Behaviour:** 120ms color transition.
- **States:**
  - *Default:* Base canvas alignment.
  - *Hover:* Background highlights.
- **Responsive Behaviour:** Timeline details stack on mobile screens.
- **Accessibility Notes:** Clean HTML structure supports keyboard navigation.

### Status Badge (`status-badge`)
- **Purpose:** Displays operational tags, status markers, or build results.
- **Visual Behaviour:** Background `{colors.surface-2}` (#141516), text color `{colors.ink-muted}` (#d0d6e0), `{rounded.pill}` corners, and `2px` vertical, `8px` horizontal padding.
- **Interaction Behaviour:** Static badge element (non-interactive).
- **States:**
  - *Default:* Compact pill structure.
- **Responsive Behaviour:** Visual dimensions scale down to maintain horizontal spacing.
- **Accessibility Notes:** Requires explicit text descriptions explaining status colors to screen readers.

---

## 6. Special Component: Hero Rubik's Cube

- **Purpose:** The visual signature of the portfolio site. An interactive, volumetric 3D scene demonstrating engineered premium design.
- **Visual Behaviour:** 3D Rubik's Cube built with modular, volumetric blocks. Features reflections, metallic/frosted materials, and dynamic shadowing. Aligns with the global Top Left light source.
- **Interaction Behaviour:** 
  - Dragging rotates the cube in 3D space.
  - Individual face clicks trigger localized rotation animations.
  - Coordinates follow cursor proximity. Refer to [INTERACTIONS.md](file:///c:/dev/Portfolio/docs/INTERACTIONS.md) for details.
- **Motion Behaviour:** 
  - Utilizes spring physics to dictate rotational velocity, inertia, and drift.
  - Rotations lock to 90-degree increments on release.
  - Rotations align with the timing limits defined in [MOTION.md](file:///c:/dev/Portfolio/docs/MOTION.md).
- **States:**
  - *Default:* Gentle ambient rotation (drift).
  - *Interacting:* Drag-locked rotation tracking the cursor.
  - *Solving:* Programmatic spin sequence.
- **Responsive Behaviour:** Scaled down and centered on mobile viewports to prevent layout overflow. Perspective adjusts to fit smaller viewports.
- **Accessibility Notes:** Keyboard controls must map to arrow keys for rotation and tab key sequences to cycle face interactions. Operates statically with a custom static image fallback if `prefers-reduced-motion` is enabled.
