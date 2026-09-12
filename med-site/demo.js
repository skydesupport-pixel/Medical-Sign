/* ------------------------------------------------------------------ *
 * Medical Sign - DEMO BACKEND
 *
 * GitHub Pages serves static files only: there is no Node process, so
 * /api/... would 404. This file stands in for the server. It intercepts
 * fetch() and answers the same routes from data held in the browser, so
 * the whole system can be clicked through from a public link.
 *
 * Nothing here talks to a real server, nothing is stored, and none of
 * the data is real. Loaded ONLY in docs/ - the actual app under public/
 * never sees this file.
 * ------------------------------------------------------------------ */
(function () {
  const nowISO = () => new Date().toISOString();

  /* ---------------- sample hospital ---------------- */
  const DB = {
    settings: {
      hospitalNameHe: 'בית החולים לדוגמה',
      hospitalNameEn: 'Example Medical Center',
      supportPhone: '052-3748060',
      sharedPinEnabled: false,
    },
    departments: [
      { id: 'dep_er',    nameHe: 'מיון',        nameEn: 'Emergency',       floor: 0, wing: 'A', color: '#dc2626', phone: '03-5551100', hoursHe: 'פתוח 24/7', hoursEn: 'Open 24/7' },
      { id: 'dep_card',  nameHe: 'קרדיולוגיה',  nameEn: 'Cardiology',      floor: 2, wing: 'B', color: '#e11d48', phone: '03-5551220', hoursHe: 'ראשון-חמישי 08:00-16:00', hoursEn: 'Sun-Thu 08:00-16:00' },
      { id: 'dep_ortho', nameHe: 'אורתופדיה',   nameEn: 'Orthopedics',     floor: 2, wing: 'C', color: '#0891b2', phone: '03-5551240', hoursHe: 'ראשון-חמישי 08:00-15:00', hoursEn: 'Sun-Thu 08:00-15:00' },
      { id: 'dep_neuro', nameHe: 'נוירולוגיה',  nameEn: 'Neurology',       floor: 3, wing: 'B', color: '#7c3aed', phone: '03-5551310', hoursHe: 'ראשון-חמישי 08:00-15:00', hoursEn: 'Sun-Thu 08:00-15:00' },
      { id: 'dep_img',   nameHe: 'הדמיה ורנטגן', nameEn: 'Imaging & X-Ray', floor: 1, wing: 'A', color: '#0d9488', phone: '03-5551150', hoursHe: 'ראשון-שישי 07:00-19:00', hoursEn: 'Sun-Fri 07:00-19:00' },
      { id: 'dep_lab',   nameHe: 'מעבדות',      nameEn: 'Laboratories',    floor: 1, wing: 'D', color: '#65a30d', phone: '03-5551170', hoursHe: 'ראשון-חמישי 07:00-14:00', hoursEn: 'Sun-Thu 07:00-14:00' },
    ],
    rooms: [
      { id: 'room_201', number: '201', nameHe: 'חדר בדיקות 1', nameEn: 'Exam Room 1', departmentId: 'dep_card', floor: 2, type: 'exam', status: 'open' },
      { id: 'room_202', number: '202', nameHe: 'חדר בדיקות 2', nameEn: 'Exam Room 2', departmentId: 'dep_card', floor: 2, type: 'exam', status: 'open' },
      { id: 'room_205', number: '205', nameHe: 'אק"ג ומבחני מאמץ', nameEn: 'ECG & Stress Test', departmentId: 'dep_card', floor: 2, type: 'proc', status: 'open' },
      { id: 'room_231', number: '231', nameHe: 'מרפאת גב', nameEn: 'Spine Clinic', departmentId: 'dep_ortho', floor: 2, type: 'clinic', status: 'open' },
      { id: 'room_232', number: '232', nameHe: 'חדר גבס', nameEn: 'Casting Room', departmentId: 'dep_ortho', floor: 2, type: 'proc', status: 'open' },
      { id: 'room_301', number: '301', nameHe: 'מרפאת נוירולוגיה', nameEn: 'Neurology Clinic', departmentId: 'dep_neuro', floor: 3, type: 'clinic', status: 'open' },
      { id: 'room_110', number: '110', nameHe: 'רנטגן 1', nameEn: 'X-Ray 1', departmentId: 'dep_img', floor: 1, type: 'proc', status: 'open' },
      { id: 'room_112', number: '112', nameHe: 'סי.טי', nameEn: 'CT Scanner', departmentId: 'dep_img', floor: 1, type: 'proc', status: 'closed', noteHe: 'בתחזוקה עד 12:00', noteEn: 'Maintenance until 12:00' },
      { id: 'room_140', number: '140', nameHe: 'לקיחת דמים', nameEn: 'Blood Draw', departmentId: 'dep_lab', floor: 1, type: 'clinic', status: 'open' },
    ],
    doctors: [
      { id: 'doc_avi',   nameHe: 'אבי כהן',    nameEn: 'Avi Cohen',     titleHe: 'ד"ר', titleEn: 'Dr.',   specialtyHe: 'קרדיולוג בכיר',  specialtyEn: 'Senior Cardiologist', departmentId: 'dep_card',  license: '12345', officePhone: '03-5551221', active: true },
      { id: 'doc_maya',  nameHe: 'מאיה לוי',   nameEn: 'Maya Levy',     titleHe: 'ד"ר', titleEn: 'Dr.',   specialtyHe: 'אי ספיקת לב',    specialtyEn: 'Heart Failure',       departmentId: 'dep_card',  license: '23456', officePhone: '03-5551222', active: true },
      { id: 'doc_yossi', nameHe: 'יוסי מזרחי', nameEn: 'Yossi Mizrahi', titleHe: 'פרופ', titleEn: 'Prof.', specialtyHe: 'מנתח עמוד שדרה', specialtyEn: 'Spine Surgeon',       departmentId: 'dep_ortho', license: '34567', officePhone: '03-5551241', active: true },
      { id: 'doc_rina',  nameHe: 'רינה שפירא', nameEn: 'Rina Shapira',  titleHe: 'ד"ר', titleEn: 'Dr.',   specialtyHe: 'נוירולוגית',     specialtyEn: 'Neurologist',         departmentId: 'dep_neuro', license: '45678', officePhone: '03-5551311', active: true },
      { id: 'doc_omar',  nameHe: 'עומר חדד',   nameEn: 'Omar Haddad',   titleHe: 'ד"ר', titleEn: 'Dr.',   specialtyHe: 'רדיולוג',        specialtyEn: 'Radiologist',         departmentId: 'dep_img',   license: '56789', officePhone: '03-5551151', active: true },
    ],
    assignments: [
      { id: 'as_1', doctorId: 'doc_avi',   roomId: 'room_201', days: [0, 1, 2, 3, 4], start: '08:00', end: '12:00', active: true },
      { id: 'as_2', doctorId: 'doc_maya',  roomId: 'room_201', days: [0, 1, 2, 3, 4], start: '12:00', end: '16:00', active: true },
      { id: 'as_3', doctorId: 'doc_maya',  roomId: 'room_202', days: [0, 2],          start: '08:00', end: '12:00', active: true },
      { id: 'as_4', doctorId: 'doc_yossi', roomId: 'room_231', days: [1, 3],          start: '09:00', end: '14:00', active: true },
      { id: 'as_5', doctorId: 'doc_rina',  roomId: 'room_301', days: [0, 1, 2, 3, 4], start: '08:30', end: '15:00', active: true },
      { id: 'as_6', doctorId: 'doc_omar',  roomId: 'room_110', days: [0, 1, 2, 3, 4], start: '07:00', end: '19:00', active: true },
    ],
    signs: [
      { id: 'sign_201', nameHe: 'שלט דלת 201', nameEn: 'Door sign 201', type: 'door', targetId: 'room_201', theme: 'light', orientation: 'landscape' },
      { id: 'sign_231', nameHe: 'שלט דלת 231', nameEn: 'Door sign 231', type: 'door', targetId: 'room_231', theme: 'dark', orientation: 'portrait' },
      { id: 'sign_112', nameHe: 'שלט דלת סי.טי', nameEn: 'Door sign CT', type: 'door', targetId: 'room_112', theme: 'light', orientation: 'landscape' },
      { id: 'sign_f2',  nameHe: 'מדריך קומה 2', nameEn: 'Floor 2 board', type: 'directory', targetId: '2', theme: 'dark', orientation: 'portrait' },
      { id: 'sign_lob', nameHe: 'שילוט לובי', nameEn: 'Lobby wayfinding', type: 'wayfinding', targetId: '', theme: 'dark', orientation: 'landscape',
        directions: [
          { labelHe: 'מיון', labelEn: 'Emergency', arrow: 'left' },
          { labelHe: 'הדמיה ורנטגן', labelEn: 'Imaging', arrow: 'right' },
          { labelHe: 'מעבדות', labelEn: 'Laboratories', arrow: 'right' },
          { labelHe: 'מרפאות חוץ', labelEn: 'Outpatient', arrow: 'up' },
          { labelHe: 'קבלה ורישום', labelEn: 'Admissions', arrow: 'down' },
        ] },
    ],
    messages: [
      { id: 'msg_1', scope: 'global', targetId: '', textHe: 'נא לעטות מסכה באזורי ההמתנה', textEn: 'Please wear a mask in waiting areas', level: 'info', active: true, from: '', until: '', createdBy: 'demo_admin', createdByName: 'מנהל הדגמה' },
      { id: 'msg_2', scope: 'department', targetId: 'dep_img', textHe: 'סי.טי בתחזוקה - בדיקות דחופות ברנטגן 1', textEn: 'CT under maintenance - urgent scans at X-Ray 1', level: 'warn', active: true, from: '', until: '', createdBy: 'demo_admin', createdByName: 'מנהל הדגמה' },
    ],
    users: [
      { id: 'demo_admin', fullName: 'מנהל הדגמה', phone: '050-0000000', officePhone: '03-5551000', nationalId: '000000000', role: 'admin', status: 'active', createdAt: nowISO(), lastLogin: nowISO(), approvedBy: 'הדגמה' },
      { id: 'demo_staff', fullName: 'שרה אחות', phone: '050-1111111', officePhone: '', nationalId: '111111118', role: 'staff', status: 'active', createdAt: nowISO(), lastLogin: '', approvedBy: 'מנהל הדגמה' },
      { id: 'demo_wait',  fullName: 'דני מועמד', phone: '050-2222222', officePhone: '', nationalId: '222222226', role: 'staff', status: 'pending', createdAt: nowISO(), lastLogin: '' },
    ],
    mail: [
      { id: 'mail_1', fromId: 'demo_staff', fromName: 'שרה אחות', toId: 'demo_admin', toName: 'מנהל הדגמה',
        subject: 'לעדכן שלט 231', body: 'פרופ מזרחי לא מגיע מחר, נא לעדכן את שלט מרפאת הגב.',
        createdAt: nowISO(), readAt: '', doneAt: '', deletedByTo: false, deletedByFrom: false },
    ],
    log: [
      { id: 'log_1', at: nowISO(), action: 'update', entity: 'rooms',    entityId: 'room_112', summary: '112 סי.טי', actor: 'מנהל הדגמה' },
      { id: 'log_2', at: nowISO(), action: 'create', entity: 'messages', entityId: 'msg_2',    summary: 'סי.טי בתחזוקה', actor: 'מנהל הדגמה' },
    ],
  };

  /* who the demo signs you in as - always a full admin, so every screen is visible */
  const ME = DB.users[0];

  /* ---------------- the same resolution logic the server uses ---------------- */
  const hhmm = (d) => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  const room = (id) => DB.rooms.find((r) => r.id === id);
  const dept = (id) => DB.departments.find((d) => d.id === id);

  const doctorCard = (id) => {
    const d = DB.doctors.find((x) => x.id === id);
    return d ? {
      id: d.id, nameHe: d.nameHe, nameEn: d.nameEn,
      titleHe: d.titleHe, titleEn: d.titleEn,
      specialtyHe: d.specialtyHe, specialtyEn: d.specialtyEn,
    } : null;
  };

  function roomSchedule(roomId, now) {
    const day = now.getDay(), t = hhmm(now);
    const todays = DB.assignments
      .filter((a) => a.active !== false && a.roomId === roomId && (a.days || []).includes(day))
      .sort((a, b) => a.start.localeCompare(b.start));
    const shape = (a) => ({ id: a.id, start: a.start, end: a.end, noteHe: a.noteHe, noteEn: a.noteEn, doctor: doctorCard(a.doctorId) });
    return {
      current: todays.filter((a) => a.start <= t && t < a.end).map(shape),
      later: todays.filter((a) => a.start > t).map(shape),
      today: todays.map(shape),
    };
  }

  function roomRoster(roomId) {
    return DB.assignments
      .filter((a) => a.active !== false && a.roomId === roomId)
      .map((a) => ({ id: a.id, days: a.days || [], start: a.start, end: a.end, doctor: doctorCard(a.doctorId) }))
      .filter((a) => a.doctor)
      .sort((a, b) => (a.days[0] ?? 9) - (b.days[0] ?? 9) || a.start.localeCompare(b.start));
  }

  function nextUp(roomId, now) {
    const roster = roomRoster(roomId), t = hhmm(now);
    for (let ahead = 0; ahead < 8; ahead++) {
      const day = (now.getDay() + ahead) % 7;
      const slots = roster.filter((a) => a.days.includes(day) && (ahead > 0 || a.start > t)).sort((a, b) => a.start.localeCompare(b.start));
      if (slots.length) return { ...slots[0], day, ahead };
    }
    return null;
  }

  const messagesFor = ({ departmentId, roomId } = {}) => DB.messages.filter((m) => {
    if (m.active === false) return false;
    if (m.scope === 'global') return true;
    if (m.scope === 'department') return m.targetId === departmentId;
    if (m.scope === 'room') return m.targetId === roomId;
    return false;
  });

  function resolveSign(signId) {
    const sign = DB.signs.find((s) => s.id === signId);
    if (!sign) return null;
    const now = new Date();
    const base = {
      sign,
      hospital: { nameHe: DB.settings.hospitalNameHe, nameEn: DB.settings.hospitalNameEn },
      serverTime: now.toISOString(),
    };

    if (sign.type === 'door') {
      const r = room(sign.targetId) || null;
      const dp = r ? dept(r.departmentId) || null : null;
      return {
        ...base, room: r, department: dp,
        schedule: r ? roomSchedule(r.id, now) : { current: [], later: [], today: [] },
        roster: r ? roomRoster(r.id) : [],
        nextUp: r ? nextUp(r.id, now) : null,
        deptDoctors: dp ? DB.doctors.filter((d) => d.departmentId === dp.id && d.active !== false).map((d) => doctorCard(d.id)) : [],
        messages: messagesFor({ departmentId: dp?.id, roomId: r?.id }),
      };
    }
    if (sign.type === 'directory') {
      const floor = Number(sign.targetId);
      return {
        ...base, floor,
        departments: DB.departments.filter((d) => Number(d.floor) === floor).map((d) => ({
          ...d,
          rooms: DB.rooms.filter((r) => r.departmentId === d.id)
            .sort((a, b) => String(a.number).localeCompare(String(b.number), undefined, { numeric: true }))
            .map((r) => ({ ...r, schedule: roomSchedule(r.id, now), roster: roomRoster(r.id), nextUp: nextUp(r.id, now) })),
        })),
        messages: messagesFor({}),
      };
    }
    if (sign.type === 'wayfinding') return { ...base, directions: sign.directions || [], messages: messagesFor({}) };
    return { ...base, messages: messagesFor({}) };
  }

  /* ---------------- state payload ---------------- */
  function buildState() {
    const now = new Date();
    const doctorNow = {};
    const t = hhmm(now);
    for (const a of DB.assignments) {
      if (a.active === false || !(a.days || []).includes(now.getDay())) continue;
      if (!(a.start <= t && t < a.end)) continue;
      const r = room(a.roomId);
      if (r) doctorNow[a.doctorId] = { roomId: r.id, number: r.number, nameHe: r.nameHe, nameEn: r.nameEn, floor: r.floor, start: a.start, end: a.end };
    }
    for (const d of DB.doctors) {
      if (!d.currentRoomId) continue;
      const r = room(d.currentRoomId);
      if (r) doctorNow[d.id] = { roomId: r.id, number: r.number, nameHe: r.nameHe, nameEn: r.nameEn, floor: r.floor, manual: true };
    }

    return {
      doctorNow,
      settings: {
        hospitalNameHe: DB.settings.hospitalNameHe,
        hospitalNameEn: DB.settings.hospitalNameEn,
        sharedPinEnabled: DB.settings.sharedPinEnabled,
        supportPhone: DB.settings.supportPhone,
      },
      departments: DB.departments, rooms: DB.rooms, doctors: DB.doctors,
      assignments: DB.assignments, signs: DB.signs, messages: DB.messages,
      log: DB.log.slice(0, 60),
      me: { name: ME.fullName, isAdmin: true, isMaster: true, kind: 'user', profile: { ...ME, idMasked: false } },
      pendingUsers: DB.users.filter((u) => u.status === 'pending').length,
      mailUnread: DB.mail.filter((m) => m.toId === ME.id && !m.deletedByTo && !m.readAt).length,
      stats: {
        departments: DB.departments.length, rooms: DB.rooms.length,
        doctors: DB.doctors.length, signs: DB.signs.length,
        onDuty: Object.keys(doctorNow).length,
        closedRooms: DB.rooms.filter((r) => r.status !== 'open').length,
        activeMessages: DB.messages.filter((m) => m.active !== false).length,
      },
      serverTime: now.toISOString(),
    };
  }

  /* ---------------- routing ---------------- */
  const uid = (p) => `${p}_${Math.random().toString(36).slice(2, 10)}`;
  const COLLECTIONS = ['departments', 'rooms', 'doctors', 'assignments', 'signs', 'messages'];

  function route(method, path, body) {
    const seg = path.replace(/^\/api\/?/, '').split('/').filter(Boolean);

    if (seg[0] === 'public') return [200, { hospitalNameHe: DB.settings.hospitalNameHe, hospitalNameEn: DB.settings.hospitalNameEn, supportPhone: DB.settings.supportPhone }];

    // any code opens the demo, as an admin
    if (seg[0] === 'auth') return [200, { ok: true, master: true, admin: true, name: ME.fullName, status: 'active' }];

    if (seg[0] === 'register') {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      DB.users.push({ id: uid('usr'), fullName: body.fullName || 'משתמש חדש', phone: body.phone || '', nationalId: body.nationalId || '', role: 'staff', status: 'pending', createdAt: nowISO(), lastLogin: '' });
      return [201, { ok: true, code, status: 'pending', name: body.fullName || 'משתמש חדש' }];
    }

    if (seg[0] === 'state') return [200, buildState()];
    if (seg[0] === 'display') { const d = resolveSign(seg[1]); return d ? [200, d] : [404, { error: 'sign not found' }]; }

    if (seg[0] === 'me') {
      if (method === 'GET') return [200, { kind: 'user', name: ME.fullName, profile: { ...ME, idMasked: false } }];
      if (seg[1] === 'code') return [200, { ok: true }];
      Object.assign(ME, { fullName: body.fullName ?? ME.fullName, phone: body.phone ?? ME.phone, officePhone: body.officePhone ?? ME.officePhone });
      return [200, { ...ME, idMasked: false }];
    }

    if (seg[0] === 'users') {
      if (method === 'GET') return [200, DB.users.map((u) => ({ ...u, idMasked: false }))];
      const u = DB.users.find((x) => x.id === seg[1]);
      if (!u) return [404, { error: 'not found' }];
      if (method === 'DELETE') { DB.users = DB.users.filter((x) => x.id !== seg[1]); return [200, { ok: true }]; }
      if (seg[2] === 'code') return [200, { ok: true, code: String(Math.floor(100000 + Math.random() * 900000)), name: u.fullName }];
      Object.assign(u, body);
      return [200, { ...u, idMasked: false }];
    }

    if (seg[0] === 'mail') {
      if (seg[1] === 'contacts') return [200, DB.users.filter((u) => u.status === 'active').map((u) => ({ id: u.id, fullName: u.fullName, role: u.role }))];
      if (method === 'GET') {
        const mine = DB.mail.filter((m) => (m.toId === ME.id && !m.deletedByTo) || (m.fromId === ME.id && !m.deletedByFrom));
        return [200, {
          inbox: mine.filter((m) => m.toId === ME.id && !m.deletedByTo),
          sent: mine.filter((m) => m.fromId === ME.id && !m.deletedByFrom),
          unread: mine.filter((m) => m.toId === ME.id && !m.readAt).length,
        }];
      }
      if (method === 'POST') {
        const to = DB.users.find((u) => u.id === body.toId);
        const item = { id: uid('mail'), fromId: ME.id, fromName: ME.fullName, toId: body.toId, toName: to ? to.fullName : '', subject: body.subject || '', body: body.body || '', createdAt: nowISO(), readAt: '', doneAt: '', deletedByTo: false, deletedByFrom: false };
        DB.mail.push(item);
        return [201, item];
      }
      const m = DB.mail.find((x) => x.id === seg[1]);
      if (!m) return [404, { error: 'not found' }];
      if (method === 'DELETE') { DB.mail = DB.mail.filter((x) => x.id !== seg[1]); return [200, { ok: true }]; }
      if (body.read !== undefined) m.readAt = body.read ? nowISO() : '';
      if (body.done !== undefined) m.doneAt = body.done ? nowISO() : '';
      return [200, m];
    }

    if (seg[0] === 'settings') { Object.assign(DB.settings, body); return [200, { ok: true }]; }
    if (seg[0] === 'backup') return [200, { ok: true, file: 'demo-backup.json' }];

    if (COLLECTIONS.includes(seg[0])) {
      const list = DB[seg[0]];
      if (method === 'GET') return [200, seg[1] ? list.find((x) => x.id === seg[1]) || null : list];
      if (method === 'POST') {
        const item = { id: uid(seg[0].slice(0, 3)), ...body, updatedAt: nowISO() };
        if (seg[0] === 'messages') { item.createdBy = ME.id; item.createdByName = ME.fullName; }
        list.push(item);
        logIt('create', seg[0], item);
        return [201, item];
      }
      const i = list.findIndex((x) => x.id === seg[1]);
      if (i === -1) return [404, { error: 'not found' }];
      if (method === 'DELETE') { const [gone] = list.splice(i, 1); logIt('delete', seg[0], gone); return [200, { ok: true }]; }
      list[i] = { ...list[i], ...body, updatedAt: nowISO() };
      logIt('update', seg[0], list[i]);
      return [200, list[i]];
    }

    return [404, { error: 'unknown endpoint (demo)' }];
  }

  function logIt(action, entity, item) {
    DB.log.unshift({
      id: uid('log'), at: nowISO(), action, entity, entityId: item.id,
      summary: item.nameHe || item.textHe || item.number || item.id,
      actor: ME.fullName,
    });
    if (DB.log.length > 60) DB.log.length = 60;
  }

  /* ---------------- intercept the network ---------------- */
  const realFetch = window.fetch.bind(window);

  window.fetch = async function (input, init = {}) {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    // strip any scheme, including file:// (which has an empty host), so the
    // demo also works when index.html is opened straight from disk
    const path = url.replace(/^[a-z][a-z0-9+.-]*:\/\/[^/]*/i, '');
    if (!path.startsWith('/api/')) return realFetch(input, init);

    // The policy documents are generated at build time into legal.json, so
    // they stay word-for-word identical to what the real server sends.
    if (path.split('?')[0] === '/api/legal') return realFetch('legal.json');

    const method = (init.method || 'GET').toUpperCase();
    let body = {};
    try { body = init.body ? JSON.parse(init.body) : {}; } catch {}

    const [status, payload] = route(method, path.split('?')[0], body);
    await new Promise((r) => setTimeout(r, 60));   // a touch of latency, so it feels real
    return new Response(JSON.stringify(payload), {
      status, headers: { 'Content-Type': 'application/json' },
    });
  };

  // there is no server to stream from; keep the app's "connected" state happy
  window.EventSource = class {
    constructor() {
      setTimeout(() => this.onmessage && this.onmessage({ data: JSON.stringify({ type: 'hello' }) }), 50);
    }
    close() {}
  };

  /* ---------------- a banner, so nobody mistakes this for the real thing ---- */
  window.addEventListener('DOMContentLoaded', () => {
    const bar = document.createElement('div');
    bar.className = 'demo-bar';
    bar.innerHTML = 'מצב הדגמה · DEMO — נתונים לדוגמה בלבד, שינויים אינם נשמרים. ' +
      '<span>הזינו קוד כלשהו כדי להיכנס</span>';
    document.body.prepend(bar);

    const css = document.createElement('style');
    css.textContent = `
      .demo-bar {
        position: sticky; top: 0; z-index: 500;
        background: #0b1524; color: #a5f3fc;
        font: 600 13px/1.4 "Segoe UI", Arial, sans-serif;
        text-align: center; padding: 7px 12px;
        border-bottom: 1px solid #164e63;
      }
      .demo-bar span { color: #67e8f9; font-weight: 700; }
      @media print { .demo-bar { display: none; } }
    `;
    document.head.appendChild(css);
  });

  console.log('%cMedical Sign — demo mode', 'color:#06b6d4;font-weight:bold', '\nNo server: /api/* is answered in the browser from sample data.');
})();
