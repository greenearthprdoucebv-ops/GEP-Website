# 🗂️ Sprint Planning — Sprint 4

**Date:** 20/05/2026
**Sprint:** Sprint 4
**Status:** ✅ Done
**Type:** 🗂️ Sprint Planning
**Facilitator:** Preslav Stoyanov

---

## Sprint Info

| Field | Value |
|---|---|
| Sprint # | 4 |
| Fontys week | 14 |
| Start Date | 20/05/2026 |
| End Date | 28/05/2026 |
| Scrum Master | Preslav Stoyanov |
| Team Members | Preslav, Eslam, Lukas, Delly |

---

## 🎯 Sprint Goal

Deploy the GreenEarth Produce website on the client's real `.nl` domain via Vercel, complete production-ready backend integrations (Resend contact form and newsletter), and run the sprint review with GEP to sign the formal project contract.

---

## 📋 Sprint Backlog

### 🗂️ User stories in scope

User story IDs and wording match `Analysis/User_Stories.md`.

| # | User Story | Page | Owner | Sprint 4 focus |
|---|---|---|---|---|
| US-01 | View Product Catalogue | Product Catalogue | Preslav | Supabase live on production domain |
| US-09 | Discover GEP on the Homepage | Home Page | Eslam | Fix homepage visual issues on production preview |
| US-03 | Send a Business Inquiry | Contact Page | Lukas | Resend contact form in production |
| US-05 | Find Contact Information Quickly | Contact Page | Lukas | Footer/contact links on live site |
| US-02 | Read About GEP | About Us | Delly | About page on production domain |

### 🛠️ Sprint tasks

| Task | User Story | Owner | Priority | Status |
|---|---|---|---|---|
| Obtain domain provider access from GEP | — (infrastructure) | Preslav | 🔴 High | To Do |
| Configure DNS (A, AAAA, CNAME, SPF TXT) and connect domain to Vercel | — (infrastructure) | Preslav | 🔴 High | To Do |
| Verify auto-deploy pipeline on `main` | — (infrastructure) | Preslav | 🔴 High | To Do |
| Fix homepage visual issues on production preview | US-09 | Eslam | 🟡 Medium | To Do |
| Prepare Resend config for production contact form | US-03 | Lukas | 🔴 High | To Do |
| Implement newsletter subscription backend (Resend) | — (not a user story) | Delly | 🔴 High | To Do |
| Sprint review with GEP + contract signing | — | Preslav (facilitator) | 🔴 High | To Do |

---

## 🚧 Blockers

| Blocker | Owner | Impact |
|---|---|---|
| Domain provider credentials not yet received from client | Preslav | Blocks DNS, live URL, and Resend production sending |
| Resend requires confirmed domain for production email | Lukas / Delly | Contact form and newsletter cannot go fully live |

---

## 🧠 Team Capacity

| Member | Role | Availability | Notes |
|---|---|---|---|
| Preslav | Scrum Master + Dev | Full | Domain, DNS, Vercel, client liaison |
| Eslam | Developer | Full | Homepage polish on live preview |
| Lukas | Developer | Full | Resend contact form |
| Delly | Developer | Full | Newsletter backend |

---

## ✅ Definition of Done

- [ ] Site accessible on client's production `.nl` domain
- [ ] DNS records documented and stable
- [ ] Vercel deployment confirmed on production domain
- [ ] Sprint review completed with GEP
- [ ] Formal contract signed authorising use of GEP branding
- [ ] Resend contact form tested on production (or explicit carry-over to Sprint 5)
- [ ] Newsletter flow implemented (or explicit carry-over to Sprint 5)

---

## 📝 Notes

- Sprint 3 delivered core page implementation and Supabase integration; Sprint 4 shifts focus to **go-live** and **client sign-off**.
- Resend work can proceed locally before domain access; production sending depends on DNS.
- Sprint review and contract signing targeted for **28/05/2026**.
