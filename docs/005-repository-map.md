# Repository map

<!-- Document ID: GE-005 -->
<a id="ge-005-005"></a>

```text
gramlot-examples/
├── README.md                            Package entry point
├── LICENSE · NOTICE                     Apache 2.0
├── pyproject.toml                       PyPI gramlot-examples · hatchling · gramlot>=0.2.2
├── package.json                         npm @gramlot/gramlot-examples · @gramlot/gramlot>=0.2.2
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
├── scripts/build-browser.mjs            Builds gallery/dist/
├── tests/                               Pages, gallery, build_gallery · fixtures/environment
├── apps/hello-world/                    Application, until its launchers move to the adapters
├── .github/
│   ├── workflows/tests.yml              Node, Bun, Python 3.11/3.12 · core main (informative)
│   ├── workflows/publish.yml            Tag → GitHub release, PyPI, npm
│   └── release-notes/                   One file per version
├── docs/                                GE-005 · GE-010 gallery package
└── docs_llm/                            Concise mirrors
```
