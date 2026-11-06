# Row formulas · totals, VAT and chains

A column with a `formula` computes its field for every row and writes the result
into the row Bag. The order lines below compute the line total, the VAT amount and
the gross amount.

## Try it

- Change Quantity in a row and leave the cell. Total, VAT amount and Gross follow in
  that row.
- Change **VAT %** above the grid while typing (`live=True`). The VAT amount and the
  gross amount of every row follow; the page Data `sample.vat` is the input.
- Change Unit price. Total, then VAT amount, then Gross are recalculated in this
  order.
- Open the Inspector: the formula results are written into the row nodes, so any
  other grid or form on the same rows sees them.

## Read the code

```python
s.column('total', dtype='N', formula='quantity * price', calculated=True)
s.column('tax', dtype='N', formula='total * vat / 100',
         formula_vat='^.vat', calculated=True)
s.column('gross', dtype='N', formula='total + tax', calculated=True)
```

Formula names refer to row fields and to `formula_<name>` parameters. `formula_vat`
written `^.vat` recalculates when that Data changes; `=path` would read the current
value without triggering, and any other value is a literal. The path is relative to
the container `datapath`, here `sample`.

The columns form a chain: `gross` depends on `tax`, which depends on `total`. The
grid evaluates them in dependency order, wherever they are declared, and rejects a
cycle. `calculated=True` computes the formula when the grid configures; otherwise it
first runs when a dependency changes.

The prices and the VAT are exact Decimals (`dtype='N'`). The formulas here are plain
arithmetic, so they are evaluated without compiling code and keep Decimal
precision. A formula recalculates when a committed value reaches the Bag, not while
a draft is being typed. Other JavaScript expressions are also possible; they run only
from an inline `struct` and need a page that allows inline evaluation.
