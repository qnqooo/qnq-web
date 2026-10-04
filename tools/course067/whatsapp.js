import crypto from "node:crypto";
import { config } from "./config.js";

export function verifyMetaSignature(rawBody, signatureHeader) {
  if (!config.metaAppSecret) return true;
  if (!signatureHeader?.startsWith("sha256=")) return false;

  const expected = crypto
    .createHmac("sha256", config.metaAppSecret)
    .update(rawBody)
    .digest("hex");

  const received = signatureHeader.slice("sha256=".length);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

export function extractTextMessages(payload) {
  const messages = [];

  for (const entry of payload.entry || []) {
    for (const change of entry.changes || []) {
      const value = change.value || {};
      const contacts = new Map(
        (value.contacts || []).map((contact) => [
          contact.wa_id,
          contact.profile?.name || null
        ])
      );

      for (const message of value.messages || []) {
        if (message.type !== "text") continue;
        messages.push({
          id: message.id,
          from: message.from,
          profileName: contacts.get(message.from),
          text: message.text?.body || ""
        });
      }
    }
  }

  return messages;
}

export async function sendWhatsAppText(to, text) {
  const chunks = splitWhatsAppText(text);

  for (const chunk of chunks) {
    const response = await fetch(
      `https://graph.facebook.com/${config.metaGraphVersion}/${config.whatsappPhoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.whatsappAccessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to,
          type: "text",
          text: {
            preview_url: false,
            body: chunk
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`WhatsApp send failed: ${response.status} ${errorText}`);
    }
  }
}

function splitWhatsAppText(text) {
  const maxLength = 3500;
  const chunks = [];
  let remaining = text || "Gracias. Te contactaremos pronto.";

  while (remaining.length > maxLength) {
    const index = remaining.lastIndexOf("\n", maxLength);
    const splitAt = index > 500 ? index : maxLength;
    chunks.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }

  if (remaining) chunks.push(remaining);
  return chunks;
}
