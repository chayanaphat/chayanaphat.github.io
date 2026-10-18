# AIA landing page + premium calculator

Mobile-first landing page for an AIA agent (link in TikTok / Facebook bio). Visitors answer 3 questions and see an estimated premium, then add the agent on LINE.

Live: https://topworamet.github.io/aia/

## Layout

```
site/                       the website (published as-is)
  index.html                page, quiz UI, agent CONFIG block
  calc.js                   rate tables + premium formulas
  calc.test.js              checks against brochure examples
.github/workflows/pages.yml runs the tests, then deploys site/ to GitHub Pages
private/                    NOT in git (see .gitignore)
```

## Plans in the calculator

| Goal | Plan |
|---|---|
| Protect family | AIA 20 Pay Life (+ optional CI Plus rider) |
| Critical illness | 1) 20 Pay Life + CI Plus  2) CI SuperCare 20/99 or 10/99 |
| Age 50+ | AIA Senior Happy |

Rates come from AIA brochures and the AIA rate book; each table in `calc.js` names its source.

## Edit

- Agent name, licence, LINE, photo: `CONFIG` near the bottom of `site/index.html`
- Rates: `site/calc.js`, then run `node site/calc.test.js`
- Publish: commit and push to `main`. The workflow redeploys in about a minute.

## Preview locally

```
python3 -m http.server 8787 --directory site
```
