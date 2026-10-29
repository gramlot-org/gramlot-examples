# Order review with grouplet cards

Prepare an order for twelve workshop lights: confirm the customer contact, check
the invoice address and arrange delivery to the workshop. Each card gives a
recognisable boundary to a related group of fields. Its header remains available
when the fields are folded away. The briefing below always follows the same Data.

## Try the complete workflow

1. Change the customer name; its card title and the briefing update together.
2. Correct the workshop city and unloading instructions. The billing address stays
   unchanged because each card has its own datapath.
3. Tick **Reviewed** in each customer, invoice and delivery header after checking
   that section. The caption is declared with `checkboxLabel="Reviewed"`.
   The counter reports the three sections reviewed. The external Delivery reviewed
   checkbox edits the same state as the delivery header.
4. Fold the workshop address, then its delivery parent. Reopen the parent: the
   address stays folded. Enter or Space activates the chevron; clicking the folded
   title expands the card. The external Fold delivery checkbox works too.
5. Reload order cards. Source is fetched again, but drafts, review marks and fold
   states live in Data and are restored. Folding alone makes no request.

## Source and ownership

`order_cards` returns the customer card with authored fields and two remotely
filled address/delivery cards. `order_delivery_fields` composes the nested workshop
card. `order_address_fields` is reused for billing and shipping. All Python
`@source` definitions are in Code, with an equivalent JavaScript page.

The customer header is on top; the invoice header is on the left and the delivery
header on the right. Folded side headers lay out in a row. `title` uses an ordinary
binding; no card-specific title template is needed. `collapsed` and `checkbox`
use writable ^ pointers, relative to each card's datapath. Read-only/literal
parameters do not acquire a separate local state. Sample Data is initialized by
the standard same-name `_data.tytx` companion.

## Legacy reference and scope

Based on `projects/gnrcore/packages/test/webpages/gnrwdg/test_grouplet_card.py`,
especially test_0_plain, test_3_sides, test_4_bound_state and test_5_nested, plus
`gnrjs/tests/grouplet_card.test.js` and `gnrpy/tests/web/grouplet_card_test.py`.
Unlike the legacy caller-relative state paths, all card parameters follow ordinary
Gramlot datapath resolution. Use boolean collapsible/collapsed, not 'closed'.

Review marks are a local checklist, not validation or a database commit. This
increment does not yet include menu/Clear, inline documentation, useForm,
autosave or resource profile loading. Those are separate planned increments.
