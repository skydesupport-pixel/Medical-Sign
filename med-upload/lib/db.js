// Tiny JSON-file store. No dependencies: atomic writes + in-memory cache.
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID, randomInt } from 'node:crypto';
import { seed } from './seed.js';
import { hashId, normalizeId } from './users.js';

/* Where the database lives. On a hosted server the application folder is
   wiped on every deploy, so the data has to sit on a mounted disk instead -
   point MEDSIGN_DATA_DIR at it (Render, Fly and Railway all mount one at a
   path you choose). Unset, it stays beside the code as before. */
const DATA_DIR = process.env.MEDSIGN_DATA_DIR
  ? path.resolve(process.env.MEDSIGN_DATA_DIR)
  : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const TMP_FILE = path.join(DATA_DIR, 'db.tmp.json');
const MASTER_FILE = path.join(DATA_DIR, 'MASTER-CODE.txt');

export const COLLECTIONS = [
  'departments', 'rooms', 'doctors', 'assignments', 'signs', 'messages'
];

const EMPTY = () => ({
  // masterPin is the recovery code: it is never sent to the browser and is
  // required to change the daily pin, so staff cannot silently lock the owner out.
  settings: { pin: '1234', masterPin: '', sharedPinEnabled: true, supportPhone: '', hospitalNameHe: 'בית החולים', hospitalNameEn: 'Hospital', logo: '' },
  // users are handled explicitly, never through the generic CRUD routes,
  // so their code hashes and ID numbers cannot leak through /api/users
  users: [],
  // personal inbox between signed-in people - handled explicitly, never via generic CRUD
  mail: [],
  departments: [], rooms: [], doctors: [], assignments: [], signs: [], messages: [], log: []
});

let db = null;
let writeTimer = null;

function load() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    const base = EMPTY();
    // merge so a db from an older version still boots
    for (const k of Object.keys(base)) {
      if (parsed[k] !== undefined) base[k] = parsed[k];
    }
    base.settings = { ...EMPTY().settings, ...(parsed.settings || {}) };
    return base;
  } catch {
    return null;
  }
}

function persistNow() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(TMP_FILE, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(TMP_FILE, DB_FILE);
}

export function save() {
  clearTimeout(writeTimer);
  writeTimer = setTimeout(() => {
    try { persistNow(); } catch (e) { console.error('[db] write failed:', e.message); }
  }, 120);
}

// The recovery code lives on the server machine only - never in any API response.
// It is written to data/MASTER-CODE.txt so the owner can retrieve it from the PC
// that runs the system, and nowhere else.
export function writeMasterFile(code) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(MASTER_FILE,
      'Medical Sign - קוד גיבוי / master recovery code\r\n\r\n' +
      `    ${code}\r\n\r\n` +
      'שומרים את הקוד הזה במקום בטוח ולא משתפים אותו עם הצוות.\r\n' +
      'הוא נדרש כדי לשנות את קוד הכניסה היומי, ומאפשר כניסה גם אם מישהו שינה אותו.\r\n\r\n' +
      'Keep this code private. It is required to change the daily PIN and lets you\r\n' +
      'sign in even if someone changed that PIN.\r\n',
      'utf8');
  } catch (e) {
    console.error('[db] could not write MASTER-CODE.txt:', e.message);
  }
  return code;
}

/* Data minimisation, applied once to a database written by an older version.
   Full ID numbers used to be stored in the clear; replace each one with a
   hash plus its last four digits and drop the original. Irreversible on
   purpose - after this runs, no full ID exists anywhere in the system. */
function minimiseStoredIds() {
  let changed = 0;
  for (const u of db.users || []) {
    if (!u.nationalId) continue;
    const { salt, hash } = hashId(u.nationalId);
    u.idSalt = salt;
    u.idHash = hash;
    u.idLast4 = normalizeId(u.nationalId).slice(-4);
    delete u.nationalId;
    changed++;
  }
  return changed;
}

/* Days of the week are no longer part of an assignment. Records written by
   an older version still carry them, and would keep running on those days
   only - invisible behaviour nobody could see or change, since the form no
   longer shows it. Clear them once so what is stored matches what the
   screen says. An empty list means the shift runs every day. */
function clearAssignmentDays() {
  const changed = [];
  for (const a of db.assignments || []) {
    if (Array.isArray(a.days) && a.days.length && a.days.length < 7) {
      changed.push(`${a.id} (${a.days.join(',')})`);
    }
    if (a.days !== undefined) a.days = [];
  }
  return changed;
}

/* Door screens and floor directories are derived from the room or the floor
   now, so their records have nothing left to hold. Carry each door sign's
   look onto its room and drop the record; a floor directory keeps no
   settings of its own, so it just goes. Bespoke signs - wayfinding arrows,
   notice boards - stay, because their content exists nowhere else. */
function retireDerivedSigns() {
  const gone = [];
  const keep = [];
  for (const sign of db.signs || []) {
    if (sign.type === 'door') {
      const room = db.rooms.find((r) => r.id === sign.targetId);
      if (room) {
        if (sign.theme) room.theme = sign.theme;
        if (sign.orientation) room.orientation = sign.orientation;
        gone.push(`${sign.nameHe || sign.id} -> ?room=${room.number}`);
        continue;
      }
    } else if (sign.type === 'directory') {
      gone.push(`${sign.nameHe || sign.id} -> ?floor=${sign.targetId}`);
      continue;
    }
    keep.push(sign);
  }
  if (gone.length) db.signs = keep;
  return gone;
}

function ensureMasterPin() {
  if (db.settings.masterPin) return null;
  const code = String(randomInt(100000, 1000000));
  db.settings.masterPin = code;
  writeMasterFile(code);
  return code;
}

export function init() {
  if (process.env.MEDSIGN_DATA_DIR) console.log(`[db] data directory: ${DATA_DIR}`);
  db = load();
  if (!db) {
    db = EMPTY();
    Object.assign(db, seed(db));
    console.log('[db] created data/db.json with demo content');
  }
  const retired = retireDerivedSigns();
  if (retired.length) {
    console.log(`[db] door/floor signs are derived now; retired ${retired.length}: ${retired.join(' | ')}`);
    persistNow();
  }
  const daysDropped = clearAssignmentDays();
  if (daysDropped.length) {
    console.log(`[db] assignments now run every day; these had specific days: ${daysDropped.join(', ')}`);
    persistNow();
  }
  const trimmed = minimiseStoredIds();
  if (trimmed) {
    console.log(`[db] removed ${trimmed} stored ID number(s) - only a hash and the last 4 digits are kept`);
    persistNow();
  }
  const fresh = ensureMasterPin();
  if (fresh) {
    console.log('');
    console.log('  ============================================');
    console.log(`   קוד גיבוי / master recovery code:  ${fresh}`);
    console.log('   נשמר גם ב-  data/MASTER-CODE.txt');
    console.log('   שמרו אותו במקום בטוח ואל תשתפו עם הצוות.');
    console.log('  ============================================');
    persistNow();
  }
  return db;
}

export function get() {
  if (!db) init();
  return db;
}

export function backup() {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const file = path.join(DATA_DIR, `backup-${stamp}.json`);
  // backups get copied around - never let the access codes travel with them
  const safe = {
    ...db,
    settings: { ...db.settings, pin: '(redacted)', masterPin: '(redacted)' },
    users: db.users.map((u) => ({
      ...u,
      codeHash: '(redacted)', codeSalt: '(redacted)',
      idHash: '(redacted)', idSalt: '(redacted)',
    })),
  };
  fs.writeFileSync(file, JSON.stringify(safe, null, 2), 'utf8');
  return path.basename(file);
}

export function newId(prefix = 'id') {
  return `${prefix}_${randomUUID().slice(0, 8)}`;
}

export function logAction(action, entity, entityId, summary, actor = '') {
  const d = get();
  d.log.unshift({
    id: newId('log'),
    at: new Date().toISOString(),
    action, entity, entityId, summary, actor
  });
  if (d.log.length > 500) d.log.length = 500;
}
