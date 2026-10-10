# Configuration

Every configuration file in the workspace and the values that matter. There are no runtime environment variables; all configuration is compiled in.

## Environment files

Angular environment files are swapped at build time by `fileReplacements` in the production configuration of `angular.json`.

### digital-banking

| Key | `src/environments/environment.ts` | `src/environments/environment.prod.ts` | Used by |
|---|---|---|---|
| `production` | `false` | `true` | `AnalyticsModule.forRoot({ debug: !environment.production })` in `src/app/app.module.ts` |
| `useMockBackend` | `true` | `true` | `src/app/core/core.module.ts` registers `MockBackendInterceptor` when true |
| `ssoUrl` | `'/api/sso'` | `'/api/sso'` | `src/app/core/auth/auth.service.ts` |
| `ssoClientId` | `'digital-banking-web'` | `'digital-banking-web'` | Sent in the authorize request body |
| `analyticsEndpoint` | `'/api/analytics'` | `'/api/analytics'` | `AnalyticsModule.forRoot({ endpoint })` |

To run against a real backend you would set `useMockBackend: false`; there is no proxy config (proxy.conf.json) in the repo, so `/api/*` calls would then go to the dev server origin. See [mock backend](../systems/mock-backend.md).

### wealth-portal

`projects/wealth-portal/src/environments/environment.ts` and `projects/wealth-portal/src/environments/environment.prod.ts` only define `production`.

## Analytics SDK config

`AnalyticsConfig` in `projects/analytics-sdk/src/lib/analytics.config.ts`, provided through the `ANALYTICS_CONFIG` injection token by `AnalyticsModule.forRoot()`:

| Field | Type | Default | digital-banking value |
|---|---|---|---|
| `appId` | `string` | required | `'digital-banking-web'` |
| `endpoint` | `string` | required | `environment.analyticsEndpoint` |
| `flushIntervalMs` | `number?` | `10000` | not set |
| `redactFields` | `string[]?` | appended to the built-in list | not set |
| `debug` | `boolean?` | off | `!environment.production` |

See [analytics SDK](../packages/analytics-sdk.md).

## angular.json

Workspace with `newProjectRoot: "projects"` and four projects.

| Project | Type | Root / sourceRoot | Prefix | Build builder | Output |
|---|---|---|---|---|---|
| `ui` | library | `projects/ui` / `projects/ui/src` | `dbs` | `@angular-devkit/build-angular:ng-packagr` (`projects/ui/ng-package.json`) | `dist/ui` |
| `analytics-sdk` | library | `projects/analytics-sdk` / `projects/analytics-sdk/src` | `an` | `@angular-devkit/build-angular:ng-packagr` (`projects/analytics-sdk/ng-package.json`) | `dist/analytics-sdk` |
| `digital-banking` | application | `""` / `src` | `app` | `@angular-devkit/build-angular:browser` | `dist/digital-banking` |
| `wealth-portal` | application | `projects/wealth-portal` / `projects/wealth-portal/src` | `wp` | `@angular-devkit/build-angular:browser` | `dist/wealth-portal` |

Application targets:

| Target | Details |
|---|---|
| `build` | Default configuration `production`. Production: budgets (initial 1 MB warn / 2 MB error; any component style 4 KB warn / 8 KB error), `fileReplacements` for the environment file, `outputHashing: "all"`. Development: no optimization or build optimizer, vendor chunk, source maps, named chunks |
| `serve` | `@angular-devkit/build-angular:dev-server`, default configuration `development`. `wealth-portal` sets `port: 4300`; `digital-banking` uses the default 4200 |
| `test` | `@angular-devkit/build-angular:karma` with the project's `karma.conf.js` and `tsconfig.spec.json` |
| `extract-i18n` | Present, unused |

Library targets are `build` (default `production`, which uses `projects/ui/tsconfig.lib.prod.json` or `projects/analytics-sdk/tsconfig.lib.prod.json`) and `test`. Neither project type has a `lint` or `e2e` target.

`projects/ui/ng-package.json` also copies `src/lib/theme/**/*.scss` into `dist/ui/theme`, which is how `src/styles.scss` and `projects/wealth-portal/src/styles.scss` can `@use` the design-system mixin.

## TypeScript configuration

| File | Purpose |
|---|---|
| `tsconfig.json` | Base config: `strict`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `target`/`module` `es2020`, `moduleResolution: node`, `importHelpers`. Angular options: `strictTemplates`, `strictInjectionParameters`, `strictInputAccessModifiers` |
| `tsconfig.app.json` | digital-banking app build (`src/main.ts`, `src/polyfills.ts`) |
| `tsconfig.spec.json` | digital-banking tests (`src/**/*.spec.ts`, Jasmine types) |
| `projects/ui/tsconfig.lib.json`, `projects/analytics-sdk/tsconfig.lib.json` | Library builds with declarations |
| `projects/ui/tsconfig.lib.prod.json`, `projects/analytics-sdk/tsconfig.lib.prod.json` | `compilationMode: "partial"` for publishable output |
| `projects/*/tsconfig.spec.json` | Library and wealth-portal tests |
| `projects/wealth-portal/tsconfig.app.json` | wealth-portal app build |

Path mapping in `tsconfig.json`:

```json
"paths": {
  "@dbs-demo/analytics-sdk": ["dist/analytics-sdk"],
  "@dbs-demo/ui": ["dist/ui"]
}
```

These point at build output, not source, so libraries must be built before apps. See [pitfalls](../background/pitfalls.md).

## Karma

`karma.conf.js` (digital-banking) and `projects/ui/karma.conf.js`, `projects/analytics-sdk/karma.conf.js`, `projects/wealth-portal/karma.conf.js`. The root file uses Jasmine, `karma-chrome-launcher`, `karma-jasmine-html-reporter` and `karma-coverage` (HTML and text-summary into `coverage/digital-banking`), port 9876, default browser `Chrome`, and defines a custom launcher:

```js
ChromeHeadlessCI: { base: 'ChromeHeadless', flags: ['--no-sandbox'] }
```

`npm test` passes `--watch=false --browsers=ChromeHeadlessCI` for each project. See [testing](../how-to-contribute/testing.md).

## Toolchain files

| File | Value |
|---|---|
| `.nvmrc` | `16` (read by CI) |
| `package.json` `engines.node` | `>=14.20 <17` |
| `.browserslistrc` | last 1 Chrome, last 1 Firefox, last 2 Edge major, last 2 Safari major, last 2 iOS major, Firefox ESR |
| `.editorconfig` | UTF-8, 2-space indent, final newline, trim trailing whitespace; single quotes for `.ts`; no line length limit and no trimming for `.md` |
| `.gitignore` | Ignores `/dist`, `/node_modules`, `/coverage`, `.angular/` and others |

## npm scripts

From `package.json`:

| Script | Command |
|---|---|
| `build:libs` | `ng build ui && ng build analytics-sdk` |
| `prestart` | `npm run build:libs` |
| `start` | `ng serve digital-banking` |
| `start:wealth` | `ng serve wealth-portal` |
| `build` | `npm run build:libs && ng build digital-banking && ng build wealth-portal` |
| `test` | `ng test ui`, `ng test analytics-sdk`, `npm run build:libs`, `ng test digital-banking`, `ng test wealth-portal`, each with `--watch=false --browsers=ChromeHeadlessCI` |
| `verify` | `npm run build && npm test` |

## Routing options

| File | Options |
|---|---|
| `src/app/app-routing.module.ts` | `useHash: true`, `relativeLinkResolution: 'legacy'`, `scrollPositionRestoration: 'enabled'` |
| `projects/wealth-portal/src/app/app-routing.module.ts` | `relativeLinkResolution: 'legacy'` |

## Key source files

| File | Role |
|---|---|
| `angular.json` | Projects, builders, targets |
| `tsconfig.json` | Compiler options and path mapping |
| `package.json` | Scripts, dependencies, engines |
| `karma.conf.js` | Test runner |
| `src/environments/environment.ts` | Dev environment |
| `projects/analytics-sdk/src/lib/analytics.config.ts` | Analytics config shape |
