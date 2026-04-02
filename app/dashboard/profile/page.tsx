import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileSettingsPanel from "@/components/ui/dashboard/ProfileSettingsPanel";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      defaultCurrency: true,
      dashboardPeriod: true,
      themePreference: true,
      hiddenWidgets: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-background p-4 text-foreground sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Personal Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile, security, and dashboard preferences.</p>
      </div>

      <ProfileSettingsPanel user={user} />
    </div>
  );
}
