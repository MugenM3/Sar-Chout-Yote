# Design System Document

## 1. Overview & Creative North Star: "The Digital Agronomist"
This design system moves away from the "industrial utility" look of traditional agricultural software. Instead, it adopts the **Digital Agronomist** persona: an editorial, premium experience that feels as authoritative as a scientific journal and as organic as the land itself.

The system rejects rigid, boxed-in grids. Instead, it utilizes **intentional asymmetry, tonal layering, and sophisticated typography scales** to create a sense of breathing room. By treating the interface as a series of stacked, high-end materials rather than flat digital planes, we provide farmers with a tool that feels professional, trustworthy, and calm—even in high-stress harvesting conditions.

---

## 2. Color & Surface Philosophy

### The Palette
We utilize a sophisticated Material 3-based palette centered on `primary` (#315F3B) for growth and `secondary` (#006399) for data-driven weather insights. 

### The "No-Line" Rule
**Traditional 1px solid borders are strictly prohibited for sectioning.** To define boundaries, designers must use background color shifts or tonal transitions.
- **Example:** A weather widget using `surface-container-low` (#F3F4F5) should sit directly on a `surface` (#F8F9FA) background. The change in hex value is the border.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper or frosted glass. Use the `surface-container` tiers to define importance:
- **Base Level:** `surface` (#F8F9FA)
- **Secondary Content:** `surface-container-low` (#F3F4F5)
- **Interactive Cards:** `surface-container-lowest` (#FFFFFF) for maximum "pop" and legibility.
- **Nested Controls:** `surface-container-high` (#E7E8E9) for inner elements like search bars within a header.

### The "Glass & Gradient" Rule
To avoid a "flat" template look, use semi-transparent `surface` colors with a `backdrop-blur` (Glassmorphism) for floating action buttons or sticky headers. For main CTAs, apply a subtle linear gradient from `primary` (#315F3B) to `primary_container` (#497851) at a 135-degree angle to add "visual soul" and depth.

---

## 3. Typography
We use a dual-font pairing to balance authority with high-utility legibility.

*   **Display & Headlines (Manrope):** A modern, geometric sans-serif that feels architectural and premium. Use `display-lg` (3.5rem) for high-impact data points (e.g., current soil moisture percentage).
*   **Body & Labels (Public Sans):** A high-legibility typeface designed for clarity. `body-lg` (1rem) and `body-md` (0.875rem) provide the "editorial" feel required for long-form crop reports.

**Hierarchy Strategy:** 
Use `headline-sm` (#191C1D) for section titles to establish a strong, trustworthy anchor. Pair this with `label-md` using `on_surface_variant` (#40493D) for metadata to create a sophisticated tonal contrast.

---

## 4. Elevation & Depth

### Tonal Layering
Depth is achieved by "stacking" the surface scale. Placing a `surface-container-lowest` card on a `surface-container-low` section creates a soft, natural lift without the "muddy" look of traditional shadows.

### Ambient Shadows
Where floating elements (like Modals or FABs) are required, use **Ambient Shadows**:
- **Blur:** 24px - 40px
- **Opacity:** 4% - 6%
- **Color:** Use a tinted version of `on_surface` (#191C1D) rather than pure black to mimic natural outdoor light.

### The "Ghost Border" Fallback
If a visual separator is mandatory for accessibility (e.g., in high-glare sunlight), use a **Ghost Border**: `outline-variant` (#BFCABA) at 15% opacity. Never use 100% opaque lines.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `xl` (1.5rem) rounded corners. Text in `on_primary` (#FFFFFF).
- **Secondary:** Surface-based with a `Ghost Border`.
- **Tertiary:** Text-only using `primary` color, strictly for low-priority actions like "Cancel."

### Cards & Lists
**Strict Rule:** No divider lines. Separate list items using `spacing-4` (1.4rem) of vertical white space or by alternating background tones between `surface-container-lowest` and `surface-container-low`.

### Data Visualization (Agricultural Specific)
- **Soil Health Gauges:** Use `tertiary_fixed_dim` (#FFBA27) for alerts and `primary` (#315F3B) for optimal ranges.
- **Weather Chips:** Use `secondary_container` (#67BAFD) with 20% opacity and a backdrop blur to overlay on top of field photography.

### Input Fields
Avoid the "boxed" look. Use a `surface-container-high` (#E7E8E9) fill with a `DEFAULT` (0.5rem) corner radius. Use `label-sm` for floating labels to maintain the high-end editorial feel.

---

## 6. Do's and Don'ts

### Do:
- **Use generous white space:** Follow the `spacing-8` (2.75rem) and `spacing-12` (4rem) tokens to separate major sections.
- **Prioritize Contrast:** Ensure all text on `surface` containers meets a minimum 4.5:1 ratio for outdoor readability.
- **Embrace Asymmetry:** Align high-impact stats to the left while keeping supporting imagery or secondary data slightly offset to the right.

### Don't:
- **Don't use 1px dividers:** It clutters the interface and makes it look "cheap." Use space and tone instead.
- **Don't use hard corners:** Every interactive element must use at least the `DEFAULT` (0.5rem) roundedness to feel "accessible and friendly."
- **Don't use pure black:** Use `on_background` (#191C1D) for text to keep the interface feeling organic rather than harsh.