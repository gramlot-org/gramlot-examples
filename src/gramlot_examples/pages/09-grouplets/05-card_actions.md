# Shipping desk: card actions and scoped Clear

Manage delivery for order SO-1042, twelve workshop lights for North Workshop.
The order and invoice overview gives context; the delivery card groups the contact,
time window and unloading instructions, with a nested address editor. The dispatch
briefing follows the same Data as you edit.

## Try the complete workflow

1. Open **Actions** on Delivery arrangements. Choose **Morning delivery** and see
   the window, instructions and status change. **Prepare contact note** uses the
   current contact/phone and shows a note in the briefing; it sends nothing.
2. Edit the address city. Tick **Reviewed** and fold Delivery address.
3. Choose **Clear** on Delivery arrangements, then **Cancel**. Every field stays.
4. Choose Clear again and **Confirm**. The contact, phone, window, instructions
   and nested address become empty, including fields inside a folded card.
5. Check that order reference, billing address, tracking reference, action note
   and fold/review state remain. Even the editable order-reference field inside
   the card is retained: its binding points outside the card's Data scope.
6. Tick **Order invoiced — lock Clear**. Clear is disabled on both card menus;
   other menu actions remain usable. Untick to enable it again.
7. Re-enter an address, then use the nested address card's own Clear: only the
   destination clears. **Reload shipping cards** preserves the current Data.

## Source and ownership

Python `@source shipping_card` declares the card, its ordinary `menu()`/`menuline`
entries and a nested card. `@source shipping_address` supplies all six address
fields. Both methods are included in Code, with matching JavaScript definitions.
The existing remote mechanism loads these fragments; folding does not send RPC.

`delitem="^.canClear"` enables the built-in Clear entry. A dataFormula derives
that boolean from the invoice checkbox. Omission/null hides Clear; false disables
it. Custom header entries are authored as a single direct popup menu. Menus deeper
in the body retain their ordinary behavior.

Clear uses the shared confirmation dialog and writes null only through writable
`value` pointers within the card's resolved Data subtree. It does not replace the
Bag or read values from browser inputs. External pointers, `=` read bindings,
transformed pointers and non-field Data are retained. A lock acquired during the
confirmation, card removal or a remote body replacement cancels the pending clear.
These are local draft actions, without form/database save or delete behavior.
