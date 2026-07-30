# Tropical Surf Expeditions — two directions, for review

A draft. Two complete design directions for the same site, so Jobson can look
through both and pick one.

**Live:** enable GitHub Pages on `main` / root, then open the Pages URL.

```
index.html          the menu — pick a direction
direction-01/       "Silence"  — warm, film-led, Cormorant Garamond
direction-02/       "Crossing" — white, editorial, Playfair Display
assets/             shared video, posters and images (both directions use these)
review.css / .js    the floating switcher bar — review furniture, not design
robots.txt          disallow all
.nojekyll           serve files starting with _ and skip Jekyll processing
```

Each direction has the same five pages: `index`, `where-we-go`, `jobson`,
`plan-your-trip`, `privacy`.

## What isn't finished

- **Dotted gold underlines** mark facts that are guesses and need Jobson to
  confirm them — years teaching, regions, best months, contact details. Hover
  one for the note. There are 10–21 per page.
- **The enquiry form does not send.** It validates and shows its thank-you
  state so the flow can be reviewed; it needs wiring to email or a form service.
- **No prices, and no guest reviews.** Both left out deliberately rather than
  invented.
- **Jobson's portrait is a temporary selfie.** Worth reshooting without
  sunglasses — the page's job is eye contact.

## Notes for whoever builds on this

Video is re-encoded for the web: H.264/MP4, 1920×1080, video track only,
`shouldOptimizeForNetworkUse`. Originals are ~282 MB; these are ~35 MB.
Do not replace them with the originals — one is 166 MB and GitHub rejects
any file over 100 MB.

Every page is `noindex, nofollow`. Remove that before launch, and delete the
`review.css` / `review.js` links and the `.reviewbar` div from each page.

Design rationale, colour and type specs, the site map and the full text
wireframe live in the `brand/` folder of the working project, not in this repo.
