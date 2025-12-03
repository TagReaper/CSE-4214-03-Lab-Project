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
import { verifyRole} from "@/lib/auth"
import {refund} from "../buyTrain/actions"

const Refund = ({orderItemId, sellerId}) => {

    const [loading, setLoading] = useState(true)
    const formName = Math.floor(Math.random()*10000);

    useEffect(() => {
        async function start() {
            setLoading(false)
        }
        start()
    }, []);

    const handleRequest = async (event) => {
        event.preventDefault();
        try{
            if (!(await verifyRole("Buyer"))){
                throw new Error("Invalid access")
            }
            const response = await refund(orderItemId, sellerId)
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
                            <Button className={"border-white border-2 m-1 hover:invert"}>Refund Order</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Confirm Order Cancelation?</DialogTitle>
                            <DialogDescription>
                                <div className="font-bold">
                                    Are you sure you want to cancel this order? Doing so will result in a refund for the orders cost.
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" form={formName}>Confirm Refund</Button>
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

export default Refund
