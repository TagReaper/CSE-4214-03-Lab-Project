'use client'

import {useAuthState} from "react-firebase-hooks/auth";
import FireData from "../../../../firebase/clientApp";
import SellerItemList from '../../../../components/seller/seller_listItems'

export default function ProductsPage() {
  //get sign-in state
  const [user] = useAuthState(FireData.auth);

  if (user){
    return (
    <div>
      <SellerItemList sellerId={user.uid}/>
    </div>
  );
  } else {
    return (
      <div className= "center text-2xl">
        Loading...
      </div>
    )
  }
}
