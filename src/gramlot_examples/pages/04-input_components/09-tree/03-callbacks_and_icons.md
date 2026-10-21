# Tree callbacks, HTML and icons

Compare computed text, structured HTML labels and icons chosen by named Logic methods.

## Try it

Callbacks are synchronous named Logic methods called as `method(sourceNode, {item, path, opened, selected})`. `getLabel` overrides label calculation; otherwise `labelAttribute` precedes `labelCb`. Label callbacks return exactly `{text: string}` or `{html: string}`. HTML is sanitized with DOMPurify; scripts, event handlers and embedded form controls are removed. Plain label attributes and scalar values are always text. `getLabelClass` replaces the default class calculation; selected classes are still added. `getIconClass` returns CSS classes; an empty string hides the icon. No callback string evaluation or HTML sentinel is supported. Toggle rich Documents to see a Bag attribute update both trees. These examples do not implement badges, row actions or drag/drop.
