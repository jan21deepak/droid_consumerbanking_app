# @dbs-demo/ui

Shared Digital Banking design system layered on Angular Material 14. Consumed by
`digital-banking` (retail web) and `wealth-portal` (downstream team) — a breaking change here
breaks their builds.

* `DbsUiModule` — page header, account tile, alert banner, toast
* Pipes — `dbsMask` (PII masking), `dbsAmount` (USD formatting)
* `DbsToastService` — imperative toast
* Theme — `@use '@dbs-demo/ui/theme' as dbs; @include dbs.dbs-design-system();`
