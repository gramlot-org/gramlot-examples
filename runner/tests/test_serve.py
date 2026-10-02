"""The Python launcher serves both integrations behind one port."""

import os
import socket
import subprocess
import sys
import time
from pathlib import Path
from urllib.error import URLError
from urllib.request import urlopen

import pytest

pytest.importorskip("gramlot_py_server.uvicorn")

SERVE = Path(__file__).resolve().parents[1] / "serve.py"


def free_port():
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        return probe.getsockname()[1]


def test_serve_answers_python_and_javascript_routes():
    port = free_port()
    process = subprocess.Popen([sys.executable, str(SERVE)], env={**os.environ, "PORT": str(port)},
                               stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    try:
        for line in process.stdout:
            if line.startswith("Gramlot examples:"):
                break
        else:
            pytest.fail("serve.py exited before announcing its URL")
        # The URL is printed before Uvicorn binds the port.
        for route in ("/py/e01", "/js/e01"):
            for _ in range(50):
                try:
                    with urlopen(f"http://127.0.0.1:{port}{route}", timeout=5) as response:
                        assert response.status == 200, route
                        break
                except URLError:
                    time.sleep(0.1)
            else:
                pytest.fail(f"serve.py did not answer {route}")
    finally:
        process.terminate()
        process.wait(timeout=10)
