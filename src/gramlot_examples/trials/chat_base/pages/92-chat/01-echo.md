# Echo and interactive replies

Write a message and press **Send**. The server echoes it after three short feedback
updates. These pauses only make the demo easier to observe; the base echo is immediate.

Choose **Source example** twice. Each reply is an order panel with three tabs.

- **Customer**: name (required), email (validated), delivery date, shipping method and notes.
- **Items**: an editable grid. `total` is the column formula `quantity * price`. The footer shows the total. **Add row** and **Delete** (select a row first) change the rows.
- **Summary**: customer name, row count, total, VAT percentage and gross. **Confirm** marks the panel as confirmed and disables its fields. It sends nothing to the server.

Edit one panel and look at the other: it keeps its own values. Every panel has its own
relative Data path (`.order` under the message path). Sending another message preserves
both panels, their values and their DOM. **New conversation** clears the replies and
keeps an unsent draft. Closing the page ends this in-memory conversation.

The **+** button accepts images, PDF and UTF-8 text/code. This example shows
attachment names and image previews; it does not interpret files. Maximum: five
files, 2 MiB each (1 MiB for text), 4 MiB total.

`ChatPane` composes the frames and controls. `ChatPageStore.process_message`
returns a string or a server-authored Source Bag. The browser writes a request
Bag; `dataBinder` carries it to the server and carries feedback and replies back.
The companion Logic delegates shared behavior to core. Only the Confirm button
and the Source-example button are application actions. The panel is built in
`order_panel`, split into `customer_tab`, `items_tab` and `summary_tab`.

No provider credentials, streaming, persistence or AI service are needed here.
