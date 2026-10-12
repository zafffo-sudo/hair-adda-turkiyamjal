import React, { useEffect, useState } from 'react';
import { MonthlyPrize } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trophy, Gift, CheckCircle2, Clock, Store, AlertCircle } from 'lucide-react';
import { PrizeClaimModal } from './PrizeClaimModal';

export const PrizesView: React.FC = () => {
  const { user, isOwner } = useAuth();
  const [prizes, setPrizes] = useState<MonthlyPrize[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPrize, setSelectedPrize] = useState<MonthlyPrize | null>(null);

  useEffect(() => {
    setLoading(true);
    api.getPrizes()
      .then(res => setPrizes(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
          <Trophy className="w-4 h-4" />
          <span>Shop Rewards & In-Store Prizes</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl text-white">
          Monthly ₹200 Champion Prizes
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Har mahine dukan ka sabse zyada khareedari karne wala <strong className="text-amber-400">#1 customer ₹200 jeetta hai</strong>! Ye prize dukan par unique QR code ya claim code dikha kar cash ya bill discount me redeem kiya ja sakta hai.
        </p>
      </div>

      {/* Prize Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prizes.map(prize => {
          const isWinner = user?.id === prize.winnerCustomerId;
          const isClaimed = prize.status === 'claimed';

          return (
            <div
              key={prize.id}
              className={`p-6 rounded-3xl border flex flex-col justify-between space-y-5 shadow-xl transition-all ${
                isWinner
                  ? 'bg-gradient-to-b from-amber-950/30 via-slate-900 to-slate-950 border-amber-500/50'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    {prize.monthLabel}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isClaimed
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                    }`}
                  >
                    {isClaimed ? '✓ Claimed at Shop' : 'Ready to Redeem'}
                  </span>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">
                    #1 Spender Winner
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mt-0.5">
                    {prize.winnerName}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    +91 {prize.winnerMobile}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Prize Amount:</span>
                  <span className="font-display font-extrabold text-xl text-amber-400 font-mono">
                    ₹{prize.prizeAmount}
                  </span>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <div className="text-[11px]">
                    Claim Code: <code className="font-mono text-amber-400 font-bold">{prize.claimCode}</code>
                  </div>
                  {prize.notes && (
                    <div className="text-[11px] text-slate-500">{prize.notes}</div>
                  )}
                </div>
              </div>

              <div>
                {(isWinner || isOwner) ? (
                  <button
                    onClick={() => setSelectedPrize(prize)}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Gift className="w-4 h-4" />
                    <span>View Digital Claim Pass</span>
                  </button>
                ) : (
                  <div className="text-[11px] text-center text-slate-500">
                    Redeemable only by winner or verified by owner
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedPrize && (
        <PrizeClaimModal
          isOpen={true}
          onClose={() => setSelectedPrize(null)}
          prize={selectedPrize}
        />
      )}

    </div>
  );
};
