'use client'

import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import FireData from '../../firebase/clientApp'
import { useRouter }  from 'next/navigation'
import Link from "next/link";
import {doc, getDoc } from '@firebase/firestore'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);
        try {
        const credential = await signInWithEmailAndPassword(FireData.auth, email, password);
        const userRef = await getDoc(doc(FireData.db, 'User', credential.user.uid))

        var idToken = await credential.user.getIdToken();
        const parts = idToken.split('.');
        const access = userRef.data().accessLevel
        var payload = JSON.parse(atob(parts[1]));

        switch(access) {
            case "Admin":
                payload.role = "Admin"
                payload.status = "null"
                break;
            case "Buyer":
                payload.role = "Buyer"
                payload.status = "null"
                break;
            case "Seller":
                payload.role = "Seller"
                payload.status = "Pending Check"
                // const sellerRef = await getDoc(doc(FireData.db, 'Seller', credential.user.uid))
                // if (sellerRef.data().validated){
                //     payload.status = "approved"
                // } else {
                //     payload.status = "pending"
                // }
                break;
        }

        payload = btoa(JSON.stringify(payload))
        idToken = parts[0]+"."+payload+"."+parts[2]

        await fetch("/api/auth", { //send token to api route to set cookie
            method: "POST",
            headers: {
                Authorization: `${idToken}`,
            },
        });

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