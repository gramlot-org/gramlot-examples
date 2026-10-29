# Customers across database adapters

Search for a customer, select it and check locality and the full state name. Reopen and clear the selection. In dbComboBox, Enter keeps free text; arrows or clicking select a suggestion.

The Asqueel host passes `auxColumns='@state.name'` directly, without a model aliasColumn. Asqueel returns `_state_name`; `selected__state_name` writes it into the page Data. Auxiliary columns show the customer and state with model labels. The same Python page receives the SQLAlchemy/Django registered `state_name` projection from their runners; those providers retain their native outer join and F annotation.

The source has 3,200 customers. The copy retains every row and its 21 physical columns. No logical-deletion policy or state-name physical column is added. The read-only provider returns at most ten suggestions.
