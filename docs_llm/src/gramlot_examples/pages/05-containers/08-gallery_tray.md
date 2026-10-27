# Gallery tray

Start with an empty workspace. The toolbar reads the gallery catalogue; select an example and press **Add** to open it in a card at **65% zoom**. Add the same example twice to compare independent copies.

## Try it

1. Add a text-field example and a slider example. Nothing loads before you press Add.
2. Edit a field. Drag the card by its title, resize from the lower-right grip, then return to the field: its value is retained.
3. Use the card's zoom control to enlarge it. The iframe resizes with the card; ordinary page scrolling remains available when its contents need more space.
4. Add more examples. Cards start in two columns and the workspace grows vertically. Scroll the workspace to reach later rows.
5. Change a card's layer to overlap another. On the same layer, cards stop at contact. Each card uses the tray's standard selection, rotation and resize controls.

The tray and carousel are excluded from the picker to avoid recursively embedding the picker itself. The list includes the common gallery lessons, not host-specific tools or native mobile plugins.

## Three small responsibilities

`main` composes a `framePane`: a regular menu toolbar above an empty `trayPane`. `example_picker` builds grouped choices from the shared catalogue, without duplicating its list.

The companion `_data.tytx` initializes an empty layout Bag and a zero card count. No lesson is loaded initially.

The shared JavaScript `addExample` controller writes a geometry row into `galleryTray.layout`, keyed by the new card's `node_label`. `scale=0.65` is stored alongside position, size, layer and rotation. It then calls `addCard`, which creates ordinary Source nodes through the browser Builder. No DOM construction or separate state registry is needed.

Each card contains one iframe. That page owns its own Gramlot Source, Data and Logic; the parent owns only card arrangement. Moving or resizing changes the existing card's presentation, keeping the same iframe and its live page. Reloading the tray discards these pages; this example does not persist their contents.

Catalogue titles and host-provided URLs are dynamic values, so they use a small `dataSetter`. Ordinary sample data stays in each chosen lesson's `_data.tytx`. The `gallery_urls`/`galleryUrls` mapping also lets the documentation exporter supply its standalone page URLs.
