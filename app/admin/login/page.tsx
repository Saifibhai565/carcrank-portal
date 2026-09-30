"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Login failed");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-lavender px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-panel border border-lavenderLine bg-white p-8"
      >
        <h1 className="font-display text-xl font-extrabold text-ink">
          Carcrank Admin
        </h1>
        <p className="mt-1 text-sm text-slate">
          Sign in to manage your showroom inventory.
        </p>
        <label htmlFor="password" className="mb-1 mt-6 block text-xs text-slate">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-panel border border-lavenderLine bg-lavender px-4 py-2.5 text-ink outline-none"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-panel bg-brand py-2.5 font-semibold text-white hover:bg-brandDark disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
