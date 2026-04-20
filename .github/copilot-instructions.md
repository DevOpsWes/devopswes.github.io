# Copilot Instructions — PersonalBlogSite

## Quality Standard

Every response in this repository is evaluated by **Claude Sonnet**, which assesses whether Copilot:

- Delivered the **best possible outcome** for the task
- Took the **most efficient path** — no unnecessary steps, files, or complexity
- Made **cost-effective decisions** — right-sized solutions, no over-engineering
- Produced output that is **correct, complete, and immediately usable**

Always prefer the simplest solution that fully solves the problem. Avoid adding boilerplate, placeholder sections, or tooling that wasn't asked for.


## Repository Layout

| Path | Purpose |
|---|---|
| `_posts/` | Blog articles — add `YYYY-MM-DD-title.md` files here |
| `_layouts/` | Page templates: `default`, `home`, `post`, `page` |
| `_includes/` | Reusable HTML: `head`, `header`, `footer`, `post-card` |
| `_sass/` | SCSS partials: `_variables`, `_base`, `_header`, `_hero`, `_cards`, `_post`, `_footer`, `_syntax` |
| `assets/css/main.scss` | SCSS entry point — must keep `---` front matter |
| `assets/js/main.js` | Theme toggle, mobile menu, scroll-reveal |
| `_config.yml` | Jekyll config: plugins, pagination, permalink |
| `CNAME` | Custom domain: `www.devopswes.com` |

## Stack & Build

- **Jekyll** hosted on **GitHub Pages** — builds automatically on push to `main`. No CI/CD workflow needed.
- **Gemfile**: uses `gem "github-pages"` only. Do NOT add individual plugin gems alongside it (causes version conflicts).
- **Plugins** (GitHub Pages whitelisted): `jekyll-feed`, `jekyll-seo-tag`, `jekyll-sitemap`, `jekyll-paginate`
- **Pagination**: `paginate: 6` in `_config.yml`. Homepage is `index.html` (not `.md`) with `layout: home`. Layout iterates `paginator.posts`.
- **Permalink**: `/:year/:month/:day/:title/`
- **SCSS**: compiled by Jekyll via `_sass/` directory. Use `@import` only — no `@use`/`@forward` (GitHub Pages Sass version constraint).

## Writing Blog Posts

New posts: create `_posts/YYYY-MM-DD-post-title.md` with this front matter:

```yaml
---
title: "Post Title"
date: 2026-01-01
tags: [AI, DevOps, Automation, Virtual-Workplace]
excerpt: "One-sentence description for cards and SEO."
---
```

## Design System

- Dark-first theme (`#080c14` bg, `#00d4ff` cyan accent, `#7c3aed` purple accent for light mode)
- Theme stored in `localStorage`, falls back to `prefers-color-scheme`; applied via `data-theme` attribute on `<html>`
- Fonts: **Inter** (body) + **JetBrains Mono** (code) via Google Fonts
- All design tokens in `_sass/_variables.scss`

## Security Rules

- Never commit secrets, passwords, tokens, or private keys.
- `inventory/hosts.yml` and `.env` are gitignored — always keep `.example` counterparts up to date.
- Use SSH key authentication only — never suggest password auth.
- UFW is enabled; only ports 22, 11434, and 3000 are open.

## Technology-Specific Instructions


