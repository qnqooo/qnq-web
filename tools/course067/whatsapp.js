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

// No caller can send until a separate verified activation change is reviewed.
export async function sendWhatsAppText() {
  throw new Error("activation_disabled");
}
