# SME HUB — Agent Handover
> Read this completely before writing a single line. This is the full context for continuing the SME South Africa member experience redesign.

---

## 1. Who you are working with

**Client:** Tshepho Joel — Platform Architect & Founder, SME South Africa  
**Project:** `smesouthafrica.co.za` — redesigning a 10-year-old resource platform into a gated membership community ("LinkedIn for SA Founders")  
**GitHub org:** SMEZATech  
**Briefing doc for developer:** `SME-HUB-Developer-Briefing.docx` (in the same folder as the mockups)

---

## 2. The live tech stack (never change this)

| Layer | Tool | Critical constraint |
|---|---|---|
| CMS | WordPress on WP Engine | CPU-sensitive — no plugin bloat, no heavy hidden elements |
| Community | BuddyBoss | Profiles, groups, forums, messages, notifications, directories |
| Memberships | MemberPress | Owns all gating, billing, subscriptions — never rebuild auth |
| Store | WooCommerce | **Sells branded merch only** (caps, hoodies, t-shirts, totes, notebooks) — NOT digital downloads |
| Member resources | MemberPress | Digital downloads/resources live here, NOT in WooCommerce |
| Page builder | Elementor | Never use hide/show responsive toggles on heavy elements |
| Custom post types | JetEngine | Funding applications and live data panels |
| Email | Kit (ConvertKit) | All sends must be staggered — never a simultaneous bulk blast |
| SEO | Yoast / RankMath + Link Whisper | Funding apps gated with noindex |

---

## 3. The 2026 brand system (use exactly as specified — no deviations)

### Colours
| Token | Hex | Use |
|---|---|---|
| Primary red | `#DC183C` | CTAs, Ask type, primary actions, active states |
| Hover red | `#B0142F` | Hover on primary red |
| Accent orange | `#FF9900` | Share type, highlights, gradients |
| Orange text | `#AE6B0A` | Orange text on light backgrounds (WCAG AA) |
| Navy | `#0C1F31` | Dark surfaces, hero headers, navbars |
| Success green | `#29A37A` | Win type, positive states |
| Ink | `#121A21` | Primary body text |
| Muted | `#6A7581` | Secondary / helper text |
| Border | `#E7EBEF` | Card and input borders |
| Background | `#FCFCFC` | Page background |
| Card | `#FFFFFF` | Card backgrounds |

### Tints
| Tint | Hex | Use |
|---|---|---|
| Red tint | `#FDECEF` | Ask backgrounds |
| Green tint | `#E4F5EE` | Win backgrounds |
| Orange tint | `#FFF1E0` | Share backgrounds |

### Fonts
- **Headings / Labels:** Plus Jakarta Sans (500/600/700/800) — `font-jakarta` class
- **Body:** Inter (400/500/600) — default `font-inter`
- **Code / System labels:** system monospace stack (`font-mono` → `ui-monospace`/`monospace`) per the CI doc. ⚠️ Do NOT load JetBrains Mono — it is not a CI font (was removed across all mockups on 2026-06-05 to align with the CI).
- ⚠️ NEVER use Oswald — that was the old pre-2026 brand
- **Body text colour = Ink `#121A21`** (the CI `--foreground`). Navy `#0C1F31` is for **surfaces only** (nav, hero, footer, dark buttons) — never body text. All mockups were corrected to this on 2026-06-05.
- 📄 **Authoritative CI doc:** `C:\Users\Tshepho Joel\Documents\SME SA\2026\Brand CI\sme-brand-ci-2026.html` (+ `.pdf`). Token-checked: red `#DC183C`, orange `#FF9900` (not for small text — use `#AE6B0A` for orange text), navy `#0C1F31`, green `#29A37A`, ink `#121A21`, muted `#6A7581`, border `#E7EBEF`, bg `#FCFCFC` — all match.

### Avatar pattern (all mockups — no real photos)
```html
<div class="rounded-full bg-gradient-to-br from-[#DC183C] to-[#FF9900] grid place-items-center font-jakarta font-bold text-white">TJ</div>
```

### Post type taxonomy (runs EVERYWHERE)
- **Ask** = `#DC183C` red — "I need help"
- **Win** = `#29A37A` green — "I achieved something"
- **Share** = `#FF9900` bg / `#AE6B0A` text — "here's something useful"
- Left-edge stripes: `.stripe-ask`, `.stripe-win`, `.stripe-share` (inset box-shadow)

---

## 4. All mockup files built (in `C:\Users\Tshepho Joel\Documents\SME SA\2026\Mockups\`)

| File | Status | What it is |
|---|---|---|
| `member-hub.html` | ✅ Complete | Community dashboard — composer, feed, Help-a-Founder, Your Activity, Suggested Members, Events, Podcast card, Latest Discussions. Community sub-nav added. |
| `member-account.html` | ✅ Complete | Full member account — Profile (8 tabs) + Account Settings (8 sections incl. POPIA + My Orders/WooCommerce). Messages view. Notifications (dropdown + full page). |
| `single-group.html` | ✅ Complete | Single group — 6 tabs: Feed, Members, Photos, Discussions (with thread view), Manage (organiser-only), Send Invites. |
| `members.html` | ✅ Complete | Members directory — search, filters (sector/stage/region/complete-only), sort, grid/list toggle, connect. |
| `groups.html` | ✅ Complete | Groups directory — All/My groups/Suggested, search, sort, join toggle. |
| `forums.html` | ✅ Complete | Forums — category sidebar + discussion archive (All/Mine/My replies/Favorites), search, pinned-first. |
| `SME-HUB-Developer-Briefing.docx` | ✅ Complete | Word doc briefing for the Elementor developer — plain English, no code, maps everything to BuddyBoss/MemberPress/WooCommerce. |
| `AGENT-HANDOVER.md` | ✅ This file | |

### Public marketing layer (consolidation round 1 — added 2026-06-05)
Recreated the CEO's public Lovable site (`shine-better-web.lovable.app`) in the strict 2026 brand, as the logged-out front door that hands off to the member hub at the Join/Sign-in seam.

| File | Status | What it is |
|---|---|---|
| `index.html` | ✅ Complete | **The consolidated launcher** — one link to every mockup. Navy sidebar groups Public / Member hub / CEO-live mockups; iframe viewer; viewport toggle (desktop/tablet/mobile); deep-link via `#hash`; "Open standalone". This is the GitHub Pages root. |
| `public-home.html` | ✅ Complete | Hero (Build·Grow·Thrive), metrics, 4 pillars, journey stages, founder stories, testimonial, CTA, newsletter+footer. |
| `public-articles.html` | ✅ Complete | SME Articles — featured + grid, working category filters, pagination. |
| `public-resources.html` | ✅ Complete | Resources — 4 types, featured unlock, filterable downloads (MemberPress-gated). |
| `public-funding.html` | ✅ Complete | Apply for Funding — 3 products, process, eligibility, **working loan calculator**, FAQ. Dev brief notes JetEngine CPT + noindex. |
| `public-solutions.html` | ✅ Complete | Solutions comparison — how-it-works + 27-category grid. |
| `public-shop.html` | ✅ Complete | WooCommerce merch only — working cart counter + category filter. |

All public pages carry Dev Mode + Dev briefs and reuse the member-hub chrome conventions. Verified in preview, no console errors.

### Files referenced in earlier handover but NOT present in this folder
`events.html`, `brand_ci`, `newsletter.html`, `podcast.html`, `social_media_studio.html` were listed previously but do not exist here (likely in another folder / the CEO's Lovable). The CEO's `/mockups` section covers Newsletters, Events & Webinars, Event Registration, Webinar Replay — currently linked LIVE in `index.html`, to be rebuilt in-brand in a later round. Also present: `sme-hub-project-brief.md`.

---

## 5. Cross-navigation wiring (all on localhost:8765)

The static server is in `.claude/static-server.js`, launched via `.claude/launch.json` using Node. Start it with the preview tool (`name: "static"`).

```
member-hub.html ──── Feed ─────┐
members.html ─────── Members ──┤  (shared community sub-nav: Feed·Members·Groups·Forums·Events)
groups.html ──────── Groups ───┼──► single-group.html ──► member-account.html
forums.html ──────── Forums ───┘
member-account.html ─ Profile · 8-section Settings · Messages · Notifications
```

**All pages are cross-linked.** Logo → hub. Avatar → account. Groups cards → single-group. Breadcrumbs are accurate.

---

## 6. Architecture decisions made (do not reverse without asking Tshepho)

### Engagement strategy (critical — Tshepho is briefed on this)
- **Feed-first, resources demoted.** The home screen's one job is to prompt participation. Resource tiles/quick-links were removed because they gave lurkers a frictionless exit before they posted. This is intentional and defended.
- **Unanswered-first ribbon.** The hub ribbon shows unanswered asks, not just new ones. Reply-rate is the metric that matters.
- **"Help a Founder" module** in the hub right rail — surfaces 2–3 unanswered asks from the member's sector with one-tap Answer. Highest-leverage retention surface.
- **Profile Strength = participation, not form-filling.** Checklist items include "Post your first Ask" and "Answer a founder's Ask" — not just "add your bio."
- **The ritual card (Ask Friday / Win Wednesday) was REMOVED** — Tshepho decided against it. Do not add it back.

### WooCommerce integration
- The store sells **branded merchandise only** (caps, hoodies, t-shirts, totes, notebooks). No digital downloads in WooCommerce.
- Digital downloads / resources come from **MemberPress** — separate system.
- My Orders in Account Settings shows: merch order history + delivery tracking + addresses/payment links (hand off to WooCommerce secure pages — never rebuild card UI).
- WooCommerce, BuddyBoss and MemberPress all share one WordPress user record — no conflict.

### Podcast
- **Not in the member account** — it's platform content, not member content.
- Lives as a "Latest Episode" card in the hub's right rail (feeds from Spotify RSS).
- Links out to `podcast.html` for the full archive.
- `podcast.html` is a separate content library page, not part of the community account experience.

### CEO's mockups
- Tshepho's CEO also has mockups for some related pages.
- **Do not assume what those cover.** Tshepho said they'd share and consolidate. Ask before building anything that might overlap.

---

## 7. Dev Mode system (present on all files — do not remove)

Every mockup has a **Dev** button (top right). Toggling it on reveals ⓘ badges on every module. Clicking a badge opens a right-side drawer with:
- **Purpose** — what problem it solves
- **Data model** — fields and source
- **Logic** — business rules, edge cases
- **Components** — UI parts involved
- **API endpoint** — exact REST path

This is the specification for the developer. The Word doc briefing explicitly tells the developer to use Dev Mode as their source of truth. **Always add a Dev brief for every new feature you add.**

---

## 8. POPIA compliance (legally required — never remove or reduce)

Under POPIA (Protection of Personal Information Act, South Africa), the Data & POPIA settings section must include:
1. Download my data (JSON export, async — not a synchronous WP Engine request)
2. Delete account (typed "DELETE" confirmation modal)
3. Data retention summary (30-day purge, 5-year SARS/FICA financial records)
4. Information Officer email: `privacy@smesouthafrica.co.za`

WooCommerce order data falls under POPIA scope and must be included in the data export.

---

## 9. Shared code patterns (copy from `member-hub.html` or `member-account.html`, don't reinvent)

```js
// Escape helper
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, ...); }

// Monogram avatar
function monogram(initials, size=44){ ... }
// Output: gradient-to-br from-[#DC183C] to-[#FF9900] circle

// Toast
showToast(msg, kind)  // kind: 'ask' | 'win' | 'share' | null

// Dev brief drawer
openBrief(id)         // id must exist in BRIEFS object
toggleDevMode()       // toggles body.dev-on class

// Overlay system
closeOverlay(id)      // animates out then removes
// .ov / .ov-bg / .drawer / .modalbox — CSS classes, copy from any file
```

### Card pattern
```html
<div class="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm card-lift">
```

### Post stripe (left-edge coloured border)
```css
.stripe-ask   { box-shadow: inset 4px 0 0 0 #DC183C; }
.stripe-win   { box-shadow: inset 4px 0 0 0 #29A37A; }
.stripe-share { box-shadow: inset 4px 0 0 0 #FF9900; }
```

### Profile strength ring (SVG)
```html
<svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 ..." stroke="#F1F5F9" stroke-width="3" fill="none"/>
  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 ..." stroke="#DC183C" stroke-width="3" stroke-linecap="round" fill="none" stroke-dasharray="52, 100"/>
</svg>
```

---

## 10. What's remaining / next logical steps

| Item | Priority | Notes |
|---|---|---|
| **Consolidate with CEO's mockups** | 🟡 In progress | Round 1 done: 6 public pages recreated in-brand + `index.html` launcher pairs everything. Next: rework header/footer across the seam; rebuild CEO's `/mockups` member pages (Newsletters, Events, Event Reg, Webinar Replay) in-brand; reconcile Shop/Funding/Resources ownership across layers. |
| **Update developer briefing doc** | 🟡 Medium | Needs WooCommerce merch orders section + podcast card added (two new items since doc was generated) |
| **`events.html` brand retrofit** | 🟡 Medium | Has old brand tokens — needs 2026 brand pass |
| **`podcast.html` brand retrofit** | 🟡 Medium | Exists, may need 2026 brand pass |
| **Members dir → hub Suggested** | 🟢 Low | Add "Browse all members →" link on hub's Suggested Members card pointing to `members.html` |
| **Groups dir → hub suggested** | 🟢 Low | Same for "Browse all groups →" |
| **Funding directory** | 🟢 Low | JetEngine CPT — ask Tshepho if this is in scope for this round |

---

## 11. Things Tshepho cares about — communication style

- Thinks in product and engagement strategy — not just UI. Engage at that level.
- Appreciated the honest pushback on the "distraction removal" framing (the 90-9-1 / Hick's Law / reply-rate argument). He uses that language now.
- Decisive — when you ask him questions via the question tool, he sometimes skips them and says "do the recommended thing." Default to the most considered recommendation when he does.
- Doesn't want technical jargon in documentation for the developer. Keep it plain English.
- Context window management: he's aware of it. When this file is shared at the start of a new session, orient yourself from it and confirm what you understand before building anything new.

---

## 12. Quick file paths

```
C:\Users\Tshepho Joel\Documents\SME SA\2026\Mockups\
├── member-hub.html          ← Community dashboard (start here for orientation)
├── member-account.html      ← Profile + settings
├── single-group.html        ← Single group
├── members.html             ← Members directory
├── groups.html              ← Groups directory
├── forums.html              ← Forums directory
├── events.html              ← Old brand — retrofit pending
├── podcast.html             ← Exists, check brand
├── brand_ci                 ← Full brand identity (no extension)
├── index.html               ← GitHub Pages directory
├── SME-HUB-Developer-Briefing.docx
├── AGENT-HANDOVER.md        ← This file
└── .claude/
    ├── launch.json          ← Static server config (Node, port 8765)
    └── static-server.js     ← Simple Node static server
```

**To start the preview server:** use the `preview_start` tool with `name: "static"` → serves at `http://localhost:8765/member-hub.html`

---

*Handover written: June 2026 · Session context: member experience redesign, round 1 complete*
