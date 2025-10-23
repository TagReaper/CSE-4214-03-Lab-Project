'use client'

import { useState, useEffect} from "react"
import FireData from '../../firebase/clientApp'
import {collection, getDocs } from '@firebase/firestore'
import CompactItemListing from '../productHandler/itemListingCompact'

const SellerListItems = ({ sellerId }) => {
    const [items, setItems] = useState([])
    const [sellerItems, setSellerItems] = useState([])

    useEffect(() => {
        const fetchItems = async () => {
            const querySnapshot = await getDocs(collection(FireData.db, 'Inventory'))
            setItems(querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        }

        fetchItems()
    }, [])

    useEffect(() => {
        const assignItems = async () => {
            //seller item assignment
        }

        assignItems()
    }, [items])

    return (
        <div>
            <h2><u>List of Items</u></h2>
            <div className='flex flex-wrap justify-evenly border-b-8 border-dashed'>
                {sellerItems.map((item) => (
                    <div key={item.id}>
                        <CompactItemListing image={''} price={item.price} productName={item.name} quantity={item.quantity}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SellerListItems