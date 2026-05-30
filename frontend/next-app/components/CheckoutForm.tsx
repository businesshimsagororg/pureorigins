"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { useCart } from "@/components/CartProvider";

const districts = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Other"];

export function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const delivery = subtotal >= 800 ? 0 : 80;
  const total = subtotal + delivery;
  const disabled = !items.length || submitting;

  const itemsText = useMemo(
    () => items.map((item) => `${item.name} ${item.weight} x ${item.quantity}`).join(", "),
    [items]
  );

  return (
    <div className="checkout-layout">
      <form
        className="panel form-grid"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!items.length) return;

          const form = new FormData(event.currentTarget);
          const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
          if (!apiBase) {
            setMessage("Order captured locally. Connect NEXT_PUBLIC_API_BASE_URL to submit to backend.");
            clearCart();
            return;
          }

          setSubmitting(true);
          setMessage("");
          try {
            const response = await fetch(`${apiBase.replace(/\/$/, "")}/api/orders`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                customerName: form.get("name"),
                customerPhone: form.get("phone"),
                customerEmail: form.get("email"),
                shippingAddress: form.get("address"),
                district: form.get("district"),
                upazila: form.get("upazila"),
                paymentMethod: "COD",
                notes: form.get("note"),
                items: items.map((item) => ({
                  product: item.productId || item.slug,
                  variantWeight: item.weight,
                  quantity: item.quantity
                }))
              })
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.message || "Order submission failed.");
            clearCart();
            setMessage(`Order placed successfully. Order ID: ${data.orderAccess?.orderId || data.order?._id}`);
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Order submission failed.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <label htmlFor="co-name">
          Name *
          <input id="co-name" name="name" required />
        </label>
        <label htmlFor="co-phone">
          Mobile number *
          <input id="co-phone" name="phone" required pattern="01[3-9][0-9]{8}" />
        </label>
        <label htmlFor="co-email">
          Email
          <input id="co-email" name="email" type="email" />
        </label>
        <div className="form-grid full district-row">
          <label htmlFor="co-district">
            District *
            <select id="co-district" name="district" required defaultValue="">
              <option value="" disabled>Select district</option>
              {districts.map((district) => (
                <option value={district} key={district}>{district}</option>
              ))}
            </select>
          </label>
          <label htmlFor="co-upazila">
            Upazila / Thana *
            <input id="co-upazila" name="upazila" required />
          </label>
        </div>
        <label htmlFor="co-address" className="full">
          Address *
          <textarea id="co-address" name="address" required />
        </label>
        <label htmlFor="co-note" className="full">
          Note
          <textarea id="co-note" name="note" />
        </label>
        <input type="hidden" name="items" value={itemsText} />
        <Button type="submit" disabled={disabled}>
          {submitting ? "Placing Order..." : "Place Order"}
        </Button>
        {message ? <p className="muted full">{message}</p> : null}
      </form>
      <aside className="panel summary-list">
        <h2>Order summary</h2>
        {items.length ? (
          items.map((item) => (
            <div className="summary-row" key={item.id}>
              <span>{item.name} ({item.weight})</span>
              <strong>৳{item.price * item.quantity}</strong>
            </div>
          ))
        ) : (
          <p className="muted">Your cart is empty.</p>
        )}
        <div className="summary-row">
          <span>Subtotal</span>
          <strong>৳{subtotal}</strong>
        </div>
        <div className="summary-row">
          <span>Delivery</span>
          <strong>৳{delivery}</strong>
        </div>
        <div className="summary-row">
          <span>Total</span>
          <strong>৳{total}</strong>
        </div>
      </aside>
    </div>
  );
}
