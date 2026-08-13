import { readFileSync, writeFileSync } from "node:fs";
const path = "index.html";
let html = readFileSync(path, "utf8");
if (!/name=["']sqaile-governance["']/i.test(html)) {
  const metadata = `<meta name="referrer" content="strict-origin-when-cross-origin"><meta name="sqaile-governance" content="QuIdentify; platform BFF; QuHub; private engine API; QuFense; QuSOC; QuAudit"><script type="application/ld+json">{"@context":"https://schema.org","@type":"SoftwareApplication","name":"QnQ Platform","applicationCategory":"BusinessApplication","url":"https://qnq.ooo/","operatingSystem":"Web"}</script>`;
  html = html.replace(/<head>/i, `<head>${metadata}`);
  writeFileSync(path, html, "utf8");
}
