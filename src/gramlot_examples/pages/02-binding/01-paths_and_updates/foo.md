# Load example data and replay field edits

The customer is loaded from **foo_data.tytx**, a typed Data Bag beside
**foo.py** and **foo.js**. The page needs no dataRemote, file-reading endpoint
or dataSetter declarations. The same file serves both page languages and the
executable documentation example.

## Try it

1. On opening, the name is **Ada Lovelace**, the city **London**.
2. Edit the customer name: the preview changes immediately through its binding.
3. Change the accent: this is interface state initialized by `default`.
4. Reload: the customer returns to the file's initial values. Edits are not saved
   back to the file.

## Manual entry or paced field loading

The second form starts empty. Type into it, or press **Play · fill sample**:
the current customer Bag is copied into a separate draft, including its types
and node attributes. The name appears immediately and the city follows after 300 milliseconds. Both
views update through normal bindings. Editing the
draft leaves the customer unchanged. **Clear draft** makes another manual trial
possible and cancels a pending city update. Pressing Play again restarts the
pause with a fresh snapshot; later edits to the customer do not change that snapshot.

The sample has one source, `foo_data.tytx`; there is no second hard-coded record.
The delayed step uses an ordinary `dataController(_delay=300)` bound to the
pending sample in Data. Clear resets that sample; Source disposal cancels the
controller timer. This button does not synthesize keystrokes or
claim to exercise an input's edit-validation pipeline. Use manual entry to test
that interaction. Character-by-character playback is outside this first example.

## The convention

```text
foo.py
foo.js
foo_data.tytx
```

The optional `_data.tytx` file contains a Bag, not an ordinary JSON object.
Its values, nested Bags, types and node attributes are retained. This example
also contains `customer.credit` as a Decimal, `customer.active` as a Boolean,
and a caption attribute on the customer name; inspect the Data to see them.

Initial data is installed before Source defaults and rendering. An explicit
dataSetter may still override a value, and endpoints/resolvers may still load
dynamic data later. A missing file changes nothing; a malformed file fails page
startup with an error. This is initial data, not a replacement for server queries
or a persistence mechanism.

## Generate the file in Python

```python
from decimal import Decimal
from pathlib import Path
from genro_bag import Bag
from genro_tytx import to_tytx

data = Bag()
data.set_item("customer.name", "Ada Lovelace", caption="Customer name")
data.set_item("customer.city", "London")
data.set_item("customer.credit", Decimal("1250.50"))
data.set_item("customer.active", True)
Path("foo_data.tytx").write_text(to_tytx(data), encoding="utf-8")
```

The documentation export embeds the companion in its Worker, so no extra fetch
or local filesystem access is required when opening the exported example.
