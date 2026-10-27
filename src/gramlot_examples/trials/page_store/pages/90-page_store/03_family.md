# Publish from a page family

The same customer lesson runs in a direct iframe, inside an intermediate iframe,
and in independently opened connected windows. The gallery is the primary page:
it owns the only physical WebSocket. Opened windows retain their opener through
rel="opener"; they belong to the same Gramlot family.

1. Load customer 1 in the direct iframe.
2. Load customer 2 in the nested iframe. The direct iframe still shows customer 1.
3. Open a connected customer window and load customer 2 there.
4. Use Open a connected copy inside the nested iframe, then in the new window,
   to create another generation. Load customer 1 and then try 99.
5. Close an intermediate window: its own child windows close; the sibling frames
   remain usable. Closing the primary gallery closes all connected descendants.

Each customer page has a distinct pageId and its own PageStore Bag. Its button
uses gramlot.publish({topic: 'load_customer', server: true}, {pkey}) unchanged.
The shared family protocol routes the publication through the parents to the
primary and then the server. Omitting pageId targets the sender's store, not the
primary's store. Acceptance and binder changes return to the correct child.

The customer PageStore and its subscribed controller are in the previous lesson,
02_customer_lookup.py. The intermediate container is 04_nested_branch.py; it
adds no transport or application messaging code. All UI is ordinary Gramlot Source.
No worker, manually constructed WebSocket or parallel postMessage protocol is used.

To inspect the transport, open the browser's network panel for the primary:
there is one WebSocket to gramlot/store. Child pages do not open their own sockets.
