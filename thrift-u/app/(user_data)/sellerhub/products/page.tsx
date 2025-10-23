import CompactItemListing from '../../../../components/productHandler/itemListingCompact'
import Image from 'next/image'

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <div className='flex flex-wrap justify-evenly border-b-8 border-dashed'>
        <CompactItemListing image={'/Graphics/QBClubFootball.png'} price={89.99} productName={'Quarterback Club Signed Football'} quantity={1}/>
        <CompactItemListing image={'/Graphics/QBClubFootball.png'} price={9.99} productName={'Quarterback Club Signed Football'} quantity={0}/>
        <CompactItemListing image={'/Graphics/ImagePlaceholder.png'} price={0.99} productName={'Blank Picture'} quantity={0}/>
        <CompactItemListing image={'/Graphics/QBClubFootball.png'} price={4.99} productName={'Quarterback Club Signed Football'} quantity={0}/>
      </div>
      <h1>Pending Products</h1>
      <div className='flex flex-wrap justify-evenly'>
        <CompactItemListing image={'/Graphics/QBClubFootball.png'} price={74.99} productName={'Quarterback Club Signed Football'} quantity={1}/>
        <CompactItemListing image={'/Graphics/ImagePlaceholder.png'} price={8.99} productName={'Blank Picture'} quantity={1}/>
        <CompactItemListing image={'/Graphics/QBClubFootball.png'} price={24.99} productName={'Quarterback Club Signed Football'} quantity={1}/>
        <button className='m-5 center bg-white duration-200 w-xs h-72 rounded-xl border-2 border-transparent overflow-hidden shadow-lg space-y-4 transform 2-full hover:-translate-y-1 hover:border-gray-400'>
          <Image src={'/Icons/roundPlus.svg'} alt="Product Image" width={200} height={200}/>
          <p className='font-bold text-2xl'>Request New Listing</p>
        </button>
      </div>
    </div>
  );
}
