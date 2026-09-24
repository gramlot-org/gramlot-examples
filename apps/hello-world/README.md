# Hello World

One Hello World page authored equivalently in Python and JavaScript. The example
uses Gramlot typed Source and neutral host contracts; it does not import, connect
or query a database. Install the locally prepared native core and adapter
artifacts before running package commands. The complete artifact order and
clean-consumer installation are in [GC-135](https://github.com/gramlot-org/gramlot/blob/main/docs/internal/135-release-handoff.md).

## Python package

With the local Gramlot 0.1.0 wheel already installed:

```sh
python -m pip install .
python -m unittest discover -s tests
```

Distribution: `gramlot-example-app`; import package: `gramlot_example_app`.
Install the locally built FastAPI, Flask and Genro ASGI wheels together before
installing this application's `python-hosts` extra. Then launch any one of the
four executable configurations:

```sh
python -m pip install '.[python-hosts]'
python -m gramlot_example_app.server.uvicorn
python -m gramlot_example_app.server.fastapi
python -m gramlot_example_app.server.kajenn
python -m gramlot_example_app.server.flask
```

All four use the same installed Python page and packaged Gramlot browser runtime.
They do not configure or import a database adapter.

For a real-browser check, start one profile and run:

```sh
node scripts/verify_python_browser.mjs URL PLAYWRIGHT_ENTRY CHROMIUM
```

Use the server root as `URL` for Uvicorn, FastAPI and Flask, and `/page/` for
Kajenn. The verifier asserts one Hello World heading, no browser page errors and
an empty renderer/root after disposal.

## JavaScript package

The JS page imports `Page` from `@gramlot/native-html/page` and has no Python
process dependency. Once the required framework packages are available:

```sh
npm test
bun run test:bun
```

These checks exercise the neutral host and DOM lifecycle. The Python launchers
above provide raw ASGI/Uvicorn, FastAPI, actual Kajenn and Flask profiles.

## Current local dependency verification

The native core 0.1.0 wheel and npm archive have been locally prepared. Build or
obtain the exact local package archives for the current first-party graph, then
install them before the commands above; ordinary registry installation has not
been verified or published. Do not save local paths or version pins into manifests.
No application source imports a sibling checkout.

## Deferred work

BagDB is the first planned database profile. SQLAlchemy and GenroPy `GnrApp.db`
remain later Python placeholders. The profile directories contain no adapter
implementations, connections, migrations, tables or queries.


## JavaScript hosts

After installing the local package graph, run `npm run start:node` or
`npm run start:bun` from this application directory. Installed package commands
are `gramlot-hello-node` and `gramlot-hello-bun`. Both use the same JS page and
reusable `gramlot-nodejs` adapter, with `HOST`/`PORT` configuration (defaults
127.0.0.1:8080). No Python worker or database is required.

The browser verification command is:

```sh
node js/tests/browser.mjs NODE BUN PLAYWRIGHT_ENTRY CHROMIUM
```

Database directories are placeholders. Host launcher directories contain runnable
configuration; adapter implementations live in their own packages.


## Standalone JavaScript

The same JS page also runs in a dedicated browser Worker. After installing the
local package graph, run:

```sh
npm run build:standalone
```

Open `dist/hello-world.html` from disk. Node is used for packaging; no server is
needed to open the result. `@gramlot/standalone` owns packaging; Gramlot owns Page,
WorkerHost and live Source. Python pages continue to require a Python server.
The old Python standalone compiler and project TOML format are not used.

Verified locally with the installed exporter tarball and Chrome: Hello World,
Source updates/insertion/deletion and Worker termination, with HTTP(S) blocked.
No database or reactive Data binding is included.
