'use client'

import db from '../firebase/clientApp'
import {doc, deleteDoc} from '@firebase/firestore'

const DeleteItem = ({id}) => {
    const handleDelete = async () => {
        const itemRef = doc(db, 'items', id)
        try{
            await deleteDoc(itemRef)
            try{
                window.location.reload()
            } catch (error){
                console.log("Error reloading page: ", error)
                alert('Error reloading page, reload manually to update information')
            }
        } catch (error){
            console.log('Error deleting item: ', error)
            alert('Error deleting')
        }
    }

    return (
        <button
            onClick={handleDelete}
            className='border bg-red-400 p-1 rounded text-white'
        >
            Delete
        </button>
    )
}

export default DeleteItem