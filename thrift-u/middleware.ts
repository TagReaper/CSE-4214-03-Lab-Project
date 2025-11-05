import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextResponse } from "next/server";
import type { NextRequest} from 'next/server.js';

function getDecodedToken(token: RequestCookie) {
    console.log("getDecodedToken: Starting...");
    try {
        if (!token) {
        throw new Error("Unauthorized: You must be logged in.");
        }

        const parts = token.value.split('.');
        const payload = JSON.parse(atob(parts[1]));

        console.log("getDecodedToken: Verifying token...");
        const decodedToken = payload;
        if (!(!!decodedToken.user_id)) {
        throw new Error("Invalid Cookie: Logout, then Login.");
        }
        return decodedToken;
    } catch (error) {
        console.error("getDecodedToken: Error occurred:", error);
        throw error;
    }
};

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
            const decodedToken = getDecodedToken(token)
            console.log("User is logged in!")
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
        "/adminpanel/:path*",
        "/search/:path*"
        ]
}