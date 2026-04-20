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
tags: [AI, DevOps, Automation, Virtual-Desktop-Environments]
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

## Writing Style — Blog Content

All text written for this blog must feel like a real person wrote it — not an AI. Wesly is direct, experienced, occasionally sarcastic, and talks to readers like a colleague, not an audience.

**Voice rules:**
- Write in first person. Contractions always (`I'm`, `it's`, `don't`, `you'll`).
- Short sentences after long ones. Mix them up. Don't write in a constant rhythm.
- Have actual opinions. Don't hedge everything with "it depends" or "it's worth noting".
- Be specific — real tool names, real numbers, real situations. Vague generalities are a sign of AI content.
- Talk to the reader as "you" directly. Not "engineers" or "teams" in the abstract.
- It's fine to admit something didn't work, or that you're still figuring it out.
- A bit of dry humour is welcome. So is sarcasm when it fits.

**Phrases that are banned (they scream AI-generated):**
- "It's worth noting that..."
- "In conclusion..."
- "Delve into"
- "In the realm of"
- "Game-changing" / "cutting-edge" / "revolutionary"
- "Harness the power of"
- "It's important to understand that"
- "Navigate the complexities of"
- "Leverage" (unless talking about actual mechanical leverage)
- Any numbered list of exactly 5 perfectly parallel items with identical structure

**Structure:**
- Don't over-structure. Not every post needs H2 headers every 3 paragraphs.
- Excerpts should be one honest sentence, not a marketing blurb.
- Titles should be direct and specific, not clickbait-formulaic.

