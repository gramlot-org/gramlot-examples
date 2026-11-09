import assert from 'node:assert/strict';
import test from 'node:test';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {GramlotBuilder} from '@gramlot/gramlot';
import inputs from '@gramlot/gramlot/components/inputs';
import layout from '@gramlot/gramlot/components/layout';
import tree from '@gramlot/gramlot/components/tree';
import {Page as GalleryPage} from '../src/gramlot_examples/gallery/page.js';

const docs = fileURLToPath(new URL('../src/gramlot_examples/documentation_gallery/', import.meta.url));

test('JavaScript Code panel includes the actual Page and shared triangle module', () => {
    class DocumentationGallery extends GalleryPage {
        static catalogs = [[join(docs, 'catalog.json'), join(docs, 'pages')]];
    }
    const builder = new GramlotBuilder(null, {collections: [inputs.toDocument(), layout.toDocument(), tree.toDocument()]});
    new DocumentationGallery().lesson(builder.root, {key: 'documentation-03-many', view: 'code'});
    const wire = builder.toTytx();
    assert.match(wire, /triangle\.js/);
    assert.match(wire, /export function triangle/);
    assert.match(wire, /import \{triangle\}/);
});
