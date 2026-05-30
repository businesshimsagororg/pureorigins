import { ContactForm } from "@/components/ContactForm";
import { contact, site } from "@/lib/content";

export const metadata = {
  title: "যোগাযোগ"
};

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">যোগাযোগ</p>
            <h1>{contact.title}</h1>
            <p className="muted">{contact.subtitle}</p>
          </div>
        </div>
        <div className="contact-layout">
          <div className="panel contact-info-panel">
            <h2>{contact.infoTitle}</h2>
            <p className="muted">{contact.infoIntro}</p>
            <div className="contact-items">
              {contact.items.map((item) => (
                <div className="contact-item" key={item.title}>
                  <span className="contact-item-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <div>
                    <h3>{item.title}</h3>
                    {item.href ? (
                      <p>
                        <a href={item.href} target="_blank" rel="noopener noreferrer">
                          {item.text}
                        </a>
                      </p>
                    ) : (
                      <p className="muted">{item.text}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="muted contact-email-note">
              ইমেইল: <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
