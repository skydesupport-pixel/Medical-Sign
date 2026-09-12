// Demo content so the system is usable the moment it boots.
// Delete data/db.json to regenerate, or just edit everything in the admin UI.

export function seed() {
  const departments = [
    { id: 'dep_er',    nameHe: 'מיון',           nameEn: 'Emergency',       floor: 0, wing: 'A', color: '#dc2626', phone: '03-5551100', hoursHe: 'פתוח 24/7',        hoursEn: 'Open 24/7' },
    { id: 'dep_card',  nameHe: 'קרדיולוגיה',      nameEn: 'Cardiology',      floor: 2, wing: 'B', color: '#e11d48', phone: '03-5551220', hoursHe: 'ראשון-חמישי 08:00-16:00', hoursEn: 'Sun-Thu 08:00-16:00' },
    { id: 'dep_ortho', nameHe: 'אורתופדיה',       nameEn: 'Orthopedics',     floor: 2, wing: 'C', color: '#0891b2', phone: '03-5551240', hoursHe: 'ראשון-חמישי 08:00-15:00', hoursEn: 'Sun-Thu 08:00-15:00' },
    { id: 'dep_neuro', nameHe: 'נוירולוגיה',      nameEn: 'Neurology',       floor: 3, wing: 'B', color: '#7c3aed', phone: '03-5551310', hoursHe: 'ראשון-חמישי 08:00-15:00', hoursEn: 'Sun-Thu 08:00-15:00' },
    { id: 'dep_img',   nameHe: 'הדמיה ורנטגן',    nameEn: 'Imaging & X-Ray', floor: 1, wing: 'A', color: '#0d9488', phone: '03-5551150', hoursHe: 'ראשון-שישי 07:00-19:00',  hoursEn: 'Sun-Fri 07:00-19:00' },
    { id: 'dep_lab',   nameHe: 'מעבדות',          nameEn: 'Laboratories',    floor: 1, wing: 'D', color: '#65a30d', phone: '03-5551170', hoursHe: 'ראשון-חמישי 07:00-14:00', hoursEn: 'Sun-Thu 07:00-14:00' },
  ];

  const rooms = [
    { id: 'room_201', number: '201', nameHe: 'חדר בדיקות 1',     nameEn: 'Exam Room 1',      departmentId: 'dep_card',  floor: 2, type: 'exam',   status: 'open' },
    { id: 'room_202', number: '202', nameHe: 'חדר בדיקות 2',     nameEn: 'Exam Room 2',      departmentId: 'dep_card',  floor: 2, type: 'exam',   status: 'open' },
    { id: 'room_205', number: '205', nameHe: 'אק"ג ומבחני מאמץ', nameEn: 'ECG & Stress Test', departmentId: 'dep_card', floor: 2, type: 'proc',   status: 'open' },
    { id: 'room_231', number: '231', nameHe: 'מרפאת גב',         nameEn: 'Spine Clinic',     departmentId: 'dep_ortho', floor: 2, type: 'clinic', status: 'open' },
    { id: 'room_232', number: '232', nameHe: 'חדר גבס',          nameEn: 'Casting Room',     departmentId: 'dep_ortho', floor: 2, type: 'proc',   status: 'open' },
    { id: 'room_301', number: '301', nameHe: 'מרפאת נוירולוגיה', nameEn: 'Neurology Clinic', departmentId: 'dep_neuro', floor: 3, type: 'clinic', status: 'open' },
    { id: 'room_110', number: '110', nameHe: 'רנטגן 1',          nameEn: 'X-Ray 1',          departmentId: 'dep_img',   floor: 1, type: 'proc',   status: 'open' },
    { id: 'room_112', number: '112', nameHe: 'סי.טי',            nameEn: 'CT Scanner',       departmentId: 'dep_img',   floor: 1, type: 'proc',   status: 'closed', noteHe: 'בתחזוקה עד 12:00', noteEn: 'Maintenance until 12:00' },
    { id: 'room_140', number: '140', nameHe: 'לקיחת דמים',       nameEn: 'Blood Draw',       departmentId: 'dep_lab',   floor: 1, type: 'clinic', status: 'open' },
  ];

  const doctors = [
    { id: 'doc_avi',   nameHe: 'אבי כהן',    nameEn: 'Avi Cohen',     titleHe: 'ד"ר',  titleEn: 'Dr.',   specialtyHe: 'קרדיולוג בכיר',  specialtyEn: 'Senior Cardiologist', departmentId: 'dep_card',  license: '12345', active: true },
    { id: 'doc_maya',  nameHe: 'מאיה לוי',   nameEn: 'Maya Levy',     titleHe: 'ד"ר',  titleEn: 'Dr.',   specialtyHe: 'אי ספיקת לב',    specialtyEn: 'Heart Failure',       departmentId: 'dep_card',  license: '23456', active: true },
    { id: 'doc_yossi', nameHe: 'יוסי מזרחי', nameEn: 'Yossi Mizrahi', titleHe: 'פרופ', titleEn: 'Prof.', specialtyHe: 'מנתח עמוד שדרה', specialtyEn: 'Spine Surgeon',       departmentId: 'dep_ortho', license: '34567', active: true },
    { id: 'doc_rina',  nameHe: 'רינה שפירא', nameEn: 'Rina Shapira',  titleHe: 'ד"ר',  titleEn: 'Dr.',   specialtyHe: 'נוירולוגית',     specialtyEn: 'Neurologist',         departmentId: 'dep_neuro', license: '45678', active: true },
    { id: 'doc_omar',  nameHe: 'עומר חדד',   nameEn: 'Omar Haddad',   titleHe: 'ד"ר',  titleEn: 'Dr.',   specialtyHe: 'רדיולוג',        specialtyEn: 'Radiologist',         departmentId: 'dep_img',   license: '56789', active: true },
  ];

  const WEEK = [0, 1, 2, 3, 4]; // Sunday - Thursday
  const assignments = [
    { id: 'as_1', doctorId: 'doc_avi',   roomId: 'room_201', days: WEEK,   start: '08:00', end: '12:00', active: true },
    { id: 'as_2', doctorId: 'doc_maya',  roomId: 'room_201', days: WEEK,   start: '12:00', end: '16:00', active: true },
    { id: 'as_3', doctorId: 'doc_maya',  roomId: 'room_202', days: [0, 2], start: '08:00', end: '12:00', active: true },
    { id: 'as_4', doctorId: 'doc_yossi', roomId: 'room_231', days: [1, 3], start: '09:00', end: '14:00', active: true },
    { id: 'as_5', doctorId: 'doc_rina',  roomId: 'room_301', days: WEEK,   start: '08:30', end: '15:00', active: true },
    { id: 'as_6', doctorId: 'doc_omar',  roomId: 'room_110', days: WEEK,   start: '07:00', end: '19:00', active: true },
  ];

  const signs = [
    { id: 'sign_201', nameHe: 'שלט דלת 201',  nameEn: 'Door sign 201',    type: 'door',       targetId: 'room_201', theme: 'light', orientation: 'landscape' },
    { id: 'sign_231', nameHe: 'שלט דלת 231',  nameEn: 'Door sign 231',    type: 'door',       targetId: 'room_231', theme: 'dark',  orientation: 'portrait' },
    { id: 'sign_112', nameHe: 'שלט דלת סי.טי', nameEn: 'Door sign CT',    type: 'door',       targetId: 'room_112', theme: 'light', orientation: 'landscape' },
    { id: 'sign_f2',  nameHe: 'מדריך קומה 2', nameEn: 'Floor 2 board',    type: 'directory',  targetId: '2',        theme: 'dark',  orientation: 'portrait' },
    { id: 'sign_lob', nameHe: 'שילוט לובי',   nameEn: 'Lobby wayfinding', type: 'wayfinding', targetId: '',         theme: 'dark',  orientation: 'landscape',
      directions: [
        { labelHe: 'מיון',            labelEn: 'Emergency',  arrow: 'left' },
        { labelHe: 'הדמיה ורנטגן',    labelEn: 'Imaging',    arrow: 'right' },
        { labelHe: 'מעבדות',          labelEn: 'Laboratories', arrow: 'right' },
        { labelHe: 'מרפאות חוץ',      labelEn: 'Outpatient', arrow: 'up' },
        { labelHe: 'קבלה ורישום',     labelEn: 'Admissions', arrow: 'down' },
      ] },
  ];

  const messages = [
    { id: 'msg_1', scope: 'global',     targetId: '',        textHe: 'נא לעטות מסכה באזורי ההמתנה',           textEn: 'Please wear a mask in waiting areas',        level: 'info', active: true,  from: '', until: '' },
    { id: 'msg_2', scope: 'department', targetId: 'dep_img', textHe: 'סי.טי בתחזוקה - בדיקות דחופות ברנטגן 1', textEn: 'CT under maintenance - urgent scans at X-Ray 1', level: 'warn', active: true, from: '', until: '' },
  ];

  return { departments, rooms, doctors, assignments, signs, messages, log: [] };
}
