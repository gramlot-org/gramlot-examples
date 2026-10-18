# Let another part of your page know what happened

Suppose you want a small status message whenever someone closes a panel. You should not have to watch the browser's HTML or write a second click handler for the drawer. The container can announce the change, and your page can listen.

Those announcements are **events**. A **dataController** is a small piece of page logic that runs when an event it subscribes to arrives. Here, controllers turn drawer and splitter events into counters and readable messages.

## Try it

Close Filters and look at **Visibility events**. The count increases and the message says that the left region is closed. Open it again: you receive another change.

Now drag a separator slowly. The panel follows your hand immediately, but **Completed resizes** changes when you finish dragging. This is useful if your application wants to react to the final size rather than every small movement.

Use **Hide Filters from Data**. The region disappears and the visibility report updates too. An event describes a change in the interface, not just a particular mouse click. Untick it to restore visibility; the drawer's own open or closed preference is a separate setting.

## Reading the extra details

The structured text below each message is the event's **payload**: the details sent with the announcement. For visibility, look for the region and whether it is open. For resizing, compare the previous size with the new size. You do not need to memorize the whole object.

## Connecting your own controller

The Filters pane has a node_id of eventFilters. The controller's subscribe_eventFilters_closable_change parameter listens to its visibility announcement. The other subscription names eventWorkspace, the container, and splitter_resize, its completed-resize event.

Read the name in three parts: subscribe, the component's identity, and the event. The controller receives the details and writes its result into Data. The counters on screen then update through normal bindings.

No event is counted just because the page starts. Try an action and watch the result: this is a conversation between existing components, not a replacement for their normal behavior.
