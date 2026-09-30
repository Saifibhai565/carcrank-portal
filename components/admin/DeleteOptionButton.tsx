"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteOptionButton({
  carId,
  optionId,
}: {
  carId: string;
  optionId: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      disabled={busy}
      onClick={async () => {
        if (!confirm("Remove this option?")) return;
        setBusy(true);
        await fetch(`/api/admin/cars/${carId}/options/${optionId}`, {
          method: "DELETE",
        });
        router.refresh();
      }}
      className="text-slate hover:text-red-600 disabled:opacity-50"
    >
      Delete
    </button>
  );
}
