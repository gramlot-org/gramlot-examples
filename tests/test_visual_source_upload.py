"""The visual editor's upload target validates before returning Source."""
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path

import pytest
from gramlot import GramlotBuilder


SOURCE = Path(__file__).resolve().parents[1] / 'src/gramlot_examples/pages/07-tools/02-advanced/01-visual_source.py'
spec = spec_from_file_location('visual_source_upload', SOURCE)
module = module_from_spec(spec)
spec.loader.exec_module(module)


def test_source_upload_accepts_single_page_root_and_preserves_result():
    builder = GramlotBuilder()
    builder.root.div(node_label='pageRoot').p('Example')
    wire = builder.to_tytx()
    target = module.Page().import_source({'name':'test.grmlt'})
    target.write(wire.encode())
    assert target.finish() == {'state':'completed', 'result':wire}
    assert target.abort() == {'state':'completed', 'result':wire}


def test_source_upload_rejects_invalid_data_and_filename():
    with pytest.raises(ValueError, match='grmlt'):
        module.Page().import_source({'name':'test.txt'})
    target = module.SourceImport()
    target.write(b'not typed Source')
    with pytest.raises(ValueError, match='pageRoot'):
        target.finish()
    assert target.abort() == {'state':'unsaved'}
