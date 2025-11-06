'use client'

import { useState, useEffect} from "react"
import FireData from '../../firebase/clientApp'
import {collection, getDocs } from '@firebase/firestore'
import CompactItemListing from '../productHandler/itemListingCompact'
import RequestItem from '../seller/addItem'
import { getAuthUser } from "@/lib/auth"

const SellerDashboard = () => {
    return (
        <div>
            Bacon
        </div>
    )
}

export default SellerDashboard