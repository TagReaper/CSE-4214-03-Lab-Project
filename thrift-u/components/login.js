'use client'

import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import FireData from '../firebase/clientApp'
import { useRouter }  from 'next/navigation'
import Link from "next/link";
import {useAuthState} from "react-firebase-hooks/auth";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const [user] = useAuthState(FireData.auth);
    if (user) {
    router.push("/");
    }

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);
        try {
        const credential = await signInWithEmailAndPassword(FireData.auth, email, password);
        console.log('User logged in:', credential.user);
        //const idToken = await credential.user.getIdToken();

        /* await fetch("/api/login", { //send token to api route to set cookie
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