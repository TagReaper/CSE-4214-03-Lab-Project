import { headers, cookies } from "next/headers";

export async function POST() {
  const headersList = await headers();
  const auth = headersList.get("Authorization");
  const FireToken = headersList.get("Secondary");

  const cookieStore = await cookies();
  cookieStore.set("idToken", `${auth}`);
  cookieStore.set("FireToken", `${FireToken}`);

  return new Response("success", {
    status: 200,
  });
}
