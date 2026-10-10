# 11 · Call on click

A `dataRpc` nested in a `button` is the click mechanism of the button: each click calls the endpoint. A button has one mechanism, as in example 06.

- **`_onError`** is inline code that runs when the call fails, with the arguments and `error`. `error.code` is the outcome, `error.message` the message of the server, `error.remoteName` the name of the exception (`LookupError` in Python, `Error` in JavaScript).
- **An endpoint that raises.** `reserve` raises: the outcome is `application_error` and nothing is written at `result_path`.
- **A protected endpoint.** `cancel` declares the rule `auth="admin"` (Python `@endpoint(auth="admin")`, JavaScript `Page.registerEndpoint('cancel', {auth: 'admin'})`). A server without the `auth` capability knows no identity: the call answers `not_authenticated` and the method does not run.

Without `_onError` the failure reaches the browser console as an unhandled rejection.

**Try it:** Press each button and read the error.
