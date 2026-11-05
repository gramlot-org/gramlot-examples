# Attribute rows

> **What you learn** — Verify shared charts over records stored in node attributes.

The shared report uses `rowMode="attributes"`: each record's fields are node attributes. Its deterministic provider exercises reload, changed measures, an empty result and an error while preserving the last successful data. Compare Value rows to see the same behavior with a different Bag representation. The report and fixture provider are shared in `gramlot_examples/base/chart_report.py`.
