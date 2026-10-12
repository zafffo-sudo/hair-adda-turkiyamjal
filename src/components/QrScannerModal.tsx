import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, Keyboard, AlertCircle, Sparkles } from 'lucide-react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
  title?: string;
  placeholderText?: string;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  title = 'Scan Customer QR Code',
  placeholderText = 'e.g. DKN-CUST-9876543210 or 9876543210',
}) => {
  const [manualInput, setManualInput] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const elementId = 'qr-reader-container';

  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      return;
    }

    setCameraError(null);
    let isCancelled = false;

    // Small delay to ensure modal element is in DOM
    const timer = setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode(elementId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 220, height: 220 },
          },
          (decodedText) => {
            if (!isCancelled) {
              stopScanner();
              onScanSuccess(decodedText);
            }
          },
          () => {
            // Ignore scan parse frame drops
          }
        );

        if (!isCancelled) {
          setIsScanning(true);
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.warn('Camera scanner initialization failed:', err);
          setCameraError(
            'Camera access unavailable or blocked. You can use manual entry or demo customer buttons below.'
          );
        }
      }
    }, 150);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      stopScanner();
    };
  }, [isOpen]);

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current?.clear();
          scannerRef.current = null;
          setIsScanning(false);
        })
        .catch(() => {
          scannerRef.current = null;
          setIsScanning(false);
        });
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    stopScanner();
    onScanSuccess(manualInput.trim());
    setManualInput('');
  };

  const handleQuickSelect = (value: string) => {
    stopScanner();
    onScanSuccess(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs transition-opacity"
        onClick={() => {
          stopScanner();
          onClose();
        }}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden z-10 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-100">
                {title}
              </h3>
              <p className="text-[11px] text-slate-400">
                Live camera scanner & manual entry
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Viewport */}
        <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 min-h-[220px] flex items-center justify-center">
          <div id={elementId} className="w-full" />

          {cameraError && (
            <div className="p-4 text-center space-y-2">
              <AlertCircle className="w-6 h-6 text-amber-400 mx-auto" />
              <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
                {cameraError}
              </p>
            </div>
          )}

          {!isScanning && !cameraError && (
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <Camera className="w-4 h-4 animate-spin text-amber-400" />
              <span>Starting camera scanner...</span>
            </div>
          )}
        </div>

        {/* Manual Input Form */}
        <form onSubmit={handleManualSubmit} className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Keyboard className="w-3.5 h-3.5 text-amber-400" />
            <span>Enter Customer QR or Mobile:</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder={placeholderText}
              className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0 shadow-sm"
            >
              Identify
            </button>
          </div>
        </form>

        {/* Quick Demo Simulator Buttons */}
        <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Quick Test Customers:</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickSelect('9876543210')}
              className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-left text-[11px] transition-colors cursor-pointer"
            >
              <div className="font-semibold text-slate-200 truncate">Amit Kumar</div>
              <div className="text-[10px] text-amber-400 font-mono">#1 Rank</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect('9876543211')}
              className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-left text-[11px] transition-colors cursor-pointer"
            >
              <div className="font-semibold text-slate-200 truncate">Priya Patel</div>
              <div className="text-[10px] text-slate-400 font-mono">#2 Rank</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect('9876543213')}
              className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-left text-[11px] transition-colors cursor-pointer"
            >
              <div className="font-semibold text-slate-200 truncate">Sunita Rao</div>
              <div className="text-[10px] text-emerald-400 font-mono">₹200 Winner</div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
