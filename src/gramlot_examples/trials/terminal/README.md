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

The shell uses a pseudo-terminal and runs only on POSIX systems. It runs with the rights of
the server process: never set `GRAMLOT_DEV` on a public server. It answers only a
connection from this machine (a loopback peer address) for a page opened at
`localhost` or `127.0.0.1` (the `Host` header of the socket): the first check stops
other machines, which can send any `Host`; the second stops a DNS rebinding page.
