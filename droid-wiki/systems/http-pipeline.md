# HTTP pipeline

Every `HttpClient` call in `digital-banking` passes through a fixed chain of class-based interceptors: `AuthInterceptor` adds a correlation id and bearer token, `ErrorInterceptor` turns 401s into logouts and server failures into toasts, then the mock backend or the analytics timing interceptor runs. The auth and error interceptors are security-reviewed under SEC-2291.

Active contributors: Deepak Sekar

## Purpose

Apply the API gateway's header requirements and the app's global error behavior in one place, so feature services can call `HttpClient` directly without handling tokens or session expiry.

## Directory layout

```
src/app/core/
  core.module.ts             HttpClientModule + HTTP_INTERCEPTORS registrations
  http/
    auth.interceptor.ts      X-Correlation-Id, Authorization: Bearer
    error.interceptor.ts     401 -> logout, 5xx/0 -> toast
  mock/
    mock-backend.interceptor.ts   (see mock-backend.md)
projects/analytics-sdk/src/lib/
  analytics.module.ts        forRoot() registers AnalyticsTimingInterceptor
  timing.interceptor.ts      api_timing beacons
```

## Key abstractions

| Interceptor | File | Registered by | Behavior |
|---|---|---|---|
| `AuthInterceptor` | `src/app/core/http/auth.interceptor.ts` | `CoreModule` | Always sets `X-Correlation-Id: dbx-<Date.now()>-<n>` (`n` is a module-level counter). Sets `Authorization: Bearer <token>` only when `AuthService.token` is non-null and the URL starts with `/api/` but not `/api/sso/` |
| `ErrorInterceptor` | `src/app/core/http/error.interceptor.ts` | `CoreModule` | On `status === 401` for a non-`/api/sso/` URL: toast "Your session has expired. Please sign in again." and `AuthService.logout()`. On `status >= 500` or `status === 0`: toast "We are having trouble reaching our servers. Please try again." Always rethrows the error |
| `MockBackendInterceptor` | `src/app/core/mock/mock-backend.interceptor.ts` | `CoreModule`, only when `environment.useMockBackend` | Answers every `/api/` request itself and never calls `next` for those. See [Mock backend](mock-backend.md) |
| `AnalyticsTimingInterceptor` | `projects/analytics-sdk/src/lib/timing.interceptor.ts` | `AnalyticsModule.forRoot()` in `src/app/app.module.ts` | Skips URLs starting with the configured analytics endpoint. Otherwise, on an `HttpResponse`, tracks `api_timing` named `"<METHOD> <urlWithParams>"` with `{ status, ms }` |

## How it works

Angular runs `HTTP_INTERCEPTORS` in the order they are provided. `AppModule` imports `CoreModule` before `AnalyticsModule.forRoot(...)`, and `CoreModule` provides its interceptors in array order, so the request path is:

```mermaid
flowchart LR
  S["Feature service<br/>HttpClient.get/post"] --> A["1. AuthInterceptor<br/>+ X-Correlation-Id<br/>+ Authorization (non-SSO /api/)"]
  A --> E["2. ErrorInterceptor<br/>catchError: 401 -> logout<br/>5xx / 0 -> toast"]
  E --> M{"3. MockBackendInterceptor<br/>registered and URL starts with /api/?"}
  M -- yes --> R["Mock response or error<br/>(250 ms delay)"]
  M -- no --> T["4. AnalyticsTimingInterceptor<br/>api_timing {status, ms}"]
  T --> B["HttpXhrBackend"]
  R -. "response / error flows back up" .-> E
```

Responses and errors travel back up the chain in reverse, so `ErrorInterceptor` sees errors produced by the mock.

### Header rules

| Request URL | `X-Correlation-Id` | `Authorization` |
|---|---|---|
| `/api/sso/authorize`, `/api/sso/mfa/verify` | yes | never |
| Other `/api/...` while signed in and token unexpired | yes | `Bearer <accessToken>` |
| Other `/api/...` with no valid token | yes | none (the mock then returns 401) |
| Non-`/api/` URLs | yes | none |

`AuthService.token` returns `null` once `expiresAt` has passed. After the mock's 15-minute expiry, the next API call goes out without a bearer, the mock returns 401, and `ErrorInterceptor` logs the user out.

### Error rules

- 401 from SSO endpoints (wrong passcode or OTP) is passed through untouched, so the [sign-in](../features/sign-in.md) components can show their own messages.
- 401 elsewhere ends the session and redirects to `/login`. Note that `logout()` navigates to `/login` without a `returnUrl`.
- 400, 404 and 422 are not handled globally. Each feature handles them in its own `error` callback (see [Transfers](../features/transfers.md) and [Bill pay](../features/bill-pay.md)).
- `ProvidersService` catches its own errors and returns `null` or `[]`, but `ErrorInterceptor` runs first, so a 5xx from a provider endpoint would still show the server toast.

### Timing beacons and the mock

Because `MockBackendInterceptor` is registered before `AnalyticsTimingInterceptor` and does not call `next.handle()` for `/api/` URLs, the timing interceptor never sees mocked API calls. With the default configuration (`useMockBackend: true` in both environment files), `api_timing` events are therefore not produced for API requests. This follows from the provider order in `src/app/core/core.module.ts` and `src/app/app.module.ts`; it was not checked in a running browser. Analytics flushes (`POST /api/analytics` from `AnalyticsService.flush()`) go through `AuthInterceptor` and `ErrorInterceptor` like any other call and are answered by the mock with `{ accepted: true }`.

`HttpClientModule` also contributes Angular's built-in XSRF interceptor, which only acts when an XSRF cookie is present. The app sets no such cookie.

## Integration points

- `AuthService` (`src/app/core/auth/auth.service.ts`) supplies the token and the `logout()` used on 401. See [Sign-in](../features/sign-in.md).
- `DbsToastService` from [`@dbs-demo/ui`](../packages/ui.md) renders the error toasts.
- `AnalyticsService` from [`@dbs-demo/analytics-sdk`](../packages/analytics-sdk.md) receives timing events.
- Security context and review status: [Security](../security.md).

## Entry points for modification

- Both files in `src/app/core/http/` start with `// @security-reviewed SEC-2291 (2026-03-14, AppSec Consumer Apps)`. Under gate G3 in `docs/engineering/frontend-upgrade-policy.md`, only behavior-identical (class A) changes are allowed without a new AppSec review, and rewriting class interceptors as functional interceptors counts as needing review. CODEOWNERS routes `/src/app/core/http/` to AppSec and digital-banking-core. See [Upgrade gates](../background/upgrade-gates.md).
- To add an interceptor, add a provider to the `interceptors` array in `src/app/core/core.module.ts`. Position matters: anything placed after `MockBackendInterceptor` will not see `/api/` calls while the mock is on.
- To change toast wording, edit `src/app/core/http/error.interceptor.ts` (still a reviewed file).

## Key source files

| File | Purpose |
|---|---|
| `src/app/core/core.module.ts` | Interceptor registration and order |
| `src/app/core/http/auth.interceptor.ts` | Correlation id and bearer token |
| `src/app/core/http/error.interceptor.ts` | Global 401 and 5xx handling |
| `src/app/core/auth/auth.service.ts` | Token source and `logout()` |
| `src/app/app.module.ts` | `AnalyticsModule.forRoot()` config (`appId`, `endpoint`, `debug`) |
| `projects/analytics-sdk/src/lib/analytics.module.ts` | Registers the timing interceptor |
| `projects/analytics-sdk/src/lib/timing.interceptor.ts` | `api_timing` beacons |
