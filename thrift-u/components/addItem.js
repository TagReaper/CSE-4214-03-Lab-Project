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
            try{
                window.location.reload()
            } catch (error){
                console.log("Error reloading page: ", error)
                alert('Error reloading page, reload manually to update information')
            }
        }catch (error){
            console.log("Error adding Document: ", error)
            alert('Error adding document!')
            setValue("")
        }
    }

    return (
        <form className='mb-5' onSubmit={handleSubmit}>
            <input className='text-black border-1 rounded border-black'
                type = 'text'
                value = {value}
                onChange={(e) => setValue(e.target.value)}
                placeholder = "Add new item"
            />
            &nbsp;&nbsp;
            <button className='text-black border rounded border-black' type='submit'>Add Item</button>
        </form>
    )


}

export default AddItem