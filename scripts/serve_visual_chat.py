"""Launch the real Source-chat trial using the existing Uvicorn PageStore channel."""
import argparse
import logging
import os
import subprocess
import tempfile
from pathlib import Path
from gramlot_py_server.uvicorn import serve
from gramlot_py_server.gallery import stage
from gramlot_examples.gallery.collections import collections

if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port',type=int,default=50787)
    parser.add_argument('--anthropic-secret-ref')
    parser.add_argument('--gramlot-docs',required=True,help='Matching Gramlot docs_llm root')
    parser.add_argument('--python-page', type=Path, help='Existing Python page to edit with remote_edit')
    args=parser.parse_args()
    os.environ['GRAMLOT_DOCS_ROOT']=str(Path(args.gramlot_docs).resolve())
    if args.anthropic_secret_ref:
        try:
            signed_in=subprocess.run(['op','signin'],capture_output=True,text=True,timeout=55)
            if signed_in.returncode:
                parser.error('Unlock 1Password and authorize CLI access before retrying')
            secret=subprocess.run(['op','read',args.anthropic_secret_ref],capture_output=True,text=True,timeout=55)
        except subprocess.TimeoutExpired:
            parser.error('1Password app authorization timed out; unlock the app and retry')
        if secret.returncode or not secret.stdout.strip():
            parser.error('1Password could not provide the Anthropic credential')
        os.environ['ANTHROPIC_API_KEY']=secret.stdout.strip()
        del signed_in, secret
    if not os.environ.get('ANTHROPIC_API_KEY'):
        parser.error('Provide ANTHROPIC_API_KEY or --anthropic-secret-ref')
    from gramlot_examples.trials.visual_editor_chat.assistant import get_assistant
    logger=logging.getLogger('gramlot_examples.trials.visual_editor_chat.assistant')
    logger.setLevel(logging.INFO)
    logger.addHandler(logging.StreamHandler())
    get_assistant()
    with tempfile.TemporaryDirectory(prefix='gramlot-visual-gallery-') as folder:
        assets=stage(Path(folder), [], '', remote_edit=False,
                     editor_python=args.python_page)
        editor_page=Path(folder)/"pages/07-tools/02-visual_source.py"
        with editor_page.open("a") as stream:
            stream.write("\nfrom gramlot_examples.trials.visual_editor_chat.assistant import SourceAssistantStore as PageStore\nPage.editor_chat = True\n")
            if args.python_page is not None:
                stream.write("\nPage.remote_edit = True\n")
        print(f'Visual editor gallery: http://127.0.0.1:{args.port}/pages/07-tools/02-visual_source', flush=True)
        serve(folder,host='127.0.0.1',port=args.port,websocket=True,
              assets=assets,collections=collections())
