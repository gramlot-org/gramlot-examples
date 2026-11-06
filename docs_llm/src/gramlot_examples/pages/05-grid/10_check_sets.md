# Customer sets

Press **Add John**, **Add Mark** and **Add Fred**. Each button adds a checkbox column to the same grid. Check one customer for both John and Fred: the sets are independent. Pressing Add again keeps the existing memberships.

## The data

The companion `_data.tytx` file supplies three customer records, an initial Customer column and three empty strings under `sample.sets`. The example uses no database or endpoint. Each set stores customer IDs as comma-separated text; an empty string means no members. The values below the grid show these strings through ordinary bindings.

## Adding a column

Both the Python and JavaScript pages use the shared `addSet` Logic method in the JavaScript companion. It changes the **structure Bag**, which the grid already observes. It does not rebuild the grid or modify customer records.

Checkbox columns come first, with compact J, M and F captions. Their `title` retains the complete name for tooltips and accessible labels.

The column attributes are:

- `check='multiple'`: independent membership checkboxes.
- `checked='^.sets.john'`: the Data string read and updated by that column, relative to the grid's datapath.
- `checkedField='id'`: the row field identifying a customer; it is not the displayed name.

A declarative grid structure can use the same attributes:

```python
struct.column('john', name='John', check='multiple',
              checked='^.sets.john', checkedField='id')
```

Adding or removing an ID replaces the Data string, so bindings and other grids observing the same set update too. Membership uses literal `(',' + value + ',').includes(',' + id + ',')`: `C1` does not match `C10`, and punctuation is not a regular expression. IDs must be nonempty strings without commas.

## Scope

This lesson changes one visible customer's membership at a time; it does not need all records loaded. IDs absent from the currently loaded rows stay in the set. Removing a column from the structure does not erase its Data string. These external columns are not row fields and are excluded from ordinary field sorting and search. Bulk assignment, unions and differences are outside this lesson.

## Combine sets with search

First add the columns and give Acme to John and Fred, Birch to John only, and Cedar to Fred only.

- **John** shows Acme and Birch, including customers shared with other sellers.
- **John e Fred** shows only Acme: intersection, not union.
- **Tutti** removes only the set filter; memberships and any search remain unchanged.

Type `Birch` in the grid's search field. John still shows Birch, while John e Fred shows no rows. Choose Tutti: Birch remains visible because the search still applies. Clear search to see all customers again.

The ordinary bound `setFilter` parameter contains checkbox column fields: `john`, `john,fred`, or an empty string. The `filterSets` method ensures those columns exist before changing it. The grid resolves their `checked` paths and combines their ID memberships with AND. Its base `filter`, search and set contribution remain separate; clearing or replacing one does not erase the others.

If you uncheck John while showing John, that row immediately disappears from the view but remains in the customer Bag. External changes to the set strings update the view too. No rows are copied, deleted or rewritten by filtering.

Set filtering currently requires a complete resident Bag. A grid with `windowInfo` rejects a nonempty `setFilter` rather than pretending loaded rows are the full result. Remote set filtering requires a future provider contract.
