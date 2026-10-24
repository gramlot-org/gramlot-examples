# Markdown: code, preview and rich text

**Sample data:** `04-markdown_data.tytx` supplies the initial Bag for both Python and JavaScript. Interface controls use defaults where shown; edits and remote updates use the normal Data bindings.

`codeMirror`, `markdownPreview` and `markdownEditor` bind to one Markdown string.
ProseMirror edits supported blocks and provides Bold, Italic, Code, Undo and Redo.
Tables, embedded HTML, strikethrough and task-list blocks retain their source as
opaque blocks; use Code to edit them. Documents with frontmatter or reference
definitions are preserved as one block. Supported syntax is normalized after rich
editing. Undo to the initial state restores the original source exactly.

The preview renders Markdown using markdown-it with HTML disabled inside a
sandboxed iframe. It does not execute page scripts. In the IDE, Save/Revert and
keyboard save operate on the same document, and history follows the active view.


Enable **Allow embedded HTML** to render HTML embedded in the Markdown preview. It is disabled by default. Enabled output is sanitized to remove scripts and event handlers, and still uses a sandboxed iframe. Rich text preserves the original HTML as source blocks; edit their markup in Code. Toggling this option does not change the document or reset undo history.
