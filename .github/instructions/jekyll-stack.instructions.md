---
description: Jekyll + GitHub Pages build rules for the DevOpsWes blog
applyTo: "**/*.yml,**/*.html,**/*.scss,**/*.js,Gemfile,_config.yml"
---

# Jekyll Stack — Build Rules

## Dynamic Values

Always use Liquid expressions instead of hardcoded numbers for any value that can be derived from site content. Examples:

- Post count: `{{ site.posts | size }}` — not a hardcoded number
- Tag count: `{{ site.tags | size }}` — not a hardcoded number
- Any count, list length, or aggregate that Jekyll can compute at build time must be dynamic

Never hardcode a value that will silently go stale as content is added.

## Repository Layout

| Path | Purpose |
|---|---|
| `_posts/` | Blog articles — `YYYY-MM-DD-title.md` files |
| `_layouts/` | Templates: `default`, `home`, `post`, `page` |
| `_includes/` | Reusable HTML: `head`, `header`, `footer`, `post-card` |
| `_sass/` | SCSS partials (see design-system instructions) |
| `assets/css/main.scss` | SCSS entry point — must keep `---` front matter or Jekyll won't process it |
| `assets/js/main.js` | Theme toggle, mobile menu, scroll-reveal |
| `assets/images/` | SVG favicon (`favicon.svg`), hero robot (`hero-bot.svg`) |
| `_config.yml` | Jekyll config: plugins, pagination, SEO, author info |
| `CNAME` | Custom domain: `www.devopswes.com` |

## Build & Hosting

- **Platform**: GitHub Pages, auto-builds on push to `main`. No CI/CD workflow needed or wanted.
- **Gemfile**: `gem "github-pages"` only. Never add individual plugin gems (`jekyll-feed`, `jekyll-seo-tag`, etc.) alongside it — they cause version conflicts with the github-pages gem bundle.
- **Plugins** (GitHub Pages whitelist only): `jekyll-feed`, `jekyll-seo-tag`, `jekyll-sitemap`, `jekyll-paginate`
- **Permalink format**: `/:year/:month/:day/:title/`

## Pagination

- Configured as `paginate: 6` in `_config.yml`
- Only works on the root `index.html` (not `.md`). The homepage must have `layout: home`.
- The `home` layout iterates `paginator.posts`, not `site.posts`. Never change this.

## SCSS Constraints

- Jekyll on GitHub Pages uses an older Sass pipeline.
- Use `@import` only. `@use` and `@forward` will break the build.
- `assets/css/main.scss` must have `---` front matter (empty is fine) for Jekyll to process it.
- All design tokens live in `_sass/_variables.scss`. Don't scatter hardcoded values.

## Theme Flash Prevention

- `_includes/head.html` contains an inline `<script>` that reads `localStorage` and sets `data-theme` on `<html>` *before* the CSS link loads.
- This script must stay before `<link rel="stylesheet">`. Moving it breaks the dark/light mode flash prevention.
- The script uses a `try/catch` around `localStorage` for privacy/incognito compatibility.

## JavaScript

- `assets/js/main.js` handles: theme toggle (sun/moon icons), mobile hamburger menu, scroll-reveal on cards.
- `prefers-reduced-motion` is respected for the hero bot float animation and scroll-reveal.

## SEO & Metadata

- `{% seo %}` tag is in `_includes/head.html` — provides title, description, og:image, Twitter cards.
- Author info is in `_config.yml` under `author:` (name, email, linkedin).
- Tagline and description are also in `_config.yml`.

## Tags

- Tags with spaces use hyphens in front matter: `Virtual-Desktop-Environments`
- The `tags.html` page uses `uri_escape` to handle tag anchors correctly.
- Current active tags: `AI`, `DevOps`, `Cloud`, `Automation`, `Virtual-Desktop-Environments`
