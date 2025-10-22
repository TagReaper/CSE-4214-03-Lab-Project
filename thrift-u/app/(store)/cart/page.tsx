"use client";

import Link from "next/link";

export default function CartPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Your Cart</h1>
      <p>These are the items you’ve added to your cart.</p>

      <ul>
        <li>Vintage Jacket - $40</li>
        <li>Retro Sneakers - $55</li>
      </ul>

      <div style={{ marginTop: "2rem" }}>
        <Link href="/buyer/checkout">Proceed to Checkout</Link>
      </div>
    </div>
  );
}
