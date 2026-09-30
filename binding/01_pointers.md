# 01 · Pointers

A pointer is a string that names a Data path. `^path` reads the path and follows it; `=path` reads it once.

- `^settings.caption` is an absolute path. The heading shows it and changes when you type a new caption.
- `datapath='settings'` gives the section a context: `.caption` inside it means `settings.caption`.
- `=.caption` is read at the first render only. The paragraph keeps the first caption.
- `#settings.caption` starts from the context of the node with `node_id='settings'`.
- `#FORM.name` starts from the context of the nearest ancestor with `formId`.
- `.name?role` reads the attribute `role` of the Data node `person.name`. The field edits the attribute.

The `dataSetter` nodes at the end put the first values in the Data before anything is shown.

**Try it:** Type a caption, then a role, and watch which texts follow.
