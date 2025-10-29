'use client'

import Login from '../../../components/auth/login';
import {useEffect} from 'react';
import {useAuthState} from "react-firebase-hooks/auth";
import FireData from "../../../firebase/clientApp";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    //Check sign-in state
    const [user] = useAuthState(FireData.auth);
    //Pushed to home if they are signed in
    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user, router]);

    return <div className="center">
        <h1>Login</h1>
        <Login />
    </div>
}