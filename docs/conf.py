"""Public guides and catalogue lessons, staged by scripts/prepare_docs.py."""
from pathlib import Path
import tomllib

project = "gramlot-examples"
author = "Gramlot contributors"
copyright = "2026, Gramlot contributors"
release = tomllib.loads((Path(__file__).resolve().parents[2] / "pyproject.toml").read_text())["project"]["version"]
version = release
extensions = ["myst_parser"]
source_suffix = {".md": "markdown"}
root_doc = "index"
exclude_patterns = []
nitpicky = True
myst_heading_anchors = 6
html_theme = "sphinx_rtd_theme"
html_logo = "_static/gramlot-logo.svg"
html_show_sourcelink = False
