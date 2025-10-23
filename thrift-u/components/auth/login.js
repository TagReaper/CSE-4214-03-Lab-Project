'use client'

import { useState, useEffect} from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import FireData from '../firebase/clientApp'
import { useRouter }  from 'next/navigation'
import Link from "next/link";
import {useAuthState} from "react-firebase-hooks/auth";
import {doc, getDoc } from '@firebase/firestore'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    //Check sign-in state
    const [user] = useAuthState(FireData.auth);

    //Pushed to home if they are signed in
    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user, router]);

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);
        try {
        const credential = await signInWithEmailAndPassword(FireData.auth, email, password);
        const userRef = await getDoc(doc(FireData.db, 'User', credential.user.uid))
        credential.user.accessLevel = userRef.data().accessLevel;
        console.log('User logged in:', credential.user);

        // Fetch relevent ID from Buyer/Seller/Admin collections

        //Removed due to errors with token verification
        /*const idToken = await credential.user.getIdToken();
        await fetch("/api/login", { //send token to api route to set cookie
            method: 'POST',
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        }); */

        router.push("/"); //redirect to home page again
        } catch (error) {
            console.error('error during account login:', error);
            setError("Failed to log in. Please check your email and password.");
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <div className="login-box">
        <h1>
            Login
        </h1>
        <form style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}} onSubmit={handleLogin}>
        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
        <div>
            <input
                className="input-box"
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <div>
            <input
                className="input-box"
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPass(e.target.value)}
            />
        </div>
        <div>
            <input
                className="loginbutton"
                type="submit"
                value={loading ? "Signing in..." : "Sign in"}
                disabled={loading}
            />
        </div>
    </form>
    <div style={{ marginTop: "15px" }}>
                Don&#39;t have an account? <Link className="underline" href={"/signup"}>Register</Link>
            </div>
        </div>
    )
}

export default Login;