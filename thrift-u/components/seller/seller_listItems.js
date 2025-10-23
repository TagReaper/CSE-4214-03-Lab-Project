'use client'

import { useState, useEffect} from "react"
import FireData from '../../firebase/clientApp'
import {collection, getDocs } from '@firebase/firestore'
import ItemListing from '../productHandler/itemListing'

const SellerListItems = ({ sellerId }) => {
    const [items, setItems] = useState([])

    useEffect(() => {
        const fetchItems = async () => {
            const querySnapshot = await getDocs(collection(FireData.db, 'Inventory'))
            setItems(querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        }

        fetchItems()
    }, [])

    //code to only display items connected to that seller

    return (
        <div>
            <h2><u>List of Items</u></h2>
            <ul>
                {items.map((item) => (
                    <li className='border rounded grid m-1' key={item.id}>
                        <ItemListing id={item}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SellerListItems