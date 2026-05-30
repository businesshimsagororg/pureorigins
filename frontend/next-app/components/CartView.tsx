"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { useCart } from "@/components/CartProvider";

export function CartView() {
  const { items, removeItem, subtotal } = useCart();

  if (!items.length) {
    return (
      <div className="panel">
        <h2>Your cart is empty</h2>
        <p className="muted">Add a product from the shop to start checkout.</p>
        <Button href="/shop">Shop products</Button>
      </div>
    );
  }

  return (
    <div className="checkout-layout">
      <div className="panel summary-list">
        {items.map((item) => (
          <div className="summary-row" key={item.id}>
            <div>
              <strong>{item.name}</strong>
              <p className="muted">{item.weight} x {item.quantity}</p>
            </div>
            <div>
              <strong>৳{item.price * item.quantity}</strong>
              <button className="btn btn-ghost" type="button" onClick={() => removeItem(item.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <aside className="panel summary-list">
        <div className="summary-row">
          <span>Subtotal</span>
          <strong>৳{subtotal}</strong>
        </div>
        <div className="summary-row">
          <span>Delivery</span>
          <strong>Calculated at checkout</strong>
        </div>
        <Link className="btn btn-primary" href="/checkout">
          Checkout
        </Link>
      </aside>
    </div>
  );
}
