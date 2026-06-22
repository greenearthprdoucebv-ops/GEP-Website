# MoSCoW Prioritization — GEP Website (MVP Scope)

**Prepared by:** Delly  
**Date:** March 2026  
**Context:** This MoSCoW analysis prioritises the website features for Green Earth Produce (GEP) to maximise B2B trust and lead generation within a limited timeframe.

---

## MoSCoW Definitions (short)
- **Must have:** Mandatory for the MVP to be usable/valuable. If missing, the release fails.
- **Should have:** Important and high value, but the MVP can still go live without it.
- **Could have:** Nice-to-have; included only if time allows.
- **Won’t have (this time):** Explicitly out of scope for this release; can be reconsidered later.

(Reference: DSDM / Agile Business Consortium MoSCoW guidance.)

---

## Must Have (MVP — required)

| ID | Feature | Why (business value) | Acceptance Criteria (example) | Dependencies |
|---|---|---|---|---|
| M1 | **Clear positioning on homepage** (who GEP is + what they offer) | Visitors must understand in <10 seconds what GEP does | Headline + short subtext explains offer + audience (B2B) | Stakeholder wording approval |
| M2 | **Product overview (categories page)** | Buyers need to see assortment quickly | Product categories visible; each category links to details | Product list from stakeholder |
| M3 | **Contact page with strong CTA** | Conversion: turn visitor into inquiry | CTA button visible on each page; contact info consistent | Phone/email confirmation |
| M4 | **Inquiry / contact form (lead capture)** | Structured inquiries reduce manual back-and-forth | Form submits successfully; required fields defined; confirmation message shown | Decide where form goes (email/CRM) |
| M5 | **Trust basics** (company story short + location proof) | B2B buyers check credibility | “About” section or block includes company + location (Fresh Park / Venlo) + key facts | Content from stakeholder |
| M6 | **Legal pages** (Privacy + Cookie basics + Imprint where required) | Compliance + professionalism | Privacy policy reachable; cookie notice if needed | Legal text (template/approval) |
| M7 | **Mobile-friendly + fast loading** | Most users browse on mobile; quality perception | Pages are responsive; no broken layout on mobile; images are compressed; basic performance check completed (no major issues such as extremely large images or broken links) | Chosen tech/CMS |
| M8 | **SEO fundamentals** (indexable pages + metadata + sitemap) | Without SEO basics, the site will not be discoverable and lead generation will stay low | Each page has a unique title + meta description; correct H1; sitemap.xml exists; robots.txt allows indexing; Open Graph tags set for sharing | Domain/hosting access + final page structure |

---

## Should Have (high value, but not required)

| ID | Feature | Why | Acceptance Criteria (example) | Dependencies |
|---|---|---|---|---|
| S1 | **Product detail pages** (origin/seasonality/packaging) | Improves buyer confidence & inquiry quality | Each category has 1–N detail pages | Product data availability |
| S2 | **Trust layer extended** (team/contact person, certifications if available) | Strong differentiator in produce sector | Team/contact section + certificates shown if provided | Certificates/photos |
| S3 | **Advanced SEO improvements** (structured data + keyword optimisation + local signals) | Improves discoverability beyond the baseline | Structured data (Organization/Product where relevant); keyword-focused headings; Google Business/Profile plan; internal linking between product pages | Content availability + stakeholder confirmation |
| S4 | **Language switch (EN/NL/DE)** | Wider buyer reach (depending on stakeholders) | Switch works; key pages translated | Confirm priority languages |
| S5 | **Simple “How we work” / logistics section** | Clarifies B2B process expectations | Short section: ordering/delivery basics | Stakeholder input |

---

## Could Have (nice-to-have)

| ID | Feature | Why | Acceptance Criteria (example) | Dependencies |
|---|---|---|---|---|
| C1 | **Downloadable PDF product list** | Useful for buyers, especially wholesalers | PDF downloadable; updated version noted | Product list + design |
| C2 | **Photo gallery / brand visuals** | Improves trust/quality perception | Gallery loads fast; images compressed | Photos |
| C3 | **News/updates section** | Signals “active company” + SEO | 1–2 posts added; simple admin flow | Content owner |
| C4 | **WhatsApp click-to-chat** | Low-friction inquiries | Button works on mobile | Number + policy |

---

## Won’t Have (this time)

| ID | Feature | Why not now | Note |
|---|---|---|---|
| W1 | Full **e-commerce shop** | Too complex for current scope/time | Reconsider after MVP success |
| W2 | Customer login / portals | High complexity + unclear need | Needs strong internal process first |
| W3 | Automated CRM pipeline integration | Depends on internal Odoo decisions | Could be phase 2 |

---

## Priority Notes / Rationale
- The MVP is focused on: **Positioning → Product clarity → Inquiry conversion → Trust → Compliance**.
- “Should” items are the first candidates once the Musts are stable and tested.
- “Won’t” items are intentionally excluded to protect timeboxing and delivery quality.

---

## Next Step After Thursday Interview
1. Validate Must/Should lists with stakeholder (owner + intern).
2. Confirm languages and top product categories.
3. Convert Must/Should items into backlog tickets with acceptance criteria.