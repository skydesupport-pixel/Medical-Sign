// Rebuilds docs/ - the serverless demo that GitHub Pages publishes.
//
// docs/ is public/ with one line added (demo.js) and one file generated
// (legal.json). Keeping that as a script rather than hand-copying is the
// only way the demo does not quietly drift away from the real app.
//
//   node build-demo.js

import fs from 'node:fs';
import path from 'node:path';
import { legalDocs } from './lib/legal.js';

const SRC = path.join(process.cwd(), 'public');
const OUT = path.join(process.cwd(), 'docs');

// The demo's hospital, so its documents name the same place its data does.
// Must match the settings in docs/demo.js.
const DEMO_SETTINGS = {
  hospitalNameHe: 'בית החולים לדוגמה',
  hospitalNameEn: 'Example Medical Center',
  supportPhone: '052-3748060',
};

/* Written below rather than copied from public/. */
const GENERATED = new Set(['demo.js', 'legal.json']);

/* The mock backend. It used to live only in docs/, which made the build
   non-reproducible: wipe docs/ and demo.js was gone for good, because
   nothing regenerates it. It is a source file now, like any other. */
const DEMO_BACKEND = path.join(process.cwd(), 'demo', 'demo.js');

function copyTree(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) copyTree(src, dst);
    else if (!GENERATED.has(entry.name)) fs.copyFileSync(src, dst);
  }
}

copyTree(SRC, OUT);

fs.copyFileSync(DEMO_BACKEND, path.join(OUT, 'demo.js'));

/* The demo has no server, so the app cannot call GET /api/legal. Write the
   same documents out as a static file and let demo.js serve them from there. */
fs.writeFileSync(
  path.join(OUT, 'legal.json'),
  JSON.stringify(legalDocs(DEMO_SETTINGS), null, 2),
  'utf8',
);

/* Load the mock backend BEFORE the app, in both pages that have one.
   After was wrong: app.js asks /api/public for the support number the
   moment it loads, and with demo.js not yet parsed that call went to a
   real network, failed, and the login screen fell back to "ask an
   administrator" - so the WhatsApp line never appeared on the demo. */
for (const page of ['index.html', 'display.html']) {
  const file = path.join(OUT, page);
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('src="demo.js"')) continue;

  const appTag = html.match(/<script src="(?:app|display)\.js"><\/script>/);
  html = appTag
    ? html.replace(appTag[0], `<script src="demo.js"></script>\n${appTag[0]}`)
    : html.replace('</body>', '<script src="demo.js"></script>\n</body>');
  fs.writeFileSync(file, html, 'utf8');
}

console.log('docs/ rebuilt from public/ (+ demo.js, legal.json)');
