import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateBirthdayDay } from './birthdayScheduler.js';
test('one confirmed member includes every birthday first name', () => {
 const decision=evaluateBirthdayDay([{name:'Ana Ejemplo',reciprocity:'confirmed'},{name:'Luis Ejemplo',reciprocity:'unresolved'}]);
 assert.equal(decision.eligible,true); assert.match(decision.message,/¡Ana y Luis,/);assert.doesNotMatch(decision.message,/Ejemplo/);
});
test('unresolved reciprocity does not enable sending',()=>assert.equal(evaluateBirthdayDay([{name:'Ana',reciprocity:'unresolved'}]).eligible,false));
test('no birthday and owner excluded',()=>{
 assert.equal(evaluateBirthdayDay([]).message,null);
 assert.equal(evaluateBirthdayDay([{name:'Owner',isOwner:true,reciprocity:'confirmed'}]).eligible,false);
});
