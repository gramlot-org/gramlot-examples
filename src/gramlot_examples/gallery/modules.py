"""Trusted host registrations; catalogue entries never choose an origin or script."""
import re
from genro_bag import Bag


def local_path(value, *, absolute=False):
    if not isinstance(value, str) or not value or '\\' in value or any(c in value for c in '%?#:'):
        raise ValueError('Module paths must be plain local paths')
    parts = value.split('/')
    if absolute:
        if not value.startswith('/') or value.startswith('//'):
            raise ValueError('A module mount must be root-relative')
        parts = parts[1:]
    if any(not re.fullmatch(r'[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*', p) or p in ('.', '..') for p in parts):
        raise ValueError('Module paths cannot escape their mount')
    return value


def registered_modules(registrations):
    """Validate host metadata once; omit entries with unavailable prerequisites."""
    result = []
    seen = set()
    for registration in registrations:
        catalog = registration['catalog']
        identity = local_path(catalog['id'])
        if '/' in identity or identity in seen:
            raise ValueError('Module catalogue IDs must be unique')
        seen.add(identity)
        if catalog['visibility'] != 'native':
            raise ValueError('Only native module visibility is supported')
        mount = local_path(registration['mount'], absolute=True)
        integration = local_path(registration['integration'], absolute=True)
        prerequisites = set(registration.get('prerequisites', ()))
        entries = []
        ids = set()
        for entry in catalog['entries']:
            key = local_path(entry['id'])
            path = local_path(entry['path'])
            if '/' in key or key in ids:
                raise ValueError('Module entry IDs must be unique')
            ids.add(key)
            if not set(entry['requires']).issubset(prerequisites):
                continue
            entries.append(dict(id=key, title=entry['title'], url=f'{mount}/{path}',
                                capabilities=entry['capabilities']))
        result.append(dict(id=identity, title=catalog['title'], visibility='native',
                           integration=integration, entries=entries))
    return result


def module_bag(registrations):
    result = Bag()
    for item in registered_modules(registrations):
        children = Bag()
        for entry in item['entries']:
            children.set_item(entry['id'], None, dict(title=entry['title'], url=entry['url'],
                              module=item['id'], moduleEntry=entry['id']))
        result.set_item(item['id'], children, dict(title=item['title'], integration=item['integration']))
    return result
