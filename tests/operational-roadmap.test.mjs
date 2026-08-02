import assert from 'node:assert/strict';
import test from 'node:test';
import {validateRoadmap} from '../tools/validate-roadmap.mjs';

test('operational roadmap is sequential, fail-closed and financially governed',async()=>{
  const result=await validateRoadmap();
  assert.equal(result.phases,8);
  assert.equal(result.products,19);
  assert.equal(result.gates,8);
  assert.equal(result.status,'EVIDENCE_IN_PROGRESS');
});
