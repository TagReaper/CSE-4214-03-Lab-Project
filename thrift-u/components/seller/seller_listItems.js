'use client'

import { useState, useEffect} from "react"
import FireData from '../../firebase/clientApp'
import {collection, getDocs } from '@firebase/firestore'
import CompactItemListing from '../productHandler/itemListingCompact'
import RequestItem from '../seller/addItem'
import { getAuthUser } from "@/lib/auth"

const SellerListItems = () => {
    const [items, setItems] = useState([])
    const [sellerItems, setSellerItems] = useState([])
    const [sellerPendingItems, setSellerPendingItems] = useState([])
    const token = getAuthUser()
    const sellerId = token.user_id

    useEffect(() => {
        const fetchItems = async () => {
            const querySnapshot = await getDocs(collection(FireData.db, 'Inventory'))
            setItems(querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        }

        fetchItems()
    }, [])

    useEffect(() => {
        const assignItems = async () => {
            var sellerItemsTemp = []
            var sellerPendingTemp = []
            for (let index = 0; index < items.length; index++) {
                if (items[index].sellerId == sellerId)
                    if (items[index].approved == true){
                        sellerItemsTemp.push(items[index])
                    } else {
                        sellerPendingTemp.push(items[index])
                    }
            }
            setSellerItems(sellerItemsTemp)
            setSellerPendingItems(sellerPendingTemp)
        }

        assignItems()
    }, [sellerId, items])

    if (sellerItems.length != 0){
        return (
            <div>
                <h1>Products</h1>
                <div className='flex flex-wrap justify-evenly border-b-8 border-dashed'>
                    {sellerItems.map((item) => (
                        <div key={item.id}>
                            <CompactItemListing itemId={item.id} image={item.image} price={item.price} productName={item.name} quantity={item.quantity}/>
                        </div>
                    ))}
                </div>
                <h1>Pending Products</h1>
                <div className='flex flex-wrap justify-evenly'>
                    {sellerPendingItems.map((item) => (
                        <div key={item.id}>
                            <CompactItemListing itemId={item.id} image={item.image} price={item.price} productName={item.name} quantity={item.quantity}/>
                        </div>
                    ))}
                    <RequestItem sellerId={sellerId}/>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Products</h1>
                <div className='flex flex-wrap justify-evenly border-b-8 border-dashed'>
                    <p className='text-2xl font-bold mb-5'>
                        No Approved Products
                    </p>
                </div>
                <h1>Pending Products</h1>
                <div className='flex flex-wrap justify-evenly'>
                    {sellerPendingItems.map((item) => (
                        <div key={item.id}>
                            <CompactItemListing itemId={item.id} image={item.image} price={item.price} productName={item.name} quantity={item.quantity}/>
                        </div>
                    ))}
                    <RequestItem sellerId={sellerId}/>
                </div>
            </div>
        )
    }

}

export default SellerListItems