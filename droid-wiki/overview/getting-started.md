# Getting started

This page takes you from a fresh clone to both apps running locally, signed in, with tests passing. Everything runs in the browser against a mock backend, so no server or database is needed.

## Prerequisites

- **Node 16.** `.nvmrc` contains `16` and `package.json` declares `"engines": { "node": ">=14.20 <17" }`. Angular CLI 14 refuses newer Node versions. Homebrew no longer ships `node@16`; the official tarball from nodejs.org (for example `node-v16.20.2-darwin-arm64.tar.gz`) works.
- **npm registry access.** If your npm traffic goes through a corporate proxy, some freshly published packages pinned in `package-lock.json` may be rejected with HTTP 403. See [Pitfalls](../background/pitfalls.md) for how the lockfile was adjusted.
- **Chrome** for unit tests (Karma uses the `ChromeHeadlessCI` launcher).

## Install

```bash
npm ci
```

This installs about 970 packages, including the vendored `@fdp/market-widget` from `vendor/fdp-market-widget-3.4.2.tgz`.

## Run the apps

```bash
npm start              # builds both libraries, then serves digital-banking on http://localhost:4200
npm run start:wealth   # serves wealth-portal on http://localhost:4300
```

`npm start` runs `prestart`, which calls `build:libs` (`ng build ui && ng build analytics-sdk`). `start:wealth` does not rebuild the libraries, so start the retail app (or run `npm run build:libs`) first.

The retail app uses hash URLs. Opening `http://localhost:4200` redirects to `http://localhost:4200/#/login?returnUrl=%2Fdashboard`.

## Sign in

| Step | Value |
| --- | --- |
| Online ID | `demo` |
| Passcode | `Demo@1234` |
| One-time code | `123456` |

After the code is verified you land on the accounts overview. The session lasts 15 minutes and lives in `sessionStorage` (key `dbx.session`), so closing the tab signs you out. See [Sign-in](../features/sign-in.md).

## Build and test

```bash
npm run build    # libs, then ng build digital-banking and ng build wealth-portal
npm test         # Karma + Jasmine for ui, analytics-sdk, digital-banking, wealth-portal in turn
npm run verify   # build + test; this is what CI runs
```

To run one project's tests:

```bash
npx ng test digital-banking --watch=false --browsers=ChromeHeadlessCI
```

If Karma cannot find Chrome, set `CHROME_BIN` to your Chrome binary, for example `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"` on macOS. See [Testing](../how-to-contribute/testing.md).

## Next steps

- [Architecture](architecture.md) for how the pieces connect
- [Development workflow](../how-to-contribute/development-workflow.md) for the branch and PR cycle
- [Debugging](../how-to-contribute/debugging.md) when something does not load
