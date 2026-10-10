# Cleanup opportunities

Follow-up work found in the code, each tagged with the policy gate or owner that governs it. Most items are deliberate Angular 14-era patterns that the upgrade policy says must not be refactored opportunistically, so read [upgrade gates](background/upgrade-gates.md) before picking one up.

## How to read this page

`docs/engineering/frontend-upgrade-policy.md` separates three cases:

- An API removed on the target version is class A: fix it in the upgrade PR and list it.
- An API that is deprecated but still works on the target stays as it is and goes on the PR's Deferred list with an owner.
- Anything unrelated to the upgrade is class C and is not done in an upgrade PR.

The "Governed by" column below says who has to agree. Items in files owned by other teams (`.github/CODEOWNERS`) need that team's review regardless of class.

## Deprecated and removed Angular APIs

| Item | Where | What it becomes | Governed by |
|---|---|---|---|
| `relativeLinkResolution: 'legacy'` (option removed in Angular 15) | `src/app/app-routing.module.ts`, `projects/wealth-portal/src/app/app-routing.module.ts` | Delete the option | Class A. The wealth-portal copy is G5: separate commit, `@dbs-demo/wealth-frontend` reviews |
| `entryComponents: [DbsToastComponent]` | `projects/ui/src/lib/ui.module.ts` | Delete | Class A (named in the policy). Owned by `@dbs-demo/design-system` |
| `ComponentFactoryResolver` in `DbsToastService` | `projects/ui/src/lib/services/toast.service.ts` | `createComponent` / `ViewContainerRef` | Deprecated but still works; Deferred unless it stops compiling on the target. Design-system review |
| `toPromise()` in `AnalyticsService.flush()` | `projects/analytics-sdk/src/lib/analytics.service.ts` | `firstValueFrom` / `lastValueFrom` | Deprecated in RxJS 7, still works; Deferred. G5, `@dbs-demo/analytics-platform` |
| `DATE_PIPE_DEFAULT_TIMEZONE` (value `'-0500'`) | `src/app/app.module.ts` | `DATE_PIPE_DEFAULT_OPTIONS` with `{ timezone: '-0500' }` | Class A if removed on the target, otherwise Deferred |
| Class-based `AuthGuard` (`CanActivate`, `CanLoad`) and `MfaGuard` | `src/app/core/auth/auth.guard.ts`, `src/app/core/auth/mfa.guard.ts` | Functional guards, `canMatch` | G3. Optional on Angular 18 per the README; a rewrite invalidates AppSec review SEC-2291. See [security](security.md) |
| Class-based `AccountResolver` (`Resolve<Account>`) | `src/app/core/services/account.resolver.ts` | Functional `ResolveFn` | Not under G3 (outside `core/auth` and `core/http`), but still optional; Deferred |
| Class interceptors via `HTTP_INTERCEPTORS` and `HttpClientModule` | `src/app/core/core.module.ts`, `projects/analytics-sdk/src/lib/analytics.module.ts`, `src/app/core/http/*` | `provideHttpClient(withInterceptors(...))` | Optional. G3 for `src/app/core/http/*`, G5 for the analytics SDK |
| NgModule-based app, `*ngIf` / `*ngFor` | Everywhere | Standalone components, `@if` / `@for` | Class C for an upgrade PR |

## Material and styling

| Item | Where | Governed by |
|---|---|---|
| Legacy `.mat-*` overrides (`.mat-form-field-outline`, `.mat-raised-button`, `.mat-chip`, `.mat-tab-label-active`) and `dbs-design-system()` mixin | `projects/ui/src/lib/theme/_theme.scss` | G4: major version bump of `@dbs-demo/ui`, design-system owner + Chief Architect |
| `mat.define-typography-config` with v14 levels | `projects/ui/src/lib/theme/_theme.scss` | G4 |
| `mat-chip-list` and `::ng-deep .mat-chip...` override | `src/app/features/dashboard/dashboard.component.html`, `src/app/features/dashboard/dashboard.component.scss` | Tied to the MDC migration, so G4 |
| Legacy table overrides such as `.mat-row:hover` | `projects/wealth-portal/src/styles.scss` | G5, `@dbs-demo/wealth-frontend` |
| `fxLayout` / `fxFlex` directives and `FlexLayoutModule` | `src/app/shell.component.ts`, `src/app/features/dashboard/dashboard.component.html`, `src/app/features/transfers/transfer.component.html`, `src/app/shared/shared.module.ts` | G2, Chief Architect |

## The Bank of America rebrand, second pass

The repo was rebranded from "bofa" to "dbs" in commit `041fc80`. That pass renamed symbols, package scopes and prose, but four traces of the old brand survived it. A second branding pass replaced them:

| Item | Where | Replaced with |
|---|---|---|
| Page header eyebrow `"Merrill Edge (demo)"`, which renders as "MERRILL EDGE (DEMO)" because the eyebrow style uses `text-transform: uppercase` | `projects/wealth-portal/src/app/holdings.component.ts` | `"DBS Wealth (demo)"` |
| Holding with ticker `BAC` (Bank of America's NYSE symbol) named `"DBS Corp"` | `projects/wealth-portal/src/app/holdings.component.ts` | `D05` / `"DBS Group Holdings"` |
| Mock account names `Advantage Plus Checking`, `Advantage Savings` and `Customized Cash Rewards Visa` (Bank of America product names) plus routing number `026009593` | `src/app/core/mock/mock-data.ts` | `Everyday Checking`, `Smart Saver Savings`, `Cashback Rewards Visa`, routing number `099100128` |
| Brand colors `#012169` (navy) and `#e31837` (red), which match Bank of America's palette | `projects/ui/src/lib/theme/_theme.scss`, `projects/ui/src/lib/components/toast.component.ts`, `projects/ui/src/lib/components/alert-banner.component.ts`, `projects/ui/src/lib/components/page-header.component.ts`, `projects/ui/src/lib/components/account-tile.component.ts`, `src/app/shell.component.ts`, `src/styles.scss`, `projects/wealth-portal/src/styles.scss` | graphite `#1a1a1a` primary and DBS red `#ec1c24` accent |

The routing number `099100128` is synthetic: the `09` prefix is reserved for testing, and the digits satisfy the ABA check-digit rule so the field looks realistic. The wealth-portal strings are owned by `@dbs-demo/wealth-frontend`; colors in `projects/ui` are a visual change under gate G4, so retuning them again is still a class B or C change for an upgrade PR. The mock data falls under the default owner `@dbs-demo/digital-banking-core`. The product-name, ticker and routing-number matches were observations from public knowledge, not something the repo documents.

## Missing tooling

| Gap | Current state |
|---|---|
| Linter | No ESLint or TSLint config or dependency. `angular.json` has no `lint` target |
| Formatter | Only `.editorconfig` (2-space indent, single quotes in `.ts`); no Prettier |
| End-to-end tests | None. The policy's required smoke test (login, MFA, dashboard, account detail, transfer, bill pay) is manual. `data-test` attributes exist in templates and could anchor future e2e tests |
| Pre-commit hooks | No Husky, lint-staged or similar |
| Coverage gate | `karma-coverage` is configured in `karma.conf.js` but no threshold is enforced and CI does not publish reports |

Adding any of these touches `package.json` and possibly `.github/workflows/` (Platform Engineering, G6 if it changes shared CI). They are class C relative to an upgrade. See [tooling](how-to-contribute/tooling.md) and [testing](how-to-contribute/testing.md).

## Smaller observations

- `src/environments/environment.prod.ts` keeps `useMockBackend: true`, so production bundles include the mock backend and `DEMO_CREDENTIALS`. Intentional for the demo; see [deployment](deployment.md).
- `AnalyticsService.scrub()` only checks top-level property keys and does not touch event names, which contain URLs. Changing it is G5. See [security](security.md).
- `npm run start:wealth` has no `prestart`-style hook, so it relies on libraries already being built. See [pitfalls](background/pitfalls.md).

## TODO / FIXME scan

A search for `TODO`, `FIXME`, `HACK` and `XXX` across `src/`, `projects/`, `docs/`, root config files and `.github/` (excluding `node_modules/`, `dist/` and `.angular/`) found no markers in source. The only matches were base64 integrity hashes in `package-lock.json`.

## Outdated dependencies

Every Angular package is on 14.x (`@angular/core` 14.3.0 installed), with TypeScript 4.7.4, zone.js 0.11.8 and RxJS 7.5.7. The README lists the toolchain targets for the upgrade: TypeScript 5.4+, zone.js 0.14, Node 18.19+/20, and the `application` builder in place of `browser`. The full table with versions is in [dependencies](reference/dependencies.md).
