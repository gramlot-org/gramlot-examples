"""A host catalogue is data; only validated local URLs become direct panels."""
import copy
import unittest
from gramlot_examples.gallery.modules import registered_modules, module_bag
from gramlot_examples.gallery.page import Page
from gramlot_examples.gallery.collections import collections

REGISTRATION = {'catalog': {'id': 'mobileApplication', 'title': 'Mobile application', 'visibility': 'native',
    'entries': [dict(id='app', title='App information', path='app', capabilities=['appinfo'], requires=[]),
                dict(id='push', title='Push', path='push', capabilities=['push'], requires=['pushRegistration'])]},
    'mount': '/mobile-application', 'integration': '/mobile-application/device-provider.js'}

class ModuleTests(unittest.TestCase):
    def test_catalogue_prerequisites_and_direct_frame(self):
        result = registered_modules([REGISTRATION])
        self.assertEqual([e['id'] for e in result[0]['entries']], ['app'])
        page = Page(); page.gallery_modules = [REGISTRATION]
        grammar = [__import__('json').loads(c.verify()[c.grammar]) for c in collections()]
        builder = page.source_builder('main', collections=grammar)
        node = module_bag([REGISTRATION]).get_item('mobileApplication').get_node('app')
        node.set_attr({'url': 'https://attacker.invalid/ignored'})
        page.panel(builder.root, node)
        self.assertEqual(len(builder.source.nodes), 1)
        iframe = builder.source.nodes[0]
        self.assertEqual(iframe.node_tag, 'iframe')
        self.assertEqual(iframe.attr['src'], '/mobile-application/app')
        node.set_attr({'moduleEntry':'missing'})
        with self.assertRaisesRegex(ValueError, 'Unknown registered'):
            page.panel(builder.root, node)

    def test_paths_cannot_escape_or_select_origin(self):
        for value in ['../app', '/app', '//evil/app', 'https://evil/app', '%2e%2e/app', 'x\\app', 'app?x=1', 'a//b']:
            registration = copy.deepcopy(REGISTRATION)
            registration['catalog']['entries'][0]['path'] = value
            with self.subTest(value=value), self.assertRaises(ValueError):
                registered_modules([registration])
        with self.assertRaises(ValueError):
            registered_modules([REGISTRATION, REGISTRATION])

    def test_push_is_only_listed_when_configured(self):
        result = registered_modules([{**REGISTRATION, 'prerequisites':['pushRegistration']}])
        self.assertEqual(len(result[0]['entries']),2)
