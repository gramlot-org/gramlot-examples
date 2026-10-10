# 09 · Endpoint

An endpoint is a method of the page that the browser calls for a value. `dataRpc(method, result_path, **parameters)` calls it and writes the answer at `result_path`.

- **Declare the endpoint.** Python marks the method with `@endpoint`; JavaScript calls `Page.registerEndpoint('with_vat')` after the class.
- **Arguments.** The other attributes of the `dataRpc` are the arguments of the call: `price` and `rate`, read here from the Data with `=`. Python receives them as keywords, JavaScript as one object.
- **`**kwargs`.** `dataRpc` sends every attribute the author writes, and Python rejects a keyword the method does not declare. A Python endpoint called from `dataRpc` declares `**kwargs`.
- **`_init=True`** calls the endpoint once when the page starts, after the setters. The total is Data: the `dd` shows it through `^.gross`.

The call travels as one envelope on `POST /gramlot/rpc`; the page writes no `fetch`.

**Try it:** Open the browser network panel and reload: one call to `/gramlot/rpc` carries `with_vat` with price 12.5 and rate 22.
