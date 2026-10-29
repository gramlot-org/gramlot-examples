# Customer handover: guides beside the fields

A new operator takes over North Workshop's order for twelve lights. The customer
card identifies who can approve changes; delivery and nested address cards specify
when and where the goods should arrive. A live handover summary follows the draft.

## Try the complete workflow

1. Open **Guide for North Workshop Ltd** using the information button. Read the
   guidance about the purchasing contact, email and phone, then close with Escape.
2. Change the contact to **Sam Taylor** and delivery city to **Bath**.
3. Open **Guide for Delivery plan**. Its current-destination and contact paragraphs
   use those values, followed by the carrier-booking checklist.
4. Mark Delivery **Reviewed**, fold it, then open its guide from the retained
   header. Reading the instructions does not expand the card or alter the draft.
5. Expand delivery and open **Guide for Workshop address**. It explains all six
   destination fields and gives a meaningful gate/loading-bay example.
6. Turn off **Show delivery guide**: the empty guide has no information button.
   Restore it and reload the cards. Edits, review marks and fold states remain.

The customer and address guides are authored Markdown. The delivery guide is a
Data value produced by an ordinary dataFormula from the customer, destination and
contact; doc="^.guide" follows it. There is no separate card template language or
implicit doc_kw merge. If those Data values change while the popup is open, its
content updates without changing the business Data.

## Source and scope

Python @source guided_cards constructs the customer and delivery cards;
guided_delivery supplies delivery fields and the nested card; guided_address
supplies the full address form. All three are shown in Code with JavaScript twins.
Opening/closing a guide makes no RPC. The information button is a native button;
Enter/Space activate it, Escape or Close returns focus, and outside clicks dismiss.

This increment displays read-only Markdown in the page. Raw HTML is shown as text
and unsafe URL schemes are rejected by the shared Markdown renderer. The shared
archive of documentation addresses, manual sections, editable notes, languages and
permissions remains a separate resources/Kajenn increment explicitly selected by
the owner. No archive, editing or customer-record persistence is simulated here.
