import fs from 'node:fs/promises';
import path from 'node:path';
import { createHmac } from 'node:crypto';

// Requires a private POSIX persistent volume; never Actions cache/artifacts or git.
// One immutable claim per group/day/destination, independent of birthday roster edits.
export class DeliveryLedger {
  constructor(directory, secret, repository = process.cwd()) {
    if (!path.isAbsolute(directory || '') || typeof secret !== 'string' || Buffer.byteLength(secret) < 32) throw new Error('invalid_ledger_config');
    this.directory = directory;
    this.secret = secret;
    this.repository = repository;
  }
  key(group, day, destination) {
    if (![group, day, destination].every(v=>typeof v==='string' && v.length)) throw new Error('invalid_delivery_identity');
    return createHmac('sha256', this.secret).update(JSON.stringify([group, day, destination])).digest('hex');
  }
  async init() {
    await fs.mkdir(this.directory, { recursive: true, mode: 0o700 });
    const [directory, repository] = await Promise.all([fs.realpath(this.directory), fs.realpath(this.repository)]);
    const relative = path.relative(repository, directory);
    if (!relative || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))) throw new Error('ledger_inside_repository');
    await fs.chmod(directory, 0o700);
    this.directory = directory;
  }
  async claim(group, day, destination) {
    await this.init();
    const key = this.key(group, day, destination);
    let handle;
    try { handle = await fs.open(path.join(this.directory, `${key}.claim`), 'wx', 0o600); }
    catch (e) { if (e.code === 'EEXIST') return { claimed: false, key }; throw new Error('ledger_unavailable'); }
    try { await handle.writeFile('{"state":"claimed"}\n'); await handle.sync(); }
    finally { await handle.close(); }
    await this.syncDirectory();
    return { claimed: true, key };
  }
  async accepted(key) {
    if (!/^[a-f0-9]{64}$/.test(key)) throw new Error('invalid_delivery_key');
    await fs.access(path.join(this.directory, `${key}.claim`));
    const handle = await fs.open(path.join(this.directory, `${key}.accepted`), 'wx', 0o600);
    try { await handle.writeFile('{"state":"provider_accepted"}\n'); await handle.sync(); }
    finally { await handle.close(); }
    await this.syncDirectory();
  }
  async syncDirectory() {
    const handle = await fs.open(this.directory, 'r');
    try { await handle.sync(); } finally { await handle.close(); }
  }
}
