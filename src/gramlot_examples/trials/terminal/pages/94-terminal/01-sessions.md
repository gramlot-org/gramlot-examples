# Echo and local shell

The upper terminal is connected to the `echo` session. Type: every key goes to the
server and comes back. **Enter** starts a new line. The bar above it shows the
values the component writes to Data: `connected`, `columns` and `rows`. Resize the
window and the columns change.

On a development server (`GRAMLOT_DEV` set) a second terminal opens the `shell`
session: a local shell on a pseudo-terminal. Try `ls`, `top` or `vim`, the arrows,
**Tab** and **Ctrl-C**. The size of the terminal reaches the shell, so `top` redraws
at the new size.

The Page declares `terminal(session='echo')`. The PageStore declares the session
with the `@terminal` decorator: an async method that receives the session and
uses `read`, `write` and `resized`. The bytes travel on a WebSocket of their own,
`/gramlot/terminal`, not through Data. `write` waits while the screen has 1 MB
not yet written, so the shell is not read faster than the browser can draw.

The shell runs with the rights of the server process. It is never offered on a
server without `GRAMLOT_DEV`. It answers only a connection from this machine
(`session.client` is a loopback address), because a program on another machine can
send any `Host` header. It also answers only a page opened at `localhost` or
`127.0.0.1` (`session.host`): the socket's origin check compares `Origin` with
`Host`, which a DNS rebinding page in a local browser can make equal.
