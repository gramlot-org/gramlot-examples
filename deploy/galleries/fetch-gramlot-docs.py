"""Install the core docs_llm manuals of the installed gramlot release.

The visual editor assistant of the ai catalogue reads them (GRAMLOT_DOCS_ROOT).
The PyPI wheel does not contain them, so the image build takes them from the
public GitHub tag of the installed version. Only regular files under docs_llm/
are extracted; nothing downloaded is executed.
"""
import importlib.metadata
import io
import sys
import tarfile
from pathlib import Path
from urllib.request import urlopen

import gramlot_examples
from gramlot_examples.trials.visual_editor_chat.documentation import DocumentationIndex


def main():
    target = Path(sys.argv[1])
    version = importlib.metadata.version('gramlot')
    url = f'https://codeload.github.com/gramlot-org/gramlot/tar.gz/refs/tags/v{version}'
    with urlopen(url, timeout=120) as response:
        data = response.read()
    with tarfile.open(fileobj=io.BytesIO(data), mode='r:gz') as archive:
        members = []
        for member in archive.getmembers():
            parts = Path(member.name).parts
            if len(parts) > 2 and parts[1] == 'docs_llm' and member.isfile():
                member.name = str(Path(*parts[2:]))
                members.append(member)
        if not members:
            raise SystemExit(f'No docs_llm files in {url}')
        archive.extractall(target, members=members, filter='data')
    # Fail the build when a manual of the assistant's catalogue is missing.
    DocumentationIndex(target, Path(gramlot_examples.__file__).parent)
    print(f'gramlot {version}: {len(members)} docs_llm files in {target}', flush=True)


if __name__ == '__main__':
    main()
