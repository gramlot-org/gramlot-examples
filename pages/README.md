# Local Gramlot examples

The [runner](00-runner/README.md) presents the same examples in Python and
JavaScript, in three families:

- [`html_svg/`](html_svg/): thirteen HTML and SVG pages, without binding.
- [`binding/`](binding/): eleven pages whose DOM follows the Data through pointers,
  editing, booleans, style, SVG and freeze. The last three take the content of
  `html_svg` examples 06, 08 and 12 and add the binding.
- [`controllers/`](controllers/): nine pages with formulas, controllers, named
  logic in a companion `NN_name_aux.js`, inline expressions, node methods, buttons,
  events, remote Source and the end-to-end story of Gramlot 0.2.0.

Each example is a file page: `NN_name.py`, its JavaScript equivalent `NN_name.js`,
its README `NN_name.md`, and where needed a same-name stylesheet `NN_name.css` and a
logic companion `NN_name_aux.js`. The runner uses only what the minimal `FileHost`
serves: `Page.css`, the same-name companions and the companion's root logic group.

This directory is development material. It runs against the current Gramlot
checkout and the local Uvicorn and Node.js integration checkouts; it is not a
published application or a package release. Shared visual styling lives in
[`../themes/gramlot-base/`](../themes/gramlot-base/).
