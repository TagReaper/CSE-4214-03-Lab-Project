import Image from 'next/image'
import SellerItemList from '../../../../components/seller/seller_listItems'

export default function ProductsPage() {
  const [user] = useAuthState(FireData.auth);
  return (
    <div>
      <SellerItemList sellerId={''}/>
    </div>
  );
}
