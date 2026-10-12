import React from 'react';
import { useSalon } from '../context/SalonContext';
import { X, Trash2, Coins, Crown, Camera, Sparkles, Tag, ArrowRight } from 'lucide-react';

interface BillCalculatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToBook: () => void;
}

export const BillCalculatorDrawer: React.FC<BillCalculatorDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToBook,
}) => {
  const {
    cart,
    removeFromCart,
    clearCart,
    coins,
    useCoinsInBill,
    setUseCoinsInBill,
    hasMembership,
    hasReelCollabDiscount,
    activeVoucher,
    baseTotal,
    flatDiscount,
    membershipDiscount,
    reelDiscount,
    voucherDiscount,
    coinsDeduction,
    finalTotal,
  } = useSalon();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-neutral-900 border-l border-neutral-800 h-full flex flex-col shadow-2xl z-10 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-neutral-100">
              Estimated Bill & Services
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Live estimate with discounts & coins
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close bill drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Selected Services List */}
          {cart.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                <Tag className="w-6 h-6" />
              </div>
              <div className="text-sm font-semibold text-neutral-300">
                No services selected yet
              </div>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Explore our menu to add haircuts, beard styling, spa, or facials to calculate your final bill.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                <span>Selected Items ({cart.length})</span>
                <button
                  onClick={clearCart}
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1 normal-case font-normal cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>

              <div className="space-y-2">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-neutral-200 truncate">{item.name}</div>
                      <div className="text-neutral-500 text-[11px] mt-0.5">{item.duration}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-neutral-400 line-through text-[11px] font-mono">
                        ₹{item.originalPrice}
                      </div>
                      <div className="text-amber-400 font-bold font-mono">
                        ₹{Math.round(item.originalPrice * 0.9)}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Applied Discounts & Toggles */}
          {cart.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <div className="text-xs font-semibold text-neutral-300">
                Rewards & Discount Options:
              </div>

              {/* Coin redemption toggle */}
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs font-semibold text-neutral-200">
                        Use Loyalty Coins
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Balance: <span className="font-mono text-amber-400">{coins} coins</span> (1 Coin = ₹1)
                      </div>
                    </div>
                  </div>

                  {coins >= 100 ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useCoinsInBill}
                        onChange={(e) => setUseCoinsInBill(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
                    </label>
                  ) : (
                    <span className="text-[10px] text-neutral-500 font-medium">
                      Min 100 required
                    </span>
                  )}
                </div>
                {coins < 100 && (
                  <p className="text-[10px] text-neutral-500">
                    100 coins hone par use karo. Salon visit karne par aur coins add honge.
                  </p>
                )}
              </div>

              {/* Membership Status Badge */}
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold text-neutral-200">Membership (15% OFF)</div>
                    <div className="text-[11px] text-neutral-500">
                      {hasMembership ? 'Active VIP Member' : '₹499 / 1 yr across all branches'}
                    </div>
                  </div>
                </div>
                <span className={hasMembership ? 'text-emerald-400 font-semibold' : 'text-neutral-500'}>
                  {hasMembership ? 'Applied (-15%)' : 'Inactive'}
                </span>
              </div>

              {/* Reel Collab Status */}
              {hasReelCollabDiscount && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>Reel Collab Perk (15% OFF)</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">Active</span>
                </div>
              )}

              {/* Active Voucher Status */}
              {activeVoucher && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-center justify-between text-xs">
                  <div className="text-amber-300">
                    <div className="font-semibold">{activeVoucher.code} applied</div>
                    <div className="text-[10px] text-amber-400/80">{activeVoucher.description}</div>
                  </div>
                  <span className="text-amber-400 font-semibold">Applied</span>
                </div>
              )}

            </div>
          )}

          {/* Transparent Itemized Price Breakdown */}
          {cart.length > 0 && (
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Standard Services Total</span>
                <span className="font-mono tabular-nums">₹{baseTotal}</span>
              </div>

              <div className="flex justify-between text-emerald-400">
                <span>🎁 Flat 10% OFF</span>
                <span className="font-mono tabular-nums">-₹{flatDiscount}</span>
              </div>

              {membershipDiscount > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>👑 Membership Discount (15%)</span>
                  <span className="font-mono tabular-nums">-₹{membershipDiscount}</span>
                </div>
              )}

              {reelDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>📸 Reel Collab Discount (15%)</span>
                  <span className="font-mono tabular-nums">-₹{reelDiscount}</span>
                </div>
              )}

              {voucherDiscount > 0 && (
                <div className="flex justify-between text-amber-300">
                  <span>🎫 Voucher Discount</span>
                  <span className="font-mono tabular-nums">-₹{voucherDiscount}</span>
                </div>
              )}

              {coinsDeduction > 0 && (
                <div className="flex justify-between text-amber-400 font-medium">
                  <span>🪙 Coins Redeemed ({coinsDeduction} coins)</span>
                  <span className="font-mono tabular-nums">-₹{coinsDeduction}</span>
                </div>
              )}

              <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold text-neutral-100">
                <span>Final Payable Amount</span>
                <span className="text-amber-400 text-base font-mono tabular-nums">₹{finalTotal}</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-neutral-800 bg-neutral-950/80 space-y-2">
          {cart.length > 0 ? (
            <button
              onClick={() => {
                onClose();
                onProceedToBook();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <span>Book Appointment & Confirm</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-neutral-800 text-neutral-200 font-semibold text-xs transition-colors cursor-pointer"
            >
              Back to Services
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
