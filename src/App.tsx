import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { CustomerDashboard } from './components/CustomerDashboard';
import { OwnerDashboard } from './components/OwnerDashboard';
import { LeaderboardView } from './components/LeaderboardView';
import { PrizesView } from './components/PrizesView';
import { CustomerDirectoryView } from './components/CustomerDirectoryView';
import { SalonMenuView } from './components/SalonMenuView';
import { ContactView } from './components/ContactView';
import { CustomerQrModal } from './components/CustomerQrModal';
import { QrScannerModal } from './components/QrScannerModal';
import { OwnerLoginModal } from './components/OwnerLoginModal';
import { ShareAppModal } from './components/ShareAppModal';
import { SALON_INFO } from './data/salonData';
import {
  Trophy,
  Coins,
  QrCode,
  LayoutDashboard,
  Gift,
  Users,
  Camera,
  Scissors,
  MapPin,
  Sparkles,
  Lock,
  Share2,
  Download,
} from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, isOwner, isCustomer, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'menu' | 'leaderboard' | 'prizes' | 'customers' | 'contact'>('dashboard');
  const [isCustomerQrOpen, setIsCustomerQrOpen] = useState(false);
  const [isOwnerScannerOpen, setIsOwnerScannerOpen] = useState(false);
  const [isOwnerLoginModalOpen, setIsOwnerLoginModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <div className="text-xs text-slate-400 font-medium">Loading Hair Adda Loyalty Rewards...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950">
      
      {/* Top Banner: Hair Adda Key Offers & Rules + Direct Install / Share Trigger */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 text-xs font-bold py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
          <span>✂️ Hair Adda {SALON_INFO.branch}</span>
          <span aria-hidden="true">·</span>
          <span>🎁 Flat 10% OFF</span>
          <span aria-hidden="true">·</span>
          <span>👑 Membership ₹499 (15% OFF)</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">🪙 ₹5,000 = 250 Coins · ₹10,000 = 600 Coins</span>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-1 bg-slate-950 text-amber-400 px-2 py-0.5 rounded-full text-[11px] font-extrabold hover:bg-slate-900 transition-colors cursor-pointer shadow-sm ml-1"
          >
            <Download className="w-3 h-3 stroke-[2.5]" />
            <span>Install / Share App</span>
          </button>
        </div>
      </div>

      {/* Main Top Navigation */}
      <Navbar
        onOpenMyQr={() => setIsCustomerQrOpen(true)}
        onOpenScanner={() => setIsOwnerScannerOpen(true)}
        onSelectTab={setActiveTab}
        activeTab={activeTab}
        onOpenOwnerModal={() => setIsOwnerLoginModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Content Area */}
      <main className="flex-1 pb-16 sm:pb-8">
        {!user ? (
          <LoginView onOpenOwnerModal={() => setIsOwnerLoginModalOpen(true)} />
        ) : activeTab === 'menu' ? (
          <SalonMenuView />
        ) : activeTab === 'leaderboard' ? (
          <LeaderboardView />
        ) : activeTab === 'prizes' ? (
          <PrizesView />
        ) : activeTab === 'contact' ? (
          <ContactView />
        ) : activeTab === 'customers' && isOwner ? (
          <CustomerDirectoryView
            onSelectCustomerToAddBill={() => {
              setActiveTab('dashboard');
            }}
          />
        ) : isOwner ? (
          <OwnerDashboard />
        ) : (
          <CustomerDashboard />
        )}
      </main>

      {/* Modals */}
      {user && isCustomer && (
        <CustomerQrModal
          isOpen={isCustomerQrOpen}
          onClose={() => setIsCustomerQrOpen(false)}
          customer={user}
        />
      )}

      {user && isOwner && (
        <QrScannerModal
          isOpen={isOwnerScannerOpen}
          onClose={() => setIsOwnerScannerOpen(false)}
          onScanSuccess={(decoded) => {
            setIsOwnerScannerOpen(false);
            setActiveTab('dashboard');
          }}
          title="Scan Customer QR Code"
        />
      )}

      {/* Restricted Owner Authentication Modal */}
      <OwnerLoginModal
        isOpen={isOwnerLoginModalOpen}
        onClose={() => setIsOwnerLoginModalOpen(false)}
        onSuccess={() => setActiveTab('dashboard')}
      />

      {/* App Publish & Share Link Modal */}
      <ShareAppModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Mobile Bottom Navigation Bar */}
      {user && (
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-2 flex items-center justify-around text-[10px] font-semibold">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'dashboard' ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'menu' ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>Rates</span>
          </button>

          {isCustomer && (
            <button
              onClick={() => setIsCustomerQrOpen(true)}
              className="flex flex-col items-center gap-0.5 text-amber-400 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md -mt-3 border-2 border-slate-950">
                <QrCode className="w-4 h-4" />
              </div>
              <span>My QR</span>
            </button>
          )}

          {isOwner && (
            <button
              onClick={() => setIsOwnerScannerOpen(true)}
              className="flex flex-col items-center gap-0.5 text-amber-400 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md -mt-3 border-2 border-slate-950">
                <Camera className="w-4 h-4" />
              </div>
              <span>Scan QR</span>
            </button>
          )}

          {isOwner && (
            <button
              onClick={() => setActiveTab('customers')}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                activeTab === 'customers' ? 'text-amber-400' : 'text-slate-400'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Members</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'leaderboard' ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Ranks</span>
          </button>

          <button
            onClick={() => setActiveTab('prizes')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'prizes' ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Prizes</span>
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-amber-400 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </nav>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="font-display font-bold text-slate-300">Hair Adda Unisex Salon</span>
            <span className="text-slate-600">·</span>
            <span>{SALON_INFO.branch} X Road</span>
            <span className="text-slate-600">·</span>
            <span>Franchise: {SALON_INFO.franchiseContact}</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-bold transition-colors flex items-center gap-1 cursor-pointer bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
              title="Share App Link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Publish / Share Link & QR</span>
            </button>
            {!user && (
              <>
                <span className="text-slate-700">·</span>
                <button
                  onClick={() => setIsOwnerLoginModalOpen(true)}
                  className="text-slate-600 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Owner Access"
                >
                  <Lock className="w-3 h-3" />
                  <span>Owner Admin Portal</span>
                </button>
              </>
            )}
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
