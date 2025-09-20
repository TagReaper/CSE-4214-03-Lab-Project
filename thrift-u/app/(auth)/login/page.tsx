import Image from "next/image";
import Link from 'next/link';

export default function Login() {
    return <div className="login-box">
        <h1>
            Login
        </h1>
        <form style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}} action={"/"}>
            <div>
                <input className="input-box" type="email" placeholder="Email" required></input>
            </div>
            <div>
                <input className="input-box" type="password" placeholder="Password" required></input>
            </div>
            <div>
                <input className="loginbutton" type="submit" value={"Sign in"}></input>
            </div>
        </form>
        <div style={{marginTop: "15px"}}>
            Don&#39;t have an account, <Link className="underline" href = {"/signup"}> register </Link>
        </div>
    </div>
}