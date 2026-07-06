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
      "text": "**The first section is too tall.**\n\nCurrent: 1905 × 238px. Should be: 1905 × 196px per the mockup.\n\nH1 size: currently 48px, should be 36px.\n\nHeading colour: you used `#0C1F31` — that's a SURFACE colour (backgrounds), not a text colour. For text on this navy hero, use `#FFFFFF`. See brand_ci.html → Colour roles for the full rule.\n\n'Last updated' line: 14px, `rgba(255,255,255,0.55)`.\n\nBreadcrumb above H1: 12px, `rgba(255,255,255,0.55)`, `›` separator at `rgba(255,255,255,0.30)`.\n\nContainer: max-width 1280px, centered.\n\nNo CTAs in this hero.\n\n**All five legal pages (refunds, terms, privacy, popia, advertising disclosure) share this exact design — one template for all.**"
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

  "public-contact.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-03",
      "pending": true,
      "text": "**Please match the mockup exactly on section height — currently coming out too tall.**\n\nSpec:\n- Container: max-width 1024px, centered.\n- Padding: 56px top / 56px bottom.\n- Background: the same navy → maroon gradient as the legal pages, with the dot pattern overlaid at ~70% opacity.\n\nTypography:\n- H1 'Get in touch': **30px mobile / 36px desktop**, Plus Jakarta Sans weight 800, colour `#FFFFFF`.\n- Sub copy: 16px, `rgba(255,255,255,0.70)`, max-width ~576px, centered.\n- Breadcrumb: 12px, `rgba(255,255,255,0.55)`.\n\n**Colour reminder:** H1 is white on navy. Never use `#0C1F31` (surface) or `#121A21` (light-bg ink) for text on this hero. See brand_ci.html → Colour roles."
    },
    "contact-form": {
      "label": "Contact details + form",
      "author": "Tshepho",
      "ts": "2026-07-03",
      "pending": true,
      "text": "Main container: max-width 1024px, 2-column grid on md+ (details left, form right), 48px column gap, 48px top padding.\n\nSection H2 'Contact details': 24px, Plus Jakarta Sans weight 800, colour `#121A21` (ink on light bg).\n\nDetail row icons: 24 × 24, red `#DC183C`.\nDetail row labels: 15px, weight 700, `#121A21`.\nDetail row values: 14px, `#6A7581` (muted).\n\nForm fields: 48px height, 12px border-radius, border `#E7EBEF`. Focus state: red border `#DC183C` + red-tinted focus ring."
    }
  },

  "public-advertise.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-03",
      "pending": true,
      "text": "**Split hero — copy left, image right on desktop; stacks on mobile.**\n\nContainer: max-width 1280px, 2-column grid on lg+ (grid-cols-2), 48px column gap.\nPadding: **64px top/bottom on mobile, 96px on desktop.**\n\nTypography:\n- H1: **36px mobile / 48px tablet / 56px desktop**, Plus Jakarta Sans weight 800, line-height 1.05.\n- 'South African SMEs' in the H1: apply the accent gradient (red `#DC183C` → orange `#FF9900`, 90° or 135°).\n- Sub copy: 18px, `rgba(255,255,255,0.70)`, max-width ~576px.\n\nHero image (right column):\n- Aspect 4/3, border-radius **1.5rem (24px)**, subtle white/10 border, deep shadow.\n\n**Colour reminder:** H1 base colour is `#FFFFFF` (with gradient span for 'South African SMEs'). Never use `#0C1F31` or `#121A21` for text on this navy hero."
    },
    "partner-logos": {
      "label": "Partner logos strip",
      "author": "Tshepho",
      "ts": "2026-07-03",
      "pending": true,
      "text": "White background band directly under the hero. Container max-width 1280px, 40px vertical padding.\n\nLogo pills: `bg #FCFCFC`, border `#E7EBEF`, rounded-full, 24px horizontal / 12px vertical padding. Logo text: 18px, weight 800, colour `#121A21` (ink), letter-spacing tight.\n\nSpacing between logos: ~24–32px."
    }
  },

  "public-articles.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-03",
      "pending": true,
      "text": "**Please match the mockup on padding — dev looks too tall.**\n\nSpec:\n- Container: max-width 1280px.\n- Padding: **48px top / 56px bottom** (pt-12 pb-14). Not py-16 or py-20.\n\nTypography:\n- H1 'SME Insights': **36px mobile / 48px desktop**, Plus Jakarta Sans weight 800, colour `#FFFFFF`, tracking-tight.\n- Sub: 18px, `rgba(255,255,255,0.70)`, max-width ~672px.\n- Content aligned LEFT (not centered).\n- Breadcrumb: 12px in `rgba(255,255,255,0.55)`.\n\nBackground: navy → maroon gradient with dot pattern at 70% opacity."
    },
    "article-grid": {
      "label": "Article grid",
      "author": "Tshepho",
      "ts": "2026-07-03",
      "pending": true,
      "text": "Grid: 1 column mobile, 2 columns sm, 3 columns lg. Gap: **24px** between cards.\n\nEach card: `bg #FFFFFF`, border `#E7EBEF`, border-radius 1rem (16px), overflow-hidden.\n\nCard image: aspect 16/10, object-cover.\nCategory pill (top-left overlay): 10px uppercase, `bg #FDECEF`, colour `#DC183C`, 4px vertical / 10px horizontal padding, rounded-full.\nTitle: 18px, Plus Jakarta Sans weight 700, colour `#121A21` (ink).\nExcerpt: 14px, colour `#6A7581` (muted), 2-line clamp.\nByline avatar: 32 × 32, gradient (red → orange).\nAuthor name: 13px, weight 600, `#121A21`.\nDate · read time: 12px, `#6A7581`."
    }
  },

  "public-article.html": {
    "hero": {
      "label": "First section (article header)",
      "author": "Tshepho",
      "ts": "2026-07-03",
      "pending": true,
      "text": "**Note: this hero sits on a LIGHT background, not the navy hero. Text colour is ink `#121A21`, not white.**\n\nContainer: max-width 1152px, padding 40px top.\n\nTypography:\n- Category pill above H1: 11px uppercase, `bg #FDECEF`, colour `#DC183C`, rounded-full.\n- H1: **30px mobile / 41.6px desktop** (custom 2.6rem), Plus Jakarta Sans weight 800, colour `#121A21` (ink), line-height 1.1, tracking-tight.\n- Max-width on H1: 768px (max-w-3xl). Don't stretch across the full container.\n\nByline row (below H1):\n- Avatar: 40 × 40, gradient (`#DC183C` → `#FF9900`).\n- Author name: 15px, weight 700, `#121A21`.\n- Date · read time: 14px, `#6A7581` (muted).\n- 'Updated <date>' chip: 14px, `#6A7581`, with calendar icon.\n\nSocial share buttons: 36 × 36, 1px border `#E7EBEF`, rounded-full, hover state red `#DC183C`. Icons: 16 × 16."
    }
  },

  "public-category.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-03",
      "pending": true,
      "text": "**Featured card overlaps upward into this hero — please match the overlap exactly.**\n\nSpec:\n- Container: max-width 1280px, LEFT-aligned content (not centered).\n- Padding: **48px top / 112px bottom** (pt-12 pb-28). The extra bottom space is intentional — it makes room for the featured card that overlaps upward with `margin-top: -64px`.\n\nTypography:\n- H1: **36px mobile / 48px desktop**, Plus Jakarta Sans weight 800, colour `#FFFFFF`, tracking-tight.\n- Sub: 18px, `rgba(255,255,255,0.70)`, max-width ~672px.\n- Breadcrumb: 12px, `rgba(255,255,255,0.55)`.\n- 'Browse all categories' link: 14px, weight 700, white, with layout-grid icon.\n\n**Do not shorten the bottom padding of the hero — the featured card needs room to sit half-in / half-out of the hero band.**"
    },
    "featured-card": {
      "label": "Featured card (overlaps hero)",
      "author": "Tshepho",
      "ts": "2026-07-03",
      "pending": true,
      "text": "Card: `bg #FFFFFF`, border `#E7EBEF`, border-radius **1.5rem (24px)**, shadow-xl, margin-top **-64px** (this is what makes it overlap the hero above).\n\nLayout: 2-column grid on md+, 1 column mobile. Left column is image, right is content.\n\nImage: aspect 16/11, object-cover. FEATURED pill top-left: 11px uppercase, `bg #FF9900`, colour `#0C1F31` (navy on orange), rounded-full.\n\nContent right:\n- Category pill: 11px uppercase, `bg #FDECEF`, colour `#DC183C`.\n- Title: 24px mobile / 32px desktop, Plus Jakarta Sans weight 800, colour `#121A21` (ink), line-height 1.15.\n- Excerpt: 16px, colour `#6A7581`.\n- Byline avatar: 40 × 40 gradient. Name 14px weight 700 ink. Date · read time 14px muted."
    }
  },

  "public-sustainability.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-03",
      "pending": true,
      "text": "**Please match the mockup on section height.**\n\nContainer: max-width 1024px, centered content.\nPadding: **56px top / 64px bottom on mobile, 64px / 80px on desktop.**\n\nTypography:\n- H1: **36px mobile / 48px desktop**, Plus Jakarta Sans weight 800, tracking-tight, line-height tight.\n- H1 base colour: `#FFFFFF`. 'Sustainability Solutions' gets accent orange `#FF9900`.\n- Sub: 18px, `rgba(255,255,255,0.70)`, max-width ~672px, centered.\n- Breadcrumb: 12px, `rgba(255,255,255,0.55)`.\n\nTwo CTAs below sub:\n- 'Start your strategy' — red pill `bg #DC183C`, hover `#B0142F`, height 48px, 28px horizontal padding.\n- 'Explore solutions' — outline pill, border `rgba(255,255,255,0.30)`, hover bg `rgba(255,255,255,0.10)`, height 48px.\n\nTrust line below CTAs: 14px, `rgba(255,255,255,0.50)`, with shield-check icon in green `#29A37A`."
    }
  }
};
