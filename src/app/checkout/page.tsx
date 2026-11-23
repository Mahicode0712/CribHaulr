"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  QrCode,
  Smartphone,
  CreditCard,
  Truck,
  Users,
  Copy,
  Sparkles,
  ShoppingBag,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sticker } from "@/components/ui/Sticker";
import { Modal } from "@/components/ui/Modal";
import { useHaulStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";

type PaymentMethod = "upi-apps" | "upi-qr" | "card" | "cod";

export default function CheckoutPage() {
  const {
    items,
    vibe,
    space,
    budgetTier,
    removeItem,
    clearBox,
    roommateCode,
    roommateModeEnabled,
    toggleRoommateMode,
    getTotalPrice,
  } = useHaulStore();

  const totalPrice = getTotalPrice();

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    college: "",
    hostelBlock: "",
    roomNumber: "",
    city: "New Delhi",
    pincode: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi-apps");
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [copiedRoommateLink, setCopiedRoommateLink] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Validate address form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.trim())) {
      errors.phone = "Enter a valid 10-digit mobile number";
    }
    if (!formData.college.trim()) errors.college = "College/University is required";
    if (!formData.hostelBlock.trim()) errors.hostelBlock = "Hostel & Block name required";
    if (!formData.roomNumber.trim()) errors.roomNumber = "Room number is required";
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode.trim())) {
      errors.pincode = "Enter a valid 6-digit PIN code";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApplyPromo = () => {
    setPromoError("");
    const code = promoCode.trim().toUpperCase();
    if (code === "FRESHER100" || code === "HOSTEL100") {
      setDiscountApplied(100);
      confetti({ particleCount: 40, spread: 45, origin: { y: 0.8 } });
    } else if (code === "CRIBVIP") {
      setDiscountApplied(200);
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.8 } });
    } else {
      setPromoError("Invalid coupon. Try 'FRESHER100' or 'CRIBVIP'");
    }
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    if (!validateForm()) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOrderConfirmed(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D96B43", "#F5E3A9", "#00F0FF", "#39FF14"],
      });
    }, 1200);
  };

  const handleCopyRoommateLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(
        `${window.location.origin}/builder?roommate=${roommateCode}`
      );
      setCopiedRoommateLink(true);
      setTimeout(() => setCopiedRoommateLink(false), 2000);
    }
  };

  const deliveryFee = totalPrice >= 499 ? 0 : 49;
  const finalPayable = Math.max(0, totalPrice + deliveryFee - discountApplied);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 pb-32">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[var(--border-color)]/30 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/builder"
              className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Builder</span>
            </Link>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
              UPI-First Express Checkout
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-display text-[var(--text-primary)] tracking-tight">
            Review Haul & Student Checkout
          </h1>
        </div>

        <Sticker color="vibe" tilt="right">
          🔒 100% SECURE DORM DISPATCH
        </Sticker>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 space-y-4 max-w-md mx-auto bg-[var(--bg-card)] border-2 border-[var(--border-color)] rounded-3xl p-8 shadow-[4px_4px_0px_var(--shadow-color)]">
          <span className="text-5xl">📦</span>
          <h2 className="text-xl font-bold font-display text-[var(--text-primary)]">
            Your Haul Box is Empty!
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Pick your room vibe and customize a starter box before checking out.
          </p>
          <Link href="/builder">
            <Button variant="primary" size="md">
              Launch Haul Builder
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Address & Payment Methods */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Hostel Delivery Address Form */}
            <Card className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-color)]/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[var(--accent)] text-[var(--accent-text)] border border-[var(--border-color)] flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <h3 className="font-display font-black text-base text-[var(--text-primary)]">
                    Hostel & Campus Delivery Address
                  </h3>
                </div>
                <Badge variant="success">Campus Drop</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold font-display uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ananya Rao"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border-2 bg-[var(--bg-card)] text-sm font-medium focus:outline-none ${
                      formErrors.fullName ? "border-rose-500" : "border-[var(--border-color)]"
                    }`}
                  />
                  {formErrors.fullName && (
                    <span className="text-[10px] text-rose-500 font-bold block mt-0.5">
                      {formErrors.fullName}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold font-display uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
                    Mobile Number (For Gate Delivery OTP) *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border-2 border-r-0 border-[var(--border-color)] bg-[var(--bg-secondary)] text-xs font-bold font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-r-xl border-2 bg-[var(--bg-card)] text-sm font-medium focus:outline-none ${
                        formErrors.phone ? "border-rose-500" : "border-[var(--border-color)]"
                      }`}
                    />
                  </div>
                  {formErrors.phone && (
                    <span className="text-[10px] text-rose-500 font-bold block mt-0.5">
                      {formErrors.phone}
                    </span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold font-display uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
                    College / University Campus Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IIT Delhi, Hauz Khas Campus"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border-2 bg-[var(--bg-card)] text-sm font-medium focus:outline-none ${
                      formErrors.college ? "border-rose-500" : "border-[var(--border-color)]"
                    }`}
                  />
                  {formErrors.college && (
                    <span className="text-[10px] text-rose-500 font-bold block mt-0.5">
                      {formErrors.college}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold font-display uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
                    Hostel Name & Block *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nilgiri Hostel, Block B"
                    value={formData.hostelBlock}
                    onChange={(e) => setFormData({ ...formData, hostelBlock: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border-2 bg-[var(--bg-card)] text-sm font-medium focus:outline-none ${
                      formErrors.hostelBlock ? "border-rose-500" : "border-[var(--border-color)]"
                    }`}
                  />
                  {formErrors.hostelBlock && (
                    <span className="text-[10px] text-rose-500 font-bold block mt-0.5">
                      {formErrors.hostelBlock}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold font-display uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
                    Hostel Room No. *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Room 304 (3rd Floor)"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border-2 bg-[var(--bg-card)] text-sm font-medium focus:outline-none ${
                      formErrors.roomNumber ? "border-rose-500" : "border-[var(--border-color)]"
                    }`}
                  />
                  {formErrors.roomNumber && (
                    <span className="text-[10px] text-rose-500 font-bold block mt-0.5">
                      {formErrors.roomNumber}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold font-display uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
                    City / State
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[var(--border-color)] bg-[var(--bg-card)] text-sm font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold font-display uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
                    PIN Code (6-Digits) *
                  </label>
                  <input
                    type="text"
                    placeholder="110016"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border-2 bg-[var(--bg-card)] text-sm font-medium focus:outline-none ${
                      formErrors.pincode ? "border-rose-500" : "border-[var(--border-color)]"
                    }`}
                  />
                  {formErrors.pincode && (
                    <span className="text-[10px] text-rose-500 font-bold block mt-0.5">
                      {formErrors.pincode}
                    </span>
                  )}
                </div>
              </div>
            </Card>

            {/* 2. Payment Method: UPI-First */}
            <Card className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-color)]/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[var(--accent)] text-[var(--accent-text)] border border-[var(--border-color)] flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <h3 className="font-display font-black text-base text-[var(--text-primary)]">
                    Payment Method (UPI Instant)
                  </h3>
                </div>
                <Sticker color="vibe" tilt="none">
                  ⚡ 0% PAYMENT FEE
                </Sticker>
              </div>

              {/* Method Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "upi-apps", label: "UPI Apps", icon: Smartphone },
                  { id: "upi-qr", label: "Scan QR", icon: QrCode },
                  { id: "card", label: "Card / Net", icon: CreditCard },
                  { id: "cod", label: "Cash on Delivery", icon: Truck },
                ].map((item) => {
                  const isSelected = paymentMethod === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id as PaymentMethod)}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-[var(--accent)] text-[var(--accent-text)] border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)]"
                          : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border-color)]/40 hover:border-[var(--border-color)]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-display font-bold text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* UPI Apps Specific Options */}
              {paymentMethod === "upi-apps" && (
                <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] space-y-3">
                  <span className="text-xs font-bold text-[var(--text-secondary)] block">
                    Tap to open UPI app on this device:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { name: "Google Pay", color: "bg-[#EA4335]", text: "GPay" },
                      { name: "PhonePe", color: "bg-[#5F259F]", text: "PhonePe" },
                      { name: "Paytm", color: "bg-[#002E6E]", text: "Paytm" },
                      { name: "BHIM UPI", color: "bg-[#00796B]", text: "BHIM" },
                    ].map((app) => (
                      <div
                        key={app.name}
                        onClick={handlePlaceOrder}
                        className="p-3 rounded-xl border-2 border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--accent-soft, #FFF)] shadow-[2px_2px_0px_var(--shadow-color)] transition-transform hover:-translate-y-0.5 flex flex-col items-center gap-1 cursor-pointer select-none"
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${app.color} inline-block`} />
                        <span className="font-display font-extrabold text-xs text-[var(--text-primary)]">
                          {app.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-medium block text-center pt-1">
                    Auto-redirects to your bank app for 1-tap PIN authorization
                  </span>
                </div>
              )}

              {/* UPI QR Code View */}
              {paymentMethod === "upi-qr" && (
                <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] flex flex-col items-center text-center space-y-3">
                  <div className="w-36 h-36 bg-white border-2 border-[var(--border-color)] rounded-2xl p-2 shadow-[3px_3px_0px_var(--shadow-color)] flex items-center justify-center">
                    {/* Simulated SVG QR Matrix */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-[#09090B]">
                      <rect x="10" y="10" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="17" y="17" width="11" height="11" fill="currentColor" />
                      <rect x="65" y="10" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="72" y="17" width="11" height="11" fill="currentColor" />
                      <rect x="10" y="65" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="17" y="72" width="11" height="11" fill="currentColor" />
                      <circle cx="50" cy="50" r="8" fill="var(--accent)" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-black font-display text-[var(--text-primary)] block">
                      Scan with any UPI Banking App
                    </span>
                    <span className="text-[11px] font-mono text-[var(--text-muted)] block mt-0.5">
                      VPA: cribhaulr.pay@okhdfcbank
                    </span>
                  </div>
                </div>
              )}

              {/* Card & COD Notices */}
              {paymentMethod === "card" && (
                <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] text-xs text-[var(--text-secondary)] space-y-2">
                  <p className="font-semibold">
                    Supported: RuPay, Visa, Mastercard, and Net Banking across all Indian banks.
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    You will be redirected to the secure sandbox gateway upon placing your order.
                  </p>
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-950 text-xs space-y-1">
                  <span className="font-bold block">💵 Cash on Delivery (Hostel Gate):</span>
                  <p className="text-[11px]">
                    Pay cash or scan the delivery agent&apos;s physical QR when the box reaches your hostel security gate.
                  </p>
                </div>
              )}
            </Card>

            {/* 3. Roommate Mode Collaboration Stub */}
            <Card className="space-y-3 bg-[var(--bg-card)] border-2 border-[var(--border-color)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[var(--accent)]" />
                  <h4 className="font-display font-black text-sm text-[var(--text-primary)]">
                    Roommate Mode: Split or Vote
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={toggleRoommateMode}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    roommateModeEnabled
                      ? "bg-emerald-500 text-white border-emerald-700"
                      : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]/30"
                  }`}
                >
                  {roommateModeEnabled ? "Active" : "Enable"}
                </button>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Want to split this haul box with your roommate? Share your haul link so they can approve items, add their snacks, or split the UPI bill.
              </p>

              <div className="pt-1 flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] font-mono text-xs font-bold text-[var(--text-primary)] truncate">
                  Code: {roommateCode}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyRoommateLink}
                  className="gap-1.5 shrink-0"
                >
                  {copiedRoommateLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Invite Link</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column (5 cols): Order Summary & Place Order Button */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-color)]/20 pb-3">
                <h3 className="font-display font-black text-base text-[var(--text-primary)]">
                  Order Summary
                </h3>
                <span className="text-xs font-bold text-[var(--text-muted)]">
                  {items.length} {items.length === 1 ? "Item" : "Items"}
                </span>
              </div>

              {/* Items in Cart */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-[var(--border-color)]/10 last:border-0"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-display font-bold text-[var(--text-primary)] truncate block">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] uppercase">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-black text-sm">{formatINR(item.price)}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-zinc-400 hover:text-rose-600 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="pt-2 border-t border-[var(--border-color)]/20 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code (try FRESHER100)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border-2 border-[var(--border-color)] bg-[var(--bg-card)] text-xs font-bold uppercase focus:outline-none"
                  />
                  <Button size="sm" variant="secondary" onClick={handleApplyPromo}>
                    Apply
                  </Button>
                </div>
                {promoError && (
                  <span className="text-[10px] text-rose-500 font-bold block">
                    {promoError}
                  </span>
                )}
                {discountApplied > 0 && (
                  <span className="text-[10px] text-emerald-600 font-bold block">
                    ✨ ₹{discountApplied} discount successfully applied!
                  </span>
                )}
              </div>

              {/* Price Calculations */}
              <div className="pt-2 border-t border-[var(--border-color)]/20 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Items Subtotal</span>
                  <span className="font-bold">{formatINR(totalPrice)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Hostel Gate Delivery</span>
                  <span className="font-bold text-emerald-600">
                    {deliveryFee === 0 ? "FREE" : formatINR(deliveryFee)}
                  </span>
                </div>

                {discountApplied > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Student Discount</span>
                    <span>-{formatINR(discountApplied)}</span>
                  </div>
                )}

                <div className="pt-2 border-t-2 border-[var(--border-color)] flex justify-between items-baseline">
                  <div>
                    <span className="font-display font-black text-sm text-[var(--text-primary)] block">
                      Total Payable
                    </span>
                    <span className="text-[9px] text-[var(--text-muted)] font-bold">
                      Includes all campus taxes & packaging
                    </span>
                  </div>
                  <span className="text-2xl font-black font-display text-[var(--accent)]">
                    {formatINR(finalPayable)}
                  </span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <Button
                size="lg"
                variant="primary"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                isLoading={isProcessing}
                className="w-full gap-2 text-base font-black shadow-[4px_4px_0px_var(--shadow-color)]"
              >
                <span>Pay {formatINR(finalPayable)} with UPI</span>
                <Check className="w-5 h-5 stroke-[3]" />
              </Button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-[var(--text-muted)] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero-risk: Campus return policy within 48h</span>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Mock Order Confirmation Modal */}
      <Modal
        isOpen={orderConfirmed}
        onClose={() => setOrderConfirmed(false)}
        className="max-w-md text-center space-y-4"
      >
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 border-3 border-[var(--border-color)] mx-auto flex items-center justify-center text-3xl shadow-[4px_4px_0px_var(--shadow-color)]">
          🎉
        </div>

        <div className="space-y-1">
          <Sticker color="vibe" tilt="none">
            ⚡ PAYMENT AUTHORIZED
          </Sticker>
          <h2 className="text-2xl font-black font-display text-[var(--text-primary)] mt-2">
            Haul Box Dispatched!
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
            Your {vibe.toUpperCase()} haul box is being packed for delivery to{" "}
            <strong>{formData.hostelBlock || "your hostel"}, {formData.roomNumber || "room"}</strong>.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] space-y-1.5 text-xs text-left">
          <div className="flex justify-between font-mono">
            <span className="text-[var(--text-muted)]">Order ID:</span>
            <span className="font-bold">CRB-938210</span>
          </div>
          <div className="flex justify-between font-mono">
            <span className="text-[var(--text-muted)]">Amount Paid:</span>
            <span className="font-bold text-[var(--accent)]">{formatINR(finalPayable)}</span>
          </div>
          <div className="flex justify-between font-mono">
            <span className="text-[var(--text-muted)]">Target Arrival:</span>
            <span className="font-bold">Tomorrow by 4:00 PM</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <Link href="/share">
            <Button size="md" variant="primary" className="w-full gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Share 9:16 Instagram Story Card</span>
            </Button>
          </Link>

          <Link href="/">
            <Button
              size="md"
              variant="outline"
              className="w-full"
              onClick={() => {
                clearBox();
                setOrderConfirmed(false);
              }}
            >
              Back to Campus Home
            </Button>
          </Link>
        </div>
      </Modal>
    </div>
  );
}
