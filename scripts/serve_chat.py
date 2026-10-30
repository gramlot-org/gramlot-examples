"""Run the local AI chat with the shared ChatPane and WebSocket integration."""
import argparse
import os
import subprocess
from pathlib import Path
import gramlot_examples
from gramlot_py_server.uvicorn import serve
from gramlot_examples.gallery.collections import collections

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8772)
    parser.add_argument('--anthropic-secret-ref', help='1Password op:// reference to the API credential field')
    parser.add_argument('--openai-secret-ref', help='1Password op:// reference for image generation')
    args = parser.parse_args()
    for reference, variable in ((args.anthropic_secret_ref, 'ANTHROPIC_API_KEY'),
                                (args.openai_secret_ref, 'OPENAI_API_KEY')):
        if reference:
            secret = subprocess.run(['op', 'read', reference], capture_output=True, text=True)
            if secret.returncode or not secret.stdout.strip():
                parser.error(f'1Password could not provide the credential for {variable}')
            os.environ[variable] = secret.stdout.strip()
            del secret
    if not os.environ.get('ANTHROPIC_API_KEY') or not os.environ.get('OPENAI_API_KEY'):
        parser.error('Provide both API keys through the environment or the 1Password reference arguments')
    from gramlot_examples.trials.chat.anthropic_chat import get_provider
    from gramlot_examples.trials.chat.openai_images import get_images
    get_provider()
    get_images()
    pages = Path(gramlot_examples.__file__).parent / 'trials/chat/pages'
    serve(pages, host='127.0.0.1', port=args.port, websocket=True, collections=collections())
