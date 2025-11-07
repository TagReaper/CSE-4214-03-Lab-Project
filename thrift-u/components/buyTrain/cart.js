'use client'

import Link from "next/link";
import FireData from "../../firebase/clientApp";
import {getDoc, doc} from "@firebase/firestore"
import { getAuthUser } from "@/lib/auth";
import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import EditCart from './editCart'
import Checkout from './checkout'

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]); //Cart state
    const [loading, setLoading] = useState(true)


  //Loads cart from localStorage
    useEffect(() => {
        const loadCart = async () => {
            try {
                const token = await getAuthUser()
                //Fetch items from Firestore using IDs from cart
                const buyerRef = await getDoc(doc(FireData.db, "Buyer", token.user_id))
                if (buyerRef != undefined){
                    const cartData = buyerRef.data().cart
                    let cartTemp = []
                    for (let index = 0; index < cartData.length; index++) {
                        const itemRef = await getDoc(doc(FireData.db, "Inventory", cartData[index].itemId))
                        let itemData = itemRef.data()
                        itemData.id = itemRef.id
                        itemData.cartQuantity = cartData[index].qty
                        itemData.cartPrice = itemData.price * itemData.cartQuantity
                        console.log()
                        cartTemp.push(itemData)
                    setCartItems(cartTemp)
                }
                }else{
                throw new Error("Buyer is undefined.")
                }
            } catch(err){
                console.error(err)
                alert("Failed to load cart items. Please try again.");
            } finally {
                setLoading(false)
            }
        }
        loadCart();
    }, []);

    if (loading) {return <p className="text-center text-black">Loading cart...</p>}


    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-black">Cart</h1>
            <Card>
                <CardHeader>
                <h2 className="text-xl font-semibold">Cart Items</h2>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Item ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Item Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total Price</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {cartItems.length === 0 ? (
                        <TableRow>
                        <TableCell colSpan={6} className="text-center">
                            Cart is empty.
                        </TableCell>
                        </TableRow>
                    ) : (
                        cartItems.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{order.name}</TableCell>
                            <TableCell>{order.price}</TableCell>
                            <TableCell>{order.cartQuantity}</TableCell>
                            <TableCell>${order.cartPrice}</TableCell>
                            <TableCell><EditCart itemId={order.id} stock={order.quantity} cartItemQty={order.cartQuantity}/></TableCell>
                        </TableRow>
                        ))
                    )}
                    </TableBody>
                </Table>
                <div className = 'text-right'>
                    <Checkout/>
                </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CartPage