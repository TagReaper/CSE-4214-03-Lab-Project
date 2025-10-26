import { NextResponse } from "next/server";
import type { NextRequest} from 'next/server.js';
import FireData from "./firebase/clientApp";


export function middleware(request: NextRequest){
    console.log("Fire DATA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", FireData.auth)
    const response = NextResponse.next();
    const token = request.cookies.get("idToken");
    interface CustomClaims {
        role?: ('admin' | 'seller' | 'buyer')[];
        status?: 'pending_seller' | 'approved_seller';
    }

    if (token != undefined){
        if (token.value != null){
            console.log("TokenID: ", token);
        } else {
            console.log("User is logged out!");
        }
    } else {
        console.log("User has no cookies");
    }
}