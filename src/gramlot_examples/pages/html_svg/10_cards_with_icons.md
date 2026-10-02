# 10 · Cards with icons and live Source

Responsive HTML cards with SVG drawings. Click a card's × button to remove it
without reloading the page.

The Builder gives the page, card container and each card a stable `node_label`.
The button's short JavaScript action finds `main.page.cards` in the browser
Builder's Source and calls `popNode` with the card label. Gramlot observes the
Source deletion and removes the corresponding DOM branch, including its SVG.
The action never removes a DOM element directly.

Python and JavaScript declare the same page and browser action. It also works
in the generated standalone directory opened directly from disk, offline.

**Try it:** Remove the middle card, then the others. Reload to restore all three.
Add a fourth card to the local dataset and give it a matching icon branch.

**Limit:** This is a small, explicit JavaScript action demonstrating live Source,
not Data binding, persistence or server synchronization. The icons are decorative;
card text and the labelled remove buttons carry the meaning.
