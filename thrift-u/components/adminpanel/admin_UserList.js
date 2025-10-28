/* eslint-disable @typescript-eslint/no-array-constructor */
"use client";

import { useState, useEffect } from "react";
import FireData from "../../firebase/clientApp";
import { collection, doc, getDoc, getDocs } from "@firebase/firestore";
import { approveSeller, toggleBanStatus } from "./actions";

const ListUsers = () => {
  const [buyerList, setBList] = useState([]);
  const [sellerList, setSList] = useState([]);
  const [sellerPendList, setSPList] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [isApproving, setisApproving] = useState(null);
  const [isBanning, setisBanning] = useState(null);
  const fetchItems = async () => {
    setListLoading(true);
    try {
      //fetch buyers and sellers from db
      const querySnapshot = await getDocs(collection(FireData.db, "Buyer"));
      const buyers = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const querySnapshot2 = await getDocs(collection(FireData.db, "Seller"));
      const sellers = querySnapshot2.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      var sellerListTemp = new Array();
      var sellerPendListTemp = new Array();
      var buyerListTemp = new Array();

      for (let index = 0; index < sellers.length; index++) {
        const docRef = await getDoc(
          doc(FireData.db, "User", sellers[index].UserID)
        );
        if (!docRef.exists()) continue;

        const userData = {
          ...docRef.data(),
          id: sellers[index].UserID,
          SellerID: sellers[index].id,
          banned: sellers[index].banned || false,
        };

        if (sellers[index].validated == true) {
          sellerListTemp.push(userData);
        } else {
          sellerPendListTemp.push(userData);
        }
      }
      for (let index = 0; index < buyers.length; index++) {
        const docRef = await getDoc(
          doc(FireData.db, "User", buyers[index].UserID)
        );
        if (!docRef.exists()) continue;

        buyerListTemp.push({
          ...docRef.data(),
          id: buyers[index].UserID,
          BuyerID: buyers[index].id,
          banned: buyers[index].banned || false,
        });
      }
      setBList(buyerListTemp);
      setSList(sellerListTemp);
      setSPList(sellerPendListTemp);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleApproveSeller = async (sellerUid) => {
    setisApproving(sellerUid);

    const result = await approveSeller(sellerUid);

    if (result.success) {
      //manually update lists instead of refreshing old data
      alert(result.message || "Seller approved!");
      const approvedUser = sellerPendList.find((user) => user.id === sellerUid);
      if (approvedUser) {
        //move seller from pending to approved list
        setSPList((currentList) =>
          currentList.filter((user) => user.id !== sellerUid)
        );
        setSList((currentList) => [approvedUser, ...currentList]);
      } else {
        await fetchUsers(); //go back to fetching regularly if error
      }
    } else {
      alert(`Error: ${result.message || "Failed to approve seller."}`);
    }

    setisApproving(null);
  };

  const handleBan = async (id, access) => {
    setisBanning(id);
    const result = await toggleBanStatus(id, access);

    if (result.success) {
      // Manually update the state
      if (access === 1) {
        // Seller
        setSList((currentList) =>
          currentList.map((user) =>
            user.SellerID === id
              ? { ...user, banned: result.newBannedStatus }
              : user
          )
        );
      } else {
        // Buyer
        setBList((currentList) =>
          currentList.map((user) =>
            user.BuyerID === id
              ? { ...user, banned: result.newBannedStatus }
              : user
          )
        );
      }
    } else {
      alert(`Error: ${result.error}`);
    }

    setisBanning(null);
  };

  if (listLoading) {
    return <p>Loading user lists...</p>;
  }

  return (
    <div>
      <h2>
        <u>List of Buyers</u>
      </h2>
      <ul className="list">
        {buyerList.map((item) => (
          <li
            className="border rounded grid m-1 grid-cols-3 overflow-hidden"
            key={item.id}
          >
            <span className="center font-bold"> {item.id}</span>
            <span className="center">
              {" "}
              {item.firstName} {item.lastName}
            </span>
            <span className="center"> {item.email} </span>
            <span></span>
            <span className="center">
              <button
                onClick={() => handleBan(item.BuyerID, 2)}
                disabled={isBanning != null}
                className={`w-20 border-2 border-black rounded-2xl font-bold font-stretch-100% text-white disabled:opacity-50
                  ${item.banned ? "bg-blue-500" : "bg-red-500"}`}
              >
                {isBanning === item.BuyerID
                  ? "..."
                  : item.banned
                  ? "UN-BAN"
                  : "BAN"}
              </button>
            </span>
          </li>
        ))}
      </ul>
      <h2>
        <u>List of confirmed Sellers</u>
      </h2>
      <ul className="list">
        {sellerList.map((item) => (
          <li className="border rounded grid m-1 grid-cols-3" key={item.id}>
            <span className="center font-bold"> {item.id}</span>
            <span className="center">
              {" "}
              {item.firstName} {item.lastName}
            </span>
            <span className="center"> {item.email} </span>
            <span></span>
            <span className="center">
              <button
                onClick={() => handleBan(item.SellerID, 1)}
                disabled={isBanning != null}
                className={`w-20 border-2 border-black rounded-2xl font-bold font-stretch-100% text-white disabled:opacity-50
                  ${item.banned ? "bg-blue-500" : "bg-red-500"}`}
              >
                {isBanning === item.SellerID
                  ? "..."
                  : item.banned
                  ? "UN-BAN"
                  : "BAN"}
              </button>
            </span>
          </li>
        ))}
      </ul>
      <h2>
        <u>List of pending Sellers</u>
      </h2>
      <ul className="list">
        {sellerPendList.map((item) => (
          <li className="border rounded grid m-1 grid-cols-3" key={item.id}>
            <span className="center font-bold"> {item.id}</span>
            <span className="center">
              {" "}
              {item.firstName} {item.lastName}
            </span>
            <span className="center"> {item.email} </span>

            <span></span>
            <span className="center">
              <button
                onClick={() => handleApproveSeller(item.id)}
                disabled={isApproving}
                className="w-20 border-2 border-black rounded-2xl font-bold font-stretch-100% bg-blue-500 text-white disabled:opacity-50"
              >
                {isApproving === item.id ? "APPROVING..." : "APPROVE"}
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListUsers;
