import CompactItemListing from '../../../../components/productHandler/itemListingCompact'

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <p>Manage your listed products here.</p>
      <div className=" grid grid-cols-5">
        <CompactItemListing image={'/Graphics/QBClubFootball.png'} price={89.99} productName={'Quarterback Club Signed Football'} quantity={1}/>
        <CompactItemListing image={'/Graphics/QBClubFootball.png'} price={4.99} productName={'Quarterback Club Signed Football'} quantity={0}/>
        <CompactItemListing image={'/Graphics/QBClubFootball.png'} price={4.99} productName={'Quarterback Club Signed Football'} quantity={0}/>
        <CompactItemListing image={'/Graphics/QBClubFootball.png'} price={89.99} productName={'Quarterback Club Signed Football'} quantity={1}/>
        <CompactItemListing image={'/Graphics/QBClubFootball.png'} price={4.99} productName={'Quarterback Club Signed Football'} quantity={0}/>
        <CompactItemListing image={'/Graphics/QBClubFootball.png'} price={4.99} productName={'Quarterback Club Signed Football'} quantity={0}/>
        <CompactItemListing image={'/Graphics/QBClubFootball.png'} price={89.99} productName={'Quarterback Club Signed Football'} quantity={1}/>
        <CompactItemListing image={'/Graphics/QBClubFootball.png'} price={4.99} productName={'Quarterback Club Signed Football'} quantity={0}/>
        <CompactItemListing image={'/Graphics/QBClubFootball.png'} price={4.99} productName={'Quarterback Club Signed Football'} quantity={0}/>
      </div>
    </div>
  );
}
