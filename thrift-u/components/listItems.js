'use client'

import { useState, useEffect} from "react"
import db from '../firebase/clientApp'
import {collection, getDocs } from '@firebase/firestore'

const ListItems = () => {
    const [items, setItems] = useState([])

    useEffect(() => {
        const fetchItems = async () => {
            const querySnapshot = await getDocs(collection(db, 'items'))
            setItems(querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        }

        fetchItems()
    }, [])

    return (
        <div>
            <h2>List of Items</h2>
            <ul className='list-disc'>
                {items.map((item) => (
                    <li key={item.id}>
                        {item.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ListItems