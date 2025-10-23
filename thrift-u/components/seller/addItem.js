'use client'

import Image from 'next/image'

const RequestItem = ({sellerId}) => {

    const handleClick = async () => {
        //add item popup
    }

    return (
        <button className='m-5 center bg-white duration-200 w-xs h-72 rounded-xl border-2 border-transparent overflow-hidden shadow-lg space-y-4 transform 2-full hover:-translate-y-1 hover:border-gray-400'>
            <Image src={'/Icons/roundPlus.svg'} alt="Product Image" width={200} height={200}/>
            <p className='font-bold text-2xl'>Request New Listing</p>
        </button>
    )
}

export default RequestItem