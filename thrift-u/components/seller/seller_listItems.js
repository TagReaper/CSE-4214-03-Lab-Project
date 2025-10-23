'use client'

import { useState, useEffect} from "react"
import FireData from '../../firebase/clientApp'
import {collection, getDocs } from '@firebase/firestore'
import CompactItemListing from '../productHandler/itemListingCompact'
import RequestItem from '../seller/addItem'

const SellerListItems = ({sellerId}) => {
    const [items, setItems] = useState([])
    const [sellerItems, setSellerItems] = useState([])
    const [sellerPendingItems, setSellerPendingItems] = useState([])

    useEffect(() => {
        const fetchItems = async () => {
            const querySnapshot = await getDocs(collection(FireData.db, 'Inventory'))
            setItems(querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        }

        fetchItems()
    }, [])

    useEffect(() => {
        const assignItems = async () => {
            //if item.sellerID == sellerID
                //if approved -> SellerItems
                //else -> SellerPendingItems
        }

        assignItems()
    }, [items])

    return (
        <div>
            <h1>Products</h1>
            <div className='flex flex-wrap justify-evenly border-b-8 border-dashed'>
                {sellerItems.map((item) => (
                    <div key={item.id}>
                        <CompactItemListing itemId={item.id} image={''} price={item.price} productName={item.name} quantity={item.quantity}/>
                    </div>
                ))}
            </div>
            <h1>Pending Products</h1>
            <div className='flex flex-wrap justify-evenly'>
                {sellerPendingItems.map((item) => (
                    <div key={item.id}>
                        <CompactItemListing itemId={item.id} image={''} price={item.price} productName={item.name} quantity={item.quantity}/>
                    </div>
                ))}
                <RequestItem sellerId={sellerId}/>
            </div>
        </div>
    )
}

export default SellerListItems