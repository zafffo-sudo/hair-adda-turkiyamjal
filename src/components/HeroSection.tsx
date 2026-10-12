import React from 'react';
import { Star, ArrowRight, ShieldCheck, Tag, Crown, Camera, Coins, MapPin } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';
import { useSalon } from '../context/SalonContext';

interface HeroSectionProps {
  onOpenWallet: () => void;
  onExploreServices: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenWallet, onExploreServices }) => {
  const { openBookingForService } = useSalon();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-neutral-800 bg-neutral-950">
      {/* Subtle radial ambient background light */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full"
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Brand, Headline, Value Props */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Trust marker: Google Rating + Turkayamjal (clean unboxed text with typographic separator) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-400">
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>4.8 Rating</span>
              </span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="text-neutral-300">240 Google Reviews</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="flex items-center gap-1 text-neutral-400">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Turkayamjal X Road</span>
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-100 leading-[1.1]">
                Style, Beauty <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                  & Elegance.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl pt-2">
                Hair Adda Unisex Salon delivers master haircuts, bespoke styling, glowing hair spa & grooming for men, women & kids.
              </p>
            </div>

            {/* Promotional Key Anchors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-100">Flat 10% OFF</div>
                  <div className="text-xs text-neutral-400 mt-0.5">Har service par instant discount</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-100">Membership ₹499</div>
                  <div className="text-xs text-neutral-400 mt-0.5">15% off overall bill (1 yr)</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-100">Reel Collab</div>
                  <div className="text-xs text-neutral-400 mt-0.5">Upload reel & get 15% off</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <button
                onClick={() => openBookingForService()}
                className="px-6 py-3.5 rounded-xl font-semibold text-sm text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Book Salon Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenWallet}
                className="px-5 py-3.5 rounded-xl font-semibold text-sm text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/70 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Visit Karo, Coins Kamao!</span>
              </button>
            </div>

            {/* Loyalty & Demo Notice banner */}
            <div className="flex items-center gap-2 text-xs text-neutral-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                1 Coin = ₹1 · 100 coins hone par use karo. <span className="text-neutral-500">Demo mode – data sirf is device me save hota hai.</span>
              </span>
            </div>

          </div>

          {/* Right Column: Hero Salon Photo Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
              <img
                src="/src/assets/images/hair_adda_hero_salon_1791829260638.jpg"
                alt="Hair Adda Unisex Salon interior in Turkayamjal"
                referrerPolicy="no-referrer"
                className="w-full h-[360px] sm:h-[440px] object-cover object-center"
              />
              {/* Measured contrast scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/30 to-transparent" />

              {/* Bottom Card Overlay content */}
              <div className="absolute bottom-0 inset-x-0 p-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-amber-300 font-medium">
                  <span className="uppercase tracking-wider font-semibold">Turkayamjal Branch</span>
                  <span className="text-neutral-300">{SALON_INFO.timings}</span>
                </div>
                <div className="text-neutral-100 font-display font-bold text-lg">
                  Hair Adda Unisex Salon
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">
                  Beside Bank Of Baroda, Turkayamjal X Road. Expert stylists, premium grooming products & welcoming hospitality.
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <a
                    href={SALON_INFO.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
                  >
                    <span>📍 Get Directions on Map</span>
                  </a>
                  <a
                    href={SALON_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                  >
                    WhatsApp: {SALON_INFO.ownerPhoneDisplay}
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Floating Stat card */}
            <div className="absolute -top-4 -left-4 sm:-left-6 hidden sm:flex items-center gap-3 p-3.5 rounded-xl bg-neutral-900/95 backdrop-blur-md border border-neutral-700/80 shadow-xl">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-display font-extrabold text-base">
                ₹
              </div>
              <div>
                <div className="text-xs font-semibold text-neutral-100">Prices in ₹ (INR)</div>
                <div className="text-[11px] text-amber-400/90 font-medium">Flat 10% OFF all services</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
