import Link from "next/link";
import { footer, site } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <section className="pre-footer">
        <div className="container pre-footer-inner">
          <div>
            <strong>{site.name}</strong>
            <p>{footer.brandText}</p>
          </div>
          {footer.preFooter.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </section>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <h3>{site.name}</h3>
            <p>{footer.brandText}</p>
            <a
              className="footer-facebook"
              href={site.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {site.facebookLabel}
            </a>
          </div>
          <div>
            <h3>{footer.quickLinks}</h3>
            <div className="footer-links">
              <Link href="/">হোম</Link>
              <Link href="/shop">পণ্যসমূহ</Link>
              <Link href="/combos">কম্বো অফার</Link>
              <Link href="/about">আমাদের সম্পর্কে</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/order-lookup">অর্ডার ট্র্যাক</Link>
            </div>
          </div>
          <div>
            <h3>{footer.policyLinks}</h3>
            <div className="footer-links">
              <Link href="/return-policy">রিটার্ন পলিসি</Link>
              <Link href="/privacy">প্রাইভেসি পলিসি</Link>
              <Link href="/delivery">ডেলিভারি পলিসি</Link>
              <Link href="/terms">শর্তাবলী</Link>
            </div>
          </div>
          <div>
            <h3>{footer.contactTitle}</h3>
            <div className="footer-contact-lines">
              {footer.contactLines.map((line) =>
                line.href ? (
                  <p key={line.text}>
                    <span aria-hidden="true">{line.icon}</span>{" "}
                    <a href={line.href} target="_blank" rel="noopener noreferrer">
                      {line.text}
                    </a>
                  </p>
                ) : (
                  <p key={line.text}>
                    <span aria-hidden="true">{line.icon}</span> {line.text}
                  </p>
                )
              )}
            </div>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>
            © {year} {footer.copyright}
          </p>
          <div className="footer-payments">
            {footer.payments.map((payment) => (
              <span className="payment-pill" key={payment}>
                {payment}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
