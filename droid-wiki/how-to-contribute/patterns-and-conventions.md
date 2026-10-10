# Patterns and conventions

The code follows Angular 14 NgModule conventions throughout. Several of these patterns are deliberate upgrade targets, so match them when you add code inside the current major version and do not modernize them outside an approved upgrade.

## Module structure

- One root module (`src/app/app.module.ts`) and one `CoreModule` (`src/app/core/core.module.ts`) for singletons. `CoreModule`'s constructor throws if it is imported twice.
- Each feature is a lazy-loaded NgModule under `src/app/features/<feature>/` with its own `RouterModule.forChild([...])`, for example `src/app/features/accounts/accounts.module.ts`.
- Feature modules import `SharedModule` (`src/app/shared/shared.module.ts`) instead of listing Material modules individually. Add a new Material module there once, not in each feature.
- Libraries expose one NgModule each: `DbsUiModule` (`projects/ui/src/lib/ui.module.ts`) and `AnalyticsModule` (`projects/analytics-sdk/src/lib/analytics.module.ts`). Only the root module calls `AnalyticsModule.forRoot()`; feature modules import plain `AnalyticsModule` to get the `[anTrack]` directive without a second service instance.

## Routing and guards

- Routes are declared in `src/app/app-routing.module.ts` with `loadChildren` dynamic imports.
- Protected routes set both `canLoad: [AuthGuard]` and `canActivate: [AuthGuard]`.
- Guards and resolvers are classes (`implements CanActivate`, `CanLoad`, `Resolve`), for example `src/app/core/services/account.resolver.ts`. Functional guards are an optional Angular 15+ change and the auth guards are security-reviewed, so do not convert them ([Upgrade gates](../background/upgrade-gates.md), gate G3).
- Navigation uses hash URLs (`useHash: true`). Build links with `routerLink` or `Router.navigate`, never by assigning `window.location`, so the hash strategy keeps working.

## Services and data

- Services are `@Injectable({ providedIn: 'root' })` and return `Observable`s from `HttpClient`. See `src/app/core/services/accounts.service.ts`.
- URLs are relative `/api/...` paths. The mock backend recognizes only exact paths, so a new endpoint needs a matching branch in `src/app/core/mock/mock-backend.interceptor.ts` ([Mock backend](../systems/mock-backend.md)).
- Shared types live in `src/app/core/models.ts`. Add new response types there.
- Third-party provider calls degrade quietly: `ProvidersService` (`src/app/core/services/providers.service.ts`) uses `catchError(() => of(null))` or `of([])` so a provider outage hides a card instead of breaking the dashboard.

## Forms

- Reactive forms built with `FormBuilder`, with Angular's typed forms (`this.fb.group({...})`). Example: `src/app/features/transfers/transfer.component.ts`.
- Cross-field rules are group validators in their own file with a spec, for example `transferValidator` in `src/app/features/transfers/transfer.validators.ts`.
- On submit, an invalid form calls `markAllAsTouched()` and returns, so `<mat-error>` messages appear.

## HTTP cross-cutting concerns

All cross-cutting HTTP behavior lives in interceptors registered in `CoreModule`, not in services. Auth headers and correlation ids are added in `src/app/core/http/auth.interceptor.ts`; 401 and 5xx handling is in `src/app/core/http/error.interceptor.ts`. See [HTTP pipeline](../systems/http-pipeline.md).

## Security-reviewed files

Files under `src/app/core/auth/` and `src/app/core/http/` start with:

```ts
// @security-reviewed SEC-2291 (2026-03-14, AppSec Consumer Apps). Behavior changes need a new review: docs/engineering/frontend-upgrade-policy.md (G3).
```

Keep the header. Mechanical changes are allowed if behavior is identical and the PR calls them out; anything else needs AppSec ([Security](../security.md)).

## Analytics and PII

- Track clicks declaratively with `anTrack="event_name"` on the element, as on the Sign in button in `src/app/features/auth/login.component.ts`.
- Track outcomes imperatively with `AnalyticsService.track()`, as `TransferComponent` does for `transfer_completed`.
- Never rely on yourself to strip PII. Pass props with the standard key names (`accountNumber`, `cardNumber`, and so on) so `scrub()` redacts them, or add the key to `redactFields` in the `forRoot()` config.

## UI and styling

- Use the design-system components (`dbs-page-header`, `dbs-account-tile`, `dbs-alert-banner`, `DbsToastService`) and pipes (`dbsAmount`, `dbsMask`) from `@dbs-demo/ui` before writing new markup ([UI library](../packages/ui.md)).
- Global styling comes from the `dbs-design-system()` mixin, included at the top of `src/styles.scss` and `projects/wealth-portal/src/styles.scss`.
- Icons are `<mat-icon>` ligatures backed by the self-hosted font at `src/assets/fonts/material-icons.woff2`. Do not re-add the Google Fonts link.
- Small component styles are inline in the `styles` array; larger ones use a `.scss` file next to the component (for example `src/app/features/dashboard/dashboard.component.scss`).

## Test hooks

Interactive elements carry `data-test` attributes (`data-test="username"`, `data-test="login-submit"`, `data-test="otp"`). There are 17 in the templates. Add one to any new control that a test or QA script needs to find.

## Naming

- Library symbols are prefixed `Dbs` (classes) and `dbs-` (selectors, CSS classes, SCSS tokens). App components use the `app-` selector prefix; wealth-portal uses `wp-`.
- Spec files sit next to the code they test as `*.spec.ts` ([Testing](testing.md)).
