"""Serve the provider-free base chat example with the standard WebSocket adapter."""
import argparse
from pathlib import Path
import gramlot_examples
from gramlot_py_server.uvicorn import serve
from gramlot_examples.gallery.collections import collections

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8773)
    args = parser.parse_args()
    pages = Path(gramlot_examples.__file__).parent / 'trials/chat_base/pages/92-chat'
    serve(pages, host='127.0.0.1', port=args.port, websocket=True, collections=collections())
