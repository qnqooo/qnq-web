# SECQUOIA blueprint adoption for qnq-web

Requirement: `QNQ-WEB-REQ-BLUEPRINT-CONSOLIDATION-2026-07-19`  
Source reviewed: `secquoia_codex_blueprint_v1.zip`  
Repository role: public static corporate site for `qnq.ooo`

## Decision

The blueprint is useful as an architectural input, but `qnq-web` is not the SECQUOIA customer platform or SQAILE runtime. This repository must remain a thin public experience and must not simulate authentication, checkout, tenant isolation, provisioning or provider APIs in browser state.

## Adopted here

- Product-truth manifest with explicit implemented, request-only and roadmap states.
- Automated checks for canonical domain, sitemap, internal anchors, local-runtime dependencies, browser authentication anti-patterns, undeclared network calls and secret-like material.
- Pull-request CI with no third-party runtime dependencies.
- Browser CSP and referrer minimization appropriate to the current static site.
- Executive evaluation as a contact/request flow, not automatic provisioning.
- Evidence-gated operational roadmap with eight sequential release gates and nineteen products organized in four delivery waves.
- QuCFA hard-cap and minimum-margin guardrails represented as machine-validated release conditions.
- Public roadmap generated as a truthful status surface, with no production-completion claim or executable integration code.

## Operational sequence

The detailed route is maintained in [`operational-roadmap.json`](../operational-roadmap.json) and [`OPERATIONAL_ROADMAP.md`](OPERATIONAL_ROADMAP.md). It prioritizes one complete quote-to-activation-to-support pilot before Graphene Ring expansion. This prevents the project from accumulating additional disconnected prototypes while identity, tenancy, commerce, provisioning, evidence and recovery remain incomplete.

## Owned by SQAILE, not qnq-web

- QuIdentify OIDC/OAuth, MFA, server sessions, tenant and role authorization.
- Tenant database isolation and row-level security.
- QuMarket catalog, quotes, orders, subscriptions and entitlements.
- QuPay checkout and billing evidence.
- QuHub provider adapters, idempotency, retries and circuit breakers.
- QuFense policy decisions and security evidence.
- QuCFA tariff, cost, hard-cap and minimum-margin enforcement.
- QuDeploy provisioning and QuSupport operational workflows.

The blueprint OpenAPI and JSON Schemas are not copied into this repository because doing so would create a second, non-executable source of truth. They must be reconciled with the existing SQAILE contracts before adoption.

## Explicitly rejected

- `localStorage` as authentication, authorization, entitlement or approval evidence.
- Direct provider calls from the public browser.
- Secrets, API keys, payment-card data or production tokens in this repository.
- Claims that a trial, managed SOC, partner integration, PQC control or quantum capability is active without current evidence.
- Moving all Qu motors into this public repository. Independently deployable Qu artifacts retain their governed isolation boundaries.

## Promotion and rollback

No production publication is authorized by this branch. Promotion requires human review, passing CI and explicit approval by EDDIE VELASQUEZ ORTIZ. Rollback is a revert of the approved commit; the `CNAME` remains `qnq.ooo` and no DNS action is part of this change.
