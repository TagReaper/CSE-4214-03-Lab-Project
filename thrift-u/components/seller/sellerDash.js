'use client'

import { useState, useEffect} from "react"
import FireData from '../../firebase/clientApp'
import { getDoc, doc } from '@firebase/firestore'
import { getAuthUser } from "@/lib/auth"
import { Button } from "../ui/button"
import Link from "next/link"
import { cashOut } from "../buyTrain/actions"

const SellerDashboard = () => {
    const [userData, setUser] = useState(undefined)
    const [sellerData, setSeller] = useState(undefined)
    const [rating, setRating] = useState(0)

    useEffect(() => {
        const fetchItemData = async()=>{
            try{
                const token = await getAuthUser()
                const UserRef = await getDoc(doc(FireData.db, "User", token.user_id))
                const SellerRef = await getDoc(doc(FireData.db, "Seller", token.user_id))
                let rate = 0
                if(SellerRef.data().reviews.length > 0){
                    for (let index = 0; index < SellerRef.data().reviews.length; index++) {
                        rate += SellerRef.data().reviews[index]
                    }
                    rate = rate/SellerRef.data().reviews.length
                }
                setUser(UserRef.data())
                setSeller(SellerRef.data())
                setRating(rate)
            }catch(error){
                console.error("Failed to fetch data:", error);
                throw error
            }
        }
        fetchItemData()
    }, []);

    async function handleCashout(){
        const response = await cashOut(sellerData.income, sellerData.unclaimedIncome)
        alert(response)
        if(response != "You have nothing to cashout."){
            location.reload()
        }
    }

    if (userData != undefined && sellerData != undefined){
        return (
        <div className={"flex flex-col justify-between mt-10 ml-auto mr-auto shadow-xl shadow-gray-200 rounded-2xl overflow-scroll [&::-webkit-scrollbar]:hidden"} style={{width: "70dvw", height: "80dvh"}}>
            <div>
                <h3 className="center text-4xl font-bold text-gray-800 mt-10">
                    Seller Dashboard
                </h3>
                <h3 className="ml-10 mt-5 text-xl text-gray-500">Welcome back, {userData.firstName + " " + userData.lastName}</h3>
                <h3 className={`ml-10 mt-5 text-xl text-gray-500 ${sellerData.Flags > 0 ? "text-red-500" : "text-green-500"} ${sellerData.Flags > 2 ? "font-bold" : "font-normal"}`}>You have {sellerData.Flags} Flags!</h3>
                <h3 className={`ml-10 mt-5 text-xl text-gray-500 ${rating < 3 ? "text-red-500" : "text-green-500"} ${rating < 2 ? "font-bold" : "font-normal"}`}>Your average rating is {rating} stars</h3>
            </div>
            <div className={"grid grid-cols-2 gap-20"}>
                <div className="center">
                    <h2> Unclaimed Income</h2>
                    <p className="text-2xl mb-3 mt-3">${sellerData.unclaimedIncome}</p>
                </div>
                <div className="center">
                    <h2> {sellerData.pendingOrders.length} Pending Orders</h2>
                    <Link href="/sellerhub/orders"><Button className="border-white border-2 mb-2 mt-2 hover:invert">View Orders</Button></Link>
                </div>
                <div className="center">
                    <h2> Total Income: ${sellerData.income}</h2>
                    <Button onClick={handleCashout} className="border-white border-2 mb-2 mt-2 hover:invert">Cash Out</Button>
                </div>
                <div className="center">
                    <h2> Manage products:</h2>
                    <Link href="/sellerhub/products"><Button className="border-white border-2 mb-2 mt-2 hover:invert">View Products</Button></Link>
                </div>
            </div>
            <div style={{height: "5dvh"}}></div>
        </div>
    )
    } else {
        return(
                <div className="center">
                    <h1>
                        Loading...
                    </h1>
                </div>
            )
    }

}

export default SellerDashboard