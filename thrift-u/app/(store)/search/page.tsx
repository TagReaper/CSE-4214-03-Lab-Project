"use client"; //Makes this a client-side component (allows for user action)

import { useState, useEffect } from "react"; //Import React's useState hook (allows for the page to remember values between re-renders)
import Link from "next/link"; //Allows navigation between pages
import { useAuthState } from "react-firebase-hooks/auth"; //Checks if user is logged into Firebase
import FireData from "../../../firebase/clientApp"; //Imports Firebase setup and connection
import { collection, getDocs, query, where } from "@firebase/firestore"; 

//Details of an Item
interface Item {
  id: string;
  name: string;
  price: number;
  stock: number;
  quantity: number;
  tags: string[];
  image?: string; //? makes detail optional
  description?: string;
  condition?: string;
  sellerId: string;
  approved: boolean;
}

export default function SearchPage() {
  //Check if user is logged in and firebase load status
  const [user] = useAuthState(FireData.auth);
  const isLoggedIn = !!user; //turns the object into a boolean
  
  //List of items for sale
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); //if string = error message, if null = no error message

  //Stores search text entered by user
  const [search, setSearch] = useState("");
  //Stores category selected by user
  const [selectedCategory, setSelectedCategory] = useState("All");
  //Stores items in cart: itemId: quantity
  const [cart, setCart] = useState<{[key: string]: number}>({}); // Keeps track of items added to the cart

  //Fetch approved items from Firestore
  useEffect(() => {
    const fetchApprovedItems = async () => {
      try {
        setLoading(true);

        //Query approved items only
        const inventoryQuery = query(
          collection(FireData.db, "Inventory"),
          where("approved", "==", true)
        );

        const querySnapshot = await getDocs(inventoryQuery);

        //Convert Firestore docs to items
        const fetchedItems = querySnapshot.docs.map((doc) =>  ({
          id: doc.id,
          name: doc.data().name,
          price: Number(doc.data().price),
          quantity: doc.data().quantity,
          stock: doc.data().quantity, //
          tags: doc.data().tags || [],
          image: doc.data().image,
          description: doc.data().description,
          condition: doc.data().condition,
          sellerId: doc.data().sellerId,
          approved: doc.data().approved,
        }
      )
    );

        setItems(fetchedItems);
      }
      
      catch (err) {
        console.error("Error fetching items: ", err);
        setError("Failed to load items. Please try again.");
      }

      finally {
        setLoading(false);
      }

    };

    fetchApprovedItems();
  }, []);

  //Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

//Filters items based on search text/category
const filteredItems = items.filter(item => {
  const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
  const matchesCategory = selectedCategory === "All" || item.tags.includes(selectedCategory);
  return matchesSearch && matchesCategory;
})

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
    setCart(prev => {
      const newCart = {
        ...prev,
        [item.id]: currentQuantity + 1,
      };
      
      localStorage.setItem("cart", JSON.stringify(newCart));

      return newCart;
    });
    
    console.log(`Added ${item.name} to cart`);
  };

  //Returns # of an item are currently in cart
  const getItemQuantity = (itemId: string) => cart[itemId] || 0;

  //Show loading state
  if (loading) {
    return (
      <div style={{ padding: "2rem", fontFamily: "Arial", textAlign: "center" }}>
        <h2>Loading products...</h2>
      </div>
    )
  }

  //Show error state
  if (error) {
    return (
      <div style={{ padding: "2rem", fontFamily: "Arial", textAlign: "center" }}>
        <h2>Error: {error}</h2>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h1>Search</h1>
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
          <option value="Sports">Sports</option>
          <option value="Kitchen">Kitchen</option>
          <option value="Tech">Tech</option>
          <option value="Living">Living</option>
          <option value="Dining">Dining</option>
          <option value="College">College</option>
          <option value="Gym">Gym</option>
        </select>
      </div>

      {/*No items found message*/}
      {filteredItems.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          No items found. Try adjusting your search and/or filters.
        </p>
      )}

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
              {/*Display image if available*/}
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "4px", marginBottom: "0.5rem"}}
              />
              )}

              <h3>{item.name}</h3>
              <p>${item.price.toFixed(2)}</p>

              {/*Show condition if available*/}
              {item.condition && (
                <p style={{ fontSize: "0.8rem", fontStyle: "italic" }}>
                  {item.condition}
                </p>
              )}

              <p style={{ fontSize: "0.9rem", color: "#666" }}>
                Stock: {item.stock - quantity} left
              </p>

              {/*Show tags*/}
              {item.tags.length > 0 && (
                <div style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>
                  {item.tags.slice(0, 3).join(", ")}
                </div>
              )}
              
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
