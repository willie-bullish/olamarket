"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  name: string;
}

interface Investment {
  id: string;
  trackingNumber: string;
  name: string;
  amountWon: number;
  investmentType: string;
  userName: string;
  createdAt: string;
  claimInfo?: {
    paymentConfirmedAt?: string;
  };
}

export default function PortfolioPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);

    async function fetchInvestments() {
      try {
        console.log('🔍 Fetching investments for email:', userData.email);
        const res = await fetch(`/api/investments?email=${encodeURIComponent(userData.email)}`);
        const data = await res.json();
        console.log('📊 API Response:', res.status, data);
        if (res.ok) {
          setInvestments(data.investments || []);
        } else {
          console.error('❌ API Error:', data.error);
        }
      } catch (error) {
        console.error("Failed to fetch investments:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInvestments();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("user");
    router.push("/");
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 40 40" className="w-8 h-8">
                <circle cx="20" cy="20" r="20" fill="#2563eb"/>
                <text x="20" y="25" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="bold" textAnchor="middle" fill="white">
                  IFSA
                </text>
              </svg>
              <span className="text-xl font-bold text-slate-800">IFSA Investments</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Your Investment Portfolio
          </h1>
          <p className="text-slate-600">
            View all your investment opportunities
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading investments...</p>
          </div>
        ) : investments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              No Investments Yet
            </h2>
            <p className="text-slate-600 mb-6">
              You haven't made any investments yet. Start building your portfolio today!
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              View Investment Opportunities
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {investments.map((investment) => (
              <div
                key={investment.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Link 
                      href={`/investment/${investment.id}`}
                      className="text-lg font-semibold text-slate-800 mb-1 hover:text-emerald-600 hover:underline transition-colors inline-block"
                    >
                      {investment.name}
                    </Link>
                    <p className="text-sm text-slate-500 mb-2">
                      Tracking: <span className="font-mono">{investment.id}</span>
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-600">
                        Type: <span className="font-medium">{investment.investmentType}</span>
                      </span>
                      <span className="text-emerald-600 font-semibold">
                        ${investment.amountWon.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      investment.claimInfo?.paymentConfirmedAt
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {investment.claimInfo?.paymentConfirmedAt ? "Active" : "Pending"}
                    </span>
                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(investment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="text-center text-sm text-slate-500">
            <p>&copy; 2026 IFSA Investments. All rights reserved.</p>
          </div>
        </div>
      </main>
    </div>
  );
}