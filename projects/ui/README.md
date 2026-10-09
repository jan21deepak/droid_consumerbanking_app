# @bofa-demo/ui

Shared Digital Banking design system layered on Angular Material 14. Consumed by
`digital-banking` (retail web) and `wealth-portal` (downstream team) — a breaking change here
breaks their builds.

* `BofaUiModule` — page header, account tile, alert banner, toast
* Pipes — `bofaMask` (PII masking), `bofaAmount` (USD formatting)
* `BofaToastService` — imperative toast
* Theme — `@use '@bofa-demo/ui/theme' as bofa; @include bofa.bofa-design-system();`
