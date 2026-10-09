# 10 · Call on change

A `dataRpc` follows the Data like a `dataController`: a `^` argument calls the endpoint again at every change. The endpoint `quote` prices 10 per piece, 8 from ten pieces on.

- **`quantity='^.quantity'`** triggers the call when the quantity changes and sends the new value.
- **`_delay=500`** calls 500 ms after the last change, once: typing `12` makes one call, not two.
- **`_onCalling`** is inline code that runs before the call, with the arguments: it writes the status.
- **`_onResult`** runs after the value is written at `result_path`, with the arguments and `result`.
- **Latest call wins.** A new trigger aborts the call in flight and its answer is dropped.

`_init=True` makes the first call when the page starts. The callbacks are inline code: the page needs a Content Security Policy that allows it.

**Try it:** Type 12 in the quantity and watch the status before and after the answer.
