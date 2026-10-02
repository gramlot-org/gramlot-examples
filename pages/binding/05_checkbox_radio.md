# 05 · Checkbox and radio

A checkbox bound with `value='^path'` reads a boolean and writes `true` or `false`, never the text `on`.

Radio buttons with the same `group` form one choice. Each button owns its own boolean path. Choosing one writes `true` in its path and `false` in the path of the button that was on. Gramlot generates the DOM `name` of the group, so two pages or two groups never mix.

Only `plan.plus` has a setter. `plan.basic` and `plan.team` start empty; a button that is already off is not written, so an empty path stays empty until its button is chosen once.

**Try it:** Choose Team, then Basic, and watch which Data values change; then add a fourth plan.
