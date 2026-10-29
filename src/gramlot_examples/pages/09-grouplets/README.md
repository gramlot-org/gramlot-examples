# Grouplets in real editing workflows

- [Customer onboarding: adapt the customer details](01-remote_fragment.md): Change customer type, edit contact details and return to the previous type: its draft remains available.
- [Order addresses: reuse one editor twice](02-independent_instances.md): Edit the delivery address for an order while its billing address remains unchanged.
- [Service visit: compose a site dossier](03-nested_fragments.md): Edit the site contact, address and access notes, then reload the composed section without losing the draft.

Based on the legacy address/contact and nested grouplet tests. Each page includes
complete Python @source methods, a JS twin and sample Data. Use the matching
grouplets core development build. Draft editing does not imply database saving.

## Order review with cards (g04)

A complete customer/invoice/delivery dossier demonstrates groupletCard headers,
independent review checkboxes, nested collapse, all header sides, shared address
@source and a remote refresh that preserves the draft. See 04-order_cards.md.


## Shipping desk with card actions (g05)

A full shipping workbench adds custom header menu actions and confirmed Clear.
Try parent/nested clearing, Cancel and the invoice lock; inspect preserved order,
invoice, tracking and fold/review states. Python @source shipping_card and
shipping_address are included in Code, with a step-by-step explanation.


## Customer handover with inline guides (g06)

Complete customer, delivery and nested address forms include meaningful Markdown
guides. Delivery instructions name the current contact/destination through Data.
Try keyboard opening, guides on folded cards, hiding and reload while retaining
the draft. The three required Python @source methods are included in Code.
