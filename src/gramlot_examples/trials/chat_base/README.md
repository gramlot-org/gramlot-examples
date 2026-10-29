# Base chat: echo and interactive Source

This development example uses the core `ChatPane`, `ChatPageStore` and optional
chat collection. It needs the core chat implementation, including freshly built
runtime/prepared collections, and the Python WebSocket adapter with the processing-feedback correction. It needs
no LLM credentials.

```sh
python scripts/serve_chat_base.py --port 8773
```

Open http://127.0.0.1:8773/01-echo. Type any text for echo, or click **Source example**
(`/source`) for a reply built with Gramlot Source: image, table, counter and note.
Add two Source replies, edit one, and check that the other keeps its own values.
**New conversation** clears messages and their local Data; it preserves an unsent
draft. Closing the page ends this in-memory conversation.

`pages/92-chat/01-echo.py` shows Python composition and the processing hook. The outer top,
composer top and composer bottom are authored by the Page. The composer center
comes from the base component. `pages/92-chat/01-echo.js` delegates eight shared handlers
to core and implements only the example's counter and example-request actions.
The SVG image is a static illustration authored in this example, not an LLM call.

Messages can use the Page's loaded collections and named browser controllers.
Relative Data paths belong to the message; absolute paths reach shared Page Data.
Global DOM/Source IDs remain global: applications must not repeat them across
response fragments. Providers, credentials and prompt/history construction belong
to a server-side application override of `process_message(self, text)`.

No microphone, transcription, streaming, cancellation or persistent archive is
implemented. This example is separate from the credential-backed chat trial.


Each send writes one request Bag. The server recipe reacts through the dataBinder,
updates feedback, and writes the response to the same bound conversation state.
`self.feedback(text)` replaces the single status row above the input; it never
appends a message or moves message scroll. The example pauses for 1.6 seconds to
make the three updates visible. The base echo implementation is immediate.

The shared bottom toolbar contains Send. This example adds its Source example
button through ui.toolbar and explicitly sizes its custom composer.top region.

The shared editor grows from 44px to 180px, with a 44px bottom toolbar. **+** adds
images, PDF and UTF-8 text/code to a draft attachment Bag, with preview/removal.
Files travel through the same request binder only when sent. The hook can inspect
`self.request_attachments`; this provider-free example echoes text and shows
submitted attachment names/image thumbnails, without interpreting their content.
Limits: five files, 2 MiB per image/PDF, 1 MiB per text file, 4 MiB total.

For the shared gallery, pass this catalog.json and its pages directory to the
Python host gallery command with WebSocket enabled. The AI trial is opt-in.
