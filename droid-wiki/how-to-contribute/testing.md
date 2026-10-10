# Testing

Every project has a Karma and Jasmine unit test suite that runs in headless Chrome. There are 7 spec files with 17 test cases in total, and no end-to-end tests.

## Running tests

| Command | What it runs |
|---|---|
| `npm test` | All four suites in order: `ui`, `analytics-sdk`, then `npm run build:libs`, then `digital-banking`, then `wealth-portal` |
| `npm run verify` | `npm run build` followed by `npm test` (what CI runs) |
| `npx ng test ui --watch=false --browsers=ChromeHeadlessCI` | Design-system pipes |
| `npx ng test analytics-sdk --watch=false --browsers=ChromeHeadlessCI` | Analytics service |
| `npx ng test digital-banking --watch=false --browsers=ChromeHeadlessCI` | Retail app |
| `npx ng test wealth-portal --watch=false --browsers=ChromeHeadlessCI` | Downstream consumer contract |
| `npx ng test digital-banking` | Watch mode in a visible Chrome window (the Karma default `browsers: ['Chrome']`) |

`npm test` builds the libraries before the app suites because `digital-banking` and `wealth-portal` import `@dbs-demo/ui` and `@dbs-demo/analytics-sdk` from `dist/` through the `tsconfig.json` path mapping. If you run an app suite on its own, run `npm run build:libs` first.

### Chrome

`ChromeHeadlessCI` is a custom launcher defined in every Karma config (`karma.conf.js`, `projects/ui/karma.conf.js`, `projects/analytics-sdk/karma.conf.js`, `projects/wealth-portal/karma.conf.js`):

```js
customLaunchers: {
  ChromeHeadlessCI: { base: 'ChromeHeadless', flags: ['--no-sandbox'] }
}
```

`--no-sandbox` lets it run in containers and CI. If Karma cannot find Chrome, set `CHROME_BIN`, for example:

```bash
export CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

### Coverage

`karma-coverage` is configured with HTML and text-summary reporters writing to `coverage/digital-banking`, `coverage/ui`, `coverage/analytics-sdk` and `coverage/wealth-portal`. The `reporters` list is `['progress', 'kjhtml']`, so coverage is only produced when you ask for it:

```bash
npx ng test digital-banking --watch=false --browsers=ChromeHeadlessCI --code-coverage
```

There is no coverage threshold.

## What is tested

| Spec | Subject | Cases |
|---|---|---|
| `projects/ui/src/lib/pipes/amount.pipe.spec.ts` | `DbsAmountPipe`: USD format, minus sign, optional plus sign, em dash for null | 4 |
| `projects/ui/src/lib/pipes/mask.pipe.spec.ts` | `DbsMaskPipe`: keep last four digits, empty values, short values | 3 |
| `projects/analytics-sdk/src/lib/analytics.service.spec.ts` | `AnalyticsService`: PII redaction before queueing, flush to the configured endpoint | 2 |
| `src/app/core/auth/auth.guard.spec.ts` | `AuthGuard`: redirect to `/login?returnUrl=...`, allow authenticated users | 2 |
| `src/app/features/accounts/account-detail.component.spec.ts` | `filterTransactions`: empty query, case-insensitive match | 2 |
| `src/app/features/transfers/transfer.validators.spec.ts` | `transferValidator`: same account, insufficient funds, valid transfer | 3 |
| `projects/wealth-portal/src/app/app.component.spec.ts` | `HoldingsComponent` renders `@dbs-demo/ui` components and totals the portfolio | 1 |

The wealth-portal spec is the downstream contract test. It checks that `dbs-page-header` renders, that the table has three `tr.mat-row` rows, and that the total is formatted by `DbsAmountPipe`. It depends on the legacy Material class `mat-row`, so the MDC migration (gate G4) will break it on purpose. See [wealth portal](../apps/wealth-portal.md).

Not covered: feature components, `AuthService`, the interceptors, the mock backend, `TrackDirective` and `DbsToastService`.

## How specs are written

Each project's `src/test.ts` (for example `src/test.ts`) initializes the Angular test environment and loads every `*.spec.ts` under that project with `require.context`. A new spec file next to its subject is picked up automatically.

The existing specs use four styles. Pick the lightest one that fits.

**Plain class instance.** Pipes and pure functions need no `TestBed`:

```ts
describe('DbsMaskPipe', () => {
  const pipe = new DbsMaskPipe();
  it('keeps only the last four digits', () => {
    expect(pipe.transform('4400 1234 5678 9012')).toBe('••••9012');
  });
});
```

**Exported pure function.** `src/app/features/accounts/account-detail.component.ts` exports `filterTransactions` so it can be tested without rendering the component. Doing the same for new logic keeps tests fast.

**Reactive form validators.** `src/app/features/transfers/transfer.validators.spec.ts` builds a real `FormGroup` with `FormControl`s and asserts on `group.errors`.

**`TestBed` with test doubles.**

- `src/app/core/auth/auth.guard.spec.ts` imports `RouterTestingModule` and replaces `AuthService` with `{ provide: AuthService, useValue: { isAuthenticated: false } }`.
- `projects/analytics-sdk/src/lib/analytics.service.spec.ts` uses `HttpClientTestingModule` and `HttpTestingController.expectOne('/beacon')` to assert on and answer the flush request, and provides `ANALYTICS_CONFIG` directly.
- `projects/wealth-portal/src/app/app.component.spec.ts` imports the real `DbsUiModule` and `MatTableModule`, declares the component, and queries `fixture.nativeElement`.

Conventions:

- File name `<subject>.spec.ts`, placed next to the subject.
- `describe` named after the class or function under test, `it` phrased as behavior ("rejects transfers to the same account").
- Do not depend on the mock backend in unit tests. Use `HttpTestingController` or a stubbed service instead.
- Do not skip (`xit`, `xdescribe`) or delete tests. The upgrade policy requires "no skipped or deleted tests".

Templates mark interactive elements with `data-test` attributes (for example in `src/app/features/transfers/transfer.component.html`), which give stable selectors for component tests. See [patterns and conventions](patterns-and-conventions.md).
