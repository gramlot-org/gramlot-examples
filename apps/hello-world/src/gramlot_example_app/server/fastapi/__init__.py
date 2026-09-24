"""FastAPI profile for the shared Python page."""
from importlib.resources import files

from gramlot_fastapi import NativeHtmlApplication

application = NativeHtmlApplication(files("gramlot_example_app.pages"), title="Gramlot Hello World")

__all__ = ["application"]
