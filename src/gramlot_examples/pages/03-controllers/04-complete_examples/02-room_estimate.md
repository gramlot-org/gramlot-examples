# Plan your stay

Choose Classic or Superior, 1–4 guests and 1–30 nights. Two guests are included;
each extra guest costs €25 per night. The illustrative rates are €90 and €140.

Seven explicit dataFormula declarations form the chain:

1. Room choice determines the base room rate.
2. Guests determine the extra-guest supplement.
3. Rate + supplement gives the nightly price.
4. Nightly price × nights gives the stay subtotal.
5. Seven or more nights earn 10% of the subtotal as a discount.
6. Subtotal − discount gives the total.
7. 30% of the total, rounded to whole euros, gives the deposit.

For Superior, three guests and seven nights, the nightly price is €165,
subtotal €1,155, discount €115.50, total €1,039.50 and deposit €312.
Six nights remove the discount: total €990 and deposit €297.

Required, minimum and maximum rules keep rejected drafts out of accepted Data.
Try five guests or 31 nights: the draft remains visible and the calculation
retains the previous accepted values. Correct the field to resume updates.

Prepare summary reads the current total with `=.total` and stores a snapshot.
Formula inputs use `^` and react to changes; the summary changes only on click.
This example does not reserve rooms or process payments.

The full Python Page is 42 nonblank lines, including Page setup, presentation
declarations and behavior. The paired CSS and collection-enabled host setup are
separate. Short browser expressions are visible in the Python declarations.

Try three independent edits, starting from Classic / two guests / three nights:

- Guests `validate_max=4` → `6`: five guests produce total €495 and deposit €149.
- Discount `nights >= 7` → `nights >= 5`: five nights produce total €405 and deposit €122.
- Supplement `* 25` → `* 15`: three guests produce total €315 and deposit €95.

The downloadable copies change one rule each; explanatory text is updated too
where it repeats that rule. Restore the baseline before each independent edit.

Python browser qualification in Chromium and WebKit covers selection, all seven
results, the seven/six-night boundary, invalid/empty drafts, correction, click
snapshots, the three edited copies and mobile overflow. JavaScript is separately
mount-smoke-tested; it is not a substitute for the Python browser checks.

## Inspect, edit Python, reload

Open the gallery inspector, select Data → estimate, and follow subtotal, discount, total and deposit while changing nights. For Classic / two guests / five nights, the original rule gives 450 / 0 / 450 / 135. Change `nights >= 7` to `nights >= 5` in Python, save, let the development server reload, then reload the page and enter five nights again. The new results are 450 / 45 / 405 / 122. The inspector follows Data; it does not execute a formula edited in live Source. The existing activation contract is unchanged.
