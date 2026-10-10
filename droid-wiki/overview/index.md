# DBS digital banking overview

This repository is a synthetic Angular 14 workspace that models the front end of a large retail bank. It runs entirely in the browser, with every backend mocked, and it exists to be the subject of an Angular 14 to 18 upgrade with explicit human decision points.

## What it is

The workspace (`package.json` name `dbs-digital-banking`, version 14.2.0) holds four Angular CLI projects defined in `angular.json`:

| Project | Kind | Location | What it represents |
| --- | --- | --- | --- |
| `digital-banking` | application | `src/` | Customer-facing retail app: SSO sign-in with MFA step-up, accounts overview, account detail, transfers, bill pay, third-party data providers |
| `wealth-portal` | application | `projects/wealth-portal/` | A downstream team's app that consumes the shared UI library |
| `ui` (`@dbs-demo/ui`) | library | `projects/ui/` | Shared component library and design system on top of Angular Material |
| `analytics-sdk` (`@dbs-demo/analytics-sdk`) | library | `projects/analytics-sdk/` | In-house analytics SDK: page views, click tracking, API timing, PII redaction |

The README states that the code is synthetic and not derived from any real bank's code (`README.md`). The branding was changed from Bank of America to DBS in commit `041fc80`.

## Who uses it

- Engineers or agents practising a framework upgrade. The README's "Upgrade surface" table lists every Angular 14-era pattern that must change, and `docs/engineering/frontend-upgrade-policy.md` defines which changes need a named approver.
- Anyone demoing a banking UI without a backend. `MockBackendInterceptor` in `src/app/core/mock/mock-backend.interceptor.ts` answers every `/api/` call in the browser.

## Quick links

- [Architecture](architecture.md): how the projects, modules, and HTTP pipeline fit together
- [Getting started](getting-started.md): Node 16, install, run both apps, demo login
- [Glossary](glossary.md): terms such as SSO challenge, decision gate, and downstream consumer
- [Digital banking app](../apps/digital-banking.md) and [Wealth portal](../apps/wealth-portal.md)
- [Shared UI library](../packages/ui.md) and [Analytics SDK](../packages/analytics-sdk.md)
- [Sign-in](../features/sign-in.md), [Dashboard](../features/dashboard.md), [Transfers](../features/transfers.md), [Bill pay](../features/bill-pay.md)
- [Upgrade gates](../background/upgrade-gates.md): the seven decisions an upgrade must escalate
- [Pitfalls](../background/pitfalls.md): environment problems already hit, with their fixes

## Demo credentials

Online ID `demo`, Passcode `Demo@1234`, MFA code `123456`. These live in `DEMO_CREDENTIALS` in `src/app/core/mock/mock-backend.interceptor.ts` and only work against the mock backend.
