import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  const brandText =
    "PureOrigiins brings clean seeds, powders, honey and wellness bundles into simple daily routines.";

  return (
    <>
      <section className="pre-footer">
        <div className="container pre-footer-inner">
          <div>
            <strong>PureOrigiins</strong>
            <p>{brandText}</p>
          </div>
          <p>Carefully sourced products for everyday nutrition.</p>
          <p>Clean packaging and simple order support.</p>
          <p>Delivery across Bangladesh.</p>
        </div>
      </section>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <h3>PureOrigiins</h3>
            <p>{brandText}</p>
            <a
              className="footer-facebook"
              href="https://www.facebook.com/share/1KgbM2LLo7/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
            >
              Message us on Facebook
            </a>
          </div>
          <div className="footer-links-group">
            <h3>Quick Links</h3>
            <div className="footer-links">
              <Link href="/">Home</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/combos">Combo Offers</Link>
              <Link href="/about">About</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/order-lookup">Track Order</Link>
            </div>
          </div>
          <div className="footer-links-group">
            <h3>Policy Links</h3>
            <div className="footer-links">
              <Link href="/return-policy">Return Policy</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/delivery">Delivery Policy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
          <div className="footer-contact-group">
            <h3>Contact</h3>
            <div className="footer-contact-lines">
              <p>Facebook support available</p>
              <p>Email: support@pureorigins.com</p>
              <p>Order confirmation by phone</p>
            </div>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>© {year} PureOrigiins. All rights reserved.</p>
          <div className="footer-payments">
            {["COD", "bKash", "Nagad", "Rocket"].map((payment) => (
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
