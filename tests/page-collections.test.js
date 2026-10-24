import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {GramlotFileServer} from '@gramlot/gramlot/server';
import {Page as GalleryPage} from '../src/gramlot_examples/gallery/page.js';
import {buildGallery} from '../src/gramlot_examples/index.js';

const pages=fileURLToPath(new URL('../src/gramlot_examples/pages/',import.meta.url));
test('every JavaScript page builds with its own collection declarations',async()=>{
 const server=new GramlotFileServer(pages);
 let count=0;
 for await(const PageClass of server.iterPageClasses()){
  const page=new PageClass(),builder=new PageClass.sourceBuilder('main');
  server.loadCollections(builder,server.pageCollections(PageClass));
  await page.main(builder.root);
  assert.ok(builder.toTytx());count++;
 }
 assert.ok(count>=118,`Discovered ${count} pages`);
});
test('basic pages exclude heavy collections; browser metadata imports have hosted assets',async()=>{
 const server=new GramlotFileServer(pages);
 const basic=await server.resolvePage('01-inputs/01-text/01-textbox');
 assert.deepEqual(server.pageCollections(basic).map(c=>c.name),['inputs','layout']);
 assert.deepEqual(server.pageCollections(await server.resolvePage('00-index')),[]);
 assert.ok(!server.pageCollections(GalleryPage).some(c=>c.name==='typst'));
 const gallery=buildGallery();
 for(const collection of gallery.collections)assert.equal(gallery.assets[`/gallery/dist/${collection.name}/descriptor.js`].type,'text/javascript');
});
