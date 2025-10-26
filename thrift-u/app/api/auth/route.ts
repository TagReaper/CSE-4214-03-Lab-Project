import {headers, cookies} from 'next/headers'

export async function POST() {
    const headersList = await headers();
    const auth = headersList.get("Authorization");
    const altId = headersList.get("AltID");
    const access = headersList.get("AccessLevel");

    const cookieStore = await cookies();
    cookieStore.set("idToken", `${auth}`);
    cookieStore.set("altID", `${altId}`);
    cookieStore.set("accessLevel", `${access}`);

    return new Response('success',{
        status: 200
    })
}