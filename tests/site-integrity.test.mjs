import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { validateSite } from '../tools/validate-site.mjs';

test('public QnQ site passes integrity and product-truth validation',async()=>{
  const result=await validateSite();
  assert.equal(result.status,'PUBLIC_STATIC_MARKETING_SITE');
  assert.equal(result.files,6);
  assert.ok(result.ids>10);
  assert.ok(result.anchors>5);
});

test('public roadmap is discoverable and does not claim operational completion',async()=>{
  const [sitemap,roadmap]=await Promise.all([
    readFile(new URL('../sitemap.xml',import.meta.url),'utf8'),
    readFile(new URL('../roadmap/index.html',import.meta.url),'utf8')
  ]);
  assert.match(sitemap,/https:\/\/qnq\.ooo\/roadmap\//);
  assert.match(roadmap,/Current: evidence in progress/);
  assert.doesNotMatch(roadmap,/Current:\s*(?:complete|operational|pass)/i);
});

test('public status fails closed for backend, identity and provider integrations',async()=>{
  const status=JSON.parse(await readFile(new URL('../platform-status.json',import.meta.url),'utf8'));
  assert.equal(status.capabilities.qnqAccount,'ROADMAP_NOT_IMPLEMENTED_IN_THIS_REPOSITORY');
  assert.equal(status.capabilities.checkout,'SQAILE_OWNED_NOT_IMPLEMENTED_IN_THIS_REPOSITORY');
  assert.equal(status.security.browserAuthentication,false);
  assert.equal(status.security.providerCredentials,false);
  assert.equal(status.security.qufenseProductionEvidence,false);
});
