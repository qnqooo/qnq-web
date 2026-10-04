import fs from 'node:fs/promises';
import { evaluateBirthdayDay } from './birthdayScheduler.js';
import { parseCalendar, dueMembers } from './calendar.js';
export function review(calendar, date = new Date()) {
  const base = { mode: 'dry_run', whatsapp: 'not_connected', delivery: 'disabled' };
  if (!calendar?.trim()) return { ...base, status: 'pending_private_calendar' };
  try {
    const decision = evaluateBirthdayDay(dueMembers(parseCalendar(calendar), date));
    return { ...base, status: decision.members.length ? (decision.eligible ? 'greeting_ready' : 'pending_reciprocity') : 'no_birthdays' };
  } catch { return { ...base, status: 'invalid_private_calendar' }; }
}
// No network, ledger writes, calendar files, message text or recipient counts.
if (process.argv[1]?.endsWith('/daily.mjs')) {
  const status = review(process.env.COURSE067_CALENDAR_JSON);
  console.log(JSON.stringify(status));
  if (process.env.GITHUB_STEP_SUMMARY) await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, `## Curso 067\n\nEstado: ${status.status}\n\nModo: prueba; envíos deshabilitados.\n`);
  if (status.status === 'invalid_private_calendar') process.exitCode = 1;
}
