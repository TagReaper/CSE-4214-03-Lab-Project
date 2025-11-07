"use client"; //Makes this a client-side component (allows for user action)

import { useState, useEffect } from "react"; //Import React's useState hook (allows for the page to remember values between re-renders)
import FireData from "../firebase/clientApp"; //Imports Firebase setup and connection
import { collection, getDocs } from "@firebase/firestore";
import CompactItemListing from "./productHandler/itemListingCompact";
import { Input } from "./ui/input";
import { 
    MultiSelect,
    MultiSelectContent,
    MultiSelectGroup,
    MultiSelectItem,
    MultiSelectTrigger,
    MultiSelectValue,
} from "@/components/ui/multi-select"
import { useSearchParams } from "next/navigation";


const Search = () => {
    const searchParams = useSearchParams();
    //List of items for sale
    const [items, setItems] = useState([]);
    const [itemsApproved, setApproved] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setErr] = useState(""); //if string = error message, if null = no error message

    //Stores search text entered by user
    const [search, setSearch] = useState("");
    //Stores category selected by user
    const [selectedCategories, setSelectedCategories] = useState([]);

    //Categories
    const categories = [
        "Sports",
        "Clothing",
        "College",
        "Kitchen",
        "Hoodie",
        "Shirt",
        "Hat",
        "Football",
        "Baseball",
        "Basketball",
        "Soccer",
        "Hockey",
        "Crafts",
        "Gym",
        "Hand-Made",
        "Decoration",
        "Misc",
        "Tennis",
        "Equipment",
        "Tech",
        "Jewlery",
        "Living",
        "Dining"
    ]

    useEffect(() => {
      const queryParam = searchParams.get("q");
        if (queryParam) {
          setSearch(queryParam);
        }
    }, [searchParams]); 
    
    
  //Fetch approved items from Firestore
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(
          collection(FireData.db, "Inventory")
        );
        setItems(
          querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      } catch (err) {
        console.error("Error fetching items: ", err);
        setErr("Failed to load items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const sortItems = async () => {
      let temp = [];
      for (let index = 0; index < items.length; index++) {
        if (items[index].approved && items[index].deletedAt == "") {
          temp.push(items[index]);
        }
      }
      setApproved(temp);
    };
    sortItems();
  }, [items]);

  //Filters items based on search text/category
  const filteredItems = itemsApproved.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.tags.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  //Show loading state
  if (loading) {
    return (<div
        style={{ padding: "2rem", fontFamily: "Arial", textAlign: "center" }}
      >
        <h2>Loading products...</h2>
      </div>
    );
  }
        
  //Show error state
  if (error != "") {
    return (
      <div
        style={{ padding: "2rem", fontFamily: "Arial", textAlign: "center" }}
      >
        <h2>Error: {error}</h2>
        <button onClick={() => location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
        <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
            <h1>Search</h1>
        </header>

        {/*Search bar and category multi-select*/}
        <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
            <Input
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            style={{ width: "300px", padding: "0.5rem" }}
        />

        <div style={{ minWidth: "250px" }}>
            <MultiSelect
                onValuesChange={setSelectedCategories}
                values={selectedCategories}
            >
                <MultiSelectTrigger className="w-full">
                    <MultiSelectValue placeholder="Filter by categories" />
                </MultiSelectTrigger>
                <MultiSelectContent>
                    <MultiSelectGroup>
                        {categories.map((category) => (
                            <MultiSelectItem key={category} value={category}>
                                {category}
                            </MultiSelectItem>
                        ))}
                    </MultiSelectGroup>
                </MultiSelectContent>
            </MultiSelect>
        </div>
    </div>

    {/*Selected Categories display*/}
    {selectedCategories.length > 0 && (
        <div style={{ marginBottom: "1rem", fontSize: "0.875rem", color: "#666" }}>
            Filtering by: {selectedCategories.join(", ")}
            <button
                onClick={() => setSelectedCategories([])}
                style={{
                    marginLeft: "0.5rem",
                    color: "#3b82f6",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer"
                }}
            >
                Clear filters
            </button>
        </div>
    )}

    {/*Results COunt*/}
    <div style={{ marginBottom: "1rem", fontSize: "0.875rem", color: "#666" }}>
        {filteredItems.length} item{filteredItems.length !== 1 ? 'ies' : ''} found
    </div>

        {/*No items found message*/}
        {filteredItems.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "2rem" }}>
            No items found. Try adjusting your search and/or filters.
            </p>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {filteredItems.map((item) => {
                return (
                    <div key={item.id}>
                        <CompactItemListing itemId={item.id} image={item.image} price={item.price} productName={item.name} quantity={item.quantity}/>
                    </div>
                );
            })}
        </div>
    </div>
);
}

      {/*Search bar and category dropdown*/}
      <div style={{ marginBottom: "1rem" }}>
        <Input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "20dvw", padding: "0.5rem", marginRight: "1rem" }}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
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
          return (
            <div key={item.id}>
              <CompactItemListing
                itemId={item.id}
                image={item.image}
                price={item.price}
                productName={item.name}
                quantity={item.quantity}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Search;
