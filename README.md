# AIA landing page + premium calculator

Mobile-first landing page for an AIA agent (link in TikTok / Facebook bio). Visitors answer 3 questions and see an estimated premium, then add the agent on LINE.

Live: https://chayanaphat.github.io/

## Layout

```
site/                       website source; index.html has {{PLACEHOLDERS}} for agent details
  index.html                page + quiz UI
  calc.js                   rate tables + premium formulas
  calc.test.js              checks against brochure examples (not published)
scripts/build.mjs           fills placeholders from .env / repo Variables → dist/
.env.example                list of all config keys (copy to .env)
.github/workflows/pages.yml tests → build → deploys dist/ to GitHub Pages
private/, .env, dist/       NOT in git (see .gitignore)
```

## Plans in the calculator

| Goal | Plan |
|---|---|
| Protect family | AIA 20 Pay Life (+ optional CI Plus rider) |
| Critical illness | 1) 20 Pay Life + CI Plus  2) CI SuperCare 20/99 or 10/99 |
| Age 50+ | AIA Senior Happy |

Rates come from AIA brochures and the AIA rate book; each table in `calc.js` names its source.

## Edit

- Agent details (name, licence, phone, LINE, photo/QR/share-image file names, site URL): **`.env`** locally and the matching **GitHub repo Variables** (Settings → Secrets and variables → Actions → Variables). After editing `.env`, sync and redeploy:
  ```
  GH_TOKEN=$(gh auth token --user chayanaphat) gh variable set -R chayanaphat/chayanaphat.github.io -f .env
  GH_TOKEN=$(gh auth token --user chayanaphat) gh workflow run pages.yml -R chayanaphat/chayanaphat.github.io
  ```
- Rates: `site/calc.js`, then run `node site/calc.test.js`
- Publish code changes: commit and push to `main`. The workflow redeploys in about a minute.

## Preview locally

```
node scripts/build.mjs && python3 -m http.server 8787 --directory dist
```
