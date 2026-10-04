import fs from 'node:fs/promises';
import { getDueBirthdays, evaluateBirthdayDay } from './birthdayScheduler.js';
const calendar = process.env.COURSE067_CALENDAR_JSON;
let status;
if (!calendar) {
 status = { status: 'pending_private_calendar', whatsapp: 'not_connected' };
} else {
 let schedule;
 try { schedule = JSON.parse(calendar); } catch { throw new Error('Invalid private calendar JSON'); }
 if (!Array.isArray(schedule.members)) throw new Error('Calendar must contain members');
 await fs.mkdir('data', { recursive: true });
 await fs.writeFile('data/birthdays-course-067.json', JSON.stringify(schedule), { mode: 0o600 });
 const decision = evaluateBirthdayDay(await getDueBirthdays());
 // Names, cards and messages must never be placed in this public repository's logs.
 status = { status: decision.members.length ? (decision.eligible ? 'greeting_ready' : 'pending_reciprocity') : 'no_birthdays', count: decision.members.length, whatsapp: 'not_connected' };
 await fs.rm('data/birthdays-course-067.json');
}
console.log(JSON.stringify(status));
if (process.env.GITHUB_STEP_SUMMARY) await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, `## Curso 067\n\nEstado: ${status.status}\n\nWhatsApp: pendiente de vinculación.\n`);
