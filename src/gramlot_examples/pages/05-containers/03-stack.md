# Browse a gallery without losing your place

A **stackContainer** holds several panels but shows just one at a time. Unlike a tabContainer, it does not add tabs. Here a slider sits above one central stack: each demo has one iframe and one set of Data, with no separate miniature.

## Try it

Move the slider and pause on a demo. After 350 milliseconds, the central view and its title switch to that demo. While you are moving, the previous demo remains visible.

Sweep quickly past several entries. Only the choice you settle on loads; skipped demos do not start in the background.

Choose a demo with a text field. Enter something, visit another demo, then return. Your edit is still there: the stack hid the page without reloading it. The slider remains above the full-width demo on narrow screens too.

## One stack, one instance per demo

The top region of the borderContainer contains the title and slider. Its center contains the only stackContainer. Each panel holds a single iframe, whose `src` is absent until the demo is first selected after a pause. This prevents unused applications from starting, including when the gallery is exported and opened from a file. The carousel excludes itself to avoid recursive nesting.

Visited panels remain mounted so their Data and edits survive selection changes. Only one panel is visible; visiting another demo does not create a second copy of an existing one.

## How the pause works

The slider writes `.panel`, defaulting to zero. A dataController watches that index with `_delay=350`, resolves the corresponding catalogue key, installs its URL in `.opened`, and updates `.active` and `.activeCaption`. The stack binds `selectedPage` to `.active`.

This is **debouncing**: wait until the user pauses, then act on their final choice. It keeps the current page visible while the slider moves and avoids loading demos the user merely passes over.

## Why this example still initializes Data explicitly

The host supplies deployment-specific URLs for Python, Node or static exports. The current catalogue supplies titles and the initial active demo. These dynamic values use dataSetter; they must not be frozen in a `_data.tytx` fixture. The slider's interface state uses `default=0`. Ordinary sample-record lessons use companion Bags.
