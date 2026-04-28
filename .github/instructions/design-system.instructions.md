---
description: Design tokens, theme system, and SCSS conventions for the DevOpsWes blog
applyTo: "_sass/**,assets/css/**,assets/js/**,_layouts/**,_includes/**"
---

# Design System — DevOpsWes Blog

## Colour Tokens (from `_sass/_variables.scss`)

| Token | Value | Usage |
|---|---|---|
| `$accent` | `#f59e0b` | Primary brand accent — links, hero glow, borders (dark mode) |
| `$accent-alt` | `#92400e` | Primary accent (light mode) — 6.78:1 contrast on white, WCAG AA+ |
| `$gradient-end` | `#fb923c` | Gradient second stop (orange), also decorative accents |
| `$dark-bg` | `#080c14` | Page background (dark mode) |
| `$dark-surface` | `#0d1117` | Cards, header background (dark mode) |
| `$dark-border` | `rgba(255,255,255,0.08)` | Borders in dark mode |
| `$dark-text` | `#e6edf3` | Body text (dark mode) |
| `$dark-muted` | `#8b949e` | Secondary/muted text (dark mode) |

Light mode overrides are set on `[data-theme="light"]` using CSS custom properties.

## Theme System

- Theme is stored in `localStorage` as `"dark"` or `"light"`.
- Falls back to `prefers-color-scheme` if no stored preference.
- Applied via `data-theme` attribute on `<html>` element.
- The `data-theme` attribute is set by an inline script in `_includes/head.html` **before** the CSS link — this prevents theme flash. Do not move or remove this script.
- The JS toggle lives in `assets/js/main.js`.

## Glassmorphism

- Used for card and header backgrounds.
- Always wrapped in `@supports (backdrop-filter: blur())` with a solid colour fallback for unsupported browsers.

## Typography

- Body font: **Inter** (Google Fonts)
- Code font: **JetBrains Mono** (Google Fonts)
- Font imports are in `_includes/head.html`

## Hero Section

- Background: dot-grid pattern (CSS radial gradient).
- Robot image: `assets/images/hero-bot.svg` — custom SVG illustration, winking robot with speech bubble "404: feelings not found / exit code: 0 ✓"
- The robot uses CSS class `.floating` which applies `@keyframes float` (translateY).
- `prefers-reduced-motion` disables the float animation.
- Drop-shadow glow: amber in dark mode, dark amber in light mode.

## Animations

- `@keyframes float` on the hero robot: subtle translateY loop.
- Scroll-reveal on post cards: handled in `assets/js/main.js`.
- Both animations are disabled when `prefers-reduced-motion: reduce`.

## SCSS File Map

| File | Responsibility |
|---|---|
| `_variables.scss` | All tokens — colours, fonts, spacing, shadows |
| `_base.scss` | CSS reset, body, typography base |
| `_header.scss` | Sticky frosted-glass nav |
| `_hero.scss` | Homepage hero, robot image, dot-grid |
| `_cards.scss` | Post grid and card components |
| `_post.scss` | Individual article layout and typography |
| `_footer.scss` | Footer layout and links |
| `_syntax.scss` | Code block syntax highlighting |

Do not add hardcoded colour or font values outside `_variables.scss`. Use the tokens.
