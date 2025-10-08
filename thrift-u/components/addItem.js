'use client'

import {useState} from 'react';
import db from '../firebase/clientApp'
import {collection, addDoc} from '@firebase/firestore';

const AddItem = () => {
    const [value, setValue] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()

        try{
            const docRef = await addDoc(collection(db, 'items'), {
                name: value,
        })
            console.log('Document written with ID: ', docRef.id)
            setValue("")
        }catch (error){
            console.log("Error adding Document: ", error)
            setValue("")
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type = 'text'
                value = {value}
                onChange={(e) => setValue(e.target.value)}
                placeholder = "Add new item"
            />
            <button type='submit'>Add Item</button>
        </form>
    )


}

export default AddItem