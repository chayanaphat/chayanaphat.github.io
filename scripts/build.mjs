// Builds dist/ from site/, filling {{KEY}} placeholders in index.html.
// Values come from .env (local) and/or environment variables (GitHub Actions repo Variables);
// a non-empty environment variable overrides .env.
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const KEYS = [
  'SITE_URL', 'AGENT_FULL_NAME', 'AGENT_NICKNAME', 'AGENT_TITLE', 'AGENT_LICENSE', 'AGENT_PHONE',
  'AGENT_PHOTO', 'AGENT_BADGES', 'LINE_OA_ID', 'LINE_URL', 'LINE_QR', 'OG_IMAGE', 'OG_IMAGE_VERSION',
];

function readDotEnv(path) {
  const out = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    out[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return out;
}

const fileEnv = readDotEnv('.env');
const env = {};
for (const k of KEYS) env[k] = process.env[k] || fileEnv[k] || '';

const missing = KEYS.filter((k) => !env[k]);
if (missing.length) {
  console.error(`Missing config: ${missing.join(', ')}\nSet them in .env (see .env.example) or as GitHub repo Variables.`);
  process.exit(1);
}
if (!env.SITE_URL.endsWith('/')) env.SITE_URL += '/';

const config = {
  agentName: `${env.AGENT_FULL_NAME} (${env.AGENT_NICKNAME})`,
  agentShort: `${env.AGENT_NICKNAME} AIA`,
  agentTitle: env.AGENT_TITLE,
  license: `ใบอนุญาตตัวแทนเลขที่ ${env.AGENT_LICENSE}`,
  photo: env.AGENT_PHOTO,
  badges: env.AGENT_BADGES.split(',').map((b) => b.trim()).filter(Boolean),
  // LINE Official Account ID (starts with @) pre-fills the chat with the quote;
  // without it, lineUrl is opened and the quote is copied to the clipboard instead.
  lineOA: env.LINE_OA_ID,
  lineUrl: env.LINE_URL,
  phone: env.AGENT_PHONE,
};

const escapeHtml = (v) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

rmSync('dist', { recursive: true, force: true });
cpSync('site', 'dist', { recursive: true, filter: (src) => !src.endsWith('.test.js') });

let html = readFileSync('dist/index.html', 'utf8');
html = html.replace('{{CONFIG_JSON}}', JSON.stringify(config, null, 2).replace(/</g, '\\u003c'));
html = html.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => {
  if (!(key in env)) throw new Error(`Unknown placeholder ${match} in site/index.html`);
  return escapeHtml(env[key]);
});
writeFileSync('dist/index.html', html);

for (const f of [env.AGENT_PHOTO, env.LINE_QR, env.OG_IMAGE]) {
  if (!existsSync(`dist/${f}`)) {
    console.error(`File not found in site/: ${f}`);
    process.exit(1);
  }
}
console.log(`Built dist/ for ${env.SITE_URL}`);
