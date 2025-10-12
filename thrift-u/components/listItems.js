'use client'

import { useState, useEffect} from "react"
import db from '../firebase/clientApp'
import {collection, getDocs } from '@firebase/firestore'
import DeleteItem from './deleteItem'

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
            <h2><u>List of Items</u></h2>
            <ul className='list-disc'>
                {items.map((item) => (
                    <li className='border rounded grid m-1' key={item.id}>
                        <p className="center font-bold"> {item.name}</p>
                        <DeleteItem id={item.id}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ListItems