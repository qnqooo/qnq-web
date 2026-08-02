import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const load=path=>readFile(resolve(root,path),'utf8');

export async function validateSite(){
  const [html,roadmapHtml,cname,robots,sitemap,statusRaw]=await Promise.all([
    load('index.html'),load('roadmap/index.html'),load('CNAME'),load('robots.txt'),load('sitemap.xml'),load('platform-status.json')
  ]);
  const status=JSON.parse(statusRaw);
  assert.equal(cname.trim(),'qnq.ooo','CNAME must remain qnq.ooo');
  assert.match(html,/<link rel="canonical" href="https:\/\/qnq\.ooo\/"\s*\/?>/i);
  assert.match(html,/http-equiv="Content-Security-Policy"/i,'CSP meta policy is required');
  assert.match(html,/name="referrer" content="no-referrer"/i,'referrer policy is required');
  assert.match(robots,/Sitemap:\s*https:\/\/qnq\.ooo\/sitemap\.xml/i);
  assert.match(sitemap,/<loc>https:\/\/qnq\.ooo\/<\/loc>/i);
  assert.match(sitemap,/<loc>https:\/\/qnq\.ooo\/roadmap\/<\/loc>/i);
  assert.match(roadmapHtml,/<link rel="canonical" href="https:\/\/qnq\.ooo\/roadmap\/">/i);
  assert.match(roadmapHtml,/Current: evidence in progress/i);
  assert.equal([...roadmapHtml.matchAll(/<b>G[0-7]<\/b>/g)].length,8,'public roadmap must render all eight gates');
  assert.doesNotMatch(roadmapHtml,/<script\b/i,'roadmap must remain dependency-free and non-executable');

  const ids=new Set([...html.matchAll(/\sid="([A-Za-z][\w:-]*)"/g)].map(match=>match[1]));
  const duplicateIds=[...ids].filter(id=>(html.match(new RegExp(`\\sid="${id}"`,'g'))||[]).length>1);
  assert.deepEqual(duplicateIds,[],'HTML ids must be unique');
  for(const [,target] of html.matchAll(/href="#([A-Za-z][\w:-]*)"/g))assert.ok(ids.has(target),`Missing anchor target #${target}`);
  for(const [anchor] of html.matchAll(/<a\b[^>]*class="[^"]*\bbtn\b[^"]*"[^>]*>/g))assert.match(anchor,/\shref="[^"]+"/i,'button-style anchors require a destination');
  for(const [,script] of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){
    assert.doesNotThrow(()=>new Function(script),'inline JavaScript must parse');
  }

  assert.doesNotMatch(html,/127\.0\.0\.1|localhost:\d+/i,'public site cannot depend on a local runtime');
  assert.doesNotMatch(html,/localStorage\.getItem\([^)]*(verified|auth|token|role)/i,'localStorage cannot be an identity control');
  assert.doesNotMatch(html,/\bfetch\s*\(/,'public site must not call an undeclared backend');
  assert.doesNotMatch(html,/Immediate 7-day access|active immediately|less than 60 seconds/i,'evaluation copy cannot promise unimplemented provisioning');
  assert.match(html,/'cta\.create':'Request evaluation'/,'English primary CTA must be request-only');
  assert.match(html,/'cta\.create':'Solicitar evaluación'/,'Spanish primary CTA must be request-only');
  assert.match(html,/access is never activated by this public website/,'public flow must disclose that activation is external');
  assert.doesNotMatch(html,/(?:api[_ -]?key|client[_ -]?secret|private[_ -]?key)\s*[:=]\s*["'][^"']+/i,'secret-like material is forbidden');

  assert.equal(status.surface,'PUBLIC_STATIC_MARKETING_SITE');
  assert.equal(status.capabilities.executiveEvaluation,'REQUEST_ONLY_NO_AUTOMATED_PROVISIONING');
  assert.match(status.capabilities.identity,/NOT_IMPLEMENTED_IN_THIS_REPOSITORY/);
  assert.match(status.capabilities.providerIntegrations,/NOT_IMPLEMENTED_IN_THIS_REPOSITORY/);
  assert.equal(status.security.localStorageAuthentication,false);
  assert.equal(status.security.externalApiCalls,false);
  assert.equal(status.governance.publicationRequiresApproval,true);
  return {files:6,anchors:[...html.matchAll(/href="#/g)].length,ids:ids.size,status:status.surface};
}

if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
  const result=await validateSite();
  console.log(`QnQ site validation OK: ${result.files} files, ${result.ids} ids, ${result.anchors} anchors`);
}
