import {useState} from 'react';
import db from '../firebase/clientApp'
import {collection, addDoc} from '@firebase/firestore';

const AddItem = () => {
    const [value, setValue] = useState('')

    const handleSubmit = () => {

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