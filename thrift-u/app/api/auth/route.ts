import { headers, cookies } from "next/headers";

export async function POST() {
  const headersList = await headers();
  const auth = headersList.get("Authorization");

  const cookieStore = await cookies();
  cookieStore.set("idToken", `${auth}`);

  return new Response("success", {
    status: 200,
  });
}
