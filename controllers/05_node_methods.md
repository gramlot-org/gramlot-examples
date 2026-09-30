# 05 · Node methods

Every Source node offers five methods for the Data. A path starting with `.` is relative to the node's context; here each button's `action` calls them with `this` = the button node.

- `this.SET(path, value)` writes and notifies: the value on screen changes and the observer counts one change.
- `this.GET(path)` reads. **GET value** copies the current value into `.read`.
- `this.PUT(path, value)` writes silently: nothing is notified, so the value on screen keeps the old number until the next SET. **GET value** shows the real one.
- `this.FIRE(path, value)` writes the value and resets the path silently afterwards, so every FIRE is delivered, also with an equal value.
- `this.FIRE_AFTER(path, value, delay)` fires after `delay` ms. The timer belongs to the node: removing the node cancels it.

**Try it:** Press PUT, then GET value, then SET, and compare the three numbers.
