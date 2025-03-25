import { Menu, Bell, User, CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { SidebarTrigger } from "../ui/sidebar";
// import { auth } from "@/lib/auth";

export async function Header() {
  // const session = await auth();

  // if (!session?.user) return null;
  return (
    <header className="flex items-center justify-between pr-6 py-4 bg-gray-900  text-white shadow-md w-full">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
      </div>

      {/* Right Section: Notifications & Profile */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-6 w-6" />
        </Button>
        <Button>
          <CircleUserRound />
        </Button>
        <div className="flex items-center gap-2">
          <span className="hidden md:inline">
            Admin:
            {/* {session?.user?.email} */}
          </span>
        </div>
      </div>
    </header>
  );
}
