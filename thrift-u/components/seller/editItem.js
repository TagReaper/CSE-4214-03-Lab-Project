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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectGroup,
    MultiSelectItem,
    MultiSelectTrigger,
    MultiSelectValue,
} from "@/components/ui/multi-select"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect} from "react"
import { Textarea } from "@/components/ui/textarea"
import { addDoc, doc, getDoc, collection, updateDoc} from "@firebase/firestore"
import FireData from "@/firebase/clientApp"
import {ref, uploadBytes, getDownloadURL} from "firebase/storage"
import { verifyRole } from "@/lib/auth"

const Edit = ({sellerId, itemId}) => {

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState(0);
    const [qty, setQTY] = useState(0);
    const [condition, setCondition] = useState("");
    const [tags, setTags] = useState([]);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const tagOptions = [
        "Sports",
        "Clothing",
        "College",
        "Kitchen",
        "Hoodie",
        "Shirt",
        "Hat",
        "Football",
        "Baseball",
        "Basketball",
        "Soccer",
        "Hockey",
        "Crafts",
        "Gym",
        "Hand-Made",
        "Decoration",
        "Misc",
        "Tennis",
        "Equipment",
        "Tech",
        "Jewelry",
        "Living",
        "Dining"
    ]
    const date = new Date();
    const formName = Math.floor(Math.random()*10000);

    useEffect(() => {
        const fetchItemData = async()=>{
            const itemRef = await getDoc(doc(FireData.db, "Inventory", itemId))
            const data= itemRef.data()
            setTitle(data.name)
            setDesc(data.description)
            setPrice(data.price)
            setQTY(data.quantity)
        }
        fetchItemData();
        setLoading(false)
    },[itemId])

    const handleChange = async (event) => {
        event.preventDefault();
        try{
            if (!(await verifyRole("Seller"))){
                throw new Error("Invalid access")
            }
            const imageRef = ref(FireData.storage, `images/${image.name + Math.floor(Math.random()*10000)}`)
            await uploadBytes(imageRef, image)
            const u = await getDownloadURL(imageRef)

            await updateDoc(doc(FireData.db, "Inventory", itemId), {
                deletedAt: date.toLocaleString(),
            });

            await addDoc(collection(FireData.db, "Inventory"), {
                sellerId: sellerId,
                condition: condition,
                quantity: Number(qty),
                price: Number(price),
                name: title,
                description: desc,
                approved: false,
                tags: tags,
                image: u,
                deletedAt: "",
            })
            location.reload();
        } catch(error) {
            console.error("Error requesting item Edit: ", error)
            alert("Error requesting item edit: ", error)
        }
    }

    const handleDelete = async (event) => {
        event.preventDefault();
        try{
            if (!(await verifyRole("Seller"))){
                throw new Error("Invalid access")
            }

            await updateDoc(doc(FireData.db, "Inventory", itemId), {
                deletedAt: date.toLocaleString(),
            });

            location.reload();
        } catch(error) {
            console.error("Error requesting item deletion: ", error)
            alert("Error requesting item deletion: ", error)
        }
    }

    if(!loading){
        return (
            <div>
                <Dialog>
                    <form onSubmit={handleChange} id={formName}>
                        <DialogTrigger asChild>
                            <button className='ml-auto mr-auto mb-5 flex justify-center items-center bg-white duration-200 w-32 h-8 rounded-xl border-2 border-transparent overflow-hidden shadow-lg space-y-4 transform 2-full hover:-translate-y-1 hover:border-gray-400'>
                                <Image className="translate-y-2" src={'/Icons/pencil.svg'} alt="Product Image" width={15} height={15}/>
                                &nbsp;&nbsp;
                                <p className='font-bold'>Edit Listing</p>
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Item</DialogTitle>
                            <DialogDescription>
                            Input all new product information here.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="Image">Image</Label>
                                <Input id="Image" accept="image/*" onChange={(e) => setImage(e.target.files[0])} type="file" form={formName}/>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="Title">Title</Label>
                                <Input id="Title" value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Pedro Duarte" form={formName} required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="Description">Description</Label>
                                <Textarea id="Description" value={desc} onChange={(e) => setDesc(e.target.value)} type="text" placeholder="Pedro Duarte" form={formName} required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="Price">Price</Label>
                                <Input id="Price" value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="Pedro Duarte" form={formName} required/>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="Quantity">Quantity</Label>
                                <Input id="Quantity" value={qty} onChange={(e) => setQTY(e.target.value)} type="number" placeholder="1, 2, 3, etc" form={formName} required/>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="Condition">Condition</Label>
                                <Select onValueChange={(e) => setCondition(e)} form={formName} required>
                                        <SelectTrigger className="w-[375px]">
                                            <SelectValue placeholder="Condition" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="New">New</SelectItem>
                                            <SelectItem value="Like-New">Like-New</SelectItem>
                                            <SelectItem value="Used">Used</SelectItem>
                                            <SelectItem value="Worn">Worn</SelectItem>
                                            <SelectItem value="Damaged">Damaged</SelectItem>
                                        </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="Tags">Tags</Label>
                                <MultiSelect onValuesChange={(e) => setTags(e)} form={formName}>
                                    <MultiSelectTrigger className="w-[375px]">
                                        <MultiSelectValue placeholder="Select Tags" />
                                    </MultiSelectTrigger>
                                    <MultiSelectContent>
                                        <MultiSelectGroup>
                                            {tagOptions.map((tag) => (
                                                <div key={tag}>
                                                    <MultiSelectItem value={tag}> {tag} </MultiSelectItem>
                                                </div>
                                            ))}
                                        </MultiSelectGroup>
                                    </MultiSelectContent>
                                </MultiSelect>
                            </div>
                        </div>
                        <DialogFooter>
                            <div className="grid grid-cols-4 ml-auto mr-auto gap-2">
                                <Button className="bg-red-600 font-bold w-22" onClick={handleDelete}>Delete Item</Button>
                                <div></div>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" form={formName}>Confirm</Button>
                            </div>
                        </DialogFooter>
                        </DialogContent>
                    </form>
                </Dialog>
            </div>
        )
    }
}

export default Edit
