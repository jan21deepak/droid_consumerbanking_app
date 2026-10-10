# Dependencies

Every direct dependency in `package.json`, the version actually installed in `node_modules/`, and its status relative to the planned Angular upgrade. Versions were read from `node_modules/<package>/package.json` at the time of writing; no registry lookups were made, so "latest" versions are not listed.

## Runtime dependencies

| Package | Declared | Installed | Status |
|---|---|---|---|
| `@angular/core` | `^14.2.0` | 14.3.0 | Angular 14 is past end of support. Upgrade target is the subject of gate G7 |
| `@angular/common` | `^14.2.0` | 14.3.0 | Same as core |
| `@angular/compiler` | `^14.2.0` | 14.3.0 | Same as core |
| `@angular/animations` | `^14.2.0` | 14.3.0 | Same as core |
| `@angular/forms` | `^14.2.0` | 14.3.0 | Same as core |
| `@angular/router` | `^14.2.0` | 14.3.0 | Same as core. `relativeLinkResolution` is removed in 15 |
| `@angular/platform-browser` | `^14.2.0` | 14.3.0 | Same as core |
| `@angular/platform-browser-dynamic` | `^14.2.0` | 14.3.0 | Same as core |
| `@angular/material` | `^14.2.7` | 14.2.7 | Legacy (non-MDC) components. The v15 MDC migration is gate G4 |
| `@angular/cdk` | `^14.2.7` | 14.2.7 | Moves with Material |
| `@angular/flex-layout` | `^14.0.0-beta.41` | 14.0.0-beta.41 | End-of-life, no release for Angular 16+. Gate G2 |
| `@fdp/market-widget` | `file:vendor/fdp-market-widget-3.4.2.tgz` | 3.4.2 | Vendor package, peers `@angular/core` and `@angular/common` `>=13.0.0 <15.0.0`. Commercial license, no patching. Gate G1 |
| `rxjs` | `~7.5.0` | 7.5.7 | `toPromise()` is deprecated in RxJS 7 and used in `projects/analytics-sdk/src/lib/analytics.service.ts` |
| `tslib` | `^2.3.0` | 2.8.1 | Current major |
| `zone.js` | `~0.11.4` | 0.11.8 | README target for the upgrade: 0.14 |

## Development dependencies

| Package | Declared | Installed | Status |
|---|---|---|---|
| `@angular/cli` | `~14.2.13` | 14.2.13 | Requires Node 16 (or 14.20+). Moves with Angular |
| `@angular-devkit/build-angular` | `^14.2.13` | 14.2.13 | Provides the `browser`, `ng-packagr`, `karma` and `dev-server` builders. README target: `application` builder |
| `@angular/compiler-cli` | `^14.2.0` | 14.3.0 | Moves with Angular |
| `ng-packagr` | `^14.2.0` | 14.2.2 | Builds `projects/ui` and `projects/analytics-sdk`. Moves with Angular |
| `typescript` | `~4.7.2` | 4.7.4 | README target: 5.4+ |
| `@types/node` | `^16.18.126` | 16.18.126 | Tied to Node 16. Gate G6 for a Node change |
| `@types/jasmine` | `~4.0.0` | 4.0.3 | |
| `jasmine-core` | `~4.3.0` | 4.3.0 | |
| `karma` | `~6.4.0` | 6.4.4 | Karma is deprecated upstream; Angular later added other test builders. Changing the runner is a test-config change (class A only if required) |
| `karma-chrome-launcher` | `~3.1.0` | 3.1.1 | Provides `ChromeHeadless` for the `ChromeHeadlessCI` launcher |
| `karma-coverage` | `~2.2.0` | 2.2.1 | Configured, not enforced |
| `karma-jasmine` | `~5.1.0` | 5.1.0 | |
| `karma-jasmine-html-reporter` | `~2.0.0` | 2.0.0 | |

## Workspace libraries

These are not in `package.json` dependencies. They resolve through `tsconfig.json` `paths` to `dist/`. See [packages](../packages/index.md).

| Package | Version (`projects/*/package.json`) | Peer dependencies | Owner |
|---|---|---|---|
| `@dbs-demo/ui` | 4.2.0 | `@angular/common`, `@angular/core`, `@angular/material`, `@angular/cdk` `^14.2.0` | `@dbs-demo/design-system` |
| `@dbs-demo/analytics-sdk` | 2.7.1 | `@angular/common`, `@angular/core`, `@angular/router` `^14.2.0` | `@dbs-demo/analytics-platform` |

Updating these internal `peerDependencies` ranges during an upgrade is class A per `docs/engineering/frontend-upgrade-policy.md`. A visual or API change to `@dbs-demo/ui` needs a major version bump under G4.

## Pinned transitive packages

Six transitive packages are pinned to older versions in `package-lock.json` because a corporate npm proxy blocked their newest releases. Installed versions match the pins:

| Package | Installed |
|---|---|
| `electron-to-chromium` | 1.5.441 |
| `caniuse-lite` | 1.0.30001814 |
| `regjsparser` | 0.13.3 |
| `@babel/helpers` | 7.28.4 |
| `@babel/traverse` | 7.29.8 |
| `@babel/helper-create-regexp-features-plugin` | 7.29.7 |

Background and the versions they replaced are in [pitfalls](../background/pitfalls.md).

## Platform

| Item | Value | Source |
|---|---|---|
| Node | 16 | `.nvmrc` |
| Node range | `>=14.20 <17` | `package.json` `engines` |
| Browsers | Latest Chrome and Firefox, last 2 Edge, Safari and iOS majors, Firefox ESR | `.browserslistrc` |

## Related pages

- [Upgrade gates](../background/upgrade-gates.md) for G1, G2, G4, G6 and G7.
- [Cleanup opportunities](../cleanup-opportunities.md) for deprecated API usage.
- [Configuration](configuration.md) for build and test config.
