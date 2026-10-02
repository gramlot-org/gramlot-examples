# 01 · Formula

`dataFormula(result_path, formula, **parameters)` computes an expression and writes the result at `result_path`. The names of the parameters are the names inside the expression.

- A `^` parameter triggers the formula when its Data changes: editing the price or the quantity recomputes the total.
- A `=` parameter is read at each run but does not trigger it. The gross uses `vat='=.vat'`: changing the rate alone does not recompute it; the next change of the total does.
- `_if` is a condition: when it is false the formula writes the `_else` expression instead.
- `_init=True` runs each formula once when the page starts, after the setters.

A formula result is itself Data: the gross and the size are formulas of the total.

**Try it:** Change the VAT rate, then the quantity, and watch when the gross follows.
