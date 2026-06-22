# Constraints Document 
---

## Table of Contents

1. [Time Constraints](#1-time-constraints)
2. [Budget and Resource Constraints](#2-budget-and-resource-constraints)
3. [Technical Constraints](#3-technical-constraints)
4. [Database Constraints](#4-database-constraints)
5. [Scope Boundaries](#5-scope-boundaries)
6. [Content Constraints](#6-content-constraints)
7. [Quality and Testing Constraints](#7-quality-and-testing-constraints)
8. [Security Constraints](#8-security-constraints)
9. [Deployment Constraints](#9-deployment-constraints)
10. [Handover Constraints](#10-handover-constraints)
11. [Post-Launch Support Constraints](#11-post-launch-support-constraints)
12. [Legal and Compliance Constraints](#12-legal-and-compliance-constraints)
13. [Risk Assumptions and Constraints](#13-risk-assumptions-and-constraints)
14. [Acceptance Criteria](#14-acceptance-criteria)
15. [Key Assumptions](#15-key-assumptions)

---

## 1. Time Constraints

| Constraint | Details |
|---|---|
| Hard go-live deadline | June 23rd, 2026 |
| Post-launch support period | Until mid-August 2026 |
| Support hours provided by Mhd Eslam Raayn | 10 hours per week | 

**Implication:** No changes requiring significant development time can be accepted after June 23rd. Only critical bug fixes are permitted during the support period.

---

## 2. Budget and Resource Constraints

| Constraint | Details |
|---|---|
| Team size | 4 university students |
| External resources | None — purely in-house university team |
| Domain cost | 26 EUR/year (paid by GEP) |
| Hosting | Vercel (free tier) |
| Database | Supabase (free tier) |
| Email service | Resend (free tier — 3,000 emails/month) |
| Development tools | Free tools only (GitHub, VS Code, Supabase, Vite, etc.) |

**Implication:** No budget for external contractors, paid APIs, or premium services. All solutions must be free or low-cost. Supabase free tier limits must be actively monitored: 500 MB storage, 2 GB bandwidth, 2 concurrent connections.

---

## 3. Technical Constraints

| Constraint | Details | Rationale |
|---|---|---|
| Framework | React 19 + Vite 8 + TypeScript | Based on student expertise survey |
| Routing | React Router v7 | Client-side routing in Vite SPA |
| Hosting platform | Vercel | Compatible with Vite builds, simple deployment |
| Database | Supabase (PostgreSQL) | Free tier, built-in APIs, real-time capabilities |
| Email service | Resend API | Contact form email forwarding |
| Database type | Cloud-hosted PostgreSQL | Fully managed — no local setup required |
| Environment variables | Supabase URL/key + Resend key stored in Vercel | No hardcoded secrets — security best practice |
| API security | Supabase Row Level Security (RLS) | Required for GDPR compliance |
| Domain | greenearthproducebv.eu | Acquired by project team |
| Mobile responsiveness | Mandatory | Company requirement |
| Browser compatibility | Chrome, Safari, Edge | No Internet Explorer support |
| Contact form | Resend API via Vercel serverless `/api/contact` | Dual: DB store + email forward |
| Privacy policy | Required | GDPR compliance |
| Cookie consent | Required | GDPR compliance |
| Authentication | Not in scope | No login functionality |
| E-commerce | Not in scope | No payment processing |

**Implication:** The database must be secured with RLS policies. All environment variables must be configured in Vercel before deployment. The Resend API key must also be set. Free tier limits must be monitored and communicated to GEP.

---

## 4. Database Constraints

### 4.1 Technical Specifications

| Constraint | Details |
|---|---|
| Provider | Supabase (PostgreSQL 15+) |
| Storage limit | 500 MB (free tier) |
| Bandwidth | 2 GB/month (free tier) |
| Concurrent connections | 2 max (free tier) |
| Daily API requests | 50,000 (free tier) |
| Projects per account | 2 max (free tier) |
| Backup | Auto-backups with 7-day retention (free tier) |

### 4.2 Data Storage

| Data type | Stored in Supabase? | Purpose |
|---|---|---|
| Contact form submissions | Yes | Store inquiries for GEP reference |
| User personal data (name, email, phone) | Yes | Contact form fields |
| Website content (text, images) | Yes | Stored on Supabase |
| Navigation structure | No | Hardcoded in React components |

### 4.3 Database Schema

| Table name | Fields | RLS enabled? |
|---|---|---|
| `contact_submissions` | id, name, email, phone, message, created_at | Yes |
| `Product` | id, name, description, image_url, category, origin, created_at | Yes |

### 4.4 Security Constraints

| Constraint | Details |
|---|---|
| Row Level Security (RLS) | Must be enabled on all tables |
| RLS policies | Must restrict access based on user roles |
| API keys | Must use environment variables — never hardcoded |
| Database access | Only Vercel serverless functions should query Supabase |
| Anonymous access | Limited — insert permissions only for contact form |
| Select permissions | Restricted — authenticated admins only |
| GDPR compliance | Users can request deletion or export of their data |

### 4.5 Data Retention

| Constraint | Details |
|---|---|
| Retention period | To be defined with GEP (minimum GDPR compliance) |
| Data deletion | Manual deletion via Supabase dashboard or API |
| Data export | GEP can export data via Supabase dashboard |
| Handover | Supabase project URL and credentials must be handed over to GEP |

**Implication:** GEP must be informed that upgrading to a paid tier may be necessary if data usage exceeds free tier limits.

---

## 5. Scope Boundaries

### In Scope

- Static company website
- Mobile-responsive design
- Content provided by GEP (text and images)
- Contact form (stores in Supabase and forwards via Resend email service)
- Supabase database integration with RLS policies
- Supabase credentials managed via environment variables
- Resend API key managed via environment variables
- Database schema documented for handover
- Privacy policy page
- Cookie consent mechanism
- Deployment to Vercel
- Source code handover via GitHub
- Deployment guide
- Admin guide (content updates and Supabase management)
- Post-launch support until mid-August
- Minor text and picture adjustments
- Navigation bar adjustments

### Out of Scope

- User login and authentication
- E-commerce functionality
- Content Management System (CMS)
- Formal QA or testing phase
- Ongoing maintenance beyond mid-August
- Training sessions for GEP
- Formal handover meeting
- Database backups beyond Supabase defaults

---

## 6. Content Constraints

| Constraint | Details |
|---|---|
| Content provider | GEP company |
| Content type | Text and images |
| Database content | Contact form submissions text and images |
| Content handover | Must be provided by GEP before deployment |

**Implication:** Any content delays from GEP will directly impact the June 23rd deadline.

---

## 7. Quality and Testing Constraints

| Constraint | Details |
|---|---|
| Testing team | University project team only |
| Testing framework | Vitest + @testing-library/react |
| Formal QA phase | None |
| Testing type | Automated unit tests + manual testing by team members |
| Test coverage | Cross-browser, responsiveness, form submission, database writes |
| Database testing | Verify contact submissions are saved to Supabase correctly |
| RLS testing | Verify unauthorised access is blocked |
| User Acceptance Testing (UAT) | GEP approval during final meeting |

**Implication:** There are no external QA resources. Quality relies entirely on team diligence and automated tests. All critical bugs must be identified and resolved before June 23rd.

---

## 8. Security Constraints

| Constraint | Status | Details |
|---|---|---|
| Row Level Security (RLS) | Implemented | Enabled on `contact_submissions` and `Product` tables |
| RLS policies | Implemented | Insert only for anonymous; Select/Update/Delete restricted |
| Environment variables | Configured | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `RESEND_API_KEY` set in Vercel |
| API key exposure | Prevented | Anon key only (safe for client-side); `service_role` key never exposed |
| HTTPS | Enforced | Vercel and Supabase both enforce SSL/TLS |
| GDPR compliance | Implemented | Privacy policy, cookie consent, and right to delete/export |
| Input validation | Implemented | Form validation on client and server side |
| SQL injection | Prevented | Supabase uses parameterised queries |
| CORS | Configured | Allowed origins: Vercel deployment URL only |

**Implication:** All security measures must be verified before go-live. A breach could result in GDPR violations and legal consequences for GEP.

---

## 9. Deployment Constraints

| Constraint | Details |
|---|---|
| Platform | Vercel |
| Domain | greenearthproducebv.eu (acquired) |
| Live URL | https://greenearthproducebv.eu |
| Environment variables | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `RESEND_FROM`, `CONTACT_EMAIL_TO` |
| Deployment team | University project team |
| Deployment method | Git push to main branch — Vercel auto-deploys |
| Staging environment | Optional via Vercel preview deployments |
| DNS management | Team has access |

**Implication:** Deployment must be completed by June 23rd. Any DNS issues must be resolved immediately by the team.

---

## 10. Handover Constraints

| Deliverable | Status | Responsible |
|---|---|---|
| Source code (GitHub repo) | Will be provided | PRJ-team |
| Supabase project access (credentials + URL) | Will be provided | Preslav Stoyanov |
| Database schema diagram | Will be provided | Mhd Eslam Raayn |
| RLS policies documentation | Will be provided | Preslav Stoyanov |
| Deployment guide | Will be provided | Mhd Eslam Raayn |
| Admin guide (content updates) | Will be provided | Mhd Eslam Raayn |
| Supabase management guide | Will be provided | Preslav Stoyanov |
| Resend account / API key handover | Will be provided | Preslav Stoyanov |
| Contact info for maintenance | Will be provided | Lukas Pingen |
| Formal handover meeting | Not scheduled | N/A |

**Implication:** All documentation must be clear enough for a future student developer to understand and maintain the React + Vite codebase, Supabase structure, RLS policies, deployment process, and data management procedures.

---

## 11. Post-Launch Support Constraints

| Constraint | Details |
|---|---|
| Support period | Until mid-August 2026 |
| Weekly hours | Maximum 10 hours per week |
| Support type | Bug fixes and emergency changes only |
| Scope | Critical issues only — no new features |
| Database support | Data retrieval, export, and deletion requests |
| Communication channel | To be defined with GEP |

**Implication:** After mid-August, GEP must arrange alternative maintenance. No new features will be implemented after June 23rd.

---

## 12. Legal and Compliance Constraints

| Constraint | Status |
|---|---|
| Privacy policy | Must be implemented |
| Cookie consent | Must be implemented |
| GDPR compliance | Required — company operates in the EU |
| Data deletion requests | GEP must be able to delete user data on request |
| Data export requests | GEP must be able to export user data on request |
| SSL/HTTPS | Provided by Vercel and Supabase |
| Data Processing Agreement (DPA) with Supabase | To be signed between GEP and Supabase — GEP's responsibility |
| Data Processing Agreement (DPA) with Resend | To be signed between GEP and Resend — GEP's responsibility |

**Implication:** Legal pages and consent mechanisms must be live before go-live. GEP must arrange their own DPAs with both Supabase and Resend.

---

## 13. Risk Assumptions and Constraints

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Supabase free tier exceeded | Medium | High | Monitor usage regularly; document upgrade path for GEP |
| GEP requests major changes after June 23rd | Medium | High | Not acceptable — scope is locked after the deadline |
| Content not provided on time | Medium | High | Escalate immediately — delays will impact the deadline |
| Critical bugs found post-launch | Medium | Medium | Covered under support period (10h/week until mid-August) |
| RLS misconfiguration exposes data | Low | Critical | Test thoroughly before go-live |
| Resend free tier exceeded (3,000 emails/month) | Low | Medium | Monitor usage; upgrade plan if email volume grows |
| Student developer handover fails | Medium | Medium | Comprehensive documentation compensates for lack of handover meeting |
| Supabase service outage | Low | High | No mitigation possible (SaaS dependency) — logged as known risk |
| Domain/DNS issues | Low | Medium | Team has access and can resolve |
| GDPR non-compliance | Low | Critical | Legal review required before go-live |

---

## 14. Acceptance Criteria

The website will be considered complete and accepted when all of the following are true:

-  All GEP-provided content is correctly displayed
-  Site is mobile-responsive across all device sizes
-  Contact form stores submissions in Supabase correctly
-  Contact form sends email via Resend API
-  RLS policies are properly configured and verified
-  Privacy policy and cookie consent are implemented
-  Navigation bar adjustments are completed
-  All text and picture adjustments are made
-  Environment variables (Supabase + Resend) are configured in Vercel
-  Site is deployed on Vercel at https://greenearthproducebv.eu
-  Database schema is documented
-  Source code and all documentation are handed over
-  GEP has given final approval

---

## 15. Key Assumptions

> **Note:** These constraints should have been defined at the start of the analysis phase. They are documented here for completeness and to establish a clear baseline for the remainder of the project.

1. GEP will provide all required content (text and images) in a timely manner.
2. No feature additions beyond the current scope will be accepted.
3. The team will not be responsible for the website after mid-August 2026.
4. GEP understands that changes requested after June 23rd will not be implemented.
5. GEP accepts the risks associated with the Supabase free tier (storage limits, auto-backup retention policy).
6. GEP accepts the risks associated with the Resend free tier (3,000 emails/month limit).
7. GEP will sign their own Data Processing Agreements with both Supabase and Resend.

---
