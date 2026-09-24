# Native HTML and SVG examples

Twelve paired Gramlot pages introduce native Source authoring in Python first, then JavaScript. Each directory has a `Page` in `page.py` and `page.js`; the shared stylesheet lives at `../../themes/gramlot-base/theme.css`.

From the repository root, run `.venv/bin/python examples/00-runner/serve.py` after completing the runner prerequisites. Open `http://127.0.0.1:8080/` and choose either language view. See the [runner README](../00-runner/README.md) for setup. The runner provides the host and source views; these files are page modules rather than standalone scripts.

| # | Example | Focus |
| --- | --- | --- |
| 01 | [Hello world](01_hello_world/README.md) | A minimal Page with one main landmark, heading and paragraph. |
| 02 | [Text and links](02_text_and_links/README.md) | Text hierarchy, mixed inline content, quotation, code and two kinds of link. |
| 03 | [Lists](03_lists/README.md) | Ordered, unordered and description lists from local data. |
| 04 | [A semantic page](04_semantic_page/README.md) | Landmarks and sectioning elements with meaningful navigation. |
| 05 | [Tables](05_tables/README.md) | A data table with caption, scoped headers and computed totals. |
| 06 | [Native forms](06_forms/README.md) | Native inputs, labels, selects, states and buttons. |
| 07 | [Disclosure and measures](07_native_disclosure/README.md) | Native details/summary plus static progress and meter. |
| 08 | [SVG shapes](08_svg_shapes/README.md) | Six SVG primitives in one accessible viewport. |
| 09 | [SVG composition](09_svg_composition/README.md) | A scene composed from repeated SVG groups, paths and helper methods. |
| 10 | [Cards with icons](10_cards_with_icons/README.md) | Responsive HTML cards with native SVG icon drawings. |
| 11 | [Static report](11_static_report/README.md) | A summary, SVG bar chart, visible legend and table from one local dataset. |
| 12 | [A complete page](12_complete_page/README.md) | A composed event page with sections, schedule, speakers, schematic map and FAQ. |

The pages keep their data local and rely on Gramlot Source for the interface. They use native browser behavior only where HTML itself provides it, such as disclosure and form reset. The JavaScript examples require the repository JavaScript dependencies; the runner README covers setup.
