# 07 · Events

`connect_on<event>` adds one DOM listener to the element of its node. The event name is the part after `connect_on`, lower-cased: `connect_onclick` listens to `click`, `connect_onkeydown` to `keydown`.

- The value is inline code with `this` = the declaring node and the parameter `event`. `this.SET('.path', …)` writes relative to the node's context.
- The handler runs with the declaring node also when the event hits a descendant: a click on a chip reaches the section's handler, and `event.target` names the chip.
- A value of dotted names, such as `gui.focused`, is named logic of a `js_requires` group instead. `js_requires` needs a server with a resource system: the core `GramlotFileServer` and the current adapters have none and raise an error for any name, so this page uses inline code. The resource system comes with genro-kajenn, part of Genro.
- Removing the node removes its listeners.

**Try it:** Click the green chip, type a word, then add `connect_onfocus` to the field.
