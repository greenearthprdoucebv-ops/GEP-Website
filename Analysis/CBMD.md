## Technology Decision — CBMD

### Frontend Framework

| Criteria | Weight (1-3) | React + TypeScript | Vue.js | Angular |
|---|---|---|---|---|
| Team experience | 3 | ✓✓✓ | ✓ | ✓ |
| Easy to set up | 2 | ✓✓✓ | ✓✓✓ | ✓ |
| Good documentation | 2 | ✓✓✓ | ✓✓ | ✓✓ |
| Fits multi-page site | 2 | ✓✓✓ | ✓✓✓ | ✓✓✓ |
| **Total score** | | **27** | **19** | **15** |

**Decision: React + TypeScript** — highest score, best team fit.

---

### Database

| Criteria | Weight (1-3) | Supabase | Firebase | Own MySQL |
|---|---|---|---|---|
| Free tier | 3 | ✓✓✓ | ✓✓✓ | ✗ |
| Relational data (structured) | 3 | ✓✓✓ | ✗ | ✓✓✓ |
| Easy setup | 2 | ✓✓✓ | ✓✓✓ | ✓ |
| Client can manage content | 2 | ✓✓✓ | ✓✓ | ✓ |
| **Total score** | | **30** | **22** | **16** |

**Decision: Supabase** — only option that is both free and relational.

---

### Hosting

| Criteria | Weight (1-3) | Vercel | Netlify | Own VPS |
|---|---|---|---|---|
| Auto-deploy from GitHub | 3 | ✓✓✓ | ✓✓✓ | ✗ |
| Supports API functions | 3 | ✓✓✓ | ✓✓ | ✓✓ |
| Free tier | 2 | ✓✓✓ | ✓✓✓ | ✗ |
| Easy setup | 2 | ✓✓✓ | ✓✓✓ | ✓ |
| **Total score** | | **30** | **27** | **13** |

**Decision: Vercel** — best integration with React and GitHub.

---
*✓✓✓ = 3 pts, ✓✓ = 2 pts, ✓ = 1 pt, ✗ = 0 pts. Total = score × weight per row.*