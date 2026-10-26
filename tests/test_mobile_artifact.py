"""Public preparation must not copy private native-project state."""
import importlib.util
import json
from pathlib import Path
import pytest

spec = importlib.util.spec_from_file_location('prepare_mobile', Path(__file__).parents[1] / 'deploy/galleries/prepare-mobile.py')
prepare_mobile = importlib.util.module_from_spec(spec)
spec.loader.exec_module(prepare_mobile)


def test_preparation_copies_only_public_module_inputs(tmp_path):
    source = tmp_path / 'source'
    (source / 'pages').mkdir(parents=True)
    (source / 'assets').mkdir()
    for name in ('__init__.py', 'page.py', 'pages/app.py', 'pages/app.js', 'pages/index.css',
                 'assets/device-provider.js', 'assets/barcode-test.png', 'assets/barcode-test-code128.png'):
        (source / name).write_text('public')
    (source / 'catalog.json').write_text(json.dumps({'entries':[{'id':'app','path':'app'}]}))
    for name in ('.local', '__pycache__'):
        (source / name).mkdir()
        (source / name / 'secret').write_text('private')
    (source / 'assets/private-key.p8').write_text('private')
    target = tmp_path / 'public/mobile_application'
    assert prepare_mobile.prepare(source, target) == 9
    assert not any(p.name in ('.local','__pycache__','private-key.p8') for p in target.rglob('*'))
    with pytest.raises(FileExistsError):
        prepare_mobile.prepare(source, target)
