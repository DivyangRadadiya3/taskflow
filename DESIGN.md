# Design Brief — Offline Todo App

**Purpose:** Offline-first task management with glassmorphism aesthetics. Emphasize clarity, smooth interactions, and intentional depth through frosted glass surfaces.

**Tone:** Modern, refined, minimal. Professional without coldness. Inspired by Linear and premium productivity tools.

## Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Background | `0.98 0.01 270` | `0.12 0.02 260` | Page background, minimal texture |
| Foreground | `0.25 0.04 260` | `0.92 0.02 270` | Primary text, high contrast |
| Card | `0.96 0.02 270` | `0.18 0.08 260` | Frosted glass cards with 50% opacity + blur |
| Primary | `0.45 0.15 260` | `0.65 0.18 180` | Actions, toggles, focus states |
| Accent | `0.62 0.21 180` | `0.68 0.21 180` | Highlights, active states, completion glow |
| Destructive | `0.58 0.18 25` | `0.62 0.18 25` | Delete, danger actions, priority high |
| Success | `0.68 0.18 122` | `0.72 0.18 122` | Task completed state |
| Border | `0.92 0.02 270` | `0.25 0.08 260` | Card borders at 30% opacity, subtle dividers |

## Typography

| Role | Font | Weight | Scale |
|------|------|--------|-------|
| Display | Bricolage Grotesque | 600–700 | 32px (headers), 24px (section titles) |
| Body | DM Sans | 400–500 | 16px (primary), 14px (secondary), 12px (meta) |
| Mono | JetBrains Mono | 400–500 | 12px (timestamps, technical), 11px (micro) |

## Structural Zones

| Zone | Treatment | Rationale |
|------|-----------|-----------|
| Header | `glass-card` with shadow-glass-lg, sticky top-0 | Navigation clarity, glassmorphic anchor |
| Content | `bg-background` with card layers on top | Primary information layer |
| Card (task) | `glass-card` with 50% opacity, backdrop-blur-md, border-border/30 | Frosted glass effect, layered depth |
| Empty state | Centered illustration + text with muted foreground | Clear affordance when no tasks |
| Footer | `border-t border-border/20`, muted styling | Subtle separation, not prominent |

## Component Patterns

- **Task card:** Flexbox with title, meta (due date + priority badge), category tag. Hover shifts background opacity `50% → 70%`. Completed state: strikethrough, muted color, accent glow optional.
- **Priority badges:** Color-coded (high=destructive, medium=warning, low=muted). 10px padding, 6px radius, semantic colors.
- **Category tags:** Small pills with accent border, muted background, rounded-full.
- **Buttons:** Semantic colors (primary for confirm, destructive for delete, muted for secondary). Padding 8–12px, radius-md.
- **Inputs:** Border-border, focus:ring-2 ring-accent, smooth focus transition.

## Motion Storyboard

| Event | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Task entrance | fade-in-up + staggered children | 0.35s | cubic-bezier(0.4, 0, 0.2, 1) |
| Task complete | scale-pulse (brief celebratory pulse) | 0.6s | ease-out |
| Mode toggle | fade-in-down (content repaint) | 0.35s | cubic-bezier(0.4, 0, 0.2, 1) |
| Delete (undo hint) | pulse-glow (2s infinite) | 2s | ease-in-out |
| Focus (interactive) | transition-smooth (all 0.3s) | 0.3s | cubic-bezier(0.4, 0, 0.2, 1) |

## Differentiation

**Glassmorphism execution:** Cards rendered with `bg-card/50 backdrop-blur-md border border-border/30`. Not transparent enough to be unreadable; not opaque enough to feel flat. Creates layered, premium depth perception.

**Smooth entrance choreography:** Task list items stagger on load (60–80ms between each). Creates gentle, predictable flow rather than atomic pop-in.

**Dark mode primary:** Glassmorphism reads best in dark. Light mode is supported but secondary. Dark emphasizes the frosted glass aesthetic.

**Interactive polish:** All state changes (hover, focus, completion) trigger `transition-smooth`. No jarring jumps.

## Constraints

- **Minimal decoration:** No full-page gradients, no excessive glow effects. Design serves clarity first.
- **High contrast:** AA+ compliance. Foreground-on-background lightness difference ≥ 0.7. Foreground-on-primary ≥ 0.45.
- **Mobile-first:** Responsive breakpoints sm/md/lg. Touch targets ≥ 44px.
- **Accessibility:** Keyboard navigation fully supported. Focus states visible (ring-accent at 2px). ARIA labels on interactive elements.
- **No color reliance:** Priority/status communicated via color + icon + text.
