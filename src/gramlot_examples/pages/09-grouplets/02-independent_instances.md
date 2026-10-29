# Order addresses: reuse one editor twice

Edit the delivery address for an order while its billing address remains unchanged.

## Why use a grouplet here?

One @source address_fields method builds two complete editors under separate order.billing and order.shipping paths. Routing previews follow the Data without further RPC calls.

This is an editable business scenario, with complete fields and a live preview.
The same typed Source/Data mechanisms handle all input and updates. Each required
Python `@source` method is visible in Code; the JavaScript page is equivalent.

## Try it

Edit the delivery address for an order while its billing address remains unchanged. Edit several fields and compare the preview. Text fields update
as you type. Open the Inspector to see the distinct Data paths. Reloading the
browser page resets the sample; there is no database save in this lesson.

## Legacy reference

GenroPy `test_grouplets/01_grouplet_basics.py` demonstrates full address and contact
editors, explicit value paths and simultaneous grouplets. The nested case also
uses the composition/relative-scope lesson of `08_grouplet_edge_cases.py` and
`resources/grouplets/examples/recursive_grouplet.py`. These examples use explicit
Gramlot `@source` methods; they do not claim the legacy resource loader or lazy
recursive tabs have been ported.

## Boundary

Grouplets compose editable sections. They do not by themselves supply form
save/cancel, database persistence, a wizard or a grid. The panels here are ordinary
layout and CSS, not implementations of GroupletCard or GroupletForm.
