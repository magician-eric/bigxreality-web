import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seoTitle } from '../src/lib/seo-title.ts';
test('normalizes repeated terminal brand suffixes while retaining meaningful separators', () => {
  for (const value of ['XR｜BXR', 'XR | BXR', 'XR | Big x Reality', 'XR｜BXR | Big x Reality']) assert.equal(seoTitle(value), 'XR | Big x Reality');
  assert.equal(seoTitle('Core Technologies | XR, AI & Digital Simulation'), 'Core Technologies | XR, AI & Digital Simulation | Big x Reality');
  assert.equal(seoTitle('關於 Big x Reality｜全球動力科技'), '關於 Big x Reality｜全球動力科技 | Big x Reality');
});
