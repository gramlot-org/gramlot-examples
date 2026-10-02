# Application map

<!-- Document ID: GE-005 -->
<a id="ge-005-005"></a>

```text
gramlot-examples/
├── README.md                            Collection entry point
├── LICENSE · NOTICE                     Apache 2.0
├── package.json                         Runner and pages · published JS packages
├── pyproject.toml                       Runner Python dependencies
├── pages/                               Example pages · Python and JS pairs
│   ├── README.md                        The three families
│   ├── html_svg/                        e01–e13 · HTML and SVG without binding
│   ├── binding/                         b01–b11 · Data binding
│   └── controllers/                     c01–c09 · Formulas, controllers, logic companions
├── runner/                              Local example runner
│   ├── serve.py                         Python launcher · one public address
│   ├── server.mjs                       Node/Bun host behind /js/
│   ├── page.py · page.js · runner-page.js   Runner page in both languages
│   ├── catalog.json · catalog/          Families, titles · HTML catalogue page
│   ├── browser/                         Runner UI scripts · build-browser.mjs → dist/
│   ├── build-standalone.mjs             Static export of the HTML / SVG family
│   └── tests/                           Pages, runner UI, Node host, Python launcher
├── scripts/                             Browser checks with Playwright
├── apps/
│   └── hello-world/                     First self-contained application
│       ├── README.md                    Usage, limits and verification
│       ├── pyproject.toml               Python distribution
│       ├── package.json                 JavaScript distribution · hosts · standalone build
│       ├── src/gramlot_example_app/     Python page and five host launch profiles
│       ├── js/                          JS page · Node/Bun launchers · DB placeholders
│       └── tests/test_page.py           Python Host → Source
├── .github/workflows/tests.yml          CI · Node, Bun, Python, core main
├── docs/                                Collection documentation · GE-010 runner guide
└── docs_llm/                            Concise mirrors
```
