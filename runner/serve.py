"""One local URL for the Python and Node example hosts and shared static assets."""

from __future__ import annotations

import asyncio
import json
import mimetypes
import os
import shutil
import subprocess
import tempfile
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from gramlot_py_server.uvicorn import create_application


ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / "pages"
RUNNER = ROOT / "runner"
CORE = ROOT / "node_modules" / "@gramlot" / "gramlot"
THEME = CORE / "themes" / "gramlot-base" / "theme.css"
BRANDING = CORE / "assets" / "branding"


def page_files():
    """Explicit route registry; catalog keys name the routes of the example file pages.

    The catalog lists the families; each family key is its folder below ``pages/``.
    """
    pages = [("index", RUNNER / "page.py", RUNNER / "page.js")]
    catalog = json.loads((RUNNER / "catalog.json").read_text())
    for family in catalog:
        folder = PAGES / family["key"]
        for entry in family["examples"]:
            pages.append((entry["key"], folder / f"{entry['folder']}.py", folder / f"{entry['folder']}.js"))
    for _, py_file, js_file in pages:
        if not py_file.is_file() or not js_file.is_file():
            raise FileNotFoundError(f"Missing paired Page: {py_file} / {js_file}")
    return pages, catalog


def stage_pages(directory: Path, pages):
    """Stage one pages folder per language with a file page for each route.

    A route whose example has a same-name stylesheet receives a copy of it as its
    companion, so the minimal FileHost links it. The returned map serves each
    companion URL from its original file. A same-name ``_aux.js`` logic companion
    is copied the same way and served by the integration from the pages folder.
    """
    python_dir = directory / "python"
    javascript_dir = directory / "javascript" / "js"
    python_dir.mkdir(parents=True)
    javascript_dir.mkdir(parents=True)
    (directory / "javascript" / "package.json").write_text('{"type":"module"}\n')
    companions = {}
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
                "        root.script(src='/runner/dist/frame.js')\n"
            )
        (python_dir / f"{route}.py").write_text(wrapper)
        js_wrapper = f"export {{Page}} from {json.dumps(js_file.as_uri())};\n"
        if route != "index":
            js_wrapper = (
                f"import {{Page as ExamplePage}} from {json.dumps(js_file.as_uri())};\n"
                "export class Page extends ExamplePage {\n"
                "    main(root) {\n"
                "        super.main(root);\n"
                "        root.script({src: '/runner/dist/frame.js'});\n"
                "    }\n}\n"
            )
        (javascript_dir / f"{route}.js").write_text(js_wrapper)
        stylesheet = py_file.with_suffix(".css")
        if route != "index" and stylesheet.is_file():
            for folder, prefix in ((python_dir, "/py"), (javascript_dir, "/js")):
                shutil.copyfile(stylesheet, folder / f"{route}.css")
                companions[f"{prefix}/{route}.css"] = stylesheet
        logic = py_file.with_name(f"{py_file.stem}_aux.js")
        if route != "index" and logic.is_file():
            for folder in (python_dir, javascript_dir):
                shutil.copyfile(logic, folder / f"{route}_aux.js")
    return python_dir, directory / "javascript", companions


class RunnerApplication:
    def __init__(self, python_pages: Path, node_url: str, catalog, companions):
        self.python_host = create_application(python_pages, mount_path="/py")
        self.node_url = node_url
        allowed = {
            **companions,
            "/themes/gramlot-base/theme.css": THEME,
            "/py/themes/gramlot-base/theme.css": THEME,
            "/runner/runner.css": RUNNER / "runner.css",
            "/py/runner/runner.css": RUNNER / "runner.css",
            "/runner/page.py": RUNNER / "page.py",
            "/runner/page.js": RUNNER / "page.js",
            "/assets/branding/gramlot-mark.png": BRANDING / "gramlot-mark.png",
            "/assets/branding/gramlot-mark-dark.png": BRANDING / "gramlot-mark-dark.png",
            "/assets/branding/gramlot-logo.svg": BRANDING / "gramlot-logo.svg",
            "/assets/branding/gramlot-logo-dark.svg": BRANDING / "gramlot-logo-dark.svg",
        }
        for name in ("runner.js", "frame.js", "notices.json", "LICENSE", "NOTICE"):
            allowed[f"/runner/dist/{name}"] = RUNNER / "dist" / name
        for family in catalog:
            for entry in family["examples"]:
                for suffix in (".py", ".js", ".css", ".md", "_aux.js"):
                    name = f"{entry['folder']}{suffix}"
                    allowed[f"/pages/{family['key']}/{name}"] = PAGES / family["key"] / name
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
    pages, catalog = page_files()
    with tempfile.TemporaryDirectory(prefix="gramlot-runner-") as temporary:
        python_pages, javascript_pages, companions = stage_pages(Path(temporary), pages)
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
            uvicorn.run(RunnerApplication(python_pages, node_url, catalog, companions), host="127.0.0.1", port=port)
        finally:
            node.terminate()
            node.wait(timeout=5)


if __name__ == "__main__":
    main()
