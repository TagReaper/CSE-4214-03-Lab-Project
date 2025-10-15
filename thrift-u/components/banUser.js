'use client'

import db from '../firebase/clientApp'
import {doc, getDoc, updateDoc} from '@firebase/firestore'

const BanUser = ({access, id}) => {
    const handleBan = async () => {
        if(access == 1){
            const docRef = await getDoc(doc(db, "Seller", id))
            await updateDoc(docRef, {
                banned: true
            })
        } else if(access == 2){
            const docRef = await getDoc(doc(db, "Buyer", id))
            await updateDoc(docRef, {
                banned: true
            })
        }
    }

    return (<div>
        <button onClick={handleBan} className="w-20 border-2 border-black rounded-2xl font-bold font-stretch-100% bg-red-500 text-white" >
            BAN
        </button>
    </div>
    )
}

export default BanUser
