"""Gramlot example pages, the gallery page and its catalogue."""

import json
import re
from importlib.resources import files
from pathlib import Path

PACKAGE = Path(__file__).resolve().parent
MEDIA_TYPES = {".css": "text/css", ".svg": "image/svg+xml", ".json": "application/json"}
SUFFIXES = (".py", ".js", ".css", ".md", "_aux.js")
DIST = ("gallery.js", "frame.js", "notices.json", "LICENSE", "NOTICE")


def media_type(path, script=False):
    """Media type of a gallery asset; only the built gallery scripts are served as JavaScript."""
    if script:
        return "application/javascript"
    return MEDIA_TYPES.get(path.suffix, "text/plain")


def read_catalog(catalog, pages, common):
    """Load one ``catalog.json`` and check its ``environment`` against the key rule."""
    data = json.loads(Path(catalog).read_text())
    environment = data.get("environment")
    if common and environment is not None:
        raise ValueError(f"The common catalogue declares an environment: {catalog}")
    if not common and not environment:
        raise ValueError(f"An environment catalogue has no environment: {catalog}")
    pattern = None if common else re.compile(rf"{re.escape(environment)}-\d{{2}}")
    families = []
    for family in data["families"]:
        for example in family["examples"]:
            if pattern is not None and not pattern.fullmatch(example["key"]):
                raise ValueError(f"Example key {example['key']!r} does not match {environment}-NN: {catalog}")
        families.append({**family, "path": Path(pages) / family["key"]})
    return families


def build_gallery(catalogs=()):
    """Return the families, routes and static assets of the common gallery plus ``catalogs``.

    Each item of ``catalogs`` is a pair ``(catalog.json, pages folder)`` of one environment.
    ``routes`` maps each key to its Python page, its same-name stylesheet and its logic
    module: ``NN_name_aux.js``, else ``NN_name.js``, whose ``Logic`` export the server takes
    (the server raises when both files exist). ``assets`` maps each URL to its file and media
    type. Nothing is written or served here.
    """
    families = read_catalog(PACKAGE / "catalog.json", PACKAGE / "pages", common=True)
    for catalog, pages in catalogs:
        families.extend(read_catalog(catalog, pages, common=False))
    keys = ["index"] + [key for family in families
                        for key in (family["key"], *(example["key"] for example in family["examples"]))]
    duplicates = sorted({key for key in keys if keys.count(key) > 1})
    if duplicates:
        raise ValueError(f"Duplicate gallery keys: {', '.join(duplicates)}")

    gallery = PACKAGE / "gallery"
    resources = Path(files("gramlot")) / "resources"
    routes = {"index": {"page": gallery / "page.py", "stylesheet": None, "logic": None}}
    files_by_url = [
        ("/themes/gramlot-base/theme.css", resources / "themes" / "gramlot-base" / "theme.css"),
        ("/assets/branding/gramlot-logo-dark.svg", resources / "assets" / "branding" / "gramlot-logo-dark.svg"),
        ("/gallery/gallery.css", gallery / "gallery.css"),
        *((f"/gallery/{name}", gallery / name) for name in ("page.py", "page.js") if (gallery / name).is_file()),
    ]
    assets = {url: {"file": path, "type": media_type(path)} for url, path in files_by_url}
    for name in DIST:
        path = gallery / "dist" / name
        assets[f"/gallery/dist/{name}"] = {"file": path, "type": media_type(path, path.suffix == ".js")}
    for family in families:
        folder = family["path"]
        for example in family["examples"]:
            page = folder / f"{example['folder']}.py"
            if not page.is_file():
                raise FileNotFoundError(f"Missing page: {page}")
            stylesheet = folder / f"{example['folder']}.css"
            logic = next((path for path in (folder / f"{example['folder']}_aux.js",
                                            folder / f"{example['folder']}.js") if path.is_file()), None)
            routes[example["key"]] = {"page": page,
                                      "stylesheet": stylesheet if stylesheet.is_file() else None,
                                      "logic": logic}
            for suffix in SUFFIXES:
                source = folder / f"{example['folder']}{suffix}"
                if source.is_file():
                    assets[f"/pages/{family['key']}/{source.name}"] = {"file": source, "type": media_type(source)}
    return {"families": families, "routes": routes, "assets": assets}


__all__ = ["build_gallery"]
