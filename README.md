# Aariv's Web Studio

I'm Aariv, a high-school freshman, and this repository is the static site generator and QA workbench for my small pro bono web studio. I build **free, fast, accessible static websites for local charities**—mostly volunteer-run cat rescues and neighborhood food pantries—alongside open-source developer tools I use in my own workflow.

- **Live Case Studies & Interactive Workbench:** [https://aariv.me/studio-site/](https://aariv.me/studio-site/)
- **Deployed Pages Repo:** [`draarivpatel-ui/studio-site`](https://github.com/draarivpatel-ui/studio-site)
- **Portfolio:** [https://aariv.me](https://aariv.me)

---

## Why I Started Doing Free Builds for Local Nonprofits

When you look at the websites of small, all-volunteer charities, you see the same two problems over and over:
1. **Heavy, neglected page-builder templates** that ship 2–4 MB of JavaScript before rendering a single paragraph on a budget phone.
2. **Critical information trapped in scanned PDF flyers**—like a food pantry's Tuesday distribution hours or whether a first-time visitor needs to bring a photo ID—forcing someone standing at a bus stop on spotty mobile data to pinch-zoom an image just to get answers.

Volunteer coordinators don't have the time or budget to maintain complex CMS plugins, and people looking for food assistance or trying to trap a sick outdoor cat shouldn't have to fight popups and broken layouts. So I started offering free builds with a strict set of engineering rules:

- **Under 18 KB of HTML + CSS** (zero runtime JavaScript frameworks, zero external tracking scripts).
- **WCAG AAA primary text contrast (≥ 7.0:1)** on warm, low-glare paper surfaces so pages are easy to read outdoors on a phone.
- **48×48px minimum tap targets** and logical HTML5 landmarks (`header`, `nav`, `main`, `section`, `footer`) that work cleanly with VoiceOver and keyboard navigation.
- **Plain, zero-stigma language** that puts the visitor's most urgent question in the top 320 pixels of the screen.

*(Note on privacy: To respect the volunteer coordinators and neighbors who use these services, the charity names, street addresses, and live charity domains are anonymized across `sites.json` and the screenshots.)*

---

## The 4 Shipped Nonprofit Case Studies

| # | Case Study | Audience & Core Design Problem | Key Engineering Decisions |
|---|---|---|---|
| **01** | **[A foster-based cat rescue](https://aariv.me/studio-site/foster-cat-rescue.html)** | 82% of visitors arrive from Instagram/Facebook links on a phone and get confused because there is no physical shelter building to visit. | Placed a 3-step *How Foster-to-Adopt Works* walkthrough directly below the hero; locked cat portraits into `4/3` CSS aspect-ratio frames (`CLS = 0.00`); replaced tiny icon badges with plain-text medical/temperament tags (`14.8:1` espresso-on-cream contrast). |
| **02** | **[A community food pantry](https://aariv.me/studio-site/food-pantry.html)** | Neighbors checking distribution hours and ID rules on prepaid phones, plus donors looking for drop-off windows and needed staples. | Moved open hours, transit lines, and a bold *"No ID or proof of income required"* notice out of a PDF flyer into the top 320px of native 18px HTML; separated the *Need Food* and *Donate Staples* flows so fundraising never blocks someone looking for groceries. |
| **03** | **[A no-kill cat rescue](https://aariv.me/studio-site/cat-rescue.html)** | Monthly medical-fund donors and adopters looking for special-needs, diabetic, or senior cats. | Built concrete *"What your gift covers"* cost cards (`$25` microchip/rabies, `$120` dental extraction) paired with a non-intrusive sticky header donate pill (`7.8:1` AAA crimson) and a dedicated spotlight grid for senior and bonded-pair cats. |
| **04** | **[A community-cat (TNR) rescue](https://aariv.me/studio-site/community-cat-rescue.html)** | First-time colony caretakers standing outside at dawn or dusk who need to know trapping rules and kitten age thresholds right away. | Designed the homepage like a rugged field manual: a numbered 5-step Trap-Neuter-Return timeline, a *"Found Kittens? Wait Before You Scoop"* decision tree, and zero-JS native `<details>` accordions with high-visibility caution callouts (`15.9:1` contrast). |

---

## Interactive Studio Workbench (`inspector.js`)

The generated showcase site isn't just static text—it includes a client-side studio workbench (`dist/inspector.js`) on both the index page and every individual case study page:

1. **Live WCAG 2.1 Contrast & Token Verifier:** Load any of the 4 charity color palettes with one click or enter custom foreground/background hex codes to calculate live relative luminance ratios and test `AA Body (≥4.5:1)`, `AAA Body (≥7.0:1)`, and `AA Large/UI (≥3.0:1)` compliance.
2. **Responsive Breakpoint & 12-Column Swiss Grid Inspector:** Switch case study previews between Desktop (`1200px`), Tablet (`768px`), and Mobile (`375px`) layout specs and toggle a 12-column Swiss editorial grid overlay over the interface screenshots.
3. **Live DOM & Payload Verifier:** Filter case studies by category (`Animal Rescue`, `Food Access`, `TNR Field Guide`) and run an in-browser DOM check that verifies heading hierarchy, image `alt` descriptions, and landmark count.

---

## Architecture & Build Pipeline

Everything in this repository runs on standard Node.js (`>= 18`) with **zero `node_modules` dependencies**:

- [`sites.json`](sites.json) — Structured engineering specs for all 4 charity builds (problem statements, first-person build notes, typography stacks, hex color tokens + contrast ratios, before/after benchmarks, and HTML5 landmarks) plus studio tools.
- [`build.mjs`](build.mjs) — Reads `sites.json`, copies `screenshots/*.png` into `dist/screenshots/`, and generates `dist/index.html`, the four case-study HTML pages, `dist/styles.css`, and `dist/inspector.js`.
- [`qa-audit.mjs`](qa-audit.mjs) — Automated static verifier that parses every generated file in `dist/` and checks:
  - True WCAG 2.1 relative luminance contrast ratios across all color pairs in `sites.json`
  - Strict heading hierarchy (exactly one `<h1>` per page, zero skipped heading levels)
  - Presence of `<main id="content">`, `header[role="banner"]`, `footer[role="contentinfo"]`, and keyboard skip-links
  - Non-empty descriptive `alt` text and on-disk file existence for every `<img>`
  - Internal `<a href="...">` link integrity and `< 32 KB` raw HTML page weight budgets

### Build & Run the QA Audit Locally

```sh
node build.mjs      # Generates dist/index.html, 4 case study pages, styles.css, and inspector.js
node qa-audit.mjs   # Verifies WCAG contrast ratios, heading hierarchy, alt attributes, and links
```

---

## Open-Source Developer Tools From the Studio

Alongside the charity websites, I build small open-source utilities for my own daily coding workflow:

- **[Devlog Timer](https://github.com/draarivpatel-ui/devlog-timer)** ([live app](https://aariv.me/devlog-timer/)) — Stardance chronograph & devlog workbench with a 10-hour SVG radial cap dial, Pomodoro sprints with Web Audio synthesized chimes, timestamped commit-split notes, and a live Markdown compiler.
- **[Regatta](https://github.com/draarivpatel-ui/regatta)** — Native macOS workspace manager for isolating parallel Git worktrees with repository safety rails.
- **[wasitme](https://github.com/draarivpatel-ui/wasitme)** — Local diff-timeline inspector that reconstructs file-by-file authorship and session history across local repositories.
- **[armillary](https://github.com/draarivpatel-ui/armillary)** — Offline-first macOS archive that indexes local terminal and editor transcripts in SQLite FTS5.
- **[busyholm](https://github.com/draarivpatel-ui/busyholm)** — A tiny papercraft river island on the edge of your screen that grows buildings and bridges as you ship commits.

## License

Code is licensed under the [MIT License](LICENSE). Charity screenshots are anonymized and belong to their respective organizations.
