"""Kajenn/Genro ASGI profile for the shared Python page."""
from importlib.resources import files

from gramlot_kajenn import KajennNativeHtmlApplication

application = KajennNativeHtmlApplication(files("gramlot_example_app.pages"), mount="page")

__all__ = ["application"]
