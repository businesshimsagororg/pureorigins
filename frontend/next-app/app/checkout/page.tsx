import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata = {
  title: "Checkout"
};

export default function CheckoutPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Checkout</p>
            <h1>Confirm your order</h1>
          </div>
        </div>
        <CheckoutForm />
      </div>
    </section>
  );
}
