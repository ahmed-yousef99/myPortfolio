# Motion & 3D Design Language

This document establishes the motion principles, 3D physics, animation durations, lighting directions, and performance budgets for the portfolio canvas. For static visual foundations, components catalogs, and interaction triggers, refer to:
- [DESIGN.md](file:///c:/dev/Portfolio/docs/DESIGN.md) — Core visual styles, color system, and layout tokens.
- [COMPONENTS.md](file:///c:/dev/Portfolio/docs/COMPONENTS.md) — UI component specifications & states.
- [INTERACTIONS.md](file:///c:/dev/Portfolio/docs/INTERACTIONS.md) — Input mechanics & micro-interactions.

---

## Motion Philosophy

Portfolio does not use animation as decoration. Motion exists to communicate depth, hierarchy, responsiveness, and craftsmanship. 

The entire website follows a unified Cubic Motion Language. The interactive Rubik Cube in the Hero section is the visual DNA of the whole interface. Every section, component, and interaction should feel as if it belongs to the same engineered 3D system.

The website should feel:
- Physical
- Premium
- Precise
- Minimal
- Calm
- Confident

**Avoid:**
- Playful appearance.
- Cartoonish velocity.
- Exaggerated timing or bounces.

---

## Motion Principles

### Purpose First
Every animation must have a purpose. Accepted purposes include:
- Explaining hierarchy.
- Guiding attention.
- Communicating interaction feedback.
- Revealing contextual information.
- Improving orientation and spatial awareness.
- Reinforcing visual depth.

> [!IMPORTANT]
> **Motion Rule:** If an animation does not improve clarity, hierarchy, feedback, depth, or realism, it should not exist.

### One Motion Language
Every component must follow the same motion vocabulary. Avoid mixing different animation styles. 
Do not combine:
- Bouncing curves.
- Elastic overshoot effects.
- Exaggerated scaling.
- Random rotations.
- Flashy glow effects.
unless explicitly justified.

### Depth Before Movement
Prefer creating visual depth and layered separation over creating raw movement.
- **Good (Recommended):** Perspective shifts, layered surfaces, lighting adjustments, dynamic reflections, and depth-based parallax.
- **Bad (Avoid):** Uniform `translateY` on scroll, raw scale animations, spring bounces, continuous pulses, and rotating icons.

---

## Cubic Design Language

The Hero Rubik Cube (detailed in [COMPONENTS.md](file:///c:/dev/Portfolio/docs/COMPONENTS.md)) defines the system's identity. All other components should feel inspired by modular cubic construction.
- **Cards** behave like solid blocks.
- **Sections** feel assembled from structural parts.
- **Buttons** feel pressable along the Z-axis.
- **Floating elements** feel volumetric.

The website should never feel flat or purely two-dimensional.

---

## 3D Principles

### Perspective System
Use real CSS perspective parameters on wrapper elements. Avoid relying entirely on simulated depth created by flat CSS `box-shadow` styles. Perspective properties should remain consistent throughout the website to preserve a unified camera angle.

### Preserve 3D
Whenever rendering layered depth, explicitly configure:
```css
transform-style: preserve-3d;
```
rather than simulating depth with absolute positioning on a single visual plane.

### Physical Materials
Components should resemble premium engineered materials.
- **Good:** Frosted glass, acrylic, anodized aluminum, and matte textures.
- **Bad:** Plastic finishes or generic high-contrast gloss.

### Layered Construction
Each key component should be built using multiple structural layers:
1. **Background Layer** (canvas foundation)
2. **Surface Layer** (base panel height)
3. **Content Layer** (text, labels, graphics)
4. **Reflection Layer** (gloss/shine overlays)
5. **Glow Layer** (soft light emit)
6. **Interaction Layer** (focus/hover feedback)

Depth should come from the Z-axis separation of these layers.

---

## Lighting System

The entire website follows a single, global virtual light source.
- **Preferred Light Direction:** **Top Left**
- Every card, cube, button, and floating object must respect this lighting direction when rendering highlights, reflections, and drop shadows.
- Never mix multiple lighting directions on the same viewport.

---

## Hover Behaviour

Hover states should reveal physical depth rather than flat size changes.
- **Preferred Interactions:**
  - Perspective shifts.
  - Directional lighting adjustments.
  - Surface separation (lifting layers on the Z-axis).
  - Reflection movement (specular highlights tracking the pointer).
  - Edge illumination (shining borders).
  - Slight, calibrated Z-axis rotation.
- **Avoid:**
  - Bouncing.
  - Pulsing.
  - Icon spinning.
  - Large scaling overrides.
For input mechanics and trigger maps, refer to [INTERACTIONS.md](file:///c:/dev/Portfolio/docs/INTERACTIONS.md).

---

## Scroll Behaviour

Scrolling should feel cinematic and structural.
- Sections should assemble into view along their cubic guidelines as the page is scrolled.
- Avoid simple fade + translate animations that feel generic.
- **Preferred Effects:**
  - Progressive reveal.
  - Depth-based transitions.
  - Staggered structural assembly.
  - Perspective changes.
  - Modular composition shifts.

---

## Component Behaviour

- **Cards:** Should behave as solid, volumetric blocks.
- **Buttons:** Should feel pressable along the Z-axis. Refer to [COMPONENTS.md](file:///c:/dev/Portfolio/docs/COMPONENTS.md) for button state tokens.
- **Inputs:** Should react through localized lighting adjustments and edge highlights.
- **Navigation:** Should feel physically attached to the interface structure.
- **Sections:** Should feel constructed and assembled rather than fading in.

---

## Motion Timing

Keep animations crisp, clean, and responsive to avoid delaying user intent.
- **Fast Interaction:** `120–180ms` (e.g., hover, button click, input focus).
- **Medium Transition:** `220–350ms` (e.g., card shifts, dropdown reveal, state toggles).
- **Large Section Transition:** `400–700ms` (e.g., section scroll entry, full-page transitions).

Avoid long animations or artificial delays that block interaction.

---

## Physics

Prefer physical spring dynamics over mathematical linear interpolation (e.g., standard ease-in-out CSS curves).
Animations should incorporate realistic:
- Acceleration curves.
- Natural momentum and inertia.
- Controlled deceleration without hard stops.

The movement must feel organic and physical, never robotic.

---

## Background Behaviour

Background systems must provide subtle environmental depth, never distraction.
- **Preferred Elements:**
  - Subtle, low-contrast cubic grids.
  - Distant, slow-moving volumetric particles.
  - Slow, deep parallax shifts.
  - Soft, atmospheric ambient lighting.
- **Avoid:**
  - High-frequency noisy particles.
  - Excessive speed or random movement.

---

## Performance Budget

Maintain high frame rates to guarantee a premium experience:
- **Target Desktop:** `60 FPS` constant.
- **Target Mobile:** `60 FPS` constant on modern mobile devices.

To achieve this, animations must limit repaint operations and rely almost exclusively on hardware-accelerated properties:
- `transform` (translations, scales, rotations, 3D translations)
- `opacity`
- `filter` (used sparingly at small radii)

Avoid triggering layout thrashing or repaint-heavy styles (e.g., animating `width`, `height`, `margin`, `top`, or `box-shadow` values directly).

---

## Accessibility & Reduced Motion

Respect the user's system preferences for motion reduction:
- Always check the media query:
  ```css
  @media (prefers-reduced-motion: reduce) { ... }
  ```
- All important navigation, interactions, and reading flows must remain fully operational without any animation.
- Motion must never be a prerequisite to understanding or navigating the website.

---

## Mobile Motion

Calibrate motion intensity to accommodate hand-held touch viewports:
- Reduce overall motion intensity and rotation angles.
- Flatten perspective parameters to account for smaller display sizes.
- Disable expensive 3D effects when battery-saving, thermal throttling, or lower hardware specifications are detected.
- Touch events must replace hover cues (refer to [INTERACTIONS.md](file:///c:/dev/Portfolio/docs/INTERACTIONS.md)).
