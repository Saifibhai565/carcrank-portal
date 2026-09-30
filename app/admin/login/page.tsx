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
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-6 text-white font-sans select-none">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl backdrop-blur-md"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
            P
          </div>
          <h1 className="text-base font-black tracking-wider text-white">
            PLAID DASHBOARD
          </h1>
        </div>
        <p className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest mb-6">
          Control Center Pro
        </p>

        <label htmlFor="password" className="mb-1.5 block text-xs font-bold text-zinc-300">
          Admin Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin access password"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-xs text-white outline-none focus:border-blue-600 font-mono shadow-inner"
        />
        {error && <p className="mt-2 text-xs font-semibold text-rose-500">{error}</p>}
        
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold text-xs text-white transition cursor-pointer shadow-md disabled:opacity-60"
        >
          {loading ? "Authenticating..." : "Access Control Center"}
        </button>
      </form>
    </main>
  );
}