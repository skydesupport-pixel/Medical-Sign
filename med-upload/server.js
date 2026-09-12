// Medical Sign - hospital digital signage server.
// Zero dependencies: node:http + a JSON file store.
//   npm start        -> http://localhost:3000
//   PORT=8080 npm start

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { COLLECTIONS, get, init, save, newId, logAction, backup, writeMasterFile } from './lib/db.js';
import {
  hashCode, verifyCode, generateCode, validIsraeliId, normalizeId,
  normalizePhone, validPhone, publicUser, STATUSES, ROLES,
  hashId, idTaken,
} from './lib/users.js';
import { legalDocs } from './lib/legal.js';

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(process.cwd(), 'public');

init();

/* ------------------------------------------------------------------ *
 * Field whitelists - anything not listed here is dropped on write.
 * ------------------------------------------------------------------ */
const FIELDS = {
  departments: ['nameHe', 'nameEn', 'floor', 'wing', 'color', 'phone', 'hoursHe', 'hoursEn'],
  rooms: ['number', 'nameHe', 'nameEn', 'departmentId', 'floor', 'type', 'status', 'noteHe', 'noteEn', 'theme', 'orientation'],
  doctors: ['nameHe', 'nameEn', 'titleHe', 'titleEn', 'specialtyHe', 'specialtyEn', 'departmentId', 'license', 'officePhone', 'currentRoomId', 'active'],
  assignments: ['doctorId', 'roomId', 'days', 'start', 'end', 'noteHe', 'noteEn', 'active'],
  signs: ['nameHe', 'nameEn', 'type', 'targetId', 'theme', 'orientation', 'directions', 'refreshSec'],
  messages: ['scope', 'targetId', 'textHe', 'textEn', 'level', 'active', 'from', 'until'],
};

// The master code is an admin without a registered account. It still needs an
// identity so it can own messages and hold a mailbox like everyone else.
const SYSTEM_ADMIN = {
  id: 'system_master',
  fullName: 'מנהל מערכת',
  role: 'admin',
  status: 'active',
  builtin: true,
};

// What a plain staff account (role "staff", and the shared code) may write.
// Everything else in COLLECTIONS is admin-only.
const STAFF_WRITABLE = new Set(['messages']);

const ID_PREFIX = {
  departments: 'dep', rooms: 'room', doctors: 'doc',
  assignments: 'as', signs: 'sign', messages: 'msg',
};

function pick(collection, body) {
  const out = {};
  for (const key of FIELDS[collection]) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  if (out.floor !== undefined) out.floor = Number(out.floor);
  if (out.days !== undefined) out.days = (out.days || []).map(Number);
  return out;
}

function labelOf(collection, item) {
  if (collection === 'rooms') return `${item.number} ${item.nameHe || item.nameEn || ''}`.trim();
  if (collection === 'assignments') return `${item.doctorId} -> ${item.roomId} ${item.start}-${item.end}`;
  if (collection === 'messages') return item.textHe || item.textEn || '';
  return item.nameHe || item.nameEn || item.id;
}

/* ------------------------------------------------------------------ *
 * Live updates (SSE) - every display holds one open connection.
 * ------------------------------------------------------------------ */
const sseClients = new Set();

function broadcast(payload) {
  const frame = `data: ${JSON.stringify(payload)}\n\n`;
  for (const res of sseClients) {
    try { res.write(frame); } catch { sseClients.delete(res); }
  }
}

setInterval(() => broadcast({ type: 'ping', at: Date.now() }), 25000).unref();

/* ------------------------------------------------------------------ *
 * Display resolution - turns raw records into what a sign shows.
 * ------------------------------------------------------------------ */
/* An assignment no longer carries days of the week - it simply runs every
   day. An empty (or missing) days list therefore means "always", not
   "never", which is what a plain .includes() would have made of it. The
   field is still accepted over the API so a per-day roster can come back
   later without a migration. */
function runsOn(a, day) {
  const days = a.days;
  return !Array.isArray(days) || days.length === 0 || days.includes(day);
}

function hhmm(date) {
  return String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
}

function withinWindow(msg, now) {
  if (msg.active === false) return false;
  if (msg.from && new Date(msg.from) > now) return false;
  if (msg.until && new Date(msg.until) < now) return false;
  return true;
}

function messagesFor(db, now, { departmentId, roomId } = {}) {
  return db.messages.filter((m) => {
    if (!withinWindow(m, now)) return false;
    if (m.scope === 'global') return true;
    if (m.scope === 'department') return m.targetId === departmentId;
    if (m.scope === 'room') return m.targetId === roomId;
    return false;
  });
}

function doctorCard(db, doctorId) {
  const d = db.doctors.find((x) => x.id === doctorId);
  if (!d) return null;
  return {
    id: d.id,
    nameHe: d.nameHe, nameEn: d.nameEn,
    titleHe: d.titleHe, titleEn: d.titleEn,
    specialtyHe: d.specialtyHe, specialtyEn: d.specialtyEn,
  };
}

// Assignments running right now / later today, for one room.
function roomSchedule(db, roomId, now) {
  const day = now.getDay();
  const time = hhmm(now);
  const todays = db.assignments
    .filter((a) => a.active !== false && a.roomId === roomId && runsOn(a, day))
    .sort((a, b) => a.start.localeCompare(b.start));

  const current = todays.filter((a) => a.start <= time && time < a.end);
  const later = todays.filter((a) => a.start > time);

  const shape = (a) => ({
    id: a.id, start: a.start, end: a.end,
    noteHe: a.noteHe, noteEn: a.noteEn,
    doctor: doctorCard(db, a.doctorId),
  });

  /* A doctor placed in this room by hand outranks the roster, and until now
     never reached the sign at all - the pin showed on the admin screens and
     nowhere else, which is the one place it was meant for. No hours: it holds
     until somebody clears it. */
  const pinned = db.doctors
    .filter((d) => d.currentRoomId === roomId && d.active !== false)
    .map((d) => ({ id: 'pin_' + d.id, start: '', end: '', pinned: true, doctor: doctorCard(db, d.id) }));

  const pinnedIds = new Set(pinned.map((p) => p.doctor?.id));
  const scheduled = current.map(shape).filter((e) => !pinnedIds.has(e.doctor?.id));

  return { current: [...pinned, ...scheduled], later: later.map(shape), today: todays.map(shape) };
}

// The room's whole week - so a sign still carries names outside clinic hours.
function roomRoster(db, roomId) {
  return db.assignments
    .filter((a) => a.active !== false && a.roomId === roomId)
    .map((a) => ({
      id: a.id, days: a.days || [], start: a.start, end: a.end,
      noteHe: a.noteHe, noteEn: a.noteEn,
      doctor: doctorCard(db, a.doctorId),
    }))
    .filter((a) => a.doctor)
    .sort((a, b) => (a.days[0] ?? 9) - (b.days[0] ?? 9) || a.start.localeCompare(b.start));
}

// Next shift in this room, searching forward through the week.
function nextUp(db, roomId, now) {
  const roster = roomRoster(db, roomId);
  const time = hhmm(now);
  for (let ahead = 0; ahead < 8; ahead++) {
    const day = (now.getDay() + ahead) % 7;
    const slots = roster
      .filter((a) => runsOn(a, day) && (ahead > 0 || a.start > time))
      .sort((a, b) => a.start.localeCompare(b.start));
    if (slots.length) return { ...slots[0], day, ahead };
  }
  return null;
}

/* A door screen used to be a stored record whose only real content was the
   room it pointed at, which meant a room with no record had no screen -
   six of nine rooms were in that state. Both it and a floor directory are
   derived now, so every room and every floor has a working address the
   moment it exists. Only genuinely bespoke signs - wayfinding arrows, a
   notice board - are still records. */
function virtualSign(db, kind, key) {
  if (kind === 'room') {
    const room = db.rooms.find((r) => r.id === key || String(r.number) === String(key));
    if (!room) return null;
    return {
      id: `room:${room.id}`,
      type: 'door',
      targetId: room.id,
      nameHe: `${room.number} · ${room.nameHe || ''}`.trim(),
      nameEn: `${room.number} · ${room.nameEn || ''}`.trim(),
      theme: room.theme || 'light',
      orientation: room.orientation || 'landscape',
      derived: true,
    };
  }
  if (kind === 'floor') {
    const floor = Number(key);
    if (!Number.isFinite(floor)) return null;
    return {
      id: `floor:${floor}`,
      type: 'directory',
      targetId: floor,
      nameHe: `מדריך קומה ${floor}`,
      nameEn: `Floor ${floor} directory`,
      theme: 'dark',
      orientation: 'landscape',
      derived: true,
    };
  }
  return null;
}

function resolveSign(signId, virtual = null) {
  const db = get();
  const sign = virtual || db.signs.find((s) => s.id === signId);
  if (!sign) return null;

  const now = new Date();
  const base = {
    sign,
    hospital: { nameHe: db.settings.hospitalNameHe, nameEn: db.settings.hospitalNameEn },
    generatedAt: now.toISOString(),
    serverTime: now.toISOString(),
  };

  if (sign.type === 'door') {
    const room = db.rooms.find((r) => r.id === sign.targetId) || null;
    const dept = room ? db.departments.find((d) => d.id === room.departmentId) || null : null;
    return {
      ...base,
      room,
      department: dept,
      schedule: room ? roomSchedule(db, room.id, now) : { current: [], later: [], today: [] },
      roster: room ? roomRoster(db, room.id) : [],
      nextUp: room ? nextUp(db, room.id, now) : null,
      // fallback for a room nobody is rostered to - at least name the department's team
      deptDoctors: dept ? db.doctors.filter((d) => d.departmentId === dept.id && d.active !== false).map((d) => doctorCard(db, d.id)) : [],
      messages: messagesFor(db, now, { departmentId: dept?.id, roomId: room?.id }),
    };
  }

  if (sign.type === 'directory') {
    const floor = Number(sign.targetId);
    const departments = db.departments
      .filter((d) => Number(d.floor) === floor)
      .map((d) => ({
        ...d,
        rooms: db.rooms
          .filter((r) => r.departmentId === d.id)
          .sort((a, b) => String(a.number).localeCompare(String(b.number), undefined, { numeric: true }))
          .map((r) => ({
            ...r,
            schedule: roomSchedule(db, r.id, now),
            roster: roomRoster(db, r.id),
            nextUp: nextUp(db, r.id, now),
          })),
      }));
    return { ...base, floor, departments, messages: messagesFor(db, now, {}) };
  }

  if (sign.type === 'wayfinding') {
    return { ...base, directions: sign.directions || [], messages: messagesFor(db, now, {}) };
  }

  // 'notice' - message board only
  return { ...base, messages: messagesFor(db, now, {}) };
}

/* ------------------------------------------------------------------ *
 * HTTP plumbing
 * ------------------------------------------------------------------ */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => {
      raw += c;
      if (raw.length > 1e6) reject(new Error('body too large'));
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch { reject(new Error('invalid JSON')); }
    });
    req.on('error', reject);
  });
}

// Codes get copied out of chat messages and documents, which drags along
// invisible direction marks and stray spaces. Strip anything unprintable
// before comparing or storing, so a pasted code behaves like a typed one.
function normalizeCode(v) {
  return String(v ?? '').replace(/[\s\p{Cf}]/gu, '');
}

// Constant-time-ish compare so a wrong code leaks nothing through timing.
function sameCode(a, b) {
  a = normalizeCode(a); b = normalizeCode(b);
  if (!b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* ------------------------------------------------------------------ *
 * Who is calling?  A personal user code, the master code, or the
 * shared daily pin. Everything a caller may do flows from this.
 * ------------------------------------------------------------------ */
// The built-in admin has no personal details - it is a role, not a person.
function builtinProfile() {
  return {
    id: SYSTEM_ADMIN.id,
    fullName: SYSTEM_ADMIN.fullName,
    role: 'admin',
    status: 'active',
    builtin: true,
    phone: '', officePhone: '', nationalId: '', idMasked: true,
    createdAt: '', lastLogin: '', approvedAt: '', approvedBy: '',
  };
}

function findUserByCode(code) {
  const c = normalizeCode(code);
  if (c.length < 4) return null;
  return get().users.find((u) => verifyCode(c, u.codeSalt, u.codeHash)) || null;
}

function identify(req) {
  const code = normalizeCode(req.headers['x-admin-pin']);
  const s = get().settings;
  if (!code) return { ok: false, status: 401, error: 'נדרש קוד כניסה / sign-in required' };

  if (sameCode(code, s.masterPin)) {
    return {
      ok: true,
      actor: {
        kind: 'master',
        name: SYSTEM_ADMIN.fullName,
        isMaster: true,
        isAdmin: true,
        user: SYSTEM_ADMIN,      // built-in: gives it a mailbox and message ownership
      },
    };
  }

  const user = findUserByCode(code);
  if (user) {
    if (user.status === 'pending') {
      return { ok: false, status: 403, error: 'החשבון ממתין לאישור מנהל / account awaiting approval' };
    }
    if (user.status === 'suspended') {
      return { ok: false, status: 403, error: 'החשבון מושהה / account suspended' };
    }
    return { ok: true, actor: { kind: 'user', user, name: user.fullName, isMaster: false, isAdmin: user.role === 'admin' } };
  }

  // the shared code is a leftover from before personal accounts - it can be switched off
  if (s.sharedPinEnabled !== false && sameCode(code, s.pin)) {
    return { ok: true, actor: { kind: 'shared', name: 'קוד משותף', isMaster: false, isAdmin: false } };
  }

  return { ok: false, status: 401, error: 'קוד שגוי / wrong code' };
}

// convenience for the many write routes
function requirePin(req) {
  return identify(req).ok;
}
function actorName(req) {
  const id = identify(req);
  return id.ok ? id.actor.name : '';
}

// Only the master code authorises changing the codes themselves.
// It is read from the request BODY - a header cannot carry non-Latin-1
// characters, and a pasted code often does.
function masterCheck(req, body = {}) {
  const s = get().settings;
  // If the form sent the field at all, judge that value alone - falling back to
  // the session header would turn an empty box into a confusing error.
  const given = body.masterConfirm !== undefined
    ? normalizeCode(body.masterConfirm)
    : (normalizeCode(req.headers['x-master-pin']) || normalizeCode(req.headers['x-admin-pin']));

  if (!given) return { ok: false, error: 'יש להזין את קוד הגיבוי / master code required' };
  if (sameCode(given, s.masterPin)) return { ok: true };
  if (sameCode(given, s.pin)) {
    return { ok: false, error: 'זהו קוד הכניסה היומי, לא קוד הגיבוי. קוד הגיבוי נמצא בקובץ data/MASTER-CODE.txt' };
  }
  return { ok: false, error: 'קוד הגיבוי שגוי / wrong master code' };
}

/* Brute-force throttle: a 4-digit pin is guessable in minutes otherwise. */
const attempts = new Map();
function throttled(ip) {
  const rec = attempts.get(ip);
  if (!rec) return false;
  if (rec.blockedUntil && Date.now() < rec.blockedUntil) return true;
  if (rec.blockedUntil && Date.now() >= rec.blockedUntil) attempts.delete(ip);
  return false;
}
function noteFailure(ip) {
  const rec = attempts.get(ip) || { count: 0, blockedUntil: 0 };
  rec.count += 1;
  if (rec.count >= 8) { rec.blockedUntil = Date.now() + 60000; rec.count = 0; }
  attempts.set(ip, rec);
}
function noteSuccess(ip) { attempts.delete(ip); }

function serveStatic(req, res, urlPath) {
  const rel = urlPath === '/' ? 'index.html' : decodeURIComponent(urlPath).replace(/^\/+/, '');
  const file = path.join(PUBLIC_DIR, rel);
  if (!file.startsWith(PUBLIC_DIR)) { res.writeHead(403).end('forbidden'); return; }

  fs.readFile(file, (err, buf) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 - not found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(buf);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const seg = url.pathname.split('/').filter(Boolean);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,X-Admin-Pin',
    });
    return res.end();
  }
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (seg[0] !== 'api') return serveStatic(req, res, url.pathname);

  try {
    /* --- live update stream --- */
    if (seg[1] === 'events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      });
      res.write(`retry: 3000\n\n`);
      res.write(`data: ${JSON.stringify({ type: 'hello', at: Date.now() })}\n\n`);
      sseClients.add(res);
      req.on('close', () => sseClients.delete(res));
      return;
    }

    /* --- auth --- */
    if (seg[1] === 'auth' && req.method === 'POST') {
      const ip = req.socket.remoteAddress || '?';
      if (throttled(ip)) return sendJson(res, 429, { error: 'too many attempts, wait a minute' });
      const body = await readBody(req);
      const code = normalizeCode(body.pin);
      const db = get();
      const s = db.settings;

      // master code
      if (sameCode(code, s.masterPin)) {
        noteSuccess(ip);
        logAction('login', 'users', '-', 'כניסה עם קוד הגיבוי / signed in with the master code', 'מנהל מערכת');
        save();
        return sendJson(res, 200, { ok: true, master: true, admin: true, name: 'מנהל מערכת' });
      }

      // personal user code
      const user = findUserByCode(code);
      if (user) {
        noteSuccess(ip);
        if (user.status === 'suspended') {
          return sendJson(res, 403, { ok: false, status: 'suspended', error: 'החשבון מושהה. פנו למנהל המערכת.' });
        }
        user.lastLogin = new Date().toISOString();
        if (user.status === 'active') {
          logAction('login', 'users', user.id, `כניסה: ${user.fullName}`, user.fullName);
        }
        save();
        return sendJson(res, 200, {
          ok: true, master: false,
          admin: user.role === 'admin',
          name: user.fullName,
          status: user.status,
          pending: user.status === 'pending',
        });
      }

      // shared daily pin
      if (s.sharedPinEnabled !== false && sameCode(code, s.pin)) {
        noteSuccess(ip);
        return sendJson(res, 200, { ok: true, master: false, admin: false, name: 'קוד משותף', status: 'active' });
      }

      noteFailure(ip);
      return sendJson(res, 401, { ok: false });
    }

    /* --- the only unauthenticated bit of the admin site: what the login
           screen needs before anyone has signed in --- */
    if (seg[1] === 'public' && req.method === 'GET') {
      const db = get();
      return sendJson(res, 200, {
        hospitalNameHe: db.settings.hospitalNameHe || '',
        hospitalNameEn: db.settings.hospitalNameEn || '',
        supportPhone: db.settings.supportPhone || '',
      });
    }

    /* --- privacy notice, terms and accessibility statement.
           Unauthenticated on purpose: somebody has to be able to read what
           the system collects *before* handing over their details. --- */
    if (seg[1] === 'legal' && req.method === 'GET') {
      return sendJson(res, 200, legalDocs(get().settings));
    }

    /* --- registration: anyone may apply, nobody may act until approved --- */
    if (seg[1] === 'register' && req.method === 'POST') {
      const ip = req.socket.remoteAddress || '?';
      if (throttled(ip)) return sendJson(res, 429, { error: 'too many attempts, wait a minute' });

      const body = await readBody(req);
      const db = get();
      const fullName = String(body.fullName || '').trim().replace(/\s+/g, ' ');
      const phone = normalizePhone(body.phone);
      const nationalId = normalizeId(body.nationalId);

      if (fullName.length < 2) return sendJson(res, 400, { error: 'יש להזין שם מלא' });
      if (!validPhone(phone)) return sendJson(res, 400, { error: 'מספר טלפון לא תקין' });
      if (!validIsraeliId(nationalId)) return sendJson(res, 400, { error: 'מספר תעודת זהות לא תקין' });
      if (idTaken(nationalId, db.users)) {
        return sendJson(res, 409, { error: 'כבר קיים משתמש עם תעודת זהות זו' });
      }

      const code = generateCode(db.users);
      const { salt, hash } = hashCode(code);
      // The ID is checked above and then discarded - only a hash and the
      // last four digits survive. See lib/users.js for why.
      const { salt: idSalt, hash: idHash } = hashId(nationalId);
      const user = {
        id: newId('usr'),
        fullName, phone,
        idSalt, idHash, idLast4: nationalId.slice(-4),
        codeSalt: salt, codeHash: hash,
        role: 'staff',
        status: 'pending',
        createdAt: new Date().toISOString(),
        lastLogin: '',
      };
      db.users.push(user);
      logAction('create', 'users', user.id, `בקשת הרשמה: ${fullName}`, fullName);
      save();
      broadcast({ type: 'update', entity: 'users' });

      // The code is shown exactly once, here. It is stored hashed and cannot be read back.
      return sendJson(res, 201, { ok: true, code, status: 'pending', name: fullName });
    }

    /* --- everything the admin UI needs, in one call --- */
    if (seg[1] === 'state' && req.method === 'GET') {
      const auth = identify(req);
      if (!auth.ok) return sendJson(res, auth.status, { error: auth.error });
      const db = get();
      const now = new Date();
      // Staff see only the message board, the doctors list and the log.
      // Rooms and departments still travel because a message can target one.
      const staffOnly = !auth.actor.isAdmin;

      // doctorId -> the room they are sitting in at this moment
      const doctorNow = {};
      const nowTime = hhmm(now);
      for (const a of db.assignments) {
        if (a.active === false) continue;
        if (!runsOn(a, now.getDay())) continue;
        if (!(a.start <= nowTime && nowTime < a.end)) continue;
        const rm = db.rooms.find((r) => r.id === a.roomId);
        if (!rm) continue;
        doctorNow[a.doctorId] = {
          roomId: rm.id, number: rm.number,
          nameHe: rm.nameHe, nameEn: rm.nameEn,
          floor: rm.floor, start: a.start, end: a.end,
        };
      }

      // an admin can pin a doctor to a room by hand; that wins over the schedule
      for (const doc of db.doctors) {
        if (!doc.currentRoomId) continue;
        const rm = db.rooms.find((r) => r.id === doc.currentRoomId);
        if (!rm) continue;
        doctorNow[doc.id] = {
          roomId: rm.id, number: rm.number,
          nameHe: rm.nameHe, nameEn: rm.nameEn,
          floor: rm.floor, manual: true,
        };
      }

      return sendJson(res, 200, {
        doctorNow,
        settings: {
          hospitalNameHe: db.settings.hospitalNameHe,
          hospitalNameEn: db.settings.hospitalNameEn,
          sharedPinEnabled: db.settings.sharedPinEnabled !== false,
          supportPhone: db.settings.supportPhone || '',
        },
        departments: db.departments,
        rooms: db.rooms,
        doctors: db.doctors,
        assignments: staffOnly ? [] : db.assignments,
        signs: staffOnly ? [] : db.signs,
        messages: db.messages,
        log: staffOnly ? [] : db.log.slice(0, 60),   // the change log is for admins
        me: {
          name: auth.actor.name,
          isAdmin: auth.actor.isAdmin,
          isMaster: auth.actor.isMaster,
          kind: auth.actor.kind,
          profile: auth.actor.user
            ? (auth.actor.user.builtin ? builtinProfile() : publicUser(auth.actor.user))
            : null,
        },
        pendingUsers: db.users.filter((u) => u.status === 'pending').length,
        mailUnread: auth.actor.user
          ? db.mail.filter((m) => m.toId === auth.actor.user.id && !m.deletedByTo && !m.readAt).length
          : 0,
        stats: {
          departments: db.departments.length,
          rooms: db.rooms.length,
          doctors: db.doctors.length,
          signs: db.signs.length,
          onDuty: Object.keys(doctorNow).length,
          closedRooms: db.rooms.filter((r) => r.status !== 'open').length,
          activeMessages: db.messages.filter((m) => withinWindow(m, now)).length,
        },
        serverTime: now.toISOString(),
      });
    }

    /* --- resolved payload for one physical screen ---
           /api/display/room/<number|id>  a door screen, derived from the room
           /api/display/floor/<n>         a floor directory, derived
           /api/display/<signId>          a bespoke sign that really is a record */
    if (seg[1] === 'display' && seg[2] && req.method === 'GET') {
      let data;
      if ((seg[2] === 'room' || seg[2] === 'floor') && seg[3]) {
        const virtual = virtualSign(get(), seg[2], decodeURIComponent(seg[3]));
        if (!virtual) return sendJson(res, 404, { error: seg[2] + ' not found' });
        data = resolveSign(virtual.id, virtual);
      } else {
        data = resolveSign(seg[2]);
      }
      if (!data) return sendJson(res, 404, { error: 'sign not found' });
      return sendJson(res, 200, data);
    }

    /* --- settings --- */
    if (seg[1] === 'settings' && req.method === 'PUT') {
      const ip = req.socket.remoteAddress || '?';
      if (throttled(ip)) return sendJson(res, 429, { error: 'too many attempts, wait a minute' });
      const authSet = identify(req);
      if (!authSet.ok) return sendJson(res, authSet.status, { error: authSet.error });
      if (!authSet.actor.isAdmin) return sendJson(res, 403, { error: 'נדרשות הרשאות מנהל / admin only' });

      const body = await readBody(req);
      const db = get();
      const wantsPin = body.pin !== undefined && normalizeCode(body.pin) !== '';
      const wantsMaster = body.masterPin !== undefined && normalizeCode(body.masterPin) !== '';

      // Changing either code requires the master code - a daily pin alone cannot do it.
      if (wantsPin || wantsMaster) {
        const check = masterCheck(req, body);
        if (!check.ok) {
          noteFailure(ip);
          return sendJson(res, 403, { error: check.error });
        }
      }

      if (body.sharedPinEnabled !== undefined) {
        const on = !!body.sharedPinEnabled;
        if (db.settings.sharedPinEnabled !== on) {
          db.settings.sharedPinEnabled = on;
          logAction('update', 'settings', '-', on ? 'הקוד המשותף הופעל' : 'הקוד המשותף בוטל - כניסה בקוד אישי בלבד', authSet.actor.name);
        }
      }

      if (body.supportPhone !== undefined) {
        const num = String(body.supportPhone).trim();
        if (num && !validPhone(num)) return sendJson(res, 400, { error: 'מספר טלפון לא תקין' });
        db.settings.supportPhone = num;
      }

      for (const k of ['hospitalNameHe', 'hospitalNameEn']) {
        if (body[k] !== undefined && String(body[k]).trim() !== '') db.settings[k] = String(body[k]);
      }

      if (wantsPin) {
        const next = normalizeCode(body.pin);
        if (next.length < 4) return sendJson(res, 400, { error: 'קוד הכניסה חייב להיות באורך 4 תווים לפחות' });
        if (sameCode(next, db.settings.masterPin)) {
          return sendJson(res, 400, { error: 'קוד הכניסה לא יכול להיות זהה לקוד הגיבוי' });
        }
        db.settings.pin = next;
        logAction('update', 'settings', '-', 'קוד הכניסה היומי שונה / daily PIN changed', authSet.actor.name);
      }

      if (wantsMaster) {
        const next = normalizeCode(body.masterPin);
        if (next.length < 6) return sendJson(res, 400, { error: 'קוד הגיבוי חייב להיות באורך 6 תווים לפחות' });
        if (sameCode(next, db.settings.pin)) {
          return sendJson(res, 400, { error: 'קוד הגיבוי לא יכול להיות זהה לקוד הכניסה' });
        }
        db.settings.masterPin = next;
        writeMasterFile(next);
        logAction('update', 'settings', '-', 'קוד הגיבוי שונה / master code changed', authSet.actor.name);
      }

      if (!wantsPin && !wantsMaster) logAction('update', 'settings', '-', 'settings updated', authSet.actor.name);
      noteSuccess(ip);
      save();
      broadcast({ type: 'update', entity: 'settings' });
      return sendJson(res, 200, { ok: true });
    }

    /* --- personal inbox: messages people send each other --- */
    if (seg[1] === 'mail') {
      const auth = identify(req);
      if (!auth.ok) return sendJson(res, auth.status, { error: auth.error });

      const db = get();
      const self = auth.actor.user;
      // the master and shared codes are not people, so they have no mailbox
      if (!self) {
        return sendJson(res, 400, { error: 'תיבת דואר קיימת רק לחשבון אישי / personal accounts only' });
      }

      // who you can write to
      if (seg[2] === 'contacts' && req.method === 'GET') {
        const people = db.users
          .filter((u) => u.status === 'active')
          .map((u) => ({ id: u.id, fullName: u.fullName, role: u.role }))
          .sort((a, b) => String(a.fullName).localeCompare(String(b.fullName), 'he'));
        // anyone may write to the built-in admin
        return sendJson(res, 200, [{ id: SYSTEM_ADMIN.id, fullName: SYSTEM_ADMIN.fullName, role: 'admin' }, ...people]);
      }

      const visible = (m) => (m.toId === self.id && !m.deletedByTo) || (m.fromId === self.id && !m.deletedByFrom);

      if (req.method === 'GET' && !seg[2]) {
        const mine = db.mail.filter(visible).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        return sendJson(res, 200, {
          inbox: mine.filter((m) => m.toId === self.id && !m.deletedByTo),
          sent: mine.filter((m) => m.fromId === self.id && !m.deletedByFrom),
          unread: mine.filter((m) => m.toId === self.id && !m.deletedByTo && !m.readAt).length,
        });
      }

      if (req.method === 'POST' && !seg[2]) {
        const body = await readBody(req);
        const wanted = String(body.toId || '');
        const to = wanted === SYSTEM_ADMIN.id ? SYSTEM_ADMIN : db.users.find((u) => u.id === wanted);
        if (!to) return sendJson(res, 400, { error: 'יש לבחור נמען' });
        if (to.status !== 'active') return sendJson(res, 400, { error: 'הנמען אינו פעיל' });

        const subject = String(body.subject || '').trim();
        const text = String(body.body || '').trim();
        if (!subject && !text) return sendJson(res, 400, { error: 'יש להזין נושא או תוכן' });

        const item = {
          id: newId('mail'),
          fromId: self.id, fromName: self.fullName,
          toId: to.id, toName: to.fullName,
          subject: subject.slice(0, 200),
          body: text.slice(0, 5000),
          createdAt: new Date().toISOString(),
          readAt: '', doneAt: '',
          replyTo: String(body.replyTo || ''),
          deletedByTo: false, deletedByFrom: false,
        };
        db.mail.push(item);
        if (db.mail.length > 2000) db.mail.splice(0, db.mail.length - 2000);
        save();
        broadcast({ type: 'update', entity: 'mail', to: to.id });
        return sendJson(res, 201, item);
      }

      const item = db.mail.find((m) => m.id === seg[2]);
      if (!item || !visible(item)) return sendJson(res, 404, { error: 'not found' });

      // only the recipient marks a message read or done
      if (req.method === 'PUT') {
        const body = await readBody(req);
        if (item.toId !== self.id) {
          return sendJson(res, 403, { error: 'רק הנמען יכול לסמן הודעה' });
        }
        if (body.read !== undefined) item.readAt = body.read ? (item.readAt || new Date().toISOString()) : '';
        if (body.done !== undefined) item.doneAt = body.done ? new Date().toISOString() : '';
        save();
        broadcast({ type: 'update', entity: 'mail', to: self.id });
        return sendJson(res, 200, item);
      }

      // deleting only clears it from your own side
      if (req.method === 'DELETE') {
        if (item.toId === self.id) item.deletedByTo = true;
        if (item.fromId === self.id) item.deletedByFrom = true;
        if (item.deletedByTo && item.deletedByFrom) {
          db.mail = db.mail.filter((m) => m.id !== item.id);
        }
        save();
        broadcast({ type: 'update', entity: 'mail', to: self.id });
        return sendJson(res, 200, { ok: true });
      }

      return sendJson(res, 405, { error: 'method not allowed' });
    }

    /* --- the signed-in person's own account --- */
    if (seg[1] === 'me') {
      const auth = identify(req);
      if (!auth.ok) return sendJson(res, auth.status, { error: auth.error });
      const db = get();
      const self = auth.actor.user || null;

      // people signed in with the master or shared code have no personal record
      if (!self) {
        return sendJson(res, req.method === 'GET' ? 200 : 400, req.method === 'GET'
          ? { kind: auth.actor.kind, name: auth.actor.name, profile: null }
          : { error: 'הפעולה זמינה רק לחשבון אישי / personal accounts only' });
      }

      if (req.method === 'GET') {
        if (self.builtin) return sendJson(res, 200, { kind: 'master', name: self.fullName, profile: builtinProfile() });
        // your own ID number is yours to see
        return sendJson(res, 200, { kind: 'user', name: self.fullName, profile: publicUser(self) });
      }

      if (self.builtin && req.method !== 'GET') {
        return sendJson(res, 400, {
          error: 'זהו חשבון מובנה. את קוד הגיבוי משנים בהגדרות → קודי גישה / built-in account',
        });
      }

      // update your own name and phone (never your own role, status or ID)
      if (req.method === 'PUT' && !seg[2]) {
        const body = await readBody(req);
        if (body.fullName !== undefined) {
          const name = String(body.fullName).trim().replace(/\s+/g, ' ');
          if (name.length < 2) return sendJson(res, 400, { error: 'יש להזין שם מלא' });
          self.fullName = name;
        }
        if (body.phone !== undefined) {
          const phone = normalizePhone(body.phone);
          if (!validPhone(phone)) return sendJson(res, 400, { error: 'מספר טלפון לא תקין' });
          self.phone = phone;
        }
        if (body.officePhone !== undefined) {
          const office = normalizePhone(body.officePhone);
          // optional - an empty value simply clears it
          if (office && !validPhone(office)) return sendJson(res, 400, { error: 'מספר טלפון משרד לא תקין' });
          self.officePhone = office;
        }
        logAction('update', 'users', self.id, `עדכון פרטים אישיים: ${self.fullName}`, self.fullName);
        save();
        broadcast({ type: 'update', entity: 'users' });
        return sendJson(res, 200, publicUser(self));
      }

      // choose your own code, without needing an admin
      if (req.method === 'POST' && seg[2] === 'code') {
        const ip = req.socket.remoteAddress || '?';
        if (throttled(ip)) return sendJson(res, 429, { error: 'too many attempts, wait a minute' });

        const body = await readBody(req);
        const current = normalizeCode(body.currentCode);
        const next = normalizeCode(body.newCode);

        if (!verifyCode(current, self.codeSalt, self.codeHash)) {
          noteFailure(ip);
          return sendJson(res, 403, { error: 'הקוד הנוכחי שגוי' });
        }
        if (next.length < 6) return sendJson(res, 400, { error: 'הקוד החדש חייב להיות באורך 6 תווים לפחות' });

        // a code that collides with another login would make sign-in ambiguous
        if (sameCode(next, db.settings.masterPin) || sameCode(next, db.settings.pin)) {
          return sendJson(res, 409, { error: 'הקוד הזה כבר בשימוש במערכת, בחרו קוד אחר' });
        }
        if (db.users.some((u) => u.id !== self.id && verifyCode(next, u.codeSalt, u.codeHash))) {
          return sendJson(res, 409, { error: 'הקוד הזה כבר בשימוש, בחרו קוד אחר' });
        }

        const { salt, hash } = hashCode(next);
        self.codeSalt = salt;
        self.codeHash = hash;
        noteSuccess(ip);
        logAction('update', 'users', self.id, `שינה את הקוד האישי: ${self.fullName}`, self.fullName);
        save();
        return sendJson(res, 200, { ok: true });
      }

      return sendJson(res, 405, { error: 'method not allowed' });
    }

    /* --- user management: admins and the master code only --- */
    if (seg[1] === 'users') {
      const auth = identify(req);
      if (!auth.ok) return sendJson(res, auth.status, { error: auth.error });
      if (!auth.actor.isAdmin) return sendJson(res, 403, { error: 'נדרשות הרשאות מנהל / admin only' });

      const db = get();
      const id = seg[2];

      if (req.method === 'GET' && !id) {
        // ID numbers are only unmasked for the master code holder
        return sendJson(res, 200, db.users
          .map((u) => publicUser(u))
          .sort((a, b) => (a.status === 'pending' ? -1 : 0) - (b.status === 'pending' ? -1 : 0)
            || String(a.fullName).localeCompare(String(b.fullName), 'he')));
      }

      const user = db.users.find((u) => u.id === id);
      if (!user) return sendJson(res, 404, { error: 'not found' });

      // approve / suspend / change role
      if (req.method === 'PUT') {
        const body = await readBody(req);
        if (body.status !== undefined) {
          if (!STATUSES.includes(body.status)) return sendJson(res, 400, { error: 'bad status' });
          if (user.status !== body.status) {
            user.status = body.status;
            if (body.status === 'active') {
              user.approvedAt = new Date().toISOString();
              user.approvedBy = auth.actor.name;
            }
            const word = { active: 'אושר', suspended: 'הושהה', pending: 'הוחזר להמתנה' }[body.status];
            logAction('update', 'users', user.id, `${word}: ${user.fullName}`, auth.actor.name);
          }
        }
        if (body.role !== undefined) {
          if (!ROLES.includes(body.role)) return sendJson(res, 400, { error: 'bad role' });
          // only the master code may hand out admin rights
          if (body.role === 'admin' && !auth.actor.isMaster) {
            return sendJson(res, 403, { error: 'רק בעל קוד הגיבוי יכול למנות מנהל' });
          }
          if (user.role !== body.role) {
            user.role = body.role;
            logAction('update', 'users', user.id, `הרשאה: ${user.fullName} → ${body.role}`, auth.actor.name);
          }
        }
        save();
        broadcast({ type: 'update', entity: 'users' });
        return sendJson(res, 200, publicUser(user));
      }

      // issue a fresh code - the old one stops working immediately
      if (req.method === 'POST' && seg[3] === 'code') {
        if (!auth.actor.isMaster) return sendJson(res, 403, { error: 'רק בעל קוד הגיבוי יכול להנפיק קוד חדש' });
        const code = generateCode(db.users);
        const { salt, hash } = hashCode(code);
        user.codeSalt = salt;
        user.codeHash = hash;
        logAction('update', 'users', user.id, `הונפק קוד חדש: ${user.fullName}`, auth.actor.name);
        save();
        return sendJson(res, 200, { ok: true, code, name: user.fullName });
      }

      if (req.method === 'DELETE') {
        if (!auth.actor.isMaster) return sendJson(res, 403, { error: 'רק בעל קוד הגיבוי יכול למחוק משתמש' });
        db.users = db.users.filter((u) => u.id !== id);
        logAction('delete', 'users', id, `נמחק משתמש: ${user.fullName}`, auth.actor.name);
        save();
        broadcast({ type: 'update', entity: 'users' });
        return sendJson(res, 200, { ok: true });
      }

      return sendJson(res, 405, { error: 'method not allowed' });
    }

    /* --- backup --- */
    if (seg[1] === 'backup' && req.method === 'POST') {
      const auth = identify(req);
      if (!auth.ok) return sendJson(res, auth.status, { error: auth.error });
      if (!auth.actor.isAdmin) return sendJson(res, 403, { error: 'נדרשות הרשאות מנהל / admin only' });
      logAction('update', 'settings', '-', 'נוצר גיבוי', auth.actor.name);
      return sendJson(res, 200, { ok: true, file: backup() });
    }

    /* --- generic CRUD --- */
    const collection = seg[1];
    if (COLLECTIONS.includes(collection)) {
      const db = get();
      const list = db[collection];
      const id = seg[2];

      if (req.method === 'GET') {
        return sendJson(res, 200, id ? list.find((x) => x.id === id) || null : list);
      }

      const auth = identify(req);
      if (!auth.ok) return sendJson(res, auth.status, { error: auth.error });
      const who = auth.actor.name;

      // Staff work the message board only; everything else is for admins.
      if (!auth.actor.isAdmin && !STAFF_WRITABLE.has(collection)) {
        return sendJson(res, 403, { error: 'אין לך הרשאה לשנות את הנתונים האלה / not allowed for your role' });
      }

      // ...and only on the messages they wrote themselves.
      if (!auth.actor.isAdmin && collection === 'messages' && (req.method === 'PUT' || req.method === 'DELETE')) {
        const target = list.find((x) => x.id === id);
        if (!target) return sendJson(res, 404, { error: 'not found' });
        const mine = auth.actor.user && target.createdBy && target.createdBy === auth.actor.user.id;
        if (!mine) {
          return sendJson(res, 403, {
            error: 'אפשר לערוך ולמחוק רק הודעות שכתבת בעצמך / you may only change your own messages',
          });
        }
      }

      if (req.method === 'POST') {
        const body = await readBody(req);
        const item = { id: newId(ID_PREFIX[collection]), ...pick(collection, body), updatedAt: new Date().toISOString() };
        if (collection === 'messages') {
          item.createdBy = auth.actor.user ? auth.actor.user.id : '';
          item.createdByName = who;
          item.createdAt = new Date().toISOString();
        }
        list.push(item);
        logAction('create', collection, item.id, labelOf(collection, item), who);
        save();
        broadcast({ type: 'update', entity: collection, id: item.id });
        return sendJson(res, 201, item);
      }

      if (req.method === 'PUT' && id) {
        const idx = list.findIndex((x) => x.id === id);
        if (idx === -1) return sendJson(res, 404, { error: 'not found' });
        const body = await readBody(req);
        list[idx] = { ...list[idx], ...pick(collection, body), updatedAt: new Date().toISOString() };
        logAction('update', collection, id, labelOf(collection, list[idx]), who);
        save();
        broadcast({ type: 'update', entity: collection, id });
        return sendJson(res, 200, list[idx]);
      }

      if (req.method === 'DELETE' && id) {
        const idx = list.findIndex((x) => x.id === id);
        if (idx === -1) return sendJson(res, 404, { error: 'not found' });
        const [removed] = list.splice(idx, 1);

        // keep referential integrity - drop anything pointing at the deleted row
        if (collection === 'departments') {
          db.rooms.filter((r) => r.departmentId === id).forEach((r) => { r.departmentId = ''; });
          db.doctors.filter((d) => d.departmentId === id).forEach((d) => { d.departmentId = ''; });
        }
        if (collection === 'rooms') {
          db.assignments = db.assignments.filter((a) => a.roomId !== id);
          db.signs.filter((s) => s.targetId === id).forEach((s) => { s.targetId = ''; });
        }
        if (collection === 'doctors') {
          db.assignments = db.assignments.filter((a) => a.doctorId !== id);
        }

        logAction('delete', collection, id, labelOf(collection, removed), who);
        save();
        broadcast({ type: 'update', entity: collection, id });
        return sendJson(res, 200, { ok: true });
      }
    }

    return sendJson(res, 404, { error: 'unknown endpoint' });
  } catch (err) {
    console.error('[api]', err);
    return sendJson(res, 400, { error: err.message });
  }
});

function localAddresses() {
  const out = [];
  for (const list of Object.values(os.networkInterfaces())) {
    for (const ni of list || []) {
      if (ni.family === 'IPv4' && !ni.internal) out.push(ni.address);
    }
  }
  return out;
}

server.listen(PORT, () => {
  console.log('');
  console.log('  Medical Sign is running');
  console.log(`  Admin:    http://localhost:${PORT}/`);
  console.log(`  Screens:  http://localhost:${PORT}/display.html?sign=sign_201`);
  for (const ip of localAddresses()) {
    console.log(`  Network:  http://${ip}:${PORT}/   <- use this on the screens/tablets`);
  }
  console.log('');
});
