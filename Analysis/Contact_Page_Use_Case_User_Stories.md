# Contact Page Use Case Description and User Stories

> **Parent user stories:** US-03 (Send a Business Inquiry) and US-05 (Find Contact Information Quickly) in `Analysis/User_Stories.md`. The stories below (US-C01–US-C05) are page-level breakdowns for implementation.

## Use Case Description

**Use case name:** Contact Green Earth Produce

**Goal:** Allow website visitors to contact Green Earth Produce directly through the website and find the company's contact details quickly.

**Primary actor:** Website visitor / potential customer

**Secondary actor:** Green Earth Produce staff member

**Related requirements:** FR3 Company info, FR6 Contact form, FR7 Confirmation

**Preconditions:**
- The visitor can access the public website.
- The Contact page is available from the website navigation.
- The contact form is connected to the website backend or email handling system.

**Trigger:**
- A visitor wants to ask a question, request product information, ask about pricing, or start a business inquiry.

**Main flow:**
1. The visitor opens the Contact page.
2. The system displays the contact form and company contact information.
3. The visitor enters their name, email address, optional phone number, optional subject, and message.
4. The visitor submits the form.
5. The system validates the required fields.
6. The system sends the inquiry to Green Earth Produce.
7. The system shows a confirmation message that the inquiry was sent successfully.

**Alternative flows:**
- If required fields are missing, the system shows validation feedback and asks the visitor to complete the form.
- If the email address is invalid, the system prevents submission and asks for a valid email address.
- If the message cannot be sent because of a server or network problem, the system shows an error message and allows the visitor to try again.
- If the visitor comes from a product inquiry link, the form can be pre-filled with the selected product information.

**Postconditions:**
- The visitor receives clear feedback about whether the message was sent.
- Green Earth Produce receives the visitor's inquiry with enough information to respond.
- No incomplete or invalid inquiry is submitted.

## User Stories

### US-C01 - Submit Contact Form

> As a potential customer, I want to send a message through the Contact page, so that I can ask Green Earth Produce about products, pricing, or cooperation.

**Acceptance Criteria:**
- The Contact page contains a form with fields for name, email, phone, subject, and message.
- Name, email, and message are required fields.
- Phone and subject are optional fields.
- The form can be submitted without creating an account.
- After a successful submission, the visitor sees a clear success confirmation.

---

### US-C02 - Validate Contact Form Input

> As a visitor, I want the form to tell me when required information is missing or incorrect, so that I can fix the problem before sending my inquiry.

**Acceptance Criteria:**
- The form cannot be submitted when name, email, or message is empty.
- The email field checks for a valid email format.
- Validation feedback is shown near the relevant field or through browser validation.
- The visitor's entered information is not lost when validation fails.

---

### US-C03 - View Company Contact Details

> As a visitor, I want to see Green Earth Produce's email address, phone number, address, and business hours, so that I can choose the most convenient way to contact the company.

**Acceptance Criteria:**
- The Contact page displays the company email address.
- The Contact page displays the company phone number.
- The Contact page displays the company address.
- The Contact page displays business hours.
- Email, phone, and address links are clickable where possible.

---

### US-C04 - Send Product Inquiry From Catalogue

> As a product catalogue visitor, I want the contact form to include the product and quantity I selected, so that I do not have to type the product details again.

**Parent story:** US-03 (Send a Business Inquiry). Catalogue-side behaviour is covered by US-01.

**Acceptance Criteria:**
- From the product detail modal, the visitor can select a quantity option before contacting GEP.
- "Contact Us" from the modal opens the Contact page with query parameters for product id, title, quantity id, and quantity label.
- The Contact page sets the subject to "Product inquiry".
- The message is pre-filled with the product name, selected quantity, and product reference (e.g. product ID).
- The visitor can edit the pre-filled subject and message before sending.
- The inquiry still requires name, email, and message before submission.
- The submitted message includes the final text entered by the visitor.

---

### US-C05 - Receive Submission Feedback

> As a visitor, I want to know whether my message was sent successfully, so that I know if I should wait for a response or try again.

**Acceptance Criteria:**
- The submit button shows a sending state while the message is being sent.
- The form prevents duplicate submissions while sending.
- A success message is shown after the inquiry is sent.
- An error message is shown if the inquiry cannot be sent.
- The visitor can try again after an error.

