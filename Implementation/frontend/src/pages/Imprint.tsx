import './Legal.css'

export function Imprint() {
  return (
    <div className="legal-page">
      <div className="legal-page__inner">
        <h1 className="legal-page__title">Imprint</h1>
        <p className="legal-page__updated">
          Legal notice as required by Art. 3:15d of the Dutch Civil Code (Burgerlijk Wetboek) and
          the Electronic Commerce Directive (2000/31/EC)
        </p>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">Company Details</h2>
          <div className="legal-page__contact-block">
            <strong>GreenEarth Produce</strong><br />
            Venrayseweg 118 C<br />
            5928 RH Venlo<br />
            The Netherlands<br />
            <br />
            Phone:{' '}
            <a href="tel:+31772066760" className="legal-page__link">
              +31 77 206 6760
            </a>
            <br />
            Email:{' '}
            <a href="mailto:gep@greenearthproduce.n" className="legal-page__link">
             gep@greenearthproduce.n
            </a>
          </div>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">Registration</h2>
          <div className="legal-page__contact-block">
            Chamber of Commerce (KvK): <em>74852264</em><br />
            VAT identification number: <em>NL860050154B01</em>
          </div>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">Legal Representative</h2>
          <p className="legal-page__text">
            Shareholder & CEO: <em>Min Zhang</em>
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">Responsible for Content</h2>
          <p className="legal-page__text">
            GreenEarth Produce<br />
            Venrayseweg 118 C, 5928 RH Venlo, The Netherlands
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">Online Dispute Resolution</h2>
          <p className="legal-page__text">
            The European Commission provides a platform for online dispute resolution (ODR) at{' '}
            <a
              href="https://ec.europa.eu/consumers/odr"
              className="legal-page__link"
              target="_blank"
              rel="noreferrer"
            >
              ec.europa.eu/consumers/odr
            </a>
            . We are not required to participate in consumer arbitration proceedings, but we are
            willing to engage in dispute resolution where appropriate.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">Disclaimer</h2>
          <p className="legal-page__text">
            Despite careful editorial control, we accept no liability for the content of external
            links. The operators of linked pages are solely responsible for their content.
          </p>
        </section>
      </div>
    </div>
  )
}
