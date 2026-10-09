# Frontend framework upgrade policy

Applies to every framework or dependency upgrade in this workspace, whether a person or an agent does it.
Owner: Chief Architect's office. Security sign-offs: AppSec (Consumer Applications).

## 1. Change classes

| Class | What it covers | Who decides |
|---|---|---|
| **A: Mechanical** | Changes the framework requires in order to compile or run, with no change in behavior: `ng update` schematics, removed options (`relativeLinkResolution`, `entryComponents`), renamed tokens or APIs, TypeScript/zone.js bumps, test-config changes, internal `peerDependencies` ranges | The engineer/agent doing the upgrade. List them in the PR. |
| **B: Judgment** | Anything below under *Decision gates*, i.e. changes involving a trade-off, another team's code, a contract or security sign-off | **The named approver, before the change is made.** Put the options and a recommendation in the plan. |
| **C: Out of scope** | Unrelated refactors, new features, "while I'm here" clean-ups, style-only rewrites | Not done in an upgrade PR. Note it as a follow-up. |

Deprecated is not the same as removed. A deprecated API that still works on the target version stays as it is
(class A doesn't cover it). List it as a follow-up and don't refactor it inside the upgrade.

## 2. Decision gates (class B)

| # | Gate | Where it applies today | Approver |
|---|---|---|---|
| G1 | **Third-party package outside its vendor-supported range.** Never patch, fork or `--force`/`--legacy-peer-deps` around a vendor package. | `@fdp/market-widget` 3.4.2 (`vendor/`) supports Angular 13–14 only. Running it on 15+ voids the vendor SLA (MSA §7.3). | Vendor Management + AppSec |
| G2 | **Dependency deprecated with no supported successor.** | `@angular/flex-layout` is end-of-life (last release 15.0.0-beta.42; nothing for 16+). Used in the shell and feature templates. | Chief Architect |
| G3 | **Security-reviewed code** (files with a `@security-reviewed` header). Class A changes are allowed if behavior is identical, and the PR must call them out. Anything beyond that, including class→functional guard/interceptor rewrites, needs a new AppSec review. | `src/app/core/auth/*`, `src/app/core/http/*` (review SEC-2291) | AppSec |
| G4 | **Shared-library public API or visual change.** Anything that changes a downstream team's build, import, SCSS mixin or rendered UI. This requires a major version bump of the library and notice to consumers. | `@bofa-demo/ui` theme (`bofa-design-system()` mixin, legacy `.mat-*` overrides). The Material 15 MDC migration changes density, DOM and class names. | Design-system owner + Chief Architect |
| G5 | **Code owned by another team** (see `.github/CODEOWNERS`). Class A changes only, in a separate commit, with the owning team requested as reviewers. | `projects/analytics-sdk` (analytics-platform), `projects/wealth-portal` (wealth-frontend) | Owning team |
| G6 | **Toolchain or platform change** that affects shared build infrastructure. | Node 16 → 18/20 (Angular 16+ requires 16.14+/18.x; 17+ requires 18.13+). CI runners and base images are owned by Platform Engineering. | Platform Engineering |
| G7 | **Target version.** The upgrade must end on a version that is supported on the date it ships. | The ticket says Angular 18, but 18's LTS ended Nov 2025. | VP Engineering + Chief Architect |

## 3. Required evidence in every upgrade PR
- `npm run verify` output: every library and application builds, and all tests pass (no skipped or deleted tests).
- A smoke test of login → MFA → dashboard → account detail → transfer → bill pay, with screenshots.
- A **Decisions** table: each gate the PR touched, the option taken, and who approved it.
- A **Deferred** list: deprecated-but-working APIs and class C items, each with an owner.

Upgrade PRs are merged by a human with the required CODEOWNERS approvals. Agents never merge.
