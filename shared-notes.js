/*
 * SME South Africa — Shared review notes.
 * These notes ship with the repo — everyone sees them on the mockup hub.
 * Add / edit these from control.html → the "Shared notes" panel.
 *
 * Shape: { [file]: { [sectionId]: { label, text, author, ts } } }
 */
window.SHARED_NOTES = {

  "public-refunds.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-02",
      "text": "**The first section is too tall.**\n\nCurrent: 1905 × 238px. Should be: 1905 × 196px per the mockup.\n\nH1 size: currently 48px, should be 36px.\n\nHeading colour: you used `#0C1F31` — that's a SURFACE colour (backgrounds), not a text colour. For text on this navy hero, use `#FFFFFF`. See the general colour note below.\n\n'Last updated' line: 14px, `rgba(255,255,255,0.55)`.\n\nBreadcrumb above H1: 12px, `rgba(255,255,255,0.55)`, `›` separator at `rgba(255,255,255,0.30)`.\n\nContainer: max-width 1280px, centered.\n\nNo CTAs in this hero.\n\n**All five legal pages (refunds, terms, privacy, popia, advertising disclosure) share this exact design — one template for all.**"
    }
  },
  "public-terms.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-02",
      "text": "Same fix as public-refunds — first section is too tall.\n\nTarget: 1905 × 196px (currently 238px). H1: 36px (currently 48px).\n\nOne shared template across all legal pages."
    }
  },
  "public-privacy.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-02",
      "text": "Same fix as public-refunds — first section is too tall.\n\nTarget: 1905 × 196px (currently 238px). H1: 36px (currently 48px).\n\nOne shared template across all legal pages."
    }
  },
  "public-popia.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-02",
      "text": "Same fix as public-refunds — first section is too tall.\n\nTarget: 1905 × 196px (currently 238px). H1: 36px (currently 48px).\n\nOne shared template across all legal pages."
    }
  },
  "public-advertising-disclosure.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-02",
      "text": "Same fix as public-refunds — first section is too tall.\n\nTarget: 1905 × 196px (currently 238px). H1: 36px (currently 48px).\n\nOne shared template across all legal pages."
    }
  },

  "public-about.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-01",
      "text": "Hide the picture on mobile — the first section should only show copy and buttons on small screens."
    }
  },

  "public-home.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-02",
      "text": "Hide the picture on the right on mobile — the first section should only show copy, CTA and stats on small screens."
    },
    "business-journey": {
      "label": "Guidance at Every Stage",
      "author": "Tshepho",
      "ts": "2026-07-02",
      "text": "**Icon size is wrong.**\n\nCurrent: 32 × 32px. Should be: **24 × 24px** per the mockup.\n\nLucide icons render at 24 × 24 by default — don't upscale. Keep the icons at their native size."
    },
    "founder-focus": {
      "label": "Founder Focus (featured cards)",
      "author": "Tshepho",
      "ts": "2026-07-02",
      "text": "Remove the category tag overlay from the featured images. The card title and byline carry the category context — no need for the red pill on the image."
    }
  },

  "brand_ci.html": {
    "colours": {
      "label": "Colour usage · read this first",
      "author": "Tshepho",
      "ts": "2026-07-02",
      "text": "Colours have **roles**, not just values. Two dark shades look almost identical but do very different jobs — please read this before picking a hex:\n\n**Surfaces (backgrounds):**\n- `#0C1F31` — navy · dark hero sections, dark cards, dark bands\n- `#FCFCFC` — off-white · page background\n- `#F4F6F8` — light neutral · alternating section backgrounds\n\n**Text on light backgrounds:**\n- `#121A21` — ink · primary text (H1, H2, body, CTAs)\n- `#6A7581` — muted · secondary text (dates, byline, 'Last updated', card meta)\n- `#374151` — reading grey · long-form article body (optional, slightly softer than ink)\n\n**Text on dark (navy) backgrounds:**\n- `#FFFFFF` — primary text (H1, body)\n- `rgba(255,255,255,0.75)` — sub copy under H1\n- `rgba(255,255,255,0.55)` — muted (breadcrumb, 'Last updated', meta)\n- `rgba(255,255,255,0.30)` — very muted (separators like `›`)\n\n**Brand accents:**\n- `#DC183C` — red · primary CTAs, key accents, hover states\n- `#FF9900` — orange · secondary accents, chips, highlights\n- `#29A37A` — green · success, positive stats\n- `#AE6B0A` — amber · warning/inform, muted callouts\n\n**Borders:**\n- `#E7EBEF` — hairline borders, dividers\n\n**Common mistake to avoid:** using `#0C1F31` for a heading. `#0C1F31` is a surface — if a heading sits on a WHITE card, it should be `#121A21` (ink), never `#0C1F31`. If a heading sits on a NAVY (`#0C1F31`) hero, it should be `#FFFFFF`.\n\nThe mockup is the source of truth. If you're unsure which token to use, inspect the mockup element with dev tools and copy the exact value — don't guess and don't 'round' to a similar colour."
    },
    "typography": {
      "label": "Typography sizes · quick reference",
      "author": "Tshepho",
      "ts": "2026-07-02",
      "text": "**Sizes are exact. Please don't round them.**\n\n**Headings (Plus Jakarta Sans, weight 800):**\n- H1 hero (light bg): 48px mobile / 60px desktop\n- H1 hero (legal / short pages): **36px mobile / 48px desktop**\n- H2 section: 30px mobile / 36px desktop\n- H3 card: 18px\n- H4 sub-card: 15–16px\n\n**Body & meta (Inter):**\n- Body: 15–16px, weight 400\n- Sub-copy under H1: 18–20px, weight 400\n- Card body: 14px\n- Meta / byline / 'Last updated' / breadcrumb: **12–14px**\n\n**Icons:** 24 × 24px unless the mockup shows a larger decorative icon (48px in feature circles, 20px in inline text).\n\n**When in doubt: inspect the mockup, copy the exact value.**"
    }
  }
};
