"""Flask profile for the shared Python page."""
from importlib.resources import files

from flask import Flask
from gramlot_flask import mount_native_html

application = Flask(__name__)
pages = mount_native_html(application, files("gramlot_example_app.pages"))

__all__ = ["application", "pages"]
