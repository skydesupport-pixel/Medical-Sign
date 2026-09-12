// User accounts: registration, personal access codes, validation.
// Codes are stored hashed (scrypt) - they can never be read back out of the
// database, only regenerated, so a leaked db.json does not hand over logins.

import { scryptSync, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';

// Pasted codes carry invisible direction marks and stray spaces - strip them.
export function normalizeCode(v) {
  return String(v ?? '').replace(/[\s\p{Cf}]/gu, '');
}

export function hashCode(code, salt = randomBytes(16).toString('hex')) {
  return { salt, hash: scryptSync(normalizeCode(code), salt, 32).toString('hex') };
}

export function verifyCode(code, salt, hash) {
  if (!salt || !hash) return false;
  const candidate = scryptSync(normalizeCode(code), salt, 32);
  const known = Buffer.from(hash, 'hex');
  return candidate.length === known.length && timingSafeEqual(candidate, known);
}

export function generateCode(users = []) {
  for (let tries = 0; tries < 50; tries++) {
    const code = String(randomInt(100000, 1000000));
    const taken = users.some((u) => verifyCode(code, u.codeSalt, u.codeHash));
    if (!taken) return code;
  }
  return String(randomInt(1000000, 10000000)); // fall back to 7 digits
}

/* ------------------------------------------------------------------ *
 * Validation
 * ------------------------------------------------------------------ */

// Israeli ID check digit (weights 1,2 alternating, digits over 9 reduced).
export function validIsraeliId(value) {
  const id = String(value ?? '').replace(/\D/g, '');
  if (id.length < 5 || id.length > 9) return false;
  const padded = id.padStart(9, '0');
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = Number(padded[i]) * ((i % 2) + 1);
    if (digit > 9) digit -= 9;
    sum += digit;
  }
  return sum % 10 === 0;
}

export function normalizeId(value) {
  return String(value ?? '').replace(/\D/g, '').padStart(9, '0');
}

export function normalizePhone(value) {
  return String(value ?? '').replace(/[^\d+]/g, '');
}

export function validPhone(value) {
  const digits = normalizePhone(value).replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 15;
}

export function maskId(id) {
  const s = String(id ?? '');
  return s.length <= 4 ? s : '•'.repeat(s.length - 4) + s.slice(-4);
}

/* ------------------------------------------------------------------ *
 * ID numbers: verified once, never kept
 *
 * Data minimisation (חוק הגנת הפרטיות). The ID proves at registration that
 * a person is who they claim; after that it is never needed again. So we
 * keep a scrypt hash plus the last four digits for display, and throw the
 * number itself away. Registration still rejects a duplicate, the UI still
 * shows ••••• 0092, and a stolen db.json no longer hands anyone a list of
 * real Israeli ID numbers. Nobody - not even the master code - can read one
 * back out, because it is no longer there.
 * ------------------------------------------------------------------ */
export function hashId(id, salt = randomBytes(16).toString('hex')) {
  return { salt, hash: scryptSync(normalizeId(id), salt, 32).toString('hex') };
}

export function verifyId(id, salt, hash) {
  if (!salt || !hash) return false;
  const candidate = scryptSync(normalizeId(id), salt, 32);
  const known = Buffer.from(hash, 'hex');
  return candidate.length === known.length && timingSafeEqual(candidate, known);
}

// Is this ID already registered? Walks every user, so it costs one scrypt
// per account - fine for a hospital department, and it runs once at signup.
export function idTaken(id, users = []) {
  return users.some((u) => verifyId(id, u.idSalt, u.idHash));
}

// The only form of an ID the system can still produce: ••••• 0092
export function idDisplay(u) {
  const last4 = String(u?.idLast4 ?? '');
  return last4 ? '•'.repeat(5) + last4 : '—';
}

// What the browser is allowed to see. Never a code hash, never an ID hash,
// and never a full ID number - that one is not stored at all any more.
export function publicUser(u) {
  return {
    id: u.id,
    fullName: u.fullName,
    phone: u.phone,
    officePhone: u.officePhone || '',
    nationalId: idDisplay(u),
    idMasked: true,
    role: u.role,
    status: u.status,
    createdAt: u.createdAt,
    lastLogin: u.lastLogin || '',
    approvedAt: u.approvedAt || '',
    approvedBy: u.approvedBy || '',
  };
}

export const STATUSES = ['pending', 'active', 'suspended'];
export const ROLES = ['staff', 'admin'];
