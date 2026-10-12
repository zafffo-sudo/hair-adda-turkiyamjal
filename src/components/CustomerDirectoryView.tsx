import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { OwnerDashboardData, User, Purchase, MonthlyPrize } from '../types';
import { Users, Search, ShoppingBag, PlusCircle, Calendar, ArrowUpRight, Check, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CustomerDirectoryViewProps {
  onSelectCustomerToAddBill: (customerId: string) => void;
}

export const CustomerDirectoryView: React.FC<CustomerDirectoryViewProps> = ({
  onSelectCustomerToAddBill,
}) => {
  const [customers, setCustomers] = useState<OwnerDashboardData['customers']>([]);
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [verifyLoadingId, setVerifyLoadingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const fetchCustomers = () => {
    setLoading(true);
    api.getOwnerDashboard()
      .then(res => setCustomers(res.customers))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleVerify = async (customerId: string, status: 'verified' | 'pending' | 'rejected') => {
    setVerifyLoadingId(customerId);
    setSuccessToast(null);
    try {
      const res = await api.verifyCustomer(customerId, status);
      setSuccessToast(res.message);
      fetchCustomers();
    } catch (err: any) {
      alert(err.message || 'Verification update failed');
    } finally {
      setVerifyLoadingId(null);
    }
  };

  const pendingCount = customers.filter(c => c.verificationStatus === 'pending').length;
  const verifiedCount = customers.filter(c => c.verificationStatus === 'verified').length;

  const filtered = customers.filter(c => {
    if (filter === 'pending' && c.verificationStatus !== 'pending') return false;
    if (filter === 'verified' && c.verificationStatus !== 'verified') return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.mobile.includes(q) ||
      (c.customerIdCode && c.customerIdCode.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Customer Account Approvals & Records</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-white mt-0.5">
            Customer Directory & Verification
          </h2>
          <p className="text-xs text-slate-400">
            Registered loyalty members, verification status, lifetime spending & coin balances
          </p>
        </div>

        {/* Filter and Search */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === 'all' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({customers.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                filter === 'pending' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Pending</span>
              {pendingCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  filter === 'pending' ? 'bg-slate-950 text-amber-400' : 'bg-amber-400/20 text-amber-300'
                }`}>
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === 'verified' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Verified ({verifiedCount})
            </button>
          </div>

          <div className="relative sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, name, or mobile..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                <th className="py-3 px-3">Customer ID</th>
                <th className="py-3 px-3">Customer Name</th>
                <th className="py-3 px-3">Mobile</th>
                <th className="py-3 px-3">ID Status</th>
                <th className="py-3 px-3">Last Login</th>
                <th className="py-3 px-3 text-right">This Month Spend</th>
                <th className="py-3 px-3 text-right">Coins</th>
                <th className="py-3 px-3 text-right">Total Lifetime Spend</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.map(c => {
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
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <Check className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
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
                    <td className="py-3.5 px-3 text-right font-mono text-emerald-400">
                      ₹{c.totalSpend.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {isPending && (
                          <button
                            onClick={() => handleVerify(c.id, 'verified')}
                            disabled={verifyLoadingId === c.id}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] cursor-pointer shadow transition-all"
                          >
                            {verifyLoadingId === c.id ? 'Approving...' : 'Approve ID'}
                          </button>
                        )}
                        <button
                          onClick={() => onSelectCustomerToAddBill(c.id)}
                          className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Record Bill
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
    </div>
  );
};
