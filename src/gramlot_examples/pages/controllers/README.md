# Controllers

The pages of this family run code when the Data changes.

`dataFormula` computes a value and writes it to its result path. `dataController` runs code for its effects. A button runs a nested controller at every click; `connect_on<event>` attributes connect other DOM events. The code is inline in the page, or a method of the `Logic` class that the page module `NN_name.js` exports; the Python page takes it from there.

Inline code needs a Content Security Policy that allows it. Named logic in the `Logic` class also runs under a strict policy.

Start with **Formula** and **Controller**, then move the code to the `Logic` class with **Named logic**. The last page is the end-to-end story of Gramlot 0.2.0: every piece of the two families on one page.

Each example has a Python page and its JavaScript equivalent. Both use the `Logic` class of the JavaScript module.
