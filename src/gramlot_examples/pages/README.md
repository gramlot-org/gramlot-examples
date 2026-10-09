# Gramlot examples

The [gallery](https://github.com/gramlot-org/gramlot-examples/blob/main/docs/010-gallery.md) presents the same examples in Python and
JavaScript, in three families:

- [`html_svg/`](html_svg/): thirteen HTML and SVG pages, without binding.
- [`binding/`](binding/): eleven pages whose DOM follows the Data through pointers,
  editing, booleans, style, SVG and freeze. The last three take the content of
  `html_svg` examples 06, 08 and 12 and add the binding.
- [`controllers/`](controllers/): eleven pages with formulas, controllers, named
  logic in the `Logic` class of the page module, inline expressions, node methods, buttons,
  events, the end-to-end story and `dataRpc` calls to the endpoints of the page.

Each example is a file page: `NN_name.py`, its JavaScript equivalent `NN_name.js`,
its README `NN_name.md`, and where needed a same-name stylesheet `NN_name.css`.
`NN_name.js` exports `Page` and `Logic`: the JavaScript page uses both, the Python
page takes `Logic` from it. The pages use only what the core `GramlotFileServer` serves:
`Page.css`, the same-name stylesheet, the `Logic` of the page module and the endpoints
of the page. The gallery
adds its own files: the frame script, a staged `<key>_aux.js` per example and its
assets ([GE-010 §025](https://github.com/gramlot-org/gramlot-examples/blob/main/docs/010-gallery.md#ge-010-025)).

The pages depend only on the Gramlot core. Shared visual styling is the
`gramlot-base` theme shipped in the core package, served by each environment at
`/themes/gramlot-base/theme.css`.
