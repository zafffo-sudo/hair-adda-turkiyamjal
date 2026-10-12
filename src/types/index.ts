export type UserRole = 'customer' | 'owner';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  mobile: string;
  qrCode: string; // Unique string encoded in QR (e.g. HA-CUST-9876543210)
  customerIdCode: string; // Formatted customer ID e.g. HA-ID-1001
  verificationStatus: VerificationStatus;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  lastLogin?: string | null;
  createdAt: string;
}

export interface Purchase {
  id: string;
  customerId: string;
  customerMobile: string;
  customerName: string;
  billNumber: string;
  amount: number;
  items: string;
  date: string; // ISO date string
  monthKey: string; // 'YYYY-MM'
  addedBy: string;
}

export interface LeaderboardEntry {
  rank: number;
  customerId: string;
  customerName: string;
  customerMobile: string;
  monthlySpend: number;
  coinsEarned: number;
  verificationStatus?: VerificationStatus;
  isCurrentUser?: boolean;
}

export interface MonthlyPrize {
  id: string;
  monthKey: string; // e.g. '2026-09'
  monthLabel: string; // e.g. 'September 2026'
  winnerCustomerId: string;
  winnerName: string;
  winnerMobile: string;
  prizeAmount: number; // 200
  claimCode: string; // e.g. CLAIM-SEP26-7X9Y
  claimQr: string;
  status: 'unclaimed' | 'claimed';
  claimedAt?: string | null;
  claimedBillNumber?: string | null;
  notes?: string;
}

export interface CustomerDashboardData {
  customer: User;
  totalLifetimeSpend: number;
  currentMonthSpend: number;
  totalCoins: number;
  currentMonthCoins: number;
  progressToTier1: {
    target: number; // 5000
    current: number;
    percent: number;
    reward: number; // 250
    achieved: boolean;
  };
  progressToTier2: {
    target: number; // 10000
    current: number;
    percent: number;
    reward: number; // 600
    achieved: boolean;
  };
  currentRank: number | null;
  purchases: Purchase[];
  activePrizeClaims: MonthlyPrize[];
  currentMonthKey: string;
  currentMonthLabel: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  mobile: string;
  qrCode: string;
  customerIdCode: string;
  verificationStatus: VerificationStatus;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  createdAt: string;
  lastLogin?: string | null;
  totalSpend: number;
  monthSpend: number;
  coins: number;
  purchaseCount: number;
  lastVisit: string;
}

export interface OwnerDashboardData {
  totalRevenueThisMonth: number;
  totalRevenueLifetime: number;
  totalTransactionsThisMonth: number;
  totalCustomers: number;
  totalCoinsIssued: number;
  unclaimedPrizesCount: number;
  pendingVerificationCount: number;
  currentMonthKey: string;
  currentMonthLabel: string;
  recentPurchases: Purchase[];
  customers: CustomerRecord[];
}
