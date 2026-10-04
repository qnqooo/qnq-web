import fs from "node:fs";
import path from "node:path";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.resolve(process.cwd(), ".env.local"));
loadEnvFile(path.resolve(process.cwd(), ".env"));

export const config = {
  port: Number(process.env.PORT || 3000),
  businessName: process.env.BUSINESS_NAME || "SECQUOIA",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiModel: process.env.OPENAI_MODEL || "gpt-4.1-mini",
  whatsappVerifyToken: process.env.WHATSAPP_VERIFY_TOKEN || "",
  whatsappAccessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
  whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
  metaGraphVersion: process.env.META_GRAPH_VERSION || "v20.0",
  metaAppSecret: process.env.META_APP_SECRET || "",
  humanEscalationPhone: process.env.HUMAN_ESCALATION_PHONE || "",
  adminToken: process.env.ADMIN_TOKEN || "",
  birthdayAdminNumbers: (process.env.BIRTHDAY_ADMIN_NUMBERS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  birthdayGroupName: process.env.BIRTHDAY_GROUP_NAME || "curso 067",
  birthdaySendTime: process.env.BIRTHDAY_SEND_TIME || "08:00",
  birthdayTimezone: process.env.BIRTHDAY_TIMEZONE || "America/Bogota"
};

export function assertRuntimeConfig() {
  const required = [
    ["OPENAI_API_KEY", config.openaiApiKey],
    ["WHATSAPP_VERIFY_TOKEN", config.whatsappVerifyToken],
    ["WHATSAPP_ACCESS_TOKEN", config.whatsappAccessToken],
    ["WHATSAPP_PHONE_NUMBER_ID", config.whatsappPhoneNumberId]
  ];

  return required
    .filter(([, value]) => !value)
    .map(([name]) => name);
}
