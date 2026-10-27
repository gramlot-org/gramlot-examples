# Typst and PDF

**Try this:** Edit the sample document and inspect its preview, then generate the PDF. Compilation runs locally; this example uses bundled fonts and no external includes.

CodeMirror and `typstPreview` share the same Data string. The optional `typst`
collection includes a browser Worker, WASM compiler/renderer and local fonts.
Source and preview sit side by side on a wide screen and stack on a narrow one.
SVG and PDF come from the current draft; a syntax error disables download and
shows the compiler diagnostic. The same page can be exported for serverless use.

The first port supports self-contained documents, not filesystem includes or
remote packages. Browser compilation uses Typst 0.14.2; the editor grammar supports
0.15 syntax, so a newer construct can be highlighted but rejected by the compiler.
The IDE adds Code and Preview tabs to `.typ` documents; saving still writes only
the source through the existing remote-edit gate.

**Sample data:** `05-typst_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.
