"use client"

export default function InvalidAccess() {
    return (
        <div className={"flex flex-col justify-center items-center h-dvh text-center"}>
            <h1 className="m-2">
                Oops!
            </h1>
            <h3 className="text-2xl mt-3 underline">
                Invalid Access Level
            </h3>
            <p className="w-60">
                If you believe this to be an error.<br/>Try logging out, then logging back in.
            </p>
        </div>
    )
}