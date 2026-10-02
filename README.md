# gramlot-examples

Example pages, the local example runner and example applications for
[Gramlot](https://github.com/gramlot-org/gramlot). The repositories of the family
are described in
[The Gramlot family](https://github.com/gramlot-org/gramlot/blob/main/docs/public/055-family.md)
(GC-055).

## Pages

[`pages/`](pages/README.md) holds three families. Each example is a Python page and
its JavaScript equivalent, with a same-name README:

- [`html_svg/`](pages/html_svg/): thirteen HTML and SVG pages, without binding (routes `e01`–`e13`);
- [`binding/`](pages/binding/): eleven pages whose DOM follows the Data (routes `b01`–`b11`);
- [`controllers/`](pages/controllers/): nine pages with formulas, controllers, logic
  companions, events and remote Source (routes `c01`–`c09`).

## Runner

[`runner/`](runner/) serves every page under `/py/` and `/js/` behind one local
address, beside its README and source. Guide: [GE-010](docs/010-runner.md).

```sh
npm install
npm test
```

The Python part of the runner depends on `gramlot-py-server[uvicorn]`; its test is
skipped while that package is not installed.

## Applications

[Hello World](apps/hello-world/README.md) is a self-contained application:

| Language | Page | Execution checked |
| --- | --- | --- |
| Python | `apps/hello-world/src/gramlot_example_app/pages/index.py` | Neutral Python Host loading and typed Source |
| JavaScript | `apps/hello-world/js/pages/index.js` | FileHost and browser runtime under Node.js and Bun/jsdom |

The JavaScript launchers use `@gramlot/gramlot-js-server`. The Python launchers
(Uvicorn, FastAPI, Kajenn, Flask, Django) move to `gramlot-py-server` when it is
published. Database profiles remain placeholders.

[Repository map](docs/005-repository-map.md) (GE-005).
