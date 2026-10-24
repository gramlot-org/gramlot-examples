# Edit HTML: source, preview and rich text

**Sample data:** `03-html_data.tytx` supplies the initial Bag for both Python and JavaScript. Interface controls use defaults where shown; edits and remote updates use the normal Data bindings.

`codeMirror`, `htmlPreview` and `htmlEditor` bind to the same HTML string in Data.
The preview uses a sandboxed iframe without script execution. Jodit edits the body;
head content, document attributes and protected body blocks survive visual edits.
Protected blocks must be changed in Code. Rich edits use DOM serialization, so
formatting of HTML source can change. Neither view executes Python or JavaScript.
