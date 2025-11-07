import { NextResponse } from "next/server";
import type { NextRequest} from 'next/server.js';

function getDecodedToken(request: NextRequest) {
    const token = request.cookies.get("idToken");
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
    const token = request.cookies.get("idToken");

    const authPaths = ["login", "signup"]
    const publicPaths = ["listing", "search"]
    const buyerPaths = ["cart", "checkout", "account"]
    const sellerPaths = ["sellerhub", "account/management", "sellerhub/products", "sellerhub/orders"]
    const adminPaths = ["adminpanel", "account/management", "adminpanel/orders", "adminpanel/products", "adminpanel/users"]

    console.log(request.nextUrl.pathname)

    if (token != undefined){
        if (token.value != "null"){
            const decodedToken = getDecodedToken(request)
            console.log("User is logged in!")
            if (authPaths.some(item => request.nextUrl.pathname.includes(item))) {
                return NextResponse.redirect(new URL('/', request.url));
            }
            switch (decodedToken.role) {
                case "Admin":
                    if(request.nextUrl.pathname != "/" && request.nextUrl.pathname != "/account" && (!adminPaths.some(item => request.nextUrl.pathname.includes(item)) && !publicPaths.some(item => request.nextUrl.pathname.includes(item)))){
                        return NextResponse.redirect(new URL('/invalidAccess', request.url));
                    }
                    break;
                case "Buyer":
                    if(request.nextUrl.pathname != "/" && request.nextUrl.pathname != "/account" && (!buyerPaths.some(item => request.nextUrl.pathname.includes(item)) && !publicPaths.some(item => request.nextUrl.pathname.includes(item)))){
                        return NextResponse.redirect(new URL('/invalidAccess', request.url));
                    }
                    break;
                case "Seller":
                    if (request.nextUrl.pathname != "/" && request.nextUrl.pathname != "/account" && (decodedToken.status != "approved" || (!sellerPaths.some(item => request.nextUrl.pathname.includes(item)) && !publicPaths.some(item => request.nextUrl.pathname.includes(item))))){
                        return NextResponse.redirect(new URL('/invalidAccess', request.url));
                    }
                    break;
                default:
                    return NextResponse.redirect(new URL('/invalidAccess', request.url));
            }
        } else {
            if (!authPaths.some(item => request.nextUrl.pathname.includes(item))) {
                return NextResponse.redirect(new URL('/login', request.url));
            }
            console.log("User is logged out!");
        }
    } else {
        console.log("User has no cookies");
        if (!authPaths.some(item => request.nextUrl.pathname.includes(item))){
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
}

export const config = {
    matcher: [
        "/",
        "/sellerhub/:path*",
        "/login/:path*",
        "/signup/:path*",
        "/adminpanel/:path*",
        "/search/:path*",
        "/account/:path*",
        "/listing/:path*",
        "/cart/:path*"
        ]
}
