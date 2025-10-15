/* eslint-disable @typescript-eslint/no-array-constructor */
'use client'

import { useState, useEffect} from "react"
import db from '../firebase/clientApp'
import {collection, doc, getDoc, getDocs } from '@firebase/firestore'
import BanUser from '../components/banUser'



const ListUsers = () => {
    const [buyers, setBuyers] = useState([])
    const [sellers, setSellers] = useState([])
    const [buyerList, setBList] = useState([])
    const [sellerList, setSList] = useState([])
    const [sellerPendList, setSPList] = useState([])

    useEffect(() => {
        const fetchItems = async () => {
            const querySnapshot = await getDocs(collection(db, 'Buyer'))
            setBuyers(querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
            const querySnapshot2 = await getDocs(collection(db, 'Seller'))
            setSellers(querySnapshot2.docs.map((doc) => ({...doc.data(), id: doc.id})))
        }
        fetchItems()
    }, [])

    useEffect(() => {
        const setLists = async () => {
            var sellerListTemp = new Array()
            var sellerPendListTemp = new Array()
            var buyerListTemp = new Array()
            for (let index = 0; index < sellers.length; index++) {
                const docRef = await getDoc(doc(db, "User", sellers[index].UserID))
                if(sellers[index].validated == true){
                    sellerListTemp[index] = docRef.data()
                    sellerListTemp[index].id = sellers[index].UserID
                    sellerListTemp[index].SellerID = sellers[index].id
                } else {
                    sellerPendListTemp[index] = docRef.data()
                    sellerPendListTemp[index].id = sellers[index].UserID
                    sellerPendListTemp[index].SellerID = sellers[index].id
                }
            }
            for (let index = 0; index < buyers.length; index++) {
                const docRef = await getDoc(doc(db, "User", buyers[index].UserID))
                buyerListTemp[index] = docRef.data()
                buyerListTemp[index].id = buyers[index].UserID
                buyerListTemp[index].BuyerID = buyers[index].id
            }
            setBList(buyerListTemp)
            setSList(sellerListTemp)
            setSPList(sellerPendListTemp)
        }
        setLists()
    }, [buyers, sellers])

    return (
        <div>
            <h2><u>List of Buyers</u></h2>
            <ul className='list'>
                {buyerList.map((item) => (
                    <li className='border rounded grid m-1 grid-cols-3 overflow-hidden' key={item.id}>
                        <span className="center font-bold"> {item.id}</span>
                        <span className="center"> {item.firstName} {item.lastName}</span>
                        <span className="center"> {item.email} </span>
                        <span></span>
                        <span className="center"><BanUser id={item.BuyerID} access={2}/></span>
                    </li>
                ))}
            </ul>
            <h2><u>List of confirmed Sellers</u></h2>
            <ul className='list'>
                {sellerList.map((item) => (
                    <li className='border rounded grid m-1 grid-cols-3' key={item.id}>
                        <span className="center font-bold"> {item.id}</span>
                        <span className="center"> {item.firstName} {item.lastName}</span>
                        <span className="center"> {item.email} </span>
                        <span></span>
                        <span className="center"><BanUser id={item.SellerID} access={1}/></span>
                    </li>
                ))}
            </ul>
            <h2><u>List of pending Sellers</u></h2>
            <ul className='list'>
                {sellerPendList.map((item) => (
                    <li className='border rounded grid m-1 grid-cols-3' key={item.id}>
                        <span className="center font-bold"> {item.id}</span>
                        <span className="center"> {item.firstName} {item.lastName}</span>
                        <span className="center"> {item.email} </span>
                        <span></span>
                        <span className="center"> Accept/Deny </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ListUsers