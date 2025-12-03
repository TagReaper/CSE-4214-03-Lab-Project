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
import { useState, useEffect } from "react"
import { getDoc, doc} from "@firebase/firestore"
import FireData from "@/firebase/clientApp"
import { verifyRole, getAuthUser} from "@/lib/auth"
import {denyOrder} from "../buyTrain/actions"

const DenyOrder = ({orderItemId}) => {

    const [pendingOrders, setPending] = useState([]);
    const [loading, setLoading] = useState(true)
    const formName = Math.floor(Math.random()*10000);

    useEffect(() => {
        async function fetchSeller() {
            try {
                const token = await getAuthUser()
                const querySnapshot = await getDoc(doc(FireData.db, 'Seller', token.user_id))
                const sellerData = querySnapshot.data()
                setPending(sellerData.pendingOrders)
            } catch (error) {
                console.error("Error :", error)
            } finally {
                setLoading(false)
            }
        }
        fetchSeller()
    }, []);

    const handleRequest = async (event) => {
        event.preventDefault();
        try{
            if (!(await verifyRole("Seller"))){
                throw new Error("Invalid access")
            }
            const response = await denyOrder(orderItemId, pendingOrders)
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
                            <Button className={"border-white border-2 m-1 hover:invert"}>Deny</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Confirm Order Refusal?</DialogTitle>
                            <DialogDescription>
                                <div className="font-bold">
                                    Are you sure you want to refuse this order? Doing so may result in a FLAG on your account.
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" form={formName}>Confirm Refusal</Button>
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

export default DenyOrder
