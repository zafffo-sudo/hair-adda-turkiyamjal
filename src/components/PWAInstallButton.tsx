import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Share2, PlusSquare, ArrowUpRight } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'prominent' | 'compact';
  onOpenShareModal?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'navbar',
  onOpenShareModal,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already installed and running standalone, provide Share button instead
  if (isInstalled) {
    if (variant === 'navbar') {
      return (
        <button
          onClick={onOpenShareModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 text-xs font-semibold transition-all cursor-pointer"
          title="Share App Link"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share App</span>
        </button>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else if (onOpenShareModal) {
      onOpenShareModal();
    } else {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {variant === 'navbar' ? (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer animate-pulse-subtle"
          title="Install Hair Adda App on Phone"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Install App</span>
        </button>
      ) : variant === 'prominent' ? (
        <button
          onClick={handleInstallClick}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 transition-all cursor-pointer w-full sm:w-auto"
        >
          <Smartphone className="w-4 h-4 stroke-[2.5]" />
          <span>Install Hair Adda App on Phone</span>
        </button>
      ) : (
        <button
          onClick={handleInstallClick}
          className="p-2 rounded-xl bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-colors cursor-pointer"
          title="Install App"
        >
          <Download className="w-4 h-4" />
        </button>
      )}

      {/* iOS Safari / Universal Installation Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm"
            onClick={() => setShowIOSModal(false)}
          />

          <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 shadow-2xl z-10 space-y-5 text-center">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto">
              <Smartphone className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-xl text-white">
                Phone Par App Kaise Install Karein?
              </h3>
              <p className="text-xs text-slate-400">
                Yeh ek Progressive Web App (PWA) hai, playstore ke bina sidhe install hoti hai!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-[11px] shrink-0">
                  1
                </span>
                <div className="text-slate-300">
                  Browser ke <strong className="text-amber-400">Share</strong> (📤 Safari) ya <strong className="text-amber-400">3-Dots Menu</strong> (⋮ Chrome) par tap karein.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-[11px] shrink-0">
                  2
                </span>
                <div className="text-slate-300">
                  List me se <strong className="text-white">"Add to Home Screen"</strong> ya <strong className="text-white">"Install App"</strong> select karein.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-[11px] shrink-0">
                  3
                </span>
                <div className="text-slate-300">
                  <strong className="text-emerald-400">Add / Install</strong> confirm karein — Hair Adda app aapki home screen par app icon ke roop me add ho jayegi!
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowIOSModal(false);
                if (onOpenShareModal) onOpenShareModal();
              }}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Link Copy Ya Share Karein
            </button>
          </div>
        </div>
      )}
    </>
  );
};
