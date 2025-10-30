import { NextResponse } from "next/server";
import type { NextRequest} from 'next/server.js';



export function middleware(request: NextRequest){
    const response = NextResponse.next();
    const token = request.cookies.get("idToken");

    interface CustomClaims {
        role?: ('admin' | 'seller' | 'buyer')[];
        status?: 'pending_seller' | 'approved_seller';
    }

    console.log(request.nextUrl.pathname)

    if (token != undefined){
        if (token.value != "null"){
            const parts = token.value.split('.');
            const header = JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));
            console.log("User is logged in!")
            // console.log("Token:", token.value);
            // console.log("Header:", header);
            // console.log("Payload:", payload);
        } else {
            console.log("User is logged out!");
        }
    } else {
        console.log("User has no cookies");
    }
}

export const config = {
    matcher: [
        "/",
        "/sellerhub/:path*",
        "/login/:path*",
        "/signup/:path*",
        "/api/:path*",
        "/adminpanel/:path*"
        ]
}