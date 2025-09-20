import Image from "next/image";


export default function Login() {
    return <div className="login-box">
        <h1>
            Login
        </h1>
        <form action={"/"}>
            <div className="grid">
                <label className="font-bold"> Email: </label>
                <input className="input-box" type="email" required></input>
            </div>
            <div className="grid">
                <label className="font-bold"> Password: </label>
                <input className="input-box" type="password" required></input>
            </div>
            <div className="grid grid-cols-2">
                <input className="button" type="submit" value={"Login"}></input>
                <form action={"/signup"}>
                    <input style={{float: "right"}} className="button" type="submit" value={"Sign-Up"}></input>
                </form>
            </div>
        </form>
    </div>
}