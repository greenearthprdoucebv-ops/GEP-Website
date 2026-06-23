import './Legal.css'

export function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <div className="legal-page__inner">
        <h1 className="legal-page__title">Privacy Policy</h1>
        <p className="legal-page__updated">Last updated: June 2026</p>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">1. Who We Are</h2>
          <p className="legal-page__text">
            GreenEarth Produce is the data controller responsible for your personal data
            processed through this website. We are a fresh produce company based in the Netherlands.
          </p>
          <div className="legal-page__contact-block">
            <strong>Data Controller</strong><br />
            GreenEarth Produce<br />
            Venrayseweg 118 C, 5928 RH Venlo<br />
            The Netherlands<br />
            Phone: +31 77 206 6760<br />
            Email:{' '}
            <a href="mailto:info@greenearthproduce.nl" className="legal-page__link">
             info@greenearthproduce.nl
            </a>
          </div>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">2. Data We Collect</h2>
          <p className="legal-page__text">We may collect the following categories of personal data:</p>
          <ul className="legal-page__list">
            <li>
              <strong>Contact information</strong>: name, email address, phone number, and company name
            </li>
            <li>
              <strong>Communication data</strong>: messages or enquiries submitted via our contact form
            </li>
            <li>
              <strong>Usage data</strong>: IP address, browser type, pages visited, and time on site,
              collected via Google Analytics
            </li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">3. Purposes and Legal Basis for Processing</h2>
          <p className="legal-page__text">
            We process your personal data for the following purposes, each resting on a legal basis under
            Article 6 of the GDPR:
          </p>
          <ul className="legal-page__list">
            <li>
              <strong>Responding to enquiries</strong> — performance of a contract or our legitimate interest
              (Art. 6(1)(b)/(f))
            </li>
            <li>
              <strong>Website analytics via Google Analytics</strong> — your consent (Art. 6(1)(a)). You may
              withdraw consent at any time via the cookie settings on this site.
            </li>
            <li>
              <strong>Improving our website</strong> — our legitimate interest in providing a functional and
              secure service (Art. 6(1)(f))
            </li>
            <li>
              <strong>Compliance with legal obligations</strong> — legal obligation (Art. 6(1)(c))
            </li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">4. Third-Party Processors and International Transfers</h2>
          <p className="legal-page__text">
            We share data with the following third-party processors who act on our behalf. Where a processor
            is located outside the European Economic Area (EEA), we have implemented appropriate safeguards
            as required by Chapter V of the GDPR.
          </p>
          <ul className="legal-page__list">
            <li>
              <strong>Google Analytics (Google LLC)</strong> — website analytics. Google LLC is based in the
              United States. Data transfers are covered by Standard Contractual Clauses (SCCs) adopted by
              the European Commission. Google Analytics is configured with IP anonymisation. For more
              information, see{' '}
              <a
                href="https://policies.google.com/privacy"
                className="legal-page__link"
                target="_blank"
                rel="noreferrer"
              >
                Google's Privacy Policy
              </a>
              .
            </li>
          </ul>
          <p className="legal-page__text">
            We do not sell or rent your personal data to any third party.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">5. Data Retention</h2>
          <p className="legal-page__text">
            We retain personal data only for as long as necessary to fulfil the purposes described in this
            policy or as required by Dutch and EU law. Contact form submissions are generally kept for up to
            3 years, after which they are securely deleted. Analytics data retained in Google Analytics is
            subject to Google's data retention settings, which we have set to 14 months.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">6. Your Rights Under GDPR</h2>
          <p className="legal-page__text">
            As a data subject in the EU/EEA you have the following rights:
          </p>
          <ul className="legal-page__list">
            <li>
              <strong>Right of access</strong> (Art. 15) — request a copy of the data we hold about you
            </li>
            <li>
              <strong>Right to rectification</strong> (Art. 16) — ask us to correct inaccurate or incomplete
              data
            </li>
            <li>
              <strong>Right to erasure</strong> (Art. 17) — request deletion of your data ("right to be
              forgotten")
            </li>
            <li>
              <strong>Right to restriction of processing</strong> (Art. 18) — ask us to limit how we use your
              data
            </li>
            <li>
              <strong>Right to data portability</strong> (Art. 20) — receive your data in a structured,
              machine-readable format
            </li>
            <li>
              <strong>Right to object</strong> (Art. 21) — object to processing based on legitimate interests
            </li>
            <li>
              <strong>Right to withdraw consent</strong> (Art. 7(3)) — where processing is based on your
              consent (e.g. analytics cookies), you may withdraw that consent at any time without affecting
              the lawfulness of processing carried out before withdrawal
            </li>
          </ul>
          <p className="legal-page__text">
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:info@greenearthproduce.nl" className="legal-page__link">
            info@greenearthproduce.nl
            </a>
            . We will respond within one month. In complex or high-volume cases, we may extend this period
            by a further two months; we will notify you of any such extension within the first month.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">7. Automated Decision-Making</h2>
          <p className="legal-page__text">
            We do not use automated decision-making or profiling as referred to in Article 22 of the GDPR.
            No decisions with legal or similarly significant effects are made about you solely by automated
            means.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">8. Data Protection Officer</h2>
          <p className="legal-page__text">
            We have assessed our processing activities and determined that we are not currently required to
            appoint a Data Protection Officer (DPO) under Art. 37 GDPR. Privacy-related enquiries may be
            directed to{' '}
            <a href="mailto:info@greenearthproduce.nl" className="legal-page__link">
              info@greenearthproduce.nl
            </a>
            .
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">9. Supervisory Authority</h2>
          <p className="legal-page__text">
            You have the right to lodge a complaint with the Dutch Data Protection Authority:
          </p>
          <div className="legal-page__contact-block">
            Autoriteit Persoonsgegevens<br />
            Hoge Nieuwstraat 8, 2514 EL Den Haag<br />
            <a
              href="https://www.autoriteitpersoonsgegevens.nl"
              className="legal-page__link"
              target="_blank"
              rel="noreferrer"
            >
              www.autoriteitpersoonsgegevens.nl
            </a>
          </div>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">10. Cookies</h2>
          <p className="legal-page__text">
            Our website uses the following categories of cookies:
          </p>
          <ul className="legal-page__list">
            <li>
              <strong>Strictly necessary cookies</strong> — essential for the website to function. No consent
              is required for these cookies.
            </li>
            <li>
              <strong>Analytics cookies (Google Analytics)</strong> — we use Google Analytics to understand
              how visitors interact with our site. Google Analytics sets cookies such as{' '}
              <code>_ga</code> and <code>_gid</code> to collect anonymised usage data. These cookies are
              only placed after you provide consent via our cookie banner. You may withdraw consent at any
              time by clicking "Cookie settings" in the site footer or by adjusting your browser settings.
            </li>
          </ul>
          <p className="legal-page__text">
            For a full list of cookies set by Google Analytics, see{' '}
            <a
              href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage"
              className="legal-page__link"
              target="_blank"
              rel="noreferrer"
            >
              Google's cookie documentation
            </a>
            .
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">11. Changes to This Policy</h2>
          <p className="legal-page__text">
            We may update this Privacy Policy periodically. The date at the top of this page reflects the
            most recent revision. Where changes are material, we will take reasonable steps to notify you.
            We encourage you to review this page occasionally.
          </p>
        </section>
      </div>
    </div>
  )
}
