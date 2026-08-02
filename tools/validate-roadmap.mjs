import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');

export async function validateRoadmap(){
  const roadmap=JSON.parse(await readFile(resolve(root,'operational-roadmap.json'),'utf8'));
  assert.equal(roadmap.schema,'qnq.operational-roadmap.v1');
  assert.equal(roadmap.publicationAuthorized,false,'roadmap must not authorize publication');
  assert.equal(roadmap.promotionAuthority,'EDDIE VELASQUEZ ORTIZ');
  assert.equal(roadmap.architecture.publicSurface,'qnqooo/qnq-web');
  assert.equal(roadmap.architecture.runtimeOwner,'qnqooo/sqaile');
  assert.equal(roadmap.architecture.universalSecurityGate,'QuFense');
  assert.equal(roadmap.financialGuardrails.engine,'QuCFA');
  assert.ok(roadmap.financialGuardrails.customerTariffHardCap);
  assert.ok(roadmap.financialGuardrails.minimumGrossMarginPercent>=30);

  const requiredGates=new Set([
    'PRODUCT_TRUTH','SECURITY_QUFENSE','IDENTITY_TENANCY','COMMERCIAL_QUCFA',
    'PROVISIONING_QUHUB','OBSERVABILITY_AUDIT','SUPPORT_RECOVERY','CUSTOMER_ACCEPTANCE_ROLLBACK'
  ]);
  assert.deepEqual(new Set(roadmap.operationalDefinition.mandatoryGates),requiredGates);

  const phaseIds=roadmap.phases.map(phase=>phase.id);
  assert.equal(new Set(phaseIds).size,phaseIds.length,'phase ids must be unique');
  assert.deepEqual(roadmap.criticalPath,phaseIds,'critical path must include every phase in order');
  roadmap.phases.forEach((phase,index)=>{
    assert.equal(phase.id,`G${index}`,'phases must be sequential');
    assert.ok(phase.name&&phase.horizon);
    assert.ok(Array.isArray(phase.exitCriteria)&&phase.exitCriteria.length>=4,`${phase.id} needs at least four exit criteria`);
    phase.dependsOn.forEach(dependency=>assert.ok(phaseIds.includes(dependency),`${phase.id} has unknown dependency ${dependency}`));
    if(index===0)assert.deepEqual(phase.dependsOn,[]);
    else assert.deepEqual(phase.dependsOn,[`G${index-1}`],`${phase.id} must fail closed on prior gate`);
  });

  const waveProducts=roadmap.productWaves.flatMap(wave=>wave.products);
  assert.equal(new Set(waveProducts).size,waveProducts.length,'a product may appear in only one delivery wave');
  ['QuFense','QuIdentify','QuVault','QuAudit','QuHub','QuCFA','QuMarket','QuPay','QuDeploy','QuSupport','QuCISO','QuSOC','QuIntel','QuInfra','QuLegal','QuLearn','QuTeach','QuAcademy','QuCertify']
    .forEach(product=>assert.ok(waveProducts.includes(product),`missing required product ${product}`));
  roadmap.productWaves.forEach(wave=>assert.ok(phaseIds.includes(wave.requiredGate),`wave ${wave.wave} has unknown gate`));
  assert.notEqual(roadmap.scorecard.currentOverallStatus,'PASS','current roadmap cannot claim completion without product evidence');
  return {phases:phaseIds.length,products:waveProducts.length,gates:requiredGates.size,status:roadmap.scorecard.currentOverallStatus};
}

if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
  const result=await validateRoadmap();
  console.log(`Operational roadmap validation OK: ${result.phases} phases, ${result.products} products, ${result.gates} mandatory gates, status ${result.status}`);
}
