import { getAuthUser } from "@/lib/auth";
import { SecurityDisplayManager } from "@/components/account/securityDisplay";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default async function SecurityPage() {
  const user = await getAuthUser();

  return (
    <div className="container mx-auto max-w-2xl p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
          <CardDescription>
            Update your email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SecurityDisplayManager
            type="email"
            currentEmail={user.email}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password Settings</CardTitle>
          <CardDescription>
            Change your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SecurityDisplayManager type="password" currentEmail={user.email}/>
        </CardContent>
      </Card>
    </div>
  );
}