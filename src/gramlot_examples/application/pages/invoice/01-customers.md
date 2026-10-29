# Invoice customer selectors

Search actual customers by account name. The compact template shows name, contact details, address, state, invoice count and total billed; missing values use an em dash. Selecting a customer fills the caption, locality, state and invoice count. dbComboBox also accepts free text.

The Asqueel adapter holds all 76 physical table models and 808 physical columns. Only customer application formulas are qualified (20 physical and 19 virtual fields). customer_score uses the documented equivalent SQL expression; other tables do not have complete application behavior. This page never writes to test_invoice_pg.

The totals use the existing `n_invoices` and `invoiced_total` model formulas. The page requests them through `auxColumns`; it adds no query-specific Python endpoint. A missing total is not displayed as zero.
