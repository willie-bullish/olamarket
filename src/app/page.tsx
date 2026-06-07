"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  seller: string;
  inStock: boolean;
  freeShipping: boolean;
}

const featuredProducts: Product[] = [
  {
    id: "1",
    name: "1kg 24 Karat Gold Bar - PAMP Suisse",
    description: "24 Karat 1kg gold bar with assay certificate, investment grade",
    price: 32999.99,
    originalPrice: 59988.12,
    image: "/goldimages/goldbar1.png",
    category: "Gold Bars",
    rating: 5.0,
    reviews: 892,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "2",
    name: "Golden Solitaire Ring",
    description: "1.5 carat golden solitaire set in 24k gold, certified",
    price: 5499.99,
    originalPrice: 10999.98,
    image: "/goldimages/RingA.jpg",
    category: "Rings",
    rating: 4.9,
    reviews: 234,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "4",
    name: "1kg 24 Karat Gold Bar - Valcambi",
    description: "24 Karat Swiss minted 1kg gold bar with serial number",
    price: 59999.99,
    originalPrice: 133332.20,
    image: "/goldimages/goldbar2.jpg",
    category: "Gold Bars",
    rating: 4.8,
    reviews: 423,
    seller: "Precious Metals Inc",
    inStock: true,
    freeShipping: true
  },
  {
    id: "5",
    name: "Pearl Drop Necklace",
    description: "Freshwater pearl necklace with 24k golden chain, 18 inches",
    price: 5799.99,
    originalPrice: 8989.98,
    image: "/goldimages/Necklace1.jpg",
    category: "Necklaces",
    rating: 4.6,
    reviews: 189,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: false
  }
];

export default function HomePage() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingData, setPendingData] = useState<{name: string; email: string; password: string} | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    
    if (!loginEmail || !loginPassword) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setShowAuthModal(false);
      router.push("/dashboard");
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterStep1(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (registerPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
          step: 1
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        return;
      }

      setPendingData({ name: registerName, email: registerEmail, password: registerPassword });
      setOtpSent(true);
      toast.success("Verification code sent to your email!");
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterStep2(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    if (!pendingData) {
      setError("Please complete step 1 first");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pendingData.name,
          email: pendingData.email,
          password: pendingData.password,
          otp,
          step: 2
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Verification failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setShowAuthModal(false);
      router.push("/dashboard");
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  function resetRegisterForm() {
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");
    setOtpSent(false);
    setOtp("");
    setPendingData(null);
  }

  function handleBackToRegister() {
    setOtpSent(false);
    setOtp("");
    setPendingData(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 40 40" className="w-8 h-8">
                <circle cx="20" cy="20" r="20" fill="#d4af37"/>
                <text x="20" y="25" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" fill="white">
                  GOLD
                </text>
              </svg>
              <span className="text-xl font-bold text-gray-800 hidden sm:block">Amira Gold Store</span>
            </div>
            <div className="flex-1" />
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Login / Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Seller Videos */}
      <section className="bg-gradient-to-br from-yellow-50 to-amber-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Amira Gold & Jewelry
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Discover our exclusive collection of investment-grade gold bars and luxury jewelry. Trusted by millions of customers worldwide.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div 
                className="bg-white rounded-xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => { setCurrentVideo('/goldvideo/VID-20260525-WA0005.mp4'); setShowVideoModal(true); }}
              >
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-3 relative">
                  <video 
                    src="/goldvideo/VID-20260525-WA0005.mp4" 
                    className="w-full h-full object-cover"
                    muted
                    autoPlay
                    loop
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800">Seller Introduction</h3>
                <p className="text-sm text-gray-600">Meet our trusted sellers</p>
              </div>
              <div 
                className="bg-white rounded-xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => { setCurrentVideo('/goldvideo/VID-20260525-WA0007.mp4'); setShowVideoModal(true); }}
              >
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-3 relative">
                  <video 
                    src="/goldvideo/VID-20260525-WA0007.mp4" 
                    className="w-full h-full object-cover"
                    muted
                    autoPlay
                    loop
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800">Product Showcase</h3>
                <p className="text-sm text-gray-600">See our premium collection</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.originalPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-600">{product.rating} ({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-gray-800">${product.price.toLocaleString()}</p>
                      {product.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">${product.originalPrice.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="w-full mt-3 px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAuthModal(true)}
              className="inline-block px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Authentic Products</h3>
              <p className="text-gray-600">All products come with certificates of authenticity</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing with exclusive discounts</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Secure Payment</h3>
              <p className="text-gray-600">Safe and secure payment processing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p>&copy; 2026 Amira Gold Store. All rights reserved.</p>
        </div>
      </footer>

      {/* Video Preview Modal */}
      {showVideoModal && currentVideo && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => { setShowVideoModal(false); setCurrentVideo(null); }}
        >
          <div 
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { setShowVideoModal(false); setCurrentVideo(null); }}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white hover:bg-opacity-70 rounded-full p-2 flex items-center gap-2 z-10"
            >
              <span className="text-sm">Cancel</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <video
              src={currentVideo}
              controls
              autoPlay
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {isLogin ? "Login" : "Register"}
                </h2>
                <button
                  onClick={() => { setShowAuthModal(false); resetRegisterForm(); setError(""); }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => { setIsLogin(true); setError(""); }}
                  className={`flex-1 py-3 font-medium text-center transition-colors ${
                    isLogin
                      ? "text-yellow-600 border-b-2 border-yellow-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => { setIsLogin(false); setError(""); resetRegisterForm(); }}
                  className={`flex-1 py-3 font-medium text-center transition-colors ${
                    !isLogin
                      ? "text-yellow-600 border-b-2 border-yellow-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Register
                </button>
              </div>

              {isLogin ? (
                <form onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        id="loginEmail"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="loginPassword"
                          type={showLoginPassword ? "text" : "password"}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showLoginPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <p className="mt-4 text-sm text-red-600">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>
              ) : (
                <>
                  {!otpSent ? (
                    <form onSubmit={handleRegisterStep1}>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="registerName" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            id="registerName"
                            type="text"
                            value={registerName}
                            onChange={(e) => setRegisterName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            id="registerEmail"
                            type="email"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                          </label>
                          <div className="relative">
                            <input
                              id="registerPassword"
                              type={showRegisterPassword ? "text" : "password"}
                              value={registerPassword}
                              onChange={(e) => setRegisterPassword(e.target.value)}
                              placeholder="Minimum 6 characters"
                              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                              disabled={loading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showRegisterPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="registerConfirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <input
                              id="registerConfirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={registerConfirmPassword}
                              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                              placeholder="Confirm your password"
                              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                              disabled={loading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {error && (
                        <p className="mt-4 text-sm text-red-600">{error}</p>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? "Sending verification code..." : "Send Verification Code"}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleRegisterStep2}>
                      <div className="text-center mb-4">
                        <p className="text-sm text-gray-600">
                          Enter the 6-digit code sent to<br />
                          <span className="font-medium text-gray-800">{registerEmail}</span>
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                            Verification Code
                          </label>
                          <input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-center text-2xl tracking-widest"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      {error && (
                        <p className="mt-4 text-sm text-red-600">{error}</p>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? "Verifying..." : "Verify & Create Account"}
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleBackToRegister}
                        className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700"
                      >
                        ← Back to edit details
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}