# gramlot-examples

The common example pages of [Gramlot](https://github.com/gramlot-org/gramlot), the
gallery page that presents them, and its catalogue. Published as a package that
depends only on the Gramlot core:

```sh
pip install gramlot-examples
npm install @gramlot/gramlot-examples
```

[![PyPI](https://img.shields.io/pypi/v/gramlot-examples)](https://pypi.org/project/gramlot-examples/)
[![npm](https://img.shields.io/npm/v/@gramlot/gramlot-examples)](https://www.npmjs.com/package/@gramlot/gramlot-examples)

Current release: 0.2.8.

The repositories of the family are described in
[The Gramlot family](https://github.com/gramlot-org/gramlot/blob/main/docs/public/055-family.md)
(GC-055).

## Pages

[`src/gramlot_examples/pages/`](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/README.md) holds three
families. Each example is a Python page and its JavaScript equivalent, with a
same-name README:

- `html_svg/`: thirteen HTML and SVG pages, without binding (`e01`–`e13`);
- `binding/`: eleven pages whose DOM follows the Data (`b01`–`b11`);
- `controllers/`: eight pages with formulas, controllers, named logic, events and
  the end-to-end story (`c01`–`c08`).

Each `NN_name.js` exports `Page` and `Logic`; the Python page `NN_name.py` takes its
`Logic` from the module beside it.

## Gallery

The gallery page lists the families and opens each example beside its README and
source. `build_gallery` (Python) and `buildGallery` (JavaScript) return its routes and
static assets; each environment (`gramlot-py-server`, `gramlot-js-server`) serves the
gallery with its own host and can add its own catalogue. Guide:
[GE-010](https://github.com/gramlot-org/gramlot-examples/blob/main/docs/010-gallery.md).

```sh
npm install --no-package-lock
npm run build
npm test
python -m unittest discover -s tests
```

[Repository map](https://github.com/gramlot-org/gramlot-examples/blob/main/docs/005-repository-map.md) (GE-005).
