import importlib.util
from pathlib import Path

import pytest


module_path = Path(__file__).parents[1] / "src/gramlot_examples/pages/01-uploader/02-upload_queue.py"
spec = importlib.util.spec_from_file_location("upload_queue_example", module_path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def test_example_validates_metadata_and_does_not_store_bytes():
    target = module.Page().inspect_file({"fields": {"title": "Report", "description": "Example"}})
    assert target.max_bytes == 1024 * 1024
    target.write(b"abc")
    assert target.finish() == {"state": "completed", "result": {"size": 3, "fields": {"title": "Report", "description": "Example"}}}
    assert target.abort()["state"] == "completed"
    with pytest.raises(ValueError, match="text"):
        module.Page().inspect_file({"fields": {"title": 42}})


def test_example_cancel_reports_unsaved():
    target = module.Page().inspect_file({"fields": {}})
    target.write(b"abc")
    assert target.abort() == {"state": "unsaved"}
    assert target.status() == {"state": "unsaved"}
