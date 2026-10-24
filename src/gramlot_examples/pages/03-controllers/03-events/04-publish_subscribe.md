# 18 · Publish and subscribe

**Sample data:** `04-publish_subscribe_data.tytx` supplies the initial Bag for both Python and JavaScript. Interface controls use defaults where shown; edits and remote updates use the normal Data bindings.

Revisit **Button controller**: one button calls a controller directly, another publishes a message to the same behavior. Then address two independent receivers without looking up their IDs, and collect a message in a dialog.

**Uses:** Source, Data, named Logic, page/self subscriptions, authored references and native `ask` — core 0.2.18. No endpoint calls. Earlier lessons remain the 0.2.0 stage.

**Try it:** edit Message, press Direct controller, then Publish. The summary is the same except for the trigger reason. Send to left: only the left receiver changes. Ask, then publish lets you edit the outgoing message; Cancel leaves the summary unchanged.

<details>
<summary>More detail</summary>

The direct controller keeps the c06 click mechanism. The publishing controller knows the topic `saved`; `subscribe_saved=True` connects the receiver. The publisher does not need a Data trigger path to activate that receiver. Repeating the same message still delivers it.

Each receiver declares `selfsubscribe_refresh=True`. Python passes that controller as `target`; Gramlot resolves the authored reference in the browser. `target.publish('refresh', {text})` addresses only that node. The JavaScript Page makes the same declaration, and both use the shared Logic class.

`_ask` adds native field collection to the existing controller. It runs the controller once after confirmation and never after cancellation. This example uses named methods throughout; it does not need inline JavaScript evaluation. For a conditional confirmation use a string `_ask` with `_ask_if`; those inline conditions need the corresponding CSP policy.

**Exercise:** subscribe a second controller to `saved`, writing another Data path. Predict whether both run when Publish is pressed. **Answer:** both run, in registration order; each should write its own result. A self-subscription does not also subscribe to the plain page topic.

</details>
