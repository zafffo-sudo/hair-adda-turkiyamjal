import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { Coins, Sparkles, CheckCircle2, ArrowUpRight, History, Info, RefreshCw, PlusCircle, Check } from 'lucide-react';

export const LoyaltySection: React.FC = () => {
  const { coins, earnCoins, transactions, resetDemoData } = useSalon();
  const [justEarned, setJustEarned] = useState<string | null>(null);

  const handleEarn = (amount: number, reason: string) => {
    earnCoins(amount, reason);
    setJustEarned(`+${amount} Coins!`);
    setTimeout(() => setJustEarned(null), 2500);
  };

  const isEligible = coins >= 100;

  return (
    <section id="coins" className="py-16 lg:py-20 bg-neutral-900/60 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
          <div className="text-amber-400 text-xs font-bold uppercase tracking-wider">
            Hair Adda Rewards
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight">
            Visit karo, Coins kamao!
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            Har salon visit par reward coins earn karo. <strong className="text-amber-400">1 Coin = ₹1</strong> · Minimum 100 coins hone par next billing par seedha discount pay karo.
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs text-neutral-400 bg-neutral-950/80 px-3 py-1.5 rounded-lg border border-neutral-800">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Demo mode – data sirf is device me save hota hai.</span>
          </div>
        </div>

        {/* Loyalty Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Card 1: Live Coin Wallet Status */}
          <div className="lg:col-span-5 bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-neutral-800 p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-semibold text-neutral-400">
                Your Demo Wallet
              </span>
              <button
                onClick={resetDemoData}
                className="text-xs text-neutral-500 hover:text-neutral-300 flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset local balance to initial 120 coins"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Demo</span>
              </button>
            </div>

            {/* Coin Big Display */}
            <div className="p-5 rounded-xl bg-neutral-950/90 border border-neutral-800/90 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-neutral-400">Available Balance</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display font-extrabold text-4xl sm:text-5xl text-amber-400 tabular-nums">
                      {coins}
                    </span>
                    <span className="text-lg font-medium text-neutral-300">Coins</span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-1 font-mono">
                    Worth ₹{coins} directly off your bill
                  </div>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Coins className="w-8 h-8" />
                </div>
              </div>

              {justEarned && (
                <div className="absolute top-3 right-3 text-xs font-bold text-emerald-400 bg-emerald-950/90 border border-emerald-800 px-2.5 py-1 rounded-md animate-fade-in flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{justEarned}</span>
                </div>
              )}
            </div>

            {/* Threshold Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Redemption Status (100 coins min)</span>
                <span className={isEligible ? "text-emerald-400 font-semibold" : "text-amber-400 font-medium"}>
                  {isEligible ? "Ready to redeem!" : `${100 - coins} coins needed`}
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, (coins / 100) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-neutral-400">
                {isEligible
                  ? "✓ Aapke paas 100 se zyada coins hain! Bill checkout me seedha apply kar sakte hain."
                  : "100 coins complete hote hi aap bill par instant ₹100+ bachat kar sakte hain."}
              </p>
            </div>

            {/* How to Earn Simulator */}
            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-semibold text-neutral-300">
                Test / Earn Demo Coins:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => handleEarn(25, 'Haircut & Styling Visit (+25 Coins)')}
                  className="p-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800/90 border border-neutral-800 text-left text-xs text-neutral-200 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Salon Visit Kiya</span>
                  <span className="font-semibold text-amber-400">+25</span>
                </button>
                <button
                  onClick={() => handleEarn(50, 'Friend Referral Visit (+50 Coins)')}
                  className="p-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800/90 border border-neutral-800 text-left text-xs text-neutral-200 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Friend Ko Bheja</span>
                  <span className="font-semibold text-amber-400">+50</span>
                </button>
              </div>
            </div>

          </div>

          {/* Card 2: Transactions & How it Works */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 3 Step Rule Guide */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                <div className="text-amber-400 font-bold text-xs uppercase tracking-wider">Step 1</div>
                <div className="text-sm font-semibold text-neutral-100">Salon Visit Karo</div>
                <p className="text-xs text-neutral-400">Haircut, beard, facial ya spa karwaye aur billing par phone number share karein.</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                <div className="text-amber-400 font-bold text-xs uppercase tracking-wider">Step 2</div>
                <div className="text-sm font-semibold text-neutral-100">Coins Kamao</div>
                <p className="text-xs text-neutral-400">Har visit aur special reel uploads par coins account me add hote hain.</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                <div className="text-amber-400 font-bold text-xs uppercase tracking-wider">Step 3</div>
                <div className="text-sm font-semibold text-neutral-100">100 Coins = ₹100 Off</div>
                <p className="text-xs text-neutral-400">100 coins bante hi agle visit ke overall bill me seedha paisa cut ho jata hai.</p>
              </div>
            </div>

            {/* Transaction Ledger */}
            <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-800/80">
                <div className="flex items-center gap-1.5 font-semibold text-neutral-200">
                  <History className="w-3.5 h-3.5 text-amber-400" />
                  <span>Recent Coins Activity</span>
                </div>
                <span className="text-neutral-500 text-[11px]">Local Demo Ledger</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/50 text-xs"
                  >
                    <div>
                      <div className="text-neutral-200 font-medium">{tx.reason}</div>
                      <div className="text-[11px] text-neutral-500">{tx.timestamp}</div>
                    </div>
                    <div
                      className={`font-mono font-bold ${
                        tx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {tx.type === 'credit' ? `+${tx.amount}` : `-${tx.amount}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
