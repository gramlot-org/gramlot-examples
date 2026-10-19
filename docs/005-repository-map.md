# Repository map

<!-- Document ID: GE-005 -->
<a id="ge-005-005"></a>

```text
gramlot-examples/
├── README.md                            Package entry point
├── LICENSE · NOTICE                     Apache 2.0
├── pyproject.toml                       PyPI gramlot-examples · hatchling · gramlot>=0.2.17
├── package.json                         npm @gramlot/gramlot-examples · @gramlot/gramlot>=0.2.17
├── src/gramlot_examples/
│   ├── __init__.py · py.typed           build_gallery
│   ├── index.js                         buildGallery
│   ├── catalog.json                     Common families
│   ├── pages/                           README · html_svg (e) · binding (b) · controllers (c)
│   └── gallery/                         Gallery page
│       ├── page.py · page.js            Python and JavaScript pages
│       ├── gallery-page.js · gallery.css    Browser-safe UI · stylesheet
│       ├── browser/                     UI scripts, bundled into dist/ (not published)
│       └── dist/                        Built bundle (npm run build)
├── scripts/
│   ├── build-browser.mjs                Builds gallery/dist/
│   ├── serve_pages.py · serve_pages.mjs Serve one pages folder with the core GramlotFileServer
│   ├── verify_pages_browser.mjs         Every page in Chromium, Python and JavaScript
│   └── verify_e10_e13_browser.mjs       e10 and e13 in Chromium
├── tests/                               Pages, gallery, build_gallery · Python/JS parity · fixtures/environment
├── .github/
│   ├── workflows/tests.yml              Node, Bun, Python 3.11/3.12 · browser, every page · core main (informative)
│   ├── workflows/publish.yml            Tag → GitHub release, PyPI, npm
│   └── release-notes/                   One file per version
├── docs/                                GE-005 · GE-010 gallery package
└── docs_llm/                            Concise mirrors
```

<a id="ge-005-010"></a>

## 010 · Build and publish the manual

The [Read the Docs manual](https://gramlot-examples.readthedocs.io/en/latest/)
builds from `main` using `.readthedocs.yaml`. It uses the classic Read the Docs
theme and the project logo. `scripts/prepare_docs.py` stages the README, the two
GE guides and every common lesson in catalogue order, with its Python and
JavaScript source (and CSS when present). The lesson text remains authored beside
the runnable pages; no second copy is maintained. Internal notes and concise
mirrors are not part of the site. The documentation build uses the serverless exporter as a build tool to package
every catalogue example with its own inspector palette, without the gallery shell or code pane.
Each lesson embeds its example before the detailed explanation. The small 🔍 button
opens the Inspector; the complete source remains below the lesson. Page Logic,
stylesheets, endpoints and remote fragments use the standard Worker export. It adds no serverless dependency
to the examples package. Sphinx copies the complete export unchanged through
`html_extra_path`; the iframe uses a relative URL within the manual version.

```sh
python -m pip install -r requirements-docs.txt
npm install --ignore-scripts --package-lock=false --no-save @gramlot/gramlot-serverless
npm run build
python scripts/prepare_docs.py
python -m sphinx -W --keep-going -b html build/docs-source build/docs-site
python scripts/check_docs.py
```

CI runs the same build and verifies local links, anchors, paired guide anchors and
coverage of all catalogue entries, including exactly one matching, lazily loaded
playground per lesson. To provision the hosted site, import the public
GitHub repository `gramlot-org/gramlot-examples` into Read the Docs under the slug
`gramlot-examples`, select `main` as the default branch and `latest` as the default
version, then enable the GitHub integration for rebuilds on pushes. The repository
configuration alone does not create the hosted project. Verify a successful build
and the public manual after importing it.
