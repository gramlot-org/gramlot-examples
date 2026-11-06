# Primary supplier

Choose a supplier using the first column. **Selected ID** shows the value stored
in `product.primary_supplier_id`, initially `SUP02`. Clicking that radio again
keeps it selected. Search for another supplier: the chosen ID remains unchanged
even when its row disappears. Clear the search to see its radio selected again.

## The declaration

- `check="single"` uses a radio instead of a multiple-choice checkbox.
- `checked="^product.primary_supplier_id"` binds one scalar ID in the product record.
- `checkedField="supplier_id"` reads the identity from each supplier row.
- `primary` names the presentation column; it does not add Boolean fields to suppliers.

An external Data update changes the selected radio. An empty value means no
choice. Text and numeric IDs retain their type: `12` and `"12"` are different.
The sample Data is shared by Python and JavaScript; no endpoint is needed.

The interaction also works on partial/windowed stores: unloaded selections are
retained, and newly loaded rows compare their ID with the same bound value. Only
one ID is needed, so this operation does not require loading all suppliers.
The example uses a complete small store for local search. It changes Data only;
persisting the product uses the application's ordinary form/save mechanism.
