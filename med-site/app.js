/* Medical Sign admin app - vanilla JS, no build step. */

/* ------------------------------------------------------------------ *
 * i18n
 * ------------------------------------------------------------------ */
const T = {
  he: {
    loginSub: 'מערכת ניהול שילוט דיגיטלי', enter: 'כניסה', lock: 'נעילה', cancel: 'ביטול', save: 'שמירה',
    navDashboard: 'סקירה', navNow: 'מי נמצא עכשיו', navDepartments: 'מחלקות', navRooms: 'חדרים',
    navDoctors: 'רופאים', navAssignments: 'שיבוצים', navSigns: 'שלטים', navMessages: 'הודעות',
    navLog: 'יומן שינויים', navSettings: 'הגדרות', brandSub: 'ניהול שילוט',
    add: 'הוספה', edit: 'עריכה', del: 'מחיקה', search: 'חיפוש...', none: 'אין נתונים להצגה',
    confirmDel: 'למחוק את הרשומה?', saved: 'נשמר', deleted: 'נמחק', badPin: 'קוד שגוי',
    connected: '● מחובר', disconnected: '● מנותק',
    statDepartments: 'מחלקות', statRooms: 'חדרים', statDoctors: 'רופאים', statSigns: 'שלטים',
    statOnDuty: 'רופאים בתורנות כעת', statClosed: 'חדרים סגורים', statMessages: 'הודעות פעילות',
    onDutyNow: 'פעילות עכשיו', recentChanges: 'שינויים אחרונים', quickSigns: 'שלטים',
    openDisplay: 'פתיחת שלט', preview: 'תצוגה מקדימה', copyLink: 'העתקת קישור', print: 'הדפסה',
    copied: 'הקישור הועתק', free: 'פנוי', noDoctor: 'ללא רופא משובץ', until: 'עד',
    statusOpen: 'פתוח', statusClosed: 'סגור', statusBreak: 'בהפסקה', statusEmerg: 'חירום',
    quickStatus: 'שינוי מהיר של סטטוס', roomStatuses: 'סטטוס חדרים',
    hospitalName: 'שם בית החולים', pinChange: 'שינוי קוד כניסה', backup: 'גיבוי עכשיו',
    backupDone: 'הגיבוי נשמר', settingsSaved: 'ההגדרות נשמרו', screensHelp:
      'כל שלט כאן הוא מסך אחד שתלוי בבית החולים — טאבלט ליד דלת, או מסך גדול בפרוזדור.',
    screensHelp2:
      'מתקינים פעם אחת: לוחצים "פתיחת שלט", גוררים את החלון למסך שליד הדלת ולוחצים F11 למסך מלא. מאותו רגע הוא מתעדכן לבד בכל שינוי שתעשו כאן — בלי לגעת בו שוב.',
    screensHelp3:
      'להתקנה ממכשיר אחר (טאבלט או טלוויזיה חכמה) לוחצים "העתקת קישור" ומדביקים את הכתובת בדפדפן שלו.',
    signShowsNow: 'מציג כעת', signNobody: 'אין רופא משובץ',
    signDepts: 'מחלקות', signDirections: 'כיווני הכוונה', signActiveMsgs: 'הודעות פעילות',
    signDoors: 'שלטי דלת', signFloors: 'מדריכי קומה', signCustom: 'שלטים מותאמים',
    signAuto: 'אוטומטי',
    signDoorsHint: 'לכל חדר יש שלט דלת מוכן — אין מה להגדיר. פותחים את הכתובת על המסך שליד הדלת וזהו.',
    signFloorsHint: 'לכל קומה שיש בה מחלקות יש מדריך מוכן, לתלייה ליד המעליות.',
    signCustomHint: 'שלטים שהתוכן שלהם לא נגזר משום מקום אחר — חיצי הכוונה ולוחות הודעות. רק אלה צריכים הגדרה ידנית.',
    signNoCustom: 'אין שלטים מותאמים. שלטי הדלת ומדריכי הקומה למעלה עובדים בלי זה.',
    signLook: 'מראה השלט', signThemeLight: 'בהיר', signThemeDark: 'כהה',
    signLandscape: 'לרוחב', signPortrait: 'לאורך',
    roomDoctor: 'הרופא שנמצא בחדר',
    roomDoctorHint: 'מופיע מיד על שלט הדלת וגובר על לוח המשמרות. השאירו ריק כדי שהשלט יחזור ללכת לפי השיבוצים.',
    roomDoctorNone: '— לפי לוח המשמרות —',
    installApp: 'התקנה כאפליקציה', installDone: 'Medical Sign הותקן במחשב',
    installHint: 'המערכת תיפתח בחלון משלה, עם סמל משלה בתפריט התחל ובשורת המשימות.',
    dayNames: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
    dayShort: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
    typeDoor: 'שלט דלת', typeDirectory: 'מדריך קומה', typeWayfinding: 'שילוט הכוונה', typeNotice: 'לוח הודעות',
    scopeGlobal: 'כל השלטים', scopeDept: 'מחלקה', scopeRoom: 'חדר',
    levelInfo: 'מידע', levelWarn: 'אזהרה', levelAlert: 'התראה',
    rtExam: 'חדר בדיקות', rtClinic: 'מרפאה', rtProc: 'חדר טיפולים', rtOffice: 'משרד', rtWait: 'המתנה',
    directions: 'כיווני הכוונה', addDirection: 'הוספת שורה', arrow: 'חץ',
    fDepartment: 'מחלקה', fRoom: 'חדר', fDoctor: 'רופא',
    navUsers: 'משתמשים', uPending: 'ממתין לאישור', uActive: 'פעיל', uSuspended: 'מושהה',
    uApprove: 'אישור', uSuspend: 'השעיה', uReactivate: 'החזרה לפעילות', uNewCode: 'קוד חדש',
    uRoleStaff: 'צוות', uRoleAdmin: 'מנהל', uMakeAdmin: 'הפיכה למנהל', uMakeStaff: 'הפיכה לצוות',
    uName: 'שם מלא', uPhone: 'טלפון', uId: 'תעודת זהות', uStatus: 'סטטוס', uRole: 'הרשאה',
    uLastLogin: 'כניסה אחרונה', uCreated: 'נרשם', uNever: 'טרם נכנס',
    uPendingTitle: 'ממתינים לאישור', uNoUsers: 'אין משתמשים רשומים',
    uCodeIssued: 'קוד חדש הונפק', uMasterOnly: 'פעולה זו דורשת את קוד הגיבוי',
    uNoPending: 'אין בקשות הממתינות לאישור', uWaiting: 'בקשות הצטרפות',
    myAccount: 'החשבון שלי', myDetails: 'הפרטים שלי', myCode: 'הקוד האישי שלי',
    biBuiltin: 'חשבון מובנה', biTitle: 'מנהל מערכת (קוד גיבוי)',
    biWhat: 'כניסה זו אינה שייכת לאדם מסוים — היא חשבון־על מובנה שנפתח עם קוד הגיבוי, ללא הרשמה.',
    biCan: 'הרשאות מלאות בכל המערכת',
    biList1: 'כל נתוני השילוט: מחלקות, חדרים, רופאים, שיבוצים, שלטים והודעות',
    biList2: 'ניהול משתמשים: אישור, השעיה, מינוי מנהלים, הנפקת קודים ומחיקה',
    biList3: 'הגדרות בית החולים, גיבויים ושינוי קודי הגישה',
    biList4: 'תיבת דואר בשם "מנהל מערכת" — אפשר לשלוח אליה ולקבל ממנה',
    biWarn: 'שימו לב: זהו קוד משותף ולא אדם. פעולות שנעשות איתו נרשמות ביומן בשם "מנהל מערכת" ולא על שם מי שביצע אותן. לעבודה יומיומית עדיף חשבון אישי.',
    biCode: 'את קוד הגיבוי משנים למטה, בקטע "קודי גישה".',
    readOnly: 'צפייה בלבד', notYours: 'נכתב על ידי אחר',
    forgotWithNumber: 'שכחת את הקוד? אנא כתוב למספר הזה כדי לקבל קוד חדש:',
    forgotNoNumber: 'שכחת את הקוד? פנה למנהל המערכת כדי לקבל קוד חדש.',
    supportPhone: 'טלפון לפניות (מוצג במסך הכניסה)',
    supportPhoneHint: 'המספר שאליו פונים כשמישהו שוכח את הקוד שלו. אם השדה ריק, מוצגת הודעה כללית.',
    dNow: 'נמצא כעת', dOffice: 'טלפון משרד', floorShort: 'קומה',
    dRoomNow: 'חדר נוכחי', dRoomNowHint: 'נקבע ידנית וגובר על השיבוצים. השאירו ריק כדי לחזור ללוח המשמרות.',
    locManual: 'נקבע ידנית',
    navMail: 'יומן שלי', mInbox: 'דואר נכנס', mSent: 'נשלחו', mNew: 'הודעה חדשה',
    mTo: 'אל', mFrom: 'מאת', mSubject: 'נושא', mBody: 'תוכן ההודעה', mSend: 'שליחה',
    mEmpty: 'אין הודעות', mSentEmpty: 'לא שלחת עדיין הודעות', mUnread: 'חדש',
    mDone: 'סימון כבוצע', mDoneMark: 'בוצע', mUndone: 'ביטול סימון', mReply: 'תשובה',
    mSentOk: 'ההודעה נשלחה', mNoMailbox: 'תיבת דואר אישית קיימת רק לחשבון אישי. נכנסת עם קוד גיבוי או קוד משותף.',
    mPickPerson: 'בחר נמען', mReceived: 'התקבל', mHint: 'הודעות פנימיות בין אנשי הצוות — בקשות, משימות ועדכונים.',
    waitingLive: 'ממתין לאישור… הדף ייכנס אוטומטית ברגע שמנהל יאשר אותך',
    approvedNow: 'החשבון אושר. ברוך הבא!', accessRevoked: 'ההרשאה שלך הוסרה',
    curCode: 'הקוד הנוכחי', newCode: 'קוד חדש (6 ספרות לפחות)', repeatCode: 'אימות הקוד החדש',
    updateCode: 'עדכון הקוד', detailsSaved: 'הפרטים עודכנו', codeChanged: 'הקוד האישי עודכן',
    codeMismatch: 'הקודים אינם תואמים', noProfile: 'נכנסת עם קוד גיבוי או קוד משותף, ולכן אין חשבון אישי להצגה.',
    idNote: 'תעודת הזהות אינה ניתנת לשינוי. לתיקון פנו למנהל המערכת.',
    uApproved: 'המשתמש אושר', uRegistered: 'נרשם',
    legalTitle: 'מסמכים ומדיניות',
    legalHint: 'המסמכים נוצרים מתוך ההגדרות של המערכת, כך שהם תמיד תואמים למה שהמערכת באמת עושה. פתחו כל אחד כדי לקרוא.',
    legalPrivacy: 'מדיניות פרטיות', legalTerms: 'תנאי שימוש', legalA11y: 'הצהרת נגישות',
    legalUpdated: 'עודכן', legalPrint: 'הדפסה', legalOpen: 'פתיחה בחלון נפרד',
    legalNoCookies: 'האתר אינו משתמש בעוגיות ואינו טוען דבר מאתר חיצוני — ולכן אין כאן באנר אישור עוגיות.',
    legalLoading: 'טוען מסמכים…', skipToContent: 'דילוג לתוכן',
  },
  en: {
    loginSub: 'Digital signage management', enter: 'Sign in', lock: 'Lock', cancel: 'Cancel', save: 'Save',
    navDashboard: 'Overview', navNow: 'On duty now', navDepartments: 'Departments', navRooms: 'Rooms',
    navDoctors: 'Doctors', navAssignments: 'Assignments', navSigns: 'Signs', navMessages: 'Messages',
    navLog: 'Change log', navSettings: 'Settings', brandSub: 'Signage manager',
    add: 'Add', edit: 'Edit', del: 'Delete', search: 'Search...', none: 'Nothing here yet',
    confirmDel: 'Delete this record?', saved: 'Saved', deleted: 'Deleted', badPin: 'Wrong PIN',
    connected: '● Live', disconnected: '● Offline',
    statDepartments: 'Departments', statRooms: 'Rooms', statDoctors: 'Doctors', statSigns: 'Signs',
    statOnDuty: 'Doctors on duty now', statClosed: 'Closed rooms', statMessages: 'Active messages',
    onDutyNow: 'Happening now', recentChanges: 'Recent changes', quickSigns: 'Signs',
    openDisplay: 'Open sign', preview: 'Preview', copyLink: 'Copy link', print: 'Print',
    copied: 'Link copied', free: 'Free', noDoctor: 'No doctor assigned', until: 'until',
    statusOpen: 'Open', statusClosed: 'Closed', statusBreak: 'On break', statusEmerg: 'Emergency',
    quickStatus: 'Quick status change', roomStatuses: 'Room status',
    hospitalName: 'Hospital name', pinChange: 'Change PIN', backup: 'Back up now',
    backupDone: 'Backup saved', settingsSaved: 'Settings saved', screensHelp:
      'Each sign here is one screen hanging somewhere in the hospital - a tablet by a door, or a large screen in a corridor.',
    screensHelp2:
      'Set it up once: press "Open sign", drag the window onto the screen by the door and press F11 for full screen. From then on it updates itself with every change you make here - you never touch it again.',
    screensHelp3:
      'To set it up from another device (a tablet or a smart TV) press "Copy link" and paste the address into its browser.',
    signShowsNow: 'Showing now', signNobody: 'No doctor assigned',
    signDepts: 'departments', signDirections: 'directions', signActiveMsgs: 'active messages',
    signDoors: 'Door screens', signFloors: 'Floor directories', signCustom: 'Custom signs',
    signAuto: 'automatic',
    signDoorsHint: 'Every room already has a door screen - there is nothing to set up. Open its address on the screen by the door and you are done.',
    signFloorsHint: 'Every floor with departments on it already has a directory, ready to hang by the lifts.',
    signCustomHint: 'Signs whose content is not derived from anything else - wayfinding arrows and notice boards. Only these need setting up by hand.',
    signNoCustom: 'No custom signs. The door screens and floor directories above work without any.',
    signLook: 'Screen appearance', signThemeLight: 'Light', signThemeDark: 'Dark',
    signLandscape: 'Landscape', signPortrait: 'Portrait',
    roomDoctor: 'Doctor in this room',
    roomDoctorHint: 'Appears on the door screen straight away and overrides the roster. Leave empty and the screen goes back to following the assignments.',
    roomDoctorNone: '— follow the roster —',
    installApp: 'Install as app', installDone: 'Medical Sign installed',
    installHint: 'It will open in its own window, with its own icon in the Start menu and taskbar.',
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    typeDoor: 'Door sign', typeDirectory: 'Floor directory', typeWayfinding: 'Wayfinding', typeNotice: 'Notice board',
    scopeGlobal: 'All signs', scopeDept: 'Department', scopeRoom: 'Room',
    levelInfo: 'Info', levelWarn: 'Warning', levelAlert: 'Alert',
    rtExam: 'Exam room', rtClinic: 'Clinic', rtProc: 'Procedure', rtOffice: 'Office', rtWait: 'Waiting area',
    directions: 'Directions', addDirection: 'Add row', arrow: 'Arrow',
    fDepartment: 'Department', fRoom: 'Room', fDoctor: 'Doctor',
    navUsers: 'Users', uPending: 'Awaiting approval', uActive: 'Active', uSuspended: 'Suspended',
    uApprove: 'Approve', uSuspend: 'Suspend', uReactivate: 'Reactivate', uNewCode: 'New code',
    uRoleStaff: 'Staff', uRoleAdmin: 'Admin', uMakeAdmin: 'Make admin', uMakeStaff: 'Make staff',
    uName: 'Full name', uPhone: 'Phone', uId: 'ID number', uStatus: 'Status', uRole: 'Role',
    uLastLogin: 'Last sign-in', uCreated: 'Registered', uNever: 'Never signed in',
    uPendingTitle: 'Awaiting approval', uNoUsers: 'No users registered',
    uCodeIssued: 'New code issued', uMasterOnly: 'This action needs the master code',
    uNoPending: 'No requests waiting for approval', uWaiting: 'Join requests',
    myAccount: 'My account', myDetails: 'My details', myCode: 'My personal code',
    biBuiltin: 'Built-in account', biTitle: 'System administrator (master code)',
    biWhat: 'This sign-in does not belong to a person — it is a built-in super-account opened with the master code, with no registration.',
    biCan: 'Full permissions across the system',
    biList1: 'All signage data: departments, rooms, doctors, assignments, signs and messages',
    biList2: 'User management: approve, suspend, appoint admins, issue codes and delete',
    biList3: 'Hospital settings, backups and changing the access codes',
    biList4: 'A mailbox as "מנהל מערכת" — it can send and receive internal messages',
    biWarn: 'Note: this is a shared code, not a person. Actions taken with it are logged as "מנהל מערכת", not under whoever performed them. For day-to-day work a personal account is better.',
    biCode: 'Change the master code below, under "Access codes".',
    readOnly: 'View only', notYours: 'written by someone else',
    forgotWithNumber: 'Forgotten your code? Text this number to get a new one:',
    forgotNoNumber: 'Forgotten your code? Ask an administrator for a new one.',
    supportPhone: 'Contact number (shown on the login screen)',
    supportPhoneHint: 'Who to contact when somebody forgets their code. Left empty, a generic message is shown instead.',
    dNow: 'In room now', dOffice: 'Office phone', floorShort: 'Floor',
    dRoomNow: 'Current room', dRoomNowHint: 'Set by hand and overrides the schedule. Leave empty to go back to the roster.',
    locManual: 'set manually',
    navMail: 'My inbox', mInbox: 'Inbox', mSent: 'Sent', mNew: 'New message',
    mTo: 'To', mFrom: 'From', mSubject: 'Subject', mBody: 'Message', mSend: 'Send',
    mEmpty: 'No messages', mSentEmpty: 'You have not sent anything yet', mUnread: 'new',
    mDone: 'Mark as done', mDoneMark: 'Done', mUndone: 'Undo', mReply: 'Reply',
    mSentOk: 'Message sent', mNoMailbox: 'A personal inbox needs a personal account. You signed in with the master or shared code.',
    mPickPerson: 'Choose a recipient', mReceived: 'Received', mHint: 'Internal messages between staff — requests, tasks and updates.',
    waitingLive: 'Waiting for approval… you will be let in automatically',
    approvedNow: 'Account approved. Welcome!', accessRevoked: 'Your access was removed',
    curCode: 'Current code', newCode: 'New code (6+ digits)', repeatCode: 'Repeat new code',
    updateCode: 'Update code', detailsSaved: 'Details updated', codeChanged: 'Personal code updated',
    codeMismatch: 'The codes do not match', noProfile: 'You signed in with the master or shared code, so there is no personal account to show.',
    idNote: 'The ID number cannot be changed here. Ask an administrator to correct it.',
    uApproved: 'User approved', uRegistered: 'Registered',
    legalTitle: 'Documents & policy',
    legalHint: 'These are generated from the system settings, so they always match what the system actually does. Open one to read it.',
    legalPrivacy: 'Privacy notice', legalTerms: 'Terms of use', legalA11y: 'Accessibility statement',
    legalUpdated: 'Updated', legalPrint: 'Print', legalOpen: 'Open in its own window',
    legalNoCookies: 'The site sets no cookies and loads nothing from a third party — which is why there is no cookie banner.',
    legalLoading: 'Loading documents…', skipToContent: 'Skip to content',
  },
};

let lang = localStorage.getItem('medsign.lang') || 'he';
const t = (k) => (T[lang][k] !== undefined ? T[lang][k] : k);
const L = (item, base) => (lang === 'he' ? item?.[base + 'He'] || item?.[base + 'En'] : item?.[base + 'En'] || item?.[base + 'He']) || '';

/* ------------------------------------------------------------------ *
 * State + API
 * ------------------------------------------------------------------ */
let pin = sessionStorage.getItem('medsign.pin') || '';
let state = null;
let users = [];
let mail = { inbox: [], sent: [], unread: 0 };
let contacts = [];
let mailTab = 'inbox';
let view = localStorage.getItem('medsign.view') || 'dashboard';
let search = '';
let legal = null;   // privacy / terms / accessibility, fetched once from /api/legal

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
// Pasted codes drag along invisible direction marks (very easy when copying
// out of Hebrew text) and stray spaces - strip them before use.
const normCode = (v) => String(v ?? '').replace(/[\s\p{Cf}]/gu, '');

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function api(path, options = {}) {
  const res = await fetch('/api' + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', 'X-Admin-Pin': normCode(pin), ...(options.headers || {}) },
  });
  if (!res.ok) {
    let msg = res.status === 401 ? t('badPin') : 'Error ' + res.status;
    try { msg = (await res.json()).error || msg; } catch {}
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

function toast(msg, isError = false) {
  const el = document.createElement('div');
  el.className = 'toast' + (isError ? ' err' : '');
  el.textContent = msg;
  $('#toasts').append(el);
  setTimeout(() => el.remove(), 3200);
}

async function refresh() {
  state = await api('/state');
  if (state.me?.isAdmin) await loadUsers();
  if (state.me?.profile && view === 'mail') await loadMail();
  render();
}

/* ------------------------------------------------------------------ *
 * Lookups
 * ------------------------------------------------------------------ */
/* What a plain staff account may see and touch. Mirrors STAFF_WRITABLE on the
   server - the server is what actually enforces it; this just shapes the UI. */
const STAFF_VIEWS = ['messages', 'doctors', 'mail', 'settings'];
const STAFF_WRITABLE = ['messages'];

const isStaff = () => !!state.me && !state.me.isAdmin;
const canSee = (v) => !isStaff() || STAFF_VIEWS.includes(v);
const canEdit = (collection) => !isStaff() || STAFF_WRITABLE.includes(collection);

// Staff may only change the messages they wrote themselves; admins may change any.
const ownsRow = (collection, item) => {
  if (!isStaff() || collection !== 'messages') return true;
  const myId = state.me?.profile?.id;
  return !!myId && item.createdBy === myId;
};

const dept = (id) => state.departments.find((d) => d.id === id);
const room = (id) => state.rooms.find((r) => r.id === id);
const doc = (id) => state.doctors.find((d) => d.id === id);
const deptName = (id) => L(dept(id), 'name') || '—';
const roomLabel = (id) => { const r = room(id); return r ? `${r.number} · ${L(r, 'name')}` : '—'; };
const docName = (id) => { const d = doc(id); return d ? `${L(d, 'title')} ${L(d, 'name')}`.trim() : '—'; };

const ROOM_TYPES = () => [
  { value: 'exam', label: t('rtExam') }, { value: 'clinic', label: t('rtClinic') },
  { value: 'proc', label: t('rtProc') }, { value: 'office', label: t('rtOffice') },
  { value: 'wait', label: t('rtWait') },
];
const ROOM_STATUSES = () => [
  { value: 'open', label: t('statusOpen') }, { value: 'closed', label: t('statusClosed') },
  { value: 'break', label: t('statusBreak') }, { value: 'emergency', label: t('statusEmerg') },
];
// Door screens and floor directories are derived, so they are not on offer
// here - creating one by hand would produce a second address for something
// that already has one.
const CUSTOM_SIGN_TYPES = () => SIGN_TYPES().filter((x) => x.value === 'wayfinding' || x.value === 'notice');

const SIGN_TYPES = () => [
  { value: 'door', label: t('typeDoor') }, { value: 'directory', label: t('typeDirectory') },
  { value: 'wayfinding', label: t('typeWayfinding') }, { value: 'notice', label: t('typeNotice') },
];

const statusTag = (status) => {
  const cls = status === 'open' ? 'ok' : status === 'break' ? 'warn' : 'alert';
  const label = (ROOM_STATUSES().find((s) => s.value === status) || { label: status }).label;
  return `<span class="tag ${cls}"><i class="dot"></i>${esc(label)}</span>`;
};

/* ------------------------------------------------------------------ *
 * Collection schemas - drive both the tables and the forms
 * ------------------------------------------------------------------ */
const SCHEMAS = {
  departments: {
    title: () => t('navDepartments'),
    columns: () => [
      { h: lang === 'he' ? 'מחלקה' : 'Department', v: (d) => `<span class="dept-chip"><i style="background:${esc(d.color || '#94a3b8')}"></i><b>${esc(L(d, 'name'))}</b></span>` },
      { h: lang === 'he' ? 'אנגלית' : 'Hebrew', v: (d) => esc(lang === 'he' ? d.nameEn : d.nameHe) },
      { h: lang === 'he' ? 'קומה' : 'Floor', v: (d) => esc(d.floor) },
      { h: lang === 'he' ? 'אגף' : 'Wing', v: (d) => esc(d.wing || '') },
      { h: lang === 'he' ? 'טלפון' : 'Phone', v: (d) => `<span class="mono">${esc(d.phone || '')}</span>` },
      { h: lang === 'he' ? 'שעות' : 'Hours', v: (d) => esc(L(d, 'hours')) },
    ],
    fields: () => [
      { key: 'nameHe', label: 'שם המחלקה (עברית)', type: 'text', required: true },
      { key: 'nameEn', label: 'Department name (English)', type: 'text' },
      { key: 'floor', label: lang === 'he' ? 'קומה' : 'Floor', type: 'number' },
      { key: 'wing', label: lang === 'he' ? 'אגף' : 'Wing', type: 'text' },
      { key: 'color', label: lang === 'he' ? 'צבע זיהוי' : 'Colour', type: 'color' },
      { key: 'phone', label: lang === 'he' ? 'טלפון' : 'Phone', type: 'text' },
      { key: 'hoursHe', label: 'שעות קבלה (עברית)', type: 'text' },
      { key: 'hoursEn', label: 'Opening hours (English)', type: 'text' },
    ],
  },

  rooms: {
    title: () => t('navRooms'),
    columns: () => [
      { h: lang === 'he' ? 'מספר' : 'Number', v: (r) => `<b>${esc(r.number)}</b>` },
      { h: lang === 'he' ? 'שם' : 'Name', v: (r) => esc(L(r, 'name')) },
      { h: t('navDepartments'), v: (r) => { const d = dept(r.departmentId); return d ? `<span class="dept-chip"><i style="background:${esc(d.color)}"></i>${esc(L(d, 'name'))}</span>` : '—'; } },
      { h: lang === 'he' ? 'קומה' : 'Floor', v: (r) => esc(r.floor) },
      { h: lang === 'he' ? 'סוג' : 'Type', v: (r) => esc((ROOM_TYPES().find((x) => x.value === r.type) || {}).label || r.type || '') },
      { h: lang === 'he' ? 'סטטוס' : 'Status', v: (r) => statusTag(r.status || 'open') },
      { h: lang === 'he' ? 'הערה' : 'Note', v: (r) => esc(L(r, 'note')) },
    ],
    fields: () => [
      { key: 'number', label: lang === 'he' ? 'מספר חדר' : 'Room number', type: 'text', required: true },
      { key: 'departmentId', label: t('fDepartment'), type: 'select', options: () => state.departments.map((d) => ({ value: d.id, label: L(d, 'name') })) },
      /* Putting a doctor in a room is the thing people open this form to do.
         It writes the doctor's currentRoomId - the same manual pin the
         doctors screen sets - so there is one mechanism, not two. */
      { key: '_doctorId', label: t('roomDoctor'), type: 'select', full: true,
        hint: t('roomDoctorHint'), blankLabel: t('roomDoctorNone'),
        value: (item) => (item ? (state.doctors.find((d) => d.currentRoomId === item.id)?.id || '') : ''),
        options: () => state.doctors.filter((d) => d.active !== false)
          .map((d) => ({ value: d.id, label: `${L(d, 'title')} ${L(d, 'name')}`.trim() })) },
      { key: 'nameHe', label: 'שם החדר (עברית)', type: 'text' },
      { key: 'nameEn', label: 'Room name (English)', type: 'text' },
      { key: 'floor', label: lang === 'he' ? 'קומה' : 'Floor', type: 'number' },
      { key: 'type', label: lang === 'he' ? 'סוג' : 'Type', type: 'select', options: ROOM_TYPES },
      { key: 'status', label: lang === 'he' ? 'סטטוס' : 'Status', type: 'select', options: ROOM_STATUSES },
      { key: 'noteHe', label: 'הערה לשלט (עברית)', type: 'text' },
      { key: 'noteEn', label: 'Sign note (English)', type: 'text' },
      // the door screen is derived from this room, so its look lives here
      { key: 'theme', label: t('signLook'), type: 'select', default: 'light',
        options: () => [{ value: 'light', label: t('signThemeLight') }, { value: 'dark', label: t('signThemeDark') }] },
      { key: 'orientation', label: lang === 'he' ? 'כיוון המסך' : 'Screen orientation', type: 'select', default: 'landscape',
        options: () => [{ value: 'landscape', label: t('signLandscape') }, { value: 'portrait', label: t('signPortrait') }] },
    ],
  },

  doctors: {
    title: () => t('navDoctors'),
    columns: () => [
      // name and specialty read as one thing - no reason to split them apart
      { h: t('navDoctors'), v: (d) => `<b>${esc(L(d, 'title'))} ${esc(L(d, 'name'))}</b>
          ${L(d, 'specialty') ? `<div class="muted small">${esc(L(d, 'specialty'))}</div>` : ''}` },
      { h: t('fDepartment'), v: (d) => { const dep = dept(d.departmentId); return dep
          ? `<span class="dept-chip"><i style="background:${esc(dep.color || '#94a3b8')}"></i>${esc(L(dep, 'name'))}</span>`
          : '<span class="muted">—</span>'; } },
      { h: t('dNow'), v: (d) => {
          const loc = state.doctorNow?.[d.id];
          return loc
            ? `<span class="loc-pill${loc.manual ? ' manual' : ''}" title="${esc(loc.manual ? t('locManual') : '')}">
                 ${loc.manual ? '<span class="pin">📌</span>' : ''}<b>${esc(loc.number)}</b>${esc(t('floorShort'))} ${esc(loc.floor)}
               </span>`
            : '<span class="muted">—</span>';
        } },
      { h: t('dOffice'), v: (d) => (d.officePhone
          ? `<a class="mono phone" href="tel:${esc(String(d.officePhone).replace(/[^\d+]/g, ''))}">${esc(d.officePhone)}</a>`
          : '<span class="muted">—</span>') },
      { h: lang === 'he' ? 'רישיון' : 'License', v: (d) => `<span class="mono muted">${esc(d.license || '—')}</span>` },
      { h: lang === 'he' ? 'פעיל' : 'Active', v: (d) => (d.active === false
          ? `<span class="tag alert">${esc(lang === 'he' ? 'לא פעיל' : 'Inactive')}</span>`
          : '<span class="tag ok"><i class="dot"></i></span>') },
    ],
    fields: () => [
      { key: 'titleHe', label: 'תואר (עברית)', type: 'text', placeholder: 'ד"ר' },
      { key: 'titleEn', label: 'Title (English)', type: 'text', placeholder: 'Dr.' },
      { key: 'nameHe', label: 'שם מלא (עברית)', type: 'text', required: true },
      { key: 'nameEn', label: 'Full name (English)', type: 'text' },
      { key: 'specialtyHe', label: 'התמחות (עברית)', type: 'text' },
      { key: 'specialtyEn', label: 'Specialty (English)', type: 'text' },
      { key: 'departmentId', label: t('fDepartment'), type: 'select', options: () => state.departments.map((d) => ({ value: d.id, label: L(d, 'name') })) },
      { key: 'currentRoomId', label: t('dRoomNow'), type: 'select', hint: t('dRoomNowHint'),
        options: () => state.rooms
          .slice()
          .sort((a, b) => String(a.number).localeCompare(String(b.number), undefined, { numeric: true }))
          .map((r) => ({ value: r.id, label: `${r.number} · ${L(r, 'name')} (${t('floorShort')} ${r.floor})` })) },
      { key: 'officePhone', label: t('dOffice'), type: 'text', placeholder: '03-5551234' },
      { key: 'license', label: lang === 'he' ? 'מספר רישיון' : 'License no.', type: 'text' },
      { key: 'active', label: lang === 'he' ? 'פעיל' : 'Active', type: 'bool', default: true },
    ],
  },

  assignments: {
    title: () => t('navAssignments'),
    columns: () => [
      { h: t('navDoctors'), v: (a) => `<b>${esc(docName(a.doctorId))}</b>` },
      { h: t('navRooms'), v: (a) => esc(roomLabel(a.roomId)) },
      // The days column was the widest thing in the table and pushed everything
      // else sideways. The days themselves still live on the record and are
      // edited under "ימים בשבוע" - they are just not a column any more.
      { h: lang === 'he' ? 'שעות' : 'Hours', v: (a) => `<span class="mono">${esc(a.start)}–${esc(a.end)}</span>` },
      { h: lang === 'he' ? 'הערה' : 'Note', v: (a) => esc(L(a, 'note')) },
      { h: lang === 'he' ? 'פעיל' : 'Active', v: (a) => (a.active === false ? '<span class="tag">—</span>' : '<span class="tag ok"><i class="dot"></i>✓</span>') },
    ],
    fields: () => [
      { key: 'doctorId', label: t('fDoctor'), type: 'select', required: true, options: () => state.doctors.map((d) => ({ value: d.id, label: `${L(d, 'title')} ${L(d, 'name')}` })) },
      { key: 'roomId', label: t('fRoom'), type: 'select', required: true, options: () => state.rooms.map((r) => ({ value: r.id, label: `${r.number} · ${L(r, 'name')}` })) },
      { key: 'start', label: lang === 'he' ? 'משעה' : 'From', type: 'time', default: '08:00' },
      { key: 'end', label: lang === 'he' ? 'עד שעה' : 'To', type: 'time', default: '16:00' },
      { key: 'noteHe', label: 'הערה (עברית)', type: 'text' },
      { key: 'noteEn', label: 'Note (English)', type: 'text' },
      { key: 'active', label: lang === 'he' ? 'פעיל' : 'Active', type: 'bool', default: true },
    ],
  },

  signs: {
    title: () => t('navSigns'),
    fields: () => [
      { key: 'nameHe', label: 'שם השלט (עברית)', type: 'text', required: true },
      { key: 'nameEn', label: 'Sign name (English)', type: 'text' },
      { key: 'type', label: lang === 'he' ? 'סוג שלט' : 'Sign type', type: 'select', options: CUSTOM_SIGN_TYPES, default: 'wayfinding' },
      { key: 'targetId', label: lang === 'he' ? 'מוצג עבור' : 'Shows', type: 'target' },
      { key: 'theme', label: lang === 'he' ? 'ערכת צבע' : 'Theme', type: 'select', default: 'light',
        options: () => [{ value: 'light', label: lang === 'he' ? 'בהיר' : 'Light' }, { value: 'dark', label: lang === 'he' ? 'כהה' : 'Dark' }] },
      { key: 'orientation', label: lang === 'he' ? 'כיוון מסך' : 'Orientation', type: 'select', default: 'landscape',
        options: () => [{ value: 'landscape', label: lang === 'he' ? 'לרוחב' : 'Landscape' }, { value: 'portrait', label: lang === 'he' ? 'לאורך' : 'Portrait' }] },
      { key: 'directions', label: t('directions'), type: 'directions', full: true },
    ],
  },

  messages: {
    title: () => t('navMessages'),
    columns: () => [
      { h: lang === 'he' ? 'הודעה' : 'Message', v: (m) => `<b>${esc(L(m, 'text'))}</b>` },
      { h: lang === 'he' ? 'היקף' : 'Scope', v: (m) => esc(m.scope === 'global' ? t('scopeGlobal') : m.scope === 'department' ? `${t('scopeDept')}: ${deptName(m.targetId)}` : `${t('scopeRoom')}: ${roomLabel(m.targetId)}`) },
      { h: lang === 'he' ? 'רמה' : 'Level', v: (m) => `<span class="tag ${m.level === 'alert' ? 'alert' : m.level === 'warn' ? 'warn' : ''}">${esc(m.level === 'alert' ? t('levelAlert') : m.level === 'warn' ? t('levelWarn') : t('levelInfo'))}</span>` },
      { h: lang === 'he' ? 'מוצג עד' : 'Shown until', v: (m) => (m.until
          ? esc(new Date(m.until).toLocaleString(lang === 'he' ? 'he-IL' : 'en-GB', { dateStyle: 'short', timeStyle: 'short' }))
          : `<span class="muted">${esc(lang === 'he' ? 'ללא הגבלה' : 'no limit')}</span>`) },
      { h: lang === 'he' ? 'נכתב על ידי' : 'Written by', v: (m) => (m.createdByName
          ? `${esc(m.createdByName)}${ownsRow('messages', m) && isStaff() ? ` <span class="tag ok">${esc(lang === 'he' ? 'שלי' : 'mine')}</span>` : ''}`
          : '<span class="muted">—</span>') },
      { h: lang === 'he' ? 'פעיל' : 'Active', v: (m) => (m.active === false ? '<span class="tag">—</span>' : '<span class="tag ok"><i class="dot"></i>✓</span>') },
    ],
    fields: () => [
      { key: 'textHe', label: 'טקסט ההודעה (עברית)', type: 'textarea', full: true, required: true },
      { key: 'textEn', label: 'Message text (English)', type: 'textarea', full: true },
      { key: 'scope', label: lang === 'he' ? 'היקף' : 'Scope', type: 'select', default: 'global',
        options: () => [{ value: 'global', label: t('scopeGlobal') }, { value: 'department', label: t('scopeDept') }, { value: 'room', label: t('scopeRoom') }] },
      { key: 'targetId', label: lang === 'he' ? 'יעד' : 'Target', type: 'msgtarget' },
      { key: 'level', label: lang === 'he' ? 'רמה' : 'Level', type: 'select', default: 'info',
        options: () => [{ value: 'info', label: t('levelInfo') }, { value: 'warn', label: t('levelWarn') }, { value: 'alert', label: t('levelAlert') }] },
      { key: 'active', label: lang === 'he' ? 'פעיל' : 'Active', type: 'bool', default: true },
      { key: 'from', label: lang === 'he' ? 'מוצג מ־' : 'Show from', type: 'datetime',
        hint: lang === 'he' ? 'ריק = מוצג מיד. בלי שעה: מתחילת היום.' : 'Empty = shown immediately. No time given: from the start of the day.' },
      { key: 'until', label: lang === 'he' ? 'מוצג עד' : 'Show until', type: 'datetime', endOfDay: true,
        hint: lang === 'he' ? 'ריק = מוצג עד שמכבים אותו. בלי שעה: עד סוף היום.' : 'Empty = shown until switched off. No time given: to the end of the day.' },
    ],
  },
};

/* ------------------------------------------------------------------ *
 * Time helpers
 * ------------------------------------------------------------------ */
const nowHHMM = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };

// every shift attached to a room, any day - used when nobody is in the room now
const roomRoster = (roomId) => state.assignments
  .filter((a) => a.active !== false && a.roomId === roomId)
  .sort((a, b) => (a.days?.[0] ?? 9) - (b.days?.[0] ?? 9) || a.start.localeCompare(b.start));

const daysShort = (days = []) => days.map((d) => t('dayShort')[d]).join('');
// mirrors runsOn() on the server: no days listed means the shift runs daily
const runsOn = (a, day) => !Array.isArray(a.days) || a.days.length === 0 || a.days.includes(day);

const roomCount = (n) => (n === 1
  ? (lang === 'he' ? 'חדר אחד' : '1 room')
  : `${n} ${lang === 'he' ? 'חדרים' : 'rooms'}`);

function currentAssignments() {
  const day = new Date().getDay(), time = nowHHMM();
  return state.assignments.filter((a) => a.active !== false && runsOn(a, day) && a.start <= time && time < a.end);
}

/* ------------------------------------------------------------------ *
 * Views
 * ------------------------------------------------------------------ */
function render() {
  if (!state) return;

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
  $('#langBtn').textContent = lang === 'he' ? 'EN' : 'עב';
  $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  $('#brandSub').textContent = t('brandSub');
  showInstallButton();

  const me = state.me || {};
  $('#whoami').textContent = me.name || '';
  $('#whoami').className = 'who' + (me.isMaster ? ' master' : '');
  $('#pendingBadge').textContent = state.pendingUsers ? String(state.pendingUsers) : '';
  $('#pendingBadge').classList.toggle('alert-badge', !!state.pendingUsers);
  // only admins manage people or codes
  $$('.nav-item').forEach((b) => { b.hidden = !canSee(b.dataset.view); });
  if (!me.profile) $$('.nav-item[data-view="mail"]').forEach((b) => { b.hidden = true; });
  const mailBadge = $('#mailBadge');
  if (mailBadge) {
    mailBadge.textContent = state.mailUnread ? String(state.mailUnread) : '';
    mailBadge.classList.toggle('alert-badge', !!state.mailUnread);
  }
  $$('.nav-sep').forEach((el) => { el.hidden = isStaff(); });
  if (!canSee(view)) view = isStaff() ? 'messages' : 'dashboard';

  $$('.nav-item').forEach((b) => b.classList.toggle('active', b.dataset.view === view));
  $$('[data-count]').forEach((el) => { el.textContent = (state[el.dataset.count] || []).length; });

  const titles = {
    dashboard: t('navDashboard'), now: t('navNow'), departments: t('navDepartments'),
    rooms: t('navRooms'), doctors: t('navDoctors'), assignments: t('navAssignments'),
    signs: t('navSigns'), messages: t('navMessages'), mail: t('navMail'), users: t('navUsers'), log: t('navLog'), settings: t('navSettings'),
  };
  $('#viewTitle').textContent = titles[view] || '';
  $('#viewSub').textContent = lang === 'he' ? state.settings.hospitalNameHe : state.settings.hospitalNameEn;

  const el = $('#view');
  if (view === 'dashboard') el.innerHTML = viewDashboard();
  else if (view === 'now') el.innerHTML = viewNow();
  else if (view === 'signs') el.innerHTML = viewSigns();
  else if (view === 'mail') el.innerHTML = viewMail();
  else if (view === 'users') el.innerHTML = viewUsers();
  else if (view === 'log') el.innerHTML = viewLog();
  else if (view === 'settings') el.innerHTML = viewSettings();
  else el.innerHTML = viewCollection(view);

  wireView();
}

function viewDashboard() {
  const s = state.stats;
  const cards = [
    ['statOnDuty', s.onDuty, 'accent'], ['statRooms', s.rooms], ['statDoctors', s.doctors],
    ['statDepartments', s.departments], ['statSigns', s.signs],
    ['statClosed', s.closedRooms], ['statMessages', s.activeMessages],
  ].map(([k, v]) => `<div class="stat"><div class="k">${esc(t(k))}</div><div class="v">${esc(v)}</div></div>`).join('');

  // outside clinic hours nothing is "current" - fall back to today's full schedule
  const day = new Date().getDay();
  const todays = state.assignments
    .filter((a) => a.active !== false && runsOn(a, day))
    .sort((a, b) => a.start.localeCompare(b.start));
  const current = currentAssignments();
  const list = current.length ? current : todays;
  const note = current.length ? '' :
    `<div class="muted small" style="margin-bottom:8px">${esc(lang === 'he' ? 'אף רופא לא נמצא בחדר כרגע — להלן לוח היום:' : 'No doctor is in a room right now — today\'s schedule:')}</div>`;
  const cur = note + (list.slice(0, 8).map(rowNow).join('') || `<div class="empty">${esc(t('none'))}</div>`);

  // departments with their teams - the names, in one place
  const teams = state.departments.map((d) => {
    const docs = state.doctors.filter((x) => x.departmentId === d.id && x.active !== false);
    const rooms = state.rooms.filter((r) => r.departmentId === d.id);
    return `<div class="team">
      <div class="team-head"><i style="background:${esc(d.color || '#94a3b8')}"></i>
        <b>${esc(L(d, 'name'))}</b>
        <span class="muted small">${esc(lang === 'he' ? 'קומה' : 'Floor')} ${esc(d.floor)} · ${esc(roomCount(rooms.length))}</span></div>
      <div class="team-docs">${docs.map((x) =>
        `<span class="tag">${esc(L(x, 'title'))} ${esc(L(x, 'name'))}</span>`).join(' ') ||
        `<span class="muted small">${esc(lang === 'he' ? 'לא שויכו רופאים' : 'No doctors assigned')}</span>`}</div>
    </div>`;
  }).join('');

  const log = (state.log || []).slice(0, 8).map(logItem).join('') || `<div class="empty">${esc(t('none'))}</div>`;

  // people waiting to be let in - admins see and clear this from the overview
  const waiting = (state.me?.isAdmin ? users.filter((u) => u.status === 'pending') : []);
  const waitingCard = waiting.length ? `<div class="card card-attention" style="margin-top:18px">
    <div class="card-head"><h2>⏳ ${esc(t('uWaiting'))} (${waiting.length})</h2><div class="spacer"></div>
      <button class="btn sm" data-goto="users">${esc(t('navUsers'))} →</button></div>
    <div class="card-body">${waiting.map((u) => `<div class="now-row">
      <div class="g">
        <div class="t">${esc(u.fullName)}</div>
        <div class="muted small"><span class="mono">${esc(u.phone)}</span> · ${esc(t('uId'))} <span class="mono">${esc(u.nationalId)}</span> · ${esc(t('uRegistered'))} ${new Date(u.createdAt).toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-GB')}</div>
      </div>
      <button class="btn sm primary" data-user-status="active" data-user="${esc(u.id)}">${esc(t('uApprove'))}</button>
      <button class="btn sm danger" data-user-status="suspended" data-user="${esc(u.id)}">${esc(t('uSuspend'))}</button>
    </div>`).join('')}</div>
  </div>` : '';

  return `
    <div class="stat-grid">${cards}</div>
    ${waitingCard}
    <div class="card" style="margin-top:18px">
      <div class="card-head"><h2>${esc(t('onDutyNow'))}</h2><div class="spacer"></div>
        <button class="btn sm" data-goto="now">${esc(t('navNow'))} →</button></div>
      <div class="card-body">${cur}</div>
    </div>
    <div class="card">
      <div class="card-head"><h2>${esc(lang === 'he' ? 'מחלקות וצוות' : 'Departments & team')}</h2><div class="spacer"></div>
        <button class="btn sm" data-goto="departments">${esc(t('navDepartments'))} →</button>
        <button class="btn sm" data-goto="doctors">${esc(t('navDoctors'))} →</button></div>
      <div class="card-body">${teams || `<div class="empty">${esc(t('none'))}</div>`}</div>
    </div>
    <div class="card">
      <div class="card-head"><h2>${esc(t('recentChanges'))}</h2></div>
      <div class="card-body">${log}</div>
    </div>`;
}

function rowNow(a) {
  const r = room(a.roomId);
  return `<div class="now-row">
    <div class="rn">${esc(r ? r.number : '?')}</div>
    <div class="g">
      <div class="t">${esc(docName(a.doctorId))}</div>
      <div class="muted small">${esc(r ? L(r, 'name') : '')} · ${esc(r ? deptName(r.departmentId) : '')}</div>
    </div>
    <div class="mono muted">${esc(a.start)}–${esc(a.end)}</div>
  </div>`;
}

/* One doctor, rendered the same way whatever the reason they are listed.
   This column used to have four shapes in it: bold name over the hours when
   somebody was in, the same with a label in front for later today, and then
   the roster fallback in muted small with the hours inline - so the names
   changed size and weight down the column depending on the time of day. */
function whoLine(name, when, tone = '') {
  return `<div class="who${tone ? ' ' + tone : ''}">
    <b class="who-name">${esc(name)}</b>
    ${when ? `<span class="who-when">${when}</span>` : ''}
  </div>`;
}

function whoIsIn(r, a, next, day) {
  const hours = (x) => `<span class="mono">${esc(x.start)}–${esc(x.end)}</span>`;

  // placed by hand: outranks the roster here exactly as it does on the sign
  const pinned = state.doctors.filter((d) => d.currentRoomId === r.id && d.active !== false);
  if (pinned.length) {
    return pinned.map((d) => whoLine(`${L(d, 'title')} ${L(d, 'name')}`.trim(),
      `<span class="tag">${esc(t('locManual'))}</span>`)).join('');
  }

  if (a) return whoLine(docName(a.doctorId), hours(a), 'is-now');

  if (next) {
    return whoLine(docName(next.doctorId),
      `${hours(next)} · ${esc(lang === 'he' ? 'היום בהמשך' : 'later today')}`, 'is-soon');
  }

  const roster = roomRoster(r.id);
  if (roster.length) {
    return roster.slice(0, 3).map((x) => whoLine(docName(x.doctorId), hours(x), 'is-roster')).join('')
      + (roster.length > 3 ? `<div class="who-more">+${roster.length - 3}</div>` : '');
  }

  return `<span class="muted">${esc(t('noDoctor'))}</span>`;
}

function viewNow() {
  const day = new Date().getDay();
  const current = currentAssignments();
  const byRoom = new Map(current.map((a) => [a.roomId, a]));

  const rows = state.rooms
    .slice()
    .sort((a, b) => String(a.number).localeCompare(String(b.number), undefined, { numeric: true }))
    .map((r) => {
      const a = byRoom.get(r.id);
      const next = state.assignments
        .filter((x) => x.active !== false && x.roomId === r.id && runsOn(x, day) && x.start > nowHHMM())
        .sort((x, y) => x.start.localeCompare(y.start))[0];
      return `<tr>
        <td data-label="${esc(lang === 'he' ? 'חדר' : 'Room')}"><b>${esc(r.number)}</b></td>
        <td data-label="${esc(lang === 'he' ? 'שם' : 'Name')}">${esc(L(r, 'name'))}<div class="muted small">${esc(deptName(r.departmentId))}</div></td>
        <td data-label="${esc(lang === 'he' ? 'רופא עכשיו' : 'Doctor now')}">${whoIsIn(r, a, next, day)}</td>
        <td data-label="${esc(lang === 'he' ? 'סטטוס' : 'Status')}">${statusTag(r.status || 'open')}</td>
        <td class="actions">
          ${ROOM_STATUSES().map((s) => `<button class="btn sm ${r.status === s.value ? 'primary' : ''}" data-status="${esc(s.value)}" data-room="${esc(r.id)}">${esc(s.label)}</button>`).join(' ')}
        </td>
      </tr>`;
    }).join('');

  return `<div class="card">
    <div class="card-head"><h2>${esc(t('roomStatuses'))} · ${esc(t('dayNames')[day])} ${esc(nowHHMM())}</h2>
      <div class="spacer"></div><span class="muted small">${esc(t('quickStatus'))}</span></div>
    <div class="table-wrap"><table>
      <thead><tr>
        <th>${lang === 'he' ? 'חדר' : 'Room'}</th><th>${lang === 'he' ? 'שם' : 'Name'}</th>
        <th>${lang === 'he' ? 'רופא עכשיו' : 'Doctor now'}</th><th>${lang === 'he' ? 'סטטוס' : 'Status'}</th><th></th>
      </tr></thead>
      <tbody>${rows || `<tr><td colspan="5"><div class="empty">${esc(t('none'))}</div></td></tr>`}</tbody>
    </table></div>
  </div>`;
}

function viewCollection(name) {
  const schema = SCHEMAS[name];
  const cols = schema.columns();
  const q = search.trim().toLowerCase();
  const items = state[name].filter((it) => !q || JSON.stringify(it).toLowerCase().includes(q)
    || (it.departmentId && deptName(it.departmentId).toLowerCase().includes(q))
    || (it.doctorId && docName(it.doctorId).toLowerCase().includes(q))
    || (it.roomId && roomLabel(it.roomId).toLowerCase().includes(q)));

  const editable = canEdit(name);
  const rows = items.map((it) => `<tr>
    ${cols.map((c) => `<td data-label="${esc(c.h)}">${c.v(it)}</td>`).join('')}
    ${editable && ownsRow(name, it) ? `<td class="actions">
      <button class="btn sm" data-edit="${esc(it.id)}">${esc(t('edit'))}</button>
      <button class="btn sm danger" data-del="${esc(it.id)}">${esc(t('del'))}</button>
    </td>` : `<td class="actions">${editable
        ? `<span class="muted small">${esc(t('notYours'))}</span>` : ''}</td>`}</tr>`).join('');

  return `<div class="card">
    <div class="card-head">
      <div class="toolbar" style="flex:1">
        <input class="input grow" id="searchBox" placeholder="${esc(t('search'))}" value="${esc(search)}">
        ${editable
          ? `<button class="btn primary" data-add="${esc(name)}">+ ${esc(t('add'))}</button>`
          : `<span class="tag">${esc(t('readOnly'))}</span>`}
      </div>
    </div>
    <div class="table-wrap"><table>
      <thead><tr>${cols.map((c) => `<th>${esc(c.h)}</th>`).join('')}<th></th></tr></thead>
      <tbody>${rows || `<tr><td colspan="${cols.length + 1}"><div class="empty">${esc(t('none'))}</div></td></tr>`}</tbody>
    </table></div>
  </div>`;
}

const SIGN_ICON = { door: '▭', directory: '▤', wayfinding: '➜', notice: '✱' };

/* What this screen has on it at this moment. A sign is an abstraction until
   you can see that one says "ד"ר אבי כהן" and another says nobody is in. */
function signShowing(s) {
  if (s.type === 'door') {
    const day = new Date().getDay();
    const time = nowHHMM();
    // a hand-placed doctor wins, exactly as the sign now resolves it
    const pinned = state.doctors.filter((d) => d.currentRoomId === s.targetId && d.active !== false);
    if (pinned.length) return pinned.map((d) => `${L(d, 'title')} ${L(d, 'name')}`.trim()).join(', ');
    const here = state.assignments.filter((a) => a.active !== false && a.roomId === s.targetId
      && runsOn(a, day) && a.start <= time && time < a.end);
    if (here.length) return here.map((a) => docName(a.doctorId)).join(', ');
    const r = room(s.targetId);
    if (r && r.status && r.status !== 'open') {
      return (ROOM_STATUSES().find((x) => x.value === r.status) || {}).label || '';
    }
    return t('signNobody');
  }
  if (s.type === 'directory') {
    const n = state.departments.filter((d) => Number(d.floor) === Number(s.targetId)).length;
    return `${n} ${t('signDepts')}`;
  }
  if (s.type === 'wayfinding') return `${(s.directions || []).length} ${t('signDirections')}`;
  if (s.type === 'notice') {
    const n = state.messages.filter((m) => m.active !== false).length;
    return `${n} ${t('signActiveMsgs')}`;
  }
  return '';
}

function signCard(s) {
  const url = `${location.origin}/display.html?sign=${s.id}`;
  const typeLabel = (SIGN_TYPES().find((x) => x.value === s.type) || {}).label || s.type;
  let target = '—';
  if (s.type === 'door') target = roomLabel(s.targetId);
  else if (s.type === 'directory') target = (lang === 'he' ? 'קומה ' : 'Floor ') + s.targetId;
  else if (s.type === 'wayfinding') target = `${(s.directions || []).length} ${lang === 'he' ? 'כיוונים' : 'directions'}`;

  return `<div class="sign-card">
    <div class="top">
      <div class="type-ic">${SIGN_ICON[s.type] || '▭'}</div>
      <div style="min-width:0">
        <b class="sr-name-text">${esc(L(s, 'name'))}</b>
        <div class="muted small">${esc(typeLabel)} · ${esc(target)}</div>
      </div>
    </div>
    <div class="showing">
      <span class="pk">${esc(t('signShowsNow'))}</span>
      <b>${esc(signShowing(s))}</b>
    </div>
    <div class="foot">
      <button class="btn sm" data-edit="${esc(s.id)}">${esc(t('edit'))}</button>
      <button class="btn sm danger" data-del="${esc(s.id)}">${esc(t('del'))}</button>
    </div>
  </div>`;
}

/* One line per room or floor. There can be a lot of them and they need no
   settings, so they are a compact row rather than a card. */
/* The name itself is the link to the screen. Three text buttons repeated
   down every row was most of the noise, and "open sign" next to "copy link"
   never said which one you wanted. A link reads as a link, and the browser's
   own right-click still offers to copy its address. */
function screenRow(name, sub, showing, url, actions = '') {
  return `<div class="screen-row">
    <div class="sr-name">
      <b class="sr-name-text">${esc(name)}</b>
      <span class="muted small">${esc(sub)}</span>
    </div>
    <div class="sr-showing"><span class="pk">${esc(t('signShowsNow'))}</span> <b>${esc(showing)}</b></div>
    <div class="sr-act">${actions}</div>
  </div>`;
}

function doorScreens() {
  const rooms = [...state.rooms].sort((a, b) => String(a.number).localeCompare(String(b.number), 'he', { numeric: true }));
  if (!rooms.length) return `<div class="empty">${esc(t('none'))}</div>`;
  return rooms.map((r) => screenRow(
    `${r.number} · ${L(r, 'name')}`,
    `${t('floorShort')} ${r.floor ?? '—'}${r.departmentId ? ' · ' + deptName(r.departmentId) : ''}`,
    signShowing({ type: 'door', targetId: r.id }),
    `${location.origin}/display.html?room=${encodeURIComponent(r.number)}`,
    // the screen is the room, so editing one means editing the other
    `<button class="btn sm" data-edit-room="${esc(r.id)}">${esc(t('edit'))}</button>
     <button class="btn sm danger" data-del-room="${esc(r.id)}">${esc(t('del'))}</button>`,
  )).join('');
}

function floorScreens() {
  const floors = [...new Set(state.departments.map((d) => Number(d.floor)).filter((n) => Number.isFinite(n)))].sort((a, b) => a - b);
  if (!floors.length) return `<div class="empty">${esc(t('none'))}</div>`;
  return floors.map((f) => screenRow(
    `${t('floorShort')} ${f}`,
    state.departments.filter((d) => Number(d.floor) === f).map((d) => L(d, 'name')).join(' · '),
    signShowing({ type: 'directory', targetId: f }),
    `${location.origin}/display.html?floor=${f}`,
  )).join('');
}

function viewSigns() {
  const custom = state.signs;

  return `<div class="card">
    <div class="card-head"><h2>${esc(t('navSigns'))}</h2></div>
    <div class="card-body">
      <div class="notice" style="margin:0">
        <b>${esc(t('screensHelp'))}</b>
        <div style="margin-top:6px">${esc(t('screensHelp2'))}</div>
        <div class="muted small" style="margin-top:6px">${esc(t('screensHelp3'))}</div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-head">
      <h2>${esc(t('signDoors'))}</h2>
      <span class="tag ok"><i class="dot"></i>${esc(t('signAuto'))}</span>
      <div class="spacer"></div>
      <span class="muted small">${state.rooms.length}</span>
    </div>
    <div class="card-body">
      <p class="muted small" style="margin-top:0">${esc(t('signDoorsHint'))}</p>
      <div class="screen-list">${doorScreens()}</div>
    </div>
  </div>

  <div class="card">
    <div class="card-head">
      <h2>${esc(t('signFloors'))}</h2>
      <span class="tag ok"><i class="dot"></i>${esc(t('signAuto'))}</span>
    </div>
    <div class="card-body">
      <p class="muted small" style="margin-top:0">${esc(t('signFloorsHint'))}</p>
      <div class="screen-list">${floorScreens()}</div>
    </div>
  </div>

  <div class="card">
    <div class="card-head">
      <h2>${esc(t('signCustom'))}</h2><div class="spacer"></div>
      <button class="btn primary" data-add="signs">+ ${esc(t('add'))}</button>
    </div>
    <div class="card-body">
      <p class="muted small" style="margin-top:0">${esc(t('signCustomHint'))}</p>
      <div class="sign-grid">${custom.map(signCard).join('') || `<div class="empty">${esc(t('signNoCustom'))}</div>`}</div>
    </div>
  </div>`;
}

function logItem(l) {
  const icon = { create: '＋', update: '✎', delete: '✕' }[l.action] || '·';
  return `<div class="log-item">
    <span class="when">${new Date(l.at).toLocaleString(lang === 'he' ? 'he-IL' : 'en-GB')}</span>
    <span class="what">${esc(icon)} <b>${esc(l.entity)}</b> — ${esc(l.summary || '')}${
      l.actor ? ` <span class="by">· ${esc(l.actor)}</span>` : ''}</span>
  </div>`;
}

function viewLog() {
  return `<div class="card"><div class="card-head"><h2>${esc(t('navLog'))}</h2></div>
    <div class="card-body">${(state.log || []).map(logItem).join('') || `<div class="empty">${esc(t('none'))}</div>`}</div></div>`;
}

/* ------------------------------------------------------------------ *
 * Installing as a Windows app
 *
 * Chrome only offers its own install button in a window that has an
 * address bar, and the launcher opens this without one - so the offer was
 * never visible. Catch the event ourselves and put the button where it
 * can actually be seen.
 * ------------------------------------------------------------------ */
let installPrompt = null;

// already running as an installed app? then there is nothing to offer
const isInstalled = () => window.matchMedia('(display-mode: standalone)').matches
  || window.matchMedia('(display-mode: window-controls-overlay)').matches
  || window.navigator.standalone === true;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();          // keep Chrome's own mini-bar out of the way
  installPrompt = e;
  showInstallButton();
});

window.addEventListener('appinstalled', () => {
  installPrompt = null;
  const b = $('#installBtn');
  if (b) b.hidden = true;
  toast(t('installDone'));
});

function showInstallButton() {
  const b = $('#installBtn');
  if (!b || isInstalled() || !installPrompt) return;
  b.textContent = '⊕ ' + t('installApp');
  b.title = t('installHint');
  b.hidden = false;
  b.onclick = async () => {
    if (!installPrompt) return;
    b.disabled = true;
    try {
      installPrompt.prompt();
      await installPrompt.userChoice;
    } finally {
      installPrompt = null;
      b.disabled = false;
      b.hidden = true;
    }
  };
}

/* ------------------------------------------------------------------ *
 * Privacy notice / terms / accessibility statement
 *
 * Public endpoint - no code needed - because somebody has to be able to
 * read what the system collects before they hand over their details.
 * ------------------------------------------------------------------ */
async function loadLegal() {
  if (legal) return legal;
  try {
    legal = await (await fetch('/api/legal', { cache: 'no-store' })).json();
  } catch {
    legal = null;
  }
  return legal;
}

function legalSection(sec) {
  const paras = (sec.p || []).map((x) => `<p>${esc(x)}</p>`).join('');
  const items = (sec.list || []).map((x) => `<li>${esc(x)}</li>`).join('');
  const after = (sec.after || []).map((x) => `<p>${esc(x)}</p>`).join('');
  return `<section>
    <h4>${esc(sec.h)}</h4>
    ${paras}
    ${items ? `<ul>${items}</ul>` : ''}
    ${after}
  </section>`;
}

function legalDoc(key, doc) {
  if (!doc) return '';
  return `<details class="doc" data-doc="${esc(key)}">
    <summary>
      <h3 class="doc-name">${esc(doc.title)}</h3>
      <span class="muted small">${esc(t('legalUpdated'))} ${esc(doc.updated)}</span>
    </summary>
    <div class="doc-body">
      <p class="doc-intro">${esc(doc.intro)}</p>
      ${(doc.sections || []).map(legalSection).join('')}
      <div class="doc-actions">
        <button class="btn sm" data-print-doc="${esc(key)}">${esc(t('legalPrint'))}</button>
      </div>
    </div>
  </details>`;
}

function legalCard() {
  const docs = legal?.[lang];
  const body = docs
    ? legalDoc('privacy', docs.privacy) + legalDoc('terms', docs.terms) + legalDoc('accessibility', docs.accessibility)
    : `<div class="empty">${esc(t('legalLoading'))}</div>`;

  return `<div class="card">
    <div class="card-head"><h2>📄 ${esc(t('legalTitle'))}</h2></div>
    <div class="card-body">
      <p class="muted small" style="margin-top:0">${esc(t('legalHint'))}</p>
      ${body}
      <p class="muted small" style="margin-bottom:0">${esc(t('legalNoCookies'))}</p>
    </div>
  </div>`;
}

/* Opens one document on its own printable page - what you hand to a
   procurement officer who asks for the privacy notice as a document. */
function printLegal(key) {
  const doc = legal?.[lang]?.[key];
  if (!doc) return;
  const he = lang === 'he';
  const sec = (s) => `<h2>${esc(s.h)}</h2>`
    + (s.p || []).map((x) => `<p>${esc(x)}</p>`).join('')
    + ((s.list || []).length ? `<ul>${(s.list || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '')
    + (s.after || []).map((x) => `<p>${esc(x)}</p>`).join('');

  const hospital = (he ? state?.settings?.hospitalNameHe : state?.settings?.hospitalNameEn) || '';
  const html = `<!doctype html><html lang="${he ? 'he' : 'en'}" dir="${he ? 'rtl' : 'ltr'}">
<head><meta charset="utf-8"><title>${esc(doc.title)}</title>
<style>
  body { font: 15px/1.7 system-ui, "Segoe UI", Arial, sans-serif; color: #14243a;
         max-width: 760px; margin: 40px auto; padding: 0 24px; }
  .head { border-bottom: 2px solid #0e7490; padding-bottom: 14px; margin-bottom: 26px; }
  .head .brand { color: #0e7490; font-weight: 700; letter-spacing: .02em; }
  h1 { font-size: 26px; margin: 8px 0 4px; }
  h2 { font-size: 17px; margin: 26px 0 8px; color: #0e7490; }
  p, li { margin: 8px 0; }
  ul { padding-inline-start: 22px; }
  .meta { color: #64748b; font-size: 13px; }
  .intro { font-size: 16px; color: #334155; }
  @media print { body { margin: 0; max-width: none; } .no-print { display: none; } }
</style></head>
<body>
  <div class="head">
    <div class="brand">Medical Sign${hospital ? ' · ' + esc(hospital) : ''}</div>
    <h1>${esc(doc.title)}</h1>
    <div class="meta">${esc(t('legalUpdated'))} ${esc(doc.updated)}</div>
  </div>
  <p class="intro">${esc(doc.intro)}</p>
  ${(doc.sections || []).map(sec).join('')}
  <div class="no-print" style="margin-top:32px;text-align:center">
    <button onclick="window.print()" style="font:inherit;padding:9px 20px;border-radius:8px;
      border:1px solid #0e7490;background:#0e7490;color:#fff;cursor:pointer">${esc(t('legalPrint'))}</button>
  </div>
  <script>
    // Fire the print dialog as soon as the fonts and layout have settled.
    // Written inline rather than called from the opener, because document.write
    // means load may already have happened by the time the opener gets control.
    window.addEventListener('load', function () {
      window.focus();
      setTimeout(function () { window.print(); }, 120);
    });
  <\/script>
</body></html>`;

  const w = window.open('', '_blank');
  if (!w) {
    // pop-ups blocked - say so instead of appearing to do nothing
    toast(lang === 'he'
      ? 'הדפדפן חסם את חלון ההדפסה. אפשרו חלונות קופצים לאתר הזה ונסו שוב.'
      : 'The browser blocked the print window. Allow pop-ups for this site and try again.', true);
    return;
  }
  w.document.write(html);
  w.document.close();
}

function viewSettings() {
  const he = lang === 'he';
  // a built-in identity has nothing personal to edit
  const p = state.me?.profile?.builtin ? null : state.me?.profile;

  const roleLabel = p ? (p.role === 'admin' ? t('uRoleAdmin') : t('uRoleStaff')) : '';
  const statusLabel = p ? { active: t('uActive'), pending: t('uPending'), suspended: t('uSuspended') }[p.status] : '';
  const fmt = (iso) => (iso ? new Date(iso).toLocaleString(he ? 'he-IL' : 'en-GB') : '—');

  const accountCard = p ? `<div class="card">
    <div class="card-head"><h2>👤 ${esc(t('myAccount'))}</h2><div class="spacer"></div>
      ${userStatusTag(p.status)}
      <span class="tag">${esc(roleLabel)}</span></div>
    <div class="card-body">
      <div class="profile-grid">
        <div><span class="pk">${esc(t('uId'))}</span><b class="mono">${esc(p.nationalId)}</b></div>
        <div><span class="pk">${esc(t('uCreated'))}</span><b>${esc(fmt(p.createdAt))}</b></div>
        <div><span class="pk">${esc(t('uLastLogin'))}</span><b>${p.lastLogin ? esc(fmt(p.lastLogin)) : esc(t('uNever'))}</b></div>
        ${p.approvedBy ? `<div><span class="pk">${esc(he ? 'אושר על ידי' : 'Approved by')}</span><b>${esc(p.approvedBy)}</b></div>` : ''}
      </div>

      <h3 class="sec-title">${esc(t('myDetails'))}</h3>
      <div class="form-grid">
        <div class="field"><label>${esc(t('uName'))}</label>
          <input class="input" id="meName" value="${esc(p.fullName)}"></div>
        <div class="field"><label>${esc(t('uPhone'))}</label>
          <input class="input" id="mePhone" type="tel" value="${esc(p.phone)}"></div>
        <div class="field"><label>${esc(t('dOffice'))}</label>
          <input class="input" id="meOfficePhone" type="tel" value="${esc(p.officePhone || '')}"
                 placeholder="03-5551234"></div>
      </div>
      <p class="muted small" style="margin:6px 0 0">${esc(t('idNote'))}</p>
      <div style="margin-top:12px"><button class="btn primary" id="saveMe">${esc(t('save'))}</button></div>

      <h3 class="sec-title">${esc(t('myCode'))}</h3>
      <div class="form-grid">
        <div class="field"><label>${esc(t('curCode'))}</label>
          <div class="reveal"><input class="input" id="meCur" type="password" inputmode="numeric" autocomplete="off" placeholder="••••••">
            <button type="button" class="eye" data-reveal="meCur" aria-label="${esc(he ? 'הצגת הקוד' : 'Show code')}">👁</button></div></div>
        <div class="field"><label>${esc(t('newCode'))}</label>
          <input class="input" id="meNew" type="text" inputmode="numeric" autocomplete="off" placeholder="••••••"></div>
        <div class="field"><label>${esc(t('repeatCode'))}</label>
          <input class="input" id="meNew2" type="text" inputmode="numeric" autocomplete="off" placeholder="••••••"></div>
      </div>
      <div style="margin-top:12px"><button class="btn" id="saveMyCode">${esc(t('updateCode'))}</button></div>
    </div>
  </div>` : (state.me?.isMaster ? `<div class="card">
    <div class="card-head"><h2>🔑 ${esc(t('biTitle'))}</h2><div class="spacer"></div>
      <span class="tag">${esc(t('biBuiltin'))}</span>
      <span class="tag ok"><i class="dot"></i>${esc(t('uActive'))}</span></div>
    <div class="card-body">
      <p class="muted" style="margin-top:0">${esc(t('biWhat'))}</p>
      <h3 class="sec-title">✅ ${esc(t('biCan'))}</h3>
      <ul class="perm-list">
        <li>${esc(t('biList1'))}</li>
        <li>${esc(t('biList2'))}</li>
        <li>${esc(t('biList3'))}</li>
        <li>${esc(t('biList4'))}</li>
      </ul>
      <div class="notice warn-notice" style="margin-top:14px">${esc(t('biWarn'))}</div>
      <p class="muted small" style="margin-bottom:0">${esc(t('biCode'))}</p>
    </div>
  </div>` : `<div class="card"><div class="card-head"><h2>👤 ${esc(t('myAccount'))}</h2></div>
    <div class="card-body"><p class="muted" style="margin:0">${esc(t('noProfile'))}</p></div></div>`);

  // Everyone gets the documents - staff included. They describe what the
  // system stores about the person reading them, so hiding them from staff
  // would defeat the point.
  if (!state.me?.isAdmin) return accountCard + legalCard();   // staff see their own account only

  return `${accountCard}
  <div class="card">
    <div class="card-head"><h2>${esc(t('navSettings'))}</h2></div>
    <div class="card-body">
      <div class="form-grid">
        <div class="field"><label>שם בית החולים (עברית)</label><input class="input" id="setHe" value="${esc(state.settings.hospitalNameHe || '')}"></div>
        <div class="field"><label>Hospital name (English)</label><input class="input" id="setEn" value="${esc(state.settings.hospitalNameEn || '')}"></div>
        <div class="field full"><label>${esc(t('supportPhone'))}</label>
          <input class="input" id="setSupport" type="tel" value="${esc(state.settings.supportPhone || '')}"
                 placeholder="050-0000000">
          <div class="muted small" style="margin-top:5px">${esc(t('supportPhoneHint'))}</div></div>
      </div>
      <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn primary" id="saveSettings">${esc(t('save'))}</button>
        <button class="btn" id="doBackup">${esc(t('backup'))}</button>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-head"><h2>🔒 ${esc(he ? 'קודי גישה' : 'Access codes')}</h2></div>
    <div class="card-body">
      <div class="notice">
        ${esc(he
          ? 'שינוי קוד הכניסה היומי מחייב את קוד הגיבוי. כך אף אחד מהצוות לא יכול לשנות את הקוד בלי ידיעתכם.'
          : 'Changing the daily PIN requires the master code, so nobody on the staff can change it without you knowing.')}
        <div class="muted small" style="margin-top:6px">
          ${esc(he
            ? 'קוד הגיבוי נשמר רק על המחשב שמריץ את המערכת, בקובץ data/MASTER-CODE.txt — הוא לעולם לא נשלח לדפדפן.'
            : 'The master code is stored only on the PC running the system, in data/MASTER-CODE.txt — it is never sent to the browser.')}
        </div>
      </div>

      <h3 class="sec-title">${esc(he ? 'קוד משותף' : 'Shared code')}</h3>
      <div class="check">
        <input type="checkbox" id="sharedOn" ${state.settings.sharedPinEnabled ? 'checked' : ''}>
        <label for="sharedOn" style="margin:0">${esc(he
          ? 'לאפשר כניסה עם הקוד המשותף (בנוסף לקודים האישיים)'
          : 'Allow sign-in with the shared code (alongside personal codes)')}</label>
      </div>
      <p class="muted small" style="margin:6px 0 0">${esc(he
        ? 'כשהאפשרות כבויה, נכנסים רק עם קוד אישי — וכל שינוי ביומן נושא שם. מומלץ לכבות אחרי שכל הצוות נרשם.'
        : 'When off, only personal codes work - and every change in the log carries a name. Recommended once your staff have registered.')}</p>

      <h3 class="sec-title">${esc(he ? 'שינוי קוד הכניסה היומי' : 'Change the daily PIN')}</h3>
      <div class="form-grid">
        <div class="field"><label>${esc(he ? 'קוד כניסה חדש' : 'New daily PIN')}</label>
          <input class="input" id="setPin" type="text" inputmode="numeric" autocomplete="off" placeholder="••••"></div>
        <div class="field"><label>${esc(he ? 'קוד הגיבוי (לאישור)' : 'Master code (to confirm)')}</label>
          <div class="reveal"><input class="input" id="setPinMaster" type="password" inputmode="numeric" autocomplete="off" placeholder="••••••">
            <button type="button" class="eye" data-reveal="setPinMaster" title="${esc(he ? 'הצגה' : 'Show')}" aria-label="${esc(he ? 'הצגת קוד הגיבוי' : 'Show master code')}">👁</button></div></div>
      </div>
      <div style="margin-top:12px"><button class="btn primary" id="savePin">${esc(he ? 'עדכון קוד הכניסה' : 'Update daily PIN')}</button></div>

      <h3 class="sec-title">${esc(he ? 'שינוי קוד הגיבוי' : 'Change the master code')}</h3>
      <div class="form-grid">
        <div class="field"><label>${esc(he ? 'קוד הגיבוי הנוכחי' : 'Current master code')}</label>
          <div class="reveal"><input class="input" id="curMaster" type="password" inputmode="numeric" autocomplete="off" placeholder="••••••">
            <button type="button" class="eye" data-reveal="curMaster" title="${esc(he ? 'הצגה' : 'Show')}" aria-label="${esc(he ? 'הצגת קוד הגיבוי הנוכחי' : 'Show current master code')}">👁</button></div></div>
        <div class="field"><label>${esc(he ? 'קוד גיבוי חדש (6 ספרות לפחות)' : 'New master code (6+ digits)')}</label>
          <input class="input" id="newMaster" type="text" inputmode="numeric" autocomplete="off" placeholder="••••••"></div>
      </div>
      <div style="margin-top:12px"><button class="btn" id="saveMaster">${esc(he ? 'עדכון קוד הגיבוי' : 'Update master code')}</button></div>

      <p class="muted small" style="margin-bottom:0">
        ${esc(he
          ? 'שכחתם את קוד הגיבוי? פתחו את הקובץ data/MASTER-CODE.txt במחשב שמריץ את המערכת.'
          : 'Forgot the master code? Open data/MASTER-CODE.txt on the PC running the system.')}
      </p>
    </div>
  </div>

  ${legalCard()}`;
}


/* ------------------------------------------------------------------ *
 * Users
 * ------------------------------------------------------------------ */
const userStatusTag = (st) => {
  const map = { active: ['ok', t('uActive')], pending: ['warn', t('uPending')], suspended: ['alert', t('uSuspended')] };
  const [cls, label] = map[st] || ['', st];
  return `<span class="tag ${cls}"><i class="dot"></i>${esc(label)}</span>`;
};

function userRow(u) {
  const isMaster = state.me?.isMaster;
  const actions = [];
  if (u.status === 'pending') actions.push(`<button class="btn sm primary" data-user-status="active" data-user="${esc(u.id)}">${esc(t('uApprove'))}</button>`);
  if (u.status === 'active') actions.push(`<button class="btn sm" data-user-status="suspended" data-user="${esc(u.id)}">${esc(t('uSuspend'))}</button>`);
  if (u.status === 'suspended') actions.push(`<button class="btn sm" data-user-status="active" data-user="${esc(u.id)}">${esc(t('uReactivate'))}</button>`);
  if (isMaster) {
    actions.push(`<button class="btn sm" data-user-code="${esc(u.id)}">${esc(t('uNewCode'))}</button>`);
    actions.push(`<button class="btn sm" data-user-role="${u.role === 'admin' ? 'staff' : 'admin'}" data-user="${esc(u.id)}">${u.role === 'admin' ? esc(t('uMakeStaff')) : esc(t('uMakeAdmin'))}</button>`);
    actions.push(`<button class="btn sm danger" data-user-del="${esc(u.id)}">${esc(t('del'))}</button>`);
  }
  return `<tr>
    <td data-label="${esc(t('uName'))}"><b>${esc(u.fullName)}</b><div class="muted small">${esc(u.role === 'admin' ? t('uRoleAdmin') : t('uRoleStaff'))}</div></td>
    <td class="mono" data-label="${esc(t('uPhone'))}">${esc(u.phone)}</td>
    <td class="mono" data-label="${esc(t('uId'))}">${esc(u.nationalId)}</td>
    <td data-label="${esc(t('uStatus'))}">${userStatusTag(u.status)}</td>
    <td class="muted small" data-label="${esc(t('uLastLogin'))}">${u.lastLogin ? new Date(u.lastLogin).toLocaleString(lang === 'he' ? 'he-IL' : 'en-GB') : esc(t('uNever'))}</td>
    <td class="actions">${actions.join(' ')}</td>
  </tr>`;
}

function viewUsers() {
  const pending = users.filter((u) => u.status === 'pending');
  const rest = users.filter((u) => u.status !== 'pending');
  const head = `<thead><tr>
    <th>${esc(t('uName'))}</th><th>${esc(t('uPhone'))}</th><th>${esc(t('uId'))}</th>
    <th>${esc(t('uStatus'))}</th><th>${esc(t('uLastLogin'))}</th><th></th></tr></thead>`;

  const pendingCard = `<div class="card${pending.length ? ' card-attention' : ''}">
    <div class="card-head"><h2>⏳ ${esc(t('uPendingTitle'))}${pending.length ? ` (${pending.length})` : ''}</h2></div>
    ${pending.length
      ? `<div class="table-wrap"><table>${head}<tbody>${pending.map(userRow).join('')}</tbody></table></div>`
      : `<div class="empty">${esc(t('uNoPending'))}</div>`}
  </div>`;

  return `${pendingCard}
  <div class="card">
    <div class="card-head"><h2>${esc(t('navUsers'))}</h2><div class="spacer"></div>
      ${state.me?.isMaster ? '' : `<span class="muted small">${esc(lang === 'he'
        ? 'הנפקת קוד, מינוי מנהל ומחיקה דורשים את קוד הגיבוי'
        : 'Issuing codes, appointing admins and deleting need the master code')}</span>`}</div>
    <div class="table-wrap"><table>${head}
      <tbody>${rest.map(userRow).join('') || `<tr><td colspan="6"><div class="empty">${esc(t('uNoUsers'))}</div></td></tr>`}</tbody>
    </table></div>
  </div>`;
}

async function loadUsers() {
  try { users = await api('/users'); } catch { users = []; }
}


/* ------------------------------------------------------------------ *
 * "יומן שלי" - a personal inbox between the people who use the system
 * ------------------------------------------------------------------ */
async function loadMail() {
  try {
    mail = await api('/mail');
    contacts = await api('/mail/contacts');
  } catch {
    mail = { inbox: [], sent: [], unread: 0 };
    contacts = [];
  }
}

const when = (iso) => (iso ? new Date(iso).toLocaleString(lang === 'he' ? 'he-IL' : 'en-GB',
  { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '');

function mailRow(m, box) {
  const unread = box === 'inbox' && !m.readAt;
  const who = box === 'inbox' ? m.fromName : m.toName;
  return `<div class="mail-row${unread ? ' unread' : ''}${m.doneAt ? ' done' : ''}" data-mail="${esc(m.id)}">
    <div class="mail-dot">${unread ? '<span class="dot-new"></span>' : (m.doneAt ? '✓' : '')}</div>
    <div class="mail-who">${esc(who)}</div>
    <div class="mail-sub">
      <b>${esc(m.subject || '—')}</b>
      <span class="mail-prev">${esc((m.body || '').slice(0, 90))}</span>
    </div>
    <div class="mail-when mono">${esc(when(m.createdAt))}</div>
  </div>`;
}

function viewMail() {
  if (!state.me?.profile) {
    return `<div class="card"><div class="card-head"><h2>✉ ${esc(t('navMail'))}</h2></div>
      <div class="card-body"><p class="muted" style="margin:0">${esc(t('mNoMailbox'))}</p></div></div>`;
  }

  const box = mailTab === 'sent' ? mail.sent : mail.inbox;
  const rows = box.map((m) => mailRow(m, mailTab)).join('') ||
    `<div class="empty">${esc(mailTab === 'sent' ? t('mSentEmpty') : t('mEmpty'))}</div>`;

  return `<div class="card">
    <div class="card-head">
      <h2>✉ ${esc(t('navMail'))}</h2>
      <div class="tabs mail-tabs">
        <button class="tab ${mailTab === 'inbox' ? 'active' : ''}" data-mailtab="inbox">
          ${esc(t('mInbox'))}${mail.unread ? ` <span class="alert-badge">${mail.unread}</span>` : ''}</button>
        <button class="tab ${mailTab === 'sent' ? 'active' : ''}" data-mailtab="sent">${esc(t('mSent'))}</button>
      </div>
      <div class="spacer"></div>
      <button class="btn primary" id="composeBtn">+ ${esc(t('mNew'))}</button>
    </div>
    <div class="card-body" style="padding-top:6px">
      <p class="muted small" style="margin-top:0">${esc(t('mHint'))}</p>
      <div class="mail-list">${rows}</div>
    </div>
  </div>`;
}

// Reading one message: reply, mark done, delete.
function openMail(id) {
  const m = [...mail.inbox, ...mail.sent].find((x) => x.id === id);
  if (!m) return;
  const incoming = m.toId === state.me.profile.id;

  $('#modalTitle').textContent = m.subject || t('navMail');
  $('#modalBody').innerHTML = `
    <div class="profile-grid">
      <div><span class="pk">${esc(t('mFrom'))}</span><b>${esc(m.fromName)}</b></div>
      <div><span class="pk">${esc(t('mTo'))}</span><b>${esc(m.toName)}</b></div>
      <div><span class="pk">${esc(t('mReceived'))}</span><b class="mono">${esc(when(m.createdAt))}</b></div>
      ${m.doneAt ? `<div><span class="pk">${esc(t('mDoneMark'))}</span><b class="mono">${esc(when(m.doneAt))}</b></div>` : ''}
    </div>
    <div class="mail-body">${esc(m.body || '')}</div>
    <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">
      ${incoming ? `<button class="btn sm" id="mailReply">${esc(t('mReply'))}</button>` : ''}
      ${incoming ? `<button class="btn sm ${m.doneAt ? '' : 'primary'}" id="mailDone">${esc(m.doneAt ? t('mUndone') : t('mDone'))}</button>` : ''}
      <button class="btn sm danger" id="mailDel">${esc(t('del'))}</button>
    </div>`;
  $('#modalSave').hidden = true;
  $('#modalCancel').textContent = lang === 'he' ? 'סגירה' : 'Close';
  $('#overlay').hidden = false;

  // opening a message marks it read
  if (incoming && !m.readAt) {
    api(`/mail/${m.id}`, { method: 'PUT', body: JSON.stringify({ read: true }) })
      .then(() => loadMail()).then(() => refresh()).catch(() => {});
  }

  if ($('#mailReply')) {
    $('#mailReply').onclick = () => {
      closeForm();
      composeMail({ toId: m.fromId, subject: (lang === 'he' ? 'תשובה: ' : 'Re: ') + (m.subject || ''), replyTo: m.id });
    };
  }
  if ($('#mailDone')) {
    $('#mailDone').onclick = async () => {
      try {
        await api(`/mail/${m.id}`, { method: 'PUT', body: JSON.stringify({ done: !m.doneAt }) });
        closeForm(); await loadMail(); await refresh();
      } catch (e) { toast(e.message, true); }
    };
  }
  $('#mailDel').onclick = async () => {
    if (!confirm(t('confirmDel'))) return;
    try {
      await api(`/mail/${m.id}`, { method: 'DELETE' });
      closeForm(); toast(t('deleted')); await loadMail(); await refresh();
    } catch (e) { toast(e.message, true); }
  };
}

function composeMail(prefill = {}) {
  const others = contacts.filter((c) => c.id !== state.me.profile.id);
  $('#modalTitle').textContent = t('mNew');
  $('#modalBody').innerHTML = `
    <div class="form-grid">
      <div class="field full"><label>${esc(t('mTo'))}</label>
        <select class="input" id="mailTo">
          <option value="">${esc(t('mPickPerson'))}</option>
          ${others.map((c) => `<option value="${esc(c.id)}" ${c.id === prefill.toId ? 'selected' : ''}>${esc(c.fullName)}</option>`).join('')}
        </select></div>
      <div class="field full"><label>${esc(t('mSubject'))}</label>
        <input class="input" id="mailSubject" value="${esc(prefill.subject || '')}"></div>
      <div class="field full"><label>${esc(t('mBody'))}</label>
        <textarea class="input" id="mailBody" style="min-height:130px"></textarea></div>
    </div>`;
  $('#modalSave').hidden = false;
  $('#modalSave').textContent = t('mSend');
  $('#modalCancel').textContent = t('cancel');
  $('#overlay').hidden = false;

  $('#modalSave').onclick = async () => {
    const toId = $('#mailTo').value;
    if (!toId) { toast(t('mPickPerson'), true); return; }
    try {
      await api('/mail', { method: 'POST', body: JSON.stringify({
        toId, subject: $('#mailSubject').value, body: $('#mailBody').value, replyTo: prefill.replyTo || '',
      }) });
      closeForm();
      restoreModalSave();
      toast(t('mSentOk'));
      mailTab = 'sent';
      await loadMail(); await refresh();
    } catch (e) { toast(e.message, true); }
  };
}

// the modal's save button is shared with the ordinary forms - hand it back
function restoreModalSave() {
  $('#modalSave').onclick = submitForm;
  $('#modalSave').textContent = t('save');
  $('#modalSave').hidden = false;
}

/* ------------------------------------------------------------------ *
 * Event wiring for the rendered view
 * ------------------------------------------------------------------ */
/* Every field is written as <label>text</label><input id="x">, which looks
   right but leaves a screen reader announcing an unlabelled box, and means
   clicking the label does not focus the field. Rather than hand-write for=
   on two dozen labels and rely on nobody forgetting it in the next one,
   link them by position after each render. */
function linkFieldLabels(root = document) {
  for (const label of root.querySelectorAll('.field > label:not([for])')) {
    const control = label.parentElement.querySelector('input[id], select[id], textarea[id]');
    if (control) label.setAttribute('for', control.id);
  }
}

function wireView() {
  linkFieldLabels($('#view') || document);

  // the documents arrive from a public endpoint; fetch once, then redraw
  if (view === 'settings' && !legal) {
    loadLegal().then(() => { if (view === 'settings') render(); });
  }
  $$('[data-print-doc]').forEach((b) => { b.onclick = () => printLegal(b.dataset.printDoc); });

  const box = $('#searchBox');
  if (box) {
    box.oninput = () => { search = box.value; const pos = box.selectionStart; render(); const nb = $('#searchBox'); if (nb) { nb.focus(); nb.setSelectionRange(pos, pos); } };
  }

  $$('[data-user-status]').forEach((b) => b.onclick = async () => {
    try {
      await api(`/users/${b.dataset.user}`, { method: 'PUT', body: JSON.stringify({ status: b.dataset.userStatus }) });
      toast(t('saved')); await loadUsers(); render();
    } catch (e) { toast(e.message, true); }
  });

  $$('[data-user-role]').forEach((b) => b.onclick = async () => {
    const row = b.closest('tr');
    const who = row?.querySelector('b')?.textContent || '';
    const toAdmin = b.dataset.userRole === 'admin';
    const warn = toAdmin
      ? (lang === 'he'
          ? `להפוך את ${who} למנהל?
מנהל יכול לאשר משתמשים ולשנות את כל נתוני השילוט.`
          : `Make ${who} an administrator?
Admins can approve users and change all signage data.`)
      : (lang === 'he'
          ? `להוריד את ${who} להרשאת צוות?
ההרשאות ייחסמו: לא יוכל/תוכל לאשר משתמשים, ויראה/תראה רק הודעות, רופאים ויומן שינויים.`
          : `Drop ${who} to staff?
They will lose admin rights and see only messages, doctors and the change log.`);
    if (!confirm(warn)) return;
    try {
      await api(`/users/${b.dataset.user}`, { method: 'PUT', body: JSON.stringify({ role: b.dataset.userRole }) });
      toast(t('saved')); await loadUsers(); render();
    } catch (e) { toast(e.message, true); }
  });

  $$('[data-user-code]').forEach((b) => b.onclick = async () => {
    const row = b.closest('tr');
    const who = row?.querySelector('b')?.textContent || '';
    if (!confirm(lang === 'he'
      ? `להנפיק קוד אישי חדש ל${who}?
הקוד הקיים יפסיק לעבוד מיד, והקוד החדש יוצג פעם אחת בלבד.`
      : `Issue a new personal code for ${who}?
The existing code stops working immediately, and the new one is shown only once.`)) return;
    try {
      const r = await api(`/users/${b.dataset.userCode}/code`, { method: 'POST' });
      showIssuedCode(r.name, r.code);
      await loadUsers(); render();
    } catch (e) { toast(e.message, true); }
  });

  $$('[data-user-del]').forEach((b) => b.onclick = async () => {
    if (!confirm(t('confirmDel'))) return;
    try {
      await api(`/users/${b.dataset.userDel}`, { method: 'DELETE' });
      toast(t('deleted')); await loadUsers(); render();
    } catch (e) { toast(e.message, true); }
  });

  $$('[data-reveal]').forEach((b) => b.onclick = () => {
    const el = $('#' + b.dataset.reveal);
    el.type = el.type === 'password' ? 'text' : 'password';
    b.classList.toggle('on', el.type === 'text');
  });

  $$('[data-mailtab]').forEach((b) => b.onclick = () => { mailTab = b.dataset.mailtab; render(); });
  $$('[data-mail]').forEach((b) => b.onclick = () => openMail(b.dataset.mail));
  if ($('#composeBtn')) $('#composeBtn').onclick = () => composeMail();

  $$('[data-goto]').forEach((b) => b.onclick = () => setView(b.dataset.goto));
  $$('[data-add]').forEach((b) => b.onclick = () => openForm(b.dataset.add, null));
  $$('[data-edit]').forEach((b) => b.onclick = () => openForm(view, state[view].find((x) => x.id === b.dataset.edit)));
  $$('[data-del]').forEach((b) => b.onclick = async () => {
    if (!confirm(t('confirmDel'))) return;
    try { await api(`/${view}/${b.dataset.del}`, { method: 'DELETE' }); toast(t('deleted')); await refresh(); }
    catch (e) { toast(e.message, true); }
  });

  // Door rows live under the signs view but act on rooms, so they cannot
  // use the generic handlers above - those resolve against the current view.
  $$('[data-edit-room]').forEach((b) => b.onclick = () => {
    const r = state.rooms.find((x) => x.id === b.dataset.editRoom);
    if (r) openForm('rooms', r);
  });

  $$('[data-del-room]').forEach((b) => b.onclick = async () => {
    const r = state.rooms.find((x) => x.id === b.dataset.delRoom);
    if (!r) return;
    const shifts = state.assignments.filter((a) => a.roomId === r.id).length;
    const he = lang === 'he';
    const warn = (he
      ? `למחוק את החדר ${r.number} · ${L(r, 'name')}?\nהשלט שלו יפסיק לעבוד.`
      : `Delete room ${r.number} · ${L(r, 'name')}?\nIts screen will stop working.`)
      + (shifts ? (he
          ? `\n\nיש ${shifts} שיבוצים שמפנים אליו — הם יישארו בלי חדר.`
          : `\n\n${shifts} assignment(s) point at it and will be left without a room.`) : '');
    if (!confirm(warn)) return;
    try { await api(`/rooms/${r.id}`, { method: 'DELETE' }); toast(t('deleted')); await refresh(); }
    catch (e) { toast(e.message, true); }
  });

  $$('[data-status]').forEach((b) => b.onclick = async () => {
    try {
      await api(`/rooms/${b.dataset.room}`, { method: 'PUT', body: JSON.stringify({ status: b.dataset.status }) });
      toast(t('saved')); await refresh();
    } catch (e) { toast(e.message, true); }
  });

  const meBtn = $('#saveMe');
  if (meBtn) {
    meBtn.onclick = async () => {
      try {
        await api('/me', { method: 'PUT', body: JSON.stringify({
          fullName: $('#meName').value,
          phone: $('#mePhone').value,
          officePhone: $('#meOfficePhone').value,
        }) });
        toast(t('detailsSaved'));
        await refresh();
      } catch (e) { toast(e.message, true); }
    };

    $('#saveMyCode').onclick = async () => {
      const cur = normCode($('#meCur').value);
      const next = normCode($('#meNew').value);
      const again = normCode($('#meNew2').value);
      if (!cur || !next) return toast(lang === 'he' ? 'יש למלא את הקוד הנוכחי והחדש' : 'Enter the current and new code', true);
      if (next !== again) return toast(t('codeMismatch'), true);
      try {
        await api('/me/code', { method: 'POST', body: JSON.stringify({ currentCode: cur, newCode: next }) });
        // keep this browser session signed in with the new code
        pin = next;
        sessionStorage.setItem('medsign.pin', next);
        $('#meCur').value = ''; $('#meNew').value = ''; $('#meNew2').value = '';
        toast(t('codeChanged'));
        await refresh();
      } catch (e) { toast(e.message, true); }
    };
  }

  const saveBtn = $('#saveSettings');
  if (saveBtn) {
    saveBtn.onclick = async () => {
      const body = {
        hospitalNameHe: $('#setHe').value,
        hospitalNameEn: $('#setEn').value,
        supportPhone: $('#setSupport').value,
        sharedPinEnabled: $('#sharedOn').checked,
      };
      try {
        await api('/settings', { method: 'PUT', body: JSON.stringify(body) });
        toast(t('settingsSaved')); await refresh();
      } catch (e) { toast(e.message, true); }
    };

    // the daily pin can only be changed by someone holding the master code
    $('#savePin').onclick = async () => {
      const next = normCode($('#setPin').value);
      const master = normCode($('#setPinMaster').value);
      if (!next || !master) return toast(lang === 'he' ? 'יש למלא קוד חדש וקוד גיבוי' : 'Enter both the new PIN and the master code', true);
      try {
        await api('/settings', { method: 'PUT', body: JSON.stringify({ pin: next, masterConfirm: master }) });
        pin = next;
        sessionStorage.setItem('medsign.pin', next);
        $('#setPin').value = ''; $('#setPinMaster').value = '';
        toast(lang === 'he' ? 'קוד הכניסה עודכן' : 'Daily PIN updated');
        await refresh();
      } catch (e) { toast(e.message, true); }
    };

    $('#saveMaster').onclick = async () => {
      const cur = normCode($('#curMaster').value);
      const next = normCode($('#newMaster').value);
      if (!cur || !next) return toast(lang === 'he' ? 'יש למלא את קוד הגיבוי הנוכחי והחדש' : 'Enter the current and new master code', true);
      try {
        await api('/settings', { method: 'PUT', body: JSON.stringify({ masterPin: next, masterConfirm: cur }) });
        $('#curMaster').value = ''; $('#newMaster').value = '';
        toast(lang === 'he' ? 'קוד הגיבוי עודכן ונשמר בקובץ' : 'Master code updated and written to the file');
        await refresh();
      } catch (e) { toast(e.message, true); }
    };
    $('#doBackup').onclick = async () => {
      try { const r = await api('/backup', { method: 'POST' }); toast(`${t('backupDone')}: ${r.file}`); }
      catch (e) { toast(e.message, true); }
    };
  }
}

function setView(v) {
  if (!canSee(v)) return;          // role has no business on that screen
  view = v; search = '';
  localStorage.setItem('medsign.view', v);
  if (v === 'users') { loadUsers().then(render); return; }
  if (v === 'mail') { loadMail().then(render); return; }
  render();
}

/* ------------------------------------------------------------------ *
 * Modal form builder
 * ------------------------------------------------------------------ */
let formCollection = null, formItem = null, formDirections = [];

function fieldHtml(f, item) {
  // a field whose value is not simply a property of the record works it out
  const val = f.value ? (f.value(item) ?? '') : (item?.[f.key] ?? f.default ?? '');
  const id = 'f_' + f.key;

  if (f.type === 'bool') {
    const checked = (item ? item[f.key] !== false : f.default !== false) ? 'checked' : '';
    return `<div class="field"><label>&nbsp;</label><div class="check"><input type="checkbox" id="${id}" ${checked}><label for="${id}" style="margin:0">${esc(f.label)}</label></div></div>`;
  }
  if (f.type === 'select') {
    const opts = f.options().map((o) => `<option value="${esc(o.value)}" ${String(o.value) === String(val) ? 'selected' : ''}>${esc(o.label)}</option>`).join('');
    return `<div class="field${f.full ? ' full' : ''}"><label>${esc(f.label)}</label>
      <select class="input" id="${id}"><option value="">${esc(f.blankLabel || '')}</option>${opts}</select>
      ${f.hint ? `<div class="muted small" style="margin-top:5px">${esc(f.hint)}</div>` : ''}</div>`;
  }
  if (f.type === 'textarea') {
    return `<div class="field full"><label>${esc(f.label)}</label><textarea class="input" id="${id}">${esc(val)}</textarea></div>`;
  }
  if (f.type === 'target' || f.type === 'msgtarget') {
    return `<div class="field"><label>${esc(f.label)}</label><div id="targetSlot"></div></div>`;
  }
  if (f.type === 'directions') {
    return `<div class="field full" id="dirWrap"></div>`;
  }

  // A lone <input type="datetime-local"> reports an empty value unless BOTH
  // the date and the time are filled in. Someone who picks 13/09 and leaves
  // --:-- alone gets silence and a discarded date. Two boxes instead: the
  // date carries the meaning, the time is optional and defaults sensibly.
  if (f.type === 'datetime') {
    const iso = val ? String(val).slice(0, 16) : '';
    const [d = '', tm = ''] = iso ? iso.split('T') : [];
    return `<div class="field${f.full ? ' full' : ''}"><label for="${id}_d">${esc(f.label)}</label>
      <div class="dt-pair">
        <input class="input" id="${id}_d" type="date" value="${esc(d)}">
        <input class="input" id="${id}_t" type="time" value="${esc(tm)}"
               aria-label="${esc(f.label)} — ${esc(lang === 'he' ? 'שעה' : 'time')}">
      </div>
      ${f.hint ? `<div class="muted small" style="margin-top:5px">${esc(f.hint)}</div>` : ''}</div>`;
  }

  const type = { number: 'number', color: 'color', time: 'time' }[f.type] || 'text';
  return `<div class="field${f.full ? ' full' : ''}"><label>${esc(f.label)}</label>
    <input class="input" id="${id}" type="${type}" value="${esc(val)}" placeholder="${esc(f.placeholder || '')}"></div>`;
}

function renderTargetSlot() {
  const slot = $('#targetSlot');
  if (!slot) return;
  const type = $('#f_type')?.value;
  const scope = $('#f_scope')?.value;
  const cur = formItem?.targetId || '';
  const sel = (opts, disabled) => `<select class="input" id="f_targetId" ${disabled ? 'disabled' : ''}><option value=""></option>${
    opts.map((o) => `<option value="${esc(o.value)}" ${String(o.value) === String(cur) ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}</select>`;

  if (formCollection === 'signs') {
    if (type === 'door') slot.innerHTML = sel(state.rooms.map((r) => ({ value: r.id, label: `${r.number} · ${L(r, 'name')}` })));
    else if (type === 'directory') slot.innerHTML = sel([...new Set(state.departments.map((d) => Number(d.floor)))].sort((a, b) => a - b)
      .map((f) => ({ value: String(f), label: (lang === 'he' ? 'קומה ' : 'Floor ') + f })));
    else slot.innerHTML = `<input class="input" id="f_targetId" value="" disabled placeholder="—">`;
  } else {
    if (scope === 'department') slot.innerHTML = sel(state.departments.map((d) => ({ value: d.id, label: L(d, 'name') })));
    else if (scope === 'room') slot.innerHTML = sel(state.rooms.map((r) => ({ value: r.id, label: `${r.number} · ${L(r, 'name')}` })));
    else slot.innerHTML = `<input class="input" id="f_targetId" value="" disabled placeholder="—">`;
  }
}

const ARROWS = [['up', '↑'], ['down', '↓'], ['left', '←'], ['right', '→'], ['upleft', '↖'], ['upright', '↗']];

function renderDirections() {
  const wrap = $('#dirWrap');
  if (!wrap) return;
  const visible = $('#f_type')?.value === 'wayfinding';
  wrap.style.display = visible ? '' : 'none';
  if (!visible) return;

  wrap.innerHTML = `<label>${esc(t('directions'))}</label>
    ${formDirections.map((d, i) => `<div class="toolbar" style="margin-bottom:8px">
      <input class="input grow dirHe" data-i="${i}" value="${esc(d.labelHe || '')}" placeholder="עברית">
      <input class="input grow dirEn" data-i="${i}" value="${esc(d.labelEn || '')}" placeholder="English">
      <select class="input dirArrow" data-i="${i}" style="width:80px">${ARROWS.map(([v, g]) => `<option value="${v}" ${d.arrow === v ? 'selected' : ''}>${g}</option>`).join('')}</select>
      <button type="button" class="btn sm danger dirDel" data-i="${i}">✕</button>
    </div>`).join('')}
    <button type="button" class="btn sm" id="dirAdd">+ ${esc(t('addDirection'))}</button>`;

  $('#dirAdd').onclick = () => { syncDirections(); formDirections.push({ labelHe: '', labelEn: '', arrow: 'right' }); renderDirections(); };
  $$('.dirDel', wrap).forEach((b) => b.onclick = () => { syncDirections(); formDirections.splice(Number(b.dataset.i), 1); renderDirections(); });
}

function syncDirections() {
  const wrap = $('#dirWrap');
  if (!wrap) return;
  $$('.dirHe', wrap).forEach((el) => { formDirections[el.dataset.i].labelHe = el.value; });
  $$('.dirEn', wrap).forEach((el) => { formDirections[el.dataset.i].labelEn = el.value; });
  $$('.dirArrow', wrap).forEach((el) => { formDirections[el.dataset.i].arrow = el.value; });
}

function openForm(collection, item) {
  formCollection = collection;
  formItem = item;
  formDirections = JSON.parse(JSON.stringify(item?.directions || []));

  const schema = SCHEMAS[collection];
  $('#modalTitle').textContent = (item ? t('edit') : t('add')) + ' · ' + schema.title();
  $('#modalBody').innerHTML = `<div class="form-grid">${schema.fields().map((f) => fieldHtml(f, item)).join('')}</div>`;
  restoreModalSave();
  $('#modalCancel').textContent = t('cancel');
  $('#overlay').hidden = false;

  renderTargetSlot();
  renderDirections();
  linkFieldLabels($('#modalBody'));
  $('#f_type')?.addEventListener('change', () => { renderTargetSlot(); renderDirections(); });
  $('#f_scope')?.addEventListener('change', renderTargetSlot);
  $('#modalBody input, #modalBody select')?.focus?.();
}

function closeForm() { $('#overlay').hidden = true; }

// A regenerated code is shown once - it is stored hashed and cannot be read back.
function showIssuedCode(name, code) {
  $('#modalTitle').textContent = t('uCodeIssued');
  $('#modalBody').innerHTML = `
    <p class="muted small">${esc(name)}</p>
    <div class="code-box">${esc(code)}</div>
    <div class="notice" style="margin-top:12px">
      ${esc(lang === 'he'
        ? 'העבירו את הקוד למשתמש עכשיו. הוא נשמר מוצפן ולא ניתן להציג אותו שוב.'
        : 'Give this code to the user now. It is stored hashed and cannot be shown again.')}
    </div>`;
  $('#overlay').hidden = false;
  $('#modalSave').hidden = true;
  $('#modalCancel').textContent = lang === 'he' ? 'סגירה' : 'Close';
}

async function submitForm() {
  const schema = SCHEMAS[formCollection];
  const body = {};

  for (const f of schema.fields()) {
    const el = $('#f_' + f.key);
    if (f.type === 'directions') { syncDirections(); body.directions = formDirections; continue; }
    if (f.type === 'datetime') {
      const day = $('#f_' + f.key + '_d')?.value || '';
      const time = $('#f_' + f.key + '_t')?.value || '';
      // no date at all means no limit; a date on its own covers the whole day
      body[f.key] = day ? `${day}T${time || (f.endOfDay ? '23:59' : '00:00')}` : '';
      continue;
    }
    if (!el) continue;
    if (f.type === 'bool') body[f.key] = el.checked;
    else if (f.type === 'number') body[f.key] = el.value === '' ? 0 : Number(el.value);
    else body[f.key] = el.value;

    if (f.required && !String(body[f.key] ?? '').trim()) {
      el.focus();
      toast((lang === 'he' ? 'שדה חובה: ' : 'Required: ') + f.label, true);
      return;
    }
  }

  // A message whose window closes before it opens would simply never appear,
  // with nothing on screen to explain why.
  if (body.from && body.until && new Date(body.until) <= new Date(body.from)) {
    $('#f_until_d')?.focus();
    toast(lang === 'he'
      ? 'תאריך הסיום חייב להיות אחרי תאריך ההתחלה'
      : 'The end date must come after the start date', true);
    return;
  }

  // lives on the doctor, so it must not travel to /rooms
  const wantedDoctor = formCollection === 'rooms' ? (body._doctorId ?? '') : null;
  delete body._doctorId;

  try {
    const saved = formItem
      ? await api(`/${formCollection}/${formItem.id}`, { method: 'PUT', body: JSON.stringify(body) })
      : await api(`/${formCollection}`, { method: 'POST', body: JSON.stringify(body) });

    if (wantedDoctor !== null) await setRoomDoctor(saved?.id || formItem?.id, wantedDoctor);

    closeForm();
    toast(t('saved'));
    await refresh();
  } catch (e) { toast(e.message, true); }
}

/* One room holds one pinned doctor. Moving a doctor in means moving out
   whoever was pinned there before, or two doors claim the same person. */
async function setRoomDoctor(roomId, doctorId) {
  if (!roomId) return;
  const previous = state.doctors.filter((d) => d.currentRoomId === roomId && d.id !== doctorId);
  for (const d of previous) {
    await api(`/doctors/${d.id}`, { method: 'PUT', body: JSON.stringify({ currentRoomId: '' }) });
  }
  if (doctorId) {
    await api(`/doctors/${doctorId}`, { method: 'PUT', body: JSON.stringify({ currentRoomId: roomId }) });
  }
}

/* ------------------------------------------------------------------ *
 * Boot
 * ------------------------------------------------------------------ */
// Send the browser back to the login screen - used when a code stops being valid.
function forceLogout(message) {
  pin = '';
  sessionStorage.removeItem('medsign.pin');
  // stop listening: a dead session must not keep reacting to broadcasts
  if (liveStream) { try { liveStream.close(); } catch {} liveStream = null; }
  $('#app').hidden = true;
  $('#login').hidden = false;

  // Never interrupt a flow in progress. Registering broadcasts a users update,
  // which used to bounce the person off their freshly issued code before they
  // could write it down.
  const midFlow = !$('#codeResult').hidden || !$('#pendingBox').hidden;
  if (midFlow) return;

  showLoginPanel('login');
  if (message) toast(message, true);
}

function showApp() {
  stopApprovalWatch();
  $('#login').hidden = true;
  $('#app').hidden = false;
  refresh()
    .then(connectLive)
    .catch((e) => forceLogout(e.message));   // revoked, suspended or replaced code
}

// A local Israeli number (052-374-8060) has to become an international one
// (972523748060) for WhatsApp; a number already carrying a country code is
// left alone apart from the punctuation.
function whatsappNumber(raw) {
  let n = String(raw || '').replace(/\D/g, '');
  if (!n) return '';
  if (n.startsWith('00')) n = n.slice(2);
  else if (n.startsWith('0')) n = '972' + n.slice(1);   // local -> Israel
  return n;
}

// The login screen has to say something useful to a person who cannot sign in,
// so this number is read from a public endpoint - no code required.
async function loadLoginHelp() {
  const el = $('#forgotHelp');
  if (!el) return;
  try {
    const info = await (await fetch('/api/public', { cache: 'no-store' })).json();
    if (info.supportPhone) {
      const wa = whatsappNumber(info.supportPhone);
      const note = encodeURIComponent(lang === 'he'
        ? 'שלום, שכחתי את הקוד האישי שלי למערכת Medical Sign ואשמח לקבל קוד חדש.'
        : 'Hello, I have forgotten my personal code for Medical Sign and would like a new one.');
      el.innerHTML = `${esc(t('forgotWithNumber'))}
        <a class="wa-link" href="https://wa.me/${esc(wa)}?text=${note}"
           target="_blank" rel="noopener noreferrer">
          <span class="wa-mark">WhatsApp</span><span class="mono">${esc(info.supportPhone)}</span></a>`;
    } else {
      el.textContent = t('forgotNoNumber');
    }
  } catch {
    el.textContent = t('forgotNoNumber');
  }
  loadLoginLegal();
}

/* The privacy notice has to be readable BEFORE someone types their ID into
   the registration form - that is the whole reason /api/legal needs no code. */
async function loadLoginLegal() {
  const foot = $('#loginLegal');
  const consent = $('#legalConsent');
  if (!foot && !consent) return;
  const docs = (await loadLegal())?.[lang];
  if (!docs) return;

  const link = (key, label) =>
    `<a href="#" data-login-doc="${esc(key)}">${esc(label)}</a>`;

  if (foot) {
    foot.innerHTML = link('privacy', docs.privacy.title)
      + ' · ' + link('terms', docs.terms.title)
      + ' · ' + link('accessibility', docs.accessibility.title);
  }
  if (consent) {
    consent.innerHTML = (lang === 'he'
      ? 'ההרשמה כפופה ל' : 'Registering is subject to the ')
      + link('terms', docs.terms.title)
      + (lang === 'he' ? ' ול' : ' and the ')
      + link('privacy', docs.privacy.title) + '.';
  }
  $$('[data-login-doc]').forEach((a) => {
    a.onclick = (e) => { e.preventDefault(); printLegal(a.dataset.loginDoc); };
  });
}

function showLoginPanel(which) {
  const live = $('#waitingLive');
  if (live) live.textContent = t('waitingLive');
  $('#loginForm').hidden = which !== 'login';
  $('#registerForm').hidden = which !== 'register';
  $('#codeResult').hidden = which !== 'code';
  $('#pendingBox').hidden = which !== 'pending';
  $('#tabLogin').classList.toggle('active', which === 'login');
  $('#tabRegister').classList.toggle('active', which === 'register');
  $('.tabs').hidden = which === 'code' || which === 'pending';
}

/* ------------------------------------------------------------------ *
 * Waiting room: an approved account should walk straight in, with no
 * refresh. We listen on the live stream and re-check the code.
 * ------------------------------------------------------------------ */
let approvalWatch = null;

function stopApprovalWatch() {
  if (!approvalWatch) return;
  clearInterval(approvalWatch.timer);
  try { approvalWatch.es.close(); } catch {}
  approvalWatch = null;
}

function startApprovalWatch(code) {
  stopApprovalWatch();

  const check = async () => {
    try {
      const r = await fetch('/api/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin: code }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.ok || data.pending) return;   // still waiting
      stopApprovalWatch();
      pin = code;
      sessionStorage.setItem('medsign.pin', code);
      toast(t('approvedNow'));
      showApp();
    } catch { /* server momentarily unreachable - the next tick retries */ }
  };

  let es = null;
  try {
    es = new EventSource('/api/events');
    es.onmessage = check;          // an admin approving broadcasts an update
  } catch { /* no SSE - the timer below still covers it */ }

  approvalWatch = { es, timer: setInterval(check, 5000) };
  check();
}

$('#tabLogin').onclick = () => showLoginPanel('login');
$('#tabRegister').onclick = () => showLoginPanel('register');
$('#goLogin').onclick = () => { stopApprovalWatch(); $('#pinInput').value = ''; showLoginPanel('login'); };
$('#pendingBack').onclick = () => { stopApprovalWatch(); showLoginPanel('login'); };

let liveStream = null;

function connectLive() {
  if (liveStream) { try { liveStream.close(); } catch {} }
  const es = new EventSource('/api/events');
  liveStream = es;
  es.onmessage = (ev) => {
    const data = JSON.parse(ev.data);
    $('#connState').textContent = t('connected');
    if (data.type === 'update') {
      refresh().catch((err) => {
        // suspended, deleted or code replaced while signed in
        if (err.status === 401 || err.status === 403) forceLogout(err.message || t('accessRevoked'));
      });
    }
  };
  es.onerror = () => { $('#connState').textContent = t('disconnected'); };
}

$('#loginForm').onsubmit = async (e) => {
  e.preventDefault();
  const value = normCode($('#pinInput').value);
  try {
    const r = await fetch('/api/auth', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin: value }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || t('badPin'));
    if (data.pending) {                       // approved accounts only
      showLoginPanel('pending');
      startApprovalWatch(value);              // ...and let them in the moment that changes
      return;
    }
    pin = value;
    sessionStorage.setItem('medsign.pin', pin);
    showApp();
  } catch (err) { toast(err.message, true); $('#pinInput').select(); }
};

$('#registerForm').onsubmit = async (e) => {
  e.preventDefault();
  const body = {
    fullName: $('#regName').value.trim(),
    phone: $('#regPhone').value.trim(),
    nationalId: $('#regId').value.trim(),
  };
  try {
    const r = await fetch('/api/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || 'שגיאה');
    // a stale code from a deleted account would only cause failing refreshes
    pin = '';
    sessionStorage.removeItem('medsign.pin');
    if (liveStream) { try { liveStream.close(); } catch {} liveStream = null; }

    $('#codeHello').textContent = (lang === 'he' ? 'שלום ' : 'Hello ') + data.name;
    $('#issuedCode').textContent = data.code;
    $('#regName').value = ''; $('#regPhone').value = ''; $('#regId').value = '';
    showLoginPanel('code');
  } catch (err) { toast(err.message, true); }
};

$('#copyCode').onclick = async () => {
  try { await navigator.clipboard.writeText($('#issuedCode').textContent); toast(t('copied')); }
  catch { toast($('#issuedCode').textContent); }
};

$('#langBtn').onclick = () => {
  lang = lang === 'he' ? 'en' : 'he';
  localStorage.setItem('medsign.lang', lang);
  loadLoginHelp();
  render();
};

$('#lockBtn').onclick = () => {
  sessionStorage.removeItem('medsign.pin');
  location.reload();
};

$$('.nav-item').forEach((b) => b.onclick = () => setView(b.dataset.view));
$('#modalCancel').onclick = closeForm;
$('#modalSave').onclick = submitForm;
$('#overlay').onclick = (e) => { if (e.target.id === 'overlay') closeForm(); };
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeForm(); });

setInterval(() => {
  const el = $('#clock');
  if (el) el.textContent = new Date().toLocaleTimeString(lang === 'he' ? 'he-IL' : 'en-GB');
}, 1000);

// re-render the "now" view each minute so the current shift stays accurate
setInterval(() => {
  if (state && (view === 'now' || view === 'dashboard' || view === 'doctors')) {
    refresh().catch(() => {});   // the current room comes from the server
  }
}, 60000);

loadLoginHelp();
if (pin) showApp();
