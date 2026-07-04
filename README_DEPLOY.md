# QnQ Website v1 — Deploy

## Publish with GitHub Pages

1. Create a public repository, for example `qnq-website` under QnQLabs.
2. Upload all files from this ZIP to the repository root.
3. Go to Settings -> Pages.
4. Source: Deploy from branch.
5. Branch: `main` and folder `/root`.
6. Save.

GitHub will create a temporary URL like:
`https://qnqlabs.github.io/qnq-website/`

## Connect qnq.ooo

In Cloudflare DNS:

- Add CNAME `www` -> `qnqlabs.github.io`
- Configure GitHub Pages custom domain as `www.qnq.ooo`
- Add Cloudflare redirect from `qnq.ooo` to `www.qnq.ooo`, or use GitHub apex DNS records if desired.

## Contact data

Sales phone: +1 (979) 600-4595
Sales email: sales@qnq.ooo
