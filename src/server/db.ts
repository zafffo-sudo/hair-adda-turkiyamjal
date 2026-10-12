import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { User, Purchase, LeaderboardEntry, MonthlyPrize, CustomerRecord, VerificationStatus } from '../types/index.ts';

export interface DBUser extends User {
  passwordHash: string;
  salt: string;
}

export interface DBSchema {
  users: DBUser[];
  purchases: Purchase[];
  prizes: MonthlyPrize[];
  archivedMonths: string[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DB_DIR, 'dukandb.json');

// Password security functions
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: generatedSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const checkHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return checkHash === hash;
}

// Convert DBUser to safe User payload (Stripping passwordHash and salt)
export function toSafeUser(u: DBUser): User {
  return {
    id: u.id,
    role: u.role,
    name: u.name,
    mobile: u.mobile,
    qrCode: u.qrCode,
    customerIdCode: u.customerIdCode || `HA-ID-${u.mobile.slice(-4)}`,
    verificationStatus: u.verificationStatus || 'pending',
    verifiedAt: u.verifiedAt || null,
    verifiedBy: u.verifiedBy || null,
    lastLogin: u.lastLogin || null,
    createdAt: u.createdAt,
  };
}

// Reward Coin Calculation:
// Monthly spending of ₹5,000 earns 250 coins; ₹10,000 earns 600 coins total.
export function calculateMonthlyCoins(monthlySpend: number): number {
  if (monthlySpend >= 10000) {
    const extraThousands = Math.floor((monthlySpend - 10000) / 1000);
    return 600 + extraThousands * 50;
  }
  if (monthlySpend >= 5000) {
    const extraThousands = Math.floor((monthlySpend - 5000) / 1000);
    return 250 + extraThousands * 50;
  }
  return Math.floor(monthlySpend / 50);
}

export function getCurrentMonthKey(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
}

function createInitialSeed(): DBSchema {
  const ownerPass = hashPassword('owner123');
  const custPass = hashPassword('customer123');

  const users: DBUser[] = [
    {
      id: 'usr_owner_1',
      role: 'owner',
      name: 'Hair Adda Owner (Turkayamjal)',
      mobile: '7287819072',
      qrCode: 'HA-OWNER-7287819072',
      customerIdCode: 'HA-ADMIN-01',
      verificationStatus: 'verified',
      verifiedAt: '2026-08-01T10:00:00.000Z',
      verifiedBy: 'SYSTEM',
      lastLogin: new Date().toISOString(),
      createdAt: '2026-08-01T10:00:00.000Z',
      passwordHash: ownerPass.hash,
      salt: ownerPass.salt,
    },
    {
      id: 'usr_cust_1',
      role: 'customer',
      name: 'Amit Kumar',
      mobile: '9876543210',
      qrCode: 'HA-CUST-9876543210',
      customerIdCode: 'HA-ID-1001',
      verificationStatus: 'verified',
      verifiedAt: '2026-08-11T10:00:00.000Z',
      verifiedBy: 'Hair Adda Owner',
      lastLogin: '2026-10-11T12:00:00.000Z',
      createdAt: '2026-08-10T11:00:00.000Z',
      passwordHash: custPass.hash,
      salt: custPass.salt,
    },
    {
      id: 'usr_cust_2',
      role: 'customer',
      name: 'Priya Patel',
      mobile: '9876543211',
      qrCode: 'HA-CUST-9876543211',
      customerIdCode: 'HA-ID-1002',
      verificationStatus: 'verified',
      verifiedAt: '2026-08-16T14:00:00.000Z',
      verifiedBy: 'Hair Adda Owner',
      lastLogin: '2026-10-10T15:00:00.000Z',
      createdAt: '2026-08-15T14:30:00.000Z',
      passwordHash: custPass.hash,
      salt: custPass.salt,
    },
    {
      id: 'usr_cust_3',
      role: 'customer',
      name: 'Vikram Singh',
      mobile: '9876543212',
      qrCode: 'HA-CUST-9876543212',
      customerIdCode: 'HA-ID-1003',
      verificationStatus: 'pending', // Pending verification for Owner to approve!
      verifiedAt: null,
      verifiedBy: null,
      lastLogin: '2026-10-09T18:00:00.000Z',
      createdAt: '2026-08-20T16:00:00.000Z',
      passwordHash: custPass.hash,
      salt: custPass.salt,
    },
    {
      id: 'usr_cust_4',
      role: 'customer',
      name: 'Sunita Rao',
      mobile: '9876543213',
      qrCode: 'HA-CUST-9876543213',
      customerIdCode: 'HA-ID-1004',
      verificationStatus: 'verified',
      verifiedAt: '2026-08-23T11:00:00.000Z',
      verifiedBy: 'Hair Adda Owner',
      lastLogin: '2026-10-08T09:00:00.000Z',
      createdAt: '2026-08-22T09:15:00.000Z',
      passwordHash: custPass.hash,
      salt: custPass.salt,
    },
    {
      id: 'usr_cust_5',
      role: 'customer',
      name: 'Kavita Reddy',
      mobile: '9876543214',
      qrCode: 'HA-CUST-9876543214',
      customerIdCode: 'HA-ID-1005',
      verificationStatus: 'pending', // Newly registered customer pending approval
      verifiedAt: null,
      verifiedBy: null,
      lastLogin: '2026-10-12T08:30:00.000Z',
      createdAt: '2026-10-12T08:30:00.000Z',
      passwordHash: custPass.hash,
      salt: custPass.salt,
    },
  ];

  const currentMonth = getCurrentMonthKey();
  const prevMonth = '2026-09';

  const purchases: Purchase[] = [
    {
      id: 'pur_sep_01',
      customerId: 'usr_cust_4',
      customerMobile: '9876543213',
      customerName: 'Sunita Rao',
      billNumber: 'INV-2026-0901',
      amount: 8200,
      items: 'Bridal Package & Hair Spa',
      date: '2026-09-08T15:20:00.000Z',
      monthKey: prevMonth,
      addedBy: 'usr_owner_1',
    },
    {
      id: 'pur_sep_02',
      customerId: 'usr_cust_4',
      customerMobile: '9876543213',
      customerName: 'Sunita Rao',
      billNumber: 'INV-2026-0914',
      amount: 6000,
      items: 'Keratin Treatment & Global Colour',
      date: '2026-09-22T17:45:00.000Z',
      monthKey: prevMonth,
      addedBy: 'usr_owner_1',
    },
    {
      id: 'pur_sep_03',
      customerId: 'usr_cust_1',
      customerMobile: '9876543210',
      customerName: 'Amit Kumar',
      billNumber: 'INV-2026-0920',
      amount: 7500,
      items: 'Hydra Facial & Hair Keratin',
      date: '2026-09-15T11:30:00.000Z',
      monthKey: prevMonth,
      addedBy: 'usr_owner_1',
    },
    {
      id: 'pur_sep_04',
      customerId: 'usr_cust_2',
      customerMobile: '9876543211',
      customerName: 'Priya Patel',
      billNumber: 'INV-2026-0925',
      amount: 5200,
      items: 'Advance Hair Cut & Balayage Highlights',
      date: '2026-09-28T18:10:00.000Z',
      monthKey: prevMonth,
      addedBy: 'usr_owner_1',
    },
    {
      id: 'pur_oct_01',
      customerId: 'usr_cust_1',
      customerMobile: '9876543210',
      customerName: 'Amit Kumar',
      billNumber: 'INV-2026-1001',
      amount: 5450,
      items: 'Special Hydra Facial + Hair Keratin (Men)',
      date: '2026-10-02T12:00:00.000Z',
      monthKey: currentMonth,
      addedBy: 'usr_owner_1',
    },
    {
      id: 'pur_oct_02',
      customerId: 'usr_cust_1',
      customerMobile: '9876543210',
      customerName: 'Amit Kumar',
      billNumber: 'INV-2026-1008',
      amount: 7000,
      items: 'Full Body De-Tan + Gold Facial Package',
      date: '2026-10-09T16:20:00.000Z',
      monthKey: currentMonth,
      addedBy: 'usr_owner_1',
    },
    {
      id: 'pur_oct_03',
      customerId: 'usr_cust_2',
      customerMobile: '9876543211',
      customerName: 'Priya Patel',
      billNumber: 'INV-2026-1004',
      amount: 3200,
      items: 'L\'Oréal Mythic Spa + Layer Cut + De-Tan',
      date: '2026-10-04T14:10:00.000Z',
      monthKey: currentMonth,
      addedBy: 'usr_owner_1',
    },
    {
      id: 'pur_oct_04',
      customerId: 'usr_cust_2',
      customerMobile: '9876543211',
      customerName: 'Priya Patel',
      billNumber: 'INV-2026-1011',
      amount: 3000,
      items: 'Gel Nail Extensions & Global Root Touchup',
      date: '2026-10-11T13:40:00.000Z',
      monthKey: currentMonth,
      addedBy: 'usr_owner_1',
    },
    {
      id: 'pur_oct_05',
      customerId: 'usr_cust_3',
      customerMobile: '9876543212',
      customerName: 'Vikram Singh',
      billNumber: 'INV-2026-1007',
      amount: 3850,
      items: 'Hair Cut & Trimming + O3 Face Detan + Loreal Spa',
      date: '2026-10-07T18:00:00.000Z',
      monthKey: currentMonth,
      addedBy: 'usr_owner_1',
    },
  ];

  const prizes: MonthlyPrize[] = [
    {
      id: 'prz_sep_2026',
      monthKey: prevMonth,
      monthLabel: 'September 2026',
      winnerCustomerId: 'usr_cust_4',
      winnerName: 'Sunita Rao',
      winnerMobile: '9876543213',
      prizeAmount: 200,
      claimCode: 'CLAIM-SEP26-7A9B',
      claimQr: 'PRIZE-CLAIM-SEP26-7A9B',
      status: 'unclaimed',
      claimedAt: null,
      claimedBillNumber: null,
      notes: 'Rank #1 Winner for September 2026 (Spend: ₹14,200)',
    },
  ];

  return {
    users,
    purchases,
    prizes,
    archivedMonths: ['2026-09'],
  };
}

class DatabaseService {
  private data: DBSchema;

  constructor() {
    this.data = this.loadDB();
  }

  private loadDB(): DBSchema {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Normalize users to have customerIdCode and verificationStatus if missing
        if (parsed.users) {
          let count = 1001;
          for (const u of parsed.users) {
            if (u.role === 'customer') {
              if (!u.customerIdCode) u.customerIdCode = `HA-ID-${count++}`;
              if (!u.verificationStatus) u.verificationStatus = 'verified';
            } else if (u.role === 'owner') {
              if (!u.customerIdCode) u.customerIdCode = 'HA-ADMIN-01';
              u.verificationStatus = 'verified';
            }
          }
        }
        return parsed;
      }
    } catch (err) {
      console.error('Error reading database file, initializing seed:', err);
    }
    const seed = createInitialSeed();
    this.saveDB(seed);
    return seed;
  }

  public saveDB(dataToSave?: DBSchema) {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      const toWrite = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(toWrite, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing database file:', err);
    }
  }

  // User management
  public getUserByMobile(mobile: string): DBUser | undefined {
    return this.data.users.find(u => u.mobile === mobile);
  }

  public getUserById(id: string): DBUser | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByQrCode(qrCode: string): DBUser | undefined {
    return this.data.users.find(u => u.qrCode === qrCode || u.customerIdCode === qrCode);
  }

  public getOwnerUser(): DBUser | undefined {
    return this.data.users.find(u => u.role === 'owner');
  }

  public getAllCustomers(): DBUser[] {
    return this.data.users.filter(u => u.role === 'customer');
  }

  public registerCustomer(name: string, mobile: string, password: string): DBUser {
    const existing = this.getUserByMobile(mobile);
    if (existing) {
      throw new Error(`Mobile number +91 ${mobile} is already registered.`);
    }

    const { hash, salt } = hashPassword(password);
    const customerCount = this.getAllCustomers().length;
    const customerIdCode = `HA-ID-${1000 + customerCount + 1}`;

    const newUser: DBUser = {
      id: `usr_cust_${Date.now()}`,
      role: 'customer',
      name: name.trim(),
      mobile: mobile.trim(),
      qrCode: `HA-CUST-${mobile.trim()}`,
      customerIdCode,
      verificationStatus: 'pending', // Starts as Pending until Owner verifies
      verifiedAt: null,
      verifiedBy: null,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      passwordHash: hash,
      salt: salt,
    };

    this.data.users.push(newUser);
    this.saveDB();
    return newUser;
  }

  public recordCustomerLogin(customerId: string) {
    const user = this.getUserById(customerId);
    if (user) {
      user.lastLogin = new Date().toISOString();
      this.saveDB();
    }
  }

  public updateCustomerVerification(
    customerId: string,
    status: VerificationStatus,
    verifiedBy: string
  ): DBUser {
    const user = this.getUserById(customerId);
    if (!user) {
      throw new Error('Customer not found');
    }
    if (user.role !== 'customer') {
      throw new Error('Only customer accounts can be verified');
    }

    user.verificationStatus = status;
    user.verifiedAt = status === 'verified' ? new Date().toISOString() : null;
    user.verifiedBy = verifiedBy;
    this.saveDB();
    return user;
  }

  public updateOwnerPassword(newPassword: string): boolean {
    const owner = this.getOwnerUser();
    if (!owner) return false;
    const { hash, salt } = hashPassword(newPassword);
    owner.passwordHash = hash;
    owner.salt = salt;
    this.saveDB();
    return true;
  }

  // Purchases & Transactions
  public getPurchasesByCustomer(customerId: string): Purchase[] {
    return this.data.purchases
      .filter(p => p.customerId === customerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public getAllPurchases(): Purchase[] {
    return [...this.data.purchases].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  public checkBillNumberExists(billNumber: string): boolean {
    const clean = billNumber.trim().toUpperCase();
    return this.data.purchases.some(p => p.billNumber.trim().toUpperCase() === clean);
  }

  public addPurchase(params: {
    customerId: string;
    billNumber: string;
    amount: number;
    items?: string;
    date?: string;
    addedBy: string;
  }): Purchase {
    const customer = this.getUserById(params.customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const cleanBill = params.billNumber.trim().toUpperCase();
    if (this.checkBillNumberExists(cleanBill)) {
      throw new Error(`Duplicate Bill Number: ${cleanBill} already exists in the system.`);
    }

    if (params.amount <= 0) {
      throw new Error('Purchase amount must be greater than ₹0.');
    }

    const purchaseDate = params.date ? new Date(params.date) : new Date();
    const monthKey = getCurrentMonthKey(purchaseDate);

    // Duplicate transaction prevention
    const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
    const recentDuplicate = this.data.purchases.find(p => 
      p.customerId === params.customerId &&
      p.amount === params.amount &&
      new Date(p.date).getTime() > twoMinutesAgo
    );
    if (recentDuplicate) {
      throw new Error(`Duplicate Transaction Detected: An identical bill of ₹${params.amount} was recorded moments ago (Bill #${recentDuplicate.billNumber}).`);
    }

    const newPurchase: Purchase = {
      id: `pur_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      customerId: customer.id,
      customerMobile: customer.mobile,
      customerName: customer.name,
      billNumber: cleanBill,
      amount: Number(params.amount),
      items: params.items?.trim() || 'Hair Adda Salon Services',
      date: purchaseDate.toISOString(),
      monthKey,
      addedBy: params.addedBy,
    };

    this.data.purchases.push(newPurchase);
    this.saveDB();
    return newPurchase;
  }

  // Monthly stats & calculations
  public getCustomerMonthlySpend(customerId: string, monthKey: string): number {
    return this.data.purchases
      .filter(p => p.customerId === customerId && p.monthKey === monthKey)
      .reduce((sum, p) => sum + p.amount, 0);
  }

  public getCustomerLifetimeSpend(customerId: string): number {
    return this.data.purchases
      .filter(p => p.customerId === customerId)
      .reduce((sum, p) => sum + p.amount, 0);
  }

  public getCustomerTotalCoins(customerId: string): number {
    const monthMap = new Map<string, number>();
    for (const p of this.data.purchases) {
      if (p.customerId === customerId) {
        monthMap.set(p.monthKey, (monthMap.get(p.monthKey) || 0) + p.amount);
      }
    }

    let totalCoins = 0;
    for (const [, spend] of monthMap.entries()) {
      totalCoins += calculateMonthlyCoins(spend);
    }
    return totalCoins;
  }

  // Leaderboard
  public getMonthlyLeaderboard(monthKey: string = getCurrentMonthKey()): LeaderboardEntry[] {
    const customers = this.getAllCustomers();
    const entries: LeaderboardEntry[] = [];

    for (const c of customers) {
      const spend = this.getCustomerMonthlySpend(c.id, monthKey);
      const coins = calculateMonthlyCoins(spend);
      entries.push({
        rank: 0,
        customerId: c.id,
        customerName: c.name,
        customerMobile: c.mobile,
        monthlySpend: spend,
        coinsEarned: coins,
        verificationStatus: c.verificationStatus,
      });
    }

    entries.sort((a, b) => b.monthlySpend - a.monthlySpend);
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return entries;
  }

  public getAvailableMonths(): string[] {
    const months = new Set<string>();
    months.add(getCurrentMonthKey());
    for (const p of this.data.purchases) {
      months.add(p.monthKey);
    }
    for (const pr of this.data.prizes) {
      months.add(pr.monthKey);
    }
    for (const m of this.data.archivedMonths) {
      months.add(m);
    }
    return Array.from(months).sort().reverse();
  }

  // Monthly Prize & Finalization
  public getAllPrizes(): MonthlyPrize[] {
    return [...this.data.prizes].sort((a, b) => b.monthKey.localeCompare(a.monthKey));
  }

  public getCustomerPrizes(customerId: string): MonthlyPrize[] {
    return this.data.prizes.filter(p => p.winnerCustomerId === customerId);
  }

  public finalizeMonth(monthKey: string, closedBy: string): MonthlyPrize {
    const existing = this.data.prizes.find(p => p.monthKey === monthKey);
    if (existing) {
      return existing;
    }

    const leaderboard = this.getMonthlyLeaderboard(monthKey);
    if (leaderboard.length === 0 || leaderboard[0].monthlySpend <= 0) {
      throw new Error(`No customer spending recorded for ${getMonthLabel(monthKey)} to award #1 prize.`);
    }

    const winner = leaderboard[0];
    const codeSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const claimCode = `CLAIM-${monthKey.replace('-', '')}-${codeSuffix}`;

    const newPrize: MonthlyPrize = {
      id: `prz_${monthKey}_${Date.now()}`,
      monthKey,
      monthLabel: getMonthLabel(monthKey),
      winnerCustomerId: winner.customerId,
      winnerName: winner.customerName,
      winnerMobile: winner.customerMobile,
      prizeAmount: 200,
      claimCode,
      claimQr: `PRIZE-CLAIM-${claimCode}`,
      status: 'unclaimed',
      claimedAt: null,
      claimedBillNumber: null,
      notes: `Rank #1 Winner for ${getMonthLabel(monthKey)} (Spend: ₹${winner.monthlySpend})`,
    };

    this.data.prizes.push(newPrize);
    if (!this.data.archivedMonths.includes(monthKey)) {
      this.data.archivedMonths.push(monthKey);
    }
    this.saveDB();
    return newPrize;
  }

  public claimPrize(params: {
    claimCodeOrQr: string;
    verifiedBy: string;
    claimedBillNumber?: string;
  }): MonthlyPrize {
    const raw = params.claimCodeOrQr.trim().toUpperCase();
    const prize = this.data.prizes.find(
      p => p.claimCode.toUpperCase() === raw || p.claimQr.toUpperCase() === raw
    );

    if (!prize) {
      throw new Error('Invalid prize claim code or QR code.');
    }

    if (prize.status === 'claimed') {
      throw new Error(`This prize has already been claimed on ${new Date(prize.claimedAt!).toLocaleDateString('en-IN')}.`);
    }

    prize.status = 'claimed';
    prize.claimedAt = new Date().toISOString();
    prize.claimedBillNumber = params.claimedBillNumber?.trim() || 'CASH-DISCOUNT-REDEEMED';
    this.saveDB();
    return prize;
  }
}

export const db = new DatabaseService();
