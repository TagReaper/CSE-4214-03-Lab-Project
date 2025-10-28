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
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const RequestItem = ({sellerId}) => {

    const handleRequest = async () => {
        //add item
    }

    return (
        <div>
            <Dialog>
                <form>
                    <DialogTrigger asChild>
                        <button className='m-5 center bg-white duration-200 w-xs h-72 rounded-xl border-2 border-transparent overflow-hidden shadow-lg space-y-4 transform 2-full hover:-translate-y-1 hover:border-gray-400'>
                            <Image src={'/Icons/roundPlus.svg'} alt="Product Image" width={200} height={200}/>
                            <p className='font-bold text-2xl'>Request New Listing</p>
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re
                        done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                        <Label htmlFor="name-1">Name</Label>
                        <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                        </div>
                        <div className="grid gap-3">
                        <Label htmlFor="username-1">Username</Label>
                        <Input id="username-1" name="username" defaultValue="@peduarte" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        </div>

    )
}

export default RequestItem