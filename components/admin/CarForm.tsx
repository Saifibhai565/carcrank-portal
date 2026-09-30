"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type CarFormValues = {
  id?: string;
  make: string;
  model: string;
  year: string;
  trim: string;
  mileage: string;
  price: string;
  fuelType: string;
  transmission: string;
  color: string;
  imageUrl: string;
  description: string;
  status: string;
};

const empty: CarFormValues = {
  make: "",
  model: "",
  year: "",
  trim: "",
  mileage: "",
  price: "",
  fuelType: "Petrol",
  transmission: "Manual",
  color: "",
  imageUrl: "",
  description: "",
  status: "available",
};

export default function CarForm({
  initial,
}: {
  initial?: CarFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<CarFormValues>(initial ?? empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(initial?.id);

  function set<K extends keyof CarFormValues>(key: K, val: string) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url = isEdit ? `/api/admin/cars/${initial!.id}` : "/api/admin/cars";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid max-w-2xl gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Make">
          <input
            required
            value={values.make}
            onChange={(e) => set("make", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Model">
          <input
            required
            value={values.model}
            onChange={(e) => set("model", e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Year">
          <input
            required
            type="number"
            value={values.year}
            onChange={(e) => set("year", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Trim (optional)">
          <input
            value={values.trim}
            onChange={(e) => set("trim", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Colour (optional)">
          <input
            value={values.color}
            onChange={(e) => set("color", e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Mileage">
          <input
            required
            type="number"
            value={values.mileage}
            onChange={(e) => set("mileage", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Price">
          <input
            required
            type="number"
            value={values.price}
            onChange={(e) => set("price", e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Fuel type">
          <select
            value={values.fuelType}
            onChange={(e) => set("fuelType", e.target.value)}
            className="input"
          >
            {["Petrol", "Diesel", "Hybrid", "Electric"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="Transmission">
          <select
            value={values.transmission}
            onChange={(e) => set("transmission", e.target.value)}
            className="input"
          >
            {["Manual", "Automatic"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Photo / logo URL (shown next to the car in the list)">
        <input
          value={values.imageUrl}
          onChange={(e) => set("imageUrl", e.target.value)}
          className="input"
          placeholder="https://… or /cars/corolla.jpg"
        />
      </Field>

      <Field label="Description (optional)">
        <textarea
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          className="input min-h-[90px]"
        />
      </Field>

      <Field label="Status">
        <select
          value={values.status}
          onChange={(e) => set("status", e.target.value)}
          className="input"
        >
          {["available", "reserved", "sold"].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-2 w-full rounded-panel bg-brand py-3 font-semibold text-white hover:bg-brandDark disabled:opacity-60"
      >
        {saving ? "Saving…" : isEdit ? "Save changes" : "Add to showroom"}
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
