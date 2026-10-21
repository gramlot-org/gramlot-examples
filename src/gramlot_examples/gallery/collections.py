"""Collections selected by the gallery application."""
import json
from importlib.resources import files


def collections():
    return [{"grammar": json.loads(files("gramlot").joinpath(f"collections/{name}.json").read_text()),
             "module": f"/gallery/dist/{name}.js"} for name in ("inputs", "layout", "tree")]
