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

Current release: 0.2.16.

[Documentation and learning sequence](https://gramlot-examples.readthedocs.io/en/latest/)
include every lesson, its Python and JavaScript source, and the gallery guide.
To run the examples, choose the [Python server](https://gramlot-py-server.readthedocs.io/en/latest/),
[Node.js/Bun server](https://gramlot-js-server.readthedocs.io/en/latest/010-tutorial.html)
or [serverless exporter](https://gramlot-js-server.readthedocs.io/en/latest/135-serverless-tutorial.html).

The repositories of the family are described in
[The Gramlot family](https://github.com/gramlot-org/gramlot/blob/main/docs/public/055-family.md)
(GC-055).

## Updating

Choose [packaged or source-checkout updates](docs/010-gallery.md#ge-010-050). A Python gallery installed from source also needs its JavaScript bundles rebuilt; updating Python files alone does not update the footer inspector.

## Pages

[`src/gramlot_examples/pages/`](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/README.md) holds three
families. Each example is a Python page and its JavaScript equivalent, with a
same-name README:

- `html_svg/`: thirteen HTML and SVG pages, without binding (`e01`–`e13`);
- `binding/`: eleven pages whose DOM follows the Data (`b01`–`b11`);
- `controllers/`: twenty-one pages with formulas, controllers, named logic, events, the
  end-to-end story, `dataRpc` calls to the endpoints of the page, `remote` fragments and
  `dataRemote` values (`c01`–`c21`). Later lessons introduce topics, authored references, native ask,
  parent/child messages, plain HTML buttons and delayed Gramlot clicks. The package
  requires core 0.2.20 or later; each lesson states which features it uses.

Each `NN_name.js` exports `Page` and `Logic`; the Python page `NN_name.py` takes its
`Logic` from the module beside it.

## Gallery

The gallery page lists the families and opens each example beside its README and
source. `build_gallery` (Python) and `buildGallery` (JavaScript) return its routes and
static assets; each environment (`gramlot-py-server`, `gramlot-js-server`) serves the
gallery with its own server and can add its own catalogue. Guide:
[GE-010](https://github.com/gramlot-org/gramlot-examples/blob/main/docs/010-gallery.md).

```sh
npm install --no-package-lock
npm run build
npm test
python -m unittest discover -s tests
```

[Repository map](https://github.com/gramlot-org/gramlot-examples/blob/main/docs/005-repository-map.md) (GE-005).
