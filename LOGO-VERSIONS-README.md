# Homepage logo comparison — v1 / v2 / v3

Three copies of `public-home.html`, identical except for the logo in the header and footer.
Open any one and use the badge at bottom-left to jump between them.

| file | logo | mark | wordmark | lockup aspect |
|---|---|---|---|---|
| `public-home-logo-v1.html` | legacy update (Aug 2026) | 2021 cube, CI red gradient, CI orange accents | condensed, **"SOUTH AFRICA" stacked** | **2.70 : 1** |
| `public-home-logo-v2.html` | legacy rebuilt (colourway B) | 2021 cube, flat CI red, navy accents | current wordmark, one line | 6.91 : 1 |
| `public-home-logo-v3.html` | 2026 shield | shield, CI navy, red spark | current wordmark, one line | 6.93 : 1 |

Assets: `assets/logo-v{1,2,3}-lockup.svg` and `-reversed.svg` (reversed used on the navy footer).
All six are vector, verified to render correctly in a real browser renderer including
`fill-rule="evenodd"` knockouts and letter counters.

## Note on v1

The legacy update (the designer's August option) was rebuilt as **true vector**, not screenshotted. Its wordmark was
extracted from the PDF as 14 outlined glyph paths (the PDF carries them as vector, filled in exactly
`#0C1F31`); the cube is the exact isometric reconstruction, recoloured with the designer's own
sampled gradient (`#DC183C` to `#592D3A`, near-horizontal, residual std 3.3) and CI orange accents
(`#FF9900`).

**The designer's August option was already fully on-CI** — red `#DC183C`, orange `#FF9900`,
navy `#0C1F31`, all exact. The off-CI colour problems were in the *September shield* set, not this one.
The only possible CI conflict left in v1 is the condensed typeface of the wordmark, which looks like
the family the 2026 CI retired — worth confirming with the designer.

## Not deployed

These are local only. They are new files (nothing existing was modified), so nothing is at risk.
Deploying to Pages needs a commit + push.

## `logo-socials-mockup.html`

Social avatar mockups for all three options, built on the **real** SME South Africa profiles.
Switcher at the top flips every platform between V1 / V2 / V3.

**Avatars carry the FULL LOCKUP, not the icon** — matching how SME South Africa actually sets its
social profiles. That constraint turns out to be decisive.

Contains: LinkedIn, X, Instagram and Facebook profile headers; an avatar matrix across six
platforms (adding YouTube and TikTok) with each avatar clipped to that platform's real shape via
SVG `clipPath`; a wordmark-legibility table; and reversed lockups on CI navy.

### The finding: a wide lockup loses its wordmark in a round avatar

To fit a lockup of aspect A inside a circle of diameter D, its whole height has to fit across the
chord — so the wider the lockup, the smaller everything gets, type included.

Height of the "SME" capitals at each platform's real displayed avatar size:

| platform | shape · size | V1 | V2 | V3 |
|---|---|---|---|---|
| LinkedIn | rounded · 130px | 22.0px | 10.2px | 10.2px |
| X | circle · 133px | 23.4px | 10.4px | 10.3px |
| Instagram profile | circle · 150px | 26.4px | 11.7px | 11.7px |
| Instagram feed | circle · 77px | 13.6px | **6.0px** | **6.0px** |
| Facebook | circle · 170px | 30.0px | 13.3px | 13.2px |
| YouTube | circle · 160px | 28.2px | 12.5px | 12.4px |
| TikTok | circle · 114px | 20.1px | **8.9px** | **8.9px** |

Uppercase type below roughly 9–10px stops being reliably legible on screen. **V1's wordmark renders
2.27× larger** than V2 or V3 — verified against the live DOM, not just computed: in a 118px
Instagram avatar the rendered "SME" measures 19.55px for V1 versus 8.66px and 8.63px for V2 and V3.

The cause is aspect ratio: V1's lockup is 2.70:1 because "SOUTH AFRICA" is stacked; V2 and V3 are
6.9:1 on one line. **If the brand uses full lockups on social, a one-line lockup is not viable.**

### Note: the earlier icon crop-loss finding still stands, in a different context

The measurement that the cube loses 0.00% to a circular crop while the shield loses 5.12% (and must
shrink to ~80%) was about the **icon**. It no longer applies to social avatars, which use the full
lockup — but it remains valid for favicons, app icons and anywhere the bare mark is used. It is
recorded in `../../SME Logos/revised legacy SME Logo/README-FINDINGS.md` context rather than on the
socials page.

### Data provenance

Real and verified from the live profiles: account names, all handles, LinkedIn tagline, industry,
location, employee band, founding year, and the LinkedIn follower count of **9,456**. Site tagline
quoted from the About page.

Follower and post counts for X, Instagram and Facebook show as "—" because they were not
retrievable (X returned HTTP 402, Facebook served almost nothing). **No metric on the page is
invented.** Platform layouts are faithful approximations for judging the logo, not pixel-exact clones.

Sources: za.linkedin.com/company/smesouthafrica · smesouthafrica.co.za/about

## V1 sizing

V1's header and footer lockup is `h-12` (48px); V2 and V3 are `h-9` (36px). V1 is set larger
because its stacked wordmark puts the type on two lines, so it needs more height to match their
optical weight. At those sizes: V1 renders 130px wide with a 41.5px mark; V2/V3 render ~249px wide
with a ~31px mark.
