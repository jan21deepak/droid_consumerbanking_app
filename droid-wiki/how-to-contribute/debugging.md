# Debugging

Practical ways to see what the apps are doing and to fix the environment problems that come up most. Because every backend call is answered in the browser, most debugging happens in Chrome DevTools rather than in server logs.

## Ports

| Process | Port | Started by |
|---|---|---|
| `digital-banking` dev server | 4200 (Angular CLI default) | `npm start` |
| `wealth-portal` dev server | 4300 (`angular.json`, `serve.options.port`) | `npm run start:wealth` |
| Karma | 9876 (`karma.conf.js` and each project's Karma config) | `ng test` |

If `ng serve` reports the port is in use, stop the old dev server or pass `--port`.

## Analytics console output

The retail app configures the SDK with `debug: !environment.production` in `src/app/app.module.ts`. In development builds, `AnalyticsService.track()` in `projects/analytics-sdk/src/lib/analytics.service.ts` logs every event:

```
[analytics] {type: 'page_view', name: '/dashboard', timestamp: ..., props: undefined}
```

These use `console.debug`, so turn on the "Verbose" log level in the DevTools console to see them. You get a `page_view` on each `NavigationEnd`, an `interaction` for each `[anTrack]` click, and an `api_timing` event (method, URL, `status`, `ms`) for each successful HTTP response from `projects/analytics-sdk/src/lib/timing.interceptor.ts`. Failed requests and calls to the analytics endpoint itself produce no `api_timing` event. Props are shown after redaction, so `accountNumber`, `ssn`, `routingNumber`, `cardNumber`, `password` and `otp` appear as `[REDACTED]`. Queued events are flushed to `/api/analytics` every 10 seconds by default.

The wealth portal does not set `debug` (`projects/wealth-portal/src/app/app.module.ts`), so it logs nothing. It also has no mock backend, so its flush `POST /api/analytics` goes to the dev server and fails (typically with a 404). That error is expected in local runs. See [analytics SDK](../packages/analytics-sdk.md).

## The mock backend

`src/app/core/mock/mock-backend.interceptor.ts` answers every `/api/` request in the retail app after a 250 ms delay. Things to know when a request misbehaves:

- Requests never reach the network, so the DevTools Network tab does not show `/api/*` calls. Use the `[analytics]` `api_timing` events for successful calls, or set a breakpoint in `MockBackendInterceptor.route()`.
- It runs last in the interceptor chain (`src/app/core/core.module.ts`), so it sees the `Authorization` and `X-Correlation-Id` headers added by `AuthInterceptor`. Any non-SSO, non-analytics call without a bearer token gets a 401, and `ErrorInterceptor` then logs you out with "Your session has expired".
- Error codes: wrong credentials give 401 `invalid_credentials`, a wrong code gives 401 `invalid_otp`, transfers between the same or unknown accounts give 400 `invalid_accounts`, amounts above the available balance give 422 `insufficient_funds`, and unknown routes give 404 `not_found`.
- Balances and transactions live in memory. Transfers change them, and a page reload resets them to `src/app/core/mock/mock-data.ts`.
- Both `src/environments/environment.ts` and `src/environments/environment.prod.ts` set `useMockBackend: true`. Set it to `false` only if you have a real backend for `/api`, because there is no proxy config.

Full route table: [mock backend](../systems/mock-backend.md) and [API](../api.md).

## Sign-in and session state

Demo credentials (`DEMO_CREDENTIALS` in `src/app/core/mock/mock-backend.interceptor.ts`): user `demo`, password `Demo@1234`, one-time code `123456`.

- The SSO challenge from `/api/sso/authorize` is held in memory by `AuthService`. A full page reload between `/login` and `/mfa` loses it and `MfaGuard` sends you back to login. Hash routing (`useHash: true` in `src/app/app-routing.module.ts`) exists because some embedded browsers reload on every `pushState`.
- After MFA, the session is stored in `sessionStorage` under the key `dbx.session` (`src/app/core/auth/auth.service.ts`). Inspect it in DevTools under Application, Session Storage. It holds `accessToken`, `expiresAt` and `user`.
- The mock token expires after 15 minutes. `AuthService` treats an expired session as signed out.
- To force a sign-out, delete `dbx.session` and reload, or run `sessionStorage.removeItem('dbx.session')` in the console.

See [sign-in](../features/sign-in.md) and [security](../security.md).

## Environment problems

| Symptom | Likely cause | Fix |
|---|---|---|
| Angular CLI refuses to run or the build fails in odd ways | Node newer than 16 | Use Node 16 (`.nvmrc`). `engines.node` is `>=14.20 <17`. |
| `npm ci` fails with HTTP 403 on a Babel, `caniuse-lite`, `electron-to-chromium` or `regjsparser` tarball | A corporate npm proxy blocking freshly published versions | The lockfile in the working tree pins six packages one release back. Keep those pins, or ask for the proxy to allow the newer versions. See [pitfalls](../background/pitfalls.md). |
| "Cannot find module '@dbs-demo/ui'" or library changes not showing | `dist/ui` or `dist/analytics-sdk` missing or stale | `npm run build:libs`, then restart `ng serve`. |
| Icons render as words like "account_balance" | Material Icons font not loading | The font is self-hosted at `src/assets/fonts/material-icons.woff2` and `projects/wealth-portal/src/assets/fonts/material-icons.woff2`. Check that the file exists and that `@font-face` is in `src/styles.scss` or `projects/wealth-portal/src/styles.scss`. |
| `ng update` refuses Angular 15 | `@fdp/market-widget` peer range `>=13 <15` | Expected. This is gate G1; do not `--force`. See [upgrade gates](../background/upgrade-gates.md). |
| Karma: "No binary for ChromeHeadless browser" | Chrome not found | Set `CHROME_BIN` (see [testing](testing.md)). |

## Debugging tests

- Run one suite in watch mode with a visible browser: `npx ng test digital-banking`. Karma opens Chrome at port 9876, and the Debug button gives a page where DevTools breakpoints work in spec and source files.
- Focus a single spec temporarily with `fit` or `fdescribe`, but do not commit it.
