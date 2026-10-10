# Pitfalls

Known traps that break installs, builds or the running app in ways that are not obvious from the error message. Several of them are local workarounds that were uncommitted when this wiki was written, so check `git status` before assuming they are in `main`.

## Node 16 is required

Angular CLI 14 (`@angular/cli` `~14.2.13`) does not support Node 18+. `.nvmrc` pins `16` and `package.json` sets `"engines": { "node": ">=14.20 <17" }`. CI reads the version from `.nvmrc` through `actions/setup-node`.

- Run `nvm use` (or equivalent) before `npm ci`. On a newer Node, expect engine warnings at install and CLI errors at build time.
- Moving to Node 18/20 is gate G6 and needs Platform Engineering, who own `.nvmrc` and `.github/workflows/` in `.github/CODEOWNERS`. Do not bump it as part of an unrelated change. See [upgrade gates](upgrade-gates.md).

## Libraries must be built before the apps

`tsconfig.json` maps `@dbs-demo/ui` to `dist/ui` and `@dbs-demo/analytics-sdk` to `dist/analytics-sdk`. The apps import the compiled ng-packagr output, not the library sources.

- A fresh clone, or any change under `projects/ui/` or `projects/analytics-sdk/`, needs `npm run build:libs` before `ng serve`, `ng build` or `ng test` on an app picks it up.
- `npm start` has a `prestart` hook that builds the libraries, but `npm run start:wealth` does not. Start `digital-banking` first, or run `npm run build:libs` yourself.
- `npm test` runs `build:libs` between the library tests and the app tests for the same reason.
- Without a build, the TypeScript compiler cannot resolve the `@dbs-demo/*` imports. With an old build, the app silently runs the previous library code. See [packages](../packages/index.md).

## Corporate npm proxy blocked freshly published packages

In the environment where this wiki was produced, a corporate npm proxy refused six transitive packages whose newest versions had been published very recently. `npm ci` failed until `package-lock.json` was edited to pin each to the previous version:

| Package | Locked before | Pinned to |
|---|---|---|
| `electron-to-chromium` | `1.5.449` | `1.5.441` |
| `caniuse-lite` | `1.0.30001815` | `1.0.30001814` |
| `regjsparser` | `0.13.4` | `0.13.3` |
| `@babel/helpers` | `7.29.10` | `7.28.4` |
| `@babel/traverse` | `7.29.10` | `7.29.8` |
| `@babel/helper-create-regexp-features-plugin` | `7.29.10` | `7.29.7` |

The "before" column comes from `git diff package-lock.json`; the installed versions in `node_modules/` match the pinned column. If you regenerate the lockfile (for example with `npm install` or `npm update`), these pins are lost and the install can fail again behind the same proxy. The change is local, not committed, at the time of writing.

## Hash routing exists because of the Factory desktop browser pane

`src/app/app-routing.module.ts` uses `RouterModule.forRoot(routes, { useHash: true, ... })`, so URLs look like `http://localhost:4200/#/dashboard`. The comment in the file explains why: some embedded browsers, including the Factory desktop pane, do a full reload on every `history.pushState`. The SSO challenge from `/api/sso/authorize` is held only in memory in `src/app/core/auth/auth.service.ts`, so a reload between `/login` and `/mfa` loses it and `MfaGuard` sends the user back to `/login`.

- Do not remove `useHash` unless you have confirmed every target browser keeps the page alive on navigation.
- Do not "fix" this by persisting the challenge to storage. That changes behavior in a `@security-reviewed SEC-2291` file and falls under gate G3. See [security](../security.md).
- `wealth-portal` does not use hash routing.

## Material Icons font is self-hosted

The Google Fonts `<link>` was removed from `src/index.html` and `projects/wealth-portal/src/index.html` because `fonts.googleapis.com` and `fonts.gstatic.com` were blocked in some environments, which made each `mat-icon` render as its ligature text (for example the word "account_balance" in the toolbar of `src/app/shell.component.ts`). Each app now declares an `@font-face` for `Material Icons` in `src/styles.scss` or `projects/wealth-portal/src/styles.scss`, pointing at:

- `src/assets/fonts/material-icons.woff2`
- `projects/wealth-portal/src/assets/fonts/material-icons.woff2`

Keep both copies if you move assets, and keep the `.material-icons` class rules next to the `@font-face`. These files were untracked at the time of writing.

## The vendor widget cannot be patched or upgraded locally

`@fdp/market-widget` 3.4.2 is installed from `vendor/fdp-market-widget-3.4.2.tgz` and used in `src/app/features/dashboard/dashboard.module.ts` and `src/app/features/dashboard/dashboard.component.html` (`<fdp-market-ticker>`). Its `peerDependencies` are `@angular/core` and `@angular/common` `>=13.0.0 <15.0.0`.

- `ng update` to Angular 15 fails on that peer range.
- `node_modules/@fdp/market-widget/README.md` says running it on an unsupported Angular version voids the SLA (MSA section 7.3) and forbids modifying, patching or forking it (MSA section 4.1). `node_modules/@fdp/market-widget/LICENSE.md` prohibits redistribution, modification and reverse engineering.
- So `--force`, `--legacy-peer-deps`, `patch-package` or editing files in `node_modules/` are all off the table. This is gate G1 (Vendor Management + AppSec).

## flex-layout is end-of-life

`@angular/flex-layout` (`14.0.0-beta.41` installed) has no release for Angular 16+. The `fxLayout`, `fxLayoutAlign`, `fxLayoutGap` and `fxFlex` directives appear in `src/app/shell.component.ts`, `src/app/features/dashboard/dashboard.component.html` and `src/app/features/transfers/transfer.component.html`, and `FlexLayoutModule` is re-exported from `src/app/shared/shared.module.ts`. Replacing them with CSS is a scope decision under gate G2 (Chief Architect), not a mechanical fix. Avoid adding new `fx*` usages.

## Related pages

- [Getting started](../overview/getting-started.md) for the normal setup path.
- [Debugging](../how-to-contribute/debugging.md) for diagnosing failures.
- [Dependencies](../reference/dependencies.md) for the full version table.

## Key source files

| File | Pitfall |
|---|---|
| `.nvmrc`, `package.json` | Node 16 requirement |
| `tsconfig.json` | `dist/` path mapping |
| `package-lock.json` | Proxy pins |
| `src/app/app-routing.module.ts` | Hash routing |
| `src/styles.scss`, `projects/wealth-portal/src/styles.scss` | Self-hosted icon font |
| `vendor/fdp-market-widget-3.4.2.tgz` | Vendor widget |
| `src/app/shared/shared.module.ts` | `FlexLayoutModule` export |
