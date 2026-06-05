# SME HUB — Claude Code Project Brief
> Single source of truth. Read this in full before writing a single line of code.

---

## 1. Project Overview

**Platform**: SME South Africa / SME HUB  
**URL**: smesouthafrica.co.za  
**Identity**: A premium membership community for South African SME founders — positioned as "LinkedIn for SA Founders." Transitioned from a news blog to a gated ecosystem.  
**GitHub org**: SMEZATech  
**Platform manager / Architect**: Tshepho Joel

### Core vision
- Human-to-human community engagement (not passive reading)
- High-value funding opportunities
- Digital resources + knowledge sharing
- Three post types run the entire UX: **Ask / Win / Share**

---

## 2. The 2026 Brand System ⚠️ CRITICAL — use exactly as specified

### 2.1 Fonts

| Role | Family | Weights |
|------|--------|---------|
| Headings / Labels | Plus Jakarta Sans | 500 600 700 800 |
| Body | Inter | 400 500 600 |
| System / Code labels only | JetBrains Mono | 400 500 |

```html
<!-- Drop into every mockup <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Typography rules:
- Headings: Plus Jakarta Sans, `font-extrabold` (800), `tracking-tight`
- Section labels: Plus Jakarta Sans, UPPERCASE, `font-bold` (700), `tracking-wide`
- Body / descriptions: Inter 400–500
- Meta / timestamps: Inter 400, muted colour
- Never use Oswald — that was the OLD brand (pre-2026)

### 2.2 Colour Palette

| Name | Hex | HSL | Use |
|------|-----|-----|-----|
| **Primary red** | `#DC183C` | 349 80% 48% | CTAs, Ask type, primary actions, active states |
| **Darker red** | `#B0142F` | 349 78% 38% | Hover state on primary red |
| **Accent orange** | `#FF9900` | 36 100% 50% | Share type, highlights, gradients, icons on dark |
| **Orange (text)** | `#AE6B0A` | 36 90% 36% | Orange text on light backgrounds (WCAG AA) |
| **Navy** | `#0C1F31` | 210 60% 12% | Dark surfaces, hero headers, navbars |
| **Success green** | `#29A37A` | 160 60% 40% | Win type, positive states, profile complete badge |
| **Ink** | `#121A21` | 210 30% 10% | Primary body text |
| **Muted text** | `#6A7581` | 210 10% 45% | Secondary / helper text |
| **Border** | `#E7EBEF` | 210 20% 92% | Card and input borders |
| **Background** | `#FCFCFC` | 0 0% 99% | Page background |
| **Card surface** | `#FFFFFF` | — | Card / panel backgrounds |

Light tint surfaces (use for type-specific backgrounds):

| Tint | Hex | Use |
|------|-----|-----|
| Red tint | `#FDECEF` | Ask backgrounds, light-ask UI |
| Green tint | `#E4F5EE` | Win backgrounds |
| Orange tint | `#FFF1E0` | Share backgrounds |

### 2.3 Ask / Win / Share Taxonomy

**This model runs everywhere — profile, feed, composer, activity, settings, notifications.**

| Type | Colour | Text on light | Use |
|------|--------|---------------|-----|
| **Ask** | `#DC183C` (red) | `text-[#DC183C]` | Request help, advice, connections |
| **Win** | `#29A37A` (green) | `text-[#29A37A]` | Celebrate milestones |
| **Share** | `#FF9900` bg / `#AE6B0A` text | `text-[#AE6B0A]` on white | Resource, lesson, hard-won knowledge |

Left-edge stripe colours (feed posts):
```css
.stripe-ask   { box-shadow: inset 4px 0 0 0 #DC183C; }
.stripe-win   { box-shadow: inset 4px 0 0 0 #29A37A; }
.stripe-share { box-shadow: inset 4px 0 0 0 #FF9900; }
```

### 2.4 Gradients

```css
/* Hero / dark surfaces */
background: linear-gradient(135deg, hsl(210 60% 12%), hsl(210 50% 20%), hsl(349 60% 30%));

/* Accent — avatars, CTAs, active chips */
background: linear-gradient(135deg, #DC183C, #FF9900);
/* Tailwind: bg-gradient-to-br from-[#DC183C] to-[#FF9900] */

/* Warm — light CTA blocks */
background: linear-gradient(135deg, hsl(36 100% 97%), hsl(349 80% 97%));
```

### 2.5 CSS Custom Properties

```css
:root {
  --primary:          349 80% 48%;    /* #DC183C */
  --accent:           36 100% 50%;   /* #FF9900 */
  --navy:             210 60% 12%;   /* #0C1F31 */
  --success:          160 60% 40%;   /* #29A37A */
  --foreground:       210 30% 10%;   /* #121A21 */
  --muted-foreground: 210 10% 45%;   /* #6A7581 */
  --border:           210 20% 92%;   /* #E7EBEF */
  --background:       0 0% 99%;      /* #FCFCFC */
  --card:             0 0% 100%;     /* #FFFFFF */
  --radius:           0.75rem;       /* 12px */
  --shadow-card:      0 2px 8px rgba(12,31,49,.08);
  --shadow-card-hover:0 8px 24px rgba(12,31,49,.12);
  --shadow-glow:      0 0 20px rgba(220,24,60,.18);
}
```

### 2.6 Tailwind CDN Config

```js
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        inter:   ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      colors: {
        primary: '#DC183C',
        accent:  '#FF9900',
        navy:    '#0C1F31',
        success: '#29A37A',
        ink:     '#121A21'
      }
    }
  }
}
```

### 2.7 Component Patterns (copy-paste)

**Card container**
```html
<div class="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
```

**Avatar monogram** (all avatars — no real photos in mockups)
```html
<div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#DC183C] to-[#FF9900] grid place-items-center font-jakarta font-bold text-white text-sm shrink-0">TJ</div>
```

**Primary CTA button**
```html
<button class="bg-[#DC183C] hover:bg-[#B0142F] text-white rounded-full px-6 py-2.5 font-jakarta font-bold text-sm transition">Get Started</button>
```

**Outline button**
```html
<button class="border border-slate-200 hover:border-[#DC183C] hover:text-[#DC183C] text-slate-600 rounded-full px-6 py-2.5 font-jakarta font-semibold text-sm transition">Learn More</button>
```

**Type pill (Ask/Win/Share)**
```html
<!-- Ask -->
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DC183C]/10 text-[#DC183C] text-xs font-bold uppercase tracking-wider">
  <i data-lucide="help-circle" class="w-3 h-3"></i> Ask
</span>
<!-- Win -->
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#29A37A]/10 text-[#29A37A] text-xs font-bold uppercase tracking-wider">
  <i data-lucide="trophy" class="w-3 h-3"></i> Win
</span>
<!-- Share -->
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF9900]/15 text-[#AE6B0A] text-xs font-bold uppercase tracking-wider">
  <i data-lucide="megaphone" class="w-3 h-3"></i> Share
</span>
```

**Section header (left-rail / module)**
```html
<h4 class="font-jakarta font-bold uppercase text-sm text-[#0C1F31] tracking-wide">Section Title</h4>
```

**Navy surface header**
```html
<div class="bg-[#0C1F31] text-white px-6 py-5">
  <p class="text-[10px] font-bold uppercase tracking-widest text-[#FF9900] mb-1">Subtitle</p>
  <h3 class="font-jakarta font-extrabold text-xl">Main Title</h3>
</div>
```

---

## 3. Tech Stack (Live Site)

| Layer | Tool | Notes |
|-------|------|-------|
| CMS | WordPress | On WP Engine (CPU-sensitive) |
| Hosting | WP Engine | Heavy from BuddyBoss + MemberPress combo |
| Community | BuddyBoss | Feed, profiles, forums |
| Memberships | MemberPress | Gating and subscriptions |
| Page builder | Elementor | Do NOT use hide/show responsive toggles on heavy elements |
| Custom Post Types | JetEngine | Used for Funding Applications |
| Code injection | WPCode | For PHP/CSS snippets (prefer over new plugins) |
| Email | Kit (ConvertKit) | Synced via API; must stagger large sends (no thundering herds) |
| SEO | Yoast / RankMath + Link Whisper | Funding Applications gated with noindex |

**WP Engine constraint**: Never do anything that causes CPU spikes — no plugin bloat, no 10k email blasts, no heavy Elementor elements loading hidden.

---

## 4. Deliverables Completed — Do Not Rebuild

| File | Description | Token status |
|------|-------------|--------------|
| `member-hub.html` | Main community dashboard — composer, feed, left/right rails, Dev Mode | ✅ 2026 tokens |
| `brand_ci` (no ext) | Full brand identity document, 15-page HTML + PDF | ✅ 2026 tokens |
| `events.html` | Events + ticketing module | ⚠️ Old tokens (retrofit scheduled) |
| `newsletter.html` | Email capture component | — |
| `podcast.html` | Audio streaming interface | — |
| `social_media_studio.html` | AI social media tool | — |
| `index.html` | GitHub Pages directory (auto-discovers files via API) | ✅ SME navy theme |

### Member Hub — key patterns to inherit
- 3-column layout: `lg:grid-cols-12` → left 3 / center 6 / right 3
- Reveal animation: `@keyframes fadeUp + .reveal` class
- Toast system: `showToast(msg, kind)` where kind = 'ask' | 'win' | 'share' | null
- Sort/filter tabs: rendered by `renderSortTabs()` + `setSort(type)`
- Profile card: navy header with radial warm glow, gradient-to-br avatar
- Contribution stat: clickable → modal showing Asks helped / Wins celebrated / Shares amplified
- Your Activity: Open asks / Resolved asks / Wins shared / Shares posted — each row links to Ask/Win/Share taxonomy
- Suggested Members: scored by interest overlap + profile_complete = true filter
- Dev Mode: `toggleDevMode()` → pulsing ⓘ badges → right-side drawer with implementation briefs

---

## 5. The Mockup Code Standard

Every file is a **single self-contained HTML file** opened directly in a browser. No build tools, no npm, no server.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title | SME HUB</title>

  <!-- 1. Tailwind CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = { /* see 2.6 above */ }
  </script>

  <!-- 2. Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

  <style>
    /* Custom CSS here — keep minimal, prefer Tailwind */
    /* All CSS custom properties from section 2.5 */
  </style>
</head>
<body class="bg-[#FCFCFC] text-[#121A21] font-inter">

  <!-- HTML here -->

  <!-- 3. Lucide Icons (after DOM) -->
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  <script>
    // All JS here
    lucide.createIcons();
  </script>
</body>
</html>
```

**Rules:**
- Tailwind CDN only — no npm, no PostCSS, no build step
- Lucide icons: `<i data-lucide="icon-name"></i>` — call `lucide.createIcons()` after DOM mutations
- Pure vanilla JS — no React, Vue, or jQuery
- Self-contained — must work as `file:///...` (no HTTP server needed)
- Fully interactive — every tab, toggle, modal, and state change wired in JS

---

## 6. Dev Mode Pattern (include in all new mockups)

A toggleable **Dev Mode** that turns the mockup into an annotated spec for the developer.

**How it works:**
1. A "Dev" button in the header (`id="devToggle"`) calls `toggleDevMode()`
2. `toggleDevMode()` adds/removes `dev-on` class on `<body>`
3. CSS: `.dev-badge { display:none } body.dev-on .dev-badge { display:inline-flex }`
4. Every module has a `<button class="dev-badge ...">i</button>` in its header
5. Clicking an ⓘ calls `openBrief(id)` → injects a right-side drawer into `#overlay-root`
6. The drawer shows: **Purpose · Data model · Logic · Components · API endpoint**

**BRIEFS object structure:**
```js
const BRIEFS = {
  feature_id: {
    title: 'Feature Name',
    sub:   'One-line description',
    purpose:    'What problem it solves and behaviour description',
    data:       'Data model / fields / source',
    logic:      'Business logic, triggers, edge cases',
    components: 'UI components involved',
    api:        'GET /v1/endpoint?params'
  }
}
```

Reference `member-hub.html` for the full working implementation (CSS + drawer + modal + toggle).

---

## 7. Next Task: `member-account.html`

**New file** — the complete Member Account experience. Two primary screens navigated via JS (no page reload).

### Screen A: Member Profile Page

**Own-view** (logged-in member viewing their own profile) and **peer-view** (viewing another member's profile).

Sections:
1. **Profile hero**
   - Cover photo area: gradient fallback (`bg-gradient-to-br from-[#0C1F31] to-[#1a3a54]`) with future upload affordance
   - Avatar: large gradient monogram (80–96px), positioned overlapping the cover
   - Name (Plus Jakarta Sans 800), Title + Company (Inter, muted)
   - Stage / Sector / Region — pill tags below the name
   - **Own view**: "Edit Profile" button + Profile Strength bar
   - **Peer view**: "Connect" (primary) + "Message" (outline) buttons + connection status

2. **Stats bar**
   - Contribution: Asks helped · Wins celebrated · Shares amplified (coloured per taxonomy)
   - Connections: count
   - Posts: total count
   - Clicking any stat → filter or open breakdown

3. **About**
   - Bio text (2–3 lines)
   - Website URL
   - Social links: LinkedIn, X/Twitter, WhatsApp Business
   - Location: City, Province

4. **Posts feed** (own posts)
   - Tabs: All / Asks / Wins / Shares
   - Uses same card pattern as member-hub.html feed
   - Each post card has the left-edge stripe (red/green/orange)

5. **Badges / Achievements** (optional section)
   - Contributor tier (Bronze / Silver / Gold based on contribution total)
   - Community tenure badge
   - Event attendee badge

6. **Profile Strength** (own view sidebar or inline)
   - Percentage ring (same as member-hub)
   - Missing fields as actionable prompts ("Add your bio to be 70% complete")

### Screen B: Account Settings

Sidebar layout:
- Left: navigation list (`w-60`, sticky)
- Right: content panel (flex-1)

Settings sections (sidebar items):

| # | Section | Key fields |
|---|---------|------------|
| 1 | **Profile** | Edit name, title, company, bio, website, socials, avatar, cover photo; Stage / Sector / Region dropdowns; LinkedIn / Twitter / WhatsApp URL fields |
| 2 | **Notifications** | Email digest: Daily / Weekly / None toggle; In-app toggles per event: new reply, mention, new ask in sector, win from connection, upcoming event reminder, new suggested connection |
| 3 | **Privacy** | Profile visibility: Community only / Public / Private; Post default visibility; Who can send messages: Everyone / Connections only; Show in member directory: on/off; Show contribution stats: on/off |
| 4 | **Membership** | Current plan (Free / Premium), next billing date, usage bar (posts, connections, events), Upgrade CTA — note in brief that this integrates with MemberPress |
| 5 | **Security** | Change password (current + new + confirm), active sessions list (device + location + last active + revoke), 2FA toggle (future — show as disabled/coming soon) |
| 6 | **Data & POPIA** | **Legally required for South African platforms.** Download my data (JSON export), delete account (confirm with typed "DELETE"), data retention policy summary, link to Information Officer email |

### Design notes for member-account.html

- Match `member-hub.html` visual language exactly (same cards, same avatar pattern, same pills)
- JS-driven navigation: clicking a settings section shows/hides the relevant panel (no page reload)
- Profile page and settings page are separate "views" toggled by JS — a single HTML file
- Screenshots of the current WordPress/BuddyBoss design will be shared; use them to understand the current information architecture, but redesign everything on the 2026 brand
- Desktop-first (1280px layout), fully responsive to 375px mobile
- Include the Dev Mode ⓘ system with complete briefs for each settings section (POPIA brief should explain the legal requirement and data export endpoint)

---

## 8. Compliance Notes

**POPIA (Protection of Personal Information Act — South Africa)**
- Applies to all personal data: name, email, company, posts, connections
- Information Officer email is designated
- Members must be able to: download their data, request deletion, understand retention policy
- The Data & POPIA settings section is **non-negotiable** — not an optional nice-to-have

**WordPress constraints (for dev briefs)**
- No plugin bloat — prefer WPCode PHP/CSS snippets
- MemberPress handles all membership gating — do not build custom auth
- BuddyBoss handles member profiles / groups / forum — extend it, don't replace it
- Elementor: never use "Hide on Desktop/Mobile" responsive toggles on heavy elements (they still load in the DOM and drain CPU)
- Email via Kit (ConvertKit): all sends must be batched — never trigger a 10k+ simultaneous send

---

## 9. Brand Logos (reference URLs — live assets)

| Asset | URL | Format | Use |
|-------|-----|--------|-----|
| SME South Africa (colour) | `https://smesouthafrica.co.za/wp-content/uploads/2025/10/Asset-1-1.webp` | WebP, transparent | On light backgrounds |
| SME South Africa (white) | `https://smesouthafrica.co.za/wp-content/uploads/2022/05/sme-white-logo.png` | PNG, transparent | On dark / navy backgrounds |
| SME Funding | `https://smesouthafrica.co.za/wp-content/uploads/2026/03/sme-funding-logo.svg` | SVG | Funding section |
| SME Brief | `https://smesouthafrica.co.za/wp-content/uploads/2026/05/SME_Brief_Logo.png` | PNG | Editorial section |
| SME Funding Summit | `https://events.smesouthafrica.co.za/wp-content/uploads/2025/10/sme-summit-logo.svg` | SVG (vector) | Events section |

---

## 10. File Naming Convention

| File | Description |
|------|-------------|
| `member-hub.html` | Community dashboard (done) |
| `member-account.html` | **Next task** — profile + settings |
| `events.html` | Events module (retrofit pending) |
| `brand_ci` | Brand CI (no extension — historical) |
| `index.html` | GitHub Pages directory |

---

*Last updated: June 2026 · Architect: Tshepho Joel · Platform: SME South Africa*
