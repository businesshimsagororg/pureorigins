import { PolicyBody } from "@/components/PolicyBody";
import { policies } from "@/lib/content";

export const metadata = {
  title: "ডেলিভারি পলিসি"
};

export default function DeliveryPage() {
  const policy = policies.delivery;

  return (
    <section className="section">
      <div className="container panel">
        <p className="eyebrow">পলিসি</p>
        <h1>{policy.title}</h1>
        <PolicyBody intro={policy.intro} sections={policy.sections} />
      </div>
    </section>
  );
}
