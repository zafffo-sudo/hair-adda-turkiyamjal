import React, { createContext, useContext, useState, useEffect } from 'react';
import { ServiceItem, WalletTransaction } from '../data/salonData';

interface VoucherState {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  description: string;
}

interface SalonContextType {
  // Loyalty coins
  coins: number;
  earnCoins: (amount: number, reason: string) => void;
  redeemCoins: (amount: number) => boolean;
  transactions: WalletTransaction[];
  resetDemoData: () => void;
  
  // Membership & Perks
  hasMembership: boolean;
  activateMembership: () => void;
  hasReelCollabDiscount: boolean;
  submitReelCollab: (handle: string, reelUrl: string) => boolean;

  // Vouchers
  activeVoucher: VoucherState | null;
  applyVoucherCode: (code: string) => { success: boolean; message: string };
  removeVoucher: () => void;

  // Cart / Bill Estimator
  cart: ServiceItem[];
  addToCart: (service: ServiceItem) => void;
  removeFromCart: (serviceId: string) => void;
  clearCart: () => void;
  
  // Coin redemption on cart
  useCoinsInBill: boolean;
  setUseCoinsInBill: (val: boolean) => void;

  // Booking Modal
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  selectedServiceForBooking: ServiceItem | null;
  openBookingForService: (service?: ServiceItem) => void;

  // Bill totals
  baseTotal: number;
  flatDiscount: number; // 10%
  membershipDiscount: number; // 15% if active
  reelDiscount: number; // 15% if active
  voucherDiscount: number;
  coinsDeduction: number;
  finalTotal: number;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

const STORAGE_KEY_COINS = 'hair_adda_coins_v1';
const STORAGE_KEY_TXS = 'hair_adda_txs_v1';
const STORAGE_KEY_MEMBERSHIP = 'hair_adda_membership_v1';
const STORAGE_KEY_REEL = 'hair_adda_reel_v1';

export const SalonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial demo balance starts at 120 coins so customer can experience redeeming!
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_COINS);
    return saved !== null ? Number(saved) : 120;
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TXS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'tx-1',
        type: 'credit',
        amount: 70,
        reason: 'Welcome Bonus on Hair Adda Visit',
        timestamp: 'Yesterday, 4:30 PM',
      },
      {
        id: 'tx-2',
        type: 'credit',
        amount: 50,
        reason: 'Salon Visit Haircut & Styling Reward',
        timestamp: 'Today, 11:15 AM',
      },
    ];
  });

  const [hasMembership, setHasMembership] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_MEMBERSHIP) === 'true';
  });

  const [hasReelCollabDiscount, setHasReelCollabDiscount] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_REEL) === 'true';
  });

  const [activeVoucher, setActiveVoucher] = useState<VoucherState | null>(null);
  const [cart, setCart] = useState<ServiceItem[]>([]);
  const [useCoinsInBill, setUseCoinsInBill] = useState<boolean>(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COINS, coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TXS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MEMBERSHIP, hasMembership ? 'true' : 'false');
  }, [hasMembership]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REEL, hasReelCollabDiscount ? 'true' : 'false');
  }, [hasReelCollabDiscount]);

  const earnCoins = (amount: number, reason: string) => {
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'credit',
      amount,
      reason,
      timestamp: 'Just now',
    };
    setCoins(prev => prev + amount);
    setTransactions(prev => [newTx, ...prev]);
  };

  const redeemCoins = (amount: number): boolean => {
    if (coins < 100) return false;
    if (coins < amount) return false;

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'debit',
      amount,
      reason: 'Redeemed against Salon Bill (1 Coin = ₹1)',
      timestamp: 'Just now',
    };
    setCoins(prev => prev - amount);
    setTransactions(prev => [newTx, ...prev]);
    return true;
  };

  const resetDemoData = () => {
    setCoins(120);
    setHasMembership(false);
    setHasReelCollabDiscount(false);
    setActiveVoucher(null);
    setUseCoinsInBill(false);
    const initialTxs: WalletTransaction[] = [
      {
        id: 'tx-1',
        type: 'credit',
        amount: 70,
        reason: 'Welcome Bonus on Hair Adda Visit',
        timestamp: 'Yesterday, 4:30 PM',
      },
      {
        id: 'tx-2',
        type: 'credit',
        amount: 50,
        reason: 'Salon Visit Haircut & Styling Reward',
        timestamp: 'Today, 11:15 AM',
      },
    ];
    setTransactions(initialTxs);
  };

  const activateMembership = () => {
    setHasMembership(true);
    earnCoins(50, 'Crown Member Registration Perk (+50 Coins)');
  };

  const submitReelCollab = (handle: string, _reelUrl: string): boolean => {
    if (!handle.trim()) return false;
    setHasReelCollabDiscount(true);
    earnCoins(30, `Instagram Reel Collab verified (${handle})`);
    return true;
  };

  const applyVoucherCode = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();
    if (clean === 'LUCKY50' || clean === 'VIP50') {
      setActiveVoucher({
        code: clean,
        discountPercent: 50,
        description: 'Lucky Customer 50% OFF (Owner Verified)',
      });
      return { success: true, message: '🎉 50% OFF Lucky Customer voucher applied successfully!' };
    }
    if (clean === 'HAIRADDA100' || clean === 'OWNER100') {
      setActiveVoucher({
        code: clean,
        discountAmount: 100,
        description: 'Owner Special ₹100 Flat Voucher',
      });
      return { success: true, message: '🎉 ₹100 Flat discount voucher applied!' };
    }
    if (clean === 'ADDA15') {
      setActiveVoucher({
        code: clean,
        discountPercent: 15,
        description: 'Turkayamjal Special 15% OFF Voucher',
      });
      return { success: true, message: '🎉 15% OFF Turkayamjal voucher applied!' };
    }

    return {
      success: false,
      message: 'Invalid code. Vouchers salon me owner issue karta hai (ID verified customers ko).',
    };
  };

  const removeVoucher = () => {
    setActiveVoucher(null);
  };

  const addToCart = (service: ServiceItem) => {
    if (!cart.some(s => s.id === service.id)) {
      setCart(prev => [...prev, service]);
    }
  };

  const removeFromCart = (serviceId: string) => {
    setCart(prev => prev.filter(s => s.id !== serviceId));
  };

  const clearCart = () => {
    setCart([]);
    setUseCoinsInBill(false);
  };

  const openBookingForService = (service?: ServiceItem) => {
    if (service) {
      setSelectedServiceForBooking(service);
      addToCart(service);
    }
    setIsBookingModalOpen(true);
  };

  // Pricing calculations
  const baseTotal = cart.reduce((acc, curr) => acc + curr.originalPrice, 0);

  // Flat 10% OFF on all services
  const flatDiscount = Math.round(baseTotal * 0.10);

  // Remaining after flat 10%
  const afterFlat = Math.max(0, baseTotal - flatDiscount);

  // Membership 15% OFF overall bill
  const membershipDiscount = hasMembership ? Math.round(afterFlat * 0.15) : 0;

  // Reel Collab 15% OFF
  const reelDiscount = hasReelCollabDiscount ? Math.round(afterFlat * 0.15) : 0;

  // Voucher discount
  let voucherDiscount = 0;
  if (activeVoucher) {
    if (activeVoucher.discountPercent) {
      voucherDiscount = Math.round(afterFlat * (activeVoucher.discountPercent / 100));
    } else if (activeVoucher.discountAmount) {
      voucherDiscount = Math.min(afterFlat, activeVoucher.discountAmount);
    }
  }

  // Pre-coin balance
  const subTotalAfterDiscounts = Math.max(
    0,
    afterFlat - membershipDiscount - reelDiscount - voucherDiscount
  );

  // Coins redemption: 1 coin = ₹1. Min 100 coins required to use.
  let coinsDeduction = 0;
  if (useCoinsInBill && coins >= 100) {
    coinsDeduction = Math.min(coins, subTotalAfterDiscounts);
  }

  const finalTotal = Math.max(0, subTotalAfterDiscounts - coinsDeduction);

  return (
    <SalonContext.Provider
      value={{
        coins,
        earnCoins,
        redeemCoins,
        transactions,
        resetDemoData,
        hasMembership,
        activateMembership,
        hasReelCollabDiscount,
        submitReelCollab,
        activeVoucher,
        applyVoucherCode,
        removeVoucher,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        useCoinsInBill,
        setUseCoinsInBill,
        isBookingModalOpen,
        setIsBookingModalOpen,
        selectedServiceForBooking,
        openBookingForService,
        baseTotal,
        flatDiscount,
        membershipDiscount,
        reelDiscount,
        voucherDiscount,
        coinsDeduction,
        finalTotal,
      }}
    >
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => {
  const context = useContext(SalonContext);
  if (!context) {
    throw new Error('useSalon must be used within a SalonProvider');
  }
  return context;
};
