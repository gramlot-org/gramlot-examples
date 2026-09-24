# gramlot-examples

Collection of Gramlot example applications. Each application owns its packaging,
source, configuration profiles and tests below `apps/`.

| Language | Page | Execution checked |
| --- | --- | --- |
| Python | `apps/hello-world/src/gramlot_example_app/pages/index.py` | Neutral Python Host loading and typed Source |
| JavaScript | `apps/hello-world/js/pages/index.js` | FileHost and browser runtime under Node.js and Bun/jsdom |

[Repository map](docs/005-repository-map.md).

The first application is [Hello World](apps/hello-world/README.md). Its existing
Python and JavaScript package names are preserved. The Uvicorn, FastAPI, Kajenn
and Flask launchers are runnable native HTML server profiles. Database profiles
remain placeholders.
