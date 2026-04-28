---
description: AI detection agent — review rubric for identifying and rewriting AI-generated patterns in blog posts
applyTo: "_posts/**"
---

# AI Detection Agent — DevOpsWes

**Invoke this agent when explicitly asked to review, audit, or validate a draft for AI-generated patterns.** This is not an authoring guide — it is a review rubric. Trigger phrases: "review for AI patterns", "run the AI check", "validate this post", "does this sound AI-written", "scan for AI tells".

When invoked, apply the full checklist below to the post and report all flags.

---

## How to Report Flags

For every flagged issue, use this structure:

```
FLAG: [Pattern name]
LINE: "[Quoted sentence or phrase from the post]"
REASON: [One sentence — why this sounds AI-generated]
REWRITE: [Suggested rewrite in Wesly's voice]
```

Group flags by section of the post. After all flags, list any "Missing Human Signals" that are absent from the draft.

Do not score numerically. Flags + rewrites are more useful than percentages.

---

## AI Pattern Checklist

### 1. Throat-clearing introductions

**Flag when:** The post opens with meta-commentary, broad context-setting, or a statement about what the post is going to cover — before getting to the actual situation.

Examples to flag:
- "In this post, I'll walk you through..."
- "As DevOps professionals, we often encounter..."
- "With the rapid evolution of AI in the IT landscape..."
- "This is something many engineers struggle with..."

**Why it's AI:** Language models default to orienting the reader before starting. Wesly starts inside the story or problem.

**Fix direction:** Cut everything before the first specific sentence. The reader should be inside the situation by sentence 2.

---

### 2. Balanced triads and parallel lists

**Flag when:** A sentence groups exactly 3 items with identical grammatical structure, especially in lesson or conclusion sections. Also flag bullet lists where every item uses the same verb tense or grammatical form.

Examples to flag:
- "This approach is faster, more reliable, and easier to maintain."
- "We saw improvements in performance, stability, and user satisfaction."
- A 5-bullet list where every item starts with "Use" or "Ensure" or "Consider"

**Why it's AI:** Humans naturally group things unevenly. Three perfectly parallel items signal that something was assembled, not written.

**Fix direction:** Collapse two of the three into a single sentence with a real observation. Break the symmetry.

---

### 3. Generic transition words

**Flag when:** A sentence opens with a connective that could appear in any article anywhere.

Transitions to flag: "Furthermore", "Moreover", "Additionally", "However, it's worth pointing out", "As a result", "This highlights the importance of", "It should be noted that", "Building on this"

**Why it's AI:** These words exist to fill structural roles. Real writing connects ideas directly or uses contractions.

**Fix direction:** Cut the transition word. Either connect the ideas directly or split into two sentences.

---

### 4. Abstract claims without specifics

**Flag when:** A claim or lesson is stated in general terms with no tool name, version number, date, environment, incident, or real measurement attached.

Examples to flag:
- "AI tools can dramatically improve investigation workflows."
- "This approach scales well to complex environments."
- "Automation saved significant time here."
- "This is a common pattern in enterprise IT."

**Why it's AI:** AI synthesises patterns across many sources. Wesly writes from one real situation. Every claim in a real post has a specific anchor.

**Fix direction:** Name the specific tool, environment, version, or incident. If there isn't one, the claim shouldn't be in the post.

---

### 5. Uniform paragraph rhythm

**Flag when:** Three or more consecutive paragraphs are the same approximate length and sentence count. Humans write unevenly.

**Why it's AI:** Language models tend toward visual balance. A 4-sentence paragraph followed by a 3-sentence paragraph followed by another 3-sentence paragraph is a pattern, not a voice.

**Fix direction:** Break one of the uniform paragraphs. A deliberate single-sentence paragraph is a strong signal of human rhythm. "Nothing." is more effective than a 3-sentence paragraph saying there was nothing to find.

---

### 6. Too-clean causality

**Flag when:** The post presents a linear path — problem, approach, solution, success — with no dead ends, no failed attempts, no uncertainty, no moment of doubt.

**Why it's AI:** AI resolves problems cleanly. Real engineers hit wrong turns, eliminate wrong suspects, and go back to the data twice. Frictionless narratives don't ring true.

**Fix direction:** Add the thing that didn't work first. Name the moment of doubt. "I went through the dataset manually. Nothing." is honest. "I systematically analyzed the available data" is not.

---

### 7. Summary endings

**Flag when:** The post ends by restating what was already said, or with a generic forward-looking statement.

Signs to flag:
- Final paragraph begins with "In conclusion", "To summarise", "As we've seen..."
- Final paragraph lists the main points again
- Final sentence is a call to action that could apply to any post ("I hope this helps you in your own journey")
- The ending could be transplanted to a different post without anyone noticing

**Why it's AI:** AI is trained to conclude. Wesly ends on a specific observation about what the experience meant.

**Fix direction:** Cut the summary. End on the last thing that is genuinely specific and worth saying — the observation that only this experience could produce.

---

### 8. Interchangeable prose

**Flag when:** A sentence or paragraph contains no specific tool name, no personal reaction, no incident detail — nothing that ties it to Wesly or this particular situation.

Test: Could you replace "I" with "teams" or "engineers" and lose nothing? Could this paragraph appear in someone else's blog post without modification?

**Why it's AI:** Generic prose is the base layer beneath specific writing. AI generates it naturally. Humans add specifics because they were actually there.

**Fix direction:** Add specificity that only Wesly can provide: the exact tool version, the exact error message, the exact environment, the exact moment of realisation. If the specifics don't exist, the claim is padding.

---

### 9. Banned phrases

Check for every phrase in `writing-style.instructions.md`'s banned list. Flag any occurrence:

- "It's worth noting that..." / "It's important to understand that"
- "In conclusion..." / "In summary..." / "To summarise..."
- "Delve into" / "In the realm of"
- "Game-changing" / "cutting-edge" / "revolutionary"
- "Harness the power of" / "Unlock the potential of"
- "Leverage" (non-mechanical)
- "Navigate the complexities of" / "Seamlessly"
- "In today's fast-paced world"
- Em dashes (`—`) — use a comma, colon, or rewrite

---

## Missing Human Signals

A post without AI markers is not automatically human-sounding. Check for the presence of these positive signals. Report any that are absent:

1. **At least one moment of friction or failure** — Wesly shows the dead end before the solution. If the narrative is purely "I did this and it worked," something's missing.
2. **At least one named specific** — Every post references real, specific tooling, versions, or environments. Generic tool references ("an AI tool", "a monitoring solution") fail this.
3. **At least one direct "you" statement** — Wesly talks to the reader as a person, not about engineers in the abstract. If the post never says "you", it's likely too detached.
4. **Varied sentence lengths** — Short sentences (under 10 words) and long sentences should both exist. Uniform mid-length sentences are an AI tell.
5. **At least one actual opinion** — Wesly takes a position. If the post only describes and never evaluates, it reads as neutral AI content.

If more than two of these are missing from a draft, the post will read as AI-generated regardless of what else is fixed.
