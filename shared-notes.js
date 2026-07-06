/*
 * SME South Africa — Shared review notes.
 * These notes ship with the repo — everyone sees them on the mockup hub.
 * Notes flagged with "pending": true stay in Mission Control for operator review
 * and DO NOT surface on the public launcher until that flag is stripped.
 *
 * Add / edit these from control.html → the "Shared notes" panel.
 * Shape: { [file]: { [sectionId]: { label, text, author, ts, pending? } } }
 */
window.SHARED_NOTES = {
  "brand_ci.html": {
    "article-card-reading-order": {
      "label": "Variant A · Article card reading order",
      "author": "Tshepho",
      "ts": "2026-07-04",
      "pending": true,
      "text": "**Article preview cards: title always comes first under the image.**\n\nCorrect order:\n1. Image (with category overlay top-left)\n2. **Title** (Plus Jakarta Sans, weight 800)\n3. Excerpt (14px muted, 2-line clamp)\n4. Divider (1px `#E7EBEF`)\n5. Byline row: 30px gradient avatar + author name (13px Jakarta bold, ink) with `date · X min read` (12px muted) directly under the name\n\n**Never** put date/read-time as its own row above the title. This matches the editorial standard used by Medium, Substack, The Guardian and every major SA publication — the title is what readers scan first, meta info sits with the author at the bottom.\n\nApplied consistently across:\n- public-articles.html grid cards\n- public-category.html grid cards\n- public-home.html Founder Focus cards\n- public-funding-category.html article cards\n- public-article.html related articles\n\nBrand CI Variant A has been corrected to match."
    },
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
      "text": "**Sizes are exact. Please don't round them.**\n\n**Headings (Plus Jakarta Sans, weight 800):**\n- H1 hero (light bg): 48px mobile / 60px desktop\n- H1 hero (legal / short pages): **36px mobile / 48px desktop**\n- H1 hero (contact / short): 30px mobile / 36px desktop\n- H1 hero (advertise / marketing): 36px mobile / 48px tablet / 56px desktop\n- H1 article header: 30px mobile / 41.6px desktop (colour `#121A21` — light bg!)\n- H2 section: 30px mobile / 36px desktop\n- H3 card: 18px\n- H4 sub-card: 15–16px\n\n**Body & meta (Inter):**\n- Body: 15–16px, weight 400\n- Sub-copy under H1: 18–20px, weight 400\n- Card body: 14px\n- Meta / byline / 'Last updated' / breadcrumb: **12–14px**\n\n**Icons:** 24 × 24px unless the mockup shows a larger decorative icon (48px in feature circles, 20px in inline text).\n\n**When in doubt: inspect the mockup, copy the exact value.**"
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

  "public-advertising-disclosure.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-02",
      "text": "Same fix as public-refunds — the first section is too tall.\n\nSpacing: ~48px top / ~64px bottom. Container maxed at 1280px.\n\nTypography: H1 in Plus Jakarta Sans 800, 36px mobile / 48px desktop. Breadcrumb 12px in white 55%. 'Last updated' line 14px in white 55%."
    }
  },

  "public-article-categories.html": {
    "section-2-icons": {
      "label": "Section 2 - Icons",
      "author": "Tshepho",
      "ts": "2026-07-06",
      "text": "- Update your heading to H1 (Browse by Category) is currently set to H2\n- Please update the rendered size size on the icon: the outlin size should be 48x48px and the icon size should be24x24px as per the mockup. Currently it is 26x26px and your outline size is 52x52px\n- The font size for the Top Category names should be 20px\n- Please pull ALL categories there except the newsletter, i have updated the mockup to show the same."
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

  "public-articles.html": {
    "first-section": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-03",
      "text": "Please keep the icon by browse by category 16x16 as per the mockup"
    },
    "jet-articles-listing-grid": {
      "label": "Jet Articles Listing Grid",
      "author": "Tshepho",
      "ts": "2026-07-03",
      "text": "Currently the rendered size is 378x198, it should be 393x245 as per the mockup"
    },
    "listing-articles-grid-third-section": {
      "label": "Listing Articles Grid - Third Section",
      "author": "Tshepho",
      "ts": "2026-07-03",
      "text": "I know the current design was following the Brand CI order but i have updated that now to match the mockup. This means the order after the feature image, shoudl start first with the Article Title instead o the data+ est read. Please update this listing grid accordingly.. Please also take into account the same words limit (16 words) applied on the mockup plus the three dots applied after that."
    },
    "space-between-the-header-and-featured-content-mobile": {
      "label": "Space - Between the header and featured content (Mobile)",
      "author": "Tshepho",
      "ts": "2026-07-03",
      "text": "Please adjust your top padding, currently is set to 4em..please adjust to to 3em as per the mockup"
    }
  },

  "public-category.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-03",
      "pending": true,
      "text": "**Featured card overlaps upward into this hero â please match the overlap exactly.**\n\nSpec:\n- Container: max-width 1280px, LEFT-aligned content (not centered).\n- Padding: **48px top / 112px bottom** (pt-12 pb-28). The extra bottom space is intentional â it makes room for the featured card that overlaps upward with `margin-top: -64px`.\n\nTypography:\n- H1: **36px mobile / 48px desktop**, Plus Jakarta Sans weight 800, colour `#FFFFFF`, tracking-tight.\n- Sub: 18px, `rgba(255,255,255,0.70)`, max-width ~672px.\n- Breadcrumb: 12px, `rgba(255,255,255,0.55)`.\n- 'Browse all categories' link: 14px, weight 700, white, with layout-grid icon.\n\n**Do not shorten the bottom padding of the hero â the featured card needs room to sit half-in / half-out of the hero band.**"
    },
    "featured-card": {
      "label": "Featured card (overlaps hero)",
      "author": "Tshepho",
      "ts": "2026-07-03",
      "pending": true,
      "text": "Card: `bg #FFFFFF`, border `#E7EBEF`, border-radius **1.5rem (24px)**, shadow-xl, margin-top **-64px** (this is what makes it overlap the hero above).\n\nLayout: 2-column grid on md+, 1 column mobile. Left column is image, right is content.\n\nImage: aspect 16/11, object-cover. FEATURED pill top-left: 11px uppercase, `bg #FF9900`, colour `#0C1F31` (navy on orange), rounded-full.\n\nContent right:\n- Category pill: 11px uppercase, `bg #FDECEF`, colour `#DC183C`.\n- Title: 24px mobile / 32px desktop, Plus Jakarta Sans weight 800, colour `#121A21` (ink), line-height 1.15.\n- Excerpt: 16px, colour `#6A7581`.\n- Byline avatar: 40 Ã 40 gradient. Name 14px weight 700 ink. Date Â· read time 14px muted."
    },
    "breadcrumbs": {
      "label": "First Section",
      "author": "Tshepho",
      "ts": "2026-07-06",
      "text": "- The breadcrumbs text size should be 12px as per the mockup. Currently is set to 13px.\n- Please keep the icon by browse by category 16x16 as per the mockup"
    },
    "second-section-featured-article": {
      "label": "Second Section - Featured Article",
      "author": "Tshepho",
      "ts": "2026-07-06",
      "text": "- Update the Article featured image to 614x404px as per the mockup\n- Update the Article Title to 32px as per the Mockup\n- The tag name size should be 11px as per the mockup"
    },
    "third-section-subcategories": {
      "label": "Third Section - Subcategories",
      "author": "Tshepho",
      "ts": "2026-07-06",
      "text": "- Please update your row design to show 4 articles per the mockup\n- Update the subcategory names heading size to 30px as per the mockup\n- The See all CTA size should be 14px as per the mockup\n-"
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

  "public-popia.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-02",
      "text": "Same fix as public-refunds — the first section is too tall.\n\nSpacing: ~48px top / ~64px bottom. Container maxed at 1280px.\n\nTypography: H1 in Plus Jakarta Sans 800, 36px mobile / 48px desktop. Breadcrumb 12px in white 55%. 'Last updated' line 14px in white 55%."
    }
  },

  "public-privacy.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-01",
      "text": "Same fix as public-refunds — the first section is too tall.\n\nSpacing: ~48px top / ~64px bottom. Container maxed at 1280px.\n\nTypography: H1 in Plus Jakarta Sans 800, 36px mobile / 48px desktop. Breadcrumb 12px in white 55%. 'Last updated' line 14px in white 55%.\n\nBackground: the same navy → maroon gradient with the dot pattern at 70% opacity.\n\nNo CTAs in the hero.\n\n**One shared template across all legal pages please.**"
    }
  },

  "public-refunds.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-01",
      "text": "The first section is way too tall — please bring it down to the mockup's spec.\n\nSpacing to hit:\n- Section padding: ~48px top / ~64px bottom (roughly py-12 sm:py-16).\n- Container: max-width 1280px, centered.\n\nTypography to hit:\n- H1: Plus Jakarta Sans, weight 800, 36px on mobile / 48px on desktop, tight tracking.\n- Breadcrumb above H1: 12px, white at 55% opacity, `›` separator at white 30%.\n- 'Last updated' line under H1: 14px, white at 55% opacity, ~12px top margin.\n\nBackground: navy gradient — starts `#0C1F31` top-left, transitions through `#2b1626` toward `#5e1a2c` bottom-right — with the subtle dot pattern overlaid at ~70% opacity.\n\nNo CTAs in this hero. It's a legal doc header, keep it clean.\n\n**All five legal pages (refunds, terms, privacy, popia, advertising disclosure) share this exact same design — please reuse ONE template.**"
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
  },

  "public-terms.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-01",
      "text": "Same fix as public-refunds — the first section is too tall.\n\nSpacing: ~48px top / ~64px bottom. Container maxed at 1280px.\n\nTypography: H1 in Plus Jakarta Sans 800, 36px mobile / 48px desktop. Breadcrumb 12px in white 55%. 'Last updated' line 14px in white 55%.\n\nBackground: the same navy → maroon gradient with the dot pattern at 70% opacity.\n\nNo CTAs in the hero.\n\n**Please build one shared template for all the legal pages (refunds, terms, privacy, popia, advertising disclosure). Right now each one looks slightly different — they should be identical.**"
    }
  }
};
