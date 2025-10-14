'use client'

import {useState} from 'react';
import { createUserWithEmailAndPassword, validatePassword  } from "firebase/auth";
import {db, auth} from '../firebase/clientApp'
import { collection, addDoc, getDocs, doc, setDoc } from '@firebase/firestore';
import {useRouter}  from 'next/navigation'

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [passwordValid, setPassValid] = useState('');
    const [firstName, setFirst] = useState('');
    const [lastName, setLast] = useState('');
    const [sellerReq, setSeller] = useState(false);
    const [loading, setLoading] = useState(false);
    const serverTime = new Date();
    const router = useRouter()

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (password !== passwordValid) {
            alert('Passwords do not match!');
            return;
        }
        if (password.length < 10) {
            alert('Password must be at least 10 characters long');
            return;
        }
        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('account created', user.uid);
            await setDoc(doc(db, 'User', user.uid), {
                email,
                firstName,
                lastName,
                accessLevel: sellerReq ? 2 : 1,
                dateCreated: serverTime.toLocaleString(),
                deletedAt: "",
            });

            if (sellerReq) {
                const confirmed = confirm("Are you sure you want to request a seller account?");
                if (confirmed) {
                await addDoc(collection(db, 'Seller'), {
                    UserID: user.uid,
                    banned: false,
                    validated: false,
                    Flags: 0,
                });
                console.log('Seller record created');
                } else {
                setSeller(false);
                }
            } else {
                await addDoc(collection(db, 'Buyer'), {
                UserID: user.uid,
                banned: false,
                address: "",
                city: "",
                state: "",
                zip: "",
                numOrders: 0,
                });
                console.log('Buyer record created');
            }

            alert('Account created successfully');
            router.push('/login');

        } catch (error) {
        console.error('error creating account:', error);
        switch (error.code) {
        case 'auth/email-already-in-use':
            alert('This email is already registered.');
            break;
        case 'auth/invalid-email':
            alert('Invalid email address.');
            break;
        case 'auth/weak-password':
            alert('Password is too weak.');
            break;
        default:
            alert('Error creating account. Please try again.');
            }
        }
        finally {
            setLoading(false);
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
