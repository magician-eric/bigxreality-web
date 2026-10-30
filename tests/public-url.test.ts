import {test} from 'node:test';import assert from 'node:assert/strict';
import{publicUrl,artifactPath,publicBasePath}from'../src/lib/public-url.ts';
test('canonical and assets keep the project base exactly once',()=>{
 assert.equal(publicBasePath,'/bigxreality-web/');
 assert.equal(publicUrl('/tw/products/sut/').href,'https://magician-eric.github.io/bigxreality-web/tw/products/sut/');
 assert.equal(publicUrl('/bigxreality-web/_astro/a.jpg').href,'https://magician-eric.github.io/bigxreality-web/_astro/a.jpg');
 assert.equal(publicUrl('/_astro/a.jpg').href,'https://magician-eric.github.io/bigxreality-web/_astro/a.jpg');
 assert.equal(publicUrl('https://example.com/video').href,'https://example.com/video');
 assert.equal(artifactPath(publicUrl('/tw/news/')),'/tw/news/');
});
