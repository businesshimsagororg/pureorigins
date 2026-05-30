import type { PolicySection } from "@/lib/content";

type Props = {
  intro: string;
  sections: PolicySection[];
};

export function PolicyBody({ intro, sections }: Props) {
  return (
    <div className="policy-body">
      <p className="muted">{intro}</p>
      {sections.map((section) => (
        <div className="policy-section" key={section.title}>
          <h2>{section.title}</h2>
          {section.paragraphs?.map((paragraph) => (
            <p className="muted" key={paragraph}>
              {paragraph}
            </p>
          ))}
          {section.bullets ? (
            <ul className="policy-list">
              {section.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {section.note ? <div className="policy-note">{section.note}</div> : null}
        </div>
      ))}
    </div>
  );
}
