import importlib.util
from pathlib import Path

import pytest


module_path = Path(__file__).parents[1] / 'src/gramlot_examples/pages/01-uploader/03-attachment_manager.py'
spec = importlib.util.spec_from_file_location('attachment_demo', module_path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def test_attachment_demo_requires_a_saved_record_and_isolates_pages():
    first = module.Page()
    first.page_id = 'first-page'
    other = module.Page()
    other.page_id = 'other-page'
    metadata = {'name':'notes.txt', 'mediaType':'text/plain', 'context':{'recordId':None}, 'fields':{'title':'Notes'}}
    with pytest.raises(ValueError, match='Save the record'):
        first.attach_file(metadata)
    record_id = first.save_record()
    assert record_id == first.save_record()
    metadata['context']['recordId'] = record_id
    target = first.attach_file(metadata)
    target.write(b'<b>literal</b>')
    attachment_id = target.finish()['result']['attachmentId']
    context = {'recordId': record_id}
    assert len(first.list_attachments(context)) == 1
    assert first.preview_attachment(context, attachment_id).get_item('text') == '<b>literal</b>'
    with pytest.raises(ValueError, match='Record does not match'):
        other.list_attachments(context)
    with pytest.raises(ValueError, match='Record does not match'):
        other.remove_attachment(context, attachment_id)
    assert first.remove_attachment(context, attachment_id) is True
    assert first.remove_attachment(context, attachment_id) is False
    assert len(first.list_attachments(context)) == 0


def test_attachment_demo_cancel_does_not_add_a_file():
    page = module.Page()
    page.page_id = 'cancel-page'
    record_id = page.save_record()
    target = page.attach_file({'context':{'recordId':record_id}, 'name':'x', 'mediaType':'text/plain', 'fields':{}})
    target.write(b'partial')
    assert target.abort() == {'state':'unsaved'}
    assert len(page.list_attachments({'recordId':record_id})) == 0


def test_attachment_preview_supports_raster_images_and_rejects_svg():
    page = module.Page()
    page.page_id = 'image-page'
    record_id = page.save_record()
    for media, expected in [('image/png', 'image'), ('image/svg+xml', 'message')]:
        target = page.attach_file({'context':{'recordId':record_id}, 'name':'sample', 'mediaType':media, 'fields':{}})
        target.write(b'example')
        key = target.finish()['result']['attachmentId']
        preview = page.preview_attachment({'recordId':record_id}, key)
        assert preview.get_item('kind') == expected
        if expected == 'image':
            assert preview.get_item('src').startswith('data:image/png;base64,')


def test_attachment_demo_requires_matching_record_context():
    page = module.Page()
    page.page_id = 'wrong-context'
    page.save_record()
    with pytest.raises(ValueError, match='Record does not match'):
        page.attach_file({'name':'x', 'mediaType':'text/plain', 'fields':{}, 'context':{'recordId':'other'}})
