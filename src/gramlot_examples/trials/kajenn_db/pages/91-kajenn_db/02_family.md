# Customer editing across windows

Direct and nested iframe pages and connected windows use their own PageStores,
with one physical WebSocket in the primary gallery. Every page can read and save.

Load customer 1 in the direct frame and a connected window. Change its name and
save in the window, then reload in the frame to see the committed value. Repeat
from the nested frame. A page does not overwrite another page's draft when it
saves: database changes become visible there on reload. The last successful
save wins; this example does not provide automatic synchronization or conflict
resolution between drafts. Closing a parent closes connected descendant windows.
