'use client'
import FireData from "@/firebase/clientApp"
import { getDoc, doc } from "@firebase/firestore"
import { useEffect, useState } from "react"
import AddToCart from "../buyTrain/addToCart"
import { getAuthUser } from "@/lib/auth"

const ItemDisplay = ({itemId}) => {
    const [itemData, setData] = useState(undefined)
    const [sellerName, setName] = useState("")
    const [Id, setId] = useState("")

    useEffect(() => {
        const fetchItemData = async()=>{
            try{
                const token = await getAuthUser()
                setId(token.user_id)
                const itemRef = await getDoc(doc(FireData.db, "Inventory", itemId))
                setData(itemRef.data())
                const sellerRef = await getDoc(doc(FireData.db, "User", itemRef.data().sellerId))
                setName(sellerRef.data().firstName + " " + sellerRef.data().lastName)
            } catch {
                return false
            }
        }
        fetchItemData()
    }, [itemId]);

    if(itemData != undefined){
        if ((itemData.deletedAt == "" && itemData.approved == true) || (itemData.sellerId == Id)){
            return(
                <div className={'w-full m-10 grid grid-cols-3'}>
                    <div>
                        <img src={itemData.image} alt="Product Image" className="w-92 h-92 object-cover rounded-lg mb-4 border-2 border-black" />
                    </div>

                    <div className={"bg-white shadow-md rounded-xl max-w-md w-full p-6"}>
                        <h3 className="text-2xl  font-bold text-gray-800 mb-2">
                            {itemData.name}
                        </h3>
                        <p className={"mb-5 text-sm text-gray-500"}>Sold by: <span className="font-medium text-gray-700">{sellerName}</span></p>
                        <p className={`text-2xl mb-3 mt-3 ${itemData.quantity > 0 ? "text-blue-500" : "text-red-500 line-through"}`}>${itemData.price}</p>
                        <h3 className={"text-2xl font-semibold mb-2 mt-5"}>About this item.</h3>
                        <p className="mb-4">
                            {itemData.description}
                        </p>
                        <p className="text-sm text-gray-500">{itemData.quantity > 0 ? `${itemData.quantity} in stock` : `Out of Stock`}</p>
                        <p className="text-sm text-gray-500">Condition: {itemData.condition}</p>
                    </div>
                    <div className={"center"}>
                        <p className="text-2xl mb-3">${itemData.price}</p>
                        <AddToCart itemId={itemId} stock={itemData.quantity}/>
                    </div>
                </div>
            )
        } else {
            return(
                <div className="center">
                    <h1>
                        Oops!!
                    </h1>
                    <h3 className="text-2xl mt-3 underline">
                        Product Id is invalid or product has been removed!
                    </h3>
                    <p className="w-92">
                        Please avoid manually trying in product routes.
                    </p>
                </div>
            )
        }
    }else {
        return(
            <div className="center">
                <h1>
                    Loading...
                </h1>
            </div>
        )
    }

}

export default ItemDisplay