# Repository map

<!-- Document ID: GE-005 -->
<a id="ge-005-005"></a>

```text
gramlot-examples/
├── README.md                            Package entry point
├── LICENSE · NOTICE                     Apache 2.0
├── pyproject.toml                       PyPI gramlot-examples · hatchling · gramlot>=0.2.14
├── package.json                         npm @gramlot/gramlot-examples · @gramlot/gramlot>=0.2.14
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
├── tests/                               Pages, gallery, build_gallery · fixtures/environment
├── .github/
│   ├── workflows/tests.yml              Node, Bun, Python 3.11/3.12 · browser, every page · core main (informative)
│   ├── workflows/publish.yml            Tag → GitHub release, PyPI, npm
│   └── release-notes/                   One file per version
├── docs/                                GE-005 · GE-010 gallery package
└── docs_llm/                            Concise mirrors
```
