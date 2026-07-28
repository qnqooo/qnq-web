# QnQ™ public-site release procedure

Status: local changes are not approved for production by default.

`qnq-web` is the static public experience for `qnq.ooo`. Authentication,
multi-tenancy, checkout, provisioning and provider integrations are owned by
the governed SQAILE services and must not be simulated in this repository.

## Required release gates

1. Work on a dedicated branch and identify the requirement being implemented.
2. Run `node tools/validate-site.mjs`, `node tools/validate-roadmap.mjs` and `node --test tests/*.test.mjs`.
3. Review the product claims against `platform-status.json` and current evidence.
4. Open a pull request and confirm the CI workflow passes.
5. Obtain explicit approval from EDDIE VELASQUEZ ORTIZ before merging or publishing.
6. Merge through the reviewed pull request. Do not upload files directly to `main`.
7. Verify `https://qnq.ooo/`, `robots.txt` and `sitemap.xml` after publication.

## Rollback

Revert the approved release commit through a reviewed pull request. The existing
`CNAME` remains `qnq.ooo`; this procedure does not authorize DNS changes.
