# QnQ operational product roadmap

Requirement: `QNQ-REQ-OPERATIONAL-PRODUCTS-2026-07-19`  
Authority: EDDIE VELASQUEZ ORTIZ  
Source of truth: [`operational-roadmap.json`](../operational-roadmap.json)

## Outcome

The objective is not to display `100%` in a dashboard. A product becomes operational only when every mandatory gate has current evidence for product truth, QuFense security, identity and tenancy, QuCFA economics, QuHub provisioning, observability, support and recovery, customer acceptance and rollback.

The current project assessment is a software TRL 4-5: demonstrable product experiences exist, while enterprise identity, multi-tenancy, durable commerce, provider provisioning and production operations still require consolidation.

## Critical path

| Gate | Outcome | Target window | Depends on |
| --- | --- | --- | --- |
| G0 | Product truth and portfolio freeze | T+0-14 days | None |
| G1 | Secure platform foundation | T+15-45 days | G0 |
| G2 | Commercial transaction spine | T+46-75 days | G1 |
| G3 | QuHub provisioning control plane | T+76-105 days | G2 |
| G4 | Customer activation and support | T+106-135 days | G3 |
| G5 | First revenue-ready products | T+136-180 days | G4 |
| G6 | Graphene Ring expansion | T+181-270 days | G5 |
| G7 | Production assurance and general availability | Evidence-driven | G6 |

The windows are planning ranges, not launch promises. Missing contracts, provider access, legal review, evidence or funding can change them without weakening a gate.

## First complete commercial slice

The fastest defensible route is one complete journey rather than many partial products:

1. Customer assessment and tenant creation through QuIdentify.
2. Catalog and quote with QuCFA cost, tariff and margin enforcement.
3. Legal acceptance and QuPay sandbox payment or approved purchase order.
4. Entitlement creation and QuHub provisioning through one real provider path.
5. QuDeploy activation evidence and service health verification.
6. QuSupport ticket, SLA and escalation drill.
7. Customer acceptance, billing evidence and tested rollback.

The first candidate is the controlled QuFense beta because it has the strongest existing local readiness evidence. A provider-backed QuSOC assessment follows as the second commercial slice. Neither can activate without current provider, security, legal, cost and recovery evidence.

## Product waves

- Wave 1 — QuFense, QuIdentify, QuVault, QuAudit, QuHub and QuCFA establish the universal control plane.
- Wave 2 — QuMarket, QuPay, QuDeploy and QuSupport complete the sell-to-operate lifecycle.
- Wave 3 — QuCISO and QuSOC deliver the first contracted Graphene Ring service.
- Wave 4 — QuIntel, QuInfra, QuLegal, QuLearn, QuTeach, QuAcademy and QuCertify expand only through the proven transaction spine.

## Repository boundaries

`qnq-web` remains the public, truthful and non-secret-bearing surface. SQAILE CORE owns identity, tenancy, orders, entitlements, QuHub adapters, QuFense policy, QuCFA economics, QuPay, evidence and operations. This repository must never implement browser authentication, store provider credentials or call providers directly.

## Promotion rule

No roadmap state authorizes deployment. Production promotion requires passing CI, current evidence, risk and cost review, a rollback procedure and explicit approval by EDDIE VELASQUEZ ORTIZ.
