"""Serve one folder of Python pages with the core FileHost: ``python scripts/serve_pages.py <folder> <port>``.

A loopback test host on the page protocol of the core: the runtime at ``runtime_url``, the
core themes under ``/themes/``, the ``.js`` and ``.css`` files below the pages folder (the
page modules, whose ``Logic`` the pages take), the pages, and ``main``, ``source`` and
``close`` as POST. No Content-Security-Policy, as with the default of the adapters: e13
puts an inline ``script`` in its Source, and the inline expressions of the pages need eval.
"""

import asyncio
import json
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from importlib.resources import files
from pathlib import Path

from gramlot.server import FileHost, PageExpired, PageNotFound, SourceNotFound

MEDIA_TYPES = {".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8"}
RESOURCES = Path(files("gramlot")) / "resources"


class PagesServer(ThreadingHTTPServer):
    """The loopback server of one pages folder and its FileHost."""

    def __init__(self, folder, port):
        super().__init__(("127.0.0.1", port), Handler)
        self.pages = Path(folder)
        self.host = FileHost(self.pages)


class Handler(BaseHTTPRequestHandler):
    """One request of the test host."""

    server: PagesServer

    def log_message(self, format, *args):
        pass

    def reply(self, status, body, media_type):
        body = body.encode() if isinstance(body, str) else body
        self.send_response(status)
        self.send_header("Content-Type", media_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def file(self, root, relative):
        """Reply with a file whose real path is below ``root``, else 404."""
        filename = (root / relative).resolve()
        if filename.is_relative_to(root.resolve()) and filename.is_file() and filename.suffix in MEDIA_TYPES:
            return self.reply(200, filename.read_bytes(), MEDIA_TYPES[filename.suffix])
        return self.reply(404, "Not found", "text/plain")

    def do_GET(self):
        host, path = self.server.host, self.path.split("?", 1)[0]
        if path == host.runtime_url:
            return self.reply(200, (RESOURCES / "gramlot.js").read_bytes(), MEDIA_TYPES[".js"])
        if path.startswith("/themes/"):
            return self.file(RESOURCES / "themes", path.removeprefix("/themes/"))
        if path.endswith((".js", ".css")):
            return self.file(self.server.pages, path.lstrip("/"))
        try:
            opened = asyncio.run(host.open_page(path))
        except PageNotFound:
            return self.reply(404, "Not found", "text/plain")
        self.reply(200, opened.html, "text/html; charset=utf-8")

    def do_POST(self):
        host = self.server.host
        payload = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
        try:
            if self.path == host.close_url:
                host.close_page(payload["pageId"])
                return self.reply(200, "{}", "application/json")
            if self.path == host.main_url:
                return self.reply(200, asyncio.run(host.main(payload["pageId"])), "application/json")
            if self.path == host.source_url:
                body = asyncio.run(host.source(payload["pageId"], payload["method"], payload.get("params")))
                return self.reply(200, body, "application/json")
        except (PageExpired, SourceNotFound):
            return self.reply(404, "Not found", "text/plain")
        self.reply(404, "Not found", "text/plain")


def main(folder, port):
    server = PagesServer(folder, port)
    print(f"http://127.0.0.1:{server.server_port}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main(sys.argv[1], int(sys.argv[2]))
