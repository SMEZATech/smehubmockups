# 🚀 SME HUB — Platform UI Architecture

Central directory for the front-end architecture, interactive prototypes, and modular components engineered for the South African SME ecosystem.

**Open [`index.html`](index.html)** — the Mockup Hub launcher. It is one link to every prototype: a grouped sidebar with an in-place preview, viewport toggles (desktop / tablet / mobile), and deep-linking (e.g. `index.html#public-funding.html`).

---

## 🧭 What's inside

### Public marketing site (logged-out front door)
Recreated in the strict 2026 brand; hands off to the member hub at the **Join / Sign in** seam.

| File | Module |
|---|---|
| [public-home.html](public-home.html) | Hero, metrics, pillars, journey stages, founder stories, CTA |
| [public-articles.html](public-articles.html) | Articles archive with category filters + pagination |
| [public-resources.html](public-resources.html) | Resource library (MemberPress-gated downloads) |
| [public-funding.html](public-funding.html) | Funding products, eligibility, **working loan calculator**, FAQ |
| [public-solutions.html](public-solutions.html) | Solutions comparison — 27 categories |
| [public-shop.html](public-shop.html) | WooCommerce merch — working cart |

### Member community hub (logged-in)
| File | Module |
|---|---|
| [member-hub.html](member-hub.html) | Community dashboard — feed-first, Help-a-Founder, activity |
| [member-account.html](member-account.html) | Profile + 8-section settings (incl. POPIA), messages, notifications |
| [members.html](members.html) · [groups.html](groups.html) · [single-group.html](single-group.html) · [forums.html](forums.html) | Directories + single-group + forums |

### Content modules
| File | Module |
|---|---|
| [events.html](events.html) | Events directory — upcoming / past toggles |
| [newsletter.html](newsletter.html) | Newsletter capture + reading experience |
| [podcast.html](podcast.html) | Podcast UI — "studio dark mode" audio interface |
| [social_media_studio.html](social_media_studio.html) | AI social-media strategist + brand asset generator |
| [Startup_Africa_Newsletter_Comparison.html](Startup_Africa_Newsletter_Comparison.html) | Newsletter comparison |

### Reference
- [brand_ci.html](brand_ci.html) — brand identity. The **authoritative 2026 CI** is `SME SA/2026/Brand CI/sme-brand-ci-2026.html`.
- [AGENT-HANDOVER.md](AGENT-HANDOVER.md) · [SME-HUB-Developer-Briefing.docx](SME-HUB-Developer-Briefing.docx) — build context + the plain-English developer briefing.

> **Note:** the content modules above still carry pre-2026 brand tokens (and JetBrains Mono) and are queued for a CI-alignment pass. The public site + member hub are already aligned: Ink `#121A21` body text, navy `#0C1F31` surfaces only, Jakarta + Inter, system mono.

---

## 🎨 Brand (2026)
Red `#DC183C` · Orange `#FF9900` (text: `#AE6B0A`) · Navy `#0C1F31` (surfaces) · Green `#29A37A` · Ink `#121A21` (text) · Muted `#6A7581` · Border `#E7EBEF` · Background `#FCFCFC`. Fonts: **Plus Jakarta Sans** (headings) + **Inter** (body). Never Oswald.

Every module carries a **Dev Mode** toggle (top-right) — tap any ⓘ badge for the implementation brief (purpose, data model, logic, components, API).

## 🛠 Tech
Semantic HTML5 · Tailwind (CDN) · vanilla JS · Lucide icons. No build step. For GitHub Pages, `index.html` is the site root.

---

## ⚖️ Copyright
© 2026 Tshepho Joel. All rights reserved. This repository and its contents (HTML, CSS, JavaScript, and UI/UX design architectures) are proprietary assets belonging to Tshepho Joel. Unauthorised copying, modification, distribution, or commercial use, via any medium, is strictly prohibited without explicit written permission from the copyright holder.
