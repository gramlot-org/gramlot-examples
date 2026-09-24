"""One local URL for the Python and Node example hosts and shared static assets."""

from __future__ import annotations

import asyncio
import json
import mimetypes
import os
import subprocess
import tempfile
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from gramlot_minimal import create_asgi_application


ROOT = Path(__file__).resolve().parents[2]
EXAMPLES = ROOT / "examples"
RUNNER = EXAMPLES / "00-runner"
HTML_SVG = EXAMPLES / "html_svg"
THEME = ROOT / "themes" / "gramlot-base" / "theme.css"
FOLDER_NAMES = (
    "01_hello_world", "02_text_and_links", "03_lists", "04_semantic_page",
    "05_tables", "06_forms", "07_native_disclosure", "08_svg_shapes",
    "09_svg_composition", "10_cards_with_icons", "11_static_report", "12_complete_page", "13_live_source",
)


def page_files():
    """Explicit route registry; numbering and hyphens stay in source paths."""
    pages = [("index", RUNNER / "page.py", RUNNER / "page.js")]
    folders = [HTML_SVG / name for name in FOLDER_NAMES]
    for number, folder in enumerate(folders, start=1):
        pages.append((f"e{number:02d}", folder / "page.py", folder / "page.js"))
    for _, py_file, js_file in pages:
        if not py_file.is_file() or not js_file.is_file():
            raise FileNotFoundError(f"Missing paired Page: {py_file} / {js_file}")
    return pages, folders


def stage_pages(directory: Path, pages):
    python_dir = directory / "python"
    javascript_dir = directory / "javascript" / "js"
    python_dir.mkdir(parents=True)
    javascript_dir.mkdir(parents=True)
    (directory / "javascript" / "package.json").write_text('{"type":"module"}\n')
    for route, py_file, js_file in pages:
        wrapper = (
            "import importlib.util\n"
            f"spec = importlib.util.spec_from_file_location('gramlot_example_{route}', {str(py_file)!r})\n"
            "module = importlib.util.module_from_spec(spec)\n"
            "spec.loader.exec_module(module)\n"
            "Page = module.Page\n"
        )
        if route != "index":
            wrapper += (
                "class Page(module.Page):\n"
                "    def main(self, root):\n"
                "        super().main(root)\n"
                "        root.script(src='/examples/00-runner/dist/frame.js')\n"
            )
        (python_dir / f"{route}.py").write_text(wrapper)
        js_wrapper = f"export {{Page}} from {json.dumps(js_file.as_uri())};\n"
        if route != "index":
            js_wrapper = (
                f"import {{Page as ExamplePage}} from {json.dumps(js_file.as_uri())};\n"
                "export class Page extends ExamplePage {\n"
                "    main(root) {\n"
                "        super.main(root);\n"
                "        root.script({src: '/examples/00-runner/dist/frame.js'});\n"
                "    }\n}\n"
            )
        (javascript_dir / f"{route}.js").write_text(js_wrapper)
    return python_dir, directory / "javascript"


class RunnerApplication:
    def __init__(self, python_pages: Path, node_url: str, folders):
        self.python_host = create_asgi_application(python_pages, mount_path="/py")
        self.node_url = node_url
        allowed = {
            "/themes/gramlot-base/theme.css": THEME,
            "/examples/00-runner/runner.css": RUNNER / "runner.css",
            "/examples/00-runner/page.py": RUNNER / "page.py",
            "/examples/00-runner/page.js": RUNNER / "page.js",
            "/assets/branding/gramlot-mark.png": ROOT / "assets" / "branding" / "gramlot-mark.png",
            "/assets/branding/gramlot-mark-dark.png": ROOT / "assets" / "branding" / "gramlot-mark-dark.png",
            "/assets/branding/gramlot-logo.svg": ROOT / "assets" / "branding" / "gramlot-logo.svg",
            "/assets/branding/gramlot-logo-dark.svg": ROOT / "assets" / "branding" / "gramlot-logo-dark.svg",
        }
        for name in ("runner.js", "frame.js", "notices.json", "LICENSE", "NOTICE"):
            allowed[f"/examples/00-runner/dist/{name}"] = RUNNER / "dist" / name
        for folder in folders:
            for name in ("page.py", "page.js", "style.css", "README.md"):
                allowed[f"/examples/html_svg/{folder.name}/{name}"] = folder / name
        self.assets = allowed

    async def __call__(self, scope, receive, send):
        if scope["type"] == "lifespan":
            await self.python_host(scope, receive, send)
            return
        path = scope["path"]
        if path == "/":
            await self._redirect(send, "/py/index")
            return
        asset = self.assets.get(path)
        if asset is not None:
            await self._asset(scope, send, asset)
            return
        if path.startswith("/py/"):
            await self.python_host({**scope, "path": path[3:]}, receive, send)
            return
        if path.startswith("/js/"):
            await self._proxy(scope, receive, send)
            return
        await self._reply(send, 404, b"Not found", "text/plain; charset=utf-8")

    @staticmethod
    async def _reply(send, status, body, media_type, headers=(), content_length=None):
        await send({"type": "http.response.start", "status": status, "headers": [
            (b"content-type", media_type.encode()),
            (b"content-length", str(len(body) if content_length is None else content_length).encode()),
            (b"cache-control", b"no-store"),
            *headers,
        ]})
        await send({"type": "http.response.body", "body": body})

    async def _redirect(self, send, location):
        await self._reply(send, 302, b"", "text/plain", ((b"location", location.encode()),))

    async def _asset(self, scope, send, path):
        if scope["method"] not in ("GET", "HEAD"):
            await self._reply(send, 405, b"Method not allowed", "text/plain")
            return
        if not path.is_file():
            await self._reply(send, 404, b"Not found", "text/plain")
            return
        body = await asyncio.to_thread(path.read_bytes)
        media_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        if path.suffix in (".md", ".py"):
            media_type = "text/plain"
        if path.suffix == ".js":
            media_type = "application/javascript" if path.parent == RUNNER / "dist" else "text/plain"
        await self._reply(send, 200, b"" if scope["method"] == "HEAD" else body,
                          media_type, content_length=len(body))

    async def _proxy(self, scope, receive, send):
        body = bytearray()
        while True:
            event = await receive()
            body.extend(event.get("body", b""))
            if len(body) > 4096:
                await self._reply(send, 413, b"Request too large", "text/plain")
                return
            if not event.get("more_body", False):
                break
        headers = {key.decode("latin-1"): value.decode("latin-1") for key, value in scope["headers"]
                   if key.lower() not in (b"host", b"content-length")}
        url = self.node_url + scope["path"]
        if scope.get("query_string"):
            url += "?" + scope["query_string"].decode("ascii")

        def forward():
            request = Request(url, data=bytes(body) if scope["method"] not in ("GET", "HEAD") else None,
                              headers=headers, method=scope["method"])
            try:
                response = urlopen(request, timeout=15)
            except HTTPError as error:
                response = error
            with response:
                retained = tuple((name.lower().encode("latin-1"), value.encode("latin-1"))
                                 for name, value in response.headers.items()
                                 if name.lower() in ("set-cookie", "allow"))
                return (response.status, response.headers.get("content-type", "application/octet-stream"),
                        response.read(), retained)

        try:
            status, media_type, result, retained = await asyncio.to_thread(forward)
        except Exception:
            await self._reply(send, 502, b"Node example host unavailable", "text/plain")
            return
        await self._reply(send, status, result, media_type, retained)


def main():
    import uvicorn

    subprocess.run(["node", str(RUNNER / "build-browser.mjs")], cwd=ROOT, check=True)
    pages, folders = page_files()
    with tempfile.TemporaryDirectory(prefix="gramlot-runner-") as temporary:
        python_pages, javascript_pages = stage_pages(Path(temporary), pages)
        env = {**os.environ, "GRAMLOT_RUNNER_PAGES": javascript_pages.as_uri()}
        runtime = os.getenv("JS_RUNTIME", "node")
        if runtime not in {"node", "bun"}:
            raise ValueError("JS_RUNTIME must be node or bun")
        node = subprocess.Popen([runtime, str(RUNNER / "server.mjs")], cwd=ROOT,
                                env=env, stdout=subprocess.PIPE, text=True)
        try:
            node_url = node.stdout.readline().strip()
            if not node_url.startswith("http://127.0.0.1:"):
                raise RuntimeError(f"{runtime} example host did not start")
            port = int(os.getenv("PORT", "8080"))
            print(f"Gramlot examples: http://127.0.0.1:{port}", flush=True)
            uvicorn.run(RunnerApplication(python_pages, node_url, folders), host="127.0.0.1", port=port)
        finally:
            node.terminate()
            node.wait(timeout=5)


if __name__ == "__main__":
    main()
