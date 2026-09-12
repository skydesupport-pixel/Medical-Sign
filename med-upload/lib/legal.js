/* ------------------------------------------------------------------ *
 * Medical Sign - the three documents the system has to be able to show.
 *
 * They are generated from the live settings rather than written into the
 * page, so the hospital name and the contact number are always the real
 * ones, and so a statement can never drift out of date with the software
 * it describes.
 *
 * Deliberately NOT here: a cookie policy and a consent banner. The site
 * sets no cookies at all - no Set-Cookie anywhere on the server, no
 * document.cookie anywhere on the client - and loads nothing from a third
 * party. What it does use is three functional localStorage/sessionStorage
 * keys, and those are described inside the privacy notice where they
 * belong. A consent banner over nothing would be noise on every door
 * tablet, several times a day, in exchange for no protection whatsoever.
 *
 * These are plain-language notices, not legal advice. Before the system is
 * sold or deployed they should be read by the hospital's legal counsel and
 * privacy officer, who set the final wording.
 * ------------------------------------------------------------------ */

const UPDATED = '2026-09-12';

/* The three functional storage keys, named honestly. Kept next to the
   privacy text so that adding a fourth forces someone to update it. */
const STORAGE = [
  { key: 'medsign.lang', he: 'השפה שבחרתם — עברית או אנגלית.', en: 'Your chosen language, Hebrew or English.' },
  { key: 'medsign.view', he: 'המסך האחרון שהיה פתוח, כדי לחזור אליו בכניסה הבאה.', en: 'The last screen you had open, so you return to it.' },
  { key: 'medsign.pin', he: 'הקוד האישי, לאורך הגלישה בלבד. נמחק ברגע שסוגרים את הלשונית.', en: 'Your personal code, for this browser tab only. It is erased the moment the tab closes.' },
];

function privacy(s, he) {
  const hospital = (he ? s.hospitalNameHe : s.hospitalNameEn) || (he ? 'בית החולים' : 'the hospital');
  const phone = s.supportPhone || '';

  return he ? {
    title: 'מדיניות פרטיות',
    updated: UPDATED,
    intro: `מסמך זה מסביר איזה מידע נשמר במערכת השילוט הדיגיטלי של ${hospital}, למה הוא נדרש ומי רואה אותו.`,
    sections: [
      {
        h: 'המערכת אינה מכילה מידע על מטופלים',
        p: [
          'זו הנקודה החשובה ביותר במסמך. המערכת מנהלת שילוט: מחלקות, חדרים, שמות רופאים ולוחות משמרות.',
          'אין בה תיקים רפואיים, אין אבחנות, אין שמות של מטופלים ואין כל מידע רפואי על אדם כלשהו. אין להזין מידע כזה גם בהודעות הפנימיות.',
        ],
      },
      {
        h: 'איזה מידע נשמר על אנשי הצוות',
        p: ['על כל מי שנרשם למערכת נשמרים:'],
        list: [
          'שם מלא — מוצג לצד כל פעולה שבוצעה, כדי שיהיה ברור מי שינה מה.',
          'מספר טלפון — כדי שיהיה אפשר ליצור קשר. המערכת עצמה אינה שולחת אליו דבר.',
          'טלפון משרד (אם הוזן) — מוצג לצוות ברשימת הרופאים.',
          'ארבע הספרות האחרונות של תעודת הזהות — מוצגות בכרטיס האישי ובטבלת המשתמשים, כדי שתוכלו לזהות שהחשבון אכן שלכם. המערכת אינה משתמשת בהן לשום פעולה.',
          'קוד הכניסה האישי — נשמר מוצפן (scrypt) ואינו ניתן לקריאה חזרה.',
          'הרשאה (צוות או מנהל) וסטטוס (ממתין, פעיל או מושהה).',
          'מועד ההרשמה, מועד האישור, ומי אישר.',
          'מועד הכניסה האחרונה.',
        ],
      },
      {
        h: 'תעודת הזהות אינה נשמרת',
        p: [
          'בעת ההרשמה מוזנת תעודת זהות מלאה, והמערכת בודקת שהיא תקינה ושאין כבר משתמש איתה. מיד לאחר מכן המספר עצמו נמחק.',
          'מה שנשמר הוא טביעה מוצפנת (scrypt) וארבע הספרות האחרונות בלבד. אי אפשר לשחזר ממנה את המספר — לא על ידי מנהל, לא עם קוד הגיבוי, ולא מתוך קובץ הנתונים.',
          'זו בחירה מכוונת: המערכת שומרת רק את מה שהיא באמת צריכה כדי לעבוד.',
        ],
      },
      {
        h: 'עוגיות (Cookies)',
        p: [
          'האתר אינו משתמש בעוגיות כלל, ואינו טוען שום רכיב מאתר חיצוני — אין בו מעקב, אין אנליטיקס ואין פרסום.',
          'מה שכן נשמר בדפדפן הוא שלושה פריטים תפעוליים בלבד:',
        ],
        list: STORAGE.map((x) => `${x.key} — ${x.he}`),
        after: ['הפריטים האלה נשמרים במחשב או בטלפון שלכם בלבד ואינם נשלחים לשום מקום. ניקוי נתוני הגלישה מוחק אותם.'],
      },
      {
        h: 'מי רואה מה',
        list: [
          'איש צוות רואה את ההודעות, את רשימת הרופאים, את תיבת הדואר האישית שלו, ומסך הגדרות שבו רק הכרטיס האישי שלו והמסמכים האלה. הוא אינו רואה את רשימת המשתמשים, את יומן השינויים, את קודי הגישה ואת שאר נתוני השילוט.',
          'מנהל רואה את כל נתוני השילוט, ואת רשימת המשתמשים — ובה שם, טלפון, ארבע ספרות אחרונות, סטטוס, הרשאה ומועד הכניסה האחרונה של כל אחד.',
          'קוד הגיבוי פותח הרשאות מנהל מלאות ללא חשבון אישי. פעולות שנעשות איתו נרשמות בשם "מנהל מערכת".',
          'שלטי הדלת מציגים שמות רופאים, חדרים ושעות. הם אינם דורשים כניסה, ולכן אין להציג בהם שום דבר שאינו מיועד לעיני כל עובר בפרוזדור.',
        ],
      },
      {
        h: 'יומן פעולות',
        p: [
          'כל יצירה, שינוי ומחיקה נרשמים ביומן יחד עם השם והמועד — וכך גם כל כניסה למערכת. היומן קיים כדי שאפשר יהיה לברר מי שינה שילוט ומתי, והוא מוגבל ל־500 הרשומות האחרונות; ישנות מזה נמחקות מאליהן.',
          'את היומן רואים מנהלים בלבד.',
        ],
      },
      {
        h: 'אבטחה',
        list: [
          'קודי הכניסה האישיים נשמרים מוצפנים ואינם ניתנים לשחזור — רק להנפקה מחדש.',
          'אחרי 8 ניסיונות כניסה שגויים הכתובת נחסמת לדקה, כדי שלא יהיה אפשר לנחש קוד.',
          'הנתונים יושבים על מחשב בבית החולים ואינם נשלחים לשום שירות חיצוני.',
          'גיבויים נשמרים ללא הקודים וללא הטביעות המוצפנות.',
        ],
      },
      {
        h: 'הזכויות שלכם',
        p: [
          'לפי חוק הגנת הפרטיות אתם רשאים לעיין במידע שנשמר עליכם, לבקש לתקן אותו אם הוא שגוי, ולבקש למחוק את החשבון.',
          'את פרטיכם אפשר לעדכן לבד במסך "הגדרות". לכל בקשה אחרת — פנייה למנהל המערכת.',
        ],
      },
      {
        h: 'יצירת קשר',
        p: [phone
          ? `בשאלות בנושא פרטיות אפשר לפנות למנהל המערכת בטלפון ${phone}.`
          : 'בשאלות בנושא פרטיות יש לפנות למנהל המערכת של בית החולים.'],
      },
    ],
  } : {
    title: 'Privacy notice',
    updated: UPDATED,
    intro: `What the digital signage system at ${hospital} stores, why it needs it, and who can see it.`,
    sections: [
      {
        h: 'There is no patient data in this system',
        p: [
          'The most important line in this document. The system manages signage: departments, rooms, doctors’ names and shift rosters.',
          'It holds no medical records, no diagnoses, no patient names and no clinical information about anyone. Such information must not be entered into the internal messages either.',
        ],
      },
      {
        h: 'What is stored about staff',
        p: ['For each registered person:'],
        list: [
          'Full name — shown next to every action, so it is clear who changed what.',
          'Phone number — so that someone can be reached. The system itself sends nothing to it.',
          'Office phone, if given — shown to staff in the doctors list.',
          'The last four digits of the ID number — displayed on the personal card and in the user table so you can recognise your own account. The system does not use them for anything.',
          'The personal access code — stored hashed (scrypt) and never readable back.',
          'Role (staff or admin) and status (pending, active or suspended).',
          'When they registered, when they were approved, and by whom.',
          'Last sign-in time.',
        ],
      },
      {
        h: 'The ID number is not kept',
        p: [
          'At registration a full ID number is entered, and the system checks that it is valid and not already registered. Immediately afterwards the number itself is discarded.',
          'What remains is a scrypt hash and the last four digits. The original cannot be recovered — not by an administrator, not with the master code, and not from the data file.',
          'This is deliberate: the system keeps only what it actually needs in order to work.',
        ],
      },
      {
        h: 'Cookies',
        p: [
          'The site sets no cookies at all and loads nothing from any third party — no tracking, no analytics, no advertising.',
          'What it does store in your browser is three functional items:',
        ],
        list: STORAGE.map((x) => `${x.key} — ${x.en}`),
        after: ['These stay on your own computer or phone and are sent nowhere. Clearing your browsing data removes them.'],
      },
      {
        h: 'Who sees what',
        list: [
          'A staff member sees the messages, the doctors list, their own inbox, and a Settings screen holding only their own card and these documents. They do not see the user list, the change log, the access codes or the rest of the signage data.',
          'An administrator sees all signage data, and the user list — everyone’s name, phone, last four digits, status, role and last sign-in time.',
          'The master code opens full administrator rights with no personal account. Actions taken with it are logged as “System administrator”.',
          'Door signs show doctor names, rooms and times. They need no sign-in, so nothing may be placed on them that is not meant for everyone walking past.',
        ],
      },
      {
        h: 'Activity log',
        p: [
          'Every create, change and delete is recorded with a name and a timestamp — and so is every sign-in. The log exists so it is possible to establish who changed a sign and when, and it keeps the most recent 500 entries; older ones are dropped automatically.',
          'Only administrators can see it.',
        ],
      },
      {
        h: 'Security',
        list: [
          'Personal codes are stored hashed and cannot be recovered — only reissued.',
          'After 8 failed sign-in attempts the address is blocked for a minute, so a code cannot be guessed.',
          'Data sits on a machine inside the hospital and is sent to no external service.',
          'Backups are written without the access codes and without the hashes.',
        ],
      },
      {
        h: 'Your rights',
        p: [
          'Under the Israeli Privacy Protection Law you may see the information held about you, ask for it to be corrected if wrong, and ask for your account to be deleted.',
          'You can update your own details under “Settings”. For anything else, contact the system administrator.',
        ],
      },
      {
        h: 'Contact',
        p: [phone
          ? `For privacy questions, contact the system administrator on ${phone}.`
          : 'For privacy questions, contact the hospital’s system administrator.'],
      },
    ],
  };
}

function terms(s, he) {
  const hospital = (he ? s.hospitalNameHe : s.hospitalNameEn) || (he ? 'בית החולים' : 'the hospital');

  return he ? {
    title: 'תנאי שימוש',
    updated: UPDATED,
    intro: `כללי השימוש במערכת השילוט הדיגיטלי של ${hospital}. הכניסה למערכת מהווה הסכמה להם.`,
    sections: [
      {
        h: 'למי המערכת מיועדת',
        p: ['המערכת מיועדת לאנשי צוות מורשים בלבד. ההרשמה טעונה אישור של מנהל, ועד לאישור לא ניתן לבצע דבר.'],
      },
      {
        h: 'הקוד האישי',
        list: [
          'הקוד הוא אישי. אין למסור אותו לאף אחד, גם לא לעמית לעבודה.',
          'כל פעולה שנעשית עם הקוד שלכם נרשמת על שמכם.',
          'קוד שנחשף — יש להחליף מיד במסך "הגדרות" או לבקש קוד חדש ממנהל.',
          'הקוד אינו ניתן לשחזור. אם נשכח, מנפיקים חדש.',
        ],
      },
      {
        h: 'מה אסור להזין למערכת',
        p: ['המערכת אינה מערכת רפואית ואינה מאובטחת לשמש כזו. אין להזין בה, בשום שדה ובשום הודעה:'],
        list: [
          'שמות מטופלים או פרטים מזהים שלהם.',
          'מידע רפואי כלשהו — אבחנות, טיפולים, תוצאות.',
          'מספרי תעודת זהות של מטופלים.',
          'כל מידע אישי רגיש שאינו נדרש לצורכי שילוט.',
        ],
      },
      {
        h: 'שימוש הוגן',
        list: [
          'אין לשנות שילוט של מחלקה שאינכם אחראים לה.',
          'אין להשתמש בהודעות הפנימיות למטרות שאינן קשורות לעבודה.',
          'שימוש לרעה מתועד ביומן ועלול להביא לשלילת ההרשאה.',
        ],
      },
      {
        h: 'זמינות',
        p: [
          'המערכת רצה על מחשב בבית החולים. בזמן תחזוקה, הפסקת חשמל או תקלת רשת ייתכן שהשלטים יציגו מידע שאינו עדכני.',
          'בכל מקרה של סתירה בין שלט לבין הוראה של הצוות הרפואי — קובעת הוראת הצוות.',
        ],
      },
      {
        h: 'המסמך המחייב',
        p: ['תנאים אלה מסדירים את השימוש היומיומי. ההתקשרות בין בית החולים לבין ספק המערכת מוסדרת בהסכם נפרד, והוא הקובע בכל הנוגע לאחריות, בעלות על הנתונים ורמת השירות.'],
      },
    ],
  } : {
    title: 'Terms of use',
    updated: UPDATED,
    intro: `The rules for using the digital signage system at ${hospital}. Signing in means accepting them.`,
    sections: [
      {
        h: 'Who this is for',
        p: ['Authorised staff only. Registration requires an administrator’s approval, and nothing can be done until that approval is given.'],
      },
      {
        h: 'Your personal code',
        list: [
          'The code is personal. Do not give it to anyone, including a colleague.',
          'Every action taken with your code is recorded under your name.',
          'If your code is exposed, change it immediately under “Settings” or ask an administrator for a new one.',
          'Codes cannot be recovered. A forgotten code is replaced, not retrieved.',
        ],
      },
      {
        h: 'What must never be entered',
        p: ['This is not a clinical system and is not secured to serve as one. In no field and in no message may you enter:'],
        list: [
          'Patient names or identifying details.',
          'Any clinical information — diagnoses, treatments, results.',
          'Patient ID numbers.',
          'Any sensitive personal data not required for signage.',
        ],
      },
      {
        h: 'Fair use',
        list: [
          'Do not change signage for a department you are not responsible for.',
          'Do not use the internal messages for anything unrelated to work.',
          'Misuse is recorded in the log and may cost you your access.',
        ],
      },
      {
        h: 'Availability',
        p: [
          'The system runs on a machine inside the hospital. During maintenance, a power cut or a network fault, signs may show information that is out of date.',
          'Where a sign and an instruction from clinical staff disagree, the staff instruction governs.',
        ],
      },
      {
        h: 'The binding document',
        p: ['These terms cover day-to-day use. The relationship between the hospital and the system’s supplier is governed by a separate agreement, which is what determines liability, data ownership and service levels.'],
      },
    ],
  };
}

function accessibility(s, he) {
  const hospital = (he ? s.hospitalNameHe : s.hospitalNameEn) || (he ? 'בית החולים' : 'the hospital');
  const phone = s.supportPhone || '';

  return he ? {
    title: 'הצהרת נגישות',
    updated: UPDATED,
    intro: `${hospital} רואה חשיבות בכך שהמערכת תהיה שמישה עבור כל אנשי הצוות, לרבות עובדים עם מוגבלות.`,
    sections: [
      {
        h: 'רמת הנגישות',
        p: [
          'המערכת הותאמה לתקן הישראלי ת"י 5568 ברמה AA, המבוסס על הנחיות WCAG של ארגון W3C.',
          'הבדיקה נעשתה על ידי הצוות המפתח בלבד ולא על ידי בודק נגישות מוסמך. לכן אין כאן הצהרה על התאמה מלאה, אלא תיאור של מה שנבדק ומה שלא. בדיקה מוסמכת נדרשת לפני הטמעה בבית החולים.',
        ],
      },
      {
        h: 'מה הותאם ונבדק',
        p: ['כל סעיף כאן נמדד מול הממשק הרץ, ולא נכתב מתוך כוונה:'],
        list: [
          'ניווט במקלדת עם סימון מיקוד ברור, וקישור "דילוג לתוכן" שמאפשר לעקוף את התפריט.',
          'תווית מילולית לכל כפתור — נבדק שאין במסכים אף כפתור בלי שם שקורא מסך יכול להקריא. סמלים דקורטיביים מסומנים ב-aria-hidden כדי שלא יוקראו.',
          'ניגודיות: טקסט רגיל 17.8:1, טקסט משני 7.6:1, וטקסט עזר (כותרות טבלה, חותמות זמן) 5.7:1 — כולם מעל הסף 4.5:1 שהתקן דורש.',
          'תוויות טפסים מקושרות לשדה שלהן, כך שקורא מסך מקריא את שם השדה ולחיצה על התווית ממקדת אותו.',
          'הודעות מערכת מוכרזות דרך aria-live, ושגיאות נמסרות בטקסט ולא בצבע בלבד.',
          'מבנה כותרות יורד בלי דילוגי דרגה, כך שאפשר לנווט בדף לפי כותרות.',
          'תמיכה מלאה בעברית ובכיווניות מימין לשמאל, כולל הצגה תקינה של מספרים ושעות בתוך טקסט עברי.',
          'הגדלה של 200% נבדקה במסך ההגדרות: אין גלילה לרוחב ואין תוכן שנחתך.',
          'כיבוד ההעדפה prefers-reduced-motion — מי שביקש במערכת ההפעלה פחות אנימציות, לא יראה אותן.',
        ],
      },
      {
        h: 'מגבלות ידועות',
        p: [
          'אנו מעדיפים לומר את זה במפורש ולא להצהיר על נגישות מלאה:',
        ],
        list: [
          'לא בוצעה בדיקה מול קורא מסך אמיתי (NVDA, JAWS או VoiceOver). נבדק המבנה שקורא מסך מסתמך עליו, לא ההקראה בפועל.',
          'טבלאות רחבות (שיבוצים, משתמשים) דורשות גלילה לרוחב במסכים צרים.',
          'ההגדלה ל-200% נבדקה במסך ההגדרות בלבד, לא בכל מסך במערכת.',
          'שלטי הדלת מוצגים בגופן גדול ובניגודיות גבוהה, אך לא נמדדו מול התקן — הם מסך תצוגה ולא ממשק שמפעילים.',
          'תוכן שאנשי הצוות מזינים בעצמם — טקסט של הודעה, למשל — נגיש כמידת הבהירות שבה נכתב.',
        ],
        after: ['אם נתקלתם בקושי שאינו מופיע כאן, נשמח שתדווחו — זה מה שמאפשר לתקן.'],
      },
      {
        h: 'פניות בנושא נגישות',
        p: [phone
          ? `לדיווח על בעיית נגישות או לבקשת התאמה, פנו לרכז הנגישות של המערכת בטלפון ${phone}. נשתדל לטפל בפנייה בהקדם.`
          : 'לדיווח על בעיית נגישות או לבקשת התאמה יש לפנות לרכז הנגישות של בית החולים.'],
      },
    ],
  } : {
    title: 'Accessibility statement',
    updated: UPDATED,
    intro: `${hospital} considers it important that this system be usable by every member of staff, including employees with disabilities.`,
    sections: [
      {
        h: 'Level of accessibility',
        p: [
          'The system has been built to the Israeli standard IS 5568 at level AA, which is based on the W3C’s WCAG guidelines.',
          'It was checked by the development team only, not by a certified accessibility auditor. So this is not a claim of full conformance but a description of what was tested and what was not. A certified audit is required before deployment in the hospital.',
        ],
      },
      {
        h: 'What has been done and checked',
        p: ['Every item here was measured against the running interface rather than written from intent:'],
        list: [
          'Keyboard navigation with a clear focus outline, and a "skip to content" link that bypasses the menu.',
          'A text label on every button - checked that no screen carries a button a screen reader cannot name. Decorative glyphs are marked aria-hidden so they are not read out.',
          'Contrast: body text at 17.8:1, secondary text at 7.6:1, and supporting text (table headers, timestamps) at 5.7:1 - all above the 4.5:1 the standard requires.',
          'Form labels linked to their field, so a screen reader announces the field name and clicking the label focuses it.',
          'System messages announced via aria-live, and errors carried in text rather than colour alone.',
          'A heading structure that descends without skipping a level, so the page can be navigated by headings.',
          'Full Hebrew and right-to-left support, including correct display of numbers and times inside Hebrew text.',
          'Enlargement to 200% checked on the Settings screen: no sideways scrolling and no clipped content.',
          'prefers-reduced-motion honoured - anyone who asked their operating system for less animation will not see any.',
        ],
      },
      {
        h: 'Known limitations',
        p: ['We would rather state these plainly than claim full conformance:'],
        list: [
          'No testing has been done against a real screen reader (NVDA, JAWS or VoiceOver). What was checked is the structure a screen reader relies on, not how it actually reads out.',
          'Wide tables (assignments, users) require horizontal scrolling on narrow screens.',
          'The 200% check covered the Settings screen only, not every screen in the system.',
          'Door signs use large type and high contrast but were not measured against the standard - they are a display, not an interface anyone operates.',
          'Content staff enter themselves - the text of a message, for instance - is only as clear as it was written.',
        ],
        after: ['If you hit a barrier that is not listed here, please report it — that is what allows it to be fixed.'],
      },
      {
        h: 'Accessibility contact',
        p: [phone
          ? `To report an accessibility problem or request an adjustment, contact the system’s accessibility coordinator on ${phone}. We aim to respond promptly.`
          : 'To report an accessibility problem or request an adjustment, contact the hospital’s accessibility coordinator.'],
      },
    ],
  };
}

// Everything the browser needs to render the three documents, in one call.
export function legalDocs(settings = {}) {
  const build = (he) => ({
    privacy: privacy(settings, he),
    terms: terms(settings, he),
    accessibility: accessibility(settings, he),
  });
  return { updated: UPDATED, he: build(true), en: build(false) };
}
