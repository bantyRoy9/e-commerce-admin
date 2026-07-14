"use client";

import { BellIcon } from "@heroicons/react/24/outline";
import { useNotification } from "@/hooks/useNotification";
import { useIAM } from "@/lib/iamContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { orderNotificationCount, clearOrderNotifications } = useNotification();
  const { user, logout } = useIAM();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "A";

  const displayName = user ? `${user.firstName} ${user.lastName}` : "Admin";

  return (
    <header className="h-20 bg-green-50 shadow-sm flex items-center justify-between px-8 border-b border-slate-200">
      {/* Left side — could add search here */}
      <div />

      <div className="flex items-center gap-6">
        {/* Notification bell */}
        <button
          className="relative"
          type="button"
          onClick={clearOrderNotifications}
          title="Notifications"
        >
          <BellIcon className="w-7 h-7" />
          {orderNotificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex justify-center items-center">
              {orderNotificationCount}
            </span>
          )}
        </button>

        {/* User info + logout */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-green-600 text-white flex justify-center items-center font-bold text-sm select-none">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-800 leading-tight">{displayName}</span>
            {user?.org && (
              <span className="text-xs text-slate-400 leading-tight">{user.org.name}</span>
            )}
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="ml-2 text-xs text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
