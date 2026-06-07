"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

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
    submittedAt?: string;
    paymentMethod?: string;
    paymentConfirmedAt?: string;
    paymentFiles?: string[];
  };
}

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const winnerId = params.userId as string;

  const [winner, setWinner] = useState<Winner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWinner() {
      try {
        const res = await fetch("/api/winners");
        const data = await res.json();

        if (res.ok) {
          const found = data.find((w: Winner) => w.id === winnerId);
          if (found) {
            setWinner(found);
          } else {
            setError("Investment not found");
          }
        }
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    if (winnerId) {
      fetchWinner();
    }
  }, [winnerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !winner) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200">
          <div className="mx-auto max-w-4xl px-4 py-4">
            <Link href="/admin" className="text-emerald-600 hover:text-emerald-700 font-medium">
              ← Back to Admin
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error || "Investment not found"}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Link href="/admin" className="text-emerald-600 hover:text-emerald-700 font-medium">
            ← Back to Admin
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-8">
          User Investment Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">User Information</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-slate-500">Name</dt>
                <dd className="text-slate-800 font-medium">{winner.userName || winner.name || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Email</dt>
                <dd className="text-slate-800">{winner.userEmail || '-'}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Investment Details</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-slate-500">Investment Type</dt>
                <dd className="text-slate-800 font-medium">{winner.investmentType || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Amount</dt>
                <dd className="text-2xl font-bold text-emerald-600">
                  ${winner.amountWon?.toLocaleString() || '0'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Date</dt>
                <dd className="text-slate-800">
                  {winner.createdAt ? new Date(winner.createdAt).toLocaleDateString() : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Status</dt>
                <dd>
                  {winner.claimInfo?.paymentFiles && winner.claimInfo.paymentFiles.length > 0 ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      Pending
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:col-span-2">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Payment Information</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-slate-500">Payment Method</dt>
                <dd className="text-slate-800 font-medium capitalize">
                  {winner.claimInfo?.paymentMethod || '-'}
                </dd>
              </div>
              {winner.claimInfo?.paymentConfirmedAt && (
                <div>
                  <dt className="text-sm text-slate-500">Payment Confirmed</dt>
                  <dd className="text-emerald-600">
                    {new Date(winner.claimInfo.paymentConfirmedAt).toLocaleString()}
                  </dd>
                </div>
              )}
            </dl>

            {winner.claimInfo?.paymentFiles && winner.claimInfo.paymentFiles.length > 0 ? (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Uploaded Files</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {winner.claimInfo.paymentFiles.map((file, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(file)}
                      className="border border-slate-200 rounded-lg p-2 hover:ring-2 hover:ring-emerald-500 transition-all text-left"
                    >
                      <img
                        src={file}
                        alt={`Payment file ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <p className="text-xs text-slate-500 mt-1 truncate">{file.split('/').pop()}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">No payment files uploaded yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedImage(null);
            }}
          >
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-slate-300"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedImage}
                alt="Full size"
                className="w-full max-h-[80vh] object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="mt-4 text-center">
                <a
                  href={selectedImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Open in New Tab
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}