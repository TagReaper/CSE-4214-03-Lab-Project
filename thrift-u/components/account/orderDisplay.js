'use client'
import FireData from "@/firebase/clientApp"
import { getDocs, collection} from "@firebase/firestore"
import { useEffect, useState } from "react"
import { getAuthUser } from "@/lib/auth"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

const OrderDisplay = ({orderId}) => {
    const [orderItems, setData] = useState([])
    const [exist, setExist] = useState(true)
    const [Id, setId] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchItemData = async()=>{
            try{
                const token = await getAuthUser()
                setId(token.user_id)
                const itemRef = await getDocs(collection(FireData.db, "OrderItems"))
                const itemUnchecked = itemRef.docs.map((doc) => ({...doc.data(), id: doc.id}))
                const itemData = itemUnchecked.filter(item => (item.orderId == orderId))
                setData(itemData)
                setLoading(false)
            } catch(error) {
                console.error(error)
                setExist(false)
            }
        }
        fetchItemData()
    }, [orderId]);

    if(!loading){
        if (orderItems[0].buyerId == Id){
            return(
                <div className="max-w-5xl mx-auto p-6">
                    <h1 className="text-3xl font-bold mb-6 text-black">Order Items</h1>
                    <Card>
                        <CardHeader>
                        <h2 className="text-xl font-semibold">Order: {orderId}</h2>
                        </CardHeader>
                        <CardContent>
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Order Item ID</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Tracking Number</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Refund/Cancel</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {orderItems.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell>{order.status == "pending" ? ("Awaiting Shipment.") : (order.trackingNumber)}</TableCell>
                                    <TableCell>{order.quantity}</TableCell>
                                    <TableCell>${order.price}</TableCell>
                                    <TableCell>Unavailable</TableCell>
                                </TableRow>
                                ))
                            }
                            </TableBody>
                        </Table>
                        </CardContent>
                    </Card>
                </div>
            )
        } else {
            return(
                <div className="center">
                    <h1>
                        Oops!!
                    </h1>
                    <h3 className="text-2xl mt-3 underline">
                        This order does not belong to you!
                    </h3>
                    <p className="w-92">
                        Please avoid manually trying in order routes.
                    </p>
                </div>
            )
        }
    }else {
        if(exist){
            return(
            <div className="center">
                <h1>
                    Loading...
                </h1>
            </div>
        )
        } else {
            return(
                <div className="center">
                    <h1>
                        Oops!!
                    </h1>
                    <h3 className="text-2xl mt-3 underline">
                        Invalid order Id!
                    </h3>
                    <p className="w-92">
                        Please avoid manually trying in order routes.
                    </p>
                </div>
            )
        }

    }

}

export default OrderDisplay