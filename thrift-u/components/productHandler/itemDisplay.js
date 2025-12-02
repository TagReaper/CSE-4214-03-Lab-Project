'use client'
import FireData from "@/firebase/clientApp"
import { getDoc, doc , getDocs, collection} from "@firebase/firestore"
import { useEffect, useState } from "react"
import AddToCart from "../buyTrain/addToCart"
import { getAuthUser } from "@/lib/auth"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import CompactItemListing from "./itemListingCompact"


const ItemDisplay = ({itemId}) => {
    const [itemData, setData] = useState(undefined)
    const [sellerName, setName] = useState("")
    const [Id, setId] = useState("")
    const [rating, setRating] = useState("N/A")
    const[similar,setSimilar]=useState([])

    useEffect(() => {
        const fetchItemData = async()=>{
            try{
                const querySnapshot = await getDocs(collection(FireData.db, 'Inventory'))
                const itemUnchecked = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}))
                const itemDatas = itemUnchecked.filter(item => (item.approved && item.deletedAt == "" && item.quantity > 0 && item.id != itemId))
                const token = await getAuthUser()
                setId(token.user_id)
                const itemRef = await getDoc(doc(FireData.db, "Inventory", itemId))
                setData(itemRef.data())
                if(itemRef.data().tags[0] != undefined){
                    const sim = itemDatas.filter(item => item.tags.includes(itemRef.data().tags[0]))
                    setSimilar(selectRandomItems(sim, 6))
                } else {
                    setSimilar(selectRandomItems(itemDatas, 6))
                }
                const userRef = await getDoc(doc(FireData.db, "User", itemRef.data().sellerId))
                setName(userRef.data().firstName + " " + userRef.data().lastName)
                const sellerRef = await getDoc(doc(FireData.db, "Seller", itemRef.data().sellerId))
                let rate = 0
                if(sellerRef.data().reviews.length > 0){
                    for (let index = 0; index < sellerRef.data().reviews.length; index++) {
                        rate += sellerRef.data().reviews[index]
                    }
                    rate = rate/sellerRef.data().reviews.length
                    rate = rate.toFixed(1)
                }
                setRating(rate)
            } catch {
                return false
            }
        }
        fetchItemData()
    }, [itemId]);

    if(itemData != undefined){
        if ((itemData.deletedAt == "" && itemData.approved == true) || (itemData.sellerId == Id)){
            return(<div>
                <div className={'w-full m-10 grid grid-cols-3'}>
                    <div>
                        <img src={itemData.image} alt="Product Image" className="w-92 h-92 object-cover rounded-lg mb-4 border-2 border-black" />
                    </div>
                    <div className={"bg-white shadow-md rounded-xl max-w-md w-full p-6"}>
                        <h3 className="text-2xl  font-bold text-gray-800 mb-2">
                            {itemData.name}
                        </h3>
                        <p className={"mb-5 text-sm text-gray-500"}>Sold by: <span className="font-medium text-gray-700">{sellerName}</span> {rating} stars</p>
                        <p className={`text-2xl mb-3 mt-3 ${itemData.quantity > 0 ? "text-blue-500" : "text-red-500 line-through"}`}>${itemData.price}</p>
                        <h3 className={"text-2xl font-semibold mb-2 mt-5"}>About this item.</h3>
                        <p className="mb-4">
                            {itemData.description}
                        </p>
                        <p className="text-sm text-gray-500">{itemData.quantity > 0 ? `${itemData.quantity} in stock` : `Out of Stock`}</p>
                        <p className="text-sm text-gray-500">Condition: {itemData.condition}</p>
                    </div>
                    <div className={"center"}>
                        <p className="text-2xl mb-3">${itemData.price}</p>
                        <AddToCart itemId={itemId} stock={itemData.quantity}/>
                    </div>
                </div>
                <div className="flex justify-evenly mt-30">
                    <div className="text-center">
                        {similar.length > 0 ?
                        (<div><h2 className="text-2xl font-bold mb-4 text-black">Similar Items</h2>
                        <Carousel
                        opts={{ align: "start" }}
                        style={{width:"20dvw"}}>
                            <CarouselContent>
                            {similar.map((item) => (
                                <CarouselItem key={item.id}>
                                <div className="p-1">
                                    <CompactItemListing itemId={item.id} image={item.image} price={item.price} productName={item.name} quantity={item.quantity}/>
                                </div>
                                </CarouselItem>
                            ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel></div>) : (<h2 className="text-2xl font-bold mb-4 text-black">No Similar Items Available</h2>)}
                    </div>
                </div>
            </div>
            )
        } else {
            return(
                <div className="center">
                    <h1>
                        Oops!!
                    </h1>
                    <h3 className="text-2xl mt-3 underline">
                        Product Id is invalid or product has been removed!
                    </h3>
                    <p className="w-92">
                        Please avoid manually trying in product routes.
                    </p>
                </div>
            )
        }
    }else {
        return(
            <div className="center">
                <h1>
                    Loading...
                </h1>
            </div>
        )
    }

}

export default ItemDisplay

function selectRandomItems(arr, count) {
    // Create a shallow copy to avoid modifying the original array
    const shuffled = [...arr];

    // Fisher-Yates Shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }

    // Return the first 'count' elements
    if(count <= arr.length){
        return shuffled.slice(0, count);
    } else {
        return shuffled;
    }
}
