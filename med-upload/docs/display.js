/* Medical Sign display renderer.
   URL: /display.html?room=<number>   a door screen - every room has one
        /display.html?floor=<n>       a floor directory - every floor has one
        /display.html?sign=<signId>   a bespoke sign (wayfinding, notice board)
   plus [&print=1][&theme=dark][&kiosk=1]
   Shows Hebrew large with English underneath - the usual hospital convention. */

const params = new URLSearchParams(location.search);
const ROOM_KEY = params.get('room') || '';
const FLOOR_KEY = params.get('floor') || '';
const SIGN_ID = params.get('sign') || '';

// which of the three addresses this screen was opened with
const SOURCE = ROOM_KEY
  ? { path: '/api/display/room/' + encodeURIComponent(ROOM_KEY), label: 'room ' + ROOM_KEY }
  : FLOOR_KEY
    ? { path: '/api/display/floor/' + encodeURIComponent(FLOOR_KEY), label: 'floor ' + FLOOR_KEY }
    : SIGN_ID
      ? { path: '/api/display/' + encodeURIComponent(SIGN_ID), label: SIGN_ID }
      : null;
const PRINT_MODE = params.get('print') === '1';
const THEME_OVERRIDE = params.get('theme');

const root = document.getElementById('root');
const offline = document.getElementById('offline');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const DAYS_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const STATUS = {
  open: { he: 'פתוח', en: 'Open' },
  closed: { he: 'סגור', en: 'Closed' },
  break: { he: 'בהפסקה', en: 'On break' },
  emergency: { he: 'חירום', en: 'Emergency' },
};
const ARROW_GLYPH = { up: '↑', down: '↓', left: '←', right: '→', upleft: '↖', upright: '↗' };

let data = null;

/* ---------------------------------------------------------------- */
async function load() {
  if (!SOURCE) {
    root.innerHTML = `<div class="door"><div class="vacant" style="margin:auto">
      <div class="big">Medical Sign</div>
      <div class="sub">הוסיפו ?room=&lt;מספר חדר&gt; לכתובת · add ?room=&lt;number&gt; to the URL</div></div></div>`;
    return;
  }
  try {
    const res = await fetch(SOURCE.path, { cache: 'no-store' });
    if (!res.ok) throw new Error('screen not found');
    data = await res.json();
    offline.hidden = true;
    paint();
  } catch (err) {
    offline.hidden = false;
    if (!data) {
      root.innerHTML = `<div class="door"><div class="vacant" style="margin:auto">
        <div class="big">${esc(err.message)}</div>
        <div class="sub">${esc(SOURCE.label)}</div></div></div>`;
    }
  }
}

/* ---------------------------------------------------------------- */
function header() {
  const now = new Date();
  return `<div class="head">
    <div>
      <div class="hosp">${esc(data.hospital.nameHe || '')}</div>
      <div class="date" style="text-align:start">${esc(data.hospital.nameEn || '')}</div>
    </div>
    <div class="spacer"></div>
    <div>
      <div class="clock">${now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</div>
      <div class="date">${esc(DAYS_HE[now.getDay()])} · ${now.toLocaleDateString('he-IL')}</div>
    </div>
  </div>`;
}

function messagesBlock() {
  const list = data.messages || [];
  if (!list.length) return '';
  const icon = { info: 'ⓘ', warn: '⚠', alert: '✚' };
  return `<div class="msgs">${list.slice(0, 3).map((m) => `<div class="msg ${esc(m.level || 'info')}">
    <span class="ic">${icon[m.level] || 'ⓘ'}</span>
    <span>${esc(m.textHe || '')}</span>
    ${m.textEn ? `<span class="en">${esc(m.textEn)}</span>` : ''}
  </div>`).join('')}</div>`;
}

function doctorBlock(entry) {
  const d = entry.doctor;
  if (!d) return '';
  return `<div class="doc">
    <div class="name">${esc(d.titleHe || '')} ${esc(d.nameHe || '')}</div>
    <div class="name-en">${esc(d.titleEn || '')} ${esc(d.nameEn || '')}</div>
    ${d.specialtyHe || d.specialtyEn ? `<div class="spec">${esc(d.specialtyHe || '')}${d.specialtyEn ? ` · ${esc(d.specialtyEn)}` : ''}</div>` : ''}
    ${entry.start || entry.end ? `<div class="hours">${esc(entry.start)} – ${esc(entry.end)}</div>` : ''}
    ${entry.noteHe || entry.noteEn ? `<div class="spec">${esc(entry.noteHe || entry.noteEn)}</div>` : ''}
  </div>`;
}

// [0,1,2,3,4] -> "ראשון-חמישי" ; [1,3] -> "שני, רביעי" ; [] -> "כל יום"
function daysText(days = []) {
  // an assignment with no days listed runs daily - saying so beats a blank
  if (!days.length) return 'כל יום';
  const sorted = [...days].sort((a, b) => a - b);
  const consecutive = sorted.every((d, i) => i === 0 || d === sorted[i - 1] + 1);
  if (consecutive && sorted.length > 2) return `${DAYS_HE[sorted[0]]}-${DAYS_HE[sorted[sorted.length - 1]]}`;
  return sorted.map((d) => DAYS_HE[d]).join(', ');
}

function rosterRow(a) {
  const d = a.doctor || {};
  return `<div class="rrow">
    <div class="rdoc">
      <b>${esc(d.titleHe || '')} ${esc(d.nameHe || '')}</b>
      <span>${esc(d.titleEn || '')} ${esc(d.nameEn || '')}${d.specialtyHe ? ' · ' + esc(d.specialtyHe) : ''}</span>
    </div>
    <div class="rwhen">
      <b>${esc(daysText(a.days))}</b>
      <span class="rtime">${esc(a.start)} – ${esc(a.end)}</span>
    </div>
  </div>`;
}

function nextUpText(n) {
  const d = n.doctor || {};
  const when = n.ahead === 0 ? 'היום' : n.ahead === 1 ? 'מחר' : DAYS_HE[n.day];
  return `${when} ${n.start} · ${d.titleHe || ''} ${d.nameHe || ''}`.trim();
}

function doorSign() {
  const { room, department, schedule, sign } = data;
  if (!room) {
    return `<div class="door"><div class="vacant" style="margin:auto">
      <div class="big">לא הוגדר חדר לשלט</div>
      <div class="sub">No room selected for this sign</div></div></div>`;
  }

  const color = department?.color || '#0e7490';
  const status = room.status || 'open';
  const st = STATUS[status] || STATUS.open;

  const current = schedule.current || [];
  const later = schedule.later || [];
  const roster = data.roster || [];

  let body;
  if (current.length) {
    // somebody is in the room right now
    body = `<div class="now-label">נמצא/ת כעת · Currently here</div>${current.map(doctorBlock).join('')}`;
  } else if (roster.length) {
    // outside clinic hours - show who works this room and when
    body = `<div class="now-label">רופאי החדר ושעות קבלה · Doctors &amp; clinic hours</div>
      <div class="roster">${roster.map(rosterRow).join('')}</div>
      ${data.nextUp ? `<div class="next-up">הבא בתור · Next: <b>${esc(nextUpText(data.nextUp))}</b></div>` : ''}`;
  } else if ((data.deptDoctors || []).length) {
    // room has no roster at all - fall back to the department's team
    body = `<div class="now-label">צוות המחלקה · Department team</div>
      <div class="roster">${data.deptDoctors.map((d) => `<div class="rrow">
        <div class="rdoc"><b>${esc(d.titleHe || '')} ${esc(d.nameHe || '')}</b>
          <span>${esc(d.titleEn || '')} ${esc(d.nameEn || '')}${d.specialtyHe ? ' · ' + esc(d.specialtyHe) : ''}</span></div>
      </div>`).join('')}</div>`;
  } else {
    body = `<div class="vacant">
      <div class="big">${status === 'open' ? 'החדר פנוי' : esc(st.he)}</div>
      <div class="sub">${status === 'open' ? 'Room available' : esc(st.en)}</div>
    </div>`;
  }

  const laterLine = later.length
    ? `<div class="later">בהמשך היום · Later today: ${later.slice(0, 3).map((e) =>
        `<b>${esc(e.start)}</b> ${esc(e.doctor ? (e.doctor.titleHe || '') + ' ' + (e.doctor.nameHe || '') : '')}`).join(' · ')}</div>`
    : '';

  const note = (room.noteHe || room.noteEn)
    ? `<div class="note-line">${esc(room.noteHe || '')}${room.noteEn ? ` <span style="opacity:.65">· ${esc(room.noteEn)}</span>` : ''}</div>`
    : '';

  return `${header()}
    <div class="door" style="--deptcolor:${esc(color)}">
      <div class="door-top">
        <div class="roomnum">${esc(room.number)}</div>
        <div class="titles">
          ${department ? `<div class="dept"><i></i>${esc(department.nameHe || '')} ${department.nameEn ? `· ${esc(department.nameEn)}` : ''}</div>` : ''}
          <h1>${esc(room.nameHe || room.nameEn || '')}</h1>
          <h2>${esc(room.nameEn || '')}</h2>
        </div>
        <div class="status-badge s-${esc(status)}"><span class="dot"></span>${esc(st.he)} · ${esc(st.en)}</div>
      </div>
      <div class="now-block">${body}</div>
      ${laterLine}
      ${note}
    </div>
    ${messagesBlock()}`;
}

function directorySign() {
  const depts = data.departments || [];
  const rows = depts.map((d) => `<div class="dir-dept" style="--dc:${esc(d.color || '#0e7490')}">
    <div class="dh"><b>${esc(d.nameHe || '')}</b><span>${esc(d.nameEn || '')}</span></div>
    ${d.rooms.map((r) => {
      const cur = (r.schedule?.current || [])[0];
      let who;
      if (cur?.doctor) {
        who = `<b>${esc(cur.doctor.titleHe || '')} ${esc(cur.doctor.nameHe || '')}</b> <span class="tm">${esc(cur.start)}–${esc(cur.end)}</span>`;
      } else if (r.nextUp?.doctor) {
        // nobody in the room now - still name the doctor and say when
        const n = r.nextUp;
        const when = n.ahead === 0 ? 'היום' : n.ahead === 1 ? 'מחר' : DAYS_HE[n.day];
        who = `<span class="soon">${esc(n.doctor.titleHe || '')} ${esc(n.doctor.nameHe || '')} · ${esc(when)} <span class="tm">${esc(n.start)}</span></span>`;
      } else {
        who = `<span class="free">${r.status === 'open' ? 'פנוי · Free' : esc((STATUS[r.status] || STATUS.closed).he)}</span>`;
      }
      return `<div class="dir-room">
        <span class="n">${esc(r.number)}</span>
        <span>${esc(r.nameHe || r.nameEn || '')}</span>
        <span class="who">${who}</span>
      </div>`;
    }).join('')}
  </div>`).join('');

  return `${header()}
    <div class="dir">
      <h1>קומה ${esc(data.floor)} · Floor ${esc(data.floor)}</h1>
      ${rows || '<div class="vacant"><div class="big">אין מחלקות בקומה זו</div></div>'}
    </div>
    ${messagesBlock()}`;
}

function wayfindingSign() {
  const rows = (data.directions || []).map((d) => `<div class="way-row">
    <div class="ar">${ARROW_GLYPH[d.arrow] || '→'}</div>
    <div class="lb"><b>${esc(d.labelHe || '')}</b><span>${esc(d.labelEn || '')}</span></div>
  </div>`).join('');
  return `${header()}<div class="way">${rows || '<div class="vacant"><div class="big">לא הוגדרו כיוונים</div></div>'}</div>${messagesBlock()}`;
}

function noticeSign() {
  const list = data.messages || [];
  return `${header()}
    <div class="way">${list.map((m) => `<div class="way-row">
      <div class="ar">${m.level === 'alert' ? '✚' : m.level === 'warn' ? '⚠' : 'ⓘ'}</div>
      <div class="lb"><b>${esc(m.textHe || '')}</b><span>${esc(m.textEn || '')}</span></div>
    </div>`).join('') || '<div class="vacant"><div class="big">אין הודעות</div><div class="sub">No messages</div></div>'}</div>`;
}

function paint() {
  const sign = data.sign;
  document.documentElement.dataset.theme = THEME_OVERRIDE || sign.theme || 'light';
  document.documentElement.dataset.orientation = sign.orientation || 'landscape';
  document.title = `${sign.nameHe || sign.nameEn || 'Medical Sign'} · Medical Sign`;

  if (sign.type === 'directory') root.innerHTML = directorySign();
  else if (sign.type === 'wayfinding') root.innerHTML = wayfindingSign();
  else if (sign.type === 'notice') root.innerHTML = noticeSign();
  else root.innerHTML = doorSign();
}

/* ---------------------------------------------------------------- *
 * Live updates: push over SSE, plus a slow poll as a safety net.
 * ---------------------------------------------------------------- */
function connectLive() {
  let es;
  try { es = new EventSource('/api/events'); } catch { return; }
  es.onmessage = (ev) => {
    offline.hidden = true;
    try { if (JSON.parse(ev.data).type === 'update') load(); } catch {}
  };
  es.onerror = () => { offline.hidden = false; };
}

load().then(() => {
  if (PRINT_MODE) {
    setTimeout(() => window.print(), 400);
    return;
  }
  connectLive();
  setInterval(load, 60000);          // safety-net refresh + rolls the shift over
  setInterval(() => { if (data) paint(); }, 20000); // keep the clock fresh
});
