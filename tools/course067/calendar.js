export function parseCalendar(raw) {
  let value;
  try { value = JSON.parse(raw); } catch { throw new Error('invalid_private_calendar'); }
  if (!value || !Array.isArray(value.members)) throw new Error('invalid_private_calendar');
  const ids = new Set();
  for (const m of value.members) {
    if (!m || typeof m.id !== 'string' || !m.id.trim() || ids.has(m.id) ||
        typeof m.firstName !== 'string' || !m.firstName.trim() ||
        !/^\d{2}-\d{2}$/.test(m.birthDate) ||
        !['confirmed', 'unresolved', 'not_confirmed'].includes(m.reciprocity) ||
        (m.isOwner !== undefined && typeof m.isOwner !== 'boolean')) throw new Error('invalid_private_calendar');
    const d = new Date(`2000-${m.birthDate}T12:00:00Z`);
    if (Number.isNaN(d.valueOf()) || d.toISOString().slice(5, 10) !== m.birthDate) throw new Error('invalid_private_calendar');
    ids.add(m.id);
  }
  return value;
}
export function dueMembers(schedule, date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {timeZone:'America/Bogota', month:'2-digit', day:'2-digit'}).formatToParts(date);
  const day = `${parts.find(p=>p.type==='month').value}-${parts.find(p=>p.type==='day').value}`;
  return schedule.members.filter(m=>m.birthDate===day);
}
