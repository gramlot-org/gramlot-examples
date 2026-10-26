"""Create a public module artifact from the owning repository's built sources."""
import argparse
import json
import shutil
from pathlib import Path


def prepare(source, target):
    source, target = Path(source), Path(target)
    # A fresh destination makes the resulting archive auditable and excludes stale files.
    target.mkdir(parents=True, exist_ok=False)
    files = [source / name for name in ('__init__.py', 'page.py', 'catalog.json')]
    files += sorted((source / 'pages').glob('*.py'))
    files += sorted((source / 'pages').glob('*.js'))
    files += [source / 'pages/index.css']
    files += [source / 'assets' / name for name in (
        'device-provider.js', 'barcode-test.png', 'barcode-test-code128.png')]
    for file in files:
        if file.is_symlink() or not file.is_file():
            raise ValueError(f'Expected a regular public artifact: {file}')
        relative = file.relative_to(source)
        output = target / relative
        output.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(file, output)
    catalog = json.loads((target / 'catalog.json').read_text())
    for entry in catalog['entries']:
        if not (target / 'pages' / (entry['path'] + '.py')).is_file():
            raise ValueError(f'Missing catalogue page: {entry["id"]}')
    return len(files)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    parser.add_argument('target', type=Path, help='Fresh directory named mobile_application')
    args = parser.parse_args()
    print(f'Prepared {prepare(args.source, args.target)} public files')
