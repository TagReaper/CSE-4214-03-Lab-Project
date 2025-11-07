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
import { getDocs, collection } from "@firebase/firestore"
import { Button } from '../ui/button'
import Link from "next/link"


const BuyerOrdersList = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchOrders() {
            try {
                const token = await getAuthUser()
                const querySnapshot = await getDocs(collection(FireData.db, 'Orders'))
                const itemUnchecked = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}))
                const itemData = itemUnchecked.filter(item => (item.buyerId == token.user_id))
                setOrders(itemData)
            } catch (error) {
                console.error("Error :", error)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    if (loading) return <p className="text-center text-black">Loading orders...</p>

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-black">Orders</h1>
            <Card>
                <CardHeader>
                <h2 className="text-xl font-semibold">Orders placed</h2>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Card Used</TableHead>
                        <TableHead>Date Placed</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>View Order</TableHead>
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
                            <TableCell>{order.cardUsed}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>{order.quantity}</TableCell>
                            <TableCell>${order.price}</TableCell>
                            <TableCell><Link href={`/account/orders/${order.id}`}><Button>View Order</Button></Link></TableCell>
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

export default BuyerOrdersList