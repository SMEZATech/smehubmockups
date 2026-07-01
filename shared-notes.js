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
  },
  "public-privacy.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-01",
      "text": "Same fix as public-refunds — the first section is too tall.\n\nSpacing: ~48px top / ~64px bottom. Container maxed at 1280px.\n\nTypography: H1 in Plus Jakarta Sans 800, 36px mobile / 48px desktop. Breadcrumb 12px in white 55%. 'Last updated' line 14px in white 55%.\n\nBackground: the same navy → maroon gradient with the dot pattern at 70% opacity.\n\nNo CTAs in the hero.\n\n**One shared template across all legal pages please.**"
    }
  },
  "public-popia.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-01",
      "text": "Same fix as public-refunds — the first section is too tall.\n\nSpacing: ~48px top / ~64px bottom. Container maxed at 1280px.\n\nTypography: H1 in Plus Jakarta Sans 800, 36px mobile / 48px desktop. Breadcrumb 12px in white 55%. 'Last updated' line 14px in white 55%.\n\nBackground: the same navy → maroon gradient with the dot pattern at 70% opacity.\n\nNo CTAs in the hero.\n\n**One shared template across all legal pages please.**"
    }
  },
  "public-advertising-disclosure.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-01",
      "text": "Same fix as public-refunds — the first section is too tall.\n\nSpacing: ~48px top / ~64px bottom. Container maxed at 1280px.\n\nTypography: H1 in Plus Jakarta Sans 800, 36px mobile / 48px desktop. Breadcrumb 12px in white 55%. 'Last updated' line 14px in white 55%.\n\nBackground: the same navy → maroon gradient with the dot pattern at 70% opacity.\n\nNo CTAs in the hero.\n\n**One shared template across all legal pages please.**"
    }
  },

  "public-about.html": {
    "hero": {
      "label": "First section",
      "author": "Tshepho",
      "ts": "2026-07-01",
      "text": "Hide the picture on mobile — the first section should only show copy and buttons on small screens."
    }
  }
};
