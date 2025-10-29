"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Same interface as your store items
interface Item {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface CartItem {
  item: Item;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart"); // get cart object
    const storedItems = localStorage.getItem("items"); // get item details
    if (storedCart && storedItems) {
      const cart = JSON.parse(storedCart) as { [key: number]: number };
      const items = JSON.parse(storedItems) as Item[];
      
      // Build array of cart items with quantity and details
      const cartArray: CartItem[] = Object.entries(cart).map(([itemId, quantity]) => {
        const item = items.find(i => i.id === parseInt(itemId));
        if (!item) throw new Error("Item not found in store data!");
        return { item, quantity };
      });

      setCartItems(cartArray);
    }
  }, []);

  // Update quantity in cart
  const updateQuantity = (itemId: number, newQuantity: number) => {
    setCartItems(prev =>
      prev.map(ci => ci.item.id === itemId ? { ...ci, quantity: newQuantity } : ci)
    );

    const storedCart = JSON.parse(localStorage.getItem("cart") || "{}");
    storedCart[itemId] = newQuantity;
    localStorage.setItem("cart", JSON.stringify(storedCart));
  };

  // Remove item from cart
  const removeItem = (itemId: number) => {
    setCartItems(prev => prev.filter(ci => ci.item.id !== itemId));
    const storedCart = JSON.parse(localStorage.getItem("cart") || "{}");
    delete storedCart[itemId];
    localStorage.setItem("cart", JSON.stringify(storedCart));
  };

  const total = cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h1>Cart</h1>
        <Link href="/store"><button>Back to Store</button></Link>
      </header>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map(({ item, quantity }) => (
            <div key={item.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem", borderRadius: "8px" }}>
              <h3>{item.name}</h3>
              <p>Price: ${item.price.toFixed(2)}</p>
              <p>
                Quantity: 
                <input 
                  type="number" 
                  min={1} 
                  max={item.stock} 
                  value={quantity} 
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  style={{ marginLeft: "0.5rem", width: "60px" }}
                />
              </p>
              <p>Subtotal: ${(item.price * quantity).toFixed(2)}</p>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          ))}

          <h2>Total: ${total.toFixed(2)}</h2>
          <button style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
}
