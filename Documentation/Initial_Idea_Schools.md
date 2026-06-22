# Project Idea: Digital Sick Leave Platform

## Concept
We are developing a web platform that digitizes sick leave notes between doctors/clinics and schools.
Instead of issuing a paper document, the doctor creates a digital sick leave note in the system and sends it directly to the school.
Students can track the status of the note, while schools can verify, review, and approve or reject it.

The platform is implemented as a fully working prototype with demo schools and doctors, but it is designed to be extendable for real-world deployment.

## Stakeholders
- Students
- Doctors/clinics
- School administration (e.g., office/secretariat)
- System administrator

## Core Process
1. A student visits a doctor and requests a sick leave note.
2. The doctor creates a digital sick leave note in the platform, containing only absence dates (no medical diagnosis).
3. The system generates a PDF document with a unique document ID and a verification code (and/or a QR code).
4. The note is sent to the school’s inbox within the platform.
5. The school reviews the note and accepts or rejects it.
6. The student logs in to view the status: pending, approved, or rejected.

## Main Features (MVP)
- Role-based authentication for doctors/clinics, schools, and students
- Sick leave note creation and revocation by doctors
- School inbox for reviewing and managing incoming notes
- Student dashboard to track note status
- Automatic PDF generation with unique document ID
- Verification page for document validation (via QR code or document ID)
- Audit log for key actions (creation, updates, status changes)

## System Structure (Subsystems)
- Authentication subsystem
- Sick note management subsystem
- PDF generation module
- School review module
- Logging and reporting subsystem

## Security and Privacy
- No storage of medical diagnoses; only absence dates are stored
- Role-based access control (RBAC) to restrict data visibility
- Audit logging for accountability and traceability
- Data minimization principles to support GDPR compliance