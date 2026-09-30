"use client";

import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";
import { useEffect, useState } from "react";

export default function AdminNav({ active }: { active: "inventory" | "leads" }) {
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const count = localStorage.getItem("admin_notification_count") || "0";
      setNotifCount(parseInt(count, 10));
    };

    updateCount();
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  // Notification read/clear karne ke liye function
  const handleClearNotifications = () => {
    localStorage.setItem("admin_notification_count", "0");
    setNotifCount(0);
  };

  const linkClass = (isActive: boolean) =>
    `rounded-panel px-3 py-1.5 text-sm font-medium transition-colors ${
      isActive ? "bg-brand text-white" : "text-slate hover:text-ink"
    }`;

  return (
    <div className="flex items-center justify-between border-b border-lavenderLine pb-4">
      <div className="flex items-center gap-3">
        <Link href="/admin" className={linkClass(active === "inventory")}>
          Inventory
        </Link>
        <Link href="/admin/leads" className={linkClass(active === "leads")}>
          Leads
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Animated Notification Bell */}
        <div
          onClick={handleClearNotifications}
          className="relative cursor-pointer p-2 rounded-full hover:bg-slate-100 transition flex items-center justify-center group"
          title="Click to mark as read"
        >
          <span className={`text-xl inline-block ${notifCount > 0 ? "animate-bounce text-blue-600" : "text-slate-400"}`}>
            🔔
          </span>
          {notifCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse ring-2 ring-white">
              {notifCount}
            </span>
          )}
        </div>

        <LogoutButton />
      </div>
    </div>
  );
}