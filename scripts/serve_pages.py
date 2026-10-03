"""Serve one folder of Python pages with gramlot-py-server: ``python scripts/serve_pages.py <folder> <port>``."""

import sys

import uvicorn
from gramlot_py_server.uvicorn import create_application

folder, port = sys.argv[1], int(sys.argv[2])
uvicorn.run(create_application(folder), host="127.0.0.1", port=port, log_level="warning")
