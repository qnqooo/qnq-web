import fs from "node:fs/promises";
import path from "node:path";
import { config } from "./config.js";

const dataDir = path.resolve(process.cwd(), "data");
const birthdaysFile = path.join(dataDir, "birthdays-course-067.json");

export async function listBirthdays() {
  return readJson(birthdaysFile, {
    group: "067",
    groupName: config.birthdayGroupName,
    members: []
  });
}

export function buildBirthdayMessage(member) {
  const members = Array.isArray(member) ? member : [member];
  const names = members.map(m => m.firstName || (m.displayName || m.name).split(' ')[0]);
  const displayName = names.length < 2 ? names[0] : `${names.slice(0, -1).join(', ')} y ${names.at(-1)}`;
  return names.length === 1
    ? `¡${displayName}, muy feliz cumpleaños! 🎂🎉\n\nQue Dios te bendiga con mucha salud, alegría y prosperidad en esta nueva vuelta al sol. Que disfrutes este día rodeado del cariño de tu familia y tus seres queridos.\n\n¡Un fuerte abrazo, con el cariño y la amistad de siempre! 🙏🥂`
    : `¡${displayName}, muy feliz cumpleaños! 🎂🎉\n\nQue Dios los bendiga con mucha salud, alegría y prosperidad en esta nueva vuelta al sol. Que disfruten este día rodeados del cariño de sus familias y seres queridos.\n\n¡Un fuerte abrazo para ${names.length === 2 ? 'ambos' : 'todos'}, con el cariño y la amistad de siempre! 🙏🥂`;
}

export function evaluateBirthdayDay(members) {
  const recipients = members.filter(m => !m.isOwner);
  const eligible = recipients.some(m => m.reciprocity === 'confirmed');
  return { eligible, reason: eligible ? 'confirmed_reciprocity' : 'no_confirmed_reciprocity', members: recipients, message: recipients.length ? buildBirthdayMessage(recipients) : null };
}

export async function getDueBirthdays(date = new Date()) {
  const schedule = await listBirthdays();
  const monthDay = formatMonthDay(date, config.birthdayTimezone);
  const groupName = schedule.groupName || config.birthdayGroupName || schedule.group || "curso 067";

  return schedule.members
    .filter((member) => member.birthDate === monthDay)
    .map((member) => ({
      ...member,
      groupName,
      message: buildBirthdayMessage(member)
    }));
}

// This legacy entry point must not bypass the activation gate.
export async function sendDueBirthdayMessages() {
  return [{ skipped: true, reason: "activation_disabled" }];
}

export function startBirthdayScheduler() {
  const state = { lastMinute: "" };

  async function tick() {
    const now = new Date();
    const minute = formatHourMinute(now, config.birthdayTimezone);
    if (minute === state.lastMinute || minute !== config.birthdaySendTime) return;

    state.lastMinute = minute;
    try {
      const results = await sendDueBirthdayMessages(now);
      if (results.length) {
        console.log(`Birthday scheduler processed ${results.length} item(s).`);
      }
    } catch (error) {
      console.error("Birthday scheduler failed", error);
    }
  }

  setInterval(tick, 60 * 1000);
  tick();
}

function formatMonthDay(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  return `${parts.find((part) => part.type === "month").value}-${parts.find((part) => part.type === "day").value}`;
}

function formatHourMinute(date, timeZone) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}

function getYear(date, timeZone) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric"
  }).format(date);
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}
