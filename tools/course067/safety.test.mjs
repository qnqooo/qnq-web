import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { DeliveryLedger } from './deliveryLedger.js';
import { sendWhatsAppText } from './whatsapp.js';
import { review } from './daily.mjs';
import { sendDueBirthdayMessages } from './birthdayScheduler.js';
const secret = 'synthetic-test-key-only-32-bytes-long';
test('persistent claims serialize concurrent attempts and survive restarts without PII', async()=>{
 const dir = await fs.mkdtemp(path.join(os.tmpdir(),'course067-'));
 try {
  const ledger = new DeliveryLedger(dir, secret);
  const attempts = await Promise.all(Array.from({length:8},()=>ledger.claim('synthetic-group','2026-10-04','synthetic-destination')));
  assert.equal(attempts.filter(a=>a.claimed).length,1);
  const second = new DeliveryLedger(dir,secret);
  assert.equal((await second.claim('synthetic-group','2026-10-04','synthetic-destination')).claimed,false);
  await second.accepted(attempts[0].key);
  assert.equal((await second.claim('synthetic-group','2026-10-04','other-destination')).claimed,true);
  const files = await fs.readdir(dir);
  for (const f of files) assert.doesNotMatch(f+await fs.readFile(path.join(dir,f),'utf8'),/synthetic|2026|destination/);
 } finally { await fs.rm(dir,{recursive:true,force:true}); }
});
test('ledger refuses repository paths and weak keys', async()=>{
 assert.throws(()=>new DeliveryLedger('/tmp/example','short'));
 const ledger=new DeliveryLedger(process.cwd(),secret);
 await assert.rejects(()=>ledger.init(),/ledger_inside_repository/);
});
test('dry run leaks no names and cannot fetch or send, even with enable flag',async()=>{
 const original=globalThis.fetch;
 globalThis.fetch=()=>{throw new Error('network forbidden');};
 process.env.COURSE067_SEND_ENABLED='true';
 try {
  const calendar=JSON.stringify({members:[{id:'fake-1',firstName:'Synthetic',birthDate:'10-04',reciprocity:'confirmed'}]});
  const result=review(calendar,new Date('2026-10-04T13:00:00Z'));
  assert.equal(result.status,'greeting_ready');
  assert.doesNotMatch(JSON.stringify(result),/Synthetic|fake-1/);
  assert.equal((await sendDueBirthdayMessages())[0].reason,'activation_disabled');
  await assert.rejects(()=>sendWhatsAppText('synthetic','test'),/activation_disabled/);
 } finally { globalThis.fetch=original;delete process.env.COURSE067_SEND_ENABLED; }
});
test('bad calendar fails closed with sanitized output',()=>{
 for(const calendar of ['{private-invalid','{"members":[{}]}',JSON.stringify({members:[{id:'a',firstName:'Fake',birthDate:'02-30',reciprocity:'confirmed'}]})]) assert.equal(review(calendar).status,'invalid_private_calendar');
 assert.equal(review('').status,'pending_private_calendar');
});
