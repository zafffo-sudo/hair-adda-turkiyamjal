import React from 'react';
import { MonthlyPrize } from '../types';
import { QrCodeRenderer } from './QrCodeRenderer';
import { X, Trophy, CheckCircle2, Store, Gift } from 'lucide-react';

interface PrizeClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  prize: MonthlyPrize;
}

export const PrizeClaimModal: React.FC<PrizeClaimModalProps> = ({ isOpen, onClose, prize }) => {
  if (!isOpen) return null;

  const isClaimed = prize.status === 'claimed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/50 rounded-2xl shadow-2xl p-6 overflow-hidden z-10 space-y-5 text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy Header */}
        <div className="space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-500/10">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-widest pt-2">
            Monthly #1 Champion Reward
          </div>
          <h3 className="font-display font-extrabold text-2xl text-slate-100">
            ₹{prize.prizeAmount} Prize Claim
          </h3>
          <p className="text-xs text-slate-300">
            Winner: <strong className="text-white">{prize.winnerName}</strong> ({prize.monthLabel})
          </p>
        </div>

        {/* Claim Status Badge */}
        <div className="flex justify-center">
          {isClaimed ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Prize Already Redeemed</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400 animate-pulse">
              <Gift className="w-3.5 h-3.5" />
              <span>Ready to Redeem at Shop</span>
            </span>
          )}
        </div>

        {/* Prize Claim QR Code */}
        <div className="py-1 flex justify-center">
          <QrCodeRenderer value={prize.claimCode} size={210} showCodeText={true} />
        </div>

        {/* Instructions */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold text-xs">
            <Store className="w-4 h-4 text-amber-400" />
            <span>How to Claim at the Shop:</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Dukan ke counter par ye QR code ya Claim Code <strong className="text-amber-400 font-mono">{prize.claimCode}</strong> owner ko dikhayein aur ₹{prize.prizeAmount} cash ya bill discount prapt karein.
          </p>
          {isClaimed && prize.claimedAt && (
            <div className="text-[10px] text-emerald-400 pt-1 border-t border-slate-800">
              ✓ Verified & claimed on {new Date(prize.claimedAt).toLocaleDateString('en-IN')}.
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
        >
          Close
        </button>

      </div>
    </div>
  );
};
