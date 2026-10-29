# Echo and interactive replies

Write a message and press **Send**. The server echoes it after three short feedback
updates. These pauses only make the demo easier to observe; the base echo is immediate.

Choose **Source example** twice. Increment the first counter and type a note:
each reply has its own relative Data path. Sending another message preserves both
replies, their values and their DOM. **New conversation** clears the replies and
keeps an unsent draft. Closing the page ends this in-memory conversation.

The **+** button accepts images, PDF and UTF-8 text/code. This example shows
attachment names and image previews; it does not interpret files. Maximum: five
files, 2 MiB each (1 MiB for text), 4 MiB total.

`ChatPane` composes the frames and controls. `ChatPageStore.process_message`
returns a string or a server-authored Source Bag. The browser writes a request
Bag; `dataBinder` carries it to the server and carries feedback and replies back.
The companion Logic delegates shared behavior to core. Only the demo counter
and the Source-example button are application actions.

No provider credentials, streaming, persistence or AI service are needed here.
