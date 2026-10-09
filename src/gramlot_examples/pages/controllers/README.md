# Controllers

The pages of this family run code when the Data changes.

`dataFormula` computes a value and writes it to its result path. `dataController` runs code for its effects. `dataRpc` calls an endpoint of the page on the server and writes the answer to its result path. A button runs a nested controller at every click; `connect_on<event>` attributes connect other DOM events. The code is inline in the page, or a method of the `Logic` class that the page module `NN_name.js` exports; the Python page takes it from there.

Inline code needs a Content Security Policy that allows it. Named logic in the `Logic` class also runs under a strict policy.

Start with **Formula** and **Controller**, then move the code to the `Logic` class with **Named logic**. **End-to-end story** puts every piece of the two families on one page. The last three pages call the server: **Endpoint**, **Call on change** and **Call on click**.

Each example has a Python page and its JavaScript equivalent. Both use the `Logic` class of the JavaScript module. An endpoint is a method of the page in each language: Python `@endpoint`, JavaScript `Page.registerEndpoint`.
