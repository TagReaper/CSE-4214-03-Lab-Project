"use client";
import { useState, useEffect } from "react";
import FireData from "@/firebase/clientApp";
import { collection, query, where, getDocs } from "@firebase/firestore";
import { approveProduct, denyProduct } from "./actions";
import { Button } from "../ui/button";
import AdminAudit from "./audit";

const PendingProductList = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // function to fetch pending products
  const fetchPendingProducts = async () => {
    setLoading(true);
    // create query for unapproved products
    const q = query(
      collection(FireData.db, "Inventory"),
      where("approved", "==", false),
      where("deletedAt", "==", "")
    );

    // execute the query
    const querySnapshot = await getDocs(q);
    // map results to array
    const products = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setPendingProducts(products);
    setLoading(false);
  };

  // run function on component load
  useEffect(() => {
    fetchPendingProducts();
  }, []);

  // approve button functionality
  const handleDeny = async (productId) => {
    const result = await denyProduct(productId);
    if (result.error) {
      alert(`Error: ${result.error}`);
    } else {
      alert(result.success);
      fetchPendingProducts(); // refresh the list after approving
    }
  };

  if (loading) {
    return <p>Loading pending products...</p>;
  }

  return (
    <div>
      <h2>
        <u>Pending Product Approvals</u>
      </h2>
      {pendingProducts.length === 0 ? (
        <p>No products are currently awaiting approval.</p>
      ) : (
        <ul className="list">
          {pendingProducts.map((product) => (
            <li
              className="border rounded grid m-1 p-2 grid-cols-4 items-center"
              key={product.id}
            >
              <span className="font-bold">{product.name}</span>
              <span>Price: ${product.price}</span>
              <span>Seller ID: {product.sellerId}</span>
              <span className="text-center">
                <AdminAudit itemId={product.id} />
                <Button
                  onClick={() => handleDeny(product.id)}
                  className="border-2 bg-red-500 border-black hover:border-gray-400"
                >
                  Deny
                </Button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingProductList;
