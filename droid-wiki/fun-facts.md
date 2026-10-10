# Fun facts

A few things about the workspace that are not obvious from reading the README. Numbers come from [by the numbers](by-the-numbers.md).

## The rebrand took two passes

Commit `041fc80` renamed Bank of America branding to DBS across 41 files. A later branding pass cleaned up four traces it missed:

- The wealth portal introduced itself as `Merrill Edge (demo)`. The eyebrow now reads `DBS Wealth (demo)`.
- Its sample portfolio held 350 shares of `BAC`, Bank of America's ticker, labelled "DBS Corp". It now holds `D05`, the DBS Group Holdings ticker, under the name "DBS Group Holdings".
- Mock accounts carried Bank of America product names (`Advantage Plus Checking`, `Advantage Savings`, `Customized Cash Rewards Visa`) and Bank of America's routing number `026009593`. They are now `Everyday Checking`, `Smart Saver Savings` and `Cashback Rewards Visa`, with routing number `099100128`.
- The brand navy `#012169` and red `#e31837` were hard-coded in 10 tracked files, including `projects/ui/src/lib/theme/_theme.scss`. The theme now uses graphite `#1a1a1a` as the primary palette and DBS red `#ec1c24` as the accent.

[Cleanup opportunities](cleanup-opportunities.md) records what that second pass changed.

## The vendor widget forbids you from fixing it

`vendor/fdp-market-widget-3.4.2.tgz` contains a complete Angular package from "FinData Partners", with a LICENSE.md inside it that reads: "Commercial license. Redistribution, modification and reverse engineering are prohibited. (Synthetic vendor package created for a demo; not a real product.)" Its `package.json` caps `@angular/core` at `<15.0.0`. The whole tarball is 5,989 bytes, and it is the reason `ng update` to Angular 15 fails (gate G1 in [upgrade gates](background/upgrade-gates.md)).

## Zero TODOs

A case-insensitive search for `TODO`, `FIXME`, `HACK` and `XXX` across every tracked file returns nothing. The known problems are documented in tables in `README.md` and `docs/engineering/frontend-upgrade-policy.md` rather than in code comments.

## The biggest "source file" is a fake backend

The largest hand-written TypeScript file is `src/app/core/mock/mock-backend.interceptor.ts` at 132 lines. It is longer than any real feature because it stands in for an SSO provider, an API gateway, a credit bureau, a market-data feed and an account aggregator, each answering after a 250 ms delay. The only bigger tracked text files are `angular.json` (271 lines) and `package-lock.json` (21,901 lines). See [mock backend](systems/mock-backend.md).

## Production also uses the mock

`src/environments/environment.prod.ts` sets `useMockBackend: true`, with the comment "Demo build: the mock gateway stays on so the app is fully self-contained." A production build of the retail app still talks only to itself.
