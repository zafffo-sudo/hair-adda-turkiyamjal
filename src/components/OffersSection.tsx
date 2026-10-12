import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { Tag, Crown, Camera, Ticket, Check, ArrowRight, ShieldCheck, Instagram, MessageCircle } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';

export const OffersSection: React.FC = () => {
  const {
    hasMembership,
    activateMembership,
    hasReelCollabDiscount,
    submitReelCollab,
    activeVoucher,
    applyVoucherCode,
    removeVoucher,
  } = useSalon();

  // Reel modal/input state
  const [reelHandle, setReelHandle] = useState('');
  const [reelUrl, setReelUrl] = useState('');
  const [reelSuccess, setReelSuccess] = useState(false);

  // Voucher input state
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherMsg, setVoucherMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;
    const res = applyVoucherCode(voucherInput);
    setVoucherMsg({ text: res.message, isError: !res.success });
    if (res.success) {
      setVoucherInput('');
    }
  };

  const handleReelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelHandle.trim()) return;
    submitReelCollab(reelHandle, reelUrl);
    setReelSuccess(true);
    setTimeout(() => setReelSuccess(false), 4000);
  };

  return (
    <section id="offers" className="py-16 lg:py-20 bg-neutral-950 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <div className="text-amber-400 text-xs font-bold uppercase tracking-wider">
            Special Deals & Perks
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight">
            Exclusive Offers & Privileges
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            Hair Adda par har customer ke liye discounts, annual memberships aur special collaborations uplabdh hain.
          </p>
        </div>

        {/* 3 Main Promotion Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Offer 1: Flat 10% OFF */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">Default Offer</span>
                <h3 className="text-xl font-display font-bold text-neutral-100 mt-1">Flat 10% OFF</h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  Har haircut, styling, facial aur grooming service par automatically bill me 10% off cut hota hai. Koi coupon code ki zaroorat nahi!
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs text-neutral-300 flex items-center justify-between">
              <span>Status: <strong className="text-emerald-400">Always Active</strong></span>
              <span className="text-amber-400 font-medium">Applied at checkout</span>
            </div>
          </div>

          {/* Offer 2: Membership ₹499 */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">VIP Card</span>
                <h3 className="text-xl font-display font-bold text-neutral-100 mt-1">Membership ₹499</h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  15% off on overall bill · 1 full year validity · Valid across all Hair Adda branches. Plus get 50 bonus welcome coins!
                </p>
              </div>
            </div>

            <div>
              {hasMembership ? (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>Active Member (15% Off)</span>
                  </span>
                  <span className="text-neutral-400 font-normal">All Branches</span>
                </div>
              ) : (
                <button
                  onClick={activateMembership}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Activate Membership ₹499</span>
                </button>
              )}
            </div>
          </div>

          {/* Offer 3: Reel Collab */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">Social Reward</span>
                <h3 className="text-xl font-display font-bold text-neutral-100 mt-1">Reel Collab</h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  Salon me haircut karwa kar Instagram reel upload + <strong className="text-neutral-200">@hair.adda__turkayamjal</strong> collaborate karo → Next visit par seedha 15% off!
                </p>
              </div>
            </div>

            {hasReelCollabDiscount ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Reel Collab Verified (15% Off)</span>
                </span>
              </div>
            ) : (
              <form onSubmit={handleReelSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reelHandle}
                    onChange={(e) => setReelHandle(e.target.value)}
                    placeholder="e.g. @your_insta_id"
                    className="flex-1 px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                    required
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    Verify
                  </button>
                </div>
                {reelSuccess && (
                  <p className="text-[11px] text-emerald-400">✓ Reel verified! 15% discount applied + 30 coins added.</p>
                )}
              </form>
            )}
          </div>

        </div>

        {/* Section 4: Vouchers & Owner Verification */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-800">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Ticket className="w-4 h-4" />
                <span>Special Salon Vouchers</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-neutral-100">
                Owner Issued Vouchers
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Vouchers salon me owner issue karta hai (ID verified customers ko). <strong className="text-amber-400">50% discount sirf 2 lucky customers ko</strong> milta hai! Agar aapke paas owner ka voucher code hai, to yahan enter karein.
              </p>
            </div>

            {/* Direct WhatsApp verification link */}
            <a
              href={`${SALON_INFO.whatsappUrl}?text=${encodeURIComponent("Hello Hair Adda Owner, I would like to inquire about the lucky customer 50% voucher and ID verification.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-neutral-200 transition-colors shrink-0"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Request Verification from Owner</span>
            </a>
          </div>

          {/* Voucher Code Form */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7">
              {activeVoucher ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-amber-300">
                      Code applied: <span className="font-mono uppercase">{activeVoucher.code}</span>
                    </div>
                    <div className="text-neutral-400 mt-0.5">{activeVoucher.description}</div>
                  </div>
                  <button
                    onClick={removeVoucher}
                    className="text-neutral-400 hover:text-neutral-200 underline text-xs cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyVoucher} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voucherInput}
                      onChange={(e) => setVoucherInput(e.target.value)}
                      placeholder="Enter Owner Voucher Code (e.g. LUCKY50, VIP50)"
                      className="flex-1 px-4 py-2.5 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-mono uppercase"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                    >
                      Apply Voucher
                    </button>
                  </div>
                  {voucherMsg && (
                    <p className={`text-xs ${voucherMsg.isError ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {voucherMsg.text}
                    </p>
                  )}
                </form>
              )}
            </div>

            <div className="md:col-span-5 text-xs text-neutral-400 space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Verification Policy</span>
              </div>
              <p className="text-[11px] leading-relaxed text-neutral-500">
                50% Vouchers strictly limited to 2 lucky verified customers per month upon salon visit. Demo testing codes: <code className="text-neutral-300 font-mono">LUCKY50</code> or <code className="text-neutral-300 font-mono">HAIRADDA100</code>.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
