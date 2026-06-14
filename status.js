/*
 * SME South Africa — Mockup release status (the gate config).
 * The public launcher (index.html) only opens mockups marked "finalised".
 * Anything else shows greyed-out "Coming soon" and is not accessible.
 * Edit via control.html (the private controller) and re-export this file, or edit by hand.
 * Allowed values: "finalised" · "under-review" · "under-work" · "not-started"
 */
window.MOCKUP_STATUS = {
  // ---- Finalised (live for the developer) ----
  "public-home.html":      "finalised",
  "member-hub.html":       "finalised",
  "public-about.html":     "finalised",
  "public-contact.html":   "finalised",
  "public-advertise.html": "finalised",
  "public-privacy.html":   "finalised",
  "public-terms.html":     "finalised",
  "public-refunds.html":   "finalised",
  "public-popia.html":     "finalised",
  "brand_ci.html":         "finalised",
  "public-icons.html":     "finalised",
  "events.html":           "finalised",

  // ---- Not yet finalised (greyed / coming soon) ----
  "public-articles.html":         "under-review",
  "public-article-categories.html":"under-review",
  "public-category.html":         "under-review",
  "public-subcategory.html":      "under-review",
  "public-author.html":           "under-review",
  "public-article.html":          "under-review",
  "public-resources.html":        "under-review",
  "public-resource-category.html":"under-review",
  "public-resource.html":         "under-review",
  "public-funding.html":          "under-review",
  "public-funding-category.html": "under-review",
  "public-loan-option.html":      "under-review",
  "public-solutions.html":        "under-review",
  "public-solution-category.html":"under-review",
  "public-solution-review.html":  "under-review",
  "public-shop.html":         "under-review",
  "public-checkout.html":     "under-review",
  "public-auth.html":         "under-review",
  "members.html":             "under-review",
  "single-group.html":        "under-review",
  "forums.html":              "under-review",
  "member-account.html":      "under-review",
  "newsletter.html":          "under-review",
  "newsletter-issue.html":    "under-review",
  "podcast.html":             "under-work"
};
window.MOCKUP_STATUS_PUBLISHED = "2026-06-09T08:00:00Z";
