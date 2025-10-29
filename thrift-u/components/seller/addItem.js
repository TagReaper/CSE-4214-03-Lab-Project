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
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"

const RequestItem = ({sellerId}) => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [qty, setQTY] = useState("");
    const [condition, setCondition] = useState("");
    const [tags, setTags] = useState([]);
    const [image, setImage] = useState();
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
        "Jewlery",
        "Living",
        "Dining"
    ]

    const handleRequest = async () => {
        console.log("Adding item to: ", sellerId)
    }

    return (
        <div>
            <Dialog>
                <form onSubmit={handleRequest} id="prodReq">
                    <DialogTrigger asChild>
                        <button className='m-5 center bg-white duration-200 w-xs h-72 rounded-xl border-2 border-transparent overflow-hidden shadow-lg space-y-4 transform 2-full hover:-translate-y-1 hover:border-gray-400'>
                            <Image src={'/Icons/roundPlus.svg'} alt="Product Image" width={200} height={200}/>
                            <p className='font-bold text-2xl'>Request New Listing</p>
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Request Item</DialogTitle>
                        <DialogDescription>
                        Input all product information here.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="Image">Image</Label>
                            <Input id="Image" value={image} onChange={(e) => setImage(e.target.value)} type="file" form="prodReq"/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="Title">Title</Label>
                            <Input id="Title" value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Pedro Duarte" form="prodReq" required />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="Description">Description</Label>
                            <Textarea id="Description" value={desc} onChange={(e) => setDesc(e.target.value)} type="text" placeholder="Pedro Duarte" form="prodReq" required />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="Price">Price</Label>
                            <Input id="Price" value={price} onChange={(e) => setPrice(e.target.value)} type="text" placeholder="Pedro Duarte" form="prodReq" required/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="Quantity">Quantity</Label>
                            <Input id="Quantity" value={qty} onChange={(e) => setQTY(e.target.value)} type="number" placeholder="1, 2, 3, etc" form="prodReq" required/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="Condition">Condition</Label>
                            <Select onValueChange={(e) => setCondition(e)} form="prodReq" required>
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
                            <MultiSelect onValuesChange={(e) => setTags(e)} form="prodReq">
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
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" form="prodReq">Save changes</Button>
                    </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        </div>

    )
}

export default RequestItem