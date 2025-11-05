'use client'

import { useRouter }  from 'next/navigation'



const CompactItemListing = ({itemId, image, price, productName, quantity}) => {
    const router = useRouter()

    const handleClick = async () => {
        //pushes to individual product page {itemId}
        router.push('/')
    }

    if (quantity > 0){
        return (
        <button className="m-5 bg-white duration-200 flex flex-col w-xs h-96 rounded-xl border-2 border-transparent overflow-hidden shadow-lg space-y-4 transform 2-full hover:-translate-y-1 hover:border-gray-400">
            <div className='flex m-4 overflow-hidden border-2 rounded-2xl border-transparent'>
                <img style={{aspectRatio: '1/1', width: '100%', height: 'auto', objectFit: 'cover'}}src={image} alt="Product Image" width={300} height={300}/>
            </div>
            <div className='flex flex-col px-4 space-y-1'>
                <p className='font-medium tracking-wide w-max'>{productName}</p>
                <p className='inline-flex font-bold tracking-wide'>${price}</p>
            </div>
        </button>
    )
    } else {
        return (
        <button className="m-5 bg-white duration-200 flex flex-col w-xs h-72 rounded-xl border-2 border-transparent overflow-hidden shadow-lg space-y-4 transform 2-full hover:-translate-y-1 hover:border-gray-400">
            <div className='flex m-4 overflow-hidden border-2 rounded-2xl border-transparent'>
                <img style={{aspectRatio: '1/1', width: '100%', height: 'auto', objectFit: 'cover', filter: 'grayscale(100%)'}} src={image} alt="Product Image" width={300} height={300}/>
            </div>
            <div className='flex flex-col px-4 space-y-1'>
                <p className='font-medium tracking-wide w-max'>{productName}</p>
                <span className='inline-flex'>
                    <p className='font-extrabold tracking-wide text-red-500'>Sold Out</p>
                    &nbsp;&nbsp;&nbsp;
                    <p className='tracking-wide line-through'>${price}</p>
                </span>
            </div>
        </button>
    )
    }
}

export default CompactItemListing