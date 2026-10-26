# Edit HTML: source, preview and rich text

**Try this:** Edit the code, then switch to Preview and Rich text. The three views share one draft; Preview displays the HTML without running its scripts.

`codeMirror`, `htmlPreview` and `htmlEditor` bind to the same HTML string in Data.
The preview uses a sandboxed iframe without script execution. Jodit edits the body;
head content, document attributes and protected body blocks survive visual edits.
Protected blocks must be changed in Code. Rich edits use DOM serialization, so
formatting of HTML source can change. Neither view executes Python or JavaScript.

**Sample data:** `03-html_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.
