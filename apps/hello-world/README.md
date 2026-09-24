# Hello World

One Hello World page authored equivalently in Python and JavaScript. The example
uses Gramlot typed Source and neutral host contracts; it does not import, connect
or query a database. Install the Gramlot core 0.1.0 archive and the current local integration packages
before running package commands. The published 0.1.0 archive list is in
[GC-135](https://github.com/gramlot-org/gramlot/blob/main/docs/internal/135-release-handoff.md);
Minimal, Kajenn and Django native alignment here remains development work.

## Python package

With the Gramlot 0.1.0 wheel already installed:

```sh
python -m pip install .
python -m unittest discover -s tests
```

Distribution: `gramlot-example-app`; import package: `gramlot_example_app`.
Install the locally built Django, FastAPI, Flask, Kajenn and Minimal wheels together before
installing this application's `python-hosts` extra. Then launch any one of the
five executable configurations:

```sh
python -m pip install '.[python-hosts]'
python -m gramlot_example_app.server.uvicorn
python -m gramlot_example_app.server.fastapi
python -m gramlot_example_app.server.kajenn
python -m gramlot_example_app.server.flask
python -m gramlot_example_app.server.django
```

All five use the same installed Python page and packaged Gramlot browser runtime.
They do not configure or import a database adapter.

For a real-browser check, start one profile and run:

```sh
node scripts/verify_python_browser.mjs URL PLAYWRIGHT_ENTRY CHROMIUM
```

Use the server root as `URL` for Uvicorn, FastAPI and Flask, and `/page/` for Kajenn. Use `/hello/` for Django. The verifier asserts one Hello World heading, no browser page errors and
an empty renderer/root after disposal.

## JavaScript package

The JS page imports `Page` from `@gramlot/native-html/page` and has no Python
process dependency. Once the required framework packages are available:

```sh
npm test
bun run test:bun
```

These checks exercise the neutral host and DOM lifecycle. The Python launchers
above provide Minimal ASGI/Uvicorn, FastAPI, actual Kajenn, Flask and Django profiles.

## Current local dependency verification

The Gramlot 0.1.0 archives are published on GitHub. Build local wheels and npm
archives for this developing integration graph, then install them before the
commands above. The new Minimal and Kajenn package names are not published
registries or GitHub releases. Do not save local paths or first-party version pins
into manifests. No application source imports a sibling checkout.

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
needed to open the result. `@gramlot/minimal` owns packaging; Gramlot owns Page,
WorkerHost and live Source. Python pages continue to require a Python server.
The old Python standalone compiler and project TOML format are not used.

Verified locally with the installed exporter tarball and Chrome: Hello World,
Source updates/insertion/deletion and Worker termination, with HTTP(S) blocked.
No database or reactive Data binding is included.

Local verification, 2026-09-24: the installed Minimal/Uvicorn and Django profiles
serve Hello World and the runtime asset; the Django development server passes
the Chromium browser check with one heading and clean disposal. The standalone
Worker HTML built from locally installed npm archives passes Chromium with live
Source, no HTTP(S) and clean Worker disposal.
