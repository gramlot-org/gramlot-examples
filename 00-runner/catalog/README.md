# Native HTML catalogue

> Historical specimen: removed from the runner by owner decision on 2026-09-24.

The runner opens this catalogue first. `page.py` and `page.js` build equivalent Gramlot Source trees using the same native HTML grammar and shared `/themes/gramlot-base/theme.css`. A small local stylesheet keeps the open, nonmodal dialog in the specimen card. The page contains static content and browser-native controls. It has no event handlers, direct DOM construction, fetch calls, or parallel state. Reset and `<details>` use built-in browser behavior; submission is disabled. The two page variants are separate authoring-language examples, not two scripts running on the same page.

The catalogue is a specimen of the **current grammar**, not a claim that all elements are Gramlot components. The grammar source is [`src/gramlot/collections/html5.json`](../../../src/gramlot/collections/html5.json). Python and JavaScript Source nodes expose `label` as a node property, so the documented dialect-prefix method `gramlot_label(...)` authors the HTML `<label>` element. The same prefix is used for `<data>`.

## Coverage inventory

| Category | Grammar elements | Treatment |
| --- | --- | --- |
| Text and phrasing | `a`, `abbr`, `b`, `bdi`, `bdo`, `blockquote`, `br`, `cite`, `code`, `data`, `del_` (`<del>`), `dfn`, `em`, `h1`–`h6`, `i`, `ins`, `kbd`, `mark`, `p`, `pre`, `q`, `s`, `samp`, `small`, `span`, `strong`, `sub`, `sup`, `time`, `u`, `var`, `wbr` | Rendered in the text section with valid text or child content. |
| Landmarks, sections, and lists | `address`, `article`, `aside`, `dd`, `details`, `dialog`, `div`, `dl`, `dt`, `footer`, `header`, `hgroup`, `hr`, `li`, `main`, `menu`, `nav`, `ol`, `search`, `section`, `summary`, `ul` | Rendered in semantic contexts. The dialog is nonmodal and open, so it needs no script. |
| Forms and state | `button`, `datalist`, `fieldset`, `form`, `input`, `label`, `legend`, `meter`, `optgroup`, `option`, `output`, `progress`, `select`, `textarea` | Rendered with labels, default/selected values, required, read-only, checked, disabled, multiple, and Reset states. Native input kinds include text, email, search, URL, telephone, password, number, date, time, local date-time, month, week, color, range, file, checkbox, and radio. `output` is static here. |
| Tables | `caption`, `col`, `colgroup`, `table`, `tbody`, `td`, `tfoot`, `th`, `thead`, `tr` | Rendered as a small report with scoped row and column headings. |
| Images and graphics | `area`, `figcaption`, `figure`, `img`, `map`, `picture`, `source`, `svg` | Rendered using repository mark assets, a two-region image map, and the SVG sub-builder. The runner serves `/assets/branding/`. |
| Document and resource metadata | `base`, `body`, `head`, `html`, `link`, `meta`, `title` | Owned by the runner's document shell, not inserted inside a Source body. The page title and stylesheet are exposed through `Page.title` and `Page.css`. |
| Runner-owned | `iframe` | The runner renders two named iframes that host the Python and JavaScript examples. |
| Resource-dependent or context-specific | `audio`, `canvas`, `embed`, `object`, `track`, `video` | Omitted. A working sample would need a real media file, drawable canvas behavior, or embedded resource; empty tags would give a misleading specimen. |
| Executable, inert, or specialized | `noscript`, `script`, `slot`, `style`, `template`, `selectedcontent` | Omitted. The runner requires script execution; the other tags need a host-controlled style, component, or template context. `selectedcontent` is tied to customizable select behavior, which this catalogue does not claim. |
| Ruby annotation | `ruby`, `rp`, `rt` | Omitted because the current grammar rejects `rp` and `rt` as children of `ruby`; this needs a grammar correction in Gramlot before a valid sample can be authored. |
| Gramlot data declarations | `dataSetter`, `dataFormula`, `dataController` | Grammar entries but not native HTML elements. Their contracts belong to separate behavioral examples. |

The visible catalogue covers the useful static native elements without inventing application behavior. The `source` tag is shown only inside `<picture>`; audio/video source and track combinations await actual media assets. The SVG example uses the SVG sub-builder's `circle` and `rect` nodes.
