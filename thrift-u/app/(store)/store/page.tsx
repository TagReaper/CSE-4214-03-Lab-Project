"use client"; //Makes this a client-side component (allows for user action)

import { useState } from "react"; //Import React's useState hook (allows for the page to remember values between re-renders)
import Link from "next/link"; //Allows navigation between pages
import { useAuthState } from "react-firebase-hooks/auth"; //Checks if user is logged into Firebase
import FireData from "../../../firebase/clientApp"; //Imports Firebase setup and connection

//Details characteristics of an Item
interface Item {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  // image: string; // add later
}

export default function StorePage() {
  // Check if user is logged in and firebase load status
  const [user] = useAuthState(FireData.auth);
  const isLoggedIn = !!user; //turns the object into a boolean
  
  // List of items for sale
  const[items] = useState<Item[]>([
    { id: 1, name: "Hoodie", category: "Clothing", price: 20.00, stock: 5 },
    { id: 2, name: "Jeans", category: "Clothing", price: 15.00, stock: 3 },
    { id: 3, name: "Poster", category: "Home", price: 10.00, stock: 10 },
    { id: 4, name: "Shoes", category: "Shoes", price: 100.00, stock: 2 },
  ]);

  //Stores search text entered by user
  const [search, setSearch] = useState("");
  //Stores category selected by yser
  const [selectedCategory, setSelectedCategory] = useState("All");
  //Stores items in cart: itemId: quantity
  const [cart, setCart] = useState<{[key: number]: number}>({}); // Keeps track of items added to the cart

  //Filters items based on search text/category 
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  //Runs when user clicks "add to cart"
  const handleAddToCart = (item: Item) => {
    if (!isLoggedIn) {
      alert("Please log in to add items to cart."); //displayed if a guest attempts to add item to cart
      return;
    }

    const currentQuantity = cart[item.id] || 0; //Get how many of this item are already in cart
    
    //Prevents adding more items in cart than are in stock
    if (currentQuantity >= item.stock) {
      alert(`Sorry, only ${item.stock} ${item.name}(s) in stock!`);
      return;
    }

    //Updates cart with additional items
    setCart(prev => ({
      ...prev, //stores previous # of an item in cart
      [item.id]: currentQuantity + 1 //increases quantity of specific item selected
    }));
    
    console.log(`Added ${item.name} to cart`);
  };

  //Returns # of an item are currently in cart
  const getItemQuantity = (itemId: number) => cart[itemId] || 0;

  //
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h1>Store</h1>
        <div>
          <span style={{ marginRight: "1rem", color: isLoggedIn ? "green" : "red" }}>{/*ternary operator, if/else statement for JavaScript/TypeScript. condition ? valueIfTrue : valueIfFalse*/}
            {isLoggedIn ? "Logged In" : "Not Logged In"}
          </span>
          <Link href="/cart"><button>Cart</button></Link> {/*Use link for user interaction to next page, use useRouter/useEffect/router.push for an automatic redirect*/}
        </div>
      </header>

      {/*Search bar and category dropdown*/}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "1rem" }}
        />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="All">All</option>
          <option value="Clothing">Clothing</option>
          <option value="Home">Home</option>
          <option value="Shoes">Shoes</option>
        </select>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {filteredItems.map((item) => {
          const quantity = getItemQuantity(item.id);
          const isOutOfStock = quantity >= item.stock;
          
          return (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                width: "180px",
                textAlign: "center",
              }}
            >
              <h3>{item.name}</h3>
              <p>${item.price.toFixed(2)}</p>
              <p style={{ fontSize: "0.9rem", color: "#666" }}>
                Stock: {item.stock - quantity} left
              </p>
              
              {/*Shows # of item in cart*/}
              {quantity > 0 && (
                <p style={{ 
                  backgroundColor: "#e7f3ff", 
                  padding: "0.5rem", 
                  borderRadius: "4px",
                  margin: "0.5rem 0",
                  fontWeight: "bold"
                }}>
                  In Cart: {quantity}
                </p>
              )}
              
              {/*Add to cart button (disabled if out of stock)*/}
              <button 
                onClick={() => handleAddToCart(item)}
                disabled={isOutOfStock}
                style={{
                  opacity: isOutOfStock ? 0.5 : 1, //fade button if out of stock
                }}
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
