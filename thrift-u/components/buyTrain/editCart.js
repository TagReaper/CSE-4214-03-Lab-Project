'use client'
import { useEffect, useState } from 'react'
import {Button} from '../../components/ui/button.tsx'
import {editCart} from './actions'
import {getDoc, doc} from "@firebase/firestore"
import {getAuthUser} from "../../lib/auth.js"
import FireData from '../../firebase/clientApp'
import { verifyRole } from '../../lib/auth.js'



const EditCart = ({itemId, stock, cartItemQty}) =>{
    const [qty, setQTY] = useState(0)
    const [adding, setAdding] = useState(false)
    const [cartQTY, setCartQTY] = useState(0)
    const [isBuyer, setIsBuyer] = useState(false)

    useEffect(() => {
        async function fetch() {
            const buyer = await verifyRole("Buyer")
            setIsBuyer(buyer)
        }
        fetch()
    }, []);

    const handleClick = async (event) => {
        event.preventDefault();
        setAdding(true)
        setCartQTY(cartItemQty)
        setQTY(cartItemQty)
    }

    const handleConfirm = async () => {
        if(qty > cartQTY){
            await editCart(itemId, qty-cartQTY)
            location.reload()
        } else {
            if(qty == 0){
                await editCart(itemId, -cartQTY)
                location.reload()
            } else if(qty == cartQTY){
                setAdding(false)
            }else {
                await editCart(itemId, qty-cartQTY)
                location.reload()
            }
        }
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
                            onClick={() => setQTY(Math.min(stock, qty + 1))}
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
        return(
            <Button disabled={!isBuyer} onClick={handleClick} className={"bg-orange-500 disabled:opacity-50 disabled:bg-gray-700"}>
                Edit Quantity
            </Button>
        )
    }
}

export default EditCart