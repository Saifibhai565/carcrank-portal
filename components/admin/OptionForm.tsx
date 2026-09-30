"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type OptionFormValues = {
  id?: string;
  label: string;
  redirectUrl: string;
  sortOrder: string;
};

const empty: OptionFormValues = {
  label: "",
  redirectUrl: "",
  sortOrder: "0",
};

export default function OptionForm({
  carId,
  initial,
}: {
  carId: string;
  initial?: OptionFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<OptionFormValues>(initial ?? empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(initial?.id);

  function set<K extends keyof OptionFormValues>(key: K, val: string) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url = isEdit
      ? `/api/admin/cars/${carId}/options/${initial!.id}`
      : `/api/admin/cars/${carId}/options`;
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (res.ok) {
      router.push(`/admin/cars/${carId}/options`);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid max-w-2xl gap-4">
      <Field label="Button label (shown to the user in step 3)">
        <input
          required
          value={values.label}
          onChange={(e) => set("label", e.target.value)}
          placeholder="e.g. Finance this car"
          className="input"
        />
      </Field>

      <Field label="Redirect link (where the user goes after picking this)">
        <input
          required
          type="url"
          value={values.redirectUrl}
          onChange={(e) => set("redirectUrl", e.target.value)}
          placeholder="https://…"
          className="input"
        />
      </Field>

      <Field label="Display order (lower numbers show first)">
        <input
          type="number"
          value={values.sortOrder}
          onChange={(e) => set("sortOrder", e.target.value)}
          className="input"
        />
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-2 w-full rounded-panel bg-brand py-3 font-semibold text-white hover:bg-brandDark disabled:opacity-60"
      >
        {saving ? "Saving…" : isEdit ? "Save changes" : "Add option"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-slate">{label}</span>
      {children}
    </label>
  );
}
