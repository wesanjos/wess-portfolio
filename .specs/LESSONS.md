# LESSONS - auto-maintained by scripts/lessons.py

> Machine-owned. Do NOT hand-edit. Changes are overwritten on the next `lessons.py` write.
> Canonical state lives in `.specs/lessons.json`. Edit lessons only via the script.
> promote_threshold=2 distinct features · window_days=45 · quarantine_threshold=2

## Confirmed (load these at Plan/Checks)

Corroborated across multiple features. Safe to apply as guidance.

_none_

## Candidates (under observation - do NOT load as guidance yet)

Seen once or not yet corroborated. Tracked, not trusted.

### L-001 - Verify link fragments and destination content as well as response status.
- signal: `ac_gap` · recurrence: 1 feature(s) · harmful: 0
- features: kanpai
- evidence: C4
- last seen: 2026-11-02T19:09:14Z

### L-002 - Assert the exact page title when metadata correctness is required.
- signal: `surviving_mutant` · recurrence: 1 feature(s) · harmful: 0
- features: kanpai
- evidence: C6
- last seen: 2026-11-02T19:09:24Z

### L-003 - Assert placement of children within grids, not only the container layout.
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `ui` · harmful: 0
- features: kanpai
- evidence: C7: grid-row span 2 -> span 1 (ui)
- last seen: 2026-11-02T19:39:54Z

### L-004 - Assert the order of sibling regions when a reference fixes their composition
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `ui` · harmful: 0
- features: kanpai
- evidence: src/components/kanpai/index.jsx:40-47 (ui)
- last seen: 2026-11-02T20:13:36Z

### L-005 - Verify keyboard traversal across every interactive control when the acceptance criterion requires it
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `ui` · harmful: 0
- features: kanpai
- evidence: plan.md AC13 (ui)
- last seen: 2026-11-02T20:13:36Z

### L-006 - Assert the direction of each layout region when the reference fixes its composition.
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `ui` · harmful: 0
- features: kanpai
- evidence: footer.html navigation flex-direction column -> row (ui)
- last seen: 2026-11-02T21:15:05Z

### L-007 - Bind layout assertions to the exact region described by the reference.
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `ui` · harmful: 0
- features: kanpai
- evidence: C7 (ui)
- last seen: 2026-11-02T21:15:05Z

### L-008 - Verify each reference layout region before treating a green browser suite as complete.
- signal: `gate_fail` · recurrence: 1 feature(s) · scope: `ui` · harmful: 0
- features: kanpai
- evidence: verification.md Gate (ui)
- last seen: 2026-11-02T21:15:05Z

### L-009 - Assert computed grid columns for each layout instance rather than relying on inline declarations.
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `ui` · harmful: 0
- features: kanpai
- evidence: tests/kanpai.spec.js:351 (ui)
- last seen: 2026-11-02T21:25:07Z

## Quarantined (failed when applied - ignore)

A confirmed lesson that recurred alongside failure. Kept for the maintainer to review.

_none_
