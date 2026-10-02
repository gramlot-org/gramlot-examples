# 11 · A complete page with binding

The event page of HTML / SVG example 12, with its visible state in the Data record `event`.

- The heading, the hero caption and the footer read `^.title` and `^.footer`; the field in the header edits the title while you type.
- The two checkboxes write `show.mira` and `show.theo`. Schedule rows and speaker cards bind `visible` to them; the joint session has no pointer and stays.
- The radio buttons above the map own `stop.entrance`, `stop.studio` and `stop.hall`; each map stop shows its ring through `visible`.
- The FAQ `details` bind `open` to one checkbox.

The main landmark is written `html_main`, held in the variable `main_content`, because the page also has a header and a footer.

**Try it:** Hide Theo, move to the hall, then open all answers.
