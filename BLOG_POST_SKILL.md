# Orchia Studio — Blog Post Composition Skill

**Version:** 2.0
**Stack:** Vite + React SPA · markdown via `react-markdown` + `rehype-raw` · post body styled with `.post-body` · section numbering via CSS counter · hosted on Vercel at `orchia.studio`.

This skill has two layers:

1. **Editorial layer** — voice, audience, structure, what to say. The part that determines whether the post is any good.
2. **System layer** — frontmatter, HTML components, asset paths, meta tags. The part that determines whether the post ships correctly in this codebase.

Always satisfy both.

---

# PART 1 — EDITORIAL LAYER

## Role

You are writing a blog post for Orchia Studio.

## Audience

Write for customer-side marketing teams, product teams, founders, creative directors, and business decision makers. Do not write for engineers unless the topic specifically requires it.

## Brand voice

Calm, premium, confident, editorial, and practical. Avoid hype, hard selling, startup clichés, and overly technical explanations. The writing should feel like a thoughtful studio explaining why a product experience matters.

## Core writing principle

**Lead with customer value, not technology.**

Every article should answer:

- What customer or business problem does this solve?
- What did Orchia build or prove?
- What result does it create for customers, marketing teams, sales teams, or product teams?
- How can this pattern extend into other use cases?

## Article structure — three main sections

### 1. Context / Opportunity

Explain the product, customer, or market situation in positive language. Avoid negative framing like "customers hesitate," "photos aren't enough," or "the product is hard to understand."

Use positive framing instead:

- customers can understand faster
- teams can present products more clearly
- the product becomes easier to experience
- the customer journey becomes more confident
- the product story becomes more tangible

### 2. Proof Case

Use one real Orchia project as proof. Describe what was built in simple, customer-facing language. Focus on what users can do and what changed for the team. Avoid long technical stack details.

Good proof-case shape:

- The product or client needed to make something easier to understand, present, or use.
- Orchia created an interactive product experience.
- Users could directly experience the product instead of only reading or watching.
- The result helped sales, demos, onboarding, product education, or customer confidence.

### 3. Extension / Application

Explain how the same pattern can apply to other customer touchpoints — product page, sales demo, showroom, AR preview, mobile experience, onboarding, support, campaign page, internal product education.

End with a focused next step:

> Start with one product. Build one clear interactive demo. Learn whether it helps customers understand faster. Then scale the experience across more surfaces.

## Tone rules

- Positive framing only.
- Prefer natural paragraphs over bullet points. Use bullets only when they genuinely improve scanability.
- Avoid sounding like an AI-generated outline.
- Avoid heavy engineering terms.
- Avoid "we are experts at…" language.
- Avoid exaggerated claims and fear-based marketing.

## Language style

Short paragraphs. Strong but simple sentences. Write with clarity and restraint. Make the value obvious without overselling.

## Good phrases

- bring the product to life
- make the product easier to understand
- turn a product image into a product experience
- help customers picture the product clearly
- support the full customer journey
- create a reusable product asset
- make sales and onboarding conversations more concrete
- help teams present complex products with confidence

## Avoid phrases

- customers hesitate
- photos are not enough
- users are confused
- the product is hard to understand
- technical breakthrough · revolutionary · game-changing · cutting-edge
- AI-powered (unless necessary)
- no-code / seamless / frictionless (unless clearly true)

## Technical detail rule

Only mention technology when it supports credibility. Keep it short and non-technical.

Instead of:
> "Built with MediaPipe, Three.js, React Three Fiber, Zustand, glTF, and USDZ."

Write:
> "We created a web-based 3D experience where users could open a link, move their hand, and watch the product respond on screen."

## Title style

Use positive, benefit-led titles.

Good:

- Bring Complex Products to Life with Interactive 3D
- Turning Product Demos into Product Experiences
- Helping Customers Understand Products Before They See Them in Person
- From Product Image to Product Experience
- Making Physical Products Easier to Explore Online

Avoid:

- When Photos Aren't Enough
- Why Static Images Fail
- The Problem with Product Pages
- Customers Don't Understand Your Product

## CTA / ending style

End softly and practically.

> "Start with one product. Build one clear interactive demo. Learn how customers respond. From there, the same experience can scale across the catalogue, showroom, sales demo, onboarding flow, and support experience."

## Optional cross-linking

If relevant, add a "Read next" line at the end:

> Read next: How we implemented AR marketing experiences for 150+ new movie releases on Regal Cinema's mobile app.

## Drafting placeholders for visuals

While drafting, use this inline format to mark image slots:

```
[placeholder image: description of what the image shows, composition, customer/product interaction, mood — premium, editorial, calm, refined, technical but not flashy]
```

Useful placeholder types:

- wide editorial hero visual
- comparison layout
- product demo screen
- storyboard of customer interaction
- multi-surface ecosystem graphic
- showroom / mobile AR preview
- closing product-page CTA visual

These get replaced with real HTML figures (see Part 2) before publishing.

---

# PART 2 — SYSTEM LAYER

This is how the post actually ships in the Orchia codebase. The editorial draft is converted into the components below before merge.

## Frontmatter (required)

```yaml
---
title: "[Positive, benefit-led title — max 12 words]"
slug: "[url-slug]"
date: "YYYY-MM-DD"
excerpt: "[One sentence, 20–35 words. Concrete and outcome-focused.]"
featuredImage: "[Absolute URL — 1280×720 or larger, 16:9]"
hideHero: true   # Only if the post body opens with a video or strong visual
---
```

- `featuredImage` **must be an absolute URL** — relative paths break OG sharing.
- If `hideHero: true`, the `featuredImage` IS the OG card — make sure it reads well at 1280×720.
- YouTube thumbnails (`https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg`) are reliable.

## Body order on the page

1. **Opening visual** — `<div class="post-video">` or `<figure class="post-figure">`. Do not start with text.
2. **Lead paragraphs** — 1–2 paragraphs of positive Context/Opportunity framing.
3. **CTA card** — `<aside class="post-cta post-cta--split">` placed before the first `##` heading.
4. **Section 1 (`##`)** — Context / Opportunity narrative continued, or moves directly into the Proof Case framing.
5. **Section 2 (`##`)** — Proof Case. Inline `<figure>` or `<div class="post-result-split">` for supporting visuals.
6. **Section 3 (`##`)** — Extension / Application. Soft closing CTA.
7. **Read next** — `## Read next` with a single internal `.reading-card` if a related case study exists.
8. **Further reading** — `## Further reading` with 2–3 external `.reading-card`s.
9. **Share row** — rendered automatically by `BlogPostPage`. No markdown needed.

The CSS counter auto-numbers `##` headings as `01`, `02`, `03`. Three sections is the default; never exceed five.

## H2 headings

- Descriptive noun phrases, not questions. "From display to understanding" not "How can 3D help?"
- 5–8 words. Sentence case, not Title Case.

## CTA card copy

- **Eyebrow** — short mono label, e.g. "Try it yourself"
- **Headline** — present tense, kinetic, max 7 words. "Move your hand. Watch the robot follow."
- **Body** — 1–2 sentences. Sensory and concrete. Reference the video or demo above.
- **Button** — short action + URL hint. "Try the live demo at realhand.com →"

## Reading cards

### Selection

- Real articles with named brands, conversion stats, or implementation detail.
- No generic explainers. No duplicate brands. No duplicate categories.
- Maximum 3 external cards.

### Image

- Use the article's `og:image` if it is a real editorial image (not a logo, favicon, or SVG).
- If the `og:image` is a logo or missing, use a page screenshot stored at `/public/blog-extras/[source-slug].png`.
- Verify every image loads (`naturalWidth > 0`) before shipping.

### Layout

- 3:7 image-to-text horizontal split, `min-height: 160px`.
- Source domain in mono lowercase, bottom-left. Gold "→" bottom-right. No tag badges.
- **Internal links** — relative `href`, no `target="_blank"` (SPA navigation).
- **External links** — absolute URL, `target="_blank" rel="noreferrer"`.

## HTML components (safe with `rehype-raw`)

```html
<!-- Video embed -->
<div class="post-video">
  <iframe
    src="https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1&loop=1&playlist=VIDEO_ID"
    title="Descriptive title"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</div>

<!-- CTA card (split — copy left, image right) -->
<aside class="post-cta post-cta--split">
  <div class="post-cta-copy">
    <span class="post-cta-eyebrow mono-label">Try it yourself</span>
    <h3 class="post-cta-headline">Headline here</h3>
    <p class="post-cta-body">One or two sensory sentences.</p>
    <a class="post-cta-button" href="URL" target="_blank" rel="noreferrer">Button label →</a>
  </div>
  <div class="post-cta-media">
    <img src="/asset.png" alt="Description" loading="lazy" />
  </div>
</aside>

<!-- Inline figure -->
<figure class="post-figure">
  <img src="/blog-extras/filename.gif" alt="Descriptive alt text" loading="lazy" />
  <figcaption>Short factual caption</figcaption>
</figure>

<!-- Two-column result split (text left, figure right) -->
<div class="post-result-split">
  <div class="post-result-text">
    <p>Outcome paragraph one.</p>
    <p>Outcome paragraph two.</p>
  </div>
  <figure class="post-figure">
    <img src="/blog-extras/asset.gif" alt="Alt text" loading="lazy" />
    <figcaption>Caption</figcaption>
  </figure>
</div>

<!-- Reading card grid (one or more cards) -->
<div class="reading-grid">
  <a class="reading-card" href="https://example.com/article" target="_blank" rel="noreferrer">
    <div class="reading-card-img">
      <img src="https://example.com/og-image.jpg" alt="" loading="lazy" />
    </div>
    <div class="reading-card-body">
      <h4 class="reading-card-title">Article title</h4>
      <div class="reading-card-meta">
        <span class="reading-card-source">example.com</span>
        <span class="reading-card-arrow">→</span>
      </div>
    </div>
  </a>
</div>

<!-- Internal reading card (SPA nav, no target="_blank") -->
<a class="reading-card" href="/blog/slug">
  <div class="reading-card-img">
    <img src="https://..." alt="" loading="lazy" />
  </div>
  <div class="reading-card-body">
    <h4 class="reading-card-title">Title</h4>
    <div class="reading-card-meta">
      <span class="reading-card-source">orchia.studio · case study</span>
      <span class="reading-card-arrow">→</span>
    </div>
  </div>
</a>
```

## Asset paths

| Asset | Location | Notes |
|---|---|---|
| GIFs | `/public/blog-extras/[post-slug]-[description].gif` | Keep under 5 MB |
| Reading-card screenshots | `/public/blog-extras/[source-slug].png` | Crop to 16:9 if needed |
| Demo previews | `/public/[post-slug]-preview.png` | Used in CTA card |
| Featured / OG image | Absolute URL or `/public/[slug]-og.png` | Min 1280×720, 16:9 |

## Meta tags (automatic)

`BlogPostPage.tsx` auto-generates the full OG + Twitter Card set via `react-helmet-async`:

- `og:title`, `og:description`, `og:url` (canonical absolute)
- `og:type: article`, `og:image` (absolute), `og:image:width: 1280`, `og:image:height: 720`
- `twitter:card: summary_large_image`, `twitter:image`, `twitter:title`, `twitter:description`

The author's job is to set `featuredImage` correctly in frontmatter. Everything else is automatic.

> Non-JS scrapers (LinkedIn, sometimes Slack) fall back to the sitewide `/og-default.png`. Per-route SSR is the only fix for that — known limitation of the SPA.

---

# PART 3 — WHAT TO AVOID

- ❌ Negative openers: "Customers struggle…", "The problem with…", "Most sites fail to…"
- ❌ Heavy engineering jargon or stack lists in body copy
- ❌ Hype words: revolutionary, game-changing, cutting-edge, breakthrough
- ❌ Single-sentence paragraphs throughout the body
- ❌ More than 5 `##` sections (default is 3)
- ❌ Repeating the demo link more than twice
- ❌ Logos or favicons in reading-card images
- ❌ Duplicate brands or categories in Further Reading
- ❌ Relative paths for `featuredImage`
- ❌ `target="_blank"` on internal `/blog/...` reading cards (breaks SPA routing)
- ❌ Empty `<img>` placeholders in shipped HTML — replace before merge

---

# PART 4 — PRE-PUBLISH CHECKLIST

**Editorial**

- [ ] Title is positive and benefit-led
- [ ] Audience is marketing/product/founder, not engineers
- [ ] Three numbered sections (Context · Proof · Extension)
- [ ] No banned phrases anywhere
- [ ] Tech mentioned only where it supports credibility
- [ ] Soft, practical closing CTA
- [ ] "Read next" line if a related internal post exists

**System**

- [ ] `featuredImage` set, absolute URL, loads in browser
- [ ] `excerpt` ≤ 35 words
- [ ] `hideHero: true` if post opens with a video
- [ ] Opening visual present (video or figure)
- [ ] CTA card placed before first `##` heading
- [ ] Every `[placeholder image: …]` replaced with a real `<figure>` or removed
- [ ] Reading cards: max 3 external, all images verified to load
- [ ] Internal reading cards use relative href without `target="_blank"`
- [ ] All `/public/blog-extras/` assets committed
- [ ] Pushed to `beta`, Vercel preview reviewed before promoting to `main`
