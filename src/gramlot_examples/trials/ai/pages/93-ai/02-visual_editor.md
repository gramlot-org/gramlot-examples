# Visual editor with assistant

The visual editor of the Tools family, with a chat on the right. Describe a change
in words, for example “add a formlet with name and email”. The assistant first
assesses the whole request, reads the pertinent sections of the Gramlot manuals,
then applies one Source operation at a time. The editor validates each operation;
the assistant sees the actual result before the next step. A rejected operation
leaves the Source unchanged.

Select a node first to make it the default destination. A manual edit during a
request stops the following operations. Each request allows at most twelve edits
and eight manual reads. The chat accepts text only; it never runs scripts or
saves files.

`add_editor_chat` composes the core `ChatPane` beside the `VisualEditor`.
`SourceAssistantStore` is the PageStore: it sends the current Source, the selection
and the widget metadata to Anthropic and returns the operations through a bound
Data path. The API key stays in the server environment.

When the server sets `GRAMLOT_AI_MODELS`, only those models are offered and any
other model is rejected. On the public gallery each page session has a limit of
requests. Without an API key the lesson shows “AI examples are not configured on
this server.”
