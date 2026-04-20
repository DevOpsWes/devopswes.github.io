# DevOpsWes — Personal Blog

**Live site:** [www.devopswes.com](https://www.devopswes.com)

> *Automate the Ordinary. Amplify the Extraordinary.*  
> AI · DevOps · Automation · Virtual Desktop Environments

---

## Stack

| Layer | Technology |
|---|---|
| Generator | [Jekyll](https://jekyllrb.com/) (native GitHub Pages — no CI/CD needed) |
| Hosting | GitHub Pages → `www.devopswes.com` via CNAME |
| Styling | Custom SCSS design system (dark/light mode) |
| Plugins | jekyll-feed · jekyll-seo-tag · jekyll-sitemap · jekyll-paginate |

GitHub builds and deploys automatically on every push to `main`.

---

## Writing a New Blog Post

1. Create a file in `_posts/` named exactly: `YYYY-MM-DD-your-post-title.md`
2. Add this front matter at the top:

```yaml
---
title: "Your Post Title"
date: 2026-01-01
tags: [AI, DevOps, Automation, Virtual-Desktop-Environments]
excerpt: "One sentence that appears in post cards and SEO meta description."
---
```

3. Write your content in Markdown below the `---`
4. Commit and push → site rebuilds in ~1 minute

**Supported tags:** `AI`, `DevOps`, `Automation`, `Virtual-Desktop-Environments` (add new ones freely — they auto-appear on `/tags`)

**Code blocks** use Rouge syntax highlighting:

````markdown
```python
def hello():
    print("Hello, world!")
```
````

---

## Project Structure

```
_config.yml               # Site config: title, plugins, permalink, pagination
Gemfile                   # Ruby deps (github-pages gem only — do not add individual plugin gems)
CNAME                     # Custom domain: www.devopswes.com

_posts/                   # ← ADD NEW ARTICLES HERE (YYYY-MM-DD-title.md)
_layouts/
  default.html            # HTML shell (head + header + main + footer)
  home.html               # Homepage: hero section + paginated post grid
  post.html               # Individual article with prev/next nav
  page.html               # Static pages (About, Tags, 404)
_includes/
  head.html               # <head>: theme flash prevention, fonts, SEO tag, CSS
  header.html             # Sticky frosted-glass nav with theme toggle + mobile menu
  footer.html             # Footer with topic links and RSS
  post-card.html          # Reusable card component (used in post grid)
_sass/
  _variables.scss         # Design tokens: colors, fonts, spacing, shadows
  _base.scss              # CSS reset, custom properties, skip link, container
  _header.scss            # Header, nav, theme toggle, mobile menu
  _hero.scss              # Hero section, floating code window, dot-grid background
  _cards.scss             # Post grid, cards, tags, pagination
  _post.scss              # Article layout, post body markdown styles, prev/next nav
  _footer.scss            # Footer, tags page
  _syntax.scss            # Rouge syntax highlighting (Monokai dark)
assets/
  css/main.scss           # SCSS entry point (must keep --- front matter)
  js/main.js              # Theme toggle, mobile menu, scroll-reveal animations
  images/favicon.svg      # SVG favicon (</> motif)
index.html                # Homepage entry (layout: home — do not add content here)
about.md                  # About page
tags.html                 # Auto-generated tag index
404.html                  # Custom 404 page
```

---

## Local Development

```bash
# Install Ruby + Bundler first, then:
bundle install
bundle exec jekyll serve --livereload

# Open http://localhost:4000
```

---

## Design System Quick Reference

| Token | Dark | Light |
|---|---|---|
| Background | `#080c14` | `#f8fafc` |
| Card | `#111827` | `#ffffff` |
| Primary accent | `#00d4ff` (cyan) | `#7c3aed` (purple) |
| Text | `#e2e8f0` | `#0f172a` |
| Muted | `#94a3b8` | `#475569` |

Font: **Inter** (body) · **JetBrains Mono** (code)

Theme is stored in `localStorage` as `"dark"` or `"light"`, with `prefers-color-scheme` as the initial default.
