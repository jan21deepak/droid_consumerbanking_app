# Contributing

How to pick up work in this workspace, get it reviewed, and know when it is done. Changes are reviewed by the team that owns the path in `.github/CODEOWNERS`, and nothing merges until `npm run verify` is green.

## Pages in this section

| Page | Covers |
|---|---|
| [Development workflow](development-workflow.md) | Branching, the local edit-build-test loop, opening a PR |
| [Testing](testing.md) | Running each project's Karma suite, how specs are written |
| [Debugging](debugging.md) | Analytics console output, the mock backend, session state, environment problems |
| [Tooling](tooling.md) | Angular CLI, ng-packagr, Karma and Jasmine, what is not set up |
| [Patterns and conventions](patterns-and-conventions.md) | Module structure, services, interceptors, styling rules |

New to the repo? Start with [getting started](../overview/getting-started.md).

## Picking up work

1. Find which project the change touches. The workspace has two apps and two libraries ([apps](../apps/index.md), [packages](../packages/index.md)).
2. Check who owns those paths in `.github/CODEOWNERS` (table below). Changes outside your team's paths need that team's review.
3. If the change is part of a framework or dependency upgrade, read `docs/engineering/frontend-upgrade-policy.md` first. It sorts changes into class A (mechanical), class B (needs a named approver before you make it) and class C (out of scope for the PR). See [upgrade gates](../background/upgrade-gates.md).

## Code review and ownership

`.github/CODEOWNERS` opens with "Branch protection requires an approving review from the owning team." The last matching rule wins, so a file in `projects/ui/` needs design-system approval, not digital-banking-core.

| Path | Owners |
|---|---|
| `*` (everything not matched below) | `@dbs-demo/digital-banking-core` |
| `/projects/ui/` | `@dbs-demo/design-system` |
| `/projects/analytics-sdk/` | `@dbs-demo/analytics-platform` |
| `/projects/wealth-portal/` | `@dbs-demo/wealth-frontend` |
| `/src/app/core/auth/` | `@dbs-demo/appsec` and `@dbs-demo/digital-banking-core` |
| `/src/app/core/http/` | `@dbs-demo/appsec` and `@dbs-demo/digital-banking-core` |
| `/vendor/` | `@dbs-demo/vendor-management` |
| `/.nvmrc` | `@dbs-demo/platform-engineering` |
| `/.github/workflows/` | `@dbs-demo/platform-engineering` |

Extra rules that apply on top of CODEOWNERS:

- Files with a `@security-reviewed SEC-2291` header (`src/app/core/auth/auth.guard.ts`, `src/app/core/auth/mfa.guard.ts`, `src/app/core/auth/auth.service.ts`, `src/app/core/http/auth.interceptor.ts`, `src/app/core/http/error.interceptor.ts`) may only take behavior-identical changes without a new AppSec review, and the PR must call them out (gate G3). See [security](../security.md).
- Changes to `@dbs-demo/ui` that alter its public API, SCSS mixin or rendered output need a major version bump and notice to the wealth-portal team (gate G4).
- In `projects/analytics-sdk/` and `projects/wealth-portal/`, upgrade work is limited to class A changes in a separate commit, with the owning team as reviewers (gate G5).
- Do not patch, fork or `--force` around `vendor/fdp-market-widget-3.4.2.tgz` (gate G1).

## Definition of done

A change is done when:

- `npm run verify` passes locally. It runs `npm run build` (both libraries, then `ng build digital-banking` and `ng build wealth-portal`) and then `npm test` (all four Karma suites).
- Both applications build. The wealth portal is a downstream consumer of `@dbs-demo/ui`; breaking its build counts as breaking the change.
- No tests were skipped or deleted to get there.
- The CI workflow `.github/workflows/ci.yml` is green on the PR.
- The required CODEOWNERS approvals are in.

Upgrade PRs need more evidence, listed in section 3 of `docs/engineering/frontend-upgrade-policy.md`: the `npm run verify` output, a smoke test of login, MFA, dashboard, account detail, transfer and bill pay with screenshots, a Decisions table for every gate touched, and a Deferred list. The policy also says "Upgrade PRs are merged by a human with the required CODEOWNERS approvals. Agents never merge."
