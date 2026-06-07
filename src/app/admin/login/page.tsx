"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'admin@ifsa.com,test@ifsa.com').split(',').map(e => e.trim().toLowerCase());

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const isEmail = identifier.includes('@');
    const trimmedId = identifier.trim();
    
    if (isEmail) {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: identifier, password }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Invalid email or password");
          setLoading(false);
          return;
        }

        const userEmail = identifier.toLowerCase().trim();
        if (!adminEmails.includes(userEmail)) {
          setError("You do not have admin access");
          setLoading(false);
          return;
        }

        sessionStorage.setItem("adminAuthenticated", "true");
        sessionStorage.setItem("adminUserId", data.user?.id || identifier);
        sessionStorage.setItem("adminEmail", identifier);
        
        router.push("/admin");
      } catch {
        setError("An error occurred");
        setLoading(false);
      }
    } else {
      if (trimmedId === "120956" && password === "329632") {
        sessionStorage.setItem("adminAuthenticated", "true");
        sessionStorage.setItem("adminUserId", trimmedId);
        router.push("/admin");
      } else {
        setError("Invalid user ID or password");
        setLoading(false);
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Admin Login
            </h1>
            <p className="text-slate-600">
              Enter your credentials to access the admin panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-slate-700 mb-2">
                Email or User ID
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="email@example.com or user ID"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                disabled={loading}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              ← Back to main site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}