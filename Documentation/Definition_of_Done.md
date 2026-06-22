# Definition of Done (DoD)

An issue is considered done when the acceptance criteria are fully met and the change is safe to use on the website.

## Done means
1. Acceptance criteria from the issue are implemented.
2. Affected pages work end-to-end (navigation + buttons + links).
3. No broken internal links and referenced assets exist (images/CSS/JS paths are correct).
4. No major frontend errors: pages load and the browser console has no errors for the tested flow.
5. Mobile-friendly basics: layout doesn’t break on common screen sizes (at least “usable” on mobile width).
6. If there is a form: required fields are validated and there is a clear success message and error handling.
7. If shared UI/CSS/JS was touched: other pages still work.

## If backend is part of the issue
1. The endpoint works and returns proper status codes for success + error.
2. `.env.example` exists (no secrets committed).


## Not done if
- Acceptance criteria are missing/partial without an explicit decision.
- The feature breaks core flows (or is clearly unusable on mobile).
- Links/assets are broken.
- Known limitations (like “backend not connected yet”) are not clearly documented.

