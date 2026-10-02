# gramlot-examples

The common example pages of [Gramlot](https://github.com/gramlot-org/gramlot), the
gallery page that presents them, and its catalogue. Published as a package that
depends only on the Gramlot core:

```sh
pip install gramlot-examples
npm install @gramlot/gramlot-examples
```

The repositories of the family are described in
[The Gramlot family](https://github.com/gramlot-org/gramlot/blob/main/docs/public/055-family.md)
(GC-055).

## Pages

[`src/gramlot_examples/pages/`](src/gramlot_examples/pages/README.md) holds three
families. Each example is a Python page and its JavaScript equivalent, with a
same-name README:

- `html_svg/`: thirteen HTML and SVG pages, without binding (`e01`–`e13`);
- `binding/`: eleven pages whose DOM follows the Data (`b01`–`b11`);
- `controllers/`: nine pages with formulas, controllers, logic companions, events and
  remote Source (`c01`–`c09`).

## Gallery

The gallery page lists the families and opens each example beside its README and
source. `build_gallery` (Python) and `buildGallery` (JavaScript) return its routes and
static assets; each environment (`gramlot-py-server`, `gramlot-js-server`) serves the
gallery with its own host and can add its own catalogue. Guide:
[GE-010](docs/010-gallery.md).

```sh
npm install --no-package-lock
npm run build
npm test
python -m unittest discover -s tests
```

## Applications

[Hello World](apps/hello-world/README.md) stays here until its launchers move to the
adapters as their quick-start examples. Its JavaScript launchers use
`@gramlot/gramlot-js-server`; its Python launchers wait for `gramlot-py-server`.
Database profiles remain placeholders.

[Repository map](docs/005-repository-map.md) (GE-005).
