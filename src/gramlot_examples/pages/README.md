# Gramlot examples

Learn the current framework by building up one concept at a time: Source, Data
HTML/SVG, input components, Data binding, behavior and containers. The lesson order follows
learning prerequisites, not the release chronology.

## A route through the lessons

| Topic | Start here |
| --- | --- |
| [HTML and SVG](00-html_svg/README.md) | HTML tags and SVG, declared through Source. |
| [Fields and input widgets](01-inputs/README.md) | Richer fields, typed values and shared validation. |
| [Data and bindings](02-binding/README.md) | Paths, defaults and reactive values. |
| [Logic, actions and events](03-controllers/README.md) | Formulas, Logic and events. |
| [RPC and data exchange](04-rpc/README.md) | Server calls, remote Source and lazy Data. |
| [Containers and layout](05-containers/README.md) | Regions, tabs, windows and tray workspaces. |
| [Menus and toolbars](05-menus/README.md) | One command hierarchy, several presentations. |
| [Grid](05-grid/README.md) | Progressive Bag grid examples, from basic columns to a complete FrameGrid. |
| [Document and code editors](06-editors/README.md) | Document content, editing and previews. |
| [Tools](07-tools/README.md) | Inspect and compose Source; Python adds a sample IDE. |
| [Grouplets](09-grouplets/README.md) | Remote fragments, separate instances and nested content. |
| [Composition and reuse](08-composition/README.md) | Reuse small helpers under different datapaths. |

Each lesson says what to observe and provides complete Python and JavaScript
source. Start with its small example, change one value, then compare the visible
result with Source and Data. The same concept can return in a richer composition.

## Run an example here

Read the lesson, then use its embedded Gramlot playground. Open it in a separate
tab for a wider workspace. The Inspector button exposes its Data and Source.
The documentation build exports real JavaScript Page/Logic modules through the
standard serverless exporter; it does not execute a Python web server inside
Read the Docs. Its Python source shows the equivalent authoring declarations.

Use the local Python gallery for Python endpoints, filesystem features and the
examples that require a live Python host. A browser Worker can execute its own exported
JavaScript handlers; it does not provide a secret store or database connection.

## Use the gallery

Choose a lesson in the navigation tree. **Example** shows the running page;
**Explanation** describes what to try. **Code** shows the authoring source; its internal handle detaches it into a floating window.
In **Settings**, choose Theme, Colors and Color mode independently. Compact,
Mimi and Joanna provide different densities; color changes do not discard Data.

The drawer lesson's **Guide** starts closed. Click its visible handle to open or
close it; keeping it closed leaves the whole preview available for experimentation.
Closing a region or changing tabs preserves the controls according to the owning
container's contract. Application Save/Cancel semantics remain application logic.

## Look up a component or extend the framework

See the [feature coverage checklist](../../../docs/035-feature-coverage.md) for
what the lessons teach, what is only used, and what is still missing. Presence in
the catalogue is not proof that an example is simple or fully tested.

- [Widget and parameter reference](https://gramlot.readthedocs.io/en/latest/docs/public/345-widget-reference.html): declarations, defaults, bindings and collections.
- [Components and collections](https://gramlot.readthedocs.io/en/latest/docs/public/340-components-and-collections-guide.html): JS definitions, generated Python descriptors, resources and overrides.
- [Menus, toolbars, frames and windows](https://gramlot.readthedocs.io/en/latest/docs/public/350-menus-toolbars-and-windows.html): shared commands and window composition.
- [Themes and CSS](https://gramlot.readthedocs.io/en/latest/docs/public/096-themes-and-css.html): density, palette, labels and shared tokens.

Use matching core, examples and host packages when comparing a local installation
with this manual. Historical engineering records are not the learning path.

## Setup and use

The [Python server manual](https://gramlot-py-server.readthedocs.io/en/latest/)
and [JavaScript server manual](https://gramlot-js-server.readthedocs.io/en/latest/)
own installation and startup. This package supplies the pages, gallery and
catalogue, and depends on the Gramlot core; it contains no web server.

Each common lesson has `.py`, `.js` and `.md` files and optional `.css`. JavaScript
modules export Page and Logic; Python pages reuse the browser Logic. Endpoints,
remote fragments and named methods follow the shared Gramlot contracts.

## Current teaching limits

The examples are learning tools, not complete business applications. They do not
supply login policy, database persistence or a record/form framework. Check the
lesson's endpoint requirements and the selected environment. Inline JavaScript
examples also require a compatible CSP; a named-Logic-only deployment must use
named Logic rather than simply enabling inline execution.
