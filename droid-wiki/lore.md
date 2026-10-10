# Lore

The workspace has a very short real history (two commits on one afternoon) and a much longer fictional one: the code is written to look like a retail-banking front end that has been sitting on Angular 14 for years. This page records both, plus the features that are deprecated but still in use.

## The fictional era: an Angular 14 enterprise app

The code describes itself as belonging to the "14-era". `README.md` says the legacy patterns "are intentional — they are what a real 14-era enterprise codebase looks like and what the upgrade must handle." The workspace version in `package.json` is `14.2.0`, matching the Angular version, and `engines.node` is pinned to `>=14.20 <17`.

The story the code tells:

- A retail team owns `digital-banking` (`src/`), with SSO, MFA step-up, accounts, transfers and bill pay ([features](features/index.md)).
- A design-system team publishes `@dbs-demo/ui` (`projects/ui/`) on top of legacy Angular Material, with SCSS overrides aimed at pre-MDC class names.
- An analytics-platform team ships `@dbs-demo/analytics-sdk` (`projects/analytics-sdk/`).
- A separate wealth team consumes the design system in `projects/wealth-portal/`, and its build "must not break".
- AppSec has reviewed the auth and HTTP code under ticket SEC-2291, so five files carry a `@security-reviewed` header.
- Procurement bought a commercial market-data widget, `@fdp/market-widget` 3.4.2, whose license forbids modification and whose peer range stops at Angular 14.

`docs/engineering/frontend-upgrade-policy.md` turns this story into seven decision gates (G1 to G7). See [upgrade gates](background/upgrade-gates.md).

## Real timeline

| Date | Commit | Event |
|---|---|---|
| 2026-10-09 15:12 (-0700) | `e513073` | "feat: add Angular 14 digital banking workspace". 115 files and 25,263 insertions, imported from `github.com/jan21deepak/banking_app_angular14`. The commit message notes that "All Cognition/Devin tooling and references removed for the Droid-based workflow", so the agent playbook that shipped with the source repo was stripped out. |
| 2026-10-09 15:16 (-0700) | `041fc80` | "refactor: rebrand bofa to dbs across the workspace". 41 files, 162 lines changed in each direction. Package scopes moved from `@bofa-demo/*` to `@dbs-demo/*`, classes and selectors became `DbsUiModule`, `DbsToastService`, `dbs-page-header`, SCSS tokens became `dbs-primary` and `dbs-navy`, and the workspace was renamed `dbs-digital-banking`. |
| 2026-10-09, uncommitted | working tree | Three local fixes made so the app runs in restricted environments (below). |

Both commits are co-authored by `factory-droid[bot]`. See [by the numbers](by-the-numbers.md) for activity figures.

### Uncommitted local fixes

These changes were in the working tree when this wiki was written and are not in `041fc80`:

| Change | Files | Why |
|---|---|---|
| Hash routing | `src/app/app-routing.module.ts` | `useHash: true` was added to `RouterModule.forRoot`. The added comment explains that some embedded browsers, such as the Factory desktop pane, fully reload on every `history.pushState`, which drops the in-memory SSO challenge between `/login` and `/mfa`. |
| Self-hosted icon font | `src/index.html`, `src/styles.scss`, `src/assets/fonts/material-icons.woff2`, and the same three under `projects/wealth-portal/src/` | The Google Fonts `<link>` was removed and an `@font-face` for `/assets/fonts/material-icons.woff2` was added, "so icons render where fonts.googleapis.com / fonts.gstatic.com are blocked". |
| Lockfile pins | `package-lock.json` | Six transitive packages were moved back one patch release because the newer versions were blocked by a corporate npm proxy: `@babel/helper-create-regexp-features-plugin` 7.29.10 to 7.29.7, `@babel/helpers` 7.29.10 to 7.28.4, `@babel/traverse` 7.29.10 to 7.29.8, `caniuse-lite` 1.0.30001815 to 1.0.30001814, `electron-to-chromium` 1.5.449 to 1.5.441, `regjsparser` 0.13.4 to 0.13.3. |

More on why these matter is in [pitfalls](background/pitfalls.md).

## Deprecated features still in use

The code keeps these on purpose. The upgrade policy says "Deprecated is not the same as removed": a deprecated API that still works on the target version stays and is listed as a follow-up.

| Feature | Where | Status |
|---|---|---|
| `@angular/flex-layout` (`fxLayout` and related directives) | `src/app/shell.component.ts`, `src/app/features/dashboard/dashboard.component.html`, `src/app/features/transfers/transfer.component.html` | End of life. Last release 15.0.0-beta.42, nothing for Angular 16+. Gate G2. |
| Legacy (pre-MDC) Angular Material class overrides | `projects/ui/src/lib/theme/_theme.scss`, `src/app/features/dashboard/dashboard.component.scss`, `projects/wealth-portal/src/styles.scss` | Legacy components were replaced by MDC in Material 15. Gate G4. |
| `mat-chip-list` | `src/app/features/dashboard/dashboard.component.html` | Removed with the legacy chips. |
| `mat.define-typography-config` | `projects/ui/src/lib/theme/_theme.scss` | Replaced by M2 typography levels. |
| `relativeLinkResolution: 'legacy'` | `src/app/app-routing.module.ts`, `projects/wealth-portal/src/app/app-routing.module.ts` | Removed in Angular 15. |
| `entryComponents` | `projects/ui/src/lib/ui.module.ts` | Unneeded since Ivy. The upgrade policy lists it as a removed option (class A). |
| `ComponentFactoryResolver` | `projects/ui/src/lib/services/toast.service.ts` | Deprecated in favour of `createComponent`. |
| `DATE_PIPE_DEFAULT_TIMEZONE` | `src/app/app.module.ts` | Replaced by `DATE_PIPE_DEFAULT_OPTIONS`. |
| `Observable.toPromise()` | `projects/analytics-sdk/src/lib/analytics.service.ts` | Deprecated in RxJS 7 in favour of `firstValueFrom` / `lastValueFrom`. |
| Class-based guards and resolvers (`CanActivate`, `CanLoad`, `Resolve`) | `src/app/core/auth/auth.guard.ts`, `src/app/core/auth/mfa.guard.ts`, `src/app/core/services/account.resolver.ts` | Deprecated in favour of functional guards. The auth guards are security-reviewed (gate G3). |

[Cleanup opportunities](cleanup-opportunities.md) lists what could be done about each one.
