# SQAILE web governance

QnQ keeps its product identity and independent engines while adopting the shared SQAILE control plane.

All operational calls follow `Interface -> platform BFF -> QuHub -> private engine API -> connector/provider`. The BFF validates QuIdentify session, role, tenant, request shape and anti-replay context. Cloudflare governs DNS, TLS, WAF and edge policy. QuMail and every other engine remain separate APIs/runtimes; QuHub is their governed integration boundary. Provider credentials remain QuVault references and never reach browser code. QuFense and QuSOC secure and observe; QuAudit preserves evidence; QuCOO, QuDeploy and QuSupport govern promotion and continuity.

Repository compliance may score 100/100. Production scores 100/100 only when the pinned revision and headers are externally observed, applicable negative-access tests pass, monitoring is healthy and rollback is proven.
