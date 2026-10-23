# Typst: editor, preview and PDF

CodeMirror and `typstPreview` share the same Data string. The optional `typst`
collection includes a browser Worker, WASM compiler/renderer and local fonts.
SVG and PDF come from the current draft; a syntax error disables download and
shows the compiler diagnostic. The same page can be exported for serverless use.

The first port supports self-contained documents, not filesystem includes or
remote packages. Browser compilation uses Typst 0.14.2; the editor grammar supports
0.15 syntax, so a newer construct can be highlighted but rejected by the compiler.
The IDE adds Code and Preview tabs to `.typ` documents; saving still writes only
the source through the existing remote-edit gate.
