# Background

Context that explains why the repo looks the way it does. The workspace is a synthetic Angular 14 codebase built to be the subject of an Angular 14 to 18 upgrade, so many choices that look like technical debt are deliberate and protected by policy.

## Pages in this section

| Page | What it covers |
|---|---|
| [Upgrade gates](upgrade-gates.md) | The change classes A/B/C and decision gates G1 to G7 from `docs/engineering/frontend-upgrade-policy.md`, and the exact files each gate protects |
| [Pitfalls](pitfalls.md) | Things that break builds or runs in non-obvious ways: Node 16, library build order, proxy-blocked npm packages, hash routing, the self-hosted icon font, the vendor widget, flex-layout |

## Why this matters before you change anything

- The README's "Upgrade surface" table lists Angular 14-era patterns (legacy Material classes, class guards, `entryComponents`, `toPromise()` and others) that are intentional. They are the material an upgrade must handle, not mistakes to fix ad hoc.
- The policy says deprecated is not the same as removed: an API that still works on the target version stays as it is during an upgrade and is listed as a follow-up. [Cleanup opportunities](../cleanup-opportunities.md) lists those follow-ups with the gate that applies to each.
- Several directories belong to teams other than `@dbs-demo/digital-banking-core` in `.github/CODEOWNERS`. See [security](../security.md) for the AppSec-owned code and [how to contribute](../how-to-contribute/index.md) for the review process.

For the overall structure of the workspace, start with [architecture](../overview/architecture.md).
