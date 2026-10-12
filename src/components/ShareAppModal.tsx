import React, { useState } from 'react';
import { QrCodeRenderer } from './QrCodeRenderer';
import { X, Copy, Check, Share2, Smartphone, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Official Shared & Published App URL
  const appUrl = typeof window !== 'undefined' && window.location.origin.includes('run.app')
    ? window.location.origin
    : 'https://ais-pre-bwqhxr6nzrq474bdvasggp-785350598290.asia-southeast1.run.app';

  const shareText = `✂️ Hair Adda Unisex Salon (${SALON_INFO.branch}) ka official Loyalty & Rewards App install karein!\n🎁 Flat 10% OFF sabhi services par\n🪙 Har visit par reward coins aur monthly #1 prize\n\nAbhi open karein: ${appUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hair Adda Unisex Salon - Loyalty & Rewards App',
          text: `Hair Adda Unisex Salon (${SALON_INFO.branch}) Loyalty & Rewards Pass`,
          url: appUrl,
        });
      } catch (e) {
        // user cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl shadow-2xl p-6 sm:p-7 z-10 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Share2 className="w-3.5 h-3.5" />
            <span>App Publish & Share Link</span>
          </div>
          <h3 className="font-display font-extrabold text-2xl text-white pt-1">
            Hair Adda App Link & QR
          </h3>
          <p className="text-xs text-slate-400">
            Yeh link kisi ko bhi share karein ya QR code scan karwayein — koi bhi direct open aur install kar sakta hai!
          </p>
        </div>

        {/* QR Code Container for Counter Scanning */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-2">
          <QrCodeRenderer value={appUrl} size={180} showCodeText={false} />
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 text-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Phone camera se scan karke direct app open karein</span>
          </span>
        </div>

        {/* Publishable URL Box */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-slate-400">
            Official Live App Link:
          </label>
          <div className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800">
            <input
              type="text"
              readOnly
              value={appUrl}
              className="w-full bg-transparent text-xs text-amber-400 font-mono focus:outline-none select-all px-1"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Share</span>
          </a>

          <button
            onClick={handleNativeShare}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>Share More</span>
          </button>
        </div>

        {/* Installation Instructions for Customers */}
        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80 text-[11px] text-slate-300 space-y-1.5">
          <div className="text-amber-400 font-bold flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Install karne ka aasan tarika:</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Link open karne ke baad browser me <strong>"Install App"</strong> ya <strong>"Add to Home Screen"</strong> par click karein. Yeh app phone par bina Play Store ke fast install ho jati hai!
          </p>
        </div>

      </div>
    </div>
  );
};
