"""Gramlot example pages, the gallery page and its catalogue."""

import json
import re
from importlib.resources import files
from pathlib import Path
from .gallery.collections import collections as gallery_collections

PACKAGE = Path(__file__).resolve().parent
MEDIA_TYPES = {".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json"}
SUFFIXES = (".py", ".js", ".css", ".md", ".json", "_aux.js", "_data.tytx")
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
            check_requires(example.get("requires"), f"{catalog}: {example['key']}")
        families.append({**family, "path": Path(pages) / family["folder"]})
    return families


def check_requires(requires, where):
    """A lesson's ``requires`` is absent or a list of non-empty strings."""
    if requires is not None and (not isinstance(requires, list)
                                 or any(not isinstance(need, str) or not need.strip() for need in requires)):
        raise ValueError(f"requires must be a list of non-empty strings: {where}")


def read_groups():
    """The root groups of the navigation, in order: ``key``, ``title`` and ``description`` (``groups.json``)."""
    groups = json.loads((PACKAGE / "groups.json").read_text())
    for group in groups:
        if set(group) != {"key", "title", "description"} or not all(
                isinstance(group[name], str) and group[name].strip() for name in group):
            raise ValueError(f"A group declares a non-empty key, title and description: {group!r}")
    keys = [group["key"] for group in groups]
    if len(set(keys)) != len(keys):
        raise ValueError("Duplicate group key in groups.json")
    return groups


def check_groups(families, groups):
    """Each family ``group`` is declared; families sharing a folder agree; no group key is a family key."""
    keys = {group["key"] for group in groups}
    by_folder = {}
    for family in families:
        group = family.get("group")
        if group is None:
            continue
        if group not in keys:
            raise ValueError(f"Family {family['key']!r} names an unknown group: {group!r}")
        if by_folder.setdefault(family["folder"], group) != group:
            raise ValueError(f"Families of folder {family['folder']!r} name different groups")
    clashes = sorted(keys & {family["key"] for family in families})
    if clashes:
        raise ValueError(f"Group keys used as family keys: {', '.join(clashes)}")
    return by_folder


def read_filters(catalog):
    """Read the ``filters.json`` beside ``catalog``: declared filters, or an empty list when absent."""
    path = Path(catalog).with_name("filters.json")
    if not path.is_file():
        return []
    rules = json.loads(path.read_text())
    if not isinstance(rules, list):
        raise ValueError(f"filters.json must be a list: {path}")
    for rule in rules:
        if not isinstance(rule, dict) or not isinstance(rule.get("label"), str) or not rule["label"].strip():
            raise ValueError(f"A filter requires a non-empty label: {path}")
        if set(rule) - {"label", "requires", "any"} or ("requires" in rule and "any" in rule):
            raise ValueError(f"Filter {rule['label']!r} declares only label and one of requires or any: {path}")
        if "requires" in rule and rule["requires"] != []:
            raise ValueError(f"Filter {rule['label']!r}: requires must be an empty list: {path}")
        if "any" in rule and (not isinstance(rule["any"], list) or not rule["any"]
                              or any(not isinstance(need, str) or not need.strip() for need in rule["any"])):
            raise ValueError(f"Filter {rule['label']!r}: any must be a non-empty list of strings: {path}")
    labels = [rule["label"] for rule in rules]
    if len(set(labels)) != len(labels):
        raise ValueError(f"Duplicate filter label: {path}")
    return rules


def merge_filters(catalogs):
    """The filters of every catalogue, in order; a label declared twice must be identical."""
    filters = []
    for catalog in catalogs:
        for rule in read_filters(catalog):
            known = next((item for item in filters if item["label"] == rule["label"]), None)
            if known is None:
                filters.append(rule)
            elif known != rule:
                raise ValueError(f"Conflicting definitions of filter {rule['label']!r}: {catalog}")
    return filters


def filter_matches(rule, requires):
    """Whether a lesson with ``requires`` belongs to the filter ``rule``."""
    requires = requires or []
    if "any" in rule:
        return bool(set(rule["any"]) & set(requires))
    if "requires" in rule:
        return not requires
    return True


def available_filters(gallery):
    """The filters of ``gallery`` that match at least one of its catalogued lessons."""
    lessons = [example.get("requires") for family in gallery["families"] for example in family["examples"]]
    return [rule for rule in gallery["filters"] if any(filter_matches(rule, requires) for requires in lessons)]


def build_gallery(catalogs=()):
    """Return the families, routes, static assets and filters of the common gallery plus ``catalogs``.

    Each item of ``catalogs`` is a pair ``(catalog.json, pages folder)`` of one environment.
    ``routes`` maps each key to its Python page, its same-name stylesheet and its logic
    module: ``NN_name_aux.js``, else ``NN_name.js``, whose ``Logic`` export the server takes
    (the server raises when both files exist). ``assets`` maps each URL to its file and media
    type. ``filters`` are the declared lesson filters of the ``filters.json`` files beside the
    catalogues (see ``available_filters``). Nothing is written or served here.
    """
    families = read_catalog(PACKAGE / "catalog.json", PACKAGE / "pages", common=True)
    for catalog, pages in catalogs:
        families.extend(read_catalog(catalog, pages, common=False))
    filters = merge_filters([PACKAGE / "catalog.json", *(catalog for catalog, _ in catalogs)])
    check_groups(families, read_groups())
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
        *((f"/assets/branding/svg/{name}.svg", resources / "assets" / "branding" / "svg" / f"{name}.svg")
          for name in ("gramlot-horizontal-primary", "gramlot-horizontal-inverse")),
        ("/assets/branding/app-icon.png", resources / "assets" / "branding" / "app-icon.png"),
        ("/gallery/gallery.css", gallery / "gallery.css"),
        *((f"/gallery/{name}", gallery / name) for name in ("page.py", "page.js") if (gallery / name).is_file()),
    ]
    assets = {url: {"file": path, "type": media_type(path)} for url, path in files_by_url}
    assets["/trials/menu/theme_preview.js"] = {"file": PACKAGE / "trials/menu/theme_preview.js", "type": "text/javascript"}
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
            if "presentation" in example:
                routes[example["key"]]["presentation"] = example["presentation"]
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
            for suffix in SUFFIXES:
                source = page.with_name(page.stem + suffix)
                if source.is_file():
                    assets[f"/{key}{suffix}"] = {"file": source, "type": media_type(source)}
    for route in routes.values():
        data = route["page"].with_name(route["page"].stem + "_data.tytx")
        route["data"] = data if data.is_file() else None
    return {"families": families, "routes": routes, "assets": assets, "collections": gallery_collections(), "filters": filters}


__all__ = ["build_gallery", "navigation_directory", "available_filters", "filter_matches", "read_groups"]

def page_title(path):
    """Read gallery metadata first, then the page class or Markdown heading."""
    metadata = path.with_suffix(".json")
    if metadata.is_file():
        title = json.loads(metadata.read_text()).get("title")
        if title:
            return title
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


def navigation_directory(directory="", catalogs=(), filter=None):
    """Read one numbered filesystem level, without exposing its own index.

    ``filter`` is the label of a declared filter. With one, only the lessons it matches are listed
    and a directory without a matching lesson below it is omitted. ``None`` lists everything.
    The root lists the groups of ``groups.json`` in order, then the families without ``group``; a group
    lists its families. No directory holds a single entry: a directory whose listing has one entry is
    replaced by that entry, at every level, after the environment and the filter.
    """
    families = read_catalog(PACKAGE / "catalog.json", PACKAGE / "pages", common=True)
    for catalog, pages in catalogs:
        families.extend(read_catalog(catalog, pages, common=False))
    rule = None
    if filter is not None:
        rules = merge_filters([PACKAGE / "catalog.json", *(catalog for catalog, _ in catalogs)])
        rule = next((item for item in rules if item["label"] == filter), None)
        if rule is None:
            raise ValueError(f"Unknown filter: {filter}")
        if "any" not in rule and "requires" not in rule:
            rule = None
    groups = read_groups()
    by_folder = check_groups(families, groups)
    keys = {group["key"] for group in groups}

    def listing(path):
        if path == "" or path in keys:
            return navigation_root(path, families, rule, groups, by_folder)
        return navigation_level(path, families, rule)

    from genro_bag import Bag
    result = Bag()
    for node in listing(directory).get_nodes():
        while node.attr.get("directory") is not None:
            children = listing(node.attr["directory"]).get_nodes()
            if len(children) != 1:
                break
            node = children[0]
        result.set_item(node.label, None, **node.attr)
    return result


def navigation_root(directory, families, rule, groups, by_folder):
    """The root level grouped by ``groups``, or the families of the group ``directory``."""
    from genro_bag import Bag
    members = {group["key"]: [] for group in groups}
    ungrouped = []
    for node in navigation_level("", families, rule).get_nodes():
        group = by_folder.get(node.attr.get("directory"))
        (members[group] if group else ungrouped).append(node)
    result = Bag()
    for group in groups:
        nodes = members[group["key"]]
        if directory:
            if group["key"] == directory:
                for node in nodes:
                    result.set_item(node.label, None, **node.attr)
        elif nodes:
            result.set_item(group["key"], None, title=group["title"], category=True, directory=group["key"],
                            url=f"groups/{group['key']}",
                            markdown=f"# {group['title']}\n\n{group['description']}\n")
    if not directory:
        for node in ungrouped:
            result.set_item(node.label, None, **node.attr)
    return result


def navigation_level(directory, families, rule):
    from genro_bag import Bag
    groups = {}
    for family in families:  # Families sharing a folder are listed under the key of the first one.
        groups.setdefault(family["folder"], family)
    parts = directory.split("/") if directory else []
    if any(not re.fullmatch(r"[A-Za-z0-9_-]+", part) for part in parts):
        raise ValueError("Invalid navigation directory")
    roots = [family["path"] for family in families if parts and family["folder"] == parts[0]]
    suffix = parts[1:] if roots else parts
    folders = []
    for boundary in roots or [PACKAGE / "pages"]:
        folder = boundary.joinpath(*suffix)
        if not folder.resolve().is_relative_to(boundary.resolve()):
            raise ValueError("Navigation directory is outside its pages root")
        if folder.is_dir():
            folders.append(folder)
    if not folders:
        raise ValueError("Navigation directory does not exist")
    files = {p.name: p for directory in folders for p in directory.iterdir()}
    if not parts:
        files.update({name:group["path"] for name,group in groups.items()})
    result = Bag()
    for name, child in sorted(files.items()):
        if name.startswith((".", "_")) or child.is_symlink():
            continue
        relative = "/".join([*parts, name])
        if child.is_dir():
            index_metadata = child / "00-index.json"
            if index_metadata.is_file() and json.loads(index_metadata.read_text()).get("navigation") is False:
                continue
            index = directory_index(child)
            if rule is not None and not len(navigation_level(relative, families, rule)):
                continue
            attrs = dict(title=page_title(index), category=True, directory=relative,
                         url=f"pages/{relative}/00-index")
            if index.suffix == ".md":
                attrs["markdown"] = index.read_text()
            key = groups[name]["key"] if not parts and name in groups else name
            result.set_item(key, None, **attrs)
        elif child.suffix == ".py" and child.stem != "00-index" and not child.stem.endswith("_aux"):
            examples = [item for family in families if parts and family["folder"] == parts[0]
                        for item in family["examples"]]
            example = next((item for item in examples if item["folder"] == "/".join([*parts[1:], child.stem])), None)
            metadata = child.with_suffix(".json")
            descriptor = json.loads(metadata.read_text()) if metadata.is_file() else None
            if descriptor and descriptor.get("navigation") is False:
                continue
            requires = (example or descriptor or {}).get("requires")
            if rule is not None and not filter_matches(rule, requires):
                continue
            title = example["title"] if example else descriptor["title"] if descriptor else page_title(child)
            attrs = dict(title=title, url=f"pages/{'/'.join([*parts, child.stem])}", category=False)
            if descriptor:
                attrs.update({name: descriptor[name] for name in ("description", "tags", "component") if name in descriptor})
            if requires:
                attrs["requires"] = requires
            if example:
                attrs["key"] = example["key"]
            result.set_item(example["key"] if example else child.stem, None, **attrs)
    return result
