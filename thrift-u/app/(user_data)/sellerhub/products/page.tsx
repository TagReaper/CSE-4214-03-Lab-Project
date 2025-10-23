import ItemListing from '../../../../components/productHandler/itemListing'
import Image from 'next/image';

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <p>Manage your listed products here.</p>
      <ItemListing image={'/Graphics/ImagePlaceholder.jpg'} price={2.99} productName={'Picture'} sellerName={'John'} quantity={1}/>
    </div>
  );
}
