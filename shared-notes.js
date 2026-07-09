/*
 * SME South Africa — Shared review notes.
 * These notes ship with the repo — everyone sees them on the mockup hub.
 *
 * ONLY the operator (Tshepho) adds notes here — either directly via Mission
 * Control's Shared notes panel, or by accepting a dev suggestion. Claude does
 * NOT seed pending shared notes automatically; the file only grows via
 * PUBLISH LIVE from control.html.
 *
 * Shape: { [file]: { [sectionId]: { label, text, author, ts } } }
 */
window.SHARED_NOTES = {

  "public-about.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-01",
      "text": "Hide the picture on mobile — the first section should only show copy and buttons on small screens."
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

  "public-terms.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-01",
      "text": "Same fix as public-refunds — the first section is too tall.\n\nSpacing: ~48px top / ~64px bottom. Container maxed at 1280px.\n\nTypography: H1 in Plus Jakarta Sans 800, 36px mobile / 48px desktop. Breadcrumb 12px in white 55%. 'Last updated' line 14px in white 55%.\n\nBackground: the same navy → maroon gradient with the dot pattern at 70% opacity.\n\nNo CTAs in the hero.\n\n**Please build one shared template for all the legal pages (refunds, terms, privacy, popia, advertising disclosure). Right now each one looks slightly different — they should be identical.**"
    }
  }
};
