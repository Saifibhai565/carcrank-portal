"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="rounded-panel border border-lavenderLine px-4 py-2 text-sm text-slate hover:text-ink"
    >
      Log out
    </button>
  );
}
