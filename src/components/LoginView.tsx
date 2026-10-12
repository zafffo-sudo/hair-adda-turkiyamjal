import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SALON_INFO } from '../data/salonData';
import {
  Lock,
  User,
  ShieldCheck,
  Sparkles,
  Trophy,
  QrCode,
  ArrowRight,
  Star,
  MapPin,
  Tag,
  Crown,
  Camera,
  Coins,
  CheckCircle2,
} from 'lucide-react';

interface LoginViewProps {
  onOpenOwnerModal?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onOpenOwnerModal }) => {
  const { login, register, quickDemoLogin } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);

  // Form states
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registrationNotice, setRegistrationNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRegistrationNotice(null);
    setLoading(true);

    try {
      if (isRegisterMode) {
        await register(name, mobile, password);
      } else {
        await login(mobile, password, 'customer');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Hair Adda Brand & Loyalty Showcase */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Trust and location markers */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{SALON_INFO.rating} Rating</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">({SALON_INFO.reviewCount} Google Reviews)</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>{SALON_INFO.branch} X Road</span>
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
              HA · {SALON_INFO.tagline}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Hair Adda <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                Customer Loyalty & Rewards
              </span>
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              Sri Sai Nagar, beside Bank Of Baroda, Turkayamjal. Har visit aur haircut par reward coins kamao, monthly leaderboard me rank paao aur ₹200 prize jeeto!
            </p>
          </div>

          {/* Salon Key Offers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                <Tag className="w-3.5 h-3.5" />
                <span>Flat 10% OFF</span>
              </div>
              <div className="text-xs text-slate-300">On all salon services</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                <Crown className="w-3.5 h-3.5" />
                <span>Membership ₹499</span>
              </div>
              <div className="text-xs text-slate-300">15% off overall bill (1 yr)</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                <Camera className="w-3.5 h-3.5" />
                <span>Reel Collab</span>
              </div>
              <div className="text-xs text-slate-300">15% off on next visit</div>
            </div>
          </div>

          {/* Loyalty Coins & ₹200 Prize highlight */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold shrink-0 shadow-md">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-xs">
              <div className="font-bold text-white text-sm">
                Visit karo, Coins kamao! · #1 Customer Wins ₹200
              </div>
              <p className="text-slate-300 leading-relaxed">
                Monthly spend ₹5,000 = 250 coins · ₹10,000 = 600 coins total · 1 Coin = ₹1 · Har mahine ka top spender jeetega ₹200 in-store prize!
              </p>
            </div>
          </div>

          {/* Test Customer Accounts for Quick Demo Testing (Customers Only) */}
          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Test Customer Accounts:
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => quickDemoLogin('customer', '9876543210')}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-slate-200 transition-colors cursor-pointer"
              >
                <div className="text-[10px] text-amber-400 font-bold uppercase">🥇 #1 Rank</div>
                <div className="text-xs font-semibold truncate">Amit (₹12k)</div>
              </button>

              <button
                type="button"
                onClick={() => quickDemoLogin('customer', '9876543211')}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-slate-200 transition-colors cursor-pointer"
              >
                <div className="text-[10px] text-slate-400 font-bold uppercase">🥈 Tier 1</div>
                <div className="text-xs font-semibold truncate">Priya (₹6.2k)</div>
              </button>

              <button
                type="button"
                onClick={() => quickDemoLogin('customer', '9876543213')}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-slate-200 transition-colors cursor-pointer"
              >
                <div className="text-[10px] text-emerald-400 font-bold uppercase">🏆 Winner</div>
                <div className="text-xs font-semibold truncate">Sunita (₹200)</div>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Customer Login Card (Strictly Customer Only) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
          
          {/* Card Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <User className="w-3.5 h-3.5" />
              <span>Customer Portal</span>
            </div>
            <h2 className="font-display font-bold text-2xl text-white pt-1">
              {isRegisterMode ? 'Register New Customer' : 'Customer Login'}
            </h2>
            <p className="text-xs text-slate-400">
              {isRegisterMode
                ? 'Sign up with your 10-digit mobile number (No OTP required). ID starts as Pending until verified.'
                : 'Enter mobile number & password to access your loyalty QR card & coins.'}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Customer Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Registration Name Field */}
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {/* Mobile Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mobile Number (10 digits) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-semibold font-mono">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full pl-13 pr-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono tracking-wider"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {isRegisterMode
                  ? 'Set a 4+ character password for your account'
                  : 'Enter your password (no OTP required)'}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <span>
                {loading
                  ? 'Processing...'
                  : isRegisterMode
                  ? 'Register & Get Loyalty QR'
                  : 'Login to Customer Dashboard'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Registration toggle */}
          <div className="pt-2 border-t border-slate-800/80 text-center space-y-3">
            {isRegisterMode ? (
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(false);
                  setError(null);
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
              >
                Already registered? Sign In
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(true);
                  setError(null);
                }}
                className="text-xs text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
              >
                New customer? <strong className="text-amber-400">Register in 10 seconds</strong>
              </button>
            )}

            {/* Discrete Staff / Owner Gateway Link (No passwords or controls shown) */}
            {onOpenOwnerModal && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenOwnerModal}
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
                  title="Owner Access"
                >
                  <Lock className="w-3 h-3" />
                  <span>Salon Staff / Owner Portal</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
