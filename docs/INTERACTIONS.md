# Interaction Patterns

This document defines the logical interaction models, user input event maps, focus guidelines, and micro-interactions for the portfolio site. For static styling variables, component specifications, and motion parameters, refer to:
- [DESIGN.md](file:///c:/dev/Portfolio/docs/DESIGN.md) — Visual styling foundations, colors, typography, layout, and grid.
- [MOTION.md](file:///c:/dev/Portfolio/docs/MOTION.md) — 3D space, animations, timing, lighting, and physics.
- [COMPONENTS.md](file:///c:/dev/Portfolio/docs/COMPONENTS.md) — UI component specifications & states.

---

## Input Event Map

The website supports mouse pointer tracking, tactile touch gestures, and keyboard event mappings.

| Event Type | Visual Indicator | Fallback Behavior |
| :--- | :--- | :--- |
| **Pointer Hover** | Reveals depth, Z-axis separation, edge shine. | Disabled on touch (replaced by direct click/tap). |
| **Element Focus** | 2px `{colors.primary-focus}` outline at 50% opacity. | Keyboard focus rings. |
| **Active Press** | Z-axis compression (e.g. buttons press down). | Audio or visual click confirmation. |
| **Pointer Drag** | Rotates volumetric structures (e.g. Hero Rubik's Cube). | Touch sweep swipe mapping. |
| **Scroll Trigger** | cinematic section assembly, parallax movement. | Static layout on older mobile browsers. |

---

## 1. Hover & Pointer Proximity

Hover states must feel physical rather than sudden. They should react to mouse pointer proximity and coordinate tracking.
- **tactile Depth:** Hovering over a card should raise its Z-position (surface lift) and dynamically update border color highlights.
- **Reflection Tracking:** Components using materials like glass or chrome (e.g., the Hero Rubik's Cube or Product Screenshot Cards) should track pointer coordinates to update shiny overlay reflections.
- **Cursor Proximity:** Light emitting elements can track pointer position to project ambient backglows onto nearby surface edges.

*Avoid sudden size jumps (`transform: scale(...)` overrides). Visual changes should feel integrated into the 3D grid system.*

---

## 2. Focus & Pressed Mechanics

### Focus States
Focus indicates element navigation via keyboard or selection devices.
- **Global Indicator:** Focused interactive elements (e.g., inputs, buttons, links) display a 2px `{colors.primary-focus}` outline at 50% opacity.
- Focus outlines must use `outline-offset` values to ensure they do not clip card borders.
- Outline animations transition over `120ms` in duration.

### Pressed States
Clicking or touching elements must provide tactile feedback.
- **Button Depth:** Buttons shift down on the visual Z-axis (`transform: translateZ(-2px)`) when pressed, simulating a physical spring.
- **Input Glow:** Active input fields brighten their inner borders and soft lighting highlights.

---

## 3. Gestures & Touch Behaviour

Touch viewports operate on gesture event loops rather than hover triggers.
- **Hover Disabling:** Hover effects (e.g. perspective tilt on hover) are disabled on touch devices to prevent stuck visual states.
- **Touch Targets:** Tap targets are scaled to a minimum of 44px (height & width) on touch viewports.
- **Swipes:** Swiping gestures on slideshows or toggles translate directly to 1-to-1 linear content movements, which then animate to a snap on release using spring physics (approx. 220ms duration).

---

## 4. Keyboard Navigation

The entire interface must be fully navigable using keyboard shortcuts and tab sequences.
- **Logical Tab Index:** Document structure must flow sequentially from top-left (Header Nav) to bottom-right (Footer).
- **Control Mappings:**
  - **Tabs Toggles:** Keyboard arrow keys cycle active segment selections.
  - **Volumetric Hero Cube:** Arrow keys rotate the cube structure in 90-degree increments.
  - **Modals:** `Escape` key closes active overlays, returning focus to the trigger element.

---

## 5. Micro-interactions & Feedback

Micro-interactions must remain subtle, providing gentle visual feedback without seeking attention.

### Standard Micro-interactions
- **Button Press Depth:** Buttons visually compress into the page surface on click/tap events.
- **Input Focus Lighting:** Hovering or focusing text fields illuminates a hairline border, simulating a physical light source passing over.
- **Card Edge Illumination:** Moving the mouse over cards lights up their border lines relative to the pointer's coordinate angle.
- **Cursor Proximity:** Ambient backglows follow the cursor on high-fidelity dashboard blocks.

### Feedback Loops
- **Success States:** Green badge components (`{colors.semantic-success}`) appear when actions (e.g. form submissions) complete successfully.
- **Error States:** Invalid form fields glow with a subtle red border and display inline text descriptions.
- **Loading Indicators:** Volumetric loading indicators rotate slowly using ease-in-out timing, avoiding sudden stops.
