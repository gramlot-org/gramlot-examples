# 02 · Controller

`dataController(script, **parameters)` runs code for its effects. Inside the script `this` is the controller's Source node: `this.SET('.path', value)` writes the Data relative to its context.

- **React to a value.** `name='^.name'` triggers the controller at every change; it writes `.invalid`, and the warning binds `visible` to it. `_init=True` runs it once at the start.
- **React to a fired path.** The button's `fire='.request'` fires the path at every click, also with an equal value. The controller counts the requests; `requests='=.requests'` is read without triggering.
- **Wait for a pause.** `_delay=400` runs the controller 400 ms after the last change, once.
- **Run at start and at intervals.** `_onStart=True` runs the controller when the page has started; `_timing='^.interval'` repeats it every *n* seconds, and 0 stops it.

**Try it:** Clear the name, type a search quickly, then change the interval to 5.
