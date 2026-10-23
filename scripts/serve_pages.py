"""Serve one folder of Python pages with the core GramlotFileServer: ``python scripts/serve_pages.py <folder> <port>``.

A loopback test server on the page protocol of the core: the runtime at ``runtime_url``, the
core themes under ``/themes/``, the ``.js`` and ``.css`` files below the pages folder (the
page modules, whose ``Logic`` the pages take), the pages, and ``rpc`` (the request
envelope, answered by ``call``) and ``close`` as POST. No Content-Security-Policy, as with the default of the adapters: the inline
expressions and actions of the pages (for example the click of e10 and e13) need eval.
"""

import asyncio
import json
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from importlib.resources import files
from pathlib import Path

from gramlot_examples import build_gallery

from gramlot.server import GramlotFileServer, InvalidRequest, PageNotFound, runtime_asset

MEDIA_TYPES = {".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8"}
RESOURCES = Path(files("gramlot")) / "resources"


class CollectionServer(GramlotFileServer):
    def collection_url(self, collection, path):
        from urllib.parse import quote
        return f'/gramlot/collections/{quote(collection.name,safe="")}/{collection.build_id[7:]}/{path}'


class PagesServer(ThreadingHTTPServer):
    """The loopback server of one pages folder and its GramlotFileServer."""

    request_queue_size = 128

    def __init__(self, folder, port):
        super().__init__(("127.0.0.1", port), Handler)
        self.pages = Path(folder)
        gallery = build_gallery()
        self.assets = gallery["assets"]
        self.routes = {example["key"]: f'{family["folder"]}/{example["folder"]}'
                       for family in gallery["families"] for example in family["examples"]}
        self.gramlot_server = CollectionServer(self.pages, collections=gallery["collections"])
        self.collection_assets = {}
        for collection in self.gramlot_server.collections:
            for path, content in collection.verify().items():
                if path.startswith("assets/"):
                    url = self.gramlot_server.collection_url(collection, path)
                    self.collection_assets[url] = (content, MEDIA_TYPES.get(Path(path).suffix, "application/octet-stream"))


class Handler(BaseHTTPRequestHandler):
    """One request of the test server."""

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
        server, path = self.server.gramlot_server, self.path.split("?", 1)[0]
        if path.startswith('/gramlot/collections/'):
            asset = self.server.collection_assets.get(path)
            return self.reply(200, *asset) if asset else self.reply(404, 'Not found', 'text/plain')
        if path in self.server.assets:
            asset = self.server.assets[path]
            return self.reply(200, asset["file"].read_bytes(), asset["type"])
        if path == server.runtime_url:
            return self.reply(200, runtime_asset().read_bytes(), MEDIA_TYPES[".js"])
        if path.startswith("/themes/"):
            return self.file(RESOURCES / "themes", path.removeprefix("/themes/"))
        if path.endswith((".js", ".css")):
            return self.file(self.server.pages, path.lstrip("/"))
        try:
            page_path = self.server.routes.get(path.rsplit("/", 1)[-1], path)
            opened = asyncio.run(server.open_page(page_path))
        except PageNotFound:
            return self.reply(404, "Not found", "text/plain")
        self.reply(200, opened.html, "text/html; charset=utf-8")

    def do_POST(self):
        server = self.server.gramlot_server
        body = self.rfile.read(int(self.headers["Content-Length"])).decode()
        if self.path == server.close_url:
            server.close_page(json.loads(body)["pageId"])
            return self.reply(200, "{}", "application/json")
        if self.path == server.rpc_url:
            try:
                return self.reply(200, asyncio.run(server.call(body)), "application/json")
            except InvalidRequest:
                return self.reply(400, "Invalid envelope", "text/plain")
        self.reply(404, "Not found", "text/plain")


def main(folder, port):
    server = PagesServer(folder, port)
    print(f"http://127.0.0.1:{server.server_port}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main(sys.argv[1], int(sys.argv[2]))
