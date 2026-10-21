# 19 · Parent and child messages

Send a message to the embedded page, then reply from that page. The example reuses the page-topic receiver from **Publish and subscribe** and adds a destination to `publish`.

**Uses:** Source, Data, named Logic, authored iframe references and direct parent/child `postMessage` — core 0.2.18. No endpoint calls or server messaging.

**Try it:** wait for the child field to appear, edit the outer Message and press Send to child. Both summaries change: publication is local first, then reaches the selected child. Edit the child's Message and press its Reply to parent. The child publishes locally first and the parent receives the reply.

<details>
<summary>More detail</summary>

The iframe `src` is bound to `^.frame_url` and its size comes from the `frame-preview` class of the lesson stylesheet. The setup controller writes `.frame_url` with the same page and the `#child` hash, so the page opens itself inside the iframe. In that child page the controller hides the parent section and writes no URL, so nesting stops after one child. The URL hash is only this example's mode selector; it is not a messaging address.

Python passes the iframe Source as `target`. Logic uses `{topic: 'message', iframe: target}`. The child uses `{topic: 'message', parent: true}`. All cross-frame calls use postMessage, including same-origin pages; each receiving page activates its ordinary subscribe_message controller.

The child must be connected and ready. An early click reports the readiness error; retry after the child appears. There is no automatic queue or broadcast. Source/DOM objects stay local: the iframe reference selects a local destination, while only the message data crosses the connection. Reloading the child establishes a new connection.

**Exercise:** add another owned child and send only to its reference. **Answer:** local delivery still occurs, but only the selected child receives the remote copy. There is no recursive broadcast in this release.

</details>
