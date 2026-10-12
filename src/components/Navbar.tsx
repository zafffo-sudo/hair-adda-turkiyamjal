import React from 'react';
import { useAuth } from '../context/AuthContext';
import { SALON_INFO } from '../data/salonData';
import { Coins, QrCode, LogOut, Shield, User, Camera, Lock, Users, Sparkles, Scissors, MapPin, Share2 } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  onOpenMyQr?: () => void;
  onOpenScanner?: () => void;
  onSelectTab?: (tab: 'dashboard' | 'menu' | 'leaderboard' | 'prizes' | 'customers' | 'contact') => void;
  activeTab?: string;
  onOpenOwnerModal?: () => void;
  onOpenShareModal?: () => void;
  pendingApprovalsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMyQr,
  onOpenScanner,
  onSelectTab,
  activeTab = 'dashboard',
  onOpenOwnerModal,
  onOpenShareModal,
  pendingApprovalsCount = 0,
}) => {
  const { user, isOwner, isCustomer, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand Lockup: Hair Adda */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-display font-black text-lg shadow-md shadow-amber-500/20">
            HA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white uppercase">
                Hair Adda <span className="text-amber-400 text-sm font-semibold capitalize">({SALON_INFO.branch})</span>
              </span>
              {user && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    isOwner
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {isOwner ? '👑 Owner Admin' : 'Customer'}
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
              {SALON_INFO.tagline} · Closes 10:00 PM
            </div>
          </div>
        </div>

        {/* Navigation Tabs (when logged in) */}
        {user && onSelectTab && (
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800 text-amber-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => onSelectTab('menu')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'menu'
                  ? 'bg-slate-800 text-amber-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Salon Menu (Rates)
            </button>

            <button
              onClick={() => onSelectTab('leaderboard')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'leaderboard'
                  ? 'bg-slate-800 text-amber-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Leaderboard
            </button>

            <button
              onClick={() => onSelectTab('prizes')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'prizes'
                  ? 'bg-slate-800 text-amber-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ₹200 Prizes
            </button>

            {isOwner && (
              <button
                onClick={() => onSelectTab('customers')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer relative flex items-center gap-1.5 ${
                  activeTab === 'customers'
                    ? 'bg-slate-800 text-amber-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Customers & Approvals</span>
                {pendingApprovalsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            )}

            <button
              onClick={() => onSelectTab('contact')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-slate-800 text-amber-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Location & Contact
            </button>
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Universal Install App Button */}
          <PWAInstallButton variant="navbar" onOpenShareModal={onOpenShareModal} />

          {/* Share App Link Button */}
          {onOpenShareModal && (
            <button
              onClick={onOpenShareModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 text-xs font-semibold transition-colors cursor-pointer"
              title="Share / Publish App Link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Link</span>
            </button>
          )}

          {user ? (
            <>
              {/* Customer QR trigger */}
              {isCustomer && onOpenMyQr && (
                <button
                  onClick={onOpenMyQr}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/10 transition-all cursor-pointer whitespace-nowrap"
                  title="Show QR Code to Salon Stylist"
                >
                  <QrCode className="w-4 h-4" />
                  <span className="hidden sm:inline">My QR Pass</span>
                </button>
              )}

              {/* Owner Scanner trigger */}
              {isOwner && onOpenScanner && (
                <button
                  onClick={onOpenScanner}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/10 transition-all cursor-pointer whitespace-nowrap"
                  title="Scan Customer QR Code"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scan QR Code</span>
                </button>
              )}

              {/* User Info & Logout */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-semibold text-slate-200 truncate max-w-[130px]">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {user.role === 'owner' ? 'Administrator' : `+91 ${user.mobile}`}
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
                  title="Log out"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {/* Discreet Owner Gateway button */}
              {onOpenOwnerModal && (
                <button
                  onClick={onOpenOwnerModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-amber-400 rounded-xl border border-slate-800 transition-colors cursor-pointer"
                  title="Owner Portal"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Staff / Owner Portal</span>
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
