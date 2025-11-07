'use client'
import { useState, useEffect } from "react";
import ItemDisplay from "../../../../components/productHandler/itemDisplay"

export default function ListingPage({params}: {
    params: Promise<{id: string}>
    }) {

    const [id, setId] = useState("")

    useEffect(() => {
        const fetchParams = async () => {
            setId((await params).id)
        }
        fetchParams()
    }, [params]);

    return (
        <div>
            <ItemDisplay itemId={id}/>
        </div>
    );
}