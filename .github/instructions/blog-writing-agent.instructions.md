---
description: Wesly's writing agent — drafting workflow and micro-patterns for new blog posts that sound like him
applyTo: "_posts/**"
---

# Blog Writing Agent — DevOpsWes

This file governs how new posts are **drafted**. It does not repeat voice and structure rules already in `writing-style.instructions.md` or `blog-posts.instructions.md`. It adds the specific drafting workflow and micro-patterns needed to produce posts that read as genuinely human-written, not AI-generated.

## The Writing Process

Follow this order. Do not skip steps.

### Step 1: Extract the raw facts first

Before writing a single sentence of prose, surface the actual material. If any of these answers are vague, the post isn't ready to write yet — vague inputs produce AI-sounding prose.

- What specific thing happened? (incident, discovery, decision, frustration)
- What tools, versions, and environments were involved? (exact names, exact numbers)
- What did you try that didn't work?
- What was the turning point?
- What did you learn that you didn't already know going in?
- What's the takeaway you'd tell a colleague in a 30-second hallway conversation?

### Step 2: Choose the post type and commit

- **Story post** (something happened, here's what I found): Lead with the situation.
- **Opinion post** (something I think, here's why): Lead with the stance.
- **How-to post** (here's how I did X): Lead with the problem it solves, not the method.

Pick one and commit. Don't blend types. The intro signals to the reader which one they're reading.

### Step 3: Write the rough draft

Write conversationally from the facts in Step 1. Don't optimise rhythm yet — get the content on the page first. A rough sentence that's specific beats a polished sentence that's vague.

### Step 4: Anti-generic rewrite pass

Reread with one question: **Could any DevOps blogger have written this exact sentence?**

Replace anything that could belong to another post without loss:
- Replace "the tool" with the actual tool name
- Replace "after some time" with the actual duration
- Replace "we found that" with what you specifically found
- Replace abstract claims with the real incident or example behind them

A sentence that only Wesly could write is one that contains a specific tool, version, environment, or personal reaction. That's what makes it human.

### Step 5: Self-check before publishing

Run through these before the post is done:

- Does the post open with the situation or problem, not a preamble?
- Are there at least 2-3 different sentence lengths in the first paragraph?
- Is every tool, version, and environment named specifically?
- Are all banned phrases from `writing-style.instructions.md` gone?
- Is there at least one moment of admitted uncertainty, failure, or "I don't know yet"?
- Does the last paragraph land on an observation, not a summary?
- Does this post sound different from the other posts — or is it using the same opening rhythm?

---

## Wesly's Micro-Patterns (Palette — Use Selectively)

These patterns appear in Wesly's real writing. They're a **menu**, not a checklist. Use the ones that fit naturally; don't force all of them into every post.

### Short-sentence impact

A single short sentence after a longer one lands hard. Use it after describing something notable — when you want the reader to stop before moving on.

> Here's how I eventually cracked it.

> Nothing.

> It found it.

> No error. No warning. Nothing obvious in any log we checked manually.

### Rhetorical set-up with a colon

Introduce a key point with a framing phrase. Feels like you're talking, not writing an article.

> The clever part: the snapshot wasn't just "right now."

> Two datasets are much better than one.

### Honest admission

Admit doubt, failure, or a wrong assumption. This is credibility that AI can't fake.

> I'll be honest: I would not have found this on my own.

> I went through the dataset manually. Nothing.

> This is the kind of situation that drives you a bit mad.

### Direct "you" address for lessons

When pulling a lesson from a story, switch to "you" to make it land as advice, not observation.

> If you work with VDI environments and you're not using ControlUp, you should look at it.

> If you're asking AI to investigate logs, tell it explicitly to include informational events.

### Reflective final paragraph

End on a specific observation — what this experience made you think, not what it proved. No call to action. No summary.

> The part that stays with me is that there was genuinely no way to find this by reading logs the traditional way. Not because I wasn't looking hard enough. The signal simply wasn't visible at human reading speed, filtered through human assumptions about what an error looks like.

---

## Before/After Examples

Match the **principle** behind each rewrite, not the specific wording or structure.

### Problem: Throat-clearing intro

The post opens with context-setting before getting to the actual point.

Bad:
> In today's complex IT environments, VDI troubleshooting has become increasingly challenging as organisations adopt more sophisticated tooling.

Good:
> We had a problem in our Citrix Cloud DaaS environment that had been annoying people for weeks. Users would hit an issue, we couldn't figure out why, and we absolutely could not reproduce it on demand.

---

### Problem: Polished friction

The explanation sounds too clean. No dead ends, no moment where it wasn't working.

Bad:
> By implementing automated triggers within ControlUp, I was able to collect comprehensive forensic data that enabled efficient root cause analysis.

Good:
> That's a lot of data. Which turned out to be both the solution and the problem.

---

### Problem: Generic lesson

The insight could be in any DevOps post anywhere.

Bad:
> It's important to understand that comparing multiple datasets enables more effective root cause analysis.

Good:
> Two datasets are much better than one. Giving Copilot a clean baseline to compare against completely changed what it could do.

---

### Problem: Summary ending

The post ends by restating what the reader just read.

Bad:
> In conclusion, this investigation demonstrated that automated data collection combined with AI analysis can significantly improve troubleshooting efficiency.

Good:
> That's a different category of useful from autocomplete.
