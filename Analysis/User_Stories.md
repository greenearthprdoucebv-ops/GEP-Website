# User Stories — Green Earth Produce Website

**Source of truth for user story IDs.** Sprint planning, Kanban issues, and commits should reference these IDs (e.g. `(US-01)`).

This file lists **only user stories delivered in the website MVP** (Sprints 1–5). No orders, checkout, login, or internal system stories.

| ID | Page | Owner |
|---|---|---|
| US-01 | Product Catalogue | Preslav |
| US-02 | About Us | Delly |
| US-03 | Contact | Lukas |
| US-05 | Contact | Lukas |
| US-09 | Home | Eslam |

---

## Website — Marcus (Supermarket Buyer)

---

**US-01 – View Product Catalogue**
> As a supermarket buyer, I want to browse GEP's full product catalogue, so that I can quickly see what they offer and decide if they match my sourcing needs.

**Acceptance Criteria:**
- The website has a dedicated products page.
- Each product shows a name, description, origin, and availability status.
- Products can be browsed without logging in.
- Products can be filtered and searched to narrow down options.
- A product detail view shows description, image, origin, and availability.
- In the product detail view, the visitor can select a quantity option (e.g. 1 kg, 10 kg, pallet).
- From the product detail view, the visitor can start a product inquiry that opens the Contact page with that product and quantity (see US-03).
- The page loads within 3 seconds.

---

**US-02 – Read About GEP**
> As a supermarket buyer, I want to read about GEP's background and experience, so that I can assess whether they are a reliable and professional supplier.

**Acceptance Criteria:**
- There is an About page with GEP's company story, location, and specialisation.
- The page feels professional and builds trust.
- A team section shows who is behind the company.
- Content is available in English.

---

**US-03 – Send a Business Inquiry**
> As a supermarket buyer, I want to send an inquiry directly from the website — including about a specific product and quantity from the catalogue — so that I can start a conversation with GEP without having to retype product details or find their contact information elsewhere.

**Acceptance Criteria:**
- There is a contact form on the website.
- The form includes fields for name, company, email, phone, subject, and message.
- After submitting, the user receives a confirmation message.
- GEP receives the inquiry by email.
- When the visitor opens the Contact page from the catalogue product flow, the subject is pre-filled as "Product inquiry".
- The message is pre-filled with the product name, selected quantity, and product reference.
- The visitor can edit the pre-filled subject and message before submitting.

**Implementation detail (page-level):** see US-C04 in `Analysis/Contact_Page_Use_Case_User_Stories.md`

---

## Website — Fatima (Local Shop Owner)

---

**US-05 – Find Contact Information Quickly**
> As a local shop owner, I want to find GEP's phone number and location on the website easily, so that I can call them or visit without having to search for a long time.

**Acceptance Criteria:**
- GEP's phone number, email, and address are visible on the Contact page.
- The Contact page includes a map showing Fresh Park Venlo.
- Contact info is also visible in the website footer on every page.

---

## Website — All Visitors

---

**US-09 – Discover GEP on the Homepage**
> As a visitor, I want to see a clear homepage with navigation and calls to action, so that I understand what GEP offers and know where to go next.

**Acceptance Criteria:**
- The homepage explains who GEP is and what they offer within the first few seconds.
- Navigation to Products, About, and Contact is visible and consistent.
- A hero section directs visitors to key actions (e.g. view products, get in touch).
- The homepage matches the approved design and works on mobile.

---
