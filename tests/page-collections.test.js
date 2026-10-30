import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {GramlotFileServer} from '@gramlot/gramlot/server';
import {Page as GalleryPage} from '../src/gramlot_examples/gallery/page.js';
import {collections} from '../src/gramlot_examples/gallery/collections.js';
import {buildGallery} from '../src/gramlot_examples/index.js';

const pages=fileURLToPath(new URL('../src/gramlot_examples/pages/',import.meta.url));
test('every JavaScript page builds with environment collection declarations',async()=>{
 const server=new GramlotFileServer(pages,{collections});
 let count=0;
 for await(const PageClass of server.iterPageClasses()){
  const page=new PageClass(),builder=new PageClass.sourceBuilder('main');
  server.loadCollections(builder,server.pageCollections(PageClass));
  await page.main(builder.root);
  assert.ok(builder.toTytx());count++;
 }
 assert.ok(count>=118,`Discovered ${count} pages`);
});
test('basic pages see all environment components and metadata descriptors',async()=>{
 const server=new GramlotFileServer(pages,{collections});
 const basic=await server.resolvePage('01-inputs/01-text/01-textbox');
 assert.deepEqual(basic.gramlots,[]);
 assert.deepEqual(server.pageCollections(basic).map(c=>c.name),collections.map(c=>c.name));
 assert.deepEqual(server.pageCollections(await server.resolvePage('00-index')),collections);
 assert.deepEqual(GalleryPage.gramlots,collections);
 const gallery=buildGallery();
 for(const collection of gallery.collections)assert.equal(gallery.assets[`/gallery/dist/${collection.name}/descriptor.js`].type,'text/javascript');
});
