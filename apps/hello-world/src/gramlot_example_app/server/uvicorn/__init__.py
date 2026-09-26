"""Raw ASGI profile, run by Uvicorn."""
from importlib.resources import files

from gramlot_uvicorn.asgi import create_asgi_application

application = create_asgi_application(files("gramlot_example_app.pages"))

__all__ = ["application"]
