import { CartView } from "@/components/CartView";

export const metadata = {
  title: "Cart"
};

export default function CartPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Cart</p>
            <h1>Your selected products</h1>
          </div>
        </div>
        <CartView />
      </div>
    </section>
  );
}
