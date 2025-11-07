'use client'

import FireData from "../firebase/clientApp";
import { getDocs, collection } from "@firebase/firestore";
import {useState, useEffect} from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import CompactItemListing from "./productHandler/itemListingCompact"


const HomePage = () => {
    const[items,setItems]=useState([])
    const[sports,setSports]=useState([])
    const[living,setLiving]=useState([])
    const[college,setCollege]=useState([])

    useEffect(() => {
        const fetchItems = async () => {
            const querySnapshot = await getDocs(collection(FireData.db, 'Inventory'))
            const itemUnchecked = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}))
            const itemData = itemUnchecked.filter(item => (item.approved && item.deletedAt == ""))
            setItems(selectRandomItems(itemData, 15))
            const college = itemData.filter(item => item.tags.includes("College"))
            setCollege(selectRandomItems(college, 9))
            const sport = itemData.filter(item => item.tags.includes("Sports"))
            setSports(selectRandomItems(sport, 9))
            console.log(selectRandomItems(sport, 9))
            const live = itemData.filter(item => item.tags.includes("Living"))
            setLiving(selectRandomItems(live, 9))
        }
        fetchItems()
    }, []);

    return (
        <div className="mt-30 w-full">
            <div className="flex flex-col w-full mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4 text-black">
                    Hot Picks
                </h2>
                <Carousel
                    opts={{ align: "start" }}
                    style={{width:"60dvw", marginLeft:"auto", marginRight:"auto"}}
                >
                    <CarouselContent>
                    {items.map((item) => (
                        <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                            <CompactItemListing itemId={item.id} image={item.image} price={item.price} productName={item.name} quantity={item.quantity}/>
                        </div>
                        </CarouselItem>
                    ))}
                    </CarouselContent>

                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
            <div className="flex justify-evenly mt-30">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 text-black">Sports</h2>
                    <Carousel
                    opts={{ align: "start" }}
                    style={{width:"20dvw"}}>
                        <CarouselContent>
                        {sports.map((item) => (
                            <CarouselItem key={item.id}>
                            <div className="p-1">
                                <CompactItemListing itemId={item.id} image={item.image} price={item.price} productName={item.name} quantity={item.quantity}/>
                            </div>
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 text-black">College</h2>
                    <Carousel
                    opts={{ align: "start" }}
                    style={{width:"20dvw"}}>
                        <CarouselContent>
                        {college.map((item) => (
                            <CarouselItem key={item.id}>
                            <div className="p-1">
                                <CompactItemListing itemId={item.id} image={item.image} price={item.price} productName={item.name} quantity={item.quantity}/>
                            </div>
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 text-black">Living</h2>
                    <Carousel
                    opts={{ align: "start" }}
                    style={{width:"20dvw"}}>
                        <CarouselContent>
                        {living.map((item) => (
                            <CarouselItem key={item.id}>
                            <div className="p-1">
                                <CompactItemListing itemId={item.id} image={item.image} price={item.price} productName={item.name} quantity={item.quantity}/>
                            </div>
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            </div>
        </div>
    )
}

export default HomePage

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
