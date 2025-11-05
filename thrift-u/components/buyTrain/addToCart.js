'use client'
import { useState } from 'react'
import {Button} from '../../components/ui/button.tsx'
import {editCart} from './actions'
import {getDoc, doc} from "@firebase/firestore"
import {getAuthUser} from "../../lib/auth.js"
import FireData from '../../firebase/clientApp'



const AddToCart = ({itemId, stock}) =>{
    const [qty, setQTY] = useState(0)
    const [adding, setAdding] = useState(false)
    const [cartQTY, setCartQTY] = useState(0)

    const handleClick = async (event) => {
        event.preventDefault();
        setAdding(true)
        const token = await getAuthUser()
        const buyer = await getDoc(doc(FireData.db, "Buyer", token.user_id))
        const item = buyer.data().cart.find(obj => obj.itemId == itemId)
        if (item){
            const qty = item.qty
            setCartQTY(qty)
        }
    }

    const handleConfirm = async () => {
        if(qty > 0 && stock > 0){
            editCart(itemId, qty)
        } else {
            if(qty <=0 && stock > 0){
                alert("You have opted to add 0 items to your cart: Add to cart canceled.")
            } else if (stock <= 0){
                alert("Item is out of stock: Add to cart canceled.")
            } else if((stock - cartQTY) < qty){
                alert("The selected amount of items would cause your cart to excede item stock: Add to cart canceled.")
            }
        }
        location.reload()
    }

    if(adding){
        return(
            <div className="flex flex-col w-fit">
                <div className="flex justify-around m-1">
                        <Button
                            className="w-3 h-auto bg-orange-500"
                            onClick={() => {setQTY(Math.max(0, qty - 1)); console.log(cartQTY)}}
                        >
                            -
                        </Button>

                        <input
                            className="w-7 text-center"
                            type="text"
                            readOnly
                            value={qty}
                        />

                        <Button
                            className="w-3 h-auto bg-orange-500"
                            onClick={() => setQTY(Math.min(stock - cartQTY, qty + 1))}
                        >
                            +
                        </Button>
                </div>
                <Button onClick={handleConfirm} className="justify-center bg-orange-500">
                    Confirm
                </Button>
            </div>
    )
    } else {
        if(stock <= 0){
            return(
                <Button className={"bg-red-500"}>
                    Out of Stock
                </Button>
            )
        } else {
            return(
                <Button onClick={handleClick} className={"bg-orange-500"}>
                    Add to Cart
                </Button>
            )
        }
    }
}

export default AddToCart