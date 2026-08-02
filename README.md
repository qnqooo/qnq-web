# qnq-web

Official public website of QnQ™ at `https://qnq.ooo/`.

This repository is a static corporate experience. It does not implement customer authentication, multi-tenancy, checkout, automated provisioning or live provider integrations. Those controls belong to the governed SQAILE services.

## Local validation

Use Node.js 22 or newer:

```powershell
node tools/validate-site.mjs
node --test tests/*.test.mjs
```

The same validation runs for pull requests and pushes to `main`. See [`platform-status.json`](platform-status.json) for the machine-readable capability boundary, [`operational-roadmap.json`](operational-roadmap.json) for the gated route to operational products, and [`docs/BLUEPRINT_ADOPTION.md`](docs/BLUEPRINT_ADOPTION.md) for the SECQUOIA blueprint adoption decision.

The public roadmap is rendered at [`roadmap/index.html`](roadmap/index.html). Validate its sequence, QuFense boundary and QuCFA guardrails with:

```powershell
node tools/validate-roadmap.mjs
```

Production publication requires review and explicit approval by EDDIE VELASQUEZ ORTIZ.
