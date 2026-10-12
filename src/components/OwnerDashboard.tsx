import React, { useEffect, useState } from 'react';
import { OwnerDashboardData, User, Purchase, MonthlyPrize, CustomerRecord } from '../types';
import { api } from '../services/api';
import { QrScannerModal } from './QrScannerModal';
import { PrizeClaimModal } from './PrizeClaimModal';
import {
  Camera,
  Search,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Receipt,
  Users,
  Coins,
  Gift,
  Trophy,
  Calendar,
  X,
  RefreshCw,
  ShoppingBag,
  ShieldCheck,
  UserCheck,
  Clock,
  Check,
  XCircle,
} from 'lucide-react';

export const OwnerDashboard: React.FC = () => {
  const [data, setData] = useState<OwnerDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Scanned / Selected Customer State
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [scannedCustomerData, setScannedCustomerData] = useState<{
    customer: User;
    totalLifetimeSpend: number;
    currentMonthSpend: number;
    totalCoins: number;
    purchases: Purchase[];
    prizes: MonthlyPrize[];
  } | null>(null);

  // Customer Directory Filter
  const [directoryFilter, setDirectoryFilter] = useState<'all' | 'pending' | 'verified'>('all');
  const [customerSearchQuery, setCustomerSearchQuery] = useState<string>('');

  // Add Purchase Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [billNumber, setBillNumber] = useState<string>(() => `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [amount, setAmount] = useState<string>('');
  const [items, setItems] = useState<string>('');
  const [addPurchaseLoading, setAddPurchaseLoading] = useState<boolean>(false);
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState<string | null>(null);
  const [purchaseErrorMessage, setPurchaseErrorMessage] = useState<string | null>(null);

  // Verification Action State
  const [verifyActionLoading, setVerifyActionLoading] = useState<string | null>(null);
  const [verifyNotice, setVerifyNotice] = useState<string | null>(null);

  // Prize Claim Verification State
  const [claimCodeInput, setClaimCodeInput] = useState<string>('');
  const [claimBillRef, setClaimBillRef] = useState<string>('');
  const [claimLoading, setClaimLoading] = useState<boolean>(false);
  const [claimSuccessMessage, setClaimSuccessMessage] = useState<string | null>(null);
  const [claimErrorMessage, setClaimErrorMessage] = useState<string | null>(null);
  const [allPrizes, setAllPrizes] = useState<MonthlyPrize[]>([]);
  const [scannerForPrize, setScannerForPrize] = useState<boolean>(false);

  // Manual search input
  const [searchMobileOrQr, setSearchMobileOrQr] = useState<string>('');
  const [lookupLoading, setLookupLoading] = useState<boolean>(false);

  const fetchDashboardData = () => {
    setLoading(true);
    Promise.all([api.getOwnerDashboard(), api.getPrizes()])
      .then(([dash, prizes]) => {
        setData(dash);
        setAllPrizes(prizes);
        setError(null);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch owner dashboard');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleScanSuccess = async (scannedText: string) => {
    setIsScannerOpen(false);
    if (scannerForPrize) {
      setScannerForPrize(false);
      setClaimCodeInput(scannedText);
      return;
    }

    setLookupLoading(true);
    setPurchaseSuccessMessage(null);
    setPurchaseErrorMessage(null);

    try {
      const res = await api.lookupCustomer(scannedText);
      setScannedCustomerData(res);
      setSelectedCustomerId(res.customer.id);
      setBillNumber(`INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    } catch (err: any) {
      alert(err.message || `Customer not found for scanned code: ${scannedText}`);
    } finally {
      setLookupLoading(false);
    }
  };

  const handleManualLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchMobileOrQr.trim()) return;
    setLookupLoading(true);
    try {
      const res = await api.lookupCustomer(searchMobileOrQr.trim());
      setScannedCustomerData(res);
      setSelectedCustomerId(res.customer.id);
      setSearchMobileOrQr('');
    } catch (err: any) {
      alert(err.message || 'Customer lookup failed');
    } finally {
      setLookupLoading(false);
    }
  };

  const handleCustomerVerification = async (customerId: string, status: 'verified' | 'pending' | 'rejected') => {
    setVerifyActionLoading(customerId);
    setVerifyNotice(null);
    try {
      const res = await api.verifyCustomer(customerId, status);
      setVerifyNotice(res.message);
      
      // Update in scanned customer data if matches
      if (scannedCustomerData && scannedCustomerData.customer.id === customerId) {
        setScannedCustomerData({
          ...scannedCustomerData,
          customer: {
            ...scannedCustomerData.customer,
            verificationStatus: status,
          },
        });
      }
      
      fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to update customer verification');
    } finally {
      setVerifyActionLoading(null);
    }
  };

  const handleAddPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !billNumber.trim() || !amount) {
      setPurchaseErrorMessage('Please select a customer, bill number, and valid amount.');
      return;
    }

    setAddPurchaseLoading(true);
    setPurchaseSuccessMessage(null);
    setPurchaseErrorMessage(null);

    try {
      const res = await api.addPurchase({
        customerId: selectedCustomerId,
        billNumber: billNumber.trim(),
        amount: parseFloat(amount),
        items: items.trim(),
      });

      setPurchaseSuccessMessage(res.message);
      setAmount('');
      setItems('');
      setBillNumber(`INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);

      // Refresh customer and dashboard data
      if (scannedCustomerData && scannedCustomerData.customer.id === selectedCustomerId) {
        const refreshed = await api.lookupCustomer(selectedCustomerId);
        setScannedCustomerData(refreshed);
      }
      fetchDashboardData();
    } catch (err: any) {
      setPurchaseErrorMessage(err.message || 'Failed to record purchase.');
    } finally {
      setAddPurchaseLoading(false);
    }
  };

  const handleVerifyPrizeClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimCodeInput.trim()) return;

    setClaimLoading(true);
    setClaimSuccessMessage(null);
    setClaimErrorMessage(null);

    try {
      const res = await api.claimPrize({
        claimCodeOrQr: claimCodeInput.trim(),
        claimedBillNumber: claimBillRef.trim() || undefined,
      });

      setClaimSuccessMessage(res.message);
      setClaimCodeInput('');
      setClaimBillRef('');
      fetchDashboardData();
    } catch (err: any) {
      setClaimErrorMessage(err.message || 'Prize claim failed.');
    } finally {
      setClaimLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading Hair Adda Owner Admin Panel...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-24 text-center space-y-3 max-w-md mx-auto px-4">
        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
        <p className="text-sm text-slate-200">{error || 'Failed to load owner panel'}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const pendingCustomers = data.customers.filter(c => c.verificationStatus === 'pending');
  const verifiedCustomers = data.customers.filter(c => c.verificationStatus === 'verified');

  const filteredCustomers = data.customers.filter(c => {
    if (directoryFilter === 'pending' && c.verificationStatus !== 'pending') return false;
    if (directoryFilter === 'verified' && c.verificationStatus !== 'verified') return false;
    if (!customerSearchQuery.trim()) return true;
    const q = customerSearchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.mobile.includes(q) ||
      (c.customerIdCode && c.customerIdCode.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Verification Notice Banner */}
      {verifyNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{verifyNotice}</span>
          </div>
          <button
            onClick={() => setVerifyNotice(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Section: Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>This Month Revenue ({data.currentMonthLabel})</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-display font-extrabold text-2xl text-white font-mono tabular-nums">
            ₹{data.totalRevenueThisMonth.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">
            {data.totalTransactionsThisMonth} transactions recorded
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Customers</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-display font-extrabold text-2xl text-white font-mono tabular-nums">
            {data.totalCustomers}
          </div>
          <div className="text-[11px] flex items-center gap-2">
            <span className="text-emerald-400 font-semibold">{verifiedCustomers.length} Verified</span>
            <span className="text-slate-600">·</span>
            <span className={pendingCustomers.length > 0 ? "text-amber-400 font-bold" : "text-slate-500"}>
              {pendingCustomers.length} Pending
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pending ID Approvals</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className={`font-display font-extrabold text-2xl font-mono tabular-nums ${
            pendingCustomers.length > 0 ? 'text-amber-400' : 'text-slate-300'
          }`}>
            {pendingCustomers.length}
          </div>
          <div className="text-[11px] text-slate-400">
            {pendingCustomers.length > 0
              ? 'New customers awaiting your approval'
              : 'All registered customer IDs verified'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Unclaimed ₹200 Prizes</span>
            <Gift className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-display font-extrabold text-2xl text-white font-mono tabular-nums">
            {data.unclaimedPrizesCount}
          </div>
          <div className="text-[11px] text-amber-400/90 font-medium">
            Awaiting redemption at counter
          </div>
        </div>

      </div>

      {/* PENDING CUSTOMER APPROVALS & ID VERIFICATION HUB */}
      {pendingCustomers.length > 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/40 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-extrabold text-lg text-white">
                    Customer ID Approvals ({pendingCustomers.length} Pending)
                  </h3>
                  <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Action Required
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Customers register with Pending status. Verify their profile and approve their official Customer ID:
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setDirectoryFilter('pending');
                const el = document.getElementById('customer-directory');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold cursor-pointer underline"
            >
              Filter in Directory
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendingCustomers.map(cust => (
              <div
                key={cust.id}
                className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 flex flex-col justify-between space-y-3 hover:border-amber-400 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {cust.customerIdCode}
                    </span>
                    <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Pending</span>
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-base text-white mt-2">
                    {cust.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    +91 {cust.mobile}
                  </p>

                  <div className="mt-2 text-[10px] text-slate-400 space-y-0.5 border-t border-slate-900 pt-1.5">
                    <div>
                      Registered: {new Date(cust.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    {cust.lastLogin && (
                      <div>
                        Last Login: {new Date(cust.lastLogin).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
                  <button
                    onClick={() => handleCustomerVerification(cust.id, 'verified')}
                    disabled={verifyActionLoading === cust.id}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{verifyActionLoading === cust.id ? 'Approving...' : 'Approve & Verify'}</span>
                  </button>

                  <button
                    onClick={async () => {
                      const res = await api.lookupCustomer(cust.id);
                      setScannedCustomerData(res);
                      setSelectedCustomerId(cust.id);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs cursor-pointer"
                    title="View Customer Profile"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Counter Scanner & Customer Lookup */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Counter Scanner & Billing Desk
            </span>
            <h2 className="font-display font-bold text-2xl text-white mt-0.5">
              Identify Customer & Add Purchase
            </h2>
            <p className="text-xs text-slate-400">
              Scan customer loyalty QR code from phone, or search by mobile number / Customer ID
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setScannerForPrize(false);
                setIsScannerOpen(true);
              }}
              className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md shadow-amber-400/20"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Customer QR</span>
            </button>
          </div>
        </div>

        {/* Manual Mobile or Customer ID Search */}
        <form onSubmit={handleManualLookup} className="flex gap-2 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchMobileOrQr}
              onChange={(e) => setSearchMobileOrQr(e.target.value)}
              placeholder="Search by 10-digit mobile or Customer ID (e.g. 9876543210 or HA-ID-1001)..."
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={lookupLoading}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer shrink-0"
          >
            {lookupLoading ? 'Searching...' : 'Lookup'}
          </button>
        </form>
      </div>

      {/* Customer Identified Profile & Add Bill Section */}
      {scannedCustomerData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Customer Profile Card (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-5 relative shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Scanned Customer
                  </span>
                  <span className="font-mono text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20 px-2 py-0.5 rounded">
                    {scannedCustomerData.customer.customerIdCode}
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-xl text-white mt-1">
                  {scannedCustomerData.customer.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  +91 {scannedCustomerData.customer.mobile}
                </p>

                {/* Account Status Badge & Inline Approval Action */}
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {scannedCustomerData.customer.verificationStatus === 'verified' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <Check className="w-3 h-3" />
                      <span>Verified ID Account</span>
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Clock className="w-3 h-3" />
                        <span>Pending Approval</span>
                      </span>
                      <button
                        onClick={() => handleCustomerVerification(scannedCustomerData.customer.id, 'verified')}
                        disabled={verifyActionLoading === scannedCustomerData.customer.id}
                        className="px-2.5 py-0.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                      >
                        {verifyActionLoading === scannedCustomerData.customer.id ? 'Approving...' : 'Approve ID Now'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setScannedCustomerData(null)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 cursor-pointer"
                title="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-medium">Month Spend</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  ₹{scannedCustomerData.currentMonthSpend.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-medium">Coins</div>
                <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">
                  {scannedCustomerData.totalCoins}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-medium">Lifetime</div>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                  ₹{scannedCustomerData.totalLifetimeSpend.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Recent Purchases by this Customer */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Recent Bills ({scannedCustomerData.purchases.length})</span>
                <span className="text-[11px] text-slate-500">History</span>
              </div>

              {scannedCustomerData.purchases.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950 text-center text-xs text-slate-500">
                  No previous bills recorded for this customer yet.
                </div>
              ) : (
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {scannedCustomerData.purchases.map(p => (
                    <div
                      key={p.id}
                      className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-mono font-bold text-amber-400">{p.billNumber}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[160px]">{p.items}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-white">₹{p.amount.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Add Purchase Form (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Billing Transaction
              </span>
              <h3 className="font-display font-bold text-xl text-white mt-0.5">
                Record New Bill for {scannedCustomerData.customer.name}
              </h3>
              <p className="text-xs text-slate-400">
                Duplicate bill check enabled · Instant reward coins calculation
              </p>
            </div>

            {purchaseSuccessMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{purchaseSuccessMessage}</span>
              </div>
            )}

            {purchaseErrorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{purchaseErrorMessage}</span>
              </div>
            )}

            {/* Hair Adda Service Quick Picker */}
            <div className="space-y-2 p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                <span>✂️ Quick Select Hair Adda Service:</span>
                <span className="text-slate-500 font-normal">Tap to auto-fill amount</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {[
                  { name: 'Any Hair Cut', price: 149 },
                  { name: 'Kids Hair Cut', price: 99 },
                  { name: 'Hair Cut & Trimming', price: 199 },
                  { name: 'Shaving / Trimming', price: 69 },
                  { name: 'De-Tan (Only Face)', price: 249 },
                  { name: 'De-Tan O3 (Face)', price: 399 },
                  { name: 'Fruit Facial', price: 499 },
                  { name: 'Gold Facial', price: 999 },
                  { name: 'Special Hydra Facial', price: 3499 },
                  { name: 'Eyebrows Threading', price: 49 },
                  { name: 'Full Face Threading', price: 199 },
                  { name: 'U Cut / Straight Cut', price: 399 },
                  { name: 'Layer Cut', price: 899 },
                  { name: 'Basic Hair Spa', price: 799 },
                  { name: 'Advance Hair Spa', price: 1499 },
                  { name: 'Hair Keratin', price: 2499 },
                  { name: 'Gel Nail Polish', price: 849 },
                  { name: 'Bridal Package', price: 7999 },
                ].map(item => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setAmount(item.price.toString());
                      setItems(item.name);
                    }}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-slate-200 border border-slate-800 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 font-medium"
                  >
                    <span>{item.name}</span>
                    <span className="font-mono font-bold text-amber-400">₹{item.price}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddPurchase} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bill / Invoice Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={billNumber}
                    onChange={(e) => setBillNumber(e.target.value)}
                    placeholder="e.g. INV-2026-1045"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono uppercase"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Must be unique to avoid duplicate records
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bill Amount (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-slate-400 font-mono font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="any"
                      required
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 2450"
                      className="w-full pl-7 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Items Purchased / Notes
                </label>
                <input
                  type="text"
                  value={items}
                  onChange={(e) => setItems(e.target.value)}
                  placeholder="e.g. Hair Cut & Beard Trimming, O3 Detan"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={addPurchaseLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{addPurchaseLoading ? 'Recording Bill...' : 'Record Purchase & Award Coins'}</span>
              </button>
            </form>
          </div>

        </div>
      )}

      {/* Prize Claim Verification & Management Desk */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Gift className="w-4 h-4" />
              <span>Prize Claim Verification Desk</span>
            </div>
            <h3 className="font-display font-bold text-xl text-white mt-1">
              Verify & Redeem Monthly ₹200 Customer Prize
            </h3>
            <p className="text-xs text-slate-400">
              Customer presents their digital claim code or QR code to collect prize at the salon counter
            </p>
          </div>

          <button
            onClick={() => {
              setScannerForPrize(true);
              setIsScannerOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 border border-slate-700"
          >
            <Camera className="w-4 h-4" />
            <span>Scan Prize QR Code</span>
          </button>
        </div>

        {claimSuccessMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{claimSuccessMessage}</span>
          </div>
        )}

        {claimErrorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{claimErrorMessage}</span>
          </div>
        )}

        <form onSubmit={handleVerifyPrizeClaim} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-6">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Enter Claim Code / Scanned Text *
            </label>
            <input
              type="text"
              required
              value={claimCodeInput}
              onChange={(e) => setClaimCodeInput(e.target.value)}
              placeholder="e.g. CLAIM-SEP26-7A9B"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono uppercase"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Redemption Reference (Optional)
            </label>
            <input
              type="text"
              value={claimBillRef}
              onChange={(e) => setClaimBillRef(e.target.value)}
              placeholder="e.g. CASH / BILL-102"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={claimLoading}
              className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50 shadow-md"
            >
              {claimLoading ? 'Verifying...' : 'Verify & Mark Claimed'}
            </button>
          </div>
        </form>

        {/* Prizes Archive Table */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            All Awarded Monthly Prizes ({allPrizes.length})
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Month</th>
                  <th className="py-2.5 px-3">Winner</th>
                  <th className="py-2.5 px-3">Claim Code</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {allPrizes.map(p => (
                  <tr key={p.id} className="hover:bg-slate-950/40">
                    <td className="py-3 px-3 font-semibold text-white">{p.monthLabel}</td>
                    <td className="py-3 px-3 text-slate-200">{p.winnerName} (+91 {p.winnerMobile})</td>
                    <td className="py-3 px-3 font-mono text-amber-400 font-bold">{p.claimCode}</td>
                    <td className="py-3 px-3 font-mono text-white font-bold">₹{p.prizeAmount}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.status === 'claimed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {p.status === 'claimed' ? 'Claimed' : 'Unclaimed'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {p.status === 'unclaimed' && (
                        <button
                          onClick={() => setClaimCodeInput(p.claimCode)}
                          className="text-[11px] text-amber-400 hover:underline font-semibold cursor-pointer"
                        >
                          Fill Code to Redeem
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Complete Customer Directory with Status & Verification Tools */}
      <div id="customer-directory" className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-display font-bold text-xl text-white">
              Customer Directory & Account Status
            </h3>
            <p className="text-xs text-slate-400">
              Manage customer IDs, approve pending accounts, and view lifetime records
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setDirectoryFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                directoryFilter === 'all'
                  ? 'bg-slate-800 text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({data.customers.length})
            </button>
            <button
              onClick={() => setDirectoryFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                directoryFilter === 'pending'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Pending</span>
              {pendingCustomers.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  directoryFilter === 'pending' ? 'bg-slate-950 text-amber-400' : 'bg-amber-400/20 text-amber-300'
                }`}>
                  {pendingCustomers.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setDirectoryFilter('verified')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                directoryFilter === 'verified'
                  ? 'bg-slate-800 text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Verified ({verifiedCustomers.length})
            </button>
          </div>
        </div>

        {/* Search Field */}
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={customerSearchQuery}
            onChange={(e) => setCustomerSearchQuery(e.target.value)}
            placeholder="Search by name, mobile, or Customer ID..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
          />
        </div>

        {/* Customer Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                <th className="py-3 px-3">Customer ID</th>
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Mobile</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Last Login</th>
                <th className="py-3 px-3 text-right">This Month</th>
                <th className="py-3 px-3 text-right">Coins</th>
                <th className="py-3 px-3 text-right">Lifetime</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredCustomers.map(c => {
                const isPending = c.verificationStatus === 'pending';
                return (
                  <tr key={c.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-amber-400">
                      {c.customerIdCode}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-white">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 font-mono">
                      +91 {c.mobile}
                    </td>
                    <td className="py-3.5 px-3">
                      {c.verificationStatus === 'verified' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <Check className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                      {c.lastLogin
                        ? new Date(c.lastLogin).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })
                        : 'Never'}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-amber-400">
                      ₹{c.monthSpend.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-semibold text-slate-200">
                      {c.coins}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-400">
                      ₹{c.totalSpend.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {isPending ? (
                          <button
                            onClick={() => handleCustomerVerification(c.id, 'verified')}
                            disabled={verifyActionLoading === c.id}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] cursor-pointer shadow"
                          >
                            Approve
                          </button>
                        ) : null}

                        <button
                          onClick={async () => {
                            const res = await api.lookupCustomer(c.id);
                            setScannedCustomerData(res);
                            setSelectedCustomerId(c.id);
                            window.scrollTo({ top: 350, behavior: 'smooth' });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px] font-semibold cursor-pointer"
                        >
                          Bill / History
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
        title={scannerForPrize ? 'Scan Prize Claim QR Code' : 'Scan Customer QR Code'}
      />

    </div>
  );
};
