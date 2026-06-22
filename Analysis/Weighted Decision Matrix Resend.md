# Weighted Decision Matrix – Selection of an Email Service for the Contact Form

## 1. Introduction

As part of the implementation of the Green Earth Produce website, a contact form needed to be developed to allow potential customers to contact the company directly through the website. In addition to forwarding the inquiry to the company, the system should automatically send a confirmation email to the customer after form submission.

Several third-party email services were considered for this functionality. To support the decision-making process, a weighted decision matrix was performed to objectively compare the available solutions.

The evaluated services were:

- Resend
- Web3Forms
- EmailJS
- Formspree

The goal of this analysis was to identify the service that best fits the technical and functional requirements of the project.

## 2. Evaluation Criteria

| Criterion | Description | Weight |
|-----------|-------------|--------|
| Ease of Integration | How easily the service can be integrated into a React/Vite application. | 0.35 |
| Vercel Compatibility | Compatibility with serverless deployment on Vercel. | 0.25 |
| Cost | Affordability and availability of a free tier. | 0.15 |
| Scalability | Ability to support future extensions and increased usage. | 0.15 |
| Documentation & Developer Experience | Quality of documentation and overall developer experience. | 0.10 |

The weights were chosen based on the project requirements. Ease of integration and compatibility with the deployment platform received the highest weights because these aspects were considered most important for the successful implementation of the contact form.

Scores range from **0 (poor)** to **1 (excellent)**.

## 3. Weighted Decision Matrix

| Service | Ease of Integration W=0.35 | Vercel Compatibility W=0.25 | Cost W=0.15 | Scalability W=0.15 | Documentation W=0.10 | Weighted Sum |
|----------|---------------------------|-----------------------------|-------------|--------------------|----------------------|--------------|
| Resend | 1.0 | 1.0 | 0.8 | 1.0 | 1.0 | **0.97** |
| Web3Forms | 0.9 | 1.0 | 1.0 | 0.6 | 0.8 | **0.86** |
| EmailJS | 0.8 | 0.9 | 0.8 | 0.7 | 0.8 | **0.81** |
| Formspree | 0.8 | 0.9 | 0.7 | 0.7 | 0.9 | **0.80** |

## 4. Results

The results show that **Resend** achieved the highest overall weighted score (**0.97**).

Resend scored particularly well in the categories **Ease of Integration**, **Vercel Compatibility**, **Scalability**, and **Documentation**. The service integrates seamlessly with React applications and is specifically designed for modern web frameworks and serverless environments such as Vercel.

Web3Forms received the second-highest score because it offers a very simple setup and a generous free tier. However, it provides fewer customization options and is less scalable for future extensions.

EmailJS and Formspree also performed well, but both offer fewer advantages regarding scalability and integration flexibility compared to Resend.

## 5. Decision

Based on the weighted decision matrix, **Resend was selected as the email service for the Green Earth Produce website**.

The decision was made because Resend:

- Integrates easily with React and Vite.
- Works well with Vercel serverless functions.
- Provides excellent documentation.
- Supports scalable future enhancements.
- Allows more control over email templates and backend logic.

Although alternative services provide simpler implementations, Resend best satisfies both the current requirements and potential future needs of the Green Earth Produce website.

## 6. Conclusion

The weighted decision matrix provided an objective method for selecting the most suitable email service for the project. The analysis demonstrated that Resend is the most appropriate solution due to its strong integration capabilities, scalability, and compatibility with the project's technical architecture.
