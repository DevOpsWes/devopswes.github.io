---
title: "What AI is actually doing to DevOps right now (from someone using it daily)"
date: 2026-04-15
tags: [AI, DevOps, Automation]
excerpt: "Not the conference-talk version. The version where some of it works, some of it doesn't, and all of it is worth knowing about."
---

Everyone's talking about AI transforming DevOps. Most of that conversation is happening at a level of abstraction that isn't useful if you're trying to actually ship something. So here's what I'm seeing from where I sit — someone who works in Azure DevOps pipelines, Terraform, and Citrix automation day to day.

Some of this I've built. Some of it I've tested. Some of it I read about and found interesting enough to write down. I'll try to be clear about which is which.

## The on-call problem is where AI earns its keep first

If you've ever been on-call, you know the real pain isn't getting paged. It's the 45 minutes of staring at logs trying to figure out what actually happened before you can fix anything.

I've been experimenting with Ollama + Grafana Loki for exactly this. You point a local model at your aggregated logs when an alert fires, and you get a plain-language summary before you've even opened your second terminal window. It's not perfect — it misses context it can't see — but it cuts the "what am I even looking at" phase down significantly.

The model doesn't fix anything. It just tells you where to look. That's enough to be genuinely useful.

## Code review, but make it less embarrassing

I'm not suggesting AI replaces your team's code review. But there's a category of mistake that gets through purely because humans are tired, distracted, or too polite to say "this doesn't match what the PR says it does."

Running a diff through a local model as a first pass catches that stuff. The kind of thing where the PR title says "fix null check" and the diff also silently removes an error handler. You catch it before your colleagues do. Your dignity remains intact.

```yaml
# rough version of what this looks like in a pipeline
- name: AI first-pass review
  run: |
    git diff origin/main | \
    ollama run codellama "Review this diff. Flag bugs, missing error handling, and anything that looks unintentional. Be brief."
```

It's not a replacement for review. It's a spell-checker for logic.

## Natural language queries into your infrastructure

This one felt like a gimmick until I actually used it with non-technical colleagues.

"How many VMs are running in production right now?" is a normal question that currently requires knowing specific CLI syntax, having the right permissions configured, and being in the right terminal context. Wiring a read-only service principal to an LLM means you can answer that question in plain English — and so can the person asking it.

For a VDI environment like mine, where you're constantly fielding "how many sessions are active on which pools right now," this is actually practical. Not just cool.

## Automated runbooks — but carefully

Every team has runbooks. Nobody actually follows them properly when something is on fire.

The pattern I find interesting: structured runbooks in YAML with explicit steps and preconditions, with an AI agent that can execute the safe/reversible ones automatically and escalate when it hits anything destructive. The key word is *automatically* — not for the dangerous stuff, only for the steps that are safe to run without a human in the loop.

I'm still working through how much to trust this in production. The concept is sound. The devil is in defining what counts as "safe."

## Documentation that actually gets written

I'll be honest: this is the one I care about most personally, because I have a long history of promising to document things and then not doing it.

The idea is simple. When a PR changes something that's documented, a GitHub Action notices and drafts the updated documentation as a comment. You review, approve, and the docs stay current without anyone having to remember to do it.

In practice it works better for some types of documentation than others — API references, config options, that kind of thing. Prose explanations need more human input. But "better than nothing" is a very achievable bar.

---

None of this is magic. All of it requires thought about where you put humans in the loop and where you don't. But the underlying shift is real: there are things that used to require a specialist's full attention that now just need their review. That's where the actual change is happening.

Not replacement. Redistribution of attention.
