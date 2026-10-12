# 12 · Remote

`remote` makes the content of an element a Source fragment that a method of the page builds on the server. The node method `remote(name, **params)` writes it on the element.

- **Declare the fragment.** Python marks the method with `@source`; JavaScript calls `Page.registerSource('details')` after the class. The method receives the root of the fragment and the parameters, and populates the root.
- **Parameters.** `record_id='^.record_id'` is a parameter of the call. A `^` parameter requests the fragment again at every change; a `=` parameter is only read.
- **When.** The fragment is requested when the element starts. The authored content, `Waiting for the server`, stays until the first fragment arrives; each fragment replaces the content of the element.
- **`**kwargs`.** A Python fragment method declares `**kwargs`, as a Python endpoint does.
- **Latest wins.** A new request supersedes the one in flight; removing the element cancels its request.

The request travels as one envelope on `POST /gramlot/rpc`; the page writes no `fetch`.

**Try it:** Choose another record: the section shows the name and the stock that the server returns for it.
