import React from 'react';
import { User } from '../types';
import { QrCodeRenderer } from './QrCodeRenderer';
import { X, Smartphone, ShieldCheck, Sun } from 'lucide-react';

interface CustomerQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: User;
}

export const CustomerQrModal: React.FC<CustomerQrModalProps> = ({ isOpen, onClose, customer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-2xl shadow-2xl p-6 overflow-hidden z-10 space-y-5 text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Customer Badge */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Customer Loyalty Pass</span>
            </span>
            <span className="font-mono text-xs font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded">
              {customer.customerIdCode || `HA-ID-${customer.mobile.slice(-4)}`}
            </span>
          </div>
          <h3 className="font-display font-bold text-xl text-slate-100 pt-1">
            {customer.name}
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            +91 {customer.mobile}
          </p>
          <div className="pt-0.5">
            {customer.verificationStatus === 'verified' ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Account · Hair Adda</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400">
                <span>⏳ ID Pending Salon Approval</span>
              </span>
            )}
          </div>
        </div>

        {/* High Contrast QR Code Container */}
        <div className="py-2 flex justify-center">
          <QrCodeRenderer value={customer.qrCode} size={230} showCodeText={true} />
        </div>

        {/* Counter Instructions */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-amber-400 font-semibold text-[11px]">
            <Sun className="w-3.5 h-3.5" />
            <span>Increase screen brightness for quick counter scanning</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Dukan par billing karte waqt ye QR code shopkeeper ko dikhayein.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
        >
          Close Pass
        </button>

      </div>
    </div>
  );
};
