'use client'
import { useState, useEffect } from "react";
import OrderDisplay from "../../../../../components/account/orderDisplay"

export default function ListingPage({params}: {
    params: Promise<{orderId: string}>
    }) {

    const [id, setId] = useState("")

    useEffect(() => {
        const fetchParams = async () => {
            setId((await params).orderId)
        }
        fetchParams()
    }, [params]);

    if(id != ""){
        return (
            <div>
                <OrderDisplay orderId={id}/>
            </div>
        )
    } else {
        return(
            <h1 className="center">
                Loading...
            </h1>
        )
    }
}