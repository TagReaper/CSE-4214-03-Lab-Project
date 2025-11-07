"use client"

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
import {getAuthUser} from "../../lib/auth"
import FireData from "../../firebase/clientApp"
import { getDoc, doc, getDocs, collection } from "@firebase/firestore"
import AcceptOrder from "./acceptOrder"
import DenyOrder from "./denyOrder"


const SellerOrdersList = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchOrders() {
            try {
                const token = await getAuthUser()
                const querySnapshot = await getDocs(collection(FireData.db, 'OrderItems'))
                const itemUnchecked = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}))
                let itemData = itemUnchecked.filter(item => (item.sellerId == token.user_id))
                for (let index = 0; index < itemData.length; index++) {
                    const itemRef = await getDoc(doc(FireData.db, "Inventory", itemData[index].itemId))
                    itemData[index].product = itemRef.data().name
                    const buyerRef = await getDoc(doc(FireData.db, "User", itemData[index].buyerId))
                    itemData[index].customer = buyerRef.data().firstName + " " + buyerRef.data().lastName
                }
                setOrders(itemData)
            } catch (error) {
                console.error("Error :", error)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    if (loading) return <p className="text-center text-black">Loading seller orders...</p>

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-black">Seller Orders</h1>
            <Card>
                <CardHeader>
                <h2 className="text-xl font-semibold">Orders from Customers</h2>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Order Item ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                        <TableCell colSpan={6} className="text-center">
                            No orders yet.
                        </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{order.product}</TableCell>
                            <TableCell>{order.quantity}</TableCell>
                            <TableCell>${order.price}</TableCell>
                            <TableCell>{order.status != "pending" ? (order.status) : (
                                <div className="flex">
                                    <AcceptOrder orderItemId={order.id} orderId={order.orderId}/>
                                    <DenyOrder orderItemId={order.id}/>
                                </div>
                                )}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        ))
                    )}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default SellerOrdersList