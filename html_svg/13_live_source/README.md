# 13 · Live Source playground

Try the buttons: add list items, remove the last one, clear the list and change
the heading. Builder.wrapSource creates new elements; Source node and Bag methods
update or remove them. The renderer updates only the affected DOM branches.

The SVG circle moves because a short script calls setInterval every 50 ms and
changes its Source cx attribute. Change its color while it moves. Remove animation
deletes the entire section and runs the renderer.onDispose callback, clearing the
timer. Disposing the page also clears it. Reload restores the initial content.

Python and JavaScript pages declare the same structure and browser actions.
Named Source paths make the target of each operation explicit. Methods divide
the page into sections and loops construct the initial items and buttons.

This example demonstrates live Source, not Data binding, persistence or server
synchronization. Its scripts/actions run in the hosted profiles and in the regenerated standalone
directory opened directly from disk, offline.
