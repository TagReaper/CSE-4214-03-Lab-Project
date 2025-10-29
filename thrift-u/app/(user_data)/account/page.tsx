import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { adminDb } from "@/firebase/adminApp";
import { AccountHeader } from "@/components/account/accountHeader";
import { SettingsCard } from "@/components/account/settingsCard";

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
};

async function getUserData(uid: string): Promise<UserData> {
  try {
    const userDoc = await adminDb.collection("User").doc(uid).get();
    
    if (!userDoc.exists) {
      return { firstName: "", lastName: "", email: "" };
    }
    
    const userData = userDoc.data();
    return {
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      email: userData?.email || "",
    };
  } catch (e) {
    console.error("Failed to fetch user data:", e);
    return { firstName: "", lastName: "", email: "" };
  }
}

export default async function AccountSettingsPage() {
  let user;
  try {
    user = await getAuthUser();
  } catch (error) {
    console.warn("User not authenticated", error);
    redirect("/login");
  }

  const userData = await getUserData(user.uid);

const settingsCards = [
  {
    title: "Login & Security",
    description: "Edit login, email, and password",
    iconName: "ShieldCheck",
    href: "/account/management",
    color: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Your Address",
    description: "Edit, remove or set default address",
    iconName: "MapPin",
    href: "/account/addresses",
    color: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Your Orders",
    description: "Track, return, or view past orders",
    iconName: "ShoppingBag",
    href: "/account/orders",
    color: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];


  return (
    <div className="container mx-auto max-w-6xl p-6">
      <AccountHeader
        firstName={userData.firstName}
        lastName={userData.lastName}
        email={userData.email}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsCards.map((card) => (
            <SettingsCard
            key={card.href}
            title={card.title}
            description={card.description}
            iconName={card.iconName}
            href={card.href}
            color={card.color}
            iconColor={card.iconColor}
            />
        ))}
      </div>
    </div>
  );
}