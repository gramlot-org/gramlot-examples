# 09 · End-to-end story

The acceptance page of Gramlot 0.2.0 (unified plan §8.1), in Python and JavaScript with one `Logic` class in `09_end_to_end.js`.

1. **First render.** The `dataSetter` nodes sit after some controls and in the later branch; `.settings.caption` is written twice and the later setter wins. The quantity has no setter and starts from its `default`. The first DOM already shows every final value.
2. **Editing.** The caption field writes at `change`; after checking `live` it writes at every keystroke.
3. **Formula and controller.** The formulas compute the total and the circle's radius; the named controller `paint` colors the circle.
4. **Radio.** Choosing Large writes `size.large` true and `size.small` false.
5. **Button.** The nested named controller `press` runs once per click, with `button_counter` and `button_shift`.
6. **Remote Source.** **Load extras** replaces the extras section with a branch built on the server; its own setters are visible at its first render.
7. **Freeze.** Freeze the later branch, change the quantity and remove a note, then thaw once: the removal appears at the thaw.
8. **Close.** Closing the page disposes the Gramlot instance: providers, timers, listeners and pending requests stop.

**Try it:** Walk the eight steps in order, then reload and walk them in another order.
