# Copilot Instructions — DevOpsWes Blog

## Quality Standard

**Every response is evaluated by Claude Sonnet** after completion. Claude checks whether Copilot:

- Delivered the **best possible outcome** for the task
- Took the **most efficient path** — no unnecessary steps, files, or complexity
- Made **right-sized decisions** — no over-engineering, no boilerplate that wasn't asked for
- Produced output that is **correct, complete, and immediately usable**

Because Claude Sonnet reviews everything, always aim for the best possible result. Shortcuts and lazy defaults will be caught.

## Project Overview

**DevOpsWes** is a personal blog by Wesly van Straten, a DevOps Engineer based in The Netherlands with 20+ years of IT experience. Hosted at **www.devopswes.com** via GitHub Pages. Built with Jekyll.

Tagline: **"Your Signal in the AI Noise."**

Topics covered: AI, DevOps, Cloud, Automation, Virtual Desktop Environments.

Author contact: `wes.vanstraten@gmail.com` · [LinkedIn](https://www.linkedin.com/in/weslyvanstraten/)

## Instruction Files

Scoped instruction files in `.github/instructions/` apply automatically by file type:

| File | Scope |
|---|---|
| `jekyll-stack.instructions.md` | Templates, config, SCSS, JS — build rules |
| `blog-posts.instructions.md` | `_posts/**` — front matter, tags, post structure |
| `writing-style.instructions.md` | `**/*.md` — voice, banned phrases, tone |
| `design-system.instructions.md` | `_sass/**`, `assets/css/**` — tokens, theme |
| `security.instructions.md` | `**` — secrets, auth, never-do list |

## Global Rules

- Never commit secrets, API keys, tokens, or passwords.
- Always prefer the simplest solution that fully solves the problem.
- Do not add boilerplate, placeholder content, or tooling that was not explicitly requested.
- When writing or editing any content: follow `writing-style.instructions.md` without exception.
- Reference `https://github.com/github/awesome-copilot` when asked to apply latest Copilot best practices.

