"""Stage the public manual and lessons in catalogue order without importing Gramlot."""
import json
from html import escape
import posixpath
import re
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = "src/gramlot_examples/pages"
GUIDES = ("docs/030-using-the-gallery.md", "docs/035-feature-coverage.md", "docs/005-repository-map.md", "docs/020-mobile-modules.md", "docs/010-gallery.md")
REPOSITORY = "https://github.com/gramlot-org/gramlot-examples/blob/main/"


def stage():
    catalog = json.loads((ROOT / "src/gramlot_examples/catalog.json").read_text())
    documents = {"README.md": "index.md", **{p: p for p in GUIDES},
                 f"{PAGES}/README.md": "lessons/index.md"}
    lessons = {}
    for family in catalog["families"]:
        key = family["key"]
        folder = family["folder"]
        documents[f"{PAGES}/{folder}/README.md"] = f"lessons/{key}/index.md"
        for example in family["examples"]:
            name = example["folder"]
            documents[f"{PAGES}/{folder}/{name}.md"] = f"lessons/{key}/{name}.md"
            lessons[f"{PAGES}/{folder}/{name}.md"] = example
    destination = ROOT / "build/docs-source"
    if destination.exists():
        shutil.rmtree(destination)
    destination.mkdir(parents=True)
    shutil.copyfile(ROOT / "docs/conf.py", destination / "conf.py")
    (destination / "_static").mkdir()
    shutil.copyfile(ROOT / "docs/gramlot-logo.svg", destination / "_static/gramlot-logo.svg")

    def toc(entries, caption):
        return "\n\n```{toctree}\n:maxdepth: 1\n:caption: " + caption + "\n\n" + "\n".join(entries) + "\n```\n"

    def add_toc(text, entries, caption):
        positions = [text.find(marker) for marker in ("\n## ", "\n<details>")]
        position = min((p for p in positions if p >= 0), default=len(text))
        return text[:position] + toc(entries, caption) + text[position:]

    for source, target in documents.items():
        text = (ROOT / source).read_text()
        if source == "docs/010-gallery.md":
            # Keep old block URLs usable, but do not teach superseded implementations.
            anchors = re.findall(r'<a id="([^"]+)"></a>', text)
            text = ("# Historical gallery engineering record\n\n"
                    "These dated notes describe earlier implementations. For current behavior, "
                    "read [Using the gallery](030-using-the-gallery.md).\n\n"
                    "The complete record remains [in the repository](" + REPOSITORY + source + ").\n\n")
            for anchor in anchors:
                text += (f'<a id="{anchor}"></a>\n\n'
                         f'[Historical block {anchor}]({REPOSITORY}{source}#{anchor})\n\n')
        text = re.sub(r'<a id="([^"]+)"></a>', r'(\1)=', text)
        def link(match):
            label, url = match.groups()
            path, separator, fragment = url.partition("#")
            if path.startswith(REPOSITORY):
                path = path[len(REPOSITORY):]
            elif "://" not in path and not path.startswith(("#", "/")) and path:
                path = posixpath.normpath(posixpath.join(posixpath.dirname(source), path))
            if path.endswith("/"):
                path += "README.md"
            if path not in documents and f"{path}/README.md" in documents:
                path += "/README.md"
            if path in documents and fragment.startswith("ge-"):
                return f"{{ref}}`{label} <{fragment}>`"
            if path in documents:
                url = posixpath.relpath(documents[path], posixpath.dirname(target) or ".") + separator + fragment
            return f"[{label}]({url})"
        text = re.sub(r"\[([^\]\n]+)\]\(([^)\s]+)\)", link, text)
        if source == "README.md":
            text = add_toc(text, ["lessons/index", *(str(Path(p).with_suffix("")) for p in GUIDES)], "Learn and use")
        elif source == f"{PAGES}/README.md":
            text = add_toc(text, [f'{f["key"]}/index' for f in catalog["families"]], "Learning sequence")
        else:
            for family in catalog["families"]:
                if source == f'{PAGES}/{family["folder"]}/README.md':
                    text = add_toc(text, [e["folder"] for e in family["examples"]], family["title"])
        if source.startswith(PAGES + "/") and not source.endswith("README.md"):
            example = lessons[source]
            url = posixpath.relpath(f"playgrounds/{example['key']}/index.html", posixpath.dirname(target))
            title = escape(f"Gramlot {example['title']} and inspector playground", quote=True)
            playground = ("\n\n```{raw} html\n"
                          f'<p><a href="{url}" target="_blank" rel="noopener">Open this example in a separate tab</a>'
                          ' · Use 🔍 to open the Inspector.</p>\n'
                          f'<iframe src="{url}" title="{title}" width="100%" height="620"'
                          ' loading="lazy" style="border: 1px solid #ddd;"></iframe>\n```\n\n')
            text += playground
            text += "\n\n## Complete source\n\nPython builds the page; the JavaScript module also supplies any browser Logic.\n"
            for extension, language in (("py", "python"), ("js", "javascript"), ("css", "css")):
                original = (ROOT / source).with_suffix("." + extension)
                if original.exists():
                    copied = (destination / target).with_suffix("." + extension)
                    copied.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copyfile(original, copied)
                    text += f"\n```{{literalinclude}} {copied.name}\n:language: {language}\n:caption: {copied.name}\n```\n"
            data_file = (ROOT / source).with_name(Path(source).stem + "_data.tytx")
            if data_file.is_file():
                text += "\n\n## Initial Data Bag\n\nThe same-name TYTX companion is loaded automatically before rendering.\n\n```text\n" + data_file.read_text().rstrip() + "\n```\n"
        output = destination / target
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(text)
    subprocess.run(["node", str(ROOT / "scripts/build-docs-example.mjs")], check=True)
    print(f"Staged {len(documents)} public pages, including {sum(len(f['examples']) for f in catalog['families'])} lessons.")
    return documents


if __name__ == "__main__":
    stage()
