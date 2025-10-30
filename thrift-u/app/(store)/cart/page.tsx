"use client";

import { useEffect, useState } from "react"; //Import react hooks (useState for state management, useEffect for side effects)
import Link from "next/link";

//Item structure from store
interface Item {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

//Cart item with quantity
interface CartItem {
  item: Item;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]); //Cart state

  //Loads cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart"); //Get cart object from localStorage
    const storedItems = localStorage.getItem("items"); //Get item details from localStorage
    if (storedCart && storedItems) {
      const cart = JSON.parse(storedCart) as { [key: number]: number };
      const items = JSON.parse(storedItems) as Item[];
      
      //Combine quantities and item details
      const cartArray: CartItem[] = Object.entries(cart).map(([itemId, quantity]) => {
        const item = items.find(i => i.id === parseInt(itemId));
        if (!item) throw new Error("Item not found in store data!");
        return { item, quantity };
      });

      setCartItems(cartArray); //Set cart state
    }
  }, []);

  //Update quantity of item in cart
  const updateQuantity = (itemId: number, newQuantity: number) => {
    setCartItems(prev =>
      prev.map(ci => ci.item.id === itemId ? { ...ci, quantity: newQuantity } : ci)
    );

    const storedCart = JSON.parse(localStorage.getItem("cart") || "{}");
    storedCart[itemId] = newQuantity; //Update localStorage
    localStorage.setItem("cart", JSON.stringify(storedCart));
  };

  //Remove item from cart
  const removeItem = (itemId: number) => {
    setCartItems(prev => prev.filter(ci => ci.item.id !== itemId));
    const storedCart = JSON.parse(localStorage.getItem("cart") || "{}");
    delete storedCart[itemId]; //Update localStorage
    localStorage.setItem("cart", JSON.stringify(storedCart));
  };

  const total = cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0); //Calculate total

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
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} //Update quantity
                  style={{ marginLeft: "0.5rem", width: "60px" }}
                />
              </p>
              <p>Subtotal: ${(item.price * quantity).toFixed(2)}</p> {/*Item subtotal*/}
              <button onClick={() => removeItem(item.id)}>Remove</button> {/*Remove item*/}
            </div>
          ))}

          <h2>Total: ${total.toFixed(2)}</h2> {/*Cart total*/}
          <button style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
}