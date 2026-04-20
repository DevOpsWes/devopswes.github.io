---
title: "How I used Copilot to find a VDI bug that left no errors in any log"
date: 2026-04-15
tags: [AI, DevOps, Automation, Virtual-Desktop-Environments]
excerpt: "The issue couldn't be reproduced. The logs showed nothing. No errors, no warnings, no obvious trail. Here's how I found it anyway."
---

{% include tldr.html text="A Citrix DaaS issue with no errors in any log. I used a ControlUp trigger to automatically capture 40 minutes of forensic data around each occurrence, then briefed Copilot to cross-reference it against a clean baseline with an explicit elimination step. The root cause was hiding in an informational event: two Azure auth module versions loaded simultaneously, neither failing. You wouldn't have found it reading logs by hand." %}

I want to tell you about the moment I stopped thinking of Copilot as a code assistant and started thinking of it as an investigator.

We had a problem in our Citrix Cloud DaaS environment that had been annoying people for weeks. Users would hit an issue, we couldn't figure out why, and we absolutely could not reproduce it on demand. It just happened. Randomly. Then stopped. Then happened again.

No error. No warning. Nothing obvious in any log we checked manually.

Here's how I eventually cracked it.

## The setup: ControlUp as a data trap

If you work with VDI environments and you're not using [ControlUp](https://www.controlup.com/), you should look at it. One of its more powerful features is the ability to create automated triggers that fire when something specific happens in the environment.

I set up a trigger to catch the exact Windows Event that was associated with the issue. The moment that event appeared on a machine, ControlUp would fire automatically and collect a forensic snapshot of the session. What I captured:

- Full Windows Event Viewer logs from both the Application and System channels
- A complete Windows system information dump
- All installed applications with their version numbers
- Registry keys for FSLogix profile configuration (HKCU and HKLM) and active Group Policy settings
- The FSLogix log files

The clever part: the snapshot wasn't just "right now." ControlUp captured 20 minutes of data *before* the trigger event fired, and 20 minutes *after*. So when it arrived, I had a 40-minute window of everything that happened on that machine around the exact moment the issue occurred.

That's a lot of data. Which turned out to be both the solution and the problem.

## The problem: too much data, and no error to chase

I went through the dataset manually. The Application log, the System log, the FSLogix logs. I knew roughly when the event happened, so I was looking for anything suspicious in the surrounding minutes.

Nothing.

No error events. No warnings that made sense. FSLogix was happy. Group Policy had applied cleanly. The system info looked normal. The installed applications looked normal.

This is the kind of situation that drives you a bit mad, because when there's genuinely nothing to chase, you start second-guessing whether you even have the right event, the right machine, or the right time window. It all looked fine, and that was the problem.

I also had a second dataset: a snapshot from a different machine where the trigger had *not* fired, collected at roughly the same time. A clean baseline to compare against.

## Giving Copilot an investigation brief

At this point I decided to try something I hadn't done before. Instead of using Copilot for code or documentation, I used it as a data analyst.

I opened both datasets in VS Code and wrote out an instruction set. Not a quick prompt, an actual structured brief describing exactly what I wanted it to do:

1. You are investigating a specific VDI issue that occurred at [timestamp]. The trigger event was [event ID and description].
2. Here is Dataset A: the affected machine. Here is Dataset B: a clean machine from the same environment at roughly the same time.
3. Correlate all data in Dataset A to the trigger event. Look for anything that is present in Dataset A but absent or different in Dataset B.
4. Generate a list of all possible causes you can identify.
5. For each possible cause, assess whether the other data in the dataset can rule it out. Remove it from the list if it can be confidently eliminated.
6. What's left after elimination is your prioritised suspect list.

The elimination step was deliberate. When you're debugging something with no obvious error trail, the instinct is to collect more suspects. What you actually need is to throw suspects *out* faster. Every eliminated cause is investigation time you don't have to spend.

## What Copilot found

It found it.

Buried in the XML data of an informational event (not an error, not a warning, *informational*) was a record showing that multiple versions of the same Azure authentication module were being loaded simultaneously. Two different versions of the same module, both active at the same time.

No error was generated because neither version *failed*. They were both loaded. Both running. The actual authentication wasn't broken. But somewhere downstream, the conflict between the two versions was causing the behaviour users were reporting, and the resulting errors looked like a completely different problem.

This is exactly the kind of thing you don't find manually because you're not looking for it. You're looking for something that *broke*. This didn't break. It just quietly did the wrong thing in the background, and the symptoms showed up somewhere else entirely.

The clean dataset confirmed it: the second machine had only one version of the module loaded. Case closed.

## What made this work

A few things came together here that are worth pulling apart if you want to try something similar.

**The data collection had to be automatic.** If I'd been trying to capture this manually after a report came in, the window would have been long gone. The ControlUp trigger meant the forensic data was already waiting for me when I needed it. Design your data capture for the moment you *won't* be there, not the moment you will.

**Two datasets are much better than one.** Giving Copilot a clean baseline to compare against completely changed what it could do. Without Dataset B, it would have had to guess what "normal" looked like. With it, differences jumped out immediately. If you're investigating something intermittent, always try to capture a "working" snapshot alongside the broken one.

**The instruction set mattered.** A vague prompt produces a vague answer. Writing out the investigation brief properly, with the elimination step explicitly included, is what produced something useful. Treat it like briefing a junior analyst who is very thorough but needs to be told exactly what you're after.

**Look at informational events.** I'll be honest: I would not have found this on my own, because I was filtering for errors and warnings. The root cause was hiding in an informational event that I'd have scrolled past without a second thought. If you're asking AI to investigate logs, tell it explicitly to include informational events in its analysis. The smoking gun might be there.

---

The issue is fixed now. One version of the module, configured consistently across the environment. Users haven't reported the problem since.

The part that stays with me is that there was genuinely no way to find this by reading logs the traditional way. Not because I wasn't looking hard enough. The signal simply wasn't visible at human reading speed, filtered through human assumptions about what an error looks like. The AI found it because it looked at everything, cross-referenced it all, and flagged something that shouldn't have been there, even though it wasn't causing an obvious failure.

That's a different category of useful from autocomplete.
