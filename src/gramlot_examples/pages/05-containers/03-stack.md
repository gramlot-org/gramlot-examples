# Browse a gallery without losing your place

A **stackContainer** holds several panels but shows just one at a time. Unlike a tabContainer, it does not add a row of tabs. You choose how people move between panels. This example uses a slider, so you can quickly browse many demos.

There are two viewing areas. The left drawer is a small preview browser. The center is a full-size demo you can actually use.

## Try it

Move the slider slowly. Watch the title and miniature change as you move. Stop on a demo that interests you. After a short pause, the center opens that demo at its normal size.

Now sweep quickly past several entries. The center waits until you settle instead of opening every demo you pass. This small delay makes browsing calmer and avoids loading pages you never intended to try.

Choose a demo with a text field. Enter something in the full-size view, visit another demo, then return. The first page is still there with your edit. Choosing a different stack panel hid it; it did not reload it.

Close the carousel drawer when you want more room for the center. Open it again when you want to browse further.

## Why the miniature and the large view differ

Each is a separate embedded page, called an **iframe**. They show the same example, but they do not share its Data. Typing in the large view will not type into the miniature. Each view keeps its own edits when you leave and return.

Full-size demos are loaded on their first settled visit. A demo you skip quickly is not loaded in the center. Miniatures use the browser's lazy loading, so the browser decides when to fetch them. This carousel excludes itself to avoid opening another carousel inside every preview.

## How the pause works

The slider changes the preview selection immediately. A dataController waits 350 milliseconds after the latest selection change before updating the center. This is called **debouncing**: wait until the user pauses, then act on their final choice.

In **Code**, look for the two stackContainers and the controller with _delay=350. Read them as three jobs: browse now, wait briefly, then show the chosen page. You can use the same idea for a search field that waits for someone to stop typing before searching.
