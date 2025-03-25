import { Header } from "@/components/header/header";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await auth();
  // console.log("Session:", session); // Debugging
  // if (!session) {
  //   redirect("/login"); // Ensure a valid login page instead of looping
  // }
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          <Header /> {/* Header Component */}
          <main className="p-4 bg-gray-100">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
