'use client'

import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import {useAuthState} from "react-firebase-hooks/auth";
import FireData from "../../../../firebase/clientApp";
import SellerItemList from '../../../../components/seller/seller_listItems'

export default function ProductsPage() {
    const router = useRouter();
    //Check sign-in state
    const [user] = useAuthState(FireData.auth);
    //Pushed to home if they are signed in
    useEffect(() => {
      if(user){
        if (user.uid != 'beacon') {
            router.push("/");
        }
      }
    }, [user, router]);

  return (
    <div>
      <SellerItemList sellerId={''}/>
    </div>
  );
}
