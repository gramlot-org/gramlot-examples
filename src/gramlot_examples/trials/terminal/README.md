# Terminal trial

The `terminal` component (gramlot-org/gramlot#87) connected to two `@terminal`
sessions of a PageStore: `echo`, always available, and `shell`, a local shell on a
pseudo-terminal, offered only when `GRAMLOT_DEV` is set.

It needs a core and a Python adapter with terminal sessions, and a WebSocket host:

```sh
GRAMLOT_DEV=YES gramlot uvicorn gallery --websocket --port 8774 \
  --catalog /absolute/path/to/trials/terminal/catalog.json \
            /absolute/path/to/trials/terminal/pages
```

The shell uses `pty` and runs only on POSIX systems. It runs with the rights of
the server process: never set `GRAMLOT_DEV` on a public server. It answers only a
page opened at `localhost` or `127.0.0.1` (the `Host` header of the socket), so a
DNS rebinding page cannot reach it.
