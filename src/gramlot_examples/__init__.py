"""Gramlot example pages, the gallery page and its catalogue."""

import json
import re
from importlib.resources import files
from pathlib import Path
from .gallery.collections import collections as gallery_collections

PACKAGE = Path(__file__).resolve().parent
MEDIA_TYPES = {".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json"}
SUFFIXES = (".py", ".js", ".css", ".md", "_aux.js", "_data.tytx")
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
        families.append({**family, "path": Path(pages) / family["folder"]})
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
        ("/catalog.json", PACKAGE / "catalog.json"),
        ("/themes/gramlot-base/theme.css", resources / "themes" / "gramlot-base" / "theme.css"),
        ("/assets/branding/gramlot-logo-dark.svg", resources / "assets" / "branding" / "gramlot-logo-dark.svg"),
        ("/assets/branding/app-icon.png", resources / "assets" / "branding" / "app-icon.png"),
        ("/gallery/gallery.css", gallery / "gallery.css"),
        *((f"/gallery/{name}", gallery / name) for name in ("page.py", "page.js") if (gallery / name).is_file()),
    ]
    assets = {url: {"file": path, "type": media_type(path)} for url, path in files_by_url}
    for name in DIST:
        path = gallery / "dist" / name
        assets[f"/gallery/dist/{name}"] = {"file": path, "type": media_type(path, path.suffix == ".js")}
    for collection in gallery_collections():
        name = collection.name
        assets[f"/gallery/dist/{name}/descriptor.js"] = {
            "file": gallery / "dist" / name / "descriptor.js", "type": "text/javascript"}
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
                                      "logic": logic, "url": f"pages/{family['folder']}/{example['folder']}"}
            for suffix in SUFFIXES:
                source = folder / f"{example['folder']}{suffix}"
                if source.is_file():
                    assets[f"/pages/{family['folder']}/{source.relative_to(folder).as_posix()}"] = {"file": source, "type": media_type(source)}
    # Stage additional filesystem pages, including directory indexes, under their own paths.
    known = {route["page"].resolve() for route in routes.values()}
    roots = [(PACKAGE / "pages", "pages")]
    roots.extend((family["path"], f"pages/{family['folder']}") for family in families if not family["path"].resolve().is_relative_to((PACKAGE / "pages").resolve()))
    for base, prefix in roots:
        for page in sorted(base.rglob("*.py")):
            if page.is_symlink() or page.resolve() in known or page.name.startswith("_"):
                continue
            key = f"{prefix}/{page.relative_to(base).with_suffix('').as_posix()}"
            stylesheet = page.with_suffix(".css")
            routes[key] = {"page": page, "stylesheet": stylesheet if stylesheet.is_file() else None, "logic": None, "url": key}
    for route in routes.values():
        data = route["page"].with_name(route["page"].stem + "_data.tytx")
        route["data"] = data if data.is_file() else None
    return {"families": families, "routes": routes, "assets": assets, "collections": gallery_collections()}


__all__ = ["build_gallery"]

def page_title(path):
    """Read the title from the actual page class, or the first Markdown H1."""
    if path.suffix == ".md":
        match = re.search(r"^# +(.+?)\s*#*\s*$", path.read_text(), re.MULTILINE)
        if match is None:
            raise ValueError(f"Markdown index requires a level-one heading: {path}")
        return match.group(1)
    from gramlot.server import GramlotFileServer
    return GramlotFileServer(path.parent).resolve_page(path.stem).title


def directory_index(folder):
    indexes = [folder / name for name in ("00-index.py", "00-index.md") if (folder / name).is_file()]
    if len(indexes) != 1:
        raise ValueError(f"Directory requires exactly one executable or Markdown index: {folder}")
    return indexes[0]


def navigation_directory(directory="", catalogs=()):
    """Read one numbered filesystem level, without exposing its own index."""
    from genro_bag import Bag
    families = read_catalog(PACKAGE / "catalog.json", PACKAGE / "pages", common=True)
    for catalog, pages in catalogs:
        families.extend(read_catalog(catalog, pages, common=False))
    groups = {family["folder"]: family for family in families}
    parts = directory.split("/") if directory else []
    if any(not re.fullmatch(r"[A-Za-z0-9_-]+", part) for part in parts):
        raise ValueError("Invalid navigation directory")
    boundary = groups[parts[0]]["path"] if parts and parts[0] in groups else PACKAGE / "pages"
    folder = boundary.joinpath(*(parts[1:] if parts and parts[0] in groups else parts))
    if not folder.resolve().is_relative_to(boundary.resolve()) or not folder.is_dir():
        raise ValueError("Navigation directory is outside its pages root")
    files = {p.name:p for p in folder.iterdir()}
    if not parts:
        files.update({name:group["path"] for name,group in groups.items()})
    result = Bag()
    for name, child in sorted(files.items()):
        if name.startswith((".", "_")) or child.is_symlink():
            continue
        relative = "/".join([*parts, name])
        if child.is_dir():
            index = directory_index(child)
            attrs = dict(title=page_title(index), category=True, directory=relative,
                         url=f"pages/{relative}/00-index")
            if index.suffix == ".md":
                attrs["markdown"] = index.read_text()
            key = groups[name]["key"] if not parts and name in groups else name
            result.set_item(key, None, **attrs)
        elif child.suffix == ".py" and child.stem != "00-index" and not child.stem.endswith("_aux"):
            group = groups.get(parts[0], {}) if parts else {}
            example = next((item for item in group.get("examples", []) if item["folder"] == "/".join([*parts[1:], child.stem])), None)
            attrs = dict(title=page_title(child), url=f"pages/{'/'.join([*parts, child.stem])}", category=False)
            if example:
                attrs["key"] = example["key"]
            result.set_item(example["key"] if example else child.stem, None, **attrs)
    return result
