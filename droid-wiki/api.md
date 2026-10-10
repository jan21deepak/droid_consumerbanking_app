# API

This page documents the REST contract that `digital-banking` expects from its API gateway. In this repository the contract is implemented only by the in-browser [mock backend](systems/mock-backend.md), so the table below is derived from `src/app/core/mock/mock-backend.interceptor.ts` and the client services in `src/app/core/services/` and `src/app/core/auth/auth.service.ts`.

Active contributors: Deepak Sekar

## Conventions

- All paths are relative to the app origin and start with `/api/`. The SSO base comes from `environment.ssoUrl` (`/api/sso`), and the analytics endpoint from `environment.analyticsEndpoint` (`/api/analytics`), both in `src/environments/environment.ts`.
- Every request carries `X-Correlation-Id: dbx-<epoch ms>-<sequence>`, added by `AuthInterceptor`.
- "Auth required" means the request must carry `Authorization: Bearer <accessToken>`. `AuthInterceptor` adds it to every non-SSO `/api/` call while the session token is unexpired. The mock checks only the `Bearer ` prefix.
- Successful responses are HTTP 200 with a JSON body. The mock adds 250 ms latency to every `/api/` response.
- Error bodies have the shape `{ "error": "<code>" }`. Unauthenticated calls to protected routes return 401 `unauthorized`, and unknown routes return 404 `not_found`.
- Request and response types are defined in `src/app/core/models.ts` (see [Data models](reference/data-models.md)).
- Client-side handling of 401 and 5xx is global (see [HTTP pipeline](systems/http-pipeline.md)).

## Endpoints

| Method | Path | Auth required | Request body | Response (200) | Error codes | Client caller |
|---|---|---|---|---|---|---|
| POST | `/api/sso/authorize` | No | `{ username, password, clientId }` (`clientId` = `digital-banking-web`) | `SsoChallenge` | 401 `invalid_credentials` | `AuthService.authorize()` |
| POST | `/api/sso/mfa/verify` | No | `{ challengeId, code }` | `SessionToken` | 401 `invalid_otp` | `AuthService.verifyMfa()` |
| POST | `/api/analytics` (any path with this prefix, any method) | No | `{ appId, events: AnalyticsEvent[] }` | `{ accepted: true }` | none | `AnalyticsService.flush()` in `projects/analytics-sdk/src/lib/analytics.service.ts` |
| GET | `/api/accounts` | Yes | none | `Account[]` | 401 `unauthorized` | `AccountsService.list()` |
| GET | `/api/accounts/:id` | Yes | none | `Account` | 401 `unauthorized`, 404 `not_found` | `AccountsService.get()` via `AccountResolver` |
| GET | `/api/accounts/:id/transactions` | Yes | none | `Transaction[]` (empty for unknown id) | 401 `unauthorized` | `AccountsService.transactions()` |
| POST | `/api/transfers` | Yes | `TransferRequest` | `Confirmation` with `status: 'completed'` | 401 `unauthorized`, 400 `invalid_accounts`, 422 `insufficient_funds` | `PaymentsService.transfer()` |
| GET | `/api/billpay/payees` | Yes | none | `Payee[]` | 401 `unauthorized` | `PaymentsService.payees()` |
| POST | `/api/billpay/payments` | Yes | `BillPayment` | `Confirmation` with `status: 'scheduled'` | 401 `unauthorized`, 422 `insufficient_funds` | `PaymentsService.payBill()` |
| GET | `/api/providers/credit-score` | Yes | none | `CreditScore` | 401 `unauthorized` | `ProvidersService.creditScore()` (errors become `null`) |
| GET | `/api/providers/market` | Yes | none | `MarketQuote[]` | 401 `unauthorized` | `ProvidersService.market()` (errors become `[]`, cached with `shareReplay(1)`) |
| GET | `/api/providers/aggregation` | Yes | none | `ExternalAccount[]` | 401 `unauthorized` | `ProvidersService.externalAccounts()` (errors become `[]`) |

The provider routes match on path only in the mock, so the method is not enforced. The `:id` segment must match `[\w-]+`.

## Request and response models

### SSO

| Type | Fields |
|---|---|
| `SsoChallenge` | `challengeId: string`, `mfaRequired: boolean`, `deliveryChannel: 'sms' \| 'push' \| 'email'`, `maskedDestination: string` |
| `SessionToken` | `accessToken: string`, `expiresAt: number` (epoch ms), `user: User` |
| `User` | `id`, `firstName`, `lastName`, `email`, `lastLogin` (all `string`) |

The mock returns `challengeId: 'ch-<epoch ms>'`, `deliveryChannel: 'sms'`, `maskedDestination: '(•••) •••-4417'`, and a token `mock.<base64 of user id>` that expires 15 minutes after issue. The client stores the token in `sessionStorage` key `dbx.session` (see [Sign-in](features/sign-in.md)).

### Accounts

| Type | Fields |
|---|---|
| `Account` | `id`, `name`, `number`, `routingNumber` (strings), `kind: 'checking' \| 'savings' \| 'credit' \| 'investment'`, `balance: number`, `available: number` |
| `Transaction` | `id`, `accountId`, `date` (ISO string), `description`, `category` (strings), `amount: number` (negative for debits), `pending: boolean` |

### Payments

| Type | Fields |
|---|---|
| `TransferRequest` | `fromAccountId`, `toAccountId` (strings), `amount: number`, `date` (ISO string), `memo?: string` |
| `Payee` | `id`, `name`, `category: 'utilities' \| 'credit card' \| 'insurance' \| 'telecom' \| 'other'`, `accountNumber` |
| `BillPayment` | `payeeId`, `fromAccountId` (strings), `amount: number`, `deliverBy` (ISO string) |
| `Confirmation` | `confirmationNumber: string` (mock format `DBX1000NN`), `status: 'scheduled' \| 'completed'` |

### Providers

| Type | Fields |
|---|---|
| `CreditScore` | `provider: string`, `score: number`, `band: 'Poor' \| 'Fair' \| 'Good' \| 'Very Good' \| 'Exceptional'`, `asOf: string` |
| `MarketQuote` | `symbol`, `name` (strings), `price: number`, `change: number` |
| `ExternalAccount` | `institution`, `name`, `mask` (strings), `balance: number` |

## Validation rules enforced by the mock

| Endpoint | Rule | Error |
|---|---|---|
| `/api/sso/authorize` | `username === 'demo'` and `password === 'Demo@1234'` | 401 `invalid_credentials` |
| `/api/sso/mfa/verify` | `code === '123456'`. The `challengeId` is not checked | 401 `invalid_otp` |
| `/api/transfers` | Both accounts exist and differ | 400 `invalid_accounts` |
| `/api/transfers` | `0 < amount <= from.available` | 422 `insufficient_funds` |
| `/api/billpay/payments` | Source account exists and `0 < amount <= available` | 422 `insufficient_funds` |

Client-side rules are stricter in places: transfers are capped at $25,000 and bill payments require at least $1 (see [Transfers](features/transfers.md) and [Bill pay](features/bill-pay.md)). The mock does not check `payeeId`, `date`, `deliverBy` or `memo`.

## Example: sign-in exchange

```http
POST /api/sso/authorize
X-Correlation-Id: dbx-1791000000000-1
Content-Type: application/json

{ "username": "demo", "password": "Demo@1234", "clientId": "digital-banking-web" }

200 OK
{ "challengeId": "ch-1791000000250", "mfaRequired": true, "deliveryChannel": "sms", "maskedDestination": "(•••) •••-4417" }
```

```http
POST /api/sso/mfa/verify
X-Correlation-Id: dbx-1791000005000-2

{ "challengeId": "ch-1791000000250", "code": "123456" }

200 OK
{ "accessToken": "<demo-token>", "expiresAt": 1791000905250, "user": { "id": "u-1001", "firstName": "Jordan", "lastName": "Rivera", "email": "jordan.rivera@example.com", "lastLogin": "2026-10-06T21:14:00Z" } }
```

The timestamps above are illustrative, and `<demo-token>` stands for the mock's token format: `btoa(userId)` followed by a counter, so the user `u-1001` produces a token whose first part decodes to `u-1001`.

## Key source files

| File | Purpose |
|---|---|
| `src/app/core/mock/mock-backend.interceptor.ts` | Implements every endpoint and error code |
| `src/app/core/mock/mock-data.ts` | Seed data returned by the endpoints |
| `src/app/core/models.ts` | Request and response types |
| `src/app/core/auth/auth.service.ts` | SSO client |
| `src/app/core/services/accounts.service.ts` | Accounts client |
| `src/app/core/services/payments.service.ts` | Transfers and bill pay client |
| `src/app/core/services/providers.service.ts` | Provider client with error fallbacks |
| `src/app/core/http/auth.interceptor.ts` | Adds bearer and correlation headers |
| `projects/analytics-sdk/src/lib/analytics.service.ts` | Analytics batch sender |
| `src/environments/environment.ts` | `ssoUrl`, `ssoClientId`, `analyticsEndpoint` |
