"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface Winner {
  id: string;
  trackingNumber: string;
  name: string;
  amountWon: number;
  investmentType?: string;
  userName?: string;
  userEmail?: string;
  createdAt: string;
  claimInfo?: {
    fullName: string;
    phoneNumber: string;
    email: string;
    houseAddress: string;
    occupation: string;
    country: string;
    submittedAt: string;
    paymentMethod?: string;
    paymentConfirmedAt?: string;
    paymentFiles?: string[];
  };
  tempClaimInfo?: {
    fullName: string;
    phoneNumber: string;
    email: string;
    houseAddress: string;
    occupation: string;
    country: string;
    savedAt: string;
  };
}

export default function AdminPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [amountWon, setAmountWon] = useState("");
  const [winners, setWinners] = useState<Winner[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchWinners = useCallback(async () => {
    try {
      const res = await fetch("/api/winners");
      const data = await res.json();
      if (res.ok) setWinners(data);
    } catch {
      setWinners([]);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch {
      setUsers([]);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    sessionStorage.removeItem("adminUserId");
    router.push("/admin/login");
  };

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("adminAuthenticated");
    if (!isAuthenticated || isAuthenticated !== "true") {
      router.push("/admin/login");
      return;
    }

    fetchWinners();
    fetchUsers();
  }, [fetchWinners, fetchUsers, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const amount = parseFloat(amountWon);
    if (!name.trim() || isNaN(amount) || amount < 0) {
      setMessage({ type: "error", text: "Please enter a valid name and amount" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/winners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), amountWon: amount }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to save winner" });
        return;
      }

      setMessage({
        type: "success",
        text: `Winner saved! Tracking number: ${data.trackingNumber}`,
      });
      setName("");
      setAmountWon("");
      fetchWinners();
    } catch {
      setMessage({ type: "error", text: "Failed to save winner" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-slate-800">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              Public Site
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

<main className="mx-auto max-w-4xl px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Investors</h2>
          </div>
          {winners.length === 0 ? (
            <p className="px-6 py-8 text-slate-500 text-center">No investments yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left text-sm text-slate-600">
                    <th className="px-6 py-3 font-medium">User</th>
                    <th className="px-6 py-3 font-medium">Investment Type</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...winners].reverse().map((w) => (
                    <tr key={w.id} className="border-t border-slate-100">
                      <td className="px-6 py-3 text-slate-800 font-medium">
                        <Link
                          href={`/admin/user/${w.id}`}
                          className="hover:text-emerald-600 hover:underline"
                        >
                          {w.userName || '-'}
                        </Link>
                      </td>
                      <td className="px-6 py-3 text-slate-600">
                        {w.investmentType || '-'}
                      </td>
                      <td className="px-6 py-3 font-medium text-emerald-600">
                        ${w.amountWon?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-3">
                        {w.claimInfo?.paymentConfirmedAt ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-8">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Registered Users</h2>
          </div>
          {users.length === 0 ? (
            <p className="px-6 py-8 text-slate-500 text-center">No registered users yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left text-sm text-slate-600">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-slate-100">
                      <td className="px-6 py-3 text-slate-800 font-medium">
                        {user.name}
                      </td>
                      <td className="px-6 py-3 text-slate-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-3 text-slate-600">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
