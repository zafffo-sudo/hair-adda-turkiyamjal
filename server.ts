import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  db,
  verifyPassword,
  getCurrentMonthKey,
  getMonthLabel,
  calculateMonthlyCoins,
  toSafeUser,
} from './src/server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// In-memory rate limiting to prevent brute force login attempts
const failedLoginAttempts = new Map<string, { count: number; lockedUntil: number }>();

function checkRateLimit(key: string): { locked: boolean; waitSeconds?: number } {
  const entry = failedLoginAttempts.get(key);
  if (!entry) return { locked: false };
  if (entry.lockedUntil > Date.now()) {
    const waitSeconds = Math.ceil((entry.lockedUntil - Date.now()) / 1000);
    return { locked: true, waitSeconds };
  }
  return { locked: false };
}

function recordFailedAttempt(key: string) {
  const entry = failedLoginAttempts.get(key) || { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= 5) {
    entry.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 mins lock
  }
  failedLoginAttempts.set(key, entry);
}

function clearFailedAttempts(key: string) {
  failedLoginAttempts.delete(key);
}

// Session store for stateful Bearer token validation
const sessions = new Map<string, { userId: string; role: string; mobile: string; name: string }>();

function generateToken(userId: string, role: string, mobile: string, name: string): string {
  const token = `ha_tok_${Buffer.from(`${userId}:${Date.now()}:${Math.random()}`).toString('base64url')}`;
  sessions.set(token, { userId, role, mobile, name });
  return token;
}

// Auth middleware helper
function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  const session = sessions.get(token);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }
  (req as any).user = session;
  next();
}

// Strict Server-Side Owner Permission Guard
function requireOwner(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user || user.role !== 'owner') {
    return res.status(403).json({ error: 'Forbidden: Strict owner privileges required. Unauthorized access blocked.' });
  }
  next();
}

// ==================== AUTH API ====================

// Owner Login - Strictly verifies Owner Password (No mobile required, rate limited)
app.post('/api/auth/owner-login', (req: Request, res: Response) => {
  try {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const rateCheck = checkRateLimit(`owner_${clientIp}`);
    if (rateCheck.locked) {
      return res.status(429).json({
        error: `Too many failed login attempts. Account temporarily locked for security. Try again in ${rateCheck.waitSeconds}s.`,
      });
    }

    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Owner password is required' });
    }

    const owner = db.getOwnerUser();
    if (!owner) {
      return res.status(500).json({ error: 'Owner account not configured' });
    }

    const isMatch = verifyPassword(password, owner.passwordHash, owner.salt);
    if (!isMatch) {
      recordFailedAttempt(`owner_${clientIp}`);
      return res.status(401).json({ error: 'Incorrect owner password. Access denied.' });
    }

    clearFailedAttempts(`owner_${clientIp}`);
    const token = generateToken(owner.id, owner.role, owner.mobile, owner.name);

    return res.json({
      token,
      user: toSafeUser(owner),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Owner authentication failed' });
  }
});

// Customer Login - Mobile & Password (No OTP)
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password) {
      return res.status(400).json({ error: 'Mobile number and password are required' });
    }

    const cleanMobile = mobile.trim();
    const rateCheck = checkRateLimit(`cust_${cleanMobile}`);
    if (rateCheck.locked) {
      return res.status(429).json({
        error: `Account temporarily locked due to multiple failed attempts. Try again in ${rateCheck.waitSeconds}s.`,
      });
    }

    const user = db.getUserByMobile(cleanMobile);
    if (!user || user.role !== 'customer') {
      recordFailedAttempt(`cust_${cleanMobile}`);
      return res.status(401).json({ error: 'Invalid mobile number or password' });
    }

    const isMatch = verifyPassword(password, user.passwordHash, user.salt);
    if (!isMatch) {
      recordFailedAttempt(`cust_${cleanMobile}`);
      return res.status(401).json({ error: 'Invalid mobile number or password' });
    }

    clearFailedAttempts(`cust_${cleanMobile}`);
    db.recordCustomerLogin(user.id);
    const token = generateToken(user.id, user.role, user.mobile, user.name);

    return res.json({
      token,
      user: toSafeUser(user),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server login failed' });
  }
});

// Register New Customer (Strictly Customer Role Only, Starts as Pending Verification)
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, mobile, password, role } = req.body;
    if (role && role !== 'customer') {
      return res.status(403).json({ error: 'Public registration for administrative roles is prohibited.' });
    }

    if (!name || !mobile || !password) {
      return res.status(400).json({ error: 'Name, mobile number, and password are required' });
    }

    const cleanMobile = mobile.trim();
    if (!/^\d{10}$/.test(cleanMobile)) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters long' });
    }

    const newUser = db.registerCustomer(name, cleanMobile, password);
    const token = generateToken(newUser.id, newUser.role, newUser.mobile, newUser.name);

    return res.json({
      token,
      user: toSafeUser(newUser),
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

// Current User Profile
app.get('/api/auth/me', authenticate, (req: Request, res: Response) => {
  const session = (req as any).user;
  const user = db.getUserById(session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({
    id: user.id,
    role: user.role,
    name: user.name,
    mobile: user.mobile,
    qrCode: user.qrCode,
    createdAt: user.createdAt,
  });
});

// ==================== CUSTOMER DASHBOARD API ====================

app.get('/api/customer/dashboard', authenticate, (req: Request, res: Response) => {
  try {
    const session = (req as any).user;
    const user = db.getUserById(session.userId);
    if (!user) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const currentMonthKey = getCurrentMonthKey();
    const currentMonthLabel = getMonthLabel(currentMonthKey);

    const totalLifetimeSpend = db.getCustomerLifetimeSpend(user.id);
    const currentMonthSpend = db.getCustomerMonthlySpend(user.id, currentMonthKey);
    const totalCoins = db.getCustomerTotalCoins(user.id);
    const currentMonthCoins = calculateMonthlyCoins(currentMonthSpend);

    // Reward Tier Progress:
    // Monthly spend ₹5,000 = 250 coins
    // Monthly spend ₹10,000 = 600 coins total
    const tier1Target = 5000;
    const tier2Target = 10000;

    const progressToTier1 = {
      target: tier1Target,
      current: currentMonthSpend,
      percent: Math.min(100, Math.round((currentMonthSpend / tier1Target) * 100)),
      reward: 250,
      achieved: currentMonthSpend >= tier1Target,
    };

    const progressToTier2 = {
      target: tier2Target,
      current: currentMonthSpend,
      percent: Math.min(100, Math.round((currentMonthSpend / tier2Target) * 100)),
      reward: 600,
      achieved: currentMonthSpend >= tier2Target,
    };

    // Leaderboard rank
    const leaderboard = db.getMonthlyLeaderboard(currentMonthKey);
    const rankEntry = leaderboard.find(e => e.customerId === user.id);
    const currentRank = rankEntry ? rankEntry.rank : null;

    // Purchases
    const purchases = db.getPurchasesByCustomer(user.id);

    // Active prize claims won by this customer
    const activePrizeClaims = db.getCustomerPrizes(user.id);

    return res.json({
      customer: {
        id: user.id,
        role: user.role,
        name: user.name,
        mobile: user.mobile,
        qrCode: user.qrCode,
        createdAt: user.createdAt,
      },
      totalLifetimeSpend,
      currentMonthSpend,
      totalCoins,
      currentMonthCoins,
      progressToTier1,
      progressToTier2,
      currentRank,
      purchases,
      activePrizeClaims,
      currentMonthKey,
      currentMonthLabel,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch customer dashboard' });
  }
});

// ==================== OWNER DASHBOARD API ====================

app.get('/api/owner/dashboard', authenticate, requireOwner, (_req: Request, res: Response) => {
  try {
    const currentMonthKey = getCurrentMonthKey();
    const currentMonthLabel = getMonthLabel(currentMonthKey);

    const allPurchases = db.getAllPurchases();
    const customers = db.getAllCustomers();

    const totalRevenueLifetime = allPurchases.reduce((acc, p) => acc + p.amount, 0);
    const monthPurchases = allPurchases.filter(p => p.monthKey === currentMonthKey);
    const totalRevenueThisMonth = monthPurchases.reduce((acc, p) => acc + p.amount, 0);
    const totalTransactionsThisMonth = monthPurchases.length;

    const prizes = db.getAllPrizes();
    const unclaimedPrizesCount = prizes.filter(p => p.status === 'unclaimed').length;
    const pendingVerificationCount = customers.filter(c => c.verificationStatus === 'pending').length;

    let totalCoinsIssued = 0;
    const customerList = customers.map(c => {
      const totalSpend = db.getCustomerLifetimeSpend(c.id);
      const monthSpend = db.getCustomerMonthlySpend(c.id, currentMonthKey);
      const coins = db.getCustomerTotalCoins(c.id);
      totalCoinsIssued += coins;

      const custPurchases = db.getPurchasesByCustomer(c.id);
      const lastVisit = custPurchases[0]?.date || c.createdAt;

      return {
        id: c.id,
        name: c.name,
        mobile: c.mobile,
        qrCode: c.qrCode,
        customerIdCode: c.customerIdCode || `HA-ID-${c.mobile.slice(-4)}`,
        verificationStatus: c.verificationStatus || 'pending',
        verifiedAt: c.verifiedAt || null,
        verifiedBy: c.verifiedBy || null,
        createdAt: c.createdAt,
        lastLogin: c.lastLogin || null,
        totalSpend,
        monthSpend,
        coins,
        purchaseCount: custPurchases.length,
        lastVisit,
      };
    });

    return res.json({
      totalRevenueThisMonth,
      totalRevenueLifetime,
      totalTransactionsThisMonth,
      totalCustomers: customers.length,
      totalCoinsIssued,
      unclaimedPrizesCount,
      pendingVerificationCount,
      currentMonthKey,
      currentMonthLabel,
      recentPurchases: allPurchases.slice(0, 15),
      customers: customerList,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch owner dashboard' });
  }
});

// Owner: Verify / Approve Customer ID
app.post('/api/owner/verify-customer', authenticate, requireOwner, (req: Request, res: Response) => {
  try {
    const { customerId, status } = req.body;
    const session = (req as any).user;

    if (!customerId || !status) {
      return res.status(400).json({ error: 'Customer ID and status are required' });
    }

    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be pending, verified, or rejected' });
    }

    const updatedUser = db.updateCustomerVerification(customerId, status, session.name || 'Owner');

    return res.json({
      success: true,
      customer: toSafeUser(updatedUser),
      message: `Customer ${updatedUser.name} (${updatedUser.customerIdCode}) verification status updated to "${status.toUpperCase()}".`,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Customer verification update failed' });
  }
});

// Owner Customer QR Scanner & Lookup
app.get('/api/owner/customer-lookup', authenticate, requireOwner, (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;
    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'Search query (QR Code or Mobile Number) is required' });
    }

    const clean = query.trim();
    let customer = db.getUserByQrCode(clean);
    if (!customer) {
      customer = db.getUserByMobile(clean);
    }
    // Also support finding by ID
    if (!customer) {
      customer = db.getUserById(clean);
    }

    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ error: `No registered customer found for "${clean}"` });
    }

    const currentMonthKey = getCurrentMonthKey();
    const totalLifetimeSpend = db.getCustomerLifetimeSpend(customer.id);
    const currentMonthSpend = db.getCustomerMonthlySpend(customer.id, currentMonthKey);
    const totalCoins = db.getCustomerTotalCoins(customer.id);
    const purchases = db.getPurchasesByCustomer(customer.id);
    const prizes = db.getCustomerPrizes(customer.id);

    return res.json({
      customer: toSafeUser(customer),
      totalLifetimeSpend,
      currentMonthSpend,
      totalCoins,
      purchases,
      prizes,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Customer lookup failed' });
  }
});

// Owner: Add Purchase (Duplicate prevention enabled)
app.post('/api/owner/purchases', authenticate, requireOwner, (req: Request, res: Response) => {
  try {
    const { customerId, billNumber, amount, items, date } = req.body;
    const session = (req as any).user;

    if (!customerId || !billNumber || !amount) {
      return res.status(400).json({ error: 'Customer, Bill Number, and Amount are required' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    const purchase = db.addPurchase({
      customerId,
      billNumber,
      amount: parsedAmount,
      items,
      date,
      addedBy: session.userId,
    });

    const currentMonthKey = getCurrentMonthKey();
    const updatedMonthSpend = db.getCustomerMonthlySpend(customerId, currentMonthKey);
    const updatedCoins = db.getCustomerTotalCoins(customerId);

    return res.json({
      success: true,
      purchase,
      updatedMonthSpend,
      updatedCoins,
      message: `Bill #${purchase.billNumber} of ₹${purchase.amount} recorded successfully.`,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to add purchase' });
  }
});

// ==================== LEADERBOARD API ====================

app.get('/api/leaderboard', (req: Request, res: Response) => {
  try {
    const month = (req.query.month as string) || getCurrentMonthKey();
    const entries = db.getMonthlyLeaderboard(month);
    const availableMonths = db.getAvailableMonths();

    // Mark current user if authenticated
    let userId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const session = sessions.get(token);
      if (session) userId = session.userId;
    }

    const formattedEntries = entries.map(e => ({
      ...e,
      isCurrentUser: userId === e.customerId,
    }));

    // Prize status for this month
    const allPrizes = db.getAllPrizes();
    const monthPrize = allPrizes.find(p => p.monthKey === month);

    return res.json({
      monthKey: month,
      monthLabel: getMonthLabel(month),
      availableMonths: availableMonths.map(m => ({
        key: m,
        label: getMonthLabel(m),
        isCurrent: m === getCurrentMonthKey(),
      })),
      entries: formattedEntries,
      monthPrize: monthPrize || null,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch leaderboard' });
  }
});

// ==================== PRIZE CLAIM API ====================

app.get('/api/prizes', authenticate, (_req: Request, res: Response) => {
  try {
    const prizes = db.getAllPrizes();
    return res.json(prizes);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch prizes' });
  }
});

// Owner Finalize Month (Awards ₹200 prize to #1 customer)
app.post('/api/owner/finalize-month', authenticate, requireOwner, (req: Request, res: Response) => {
  try {
    const { monthKey } = req.body;
    const session = (req as any).user;
    const targetMonth = monthKey || getCurrentMonthKey();

    const prize = db.finalizeMonth(targetMonth, session.userId);
    return res.json({
      success: true,
      prize,
      message: `Month ${getMonthLabel(targetMonth)} finalized! #1 Winner ${prize.winnerName} awarded ₹200 prize (Claim Code: ${prize.claimCode}).`,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to finalize month' });
  }
});

// Verify & Claim Prize at Shop (Owner action or scanned at counter)
app.post('/api/prizes/claim', authenticate, requireOwner, (req: Request, res: Response) => {
  try {
    const { claimCodeOrQr, claimedBillNumber } = req.body;
    const session = (req as any).user;

    if (!claimCodeOrQr || !claimCodeOrQr.trim()) {
      return res.status(400).json({ error: 'Claim code or scanned QR code is required' });
    }

    const claimedPrize = db.claimPrize({
      claimCodeOrQr: claimCodeOrQr.trim(),
      verifiedBy: session.userId,
      claimedBillNumber,
    });

    return res.json({
      success: true,
      prize: claimedPrize,
      message: `₹200 Prize verified and successfully marked as CLAIMED for ${claimedPrize.winnerName}.`,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Prize claim verification failed' });
  }
});

// ==================== VITE SPA MOUNTING ====================

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = process.env.PORT || 3000;
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`DukanRewards server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
