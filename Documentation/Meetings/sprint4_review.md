# 🔍 Sprint Review — Sprint 4

**Date:** 28/05/2026
**Sprint:** Sprint 4
**Status:** ✅ Done
**Type:** 🔍 Sprint Review
**Attendees:** Development team + GreenEarth Produce representatives
**Facilitator:** Preslav (Scrum Master)

---

## 🎯 Sprint Goal Recap
Deploy the website to the client's real `.nl` domain, complete backend integrations (Resend contact form + newsletter), and conduct the sprint review with GEP to get the formal contract signed.

**Goal met?** Partially — website deployed on the live domain; contract signed. Resend integrations and some polish items still in progress.

---

## ✅ What Was Shown

| Shown | User Story |
|---|---|
| Live website on greenearthproducbv.nl | US-01, US-02, US-03, US-05, US-09 |
| DNS records correctly configured (A record, CNAME, AAAA, SPF TXT) | — (infrastructure) |
| All four pages accessible on the production domain | US-01, US-02, US-03, US-05, US-09 |
| Basic deployment pipeline working — pushes to main auto-deploy via Vercel | — (infrastructure) |

---

## 📝 Contract & Legal
- Client reviewed the project and **signed the formal contract** authorizing the team to use GEP's branding, logo, and visual identity on the live website
- This milestone officially clears the team to proceed with the full public deployment

---

## 💬 Client Feedback

| Feedback | User Story |
|---|---|
| Happy that the site is live — good milestone | US-01, US-02, US-03, US-05, US-09 |
| **Product images still missing** — real product photos from GEP are needed | US-01 |
| **Footer needs fixing** — links broken or incomplete, structure needs restructuring | US-05 |
| **Legal pages missing** — Imprint, Privacy Policy, and Cookie Policy must be in place | — (legal / compliance) |
| **Resend integrations** — contact form and newsletter not yet working in production | US-03 (contact form) |
| Mr. Salz noted several areas still unfinished that block a professional, legally compliant deployment | — |

---

## 💻 Technical Discussion
- Preslav walked through the DNS setup and explained the Vercel domain configuration
- Lukas confirmed Resend is working locally but still blocked in production pending full domain setup
- Team confirmed the remaining tasks for Sprint 5 to close out the project

---

## 📋 Action Items

| Action | User Story | Owner | When |
|---|---|---|---|
| Get real product images from client and integrate | US-01 | Preslav / Team | Sprint 5 |
| Fix footer — structure, links, content | US-05 | Assigned dev | Sprint 5 |
| Build Imprint page | — (legal) | Team | Sprint 5 |
| Build Privacy Policy page | — (legal) | Team | Sprint 5 |
| Build Cookie Policy page | — (legal) | Team | Sprint 5 |
| Get Resend contact form live in production | US-03 | Lukas | Sprint 5 |
| Get Resend newsletter subscription live | — | Delly | Sprint 5 |

---

## 📝 Notes
- Website is live — this is a major milestone for the project
- Contract signed — team can now operate fully under GEP's brand on the live site
- Sprint 5 is the final sprint — focused entirely on finishing touches and legal compliance before handoff
