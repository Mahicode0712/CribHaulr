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
  Trash2,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sticker } from "@/components/ui/Sticker";
import { Modal } from "@/components/ui/Modal";
import { useHaulStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { getThemeConfettiColors } from "@/lib/theme";

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
  const [roommateLinkError, setRoommateLinkError] = useState<string | null>(null);
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
      confetti({
        particleCount: 40,
        spread: 45,
        origin: { y: 0.8 },
        colors: getThemeConfettiColors(),
      });
    } else if (code === "CRIBVIP") {
      setDiscountApplied(200);
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.8 },
        colors: getThemeConfettiColors(),
      });
    } else {
      setDiscountApplied(0);
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
        colors: getThemeConfettiColors(),
      });
    }, 1200);
  };

  const handleCopyRoommateLink = async () => {
    setRoommateLinkError(null);
    try {
      const url = new URL("/builder", window.location.origin);
      url.searchParams.set("vibe", vibe);
      url.searchParams.set("tier", String(budgetTier));
      url.searchParams.set("space", space);
      url.searchParams.set("items", items.map((item) => item.id).join(","));
      url.searchParams.set("roommate", roommateCode);
      await navigator.clipboard.writeText(url.toString());
      setCopiedRoommateLink(true);
      setTimeout(() => setCopiedRoommateLink(false), 2000);
    } catch (cause) {
      console.error("Copy roommate link failed:", cause);
      setRoommateLinkError("Could not copy the invite link. Check clipboard permissions and try again.");
    }
  };

  const deliveryFee = totalPrice >= 499 ? 0 : 49;
  const finalPayable = Math.max(0, totalPrice + deliveryFee - discountApplied);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 pb-32">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-width-theme border-line/30 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/builder"
              className="text-xs font-bold text-muted hover:text-ink flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Builder</span>
            </Link>
            <span className="text-muted">•</span>
            <span className="text-xs font-bold text-ink uppercase tracking-wider">
              UPI-First Checkout Preview
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-display text-ink tracking-tight">
            Review Haul & Student Checkout
          </h1>
        </div>

        <Sticker color="vibe" tilt="right">
          CHECKOUT UI PREVIEW
        </Sticker>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 space-y-4 max-w-md mx-auto bg-surface border-width-theme border-line rounded-card p-8 sticker-shadow">
          <span className="text-5xl">📦</span>
          <h2 className="text-xl font-bold font-display text-ink">
            Your Haul Box is Empty!
          </h2>
          <p className="text-xs text-muted">
            Pick your room vibe and customize a starter box before checking out.
          </p>
          <ButtonLink href="/builder" variant="primary" size="md">
            Launch Haul Builder
          </ButtonLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Address & Payment Methods */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Hostel Delivery Address Form */}
            <Card className="space-y-4">
              <div className="flex items-center justify-between border-b border-line/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-btn bg-accent text-on-accent border-width-theme border-line flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <h3 className="font-display font-black text-base text-ink">
                    Hostel & Campus Delivery Address (Preview)
                  </h3>
                </div>
                <Badge variant="success">Preview Only</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="full-name" className="text-[11px] font-bold font-display uppercase tracking-wider text-muted block mb-1">
                    Student Full Name *
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    placeholder="e.g. Ananya Rao"
                    aria-invalid={Boolean(formErrors.fullName)}
                    aria-describedby={formErrors.fullName ? "full-name-error" : undefined}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-btn border-width-theme bg-surface text-sm font-medium focus:outline-none ${
                      formErrors.fullName ? "border-primary" : "border-line"
                    }`}
                  />
                  {formErrors.fullName && (
                    <span id="full-name-error" role="alert" className="text-[10px] text-primary font-bold block mt-0.5">
                      {formErrors.fullName}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="text-[11px] font-bold font-display uppercase tracking-wider text-muted block mb-1">
                    Mobile Number *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-btn border-width-theme border-r-0 border-line bg-secondary text-xs font-bold font-body">
                      +91
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      maxLength={10}
                      aria-invalid={Boolean(formErrors.phone)}
                      aria-describedby={formErrors.phone ? "phone-error" : undefined}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-r-btn border-width-theme bg-surface text-sm font-medium focus:outline-none ${
                        formErrors.phone ? "border-primary" : "border-line"
                      }`}
                    />
                  </div>
                  {formErrors.phone && (
                    <span id="phone-error" role="alert" className="text-[10px] text-primary font-bold block mt-0.5">
                      {formErrors.phone}
                    </span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="college" className="text-[11px] font-bold font-display uppercase tracking-wider text-muted block mb-1">
                    College / University Campus Name *
                  </label>
                  <input
                    id="college"
                    type="text"
                    placeholder="e.g. IIT Delhi, Hauz Khas Campus"
                    aria-invalid={Boolean(formErrors.college)}
                    aria-describedby={formErrors.college ? "college-error" : undefined}
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-btn border-width-theme bg-surface text-sm font-medium focus:outline-none ${
                      formErrors.college ? "border-primary" : "border-line"
                    }`}
                  />
                  {formErrors.college && (
                    <span id="college-error" role="alert" className="text-[10px] text-primary font-bold block mt-0.5">
                      {formErrors.college}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="hostel-block" className="text-[11px] font-bold font-display uppercase tracking-wider text-muted block mb-1">
                    Hostel Name & Block *
                  </label>
                  <input
                    id="hostel-block"
                    type="text"
                    placeholder="e.g. Nilgiri Hostel, Block B"
                    aria-invalid={Boolean(formErrors.hostelBlock)}
                    aria-describedby={formErrors.hostelBlock ? "hostel-block-error" : undefined}
                    value={formData.hostelBlock}
                    onChange={(e) => setFormData({ ...formData, hostelBlock: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-btn border-width-theme bg-surface text-sm font-medium focus:outline-none ${
                      formErrors.hostelBlock ? "border-primary" : "border-line"
                    }`}
                  />
                  {formErrors.hostelBlock && (
                    <span id="hostel-block-error" role="alert" className="text-[10px] text-primary font-bold block mt-0.5">
                      {formErrors.hostelBlock}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="room-number" className="text-[11px] font-bold font-display uppercase tracking-wider text-muted block mb-1">
                    Hostel Room No. *
                  </label>
                  <input
                    id="room-number"
                    type="text"
                    placeholder="e.g. Room 304 (3rd Floor)"
                    aria-invalid={Boolean(formErrors.roomNumber)}
                    aria-describedby={formErrors.roomNumber ? "room-number-error" : undefined}
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-btn border-width-theme bg-surface text-sm font-medium focus:outline-none ${
                      formErrors.roomNumber ? "border-primary" : "border-line"
                    }`}
                  />
                  {formErrors.roomNumber && (
                    <span id="room-number-error" role="alert" className="text-[10px] text-primary font-bold block mt-0.5">
                      {formErrors.roomNumber}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="city" className="text-[11px] font-bold font-display uppercase tracking-wider text-muted block mb-1">
                    City / State
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-btn border-width-theme border-line bg-surface text-sm font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="pincode" className="text-[11px] font-bold font-display uppercase tracking-wider text-muted block mb-1">
                    PIN Code (6-Digits) *
                  </label>
                  <input
                    id="pincode"
                    type="text"
                    placeholder="110016"
                    maxLength={6}
                    aria-invalid={Boolean(formErrors.pincode)}
                    aria-describedby={formErrors.pincode ? "pincode-error" : undefined}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-btn border-width-theme bg-surface text-sm font-medium focus:outline-none ${
                      formErrors.pincode ? "border-primary" : "border-line"
                    }`}
                  />
                  {formErrors.pincode && (
                    <span id="pincode-error" role="alert" className="text-[10px] text-primary font-bold block mt-0.5">
                      {formErrors.pincode}
                    </span>
                  )}
                </div>
              </div>
            </Card>

            {/* 2. Payment Method: UPI-First */}
            <Card className="space-y-4">
              <div className="flex items-center justify-between border-b border-line/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-btn bg-accent text-on-accent border-width-theme border-line flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <h3 className="font-display font-black text-base text-ink">
                    Payment Options (Demo)
                  </h3>
                </div>
                <Sticker color="vibe" tilt="none">
                  ⚡ NO REAL PAYMENT
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
                      className={`p-3 rounded-card border-width-theme transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-primary text-on-primary border-line sticker-shadow"
                          : "bg-secondary text-on-secondary border-line/40 hover:border-line"
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
                <div className="p-4 rounded-card bg-secondary border-width-theme border-line space-y-3">
                  <span className="text-xs font-bold text-muted block">
                    Demo buttons only; this prototype does not open a banking app or collect payment.
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { name: "Google Pay", text: "GPay" },
                      { name: "PhonePe", text: "PhonePe" },
                      { name: "Paytm", text: "Paytm" },
                      { name: "BHIM UPI", text: "BHIM" },
                    ].map((app) => (
                      <button
                        type="button"
                        aria-label={`Select ${app.name}`}
                        key={app.name}
                        onClick={handlePlaceOrder}
                        className="p-3 rounded-btn border-width-theme border-line bg-surface text-ink hover:bg-primary hover:text-on-primary sticker-shadow transition-transform hover:-translate-y-0.5 flex flex-col items-center gap-1 cursor-pointer select-none font-body"
                      >
                        <span className="w-3.5 h-3.5 rounded-full bg-primary inline-block" />
                        <span className="font-display font-extrabold text-xs text-ink">
                          {app.text}
                        </span>
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-muted font-medium block text-center pt-1">
                    Demo checkout only. No UPI payment is initiated.
                  </span>
                </div>
              )}

              {/* UPI QR Code View */}
              {paymentMethod === "upi-qr" && (
                <div className="p-4 rounded-card bg-secondary border-width-theme border-line flex flex-col items-center text-center space-y-3">
                  <div className="w-36 h-36 bg-surface border-width-theme border-line rounded-card p-2 sticker-shadow flex items-center justify-center">
                    {/* Simulated SVG QR Matrix */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-ink">
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
                    <span className="text-xs font-black font-display text-ink block">
                      Demo QR only — no payment is processed
                    </span>
                    <span className="text-[11px] font-body text-muted block mt-0.5">
                      Sample QR for UI preview
                    </span>
                  </div>
                </div>
              )}

              {/* Card & COD Notices */}
              {paymentMethod === "card" && (
                <div className="p-4 rounded-card bg-secondary border-width-theme border-line text-xs text-muted space-y-2">
                  <p className="font-semibold">
                    Card and net banking options are shown for preview only.
                  </p>
                  <p className="text-[11px] text-muted">
                    No gateway is connected and no payment will be collected.
                  </p>
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="p-4 rounded-card bg-accent/10 border-width-theme border-accent/40 text-ink text-xs space-y-1">
                  <span className="font-bold block">💵 Cash on Delivery (demo option):</span>
                  <p className="text-[11px]">
                    This prototype does not create real orders or collect payment.
                  </p>
                </div>
              )}
            </Card>

            {/* 3. Roommate Mode Collaboration Stub */}
            <Card className="space-y-3 bg-surface border-width-theme border-line">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  <h4 className="font-display font-black text-sm text-ink">
                    Roommate Share Link (Preview)
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={toggleRoommateMode}
                  aria-pressed={roommateModeEnabled}
                  aria-label={
                    roommateModeEnabled
                      ? "Disable roommate mode preview"
                      : "Enable roommate mode preview"
                  }
                  className={`min-h-[44px] px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    roommateModeEnabled
                      ? "bg-primary text-on-primary border-line"
                      : "bg-secondary text-on-secondary border-line/30"
                  }`}
                >
                  {roommateModeEnabled ? "Active" : "Enable"}
                </button>
              </div>

              <p className="text-xs text-muted leading-relaxed">
                Share this haul with your roommate. Collaborative edits, voting, and bill splitting are not connected in this preview.
              </p>

              <div className="pt-1 flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-btn bg-secondary border-width-theme border-line font-body text-xs font-bold text-ink truncate">
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
                      <Check className="w-3.5 h-3.5 text-primary stroke-[3]" />
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
              {roommateLinkError && (
                <p role="alert" className="text-xs font-bold text-primary">
                  {roommateLinkError}
                </p>
              )}
            </Card>
          </div>

          {/* Right Column (5 cols): Order Summary & Place Order Button */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="space-y-4">
              <div className="flex items-center justify-between border-b border-line/20 pb-3">
                <h3 className="font-display font-black text-base text-ink">
                  Order Summary
                </h3>
                <span className="text-xs font-bold text-muted">
                  {items.length} {items.length === 1 ? "Item" : "Items"}
                </span>
              </div>

              {/* Items in Cart */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-line/10 last:border-0"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-display font-bold text-ink truncate block">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-muted uppercase">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="theme-price font-black text-sm">{formatINR(item.price)}</span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name} from haul`}
                        className="text-muted hover:text-primary p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="pt-2 border-t border-line/20 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code (try FRESHER100)"
                    aria-label="Coupon code"
                    aria-invalid={Boolean(promoError)}
                    aria-describedby={promoError ? "promo-error" : undefined}
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-btn border-width-theme border-line bg-surface text-xs font-bold uppercase focus:outline-none"
                  />
                  <Button size="sm" variant="secondary" onClick={handleApplyPromo}>
                    Apply
                  </Button>
                </div>
                {promoError && (
                  <span id="promo-error" role="alert" className="text-[10px] text-primary font-bold block">
                    {promoError}
                  </span>
                )}
                {discountApplied > 0 && (
                  <span className="text-[10px] text-primary font-bold block">
                    ✨ ₹{discountApplied} discount successfully applied!
                  </span>
                )}
              </div>

              {/* Price Calculations */}
              <div className="pt-2 border-t border-line/20 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted">Items Subtotal</span>
                  <span className="theme-price font-bold">{formatINR(totalPrice)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted">Demo delivery estimate</span>
                  <span className="theme-price font-bold">
                    {deliveryFee === 0 ? "FREE" : formatINR(deliveryFee)}
                  </span>
                </div>

                {discountApplied > 0 && (
                  <div className="flex justify-between text-ink font-bold">
                    <span>Student Discount</span>
                    <span>-{formatINR(discountApplied)}</span>
                  </div>
                )}

                <div className="pt-2 border-t-width-theme border-line flex justify-between items-baseline">
                  <div>
                    <span className="font-display font-black text-sm text-ink block">
                      Demo Total
                    </span>
                    <span className="text-[9px] text-muted font-bold">
                      No payment is processed
                    </span>
                  </div>
                  <span className="theme-price text-2xl font-black font-display">
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
                className="w-full gap-2 text-base font-black sticker-shadow"
              >
                <span>
                  Place Demo Order · {formatINR(finalPayable)}{" "}
                  {paymentMethod === "cod"
                    ? "COD"
                    : `via ${paymentMethod === "card" ? "Card" : "UPI"}`}
                </span>
                <Check className="w-5 h-5 stroke-[3]" />
              </Button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Demo checkout only · no payment is processed</span>
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
        <div className="w-16 h-16 rounded-card bg-secondary text-on-secondary border-width-theme border-line mx-auto flex items-center justify-center text-3xl sticker-shadow">
          🎉
        </div>

        <div className="space-y-1">
          <Sticker color="vibe" tilt="none">
            ⚡ DEMO CHECKOUT
          </Sticker>
          <h2 className="text-2xl font-black font-display text-ink mt-2">
            Demo Order Confirmed!
          </h2>
          <p className="text-xs text-muted font-medium leading-relaxed">
            No payment has been processed. Your {vibe.toUpperCase()} haul preview is ready for{" "}
            <strong>{formData.hostelBlock || "your hostel"}, {formData.roomNumber || "room"}</strong>.
          </p>
        </div>

        <div className="p-3.5 rounded-card bg-secondary border-width-theme border-line space-y-1.5 text-xs text-left">
          <div className="flex justify-between font-body">
            <span className="text-muted">Demo reference:</span>
            <span className="font-bold">CRB-DEMO</span>
          </div>
          <div className="flex justify-between font-body">
            <span className="text-muted">Demo total:</span>
            <span className="theme-price font-bold">{formatINR(finalPayable)}</span>
          </div>
          <div className="flex justify-between font-body">
            <span className="text-muted">Demo delivery:</span>
            <span className="font-bold">Not scheduled</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <ButtonLink href="/share" size="md" variant="primary" className="w-full gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Share 9:16 Instagram Story Card</span>
          </ButtonLink>

          <ButtonLink
            href="/"
            size="md"
            variant="outline"
            className="w-full"
            onClick={() => {
              clearBox();
              setOrderConfirmed(false);
            }}
          >
            Back to Campus Home
          </ButtonLink>
        </div>
      </Modal>
    </div>
  );
}
