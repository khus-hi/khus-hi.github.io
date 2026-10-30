# Khushi Teli · Portfolio

A plain HTML/CSS/JS site with no build step and no dependencies. Dark editorial design (with a light toggle), works on phones, and loads fonts from Google Fonts.

```
portfolio-site/
├── index.html         ← home page content (hero, projects, experience, talks, education, contact)
├── project.html       ← one page that shows any project (project.html?p=<slug>)
├── projects.js        ← ALL project content: text, category, cover, GitHub link
├── styles.css         ← colors, fonts, layout
├── script.js          ← home page behavior (tabs, carousels, animations)
├── project-page.js    ← builds project.html from projects.js
└── assets/
    ├── Khushi_Teli_Resume.pdf
    ├── photos/        ← event photos
    ├── projects/      ← illustrated project covers (.svg)
    └── logos/         ← optional company logos
```

## Projects

Every project lives in `projects.js`. Each one has a `category` (Data Engineering, Machine Learning, Analytics & Dashboards, AI & LLMs), which decides which tab it shows under, and a `github` link used by the "View on GitHub" button on its page.

Projects with an empty `github` (`""`) hide the "View on GitHub" button; add a repo URL there to show it again.

To add a project, copy one `{ ... },` block in `projects.js`, give it a new `slug`, and fill in the fields. It appears in the carousel and gets its own page automatically. To add a category, add it to `CATEGORIES` at the top.

## Photos

| File | Where it shows |
|---|---|
| `photos/devconf.jpg` | DevConf card, link preview image |
| `photos/demo-day.jpg` | Demo Day card |
| `photos/medai-hackathon.jpg` | MedAI card |
| `photos/civichacks.jpg` | CivicHacks card |
| `photos/dd4g-presenting.jpg` | Data Days for Good card |
| `photos/dd4g-sign.jpg`, `devconf-badge.jpg`, `redhat-interns.jpg`, `hackathon-bts.jpg`, `dd4g-audience.jpg`, `dd4g-team.jpg` | Not used right now (kept in case you want them later) |

The home page hero is text only, so no headshot is needed.

**Project covers** in `assets/projects/` (`slot-machine.jpg`, `health-etl.jpg`, `aki.jpg`, `medai.jpg`, `moodsense.jpg`, `gateway.jpg`, `foodshed.jpg`, `subway.jpg`, `ecommerce.jpg`, `documentary.jpg`) are project images; replace any with your own image using the same file name. To use a different image, drop a file in that folder and change the project's `cover` in `projects.js`. **Company logos** are in `assets/logos/`. Red Hat (`redhat.svg`), Boston University (`bu.png`) and MassMutual (`massmutual.png`) use their real logos; the others are simple brand-colored tiles ( `gbh.svg`, `muckrock.svg`, `arcon.svg`, `ameya.svg`, `dinsights.svg`, `devconf.svg`). To use an official logo, save it as a square PNG with the same name, e.g. `assets/logos/bu.png`. The PNG is picked up automatically, in both the logo strip and the experience cards.

Keep photos under ~500 KB (about 1600px wide).

**Preview locally:** double-click `index.html`, or run `python3 -m http.server` in this folder and open http://localhost:8000.

**Common edits**
- Text: search `index.html` for the sentence and change it.
- Accent color: change `--accent` at the top of `styles.css` (dark theme) and under `[data-theme="light"]`.
- New resume: replace `assets/Khushi_Teli_Resume.pdf` and keep the same file name.
- New project: see the Projects section above.
- DevConf talk: search `index.html` for "DevConf" to edit the talk title, year and description.

---

## Host it for free on GitHub Pages (recommended)

1. Sign in at github.com as **khus-hi**.
2. Click **+ → New repository**. Name it exactly **`khus-hi.github.io`**, set it to **Public**, and click **Create repository**.
   (Any other name also works, but the URL becomes `khus-hi.github.io/<repo-name>`.)
3. On the new repo page, click **uploading an existing file**.
4. Drag in everything in the folder: all the `.html` and `.js` files, `styles.css`, and the whole `assets` folder. Click **Commit changes**.
5. Go to **Settings → Pages**. Under *Build and deployment*, set Source to **Deploy from a branch**, Branch to **main** and folder to **/ (root)**, then **Save**.
6. Wait 1–2 minutes and open **https://khus-hi.github.io**.

To update later, open the file on GitHub, click the pencil icon, edit, and commit. The site redeploys on its own.

**Using git instead of the upload page:**
```bash
cd portfolio-site
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/khus-hi/khus-hi.github.io.git
git push -u origin main
```

### Your own domain (optional)
Your resume links to **khushiteli.com**. If you own that domain and want it to show this site:
1. In **Settings → Pages → Custom domain**, enter `khushiteli.com` and save.
2. At your domain registrar, add four **A** records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, and a **CNAME** record for `www` pointing to `khus-hi.github.io`.
3. Once DNS updates (minutes to a few hours), tick **Enforce HTTPS**.

Note that this replaces whatever is on khushiteli.com now. This site doesn't link to or load anything from the old one, so nothing breaks when you switch.

---

## Alternatives

**Netlify (easiest, no account setup beyond sign-in)**
1. Go to https://app.netlify.com/drop.
2. Drag the whole `portfolio-site` folder onto the page.
3. You get a URL like `random-name.netlify.app` instantly. Sign in to keep it and rename it under **Site configuration → Change site name**.

**Vercel**
1. Push the folder to a GitHub repo (steps above).
2. At https://vercel.com, sign in with GitHub, click **Add New → Project**, pick the repo and click **Deploy**. Leave the framework as "Other"; no build command is needed.
3. Your site is live at `<project>.vercel.app`, and every push redeploys it.
