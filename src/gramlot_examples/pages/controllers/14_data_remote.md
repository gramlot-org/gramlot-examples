# 14 · Data remote

`dataRemote(destination_path, method, cacheTime=None, **params)` makes a Data path a value computed by an endpoint of the page. The endpoint is called when the path is read, not when the page starts.

- **Declare the endpoint** as for `dataRpc`: Python `@endpoint`, with `**kwargs`; JavaScript `Page.registerEndpoint('load_menu')`.
- **A read never waits.** The paragraph `^.menu` reads the path: the read returns the current value, empty before the first call, and starts the call. The answer is written with the Data event, so the paragraph shows the menu.
- **`cacheTime`** is in seconds. `5` serves the stored value for five seconds, then the next read calls again. `None` or a negative value calls once; `0` calls at every read and writes the answer without the Data event.
- **`table='^.table'`** is an argument of the endpoint. After the first call, a change of a `^` argument loads the value again at once and the paragraph receives it.

**Try it:** Choose Drinks: the menu changes to the drinks that the server returns.
