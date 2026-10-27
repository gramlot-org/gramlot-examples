# 4. FramePane: layout and a command boundary

`framePane` reuses `borderContainer` layout and exposes `top`, `bottom`, `left`,
`right`, and `center`. The first access creates one real `contentPane` Source node;
further accesses return it. An unused region consumes no space. Regions accept
ordinary content and do not create a menu automatically.

| Region | Example contents |
| --- | --- |
| top | Two independent horizontal bars, stacked vertically |
| left | Two vertical bars, in adjacent columns |
| right | Ordinary explanatory content |
| bottom | Another horizontal bar |
| center | The document recipient and a nested frame |

```python
frame = root.framePane(height="520px")
frame.top.menu(presentation="bar").menuline("documenti:save")
editor = frame.center.contentPane(
    frameTarget=True, node_label="editor", selfsubscribe_save="receive")
```

Exactly one central content node is marked `frameTarget=True`. A command looks
for its nearest frame and publishes to that node. A missing or duplicate recipient
prevents dispatch with a diagnostic; there is no fallback to an outer frame.

Click Top, Left or Bottom and compare the displayed sender and target. Then click
Inner Save: only the inner result changes. The outer recipient stays distinct,
even though it contains the nested frame. Shift+click changes the captured modifier.

The local message has exactly five fields: `sender`, `target`, `command`,
`parameters`, and `modifiers`. Sender and target are live Source nodes; parameters
and modifiers are captured at activation. No DOM lookup or page-global message
bus is added by the example. Window title bars, dragging, resizing and modality
belong to the later dialog/floating increment, not to this frame contract.
