---
name: Warm Editorial Estate
colors:
  surface: '#fff8f4'
  surface-dim: '#dfd9d5'
  surface-bright: '#fff8f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f2ee'
  surface-container: '#f3ede9'
  surface-container-high: '#ede7e3'
  surface-container-highest: '#e8e1dd'
  on-surface: '#1d1b19'
  on-surface-variant: '#57423b'
  inverse-surface: '#33302e'
  inverse-on-surface: '#f6efec'
  outline: '#8b716a'
  outline-variant: '#dfc0b7'
  surface-tint: '#a53c14'
  primary: '#943007'
  on-primary: '#ffffff'
  primary-container: '#b5471f'
  on-primary-container: '#ffe6df'
  inverse-primary: '#ffb59d'
  secondary: '#645e52'
  on-secondary: '#ffffff'
  secondary-container: '#e8decf'
  on-secondary-container: '#696256'
  tertiary: '#2a5a4b'
  on-tertiary: '#ffffff'
  tertiary-container: '#437362'
  on-tertiary-container: '#c2f6e1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59d'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#832600'
  secondary-fixed: '#ebe1d2'
  secondary-fixed-dim: '#cfc5b7'
  on-secondary-fixed: '#1f1b12'
  on-secondary-fixed-variant: '#4c463b'
  tertiary-fixed: '#baeed9'
  tertiary-fixed-dim: '#9ed1bd'
  on-tertiary-fixed: '#002117'
  on-tertiary-fixed-variant: '#1d4f40'
  background: '#fff8f4'
  on-background: '#1d1b19'
  surface-variant: '#e8e1dd'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Newsreader
    fontSize: 38px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Newsreader
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: 0em
  price-display:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: -0.02em
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: DM Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: DM Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.04em
  label-md:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-sm:
    fontFamily: DM Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-desktop: 2.5rem
  margin: 1.25rem
  margin-tablet: 2.5rem
  margin-desktop: 4rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 2.5rem
  space-xl: 4.5rem
---

## Brand & Style

This design system embodies an unhurried, literary, and architectural approach to modern Nigerian property acquisition. Moving deliberately away from cold, commodified SaaS portals, the interface mirrors the gravitas and sensory warmth of high-end architectural monographs and legacy print broadsheets. 

The emotional response should evoke deep institutional trust, permanence, cultural pride, and tactile luxury. Visual hierarchy is established through generous whitespace rhythms, disciplined editorial layouts, precise hairline separators, and expressive typographic contrast rather than floating plastic components. Subtle, respectful nods to indigenous artistry—such as restrained Adire geometric linework across empty states, mastheads, and framing lines—ground the experience in authentic regional prestige.

## Colors

The palette draws directly from earth, sun-baked clay, architectural raw materials, and archival paper stock:

- **Primary (`#B5471F` / Terracotta):** Used intentionally for decisive interaction points (primary buttons), active editorial tabs, key property price accents, and critical focal lines.
- **Secondary (`#E9DFD0` / Sand):** A supportive architectural tint used for secondary panel backgrounds, search filter bars, quiet card backings, and subtle hovered surfaces.
- **Tertiary (`#1B4D3E` / Deep Forest Green):** Reserved exclusively for trust instrumentation: the canonical "Verified" institutional badge, land title confirmation indicators, and certified agent seals. Never used for decorative accents or unrelated actions.
- **Neutral Primary (`#161412` / Deep Ink):** Delivers rich typographic weight across copy, crisp hairline borders, and graphic architectural outlines.
- **Canvas Base (`#F6F1E9` / Warm Cream):** The pervasive, non-glare surface base across all screens, creating a natural print-stock reading context.
- **Structural Hairline (`#E2D9CC` / Pale Mortar):** The sole tool for grid boundaries, horizontal rules, and table dividers.

## Typography

The type system balances historical editorial weight with technical clarity. Headings, property valuations, and currency figures utilize the optical warmth and high stroke contrast of a traditional editorial serif. Numerical values (such as property pricing and square meterage) must honor their serif shapes, displaying full currency denominations (₦ / NGN) with dignity.

Supporting metadata, specifications, floor plans, and functional UI triggers rely on DM Sans for its unpretentious geometry and high legibility at micro-scales. Section eyebrow tags and metadata keys use uppercase `label-sm` or `label-md` with widened tracking to evoke architectural plan legends and curated catalog indexes.

## Layout & Spacing

The layout operates on a disciplined 12-column fluid grid system on desktop, collapsing to 6 columns on tablet and 4 columns on mobile. Rather than isolated floating cards, sections are framed by perimeter hairlines (`1px solid #E2D9CC`) and generous breathing room.

- **Desktop (1200px+):** Outer margins expand to `4rem`, column gutters set to `2.5rem`. Layouts prioritize asymmetrical editorial pacing (e.g., a 7-column architectural photo juxtaposed with a 5-column editorial dossier).
- **Tablet (768px – 1199px):** Margins set to `2.5rem`, gutters at `1.5rem`. 
- **Mobile (< 768px):** Margins set to `1.25rem`, gutters at `1rem`. Property listings reflow vertically with explicit dividing hairlines rather than boxed margins.

Avoid card-grid clutter. Whitespace rhythm must follow a strict vertical cadence: `space-xl` between thematic editorial chapters, `space-lg` between distinct property entries, and `space-sm` for inline typographic metadata.

## Elevation & Depth

Visual depth is purely graphic, planar, and flat—avoid diffuse drop shadows, floating elevations, or glassy blurs.

- **Tonal Planes:** Hierarchy is established by placing architectural photography and Sand (`#E9DFD0`) surfaces directly over the Cream (`#F6F1E9`) base canvas.
- **Hairline Framing:** Interfaces rely on `1px solid #E2D9CC` borders to delimit boundaries, navigation rails, and data grids.
- **Layering Overlays:** When an expanded image gallery or inquiry modal activates, use a solid backdrop tint (`#161412` at 65% opacity) paired with an un-elevated Cream container bounded by a crisp 1px hairline border.
- **Hover & Focus Interactions:** Hover states never raise the Y-position or project shadows; they activate subtle hairline color shifts to `#B5471F` or flat background transitions to `#E9DFD0`.

## Shapes

The architectural nature of this system favors crisp, structural edges with minimal softening:

- **Surfaces, Containers, and Property Imagery:** Restrained to `4px` or `8px` (`0.25rem` to `0.5rem`). This preserves the structural geometry of Nigerian residential forms and print layout framing.
- **Primary Buttons & Compact Badges:** The sole exception to the shape rule. Primary call-to-action buttons and status indicators use a full pill radius (`9999px`) to create intentional contrast against the grid's structural rectangles.
- **Input Fields & Text Areas:** Structured with strict `4px` corners, anchoring form fields firmly to the horizontal rules.

## Components

### Buttons
- **Primary:** Full pill radius (`9999px`), solid Terracotta (`#B5471F`) fill, Cream (`#F6F1E9`) text, zero shadow. Padding: `12px 28px`. Hover shifts fill to deep rust (`#963B19`).
- **Secondary / Ghost:** Full pill radius, transparent background with a `1px solid #161412` border, Ink text. Hover creates a flat fill of Sand (`#E9DFD0`).
- **Editorial Link:** Flat inline link in Terracotta or Ink with a persistent `1px` underline offset by `4px`.

### Badges & Metadata Chips
- **Limit:** Strictly maximum 2 badges per property listing.
- **The "Verified" Trust Badge:** Pill-shaped, Forest Green (`#1B4D3E`) text on a tinted ground (`#1B4D3E12`), framed by a crisp `1px solid #1B4D3E33` border. Accompanied by a bespoke checkmark icon.
- **Category Badge (e.g., Ikoyi, New Build):** Pill-shaped, Ink (`#161412`) text on Sand (`#E9DFD0`), zero border.

### Property Listings (Cards)
- Unboxed approach: Avoid heavy rounded borders. A listing consists of an architectural photograph with a sharp `4px` corner radius, a clean hairline partition beneath, followed by serif headline typography, location metadata, and a standalone `price-display` token.
- Backgrounds remain default Cream (`#F6F1E9`) or use Sand (`#E9DFD0`) for highlighted featured portfolios.

### Form Inputs & Selectors
- Flat cream background with a definitive `1px solid #E2D9CC` border, rounded to `4px`.
- In focus state: border transitions directly to Terracotta (`#B5471F`) with no outer glow rings.
- Field labels sit above inputs in uppercase `label-sm` tracking.

### Checkboxes & Radio Buttons
- Checkboxes: Square with `2px` micro-radius, `1px solid #161412` border. Checked state fills with Terracotta (`#B5471F`) displaying an ivory geometric checkmark.
- Radio buttons: Circular, matching ink borders, filled with an inner dot on active states.

### Architectural Accents & Cultural Motifs
- Empty states, divider terminals, and page headers can include minimal geometric Adire vector lines (chevron rhythms, intersecting triangles) rendered in delicate single-pixel strokes using `#E2D9CC` or `#B5471F33`.