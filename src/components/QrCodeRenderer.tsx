import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QrCodeRendererProps {
  value: string;
  size?: number;
  className?: string;
  showCodeText?: boolean;
}

export const QrCodeRenderer: React.FC<QrCodeRendererProps> = ({
  value,
  size = 200,
  className = '',
  showCodeText = true,
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!value) return;

    QRCode.toDataURL(value, {
      width: size,
      margin: 2,
      color: {
        dark: '#0B192C', // Deep navy
        light: '#FFFFFF', // Pure crisp white
      },
      errorCorrectionLevel: 'M',
    })
      .then(url => {
        setDataUrl(url);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to generate QR code:', err);
        setError('QR Generation failed');
      });
  }, [value, size]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-rose-400">
        <span>{error}</span>
        <code className="text-[10px] text-slate-400 mt-1 font-mono">{value}</code>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="p-3 bg-white rounded-xl shadow-lg border border-amber-400/40">
        {dataUrl ? (
          <img
            src={dataUrl}
            alt={`QR code for ${value}`}
            width={size}
            height={size}
            className="block"
          />
        ) : (
          <div
            style={{ width: size, height: size }}
            className="bg-slate-100 flex items-center justify-center text-xs text-slate-400 animate-pulse"
          >
            Generating QR...
          </div>
        )}
      </div>

      {showCodeText && (
        <div className="mt-2 text-center">
          <div className="text-[11px] font-mono tracking-wider font-semibold text-amber-400 bg-slate-900/80 px-2.5 py-0.5 rounded border border-slate-800">
            {value}
          </div>
        </div>
      )}
    </div>
  );
};
