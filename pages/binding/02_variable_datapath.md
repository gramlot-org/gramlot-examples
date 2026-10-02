# 02 · Variable datapath

A `datapath` can itself be a pointer. `datapath='^current'` reads the Data path `current` and uses its value as the context of the card.

The select writes `people.ada`, `people.alan` or `people.grace` into `current`. Every `.name`, `.field` and `.born` pointer in the card then reads the chosen record, and the field below edits it.

The `people` records come from one `dataSetter` with a dictionary (Python) or a plain object (JavaScript): it becomes a Bag in the Data.

**Try it:** Rename Alan, choose Grace, then choose Alan again: his record keeps the new name.
