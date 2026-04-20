---
description: Rules for creating and editing blog posts on the DevOpsWes blog
applyTo: "_posts/**"
---

# Blog Post Rules

## Creating a New Post

File name format: `_posts/YYYY-MM-DD-descriptive-slug.md`

Required front matter:

```yaml
---
title: "Your Title Here"
date: 2026-01-01
tags: [AI, DevOps, Automation, Virtual-Desktop-Environments, Cloud]
excerpt: "One honest sentence that describes what this post is actually about."
tldr: "Two or three sentences. Give away the answer — what happened, what you found, what changed. Readers scanning before committing deserve the actual point, not a teaser."
---
```

## Front Matter Rules

- `title`: Direct and specific. Not clickbait. Not "5 Ways to...". Not "The Ultimate Guide to...".
- `date`: Use `YYYY-MM-DD` format. Set to the actual publish date.
- `tags`: Use only established tags (see list below). Multi-word tags use hyphens.
- `excerpt`: One sentence. Honest, not marketing. Readers will see this on the homepage cards and in search results.
- `tldr`: Two or three sentences rendered as a callout box at the top of the post. Give the reader the actual answer up front — what happened, what you found, what changed. Don't treat it as a second excerpt or a teaser. Scanning readers deserve the real point.

## Established Tags

| Tag | Use for |
|---|---|
| `AI` | LLMs, agents, Copilot, Ollama, prompt engineering, AI tooling |
| `DevOps` | Azure DevOps, CI/CD, pipelines, GitOps, platform engineering |
| `Cloud` | Azure, AWS, IaC, Terraform, cloud architecture |
| `Automation` | PowerShell, Python, scripting, workflow automation |
| `Virtual-Desktop-Environments` | Citrix, VDI, DaaS, FSLogix, ControlUp, workspace management |

To add a new tag, also add it to the footer topic links in `_includes/footer.html` and `tags.html`.

## Existing Posts (for context and consistency)

1. **"Welcome to DevOpsWes: why I finally started writing things down"** (`2026-04-20`)
   - Introductory post. Sets tone and explains the blog's purpose. References Wesly's 20+ year career.

2. **"How I used Copilot to find a VDI bug that left no errors in any log"** (`2026-04-15`)
   - Real story: ControlUp trigger captured 40 min of forensic data (Event logs, FSLogix logs, registry, installed apps) around a random Citrix DaaS issue. Used Copilot in VS Code with a structured investigation brief and a clean-baseline dataset to find the root cause: multiple Azure auth module versions loaded simultaneously, hidden in informational XML event data.

## Post Structure Guidance

- Lead with the situation or problem, not a preamble about what you're going to say.
- Use H2 headers to break up longer posts. Don't force them into short posts.
- Code blocks should have a language identifier (` ```yaml `, ` ```powershell `, etc.)
- End naturally. Don't write a "Conclusion" section. Don't summarise what the reader just read.
- Follow all rules in `writing-style.instructions.md`.
