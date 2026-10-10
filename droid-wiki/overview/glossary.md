# Glossary

Terms used in this codebase and its upgrade policy, with where each one lives in the code.

| Term | Meaning | Where |
| --- | --- | --- |
| Online ID / Passcode | The username and password fields on the login page | `src/app/features/auth/login.component.ts` |
| SSO challenge | The response from `/api/sso/authorize` (`challengeId`, `mfaRequired`, `deliveryChannel`, `maskedDestination`). Held in memory only, until the MFA step completes | `SsoChallenge` in `src/app/core/models.ts`, `AuthService.pendingChallenge` |
| MFA step-up | The second sign-in step, where a 6-digit one-time code is verified | `src/app/features/auth/mfa.component.ts` |
| Session token | `SessionToken` (`accessToken`, `expiresAt`, `user`) saved in `sessionStorage` under `dbx.session` | `src/app/core/auth/auth.service.ts` |
| Correlation id | `X-Correlation-Id: dbx-<timestamp>-<sequence>` added to every request for gateway tracing | `src/app/core/http/auth.interceptor.ts` |
| Mock backend | The HTTP interceptor that answers every `/api/` request in the browser | `src/app/core/mock/mock-backend.interceptor.ts` |
| Providers | Third-party data sources proxied through the API gateway: credit bureau, market data, account aggregation | `src/app/core/services/providers.service.ts` |
| Linked external accounts | Accounts at other institutions returned by the aggregation provider | `/api/providers/aggregation` |
| Design system | The `dbs-design-system()` SCSS mixin and components in `@dbs-demo/ui` | `projects/ui/src/lib/theme/_theme.scss` |
| Downstream consumer | A team's app that imports a shared library. Here, `wealth-portal` consumes `@dbs-demo/ui` | `projects/wealth-portal/` |
| `page_view`, `interaction`, `api_timing`, `error` | The analytics event types defined by `AnalyticsEvent` | `projects/analytics-sdk/src/lib/analytics.config.ts` |
| Redaction / scrub | Replacing values of sensitive keys (`accountNumber`, `ssn`, `routingNumber`, `cardNumber`, `password`, `otp`) with `[REDACTED]` before an event is queued | `AnalyticsService.scrub()` in `projects/analytics-sdk/src/lib/analytics.service.ts` |
| `@security-reviewed SEC-2291` | Header marking files whose behavior AppSec reviewed. Changing behavior needs a new review | `src/app/core/auth/*`, `src/app/core/http/*` |
| Change class A / B / C | Upgrade policy categories: mechanical, judgment (needs a named approver), out of scope | `docs/engineering/frontend-upgrade-policy.md` |
| Decision gate (G1-G7) | A class B situation that must be escalated before changing code | [Upgrade gates](../background/upgrade-gates.md) |
| Legacy Material vs MDC | Angular Material 14 components versus the MDC-based components introduced in v15, which change DOM, class names, and density | `projects/ui/src/lib/theme/_theme.scss` |
| flex-layout | `@angular/flex-layout`, the end-of-life `fxLayout` directive library used in the shell and some templates | `src/app/shell.component.ts` |
| ng-packagr | The builder that packages the libraries into `dist/` | `projects/*/ng-package.json` |
| Path mapping | `tsconfig.json` `paths` that point `@dbs-demo/*` imports at the built `dist/` folders | `tsconfig.json` |
| Resolver | `AccountResolver`, which loads an account before the detail route activates | `src/app/core/services/account.resolver.ts` |
| Guard | `AuthGuard` (signed-in check) and `MfaGuard` (challenge in flight) | `src/app/core/auth/` |
| Vendor widget | `@fdp/market-widget` 3.4.2, a third-party Angular package installed from a tarball; its license forbids patching | `vendor/fdp-market-widget-3.4.2.tgz` |

See also [Architecture](architecture.md) and [Security](../security.md).
