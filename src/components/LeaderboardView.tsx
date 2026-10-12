import React, { useEffect, useState } from 'react';
import { LeaderboardEntry, MonthlyPrize } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trophy, Medal, Crown, Calendar, Sparkles, CheckCircle2, Gift, AlertCircle, RefreshCw } from 'lucide-react';
import { PrizeClaimModal } from './PrizeClaimModal';

export const LeaderboardView: React.FC = () => {
  const { user, isOwner } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [availableMonths, setAvailableMonths] = useState<Array<{ key: string; label: string; isCurrent: boolean }>>([]);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [monthPrize, setMonthPrize] = useState<MonthlyPrize | null>(null);
  const [monthLabel, setMonthLabel] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [claimModalPrize, setClaimModalPrize] = useState<MonthlyPrize | null>(null);
  const [finalizing, setFinalizing] = useState<boolean>(false);
  const [finalizeSuccess, setFinalizeSuccess] = useState<string | null>(null);

  const fetchLeaderboard = (monthKey?: string) => {
    setLoading(true);
    api.getLeaderboard(monthKey)
      .then(res => {
        setEntries(res.entries);
        setAvailableMonths(res.availableMonths);
        setMonthPrize(res.monthPrize);
        setMonthLabel(res.monthLabel);
        if (!selectedMonth) {
          setSelectedMonth(res.monthKey);
        }
        setError(null);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch leaderboard');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeaderboard(selectedMonth);
  }, [selectedMonth]);

  const handleMonthChange = (key: string) => {
    setSelectedMonth(key);
  };

  const handleFinalizeMonth = async () => {
    if (!selectedMonth) return;
    setFinalizing(true);
    setFinalizeSuccess(null);
    try {
      const res = await api.finalizeMonth(selectedMonth);
      setFinalizeSuccess(res.message);
      fetchLeaderboard(selectedMonth);
    } catch (err: any) {
      alert(err.message || 'Failed to finalize month');
    } finally {
      setFinalizing(false);
    }
  };

  const top3 = entries.slice(0, 3);
  const otherRanks = entries.slice(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Month Selector */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Trophy className="w-3.5 h-3.5" />
            <span>Monthly Spender Rankings</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Leaderboard & ₹200 Winner
          </h2>
          <p className="text-xs text-slate-400">
            Monthly spend resets each month · Top spender (#1) wins ₹200 in-store prize!
          </p>
        </div>

        {/* Month Selector Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {availableMonths.map(m => (
              <button
                key={m.key}
                onClick={() => handleMonthChange(m.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  selectedMonth === m.key
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m.label} {m.isCurrent && '(Active)'}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchLeaderboard(selectedMonth)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Refresh Leaderboard"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {finalizeSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{finalizeSuccess}</span>
        </div>
      )}

      {/* Prize / Winner Card Banner */}
      {monthPrize ? (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl shrink-0 shadow-lg shadow-amber-400/20">
              👑
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Official {monthPrize.monthLabel} Winner
              </div>
              <h3 className="font-display font-extrabold text-xl text-white">
                {monthPrize.winnerName} won ₹{monthPrize.prizeAmount}!
              </h3>
              <p className="text-xs text-slate-300">
                Status:{' '}
                <strong className={monthPrize.status === 'claimed' ? 'text-emerald-400' : 'text-amber-400'}>
                  {monthPrize.status === 'claimed' ? '✓ Claimed at shop' : 'Unclaimed · Ready to redeem'}
                </strong>{' '}
                · Claim Code: <code className="font-mono text-amber-400 font-bold">{monthPrize.claimCode}</code>
              </p>
            </div>
          </div>

          {/* If user is the winner or owner */}
          {(user?.id === monthPrize.winnerCustomerId || isOwner) && (
            <button
              onClick={() => setClaimModalPrize(monthPrize)}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
            >
              <Gift className="w-4 h-4" />
              <span>View Prize Claim Pass</span>
            </button>
          )}
        </div>
      ) : isOwner ? (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-300">
            Prize for <strong className="text-white">{monthLabel}</strong> has not been locked yet.
          </div>
          <button
            onClick={handleFinalizeMonth}
            disabled={finalizing}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {finalizing ? 'Finalizing...' : `Finalize & Award ₹200 to #1`}
          </button>
        </div>
      ) : null}

      {/* Top 3 Podium Cards */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {top3.map((entry, idx) => {
            const isRank1 = entry.rank === 1;
            const isRank2 = entry.rank === 2;
            const isRank3 = entry.rank === 3;

            return (
              <div
                key={entry.customerId}
                className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 shadow-xl transition-all relative overflow-hidden ${
                  isRank1
                    ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/50 hover:border-amber-400'
                    : 'bg-slate-900/90 border-slate-800'
                } ${entry.isCurrentUser ? 'ring-2 ring-amber-400' : ''}`}
              >
                {/* Crown / Rank Icon */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-base ${
                      isRank1
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                        : isRank2
                        ? 'bg-slate-300 text-slate-950'
                        : 'bg-amber-700 text-white'
                    }`}
                  >
                    {isRank1 ? '👑' : isRank2 ? '🥈' : '🥉'}
                  </div>

                  <span
                    className={`text-xs font-bold font-mono px-2.5 py-1 rounded-full ${
                      isRank1
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Rank #{entry.rank}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-lg text-white">
                      {entry.customerName}
                    </h3>
                    {entry.isCurrentUser && (
                      <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.5 rounded">
                        YOU
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    +91 {entry.customerMobile.slice(0, 3)}****{entry.customerMobile.slice(7)}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-baseline justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      Monthly Spend
                    </div>
                    <div className="font-display font-extrabold text-xl text-white font-mono tabular-nums">
                      ₹{entry.monthlySpend.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      Coins Earned
                    </div>
                    <div className="font-mono font-bold text-amber-400 text-base tabular-nums">
                      +{entry.coinsEarned}
                    </div>
                  </div>
                </div>

                {isRank1 && (
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center text-xs text-amber-300 font-bold">
                    🏆 Current #1 Leader (Wins ₹200 Prize)
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Remaining Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-display font-bold text-base text-white">
            Complete Rankings Table ({monthLabel})
          </h3>
          <span className="text-xs text-slate-400">
            {entries.length} Customers Ranked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Customer Name</th>
                <th className="py-3 px-3">Mobile</th>
                <th className="py-3 px-3 text-right">Monthly Spend (₹)</th>
                <th className="py-3 px-3 text-right">Coins Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {entries.map(entry => (
                <tr
                  key={entry.customerId}
                  className={`hover:bg-slate-950/40 transition-colors ${
                    entry.isCurrentUser ? 'bg-amber-500/5' : ''
                  }`}
                >
                  <td className="py-3.5 px-3 font-mono font-bold">
                    <span
                      className={`inline-block w-6 text-center ${
                        entry.rank === 1
                          ? 'text-amber-400 font-extrabold'
                          : entry.rank === 2
                          ? 'text-slate-300'
                          : entry.rank === 3
                          ? 'text-amber-600'
                          : 'text-slate-500'
                      }`}
                    >
                      #{entry.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-white">
                    <div className="flex items-center gap-1.5">
                      <span>{entry.customerName}</span>
                      {entry.isCurrentUser && (
                        <span className="text-[9px] bg-amber-400 text-slate-950 font-bold px-1 rounded">
                          YOU
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 font-mono">
                    +91 {entry.customerMobile.slice(0, 3)}****{entry.customerMobile.slice(7)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                    ₹{entry.monthlySpend.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-semibold text-amber-400">
                    +{entry.coinsEarned}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {claimModalPrize && (
        <PrizeClaimModal
          isOpen={true}
          onClose={() => setClaimModalPrize(null)}
          prize={claimModalPrize}
        />
      )}

    </div>
  );
};
