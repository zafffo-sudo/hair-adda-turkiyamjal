import React, { useEffect, useState } from 'react';
import { CustomerDashboardData, MonthlyPrize } from '../types';
import { api } from '../services/api';
import { QrCodeRenderer } from './QrCodeRenderer';
import { CustomerQrModal } from './CustomerQrModal';
import { PrizeClaimModal } from './PrizeClaimModal';
import {
  Coins,
  TrendingUp,
  Trophy,
  ShoppingBag,
  Sparkles,
  QrCode,
  Calendar,
  Gift,
  CheckCircle2,
  AlertCircle,
  Receipt,
  ArrowUpRight,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const [data, setData] = useState<CustomerDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [selectedPrizeToClaim, setSelectedPrizeToClaim] = useState<MonthlyPrize | null>(null);

  const fetchDashboard = () => {
    setLoading(true);
    api.getCustomerDashboard()
      .then(res => {
        setData(res);
        setError(null);
      })
      .catch(err => {
        setError(err.message || 'Failed to load dashboard data');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading && !data) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading your loyalty rewards...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-24 text-center space-y-3 max-w-md mx-auto px-4">
        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
        <p className="text-sm text-slate-200">{error || 'Unable to fetch dashboard'}</p>
        <button
          onClick={fetchDashboard}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  const { customer, progressToTier1, progressToTier2, purchases, activePrizeClaims } = data;
  const unclaimedPrize = activePrizeClaims.find(p => p.status === 'unclaimed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Prize Winner Alert Card (if customer won #1 prize!) */}
      {unclaimedPrize && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-slate-900 border border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-400 text-slate-950 shrink-0 shadow-lg shadow-amber-400/20">
              <Trophy className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
                <span>Monthly #1 Winner Alert</span>
              </div>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                You won ₹{unclaimedPrize.prizeAmount} for {unclaimedPrize.monthLabel}!
              </h2>
              <p className="text-xs text-slate-300">
                Claim Code: <span className="font-mono text-amber-400 font-bold">{unclaimedPrize.claimCode}</span> · Redeem at shop counter
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedPrizeToClaim(unclaimedPrize)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 shrink-0 whitespace-nowrap"
          >
            <Gift className="w-4 h-4" />
            <span>Show Claim QR Code</span>
          </button>
        </div>
      )}

      {/* Hero Welcome & Top Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Customer Identity Card with QR (4 cols) */}
        <div className="lg:col-span-4 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400/90 block">
                  Loyalty Pass
                </span>
                <span className="font-mono text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20 px-2 py-0.5 rounded">
                  {customer.customerIdCode || `HA-ID-${customer.mobile.slice(-4)}`}
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-white mt-1">
                {customer.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                +91 {customer.mobile}
              </p>

              {/* Verification Status Badge */}
              <div className="mt-2">
                {customer.verificationStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>ID Verified · Active Member</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>ID Pending Salon Verification</span>
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsQrModalOpen(true)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors cursor-pointer"
              title="Expand QR Code"
            >
              <QrCode className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive QR Display */}
          <div
            onClick={() => setIsQrModalOpen(true)}
            className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center cursor-pointer hover:border-amber-400/40 transition-all group"
          >
            <QrCodeRenderer value={customer.qrCode} size={150} showCodeText={true} />
            <span className="text-[10px] text-slate-400 group-hover:text-amber-400 font-medium mt-2 flex items-center gap-1 transition-colors">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Tap to show full-screen QR at counter</span>
            </span>
          </div>

          {/* Rank Badge */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Monthly Ranking:</span>
            <div className="flex items-center gap-1.5 font-bold">
              {data.currentRank ? (
                <>
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-400 font-mono">Rank #{data.currentRank}</span>
                </>
              ) : (
                <span className="text-slate-500">Unranked this month</span>
              )}
            </div>
          </div>
        </div>

        {/* Financial Metrics & Coins (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Metric 1: Monthly Spend */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>This Month ({data.currentMonthLabel})</span>
                <Calendar className="w-4 h-4 text-amber-400" />
              </div>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-white font-mono tabular-nums">
                ₹{data.currentMonthSpend.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400">
                Counted towards monthly reward tiers
              </div>
            </div>

            {/* Metric 2: Coins Balance */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Available Coins</span>
                <Coins className="w-4 h-4 text-amber-400" />
              </div>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-amber-400 font-mono tabular-nums">
                {data.totalCoins}
              </div>
              <div className="text-[11px] text-slate-400">
                Earned from monthly spend milestones
              </div>
            </div>

            {/* Metric 3: Total Lifetime Spend */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Lifetime Spending</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-white font-mono tabular-nums">
                ₹{data.totalLifetimeSpend.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400">
                Across {purchases.length} total visits
              </div>
            </div>

          </div>

          {/* Reward Milestones Progress Module */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  Monthly Reward Milestones
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track your monthly spending progress towards instant coin rewards
                </p>
              </div>
              <span className="text-xs text-amber-400 font-semibold font-mono">
                {data.currentMonthLabel}
              </span>
            </div>

            <div className="space-y-5">
              
              {/* Tier 1: ₹5,000 = 250 coins */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Tier 1: ₹5,000 Spend</span>
                    <span className="text-amber-400 font-mono font-semibold">→ 250 Coins</span>
                  </div>
                  <span className={progressToTier1.achieved ? "text-emerald-400 font-bold" : "text-slate-400 font-mono"}>
                    {progressToTier1.achieved
                      ? "✓ Tier 1 Unlocked (+250 Coins)"
                      : `₹${Math.max(0, 5000 - data.currentMonthSpend).toLocaleString('en-IN')} remaining`}
                  </span>
                </div>

                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                    style={{ width: `${progressToTier1.percent}%` }}
                  />
                </div>
              </div>

              {/* Tier 2: ₹10,000 = 600 coins total */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Tier 2: ₹10,000 Spend</span>
                    <span className="text-amber-400 font-mono font-semibold">→ 600 Coins Total</span>
                  </div>
                  <span className={progressToTier2.achieved ? "text-emerald-400 font-bold" : "text-slate-400 font-mono"}>
                    {progressToTier2.achieved
                      ? "✓ Tier 2 Master Achieved (+600 Coins)"
                      : `₹${Math.max(0, 10000 - data.currentMonthSpend).toLocaleString('en-IN')} remaining`}
                  </span>
                </div>

                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressToTier2.percent}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Purchase History Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-display font-bold text-lg text-white">
              Full Purchase & Bill History
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified in-store receipts and recorded bills
            </p>
          </div>
          <span className="text-xs text-slate-400">
            {purchases.length} Recorded Bills
          </span>
        </div>

        {purchases.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No bills recorded yet. Visit the shop counter and present your QR code to record your first purchase!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Bill Number</th>
                  <th className="py-3 px-3">Items / Notes</th>
                  <th className="py-3 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {purchases.map(p => (
                  <tr key={p.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(p.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-amber-400">
                      {p.billNumber}
                    </td>
                    <td className="py-3.5 px-3 text-slate-200">
                      {p.items}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-white text-sm">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <CustomerQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        customer={customer}
      />

      {selectedPrizeToClaim && (
        <PrizeClaimModal
          isOpen={true}
          onClose={() => setSelectedPrizeToClaim(null)}
          prize={selectedPrizeToClaim}
        />
      )}

    </div>
  );
};
