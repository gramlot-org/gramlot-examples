# 13 · Cached remote

The control attributes of `remote` act on the requests of the element. The `article` has a variable datapath, as in binding example 02; the rules fragment depends only on the category of the product.

- **A change of the Data context** requests the fragment again: choosing another product moves the datapath of the `article`.
- **`_cachedRemote=True`** makes no request when the parameters equal those of the last request. Lamp and Spotlight share the category `lighting`: switching between them makes no request.
- **`_onRemote`** is inline code that runs after the fragment is mounted, with the parameters as locals: here it counts the mounted fragments and writes the status.
- **`_if` and `_else`** are the other control attributes: a false `_if` makes no request and runs `_else`.

The callbacks are inline code: the page needs a Content Security Policy that allows it.

**Try it:** Choose Spotlight, then Chair. Requests stays at 1 for Spotlight and becomes 2 for Chair.
