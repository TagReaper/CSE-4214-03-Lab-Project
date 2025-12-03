'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { getDoc, doc} from "@firebase/firestore"
import FireData from "@/firebase/clientApp"
import { verifyRole, getAuthUser} from "@/lib/auth"
import {acceptOrder} from "../buyTrain/actions"

const AcceptOrder = ({orderItemId, orderId}) => {

    const [trackingNumber, setTracking] = useState("");
    const [unclaimedIncome, setUnclaimed] = useState(0);
    const [pendingOrders, setPending] = useState([]);
    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState(undefined)
    const formName = Math.floor(Math.random()*10000);

    useEffect(() => {
        async function fetchSeller() {
            try {
                const token = await getAuthUser()
                const querySnapshot = await getDoc(doc(FireData.db, 'Seller', token.user_id))
                const sellerData = querySnapshot.data()
                setUnclaimed(sellerData.unclaimedIncome)
                setPending(sellerData.pendingOrders)
                const orderRef = await getDoc(doc(FireData.db, "Orders", orderId))
                setOrder(orderRef.data())

            } catch (error) {
                console.error("Error :", error)
            } finally {
                setLoading(false)
            }
        }
        fetchSeller()
    }, [orderId]);

    const handleRequest = async (event) => {
        event.preventDefault();
        try{
            if (!(await verifyRole("Seller"))){
                throw new Error("Invalid access")
            }
            const response = await acceptOrder(orderItemId, trackingNumber, unclaimedIncome, pendingOrders)
            if (response != true){
                alert(response)
            }
        } catch(error) {
            console.error("Error confirming order: ", error)
            alert("Error confirming order: Something went wrong.")
        }
        location.reload()
    }

    if(!loading){
        return (
            <div>
                <Dialog>
                    <form onSubmit={handleRequest} id={formName}>
                        <DialogTrigger asChild>
                            <Button className={"border-white border-2 m-1 hover:invert"}>Review</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Confirm Item Shipment</DialogTitle>
                            <DialogDescription>
                                <div>
                                    Note all order information here, and input the tracking number provided when you shipped the package.
                                </div>
                                <div className="h-3"/>
                                <span className="flex">
                                    <div className="font-bold">
                                        Address:&nbsp;
                                    </div>
                                    <div>
                                        {order.address}
                                    </div>
                                </span>
                                <span className="flex">
                                    <div className="font-bold">
                                        City:&nbsp;
                                    </div>
                                    <div>
                                        {order.city}
                                    </div>
                                </span>
                                <span className="flex">
                                    <div className="font-bold">
                                        State:&nbsp;
                                    </div>
                                    <div>
                                        {order.state}
                                    </div>
                                </span>
                                <span className="flex">
                                    <div className="font-bold">
                                        Zip:&nbsp;
                                    </div>
                                    <div>
                                        {order.zip}
                                    </div>
                                </span>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="Title">Tracking Number</Label>
                                <Input id="Tracking" value={trackingNumber} onChange={(e) => setTracking(e.target.value)} type="text" placeholder="Tracking Number" form={formName} required />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" form={formName}>Confirm Shipment</Button>
                        </DialogFooter>
                        </DialogContent>
                    </form>
                </Dialog>
            </div>

        )
    } else {
        return(
            <Button disabled className={"border-white border-2 m-1 hover:invert"}>Loading...</Button>
        )
    }
}

export default AcceptOrder
