import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { X, Coins, ShieldCheck, Plus, RefreshCw, History, Check } from 'lucide-react';

interface CoinsWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoinsWalletModal: React.FC<CoinsWalletModalProps> = ({ isOpen, onClose }) => {
  const { coins, earnCoins, transactions, resetDemoData } = useSalon();
  const [toast, setToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulate = (amount: number, reason: string) => {
    earnCoins(amount, reason);
    setToast(`+${amount} Coins added!`);
    setTimeout(() => setToast(null), 2500);
  };

  const isEligible = coins >= 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/80 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 overflow-hidden z-10 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-neutral-100">
                Hair Adda Loyalty Wallet
              </h3>
              <p className="text-[11px] text-neutral-400">
                Visit karo, Coins kamao!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800/90 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-400 font-medium">Your Coin Balance</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display font-extrabold text-4xl text-amber-400 tabular-nums font-mono">
                  {coins}
                </span>
                <span className="text-sm font-semibold text-neutral-300">Coins</span>
              </div>
              <div className="text-xs text-neutral-400 mt-1 font-mono">
                1 Coin = ₹1 · Equivalent value ₹{coins}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Coins className="w-6 h-6" />
            </div>
          </div>

          {toast && (
            <div className="mt-3 text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-md flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>{toast}</span>
            </div>
          )}

          {/* Progress bar to 100 */}
          <div className="mt-4 pt-3 border-t border-neutral-800/80 space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-neutral-400">Threshold: 100 coins hone par use karo</span>
              <span className={isEligible ? "text-emerald-400 font-semibold" : "text-amber-400"}>
                {isEligible ? "Eligible to use!" : `${100 - coins} more`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                style={{ width: `${Math.min(100, (coins / 100) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Simulation Actions */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-neutral-300">
            Simulate Earning:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSimulate(25, 'Haircut Visit Recorded (+25 Coins)')}
              className="p-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left text-xs transition-colors flex items-center justify-between cursor-pointer"
            >
              <span className="text-neutral-300">Salon Visit</span>
              <span className="font-semibold text-amber-400">+25</span>
            </button>
            <button
              onClick={() => handleSimulate(50, 'Reel Collab Bonus (+50 Coins)')}
              className="p-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left text-xs transition-colors flex items-center justify-between cursor-pointer"
            >
              <span className="text-neutral-300">Reel Collab</span>
              <span className="font-semibold text-amber-400">+50</span>
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-300">
            <span className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>Activity History</span>
            </span>
            <button
              onClick={resetDemoData}
              className="text-neutral-500 hover:text-neutral-300 flex items-center gap-1 text-[11px] font-normal cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
            {transactions.map(t => (
              <div
                key={t.id}
                className="p-2 rounded-lg bg-neutral-950 border border-neutral-800/60 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="text-neutral-300 font-medium text-[11px]">{t.reason}</div>
                  <div className="text-[10px] text-neutral-500">{t.timestamp}</div>
                </div>
                <div
                  className={`font-mono font-bold text-xs ${
                    t.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {t.type === 'credit' ? `+${t.amount}` : `-${t.amount}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Notice */}
        <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center gap-2 text-[11px] text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Demo mode – data sirf is device me save hota hai.</span>
        </div>

      </div>
    </div>
  );
};
