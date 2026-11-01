import importlib.util
from pathlib import Path

path = Path(__file__).parents[1] / 'src/gramlot_examples/pages/07-tools/02-advanced/04-editable_image.py'
spec = importlib.util.spec_from_file_location('editable_image_demo', path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def test_temporary_image_target_returns_a_displayable_data_url():
    target = module.Page().save_image({})
    target.write(b'cro')
    target.write(b'p')
    assert target.finish() == {'state': 'completed', 'result': 'data:image/png;base64,Y3JvcA=='}
    assert target.status()['state'] == 'completed'


def test_cancelled_temporary_image_is_unsaved():
    target = module.Page().save_image({})
    target.write(b'partial')
    assert target.abort() == {'state': 'unsaved'}
