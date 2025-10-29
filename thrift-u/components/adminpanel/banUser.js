"use client";

import FireData from "@/firebase/clientApp";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "@firebase/firestore";

const BanUser = ({ access, id }) => {
  const [User, setUser] = useState();
  const [ban, setBan] = useState();

  useEffect(() => {
    const fetch = async () => {
      if (access == 1) {
        const docRef = doc(FireData.db, "Seller", id);
        setUser(docRef);
        const ref = await getDoc(docRef);
        setBan(ref.data().banned);
      } else if (access == 2) {
        const docRef = doc(FireData.db, "Buyer", id);
        setUser(docRef);
        const ref = await getDoc(docRef);
        setBan(ref.data().banned);
      }
    };
    fetch();
  }, [access, id]);

  const handleBan = async () => {
    await updateDoc(User, {
      banned: !ban,
    });
    setBan(!ban);
  };
  if (!ban) {
    return (
      <div>
        <button
          onClick={handleBan}
          className="w-20 border-2 border-black rounded-2xl font-bold font-stretch-100% bg-red-500 text-white"
        >
          BAN
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <button
          onClick={handleBan}
          className="w-20 border-2 border-black rounded-2xl font-bold font-stretch-100% bg-blue-500 text-white"
        >
          UN-BAN
        </button>
      </div>
    );
  }
};

export default BanUser;
