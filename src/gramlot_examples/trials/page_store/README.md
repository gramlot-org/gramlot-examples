# PageStore gallery trial

Python lessons for the isolated PageStore/WebSocket branches. Use the gramlot-py-server worktree with the gallery staging changes and the local core installed:

```sh
gramlot uvicorn gallery --websocket --port 8766 --mount /py \
  --catalog /absolute/path/to/trials/page_store/catalog.json \
            /absolute/path/to/trials/page_store/pages
```

Open /py/ and expand **PageStore and WebSocket**. Python source and explanations use the ordinary gallery panels. The installed common gallery package supplies the shell; these lessons belong to gramlot-examples.

This Python/Uvicorn development catalog does not imply released support in other adapters. No database or dataSetter is used. The customer lesson keeps status and pkey in node attributes and preserves the last record on lookup failure.

The third lesson, **Publish from a page family**, includes a direct customer
iframe, a nested customer iframe and links opening connected windows. Each
customer page can open another generation. All publish to their own PageStore
through the gallery's single socket. Load different customer keys to observe
store isolation. Closing a parent window closes its descendants.

The fourth lesson, **Publish to another page**, opens a connected sender window
and a recipient iframe. Copy the recipient's visible page ID into the sender's
**Publish to another page** controls. Publication acceptance appears in the
sender; customer data and business errors appear in the recipient. The existing
owner check rejects unknown or foreign-owner targets without closing the socket.

The recipient also shows **Published by page**: its controller reads the validated
sender from _subscription_metadata["pageId"], separately from the published data.

After a successful load the PageStore publishes customer_loaded back to the sender.
A subscribed dataController displays its payload under **Server event**, separately
from the sender's own bound customer record. It uses the existing shared socket.
