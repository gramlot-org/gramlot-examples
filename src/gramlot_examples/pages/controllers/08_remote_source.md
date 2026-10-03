# 08 · Remote Source

`gramlot.remoteSource(target, method, params)` asks the host to run a Source method of the Page and replaces the children of `target` with the returned branch.

- The Page declares the method with `@source` in Python and `source(Page.prototype.details)` in JavaScript. It builds into its own `root` and runs on the server.
- The button's nested controller names `load` in the `Logic` class of `08_remote_source.js`. It finds the target by its `node_id` and passes the chosen topic.
- The new branch carries its own `dataSetter` nodes. They run before the branch is built, so its heading and summary show their values at the first render.
- The request lives as long as the target: if the target is removed first, the late answer is ignored. When two requests overlap, the latest wins.

**Try it:** Choose SVG and load it, then add a third `dataSetter` to the remote branch.
