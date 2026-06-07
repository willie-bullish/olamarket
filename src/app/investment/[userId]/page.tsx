"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface InvestmentData {
  id: string;
  trackingNumber: string;
  name: string;
  amountWon: number;
  investmentType: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  claimInfo?: {
    fullName: string;
    email: string;
    submittedAt?: string;
    savedAt?: string;
    paymentMethod?: string;
    paymentConfirmedAt?: string;
    paymentFiles?: string[];
  };
}

function InvestmentDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const investmentId = params.userId as string;
  
  const [investment, setInvestment] = useState<InvestmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [copiedTelegram, setCopiedTelegram] = useState(false);

  useEffect(() => {
    if (!investmentId) {
      router.push("/portfolio");
      return;
    }

    const fetchInvestment = async () => {
      try {
        const res = await fetch(`/api/investments/${encodeURIComponent(investmentId)}`);
        const data = await res.json();

        if (!res.ok) {
          router.push("/portfolio");
          return;
        }

        setInvestment(data);
      } catch {
        router.push("/portfolio");
      } finally {
        setLoading(false);
      }
    }

    fetchInvestment();
  }, [investmentId, router]);

  const generateWhatsAppMessage = () => {
    if (!investment) return "";
    
    const message = `INVESTMENT INQUIRY

📋 INVESTMENT DETAILS:
- Tracking Number: ${investment.trackingNumber}
- Investment Name: ${investment.name}
- Investment Type: ${investment.investmentType}
- Amount: $${investment.amountWon.toLocaleString()}
- Investor Name: ${investment.userName || 'Not specified'}

STATUS INFORMATION:
- Investment Date: ${new Date(investment.createdAt).toLocaleDateString()}
- Payment Status: ${investment.claimInfo?.paymentConfirmedAt ? 'Confirmed' : 'Pending'}
- Payment Method: ${investment.claimInfo?.paymentMethod || 'Not specified'}

For more information about this investment. Thank you!`;

    return encodeURIComponent(message);
  };

  const generateTelegramMessage = () => {
    if (!investment) return "";
    
    const message = `ORDER INQUIRY AND DETAILS

- Order Name: ${investment.name}
- Order Type: ${investment.investmentType}
- Amount: $${investment.amountWon.toLocaleString()}
- Buyer Name: ${investment.userName || 'Not specified'}

STATUS INFORMATION:
- Order Date: ${new Date(investment.createdAt).toLocaleDateString()}
- Payment Status: ${investment.claimInfo?.paymentConfirmedAt ? 'Confirmed' : 'Pending'}
- Payment Method: ${investment.claimInfo?.paymentMethod || 'Not specified'}

Kindly proceed to the processing of my investment and order. Thank you!`;

    // Remove line breaks and replace with spaces, then encode
    const cleanMessage = message.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    return encodeURIComponent(cleanMessage);
  };

  const copyToClipboard = async (text: string, type: 'whatsapp' | 'telegram') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'whatsapp') {
        setCopiedWhatsApp(true);
        setTimeout(() => setCopiedWhatsApp(false), 2000);
      } else {
        setCopiedTelegram(true);
        setTimeout(() => setCopiedTelegram(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading investment details...</p>
        </div>
      </div>
    );
  }

  if (!investment) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-2xl px-4 py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Investment not found.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Link href="/portfolio" className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Portfolio
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Investment Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{investment.name}</h1>
          <p className="text-slate-600">Investment Details and Status</p>
        </div>

        {/* Investment Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Investment Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Investment Details */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">Investment Details</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-slate-500">Tracking Number:</span>
                  <p className="text-slate-800 font-medium font-mono">{investment.trackingNumber}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Investment Type:</span>
                  <p className="text-slate-800 font-medium">{investment.investmentType}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Investment Amount:</span>
                  <p className="text-slate-800 font-medium text-emerald-600">${investment.amountWon.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Investment Date:</span>
                  <p className="text-slate-800 font-medium">{new Date(investment.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">Status Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-slate-500">Payment Status:</span>
                  <p className="text-slate-800 font-medium">
                    {investment.claimInfo?.paymentConfirmedAt ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Payment Method:</span>
                  <p className="text-slate-800 font-medium">{investment.claimInfo?.paymentMethod || 'Not specified'}</p>
                </div>
                {investment.claimInfo?.paymentConfirmedAt && (
                  <div>
                    <span className="text-sm text-slate-500">Payment Confirmed:</span>
                    <p className="text-slate-800 font-medium">
                      {new Date(investment.claimInfo.paymentConfirmedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {investment.claimInfo?.submittedAt && (
                  <div>
                    <span className="text-sm text-slate-500">Submission Date:</span>
                    <p className="text-slate-800 font-medium">
                      {new Date(investment.claimInfo.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Confirmation Files (if available) */}
        {investment.claimInfo?.paymentFiles && investment.claimInfo.paymentFiles.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Payment Confirmations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {investment.claimInfo.paymentFiles.map((file, index) => (
                <div key={index} className="border border-slate-200 rounded-lg overflow-hidden group">
                  <div className="aspect-video bg-slate-100 relative">
                    <img
                      src={file}
                      alt={`Payment confirmation ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-slate-100">
                            <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        `;
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-white text-slate-800 text-sm rounded-lg shadow-lg hover:bg-slate-50 transition-colors"
                      >
View Full Size
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Support Section */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Contact Support</h2>
          <p className="text-emerald-800 mb-6">
            Have questions about your investment? Contact our support team for assistance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* WhatsApp option commented out */}
            {/* <a
              href={`https://wa.me/18722605215?text=${generateWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Contact via WhatsApp
            </a> */}
            
            <a
              href={`https://t.me/amira_aldahab8391?text=${generateTelegramMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12.056 0zm.165 14.648c1.74.03 3.38-.46 4.4-1.25.98-.76 1.48-1.78 1.48-3.07 0-1.28-.5-2.31-1.48-3.07-1.02-.79-2.66-1.28-4.4-1.25-1.74-.03-3.38.46-4.4 1.25-.98.76-1.48 1.78-1.48 3.07 0 1.28.5 2.31 1.48 3.07 1.02.79 2.66 1.28 4.4 1.25zm0-1.44c-1.43-.03-2.77-.38-3.6-1.01-.78-.6-1.18-1.38-1.18-2.37 0-.99.4-1.77 1.18-2.37.83-.63 2.17-.98 3.6-1.01 1.43.03 2.77.38 3.6 1.01.78.6 1.18 1.38 1.18 2.37 0 .99-.4 1.77-1.18 2.37-.83.63-2.17.98-3.6 1.01zm-1.08-3.54c.28-.28.73-.28 1.01 0 .28.28.28.73 0 1.01-.28.28-.73.28-1.01 0-.28-.28-.73-.28-1.01 0-.28.28-.73.28-1.01zm2.16 0c.28-.28.73-.28 1.01 0 .28.28.28.73 0 1.01-.28.28-.73.28-1.01 0-.28.28-.73-.28-1.01z"/>
              </svg>
              Contact via Telegram
            </a>
          </div>

          {/* Backup Contact Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-6">
            <h3 className="text-sm font-medium text-slate-700 mb-4">Having trouble with the buttons? Copy our telegram username below and send us a direct message:</h3>
            
            <div className="space-y-4">
              {/* WhatsApp backup option commented out */}
              {/* <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-slate-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">WhatsApp</p>
                    <p className="text-xs text-slate-500">+1(872)260-5215</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard('+1(872)260-5215', 'whatsapp')}
                  className="px-3 py-1 text-xs bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors"
                >
                  {copiedWhatsApp ? 'Copied!' : 'Copy'}
                </button>
              </div> */}

              <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-slate-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12.056 0zm.165 14.648c1.74.03 3.38-.46 4.4-1.25.98-.76 1.48-1.78 1.48-3.07 0-1.28-.5-2.31-1.48-3.07-1.02-.79-2.66-1.28-4.4-1.25-1.74-.03-3.38.46-4.4 1.25-.98.76-1.48 1.78-1.48 3.07 0 1.28.5 2.31 1.48 3.07 1.02.79 2.66 1.28 4.4 1.25zm0-1.44c-1.43-.03-2.77-.38-3.6-1.01-.78-.6-1.18-1.38-1.18-2.37 0-.99.4-1.77 1.18-2.37.83-.63 2.17-.98 3.6-1.01 1.43.03 2.77.38 3.6 1.01.78.6 1.18 1.38 1.18 2.37 0 .99-.4 1.77-1.18 2.37-.83.63-2.17.98-3.6 1.01zm-1.08-3.54c.28-.28.73-.28 1.01 0 .28.28.28.73 0 1.01-.28.28-.73.28-1.01 0-.28.28-.73-.28-1.01zm2.16 0c.28-.28.73-.28 1.01 0 .28.28.28.73 0 1.01-.28.28-.73.28-1.01 0-.28.28-.73-.28-1.01z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Telegram Username</p>
                    <p className="text-xs text-slate-500">@amira_aldahab8391</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard('@amira_aldahab8391', 'telegram')}
                  className="px-3 py-1 text-xs bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors"
                >
                  {copiedTelegram ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-600 text-center">
                <span className="font-medium">Your privacy is important.</span> All communication is encrypted and your personal information is securely stored. We respect your privacy.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function InvestmentDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <InvestmentDetailsContent />
    </Suspense>
  );
}
