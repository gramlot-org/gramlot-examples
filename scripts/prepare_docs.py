"""Stage the public manual and lessons in catalogue order without importing Gramlot."""
import json
import posixpath
import re
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = "src/gramlot_examples/pages"
GUIDES = ("docs/005-repository-map.md", "docs/010-gallery.md")
REPOSITORY = "https://github.com/gramlot-org/gramlot-examples/blob/main/"


def stage():
    catalog = json.loads((ROOT / "src/gramlot_examples/catalog.json").read_text())
    documents = {"README.md": "index.md", **{p: p for p in GUIDES},
                 f"{PAGES}/README.md": "lessons/index.md"}
    for family in catalog["families"]:
        key = family["key"]
        documents[f"{PAGES}/{key}/README.md"] = f"lessons/{key}/index.md"
        for example in family["examples"]:
            name = example["folder"]
            documents[f"{PAGES}/{key}/{name}.md"] = f"lessons/{key}/{name}.md"
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
                if source == f'{PAGES}/{family["key"]}/README.md':
                    text = add_toc(text, [e["folder"] for e in family["examples"]], family["title"])
        if source.startswith(PAGES + "/") and not source.endswith("README.md"):
            text += "\n\n## Complete source\n\nPython builds the page; the JavaScript module also supplies any browser Logic.\n"
            for extension, language in (("py", "python"), ("js", "javascript"), ("css", "css")):
                original = (ROOT / source).with_suffix("." + extension)
                if original.exists():
                    copied = (destination / target).with_suffix("." + extension)
                    copied.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copyfile(original, copied)
                    text += f"\n```{{literalinclude}} {copied.name}\n:language: {language}\n:caption: {copied.name}\n```\n"
        output = destination / target
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(text)
    subprocess.run(["node", str(ROOT / "scripts/build-docs-example.mjs")], check=True)
    print(f"Staged {len(documents)} public pages, including {sum(len(f['examples']) for f in catalog['families'])} lessons.")
    return documents


if __name__ == "__main__":
    stage()
