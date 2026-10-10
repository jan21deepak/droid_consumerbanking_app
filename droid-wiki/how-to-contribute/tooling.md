# Tooling

The build and test toolchain is the stock Angular CLI 14 setup: the CLI and its builders, ng-packagr for the two libraries, and Karma with Jasmine for tests. There is no linter, formatter, end-to-end framework or git hook configured.

## What is installed

| Tool | Version (`package.json`) | Used for | Configured in |
|---|---|---|---|
| Node | 16 (`.nvmrc`), `engines.node` `>=14.20 <17` | Runtime for everything below | `.nvmrc`, `package.json` |
| Angular CLI (`@angular/cli`) | `~14.2.13` | `ng serve`, `ng build`, `ng test` | `angular.json` |
| `@angular-devkit/build-angular` | `^14.2.13` | The builders: `browser`, `dev-server`, `karma`, `ng-packagr`, `extract-i18n` | `angular.json` |
| `ng-packagr` | `^14.2.0` | Building `projects/ui` and `projects/analytics-sdk` into `dist/` in Angular Package Format | `projects/ui/ng-package.json`, `projects/analytics-sdk/ng-package.json` |
| TypeScript | `~4.7.2` | Compilation | `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json`, per-project tsconfigs |
| Karma | `~6.4.0` with `karma-chrome-launcher`, `karma-jasmine`, `karma-jasmine-html-reporter`, `karma-coverage` | Test runner | `karma.conf.js`, `projects/*/karma.conf.js` |
| Jasmine | `jasmine-core ~4.3.0`, `@types/jasmine ~4.0.0` | Test framework | Each project's `src/test.ts` |
| GitHub Actions | `actions/checkout@v4`, `actions/setup-node@v4` | CI | `.github/workflows/ci.yml` |
| EditorConfig | n/a | Editor settings | `.editorconfig` |

## Angular CLI workspace

`angular.json` defines four projects:

| Project | Type | Root | Build builder | Output |
|---|---|---|---|---|
| `ui` | library | `projects/ui` | `ng-packagr` | `dist/ui` |
| `analytics-sdk` | library | `projects/analytics-sdk` | `ng-packagr` | `dist/analytics-sdk` |
| `digital-banking` | application | workspace root, source in `src/` | `browser` | `dist/digital-banking` |
| `wealth-portal` | application | `projects/wealth-portal` | `browser` | `dist/wealth-portal` |

The retail app's production budgets are 1 MB warning and 2 MB error for the initial bundle, and 4 KB warning and 8 KB error per component style. All four projects use the `karma` builder for `ng test`, each with its own `src/test.ts` and Karma config. Details are in [configuration](../reference/configuration.md).

Order matters: libraries must be built before the apps, because `tsconfig.json` `paths` resolve `@dbs-demo/ui` and `@dbs-demo/analytics-sdk` to `dist/`. The npm scripts handle this:

| Script | Command |
|---|---|
| `build:libs` | `ng build ui && ng build analytics-sdk` |
| `prestart` | `npm run build:libs` (runs automatically before `start`) |
| `start` | `ng serve digital-banking` |
| `start:wealth` | `ng serve wealth-portal` |
| `build` | `npm run build:libs && ng build digital-banking && ng build wealth-portal` |
| `test` | `ng test` for `ui` and `analytics-sdk`, `npm run build:libs`, then `ng test` for `digital-banking` and `wealth-portal`, all with `--watch=false --browsers=ChromeHeadlessCI` |
| `verify` | `npm run build && npm test` |

## Editor settings

`.editorconfig` is the only style configuration: UTF-8, spaces, 2-space indent, final newline, trimmed trailing whitespace, and `quote_type = single` for `*.ts`. Markdown files keep trailing whitespace and have no line length limit. Follow the surrounding code for everything else; see [patterns and conventions](patterns-and-conventions.md).

## What is not set up

| Missing | Notes |
|---|---|
| Linter | No ESLint or TSLint config and no `lint` target in `angular.json`. |
| Formatter | No Prettier config. Only `.editorconfig`. |
| End-to-end tests | No Cypress, Playwright or Protractor. The upgrade policy's smoke test (login, MFA, dashboard, account detail, transfer, bill pay) is done by hand with screenshots. |
| Git hooks | No Husky, lint-staged or pre-commit config. |
| Dev-server proxy | No proxy.conf.json. The mock backend makes it unnecessary. |
| Coverage gate | `karma-coverage` is installed but not in the default reporters and has no thresholds. See [testing](testing.md). |

[Cleanup opportunities](../cleanup-opportunities.md) covers adding some of these. Dependency versions and their upgrade status are in [dependencies](../reference/dependencies.md).
