'use client'

import {Label} from '../../components/ui/label'
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
import {review} from "../buyTrain/actions"
import { Rating, RatingButton } from '@/components/ui/shadcn-io/rating';

const Review = ({orderItemId, sellerId}) => {

    const [loading, setLoading] = useState(true)
    const [rating, setRating] = useState(3)

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
            const response = await review(orderItemId, sellerId, rating)
            if (response != true){
                alert(response)
            }
        } catch(error) {
            console.error("Error reviewing seller: ", error)
            alert("Error rating seller: Something went wrong.")
        }
        location.reload()
    }

    if(!loading){
        return (
            <div>
                <Dialog>
                    <form onSubmit={handleRequest} id="prodReq2">
                        <DialogTrigger asChild>
                            <Button className={"border-white border-2 m-1 hover:invert"}>Rate Seller</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Rate Seller</DialogTitle>
                            <DialogDescription className="flex justify-center font-bold">
                                Please rate the seller on a scale of 1-5 stars!
                            </DialogDescription>
                            <div className="center m-2">
                                <Label className="mb-3" htmlFor="Rating">Rating</Label>
                                <Rating value={rating} onValueChange={(e) => setRating(e)} form="prodReq2">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <RatingButton className="text-yellow-500" key={index} />
                                    ))}
                                </Rating>
                            </div>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" form="prodReq2">Confirm Rating</Button>
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

export default Review