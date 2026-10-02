# 04 · Inline expressions

A text or an attribute that starts with `==` is a JavaScript expression. Its names are the other attributes of the same node, which are often `^` pointers: the expression is computed again when one of them changes.

- The heading is `==first + ' ' + last`, with `first='^.first'` and `last='^.last'`.
- The verdict computes its text, its `class` and its `title` from `score`.
- The SVG bar computes its `width`; the button computes `disabled` from the checkbox.
- The button's `action` is an inline script run at the click, with `this` = the button node.

Inline code needs a Content Security Policy that allows `'unsafe-eval'`; under a strict policy it stops with a clear error naming the node and the attribute. The legacy macros `SET path = value` and `$1` still work and log a deprecation warning: write `this.SET(path, value)` and `arguments[0]`.

**Try it:** Move the score across 50, accept the rules, then press Start.
