/*
 * SME South Africa — Shared review notes.
 * These notes ship WITH the repo — anyone who opens the launcher sees them,
 * on any browser, on any machine. Distinct from personal notes (which live
 * only in the current browser's localStorage).
 *
 * Shape: { [file]: { [sectionId]: { label, text, author, ts } } }
 *   label   — section display name in the panel
 *   text    — the note body; Markdown-lite allowed (**bold**, backticks, hyphen bullets)
 *   author  — shown as "SHARED · <author>" chip; who left the note
 *   ts      — ISO date the note was written / last revised
 *
 * To add or update shared notes, edit this file and commit — they become
 * visible to everyone as soon as the branch merges to main and Pages redeploys.
 */
window.SHARED_NOTES = {

  /* ---------- Legal / policy pages — all use the same hero template ---------- */
  "public-refunds.html": {
    "hero": {
      "label": "Hero · first section",
      "author": "Tshepho",
      "ts": "2026-07-01",
      "text": "**Hero padding is way too large in the live build.** Compare our mockup (compact, elegant header band) vs your current Elementor version (huge vertical space, dominates the fold).\n\nSpecific fixes for the Elementor section:\n- **Section padding-top: 3rem (48px)**, padding-bottom: 4rem (64px). Currently reads ~6–8rem. Tighten it.\n- **Container: max-width 1280px, centered.** Horizontal padding 16px on mobile, 24px on sm+.\n- **Background gradient:** `linear-gradient(115deg, #0C1F31 0%, #0C1F31 50%, #2b1626 80%, #5e1a2c 115%)`. Overlay the dot-pattern at 70% opacity (see brand_ci.html for the SVG).\n- **Breadcrumb:** font-size 12px (text-xs), color rgba(255,255,255,0.55), separator '›' at rgba(255,255,255,0.30). No text-transform.\n- **H1:** Plus Jakarta Sans, weight 800, size 36px mobile / 48px desktop, tracking-tight, color #FFFFFF.\n- **'Last updated' line:** font-size 14px, rgba(255,255,255,0.55), directly under H1 with margin-top 12px.\n- **No CTAs** in this hero — it's a legal doc, keep it clean.\n\nSame rules apply across ALL legal pages: refunds, terms, privacy, popia, advertising disclosure. One shared Elementor template please."
    }
  },
  "public-terms.html": {
    "hero": {
      "label": "Hero · first section",
      "author": "Tshepho",
      "ts": "2026-07-01",
      "text": "**Same fix as public-refunds.html hero — see that note for full spec.** The live Terms of Use page has the same over-padded hero. Tighten to py-12 sm:py-16 (48px top / 64px bottom), match the exact gradient + dot pattern, match the breadcrumb + H1 + last-updated typography.\n\nAll five legal pages (refunds, terms, privacy, popia, advertising disclosure) should share ONE Elementor template — different content, identical hero."
    }
  },
  "public-privacy.html": {
    "hero": {
      "label": "Hero · first section",
      "author": "Tshepho",
      "ts": "2026-07-01",
      "text": "**Same fix as public-refunds.html hero — see that note for full spec.** Privacy Policy hero currently uses too much vertical space in Elementor. Compress to py-12 sm:py-16, match the mockup's gradient + dot-pattern + typography stack (breadcrumb 12px white/55, H1 Plus Jakarta 36/48px extrabold, 'Last updated' 14px white/55).\n\nShared Elementor template across all legal pages — refunds, terms, privacy, popia, advertising disclosure."
    }
  },
  "public-popia.html": {
    "hero": {
      "label": "Hero · first section",
      "author": "Tshepho",
      "ts": "2026-07-01",
      "text": "**Same fix as public-refunds.html hero — see that note for full spec.** The POPIA page hero needs the same padding + typography cleanup as the other legal pages. Compress to py-12 sm:py-16, gradient `linear-gradient(115deg, #0C1F31 0%, #0C1F31 50%, #2b1626 80%, #5e1a2c 115%)`, breadcrumb + H1 + last-updated typography per spec.\n\nOne Elementor template for all legal pages please."
    }
  },
  "public-advertising-disclosure.html": {
    "hero": {
      "label": "Hero · first section",
      "author": "Tshepho",
      "ts": "2026-07-01",
      "text": "**Same fix as public-refunds.html hero — see that note for full spec.** Advertising Disclosure hero needs the same padding + typography treatment as the other legal pages. Reuse the shared Elementor template — refunds, terms, privacy, popia, advertising disclosure all share the same hero shell, different content below."
    }
  },

  /* ---------- Marketing pages ---------- */
  "public-about.html": {
    "hero": {
      "label": "Hero · first section",
      "author": "Tshepho",
      "ts": "2026-07-01",
      "text": "**On mobile, hide the right-column hero image entirely.**\n\nOn screens below the lg breakpoint (1024px), the right column with the entrepreneurs photo + blur backdrop + '100K+ monthly community' floating card should NOT render at all. Only the left column (eyebrow, H1, sub copy, 'Join the SME Hub' + 'Explore the platform' CTAs) carries the hero on small screens.\n\nIn Elementor:\n- Set the image column to **Hide on Mobile + Hide on Tablet** (Advanced → Responsive → Hide On).\n- The row layout should collapse cleanly to a single column with only the copy visible below the lg breakpoint.\n- On desktop (lg+), everything renders as-is with image, blur, and floating card intact.\n\nSee the mockup for the correct mobile behaviour."
    }
  }
};
