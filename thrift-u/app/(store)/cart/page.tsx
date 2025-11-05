"use client";

import { useEffect, useState } from "react"; //Import react hooks (useState for state management, useEffect for side effects)
import Link from "next/link";
import FireData from "../../../firebase/clientApp";
import { collection, getDocs, query, where, documentId } from "@firebase/firestore"

//Item structure from store
interface Item {
  id: string;
  name: string;
  price: number;
  stock: number;
  quantity: number;
  tags: string[];
  image?: string;
  description?: string;
  condition?: string;
  sellerId: string;
  approved: boolean;
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
    const loadCart = async () => {
      const storedCart = localStorage.getItem("cart");

      if (storedCart) {
        const cart = JSON.parse(storedCart) as { [key: string]: number };
        const itemIds = Object.keys(cart);

        if (itemIds.length === 0) {
          setCartItems([]);
          return;
        }

        try {
          //Fetch items from Firestore using IDs from cart
          const itemsQuery = query(
          collection(FireData.db, "Inventory"),
          where(documentId(), "in", itemIds)
        );

        const querySnapshot = await getDocs(itemsQuery);

        const items: Item[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          price: Number(doc.data().price),
          quantity: doc.data().quantity,
          stock: doc.data().quantity,
          tags: doc.data().tags || [],
          image: doc.data().image,
          description: doc.data().description,
          condition: doc.data().condition,
          sellerId: doc.data().sellerId,
          approved: doc.data().approved,
        }));

        //Combine cart quantities with fetched items
        const cartArray: CartItem[] = itemIds.map((itemId) => {
          const item = items.find(i => i.id === itemId);
          if (!item) throw new Error("Item not found in Firestore");
          return { item, quantity: cart[itemId] };
        });

        setCartItems(cartArray);
        }
        catch (error) {
          console.error("Error loading cart: ", error);
          alert("Failed to load cart items. Please try again.");
        }
      }
    };

    loadCart();
  }, []);

  //Update quantity of item in cart
  const updateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(prev =>
      prev.map(ci => ci.item.id === itemId ? { ...ci, quantity: newQuantity } : ci)
    );

    const storedCart = JSON.parse(localStorage.getItem("cart") || "{}");
    storedCart[itemId] = newQuantity; //Update localStorage
    localStorage.setItem("cart", JSON.stringify(storedCart));
  };

  //Remove item from cart
  const removeItem = (itemId: string) => {
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
        <Link href="/search"><button>Back to Search</button></Link>
      </header>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map(({ item, quantity }) => (
            <div key={item.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem", borderRadius: "8px" }}>
              <h3>{item.name}</h3>
              <p>Price: ${item.price.toFixed(2)}</p>

              <div className="flex items-center gap-2">
              <span>Quantity:</span>
              <div className="number-control ml-2">
                <span
                  className="number-left"
                  onClick={() => updateQuantity(item.id, Math.max(1, quantity - 1))}
                >
                  -
                </span>

                <input
                  className="number-quantity"
                  type="text"
                  readOnly
                  value={quantity}
                />

                <span
                  className="number-right"
                  onClick={() => updateQuantity(item.id, Math.min(item.stock, quantity + 1))}
                >
                  +
                </span>
              </div>
            </div>

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