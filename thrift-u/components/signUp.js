'use client'

import {useState} from 'react';
import db from '../firebase/clientApp'
import {collection, addDoc, getDocs} from '@firebase/firestore';
import {useRouter}  from 'next/navigation'

const SignUp = () => {
    const [email, setEmail] = useState('')
    const [password, setPass] = useState('')
    const [passwordValid, setPassValid] = useState('')
    const [firstName, setFirst] = useState('')
    const [lastName, setLast] = useState('')
    const [sellerReq, setSeller] = useState('')
    const [users, setUsers] = useState([])
    const serverTime = new Date()
    const router = useRouter()

    const handleSubmit = async (event) => {
        event.preventDefault()
        try{
            if(password == passwordValid){
                if(password.length >= 10){
                    const querySnapshot = await getDocs(collection(db, 'User'))
                    var valid = true
                    setUsers(querySnapshot.docs.map((doc) => ({...doc.data()})))
                    for (let index = 0; index < users.length; index++) {
                        if (users[index].email == email){
                            valid = false
                            break;
                        }
                    }
                    if (valid) {
                        if(sellerReq){
                            if (confirm("Are you sure you want to request a seller account?")){
                                const docRef = await addDoc(collection(db, 'User'), {
                                    email: email,
                                    password: password,
                                    firstName: firstName,
                                    lastName: lastName,
                                    accessLevel: 1,
                                    dateCreated: serverTime.toLocaleString(),
                                    deletedAt: "",
                                })
                                console.log('User written with ID: ', docRef.id)
                                const docRef2 = await addDoc(collection(db, 'Seller'), {
                                    UserID: docRef.id,
                                    banned: false,
                                    validated: false,
                                    Flags: 0,
                                })
                                console.log('Seller written with ID: ', docRef2.id)
                                router.push('/login')
                            } else {
                                setSeller(false)
                            }
                        } else {
                            if (confirm("Are you sure you don't want to create a seller account?")){
                                const docRef = await addDoc(collection(db, 'User'), {
                                    email: email,
                                    password: password,
                                    firstName: firstName,
                                    lastName: lastName,
                                    accessLevel: 2,
                                    dateCreated: serverTime.toLocaleString(),
                                    deletedAt: "",
                                })
                                console.log('User written with ID: ', docRef.id)
                                const docRef2 = await addDoc(collection(db, 'Buyer'), {
                                    UserID: docRef.id,
                                    banned: false,
                                    address: "",
                                    city: "",
                                    state: "",
                                    zip: "",
                                    numOrders: 0,
                                })
                                console.log('Buyer written with ID: ', docRef2.id)
                                router.push('/login')
                            } else {
                                setSeller(false)
                            }
                        }
                    } else{
                        alert('Email is already registred to an account!')
                        setEmail('')
                    }
                }else{
                    alert('Password must be 10 (or more) characters long')
                    setPass('')
                    setPassValid('')
                }
            } else {
                alert('Passwords do not match!')
                setPass('')
                setPassValid('')
            }
        }catch (error){
            console.log("Error creating account: ", error)
            alert('Error creating account!')
            setEmail('')
            setPass('')
            setPassValid('')
            setFirst('')
            setLast('')
            setSeller(false)
        }
    }

    return (
        <form className='m-5 flex flex-col' onSubmit={handleSubmit}>
            <input className='m-1 text-black border-1 rounded border-black' required
                type = 'text'
                value = {firstName}
                onChange={(e) => setFirst(e.target.value)}
                placeholder = "First name"
            />
            <input className='m-1 text-black border-1 rounded border-black' required
                type = 'text'
                value = {lastName}
                onChange={(e) => setLast(e.target.value)}
                placeholder = "Last name"
            />
            <input className='m-1 text-black border-1 rounded border-black' required
                type = 'email'
                value = {email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder = "Email"
            />
            <input className='m-1 text-black border-1 rounded border-black' required
                type = 'password'
                value = {password}
                onChange={(e) => setPass(e.target.value)}
                placeholder = "Password (10+ characters)"
            />
            <input className='m-1 text-black border-1 rounded border-black' required
                type = 'password'
                value = {passwordValid}
                onChange={(e) => setPassValid(e.target.value)}
                placeholder = "Confirm password"
            />
            <span className="m-1 text-black border-1 rounded border-black">
                Request Seller Account?&nbsp;
                <input
                    type="checkbox"
                    checked={sellerReq}
                    onChange={(e) => setSeller(e.target.checked)}
                />
            </span>
            &nbsp;&nbsp;
            <button className='m-1 text-black border-2 rounded border-black' type='submit'>Confirm</button>
        </form>
    )
}

export default SignUp
