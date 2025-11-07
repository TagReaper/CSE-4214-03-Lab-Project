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
import {checkout} from "../buyTrain/actions"

const Checkout = ({}) => {

    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [zip, setZip] = useState("")
    const [cardNumber, setCard] = useState(0)
    const [exp, setEXP] = useState("")
    const [cvc, setCVC] = useState(0)
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(true)
    const [cart, setCart] = useState([])

    useEffect(() => {
        async function fetchBuyer() {
            try {
                const token = await getAuthUser()
                const querySnapshot = await getDoc(doc(FireData.db, 'Buyer', token.user_id))
                const buyerData = querySnapshot.data()
                setCart(buyerData.cart)
                setAddress(buyerData.address)
                setCity(buyerData.city)
                setState(buyerData.state)
                setZip(buyerData.zip)

            } catch (error) {
                console.error("Error :", error)
            } finally {
                setLoading(false)
            }
        }
        fetchBuyer()
    }, []);

    const handleRequest = async (event) => {
        event.preventDefault();
        try{
            if (!(await verifyRole("Buyer"))){
                throw new Error("Invalid access")
            }
            const Address = {address: address, city: city, state: state, zip: zip}
            const Payment = {cardNumber: cardNumber, exp: exp, cvc: cvc, name: name, default:true}
            await checkout(Address, Payment)
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
                    <form onSubmit={handleRequest} id="prodReq">
                        <DialogTrigger asChild>
                            <Button disabled={cart.length == 0} className={"border-white border-2 m-1 hover:invert"}>Checkout</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Confirm Checkout</DialogTitle>
                            <DialogDescription>
                                Note all checkout information here, and input your address and payment info.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="Title">Address</Label>
                                <Input id="Address" value={address} onChange={(e) => setAddress(e.target.value)} type="text" placeholder="Address" form="prodReq" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="Title">City</Label>
                                <Input id="City" value={city} onChange={(e) => setCity(e.target.value)} type="text" placeholder="City" form="prodReq" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="Title">State</Label>
                                <Input id="State" value={state} onChange={(e) => setState(e.target.value)} type="text" placeholder="State" form="prodReq" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="Title">Zip</Label>
                                <Input id="Zip" value={zip} onChange={(e) => setZip(e.target.value)} type="text" placeholder="Zip" form="prodReq" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="Title">CardNumber</Label>
                                <Input id="CardNumber" value={cardNumber} onChange={(e) => setCard(e.target.value)} type="number" placeholder="1234123412341234" form="prodReq" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="Title">EXP</Label>
                                <Input id="EXP" value={exp} onChange={(e) => setEXP(e.target.value)} type="text" placeholder="00/00" form="prodReq" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="Title">CVC</Label>
                                <Input id="CVC" value={cvc} onChange={(e) => setCVC(e.target.value)} type="number" placeholder="CVC" form="prodReq" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="Title">Name on Card</Label>
                                <Input id="Name" value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="John Smith" form="prodReq" required />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" form="prodReq">Confirm Checkout</Button>
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

export default Checkout
