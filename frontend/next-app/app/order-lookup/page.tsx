import { orderLookup } from "@/lib/content";

export const metadata = {
  title: "অর্ডার ট্র্যাক"
};

export default function OrderLookupPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">অর্ডার ট্র্যাক</p>
            <h1>{orderLookup.title}</h1>
            <p className="muted">{orderLookup.subtitle}</p>
          </div>
        </div>
        <form className="panel form-grid order-lookup-form">
          <h2 className="full">{orderLookup.formTitle}</h2>
          <p className="muted full">{orderLookup.formIntro}</p>
          <label htmlFor="lookup-phone">
            {orderLookup.phoneLabel}
            <input
              id="lookup-phone"
              name="phone"
              placeholder={orderLookup.phonePlaceholder}
              maxLength={11}
              required
            />
          </label>
          <label htmlFor="lookup-order">
            {orderLookup.orderLabel}
            <input
              id="lookup-order"
              name="orderId"
              placeholder={orderLookup.orderPlaceholder}
              required
            />
          </label>
          <button className="btn btn-primary" type="submit">
            {orderLookup.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
